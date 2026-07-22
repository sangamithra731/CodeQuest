const prisma = require("../config/db");
const { AppError } = require("../middlewares/errorHandler");

const PASS_THRESHOLD = 80; // percent

function calculateStreak(lastActiveAt, currentStreak) {
  if (!lastActiveAt) return 1;

  const now = new Date();
  const last = new Date(lastActiveAt);
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return currentStreak; // already active today
  if (diffDays === 1) return currentStreak + 1; // consecutive day
  return 1; // streak broken, restart
}

function calculateLevel(xp) {
  // Every 250 XP = 1 level, minimum level 1
  return Math.max(1, Math.floor(xp / 250) + 1);
}

async function getLanguageCatalog() {
  return prisma.language.findMany({
    orderBy: { order: "asc" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { levels: { orderBy: { order: "asc" }, select: { id: true, slug: true, title: true, order: true, xpReward: true } } },
      },
    },
  });
}

async function getLanguageWithProgress(languageSlug, userId) {
  const language = await prisma.language.findUnique({
    where: { slug: languageSlug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          levels: {
            orderBy: { order: "asc" },
            include: {
              progress: { where: { userId } },
              questions: { select: { id: true } }, // just counts, no answers leaked
            },
          },
        },
      },
    },
  });

  if (!language) throw new AppError("Language not found.", 404);

  // Flatten levels in order, work out lock state sequentially
  let previousCompleted = true;
  const modules = language.modules.map((mod) => ({
    ...mod,
    levels: mod.levels.map((lvl) => {
      const userProgress = lvl.progress[0] || null;
      const unlocked = previousCompleted;
      previousCompleted = Boolean(userProgress?.completed);

      return {
        id: lvl.id,
        slug: lvl.slug,
        title: lvl.title,
        order: lvl.order,
        xpReward: lvl.xpReward,
        questionCount: lvl.questions.length,
        unlocked,
        completed: Boolean(userProgress?.completed),
        bestScore: userProgress?.bestScore || 0,
      };
    }),
  }));

  return { ...language, modules };
}

async function getLevelForStudy(levelId, userId) {
  const level = await prisma.level.findUnique({
    where: { id: levelId },
    include: {
      module: { include: { language: true } },
      progress: { where: { userId } },
    },
  });

  if (!level) throw new AppError("Level not found.", 404);

  return {
    id: level.id,
    title: level.title,
    theory: level.theory,
    examples: level.examples,
    practice: level.practice,
    xpReward: level.xpReward,
    languageSlug: level.module.language.slug,
    moduleTitle: level.module.title,
    bestScore: level.progress[0]?.bestScore || 0,
    completed: Boolean(level.progress[0]?.completed),
  };
}

async function recordLevelAttempt({ userId, levelId, scorePercent }) {
  const level = await prisma.level.findUnique({ where: { id: levelId } });
  if (!level) throw new AppError("Level not found.", 404);

  const passed = scorePercent >= PASS_THRESHOLD;

  const existing = await prisma.progress.findUnique({
    where: { userId_levelId: { userId, levelId } },
  });

  const bestScore = Math.max(scorePercent, existing?.bestScore || 0);
  const wasAlreadyCompleted = Boolean(existing?.completed);

  const progress = await prisma.progress.upsert({
    where: { userId_levelId: { userId, levelId } },
    update: {
      attempts: { increment: 1 },
      bestScore,
      completed: passed || wasAlreadyCompleted,
      completedAt: passed && !wasAlreadyCompleted ? new Date() : existing?.completedAt,
    },
    create: {
      userId,
      levelId,
      attempts: 1,
      bestScore,
      completed: passed,
      completedAt: passed ? new Date() : null,
    },
  });

  let xpAwarded = 0;
  let user = await prisma.user.findUnique({ where: { id: userId } });

  // Only award XP the first time a level is passed — retries don't farm XP.
  if (passed && !wasAlreadyCompleted) {
    xpAwarded = level.xpReward;
    const newXp = user.xp + xpAwarded;
    const newStreak = calculateStreak(user.lastActiveAt, user.streak);

    user = await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        coins: { increment: Math.round(xpAwarded / 5) },
        level: calculateLevel(newXp),
        streak: newStreak,
        lastActiveAt: new Date(),
      },
    });

    await maybeAwardFirstStepsBadge(userId);
  }

  let certificateIssued = null;
  if (passed && !wasAlreadyCompleted) {
    certificateIssued = await maybeIssueCertificate(userId, levelId);
  }

  return { passed, scorePercent, xpAwarded, progress, user, certificateIssued };
}

async function maybeAwardFirstStepsBadge(userId) {
  const completedCount = await prisma.progress.count({ where: { userId, completed: true } });
  if (completedCount !== 1) return;

  const badge = await prisma.badge.findUnique({ where: { code: "first_steps" } });
  if (!badge) return;

  await prisma.userBadge.upsert({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
    update: {},
    create: { userId, badgeId: badge.id },
  });
}

async function getUserSummary(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, level: true, xp: true, coins: true, streak: true },
  });
  if (!user) throw new AppError("User not found.", 404);

  const badges = await prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
    orderBy: { earnedAt: "desc" },
  });

  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: { language: true },
    orderBy: { issuedAt: "desc" },
  });

  const totalLevels = await prisma.level.count();
  const completedLevels = await prisma.progress.count({ where: { userId, completed: true } });
  const overallProgress = totalLevels === 0 ? 0 : Math.round((completedLevels / totalLevels) * 100);

  return {
    ...user,
    overallProgress,
    badges: badges.map((b) => ({ id: b.badge.id, code: b.badge.code, name: b.badge.name, icon: b.badge.icon, earnedAt: b.earnedAt })),
    certificates: certificates.map((c) => ({ id: c.id, language: c.language.name, issuedAt: c.issuedAt })),
  };
}

async function maybeIssueCertificate(userId, levelId) {
  const level = await prisma.level.findUnique({
    where: { id: levelId },
    include: { module: { include: { language: { include: { modules: true } } } } },
  });
  if (!level) return null;

  const language = level.module.language;
  const totalModules = language.modules.length;
  const isLastModule = level.module.order === totalModules;
  if (!isLastModule) return null;

  // Confirm every module in this language is completed by this user
  const allModules = await prisma.module.findMany({
    where: { languageId: language.id },
    include: { levels: { include: { progress: { where: { userId } } } } },
  });

  const allComplete = allModules.every((mod) =>
    mod.levels.every((lvl) => lvl.progress[0]?.completed)
  );
  if (!allComplete) return null;

  const certificate = await prisma.certificate.upsert({
    where: { userId_languageId: { userId, languageId: language.id } },
    update: {},
    create: { userId, languageId: language.id },
  });

  return { certificate, languageName: language.name };
}

async function getExamQuestions(levelId) {
  const level = await prisma.level.findUnique({
    where: { id: levelId },
    include: {
      questions: { orderBy: { order: "asc" } },
      module: { include: { language: true } },
    },
  });

  if (!level) throw new AppError("Level not found.", 404);

  return {
    id: level.id,
    title: level.title,
    theory: level.theory,
    languageSlug: level.module.language.slug,
    questions: level.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      order: q.order,
      // correctIndex intentionally omitted — never sent to the client
    })),
  };
}

async function submitExamAnswers({ userId, levelId, answers }) {
  const questions = await prisma.question.findMany({ where: { levelId } });
  if (questions.length === 0) throw new AppError("No questions found for this exam.", 404);

  let correctCount = 0;
  questions.forEach((q) => {
    if (answers[q.id] === q.correctIndex) correctCount++;
  });

  const scorePercent = Math.round((correctCount / questions.length) * 100);
  const result = await recordLevelAttempt({ userId, levelId, scorePercent });

  return { ...result, correctCount, totalQuestions: questions.length };
}

module.exports = {
  PASS_THRESHOLD,
  getLanguageCatalog,
  getLanguageWithProgress,
  getLevelForStudy,
  recordLevelAttempt,
  getUserSummary,
  maybeIssueCertificate,
  getExamQuestions,
  submitExamAnswers,
};