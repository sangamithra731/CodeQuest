const prisma = require("../config/db");

// Falls back to sane defaults if no admin-configured rule exists yet.
const DEFAULT_RULES = {
  minCourseCompletion: 70,
  minCertificates: 1,
  minXp: 500,
  minQuizAverage: 60,
  minStreak: 0,
};

async function getActiveRules() {
  const rule = await prisma.eligibilityRule.findFirst({ orderBy: { updatedAt: "desc" } });
  return rule || DEFAULT_RULES;
}

async function getEligibility(userId) {
  const rules = await getActiveRules();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, streak: true },
  });

  const certificates = await prisma.certificate.count({ where: { userId } });

  const totalLevels = await prisma.level.count();
  const completedLevels = await prisma.progress.count({ where: { userId, completed: true } });
  const courseCompletionPct = totalLevels === 0 ? 0 : Math.round((completedLevels / totalLevels) * 100);

  const attempts = await prisma.progress.findMany({
    where: { userId, attempts: { gt: 0 } },
    select: { bestScore: true },
  });
  const quizAverage = attempts.length === 0
    ? 0
    : Math.round(attempts.reduce((sum, a) => sum + a.bestScore, 0) / attempts.length);

  const checks = [
    {
      label: "Course completion",
      required: `${rules.minCourseCompletion}%`,
      actual: `${courseCompletionPct}%`,
      passed: courseCompletionPct >= rules.minCourseCompletion,
      suggestion: `Complete more modules — you're at ${courseCompletionPct}%, need ${rules.minCourseCompletion}%.`,
    },
    {
      label: "Certificates earned",
      required: rules.minCertificates,
      actual: certificates,
      passed: certificates >= rules.minCertificates,
      suggestion: `Finish a language track's certification exam to earn a certificate (need ${rules.minCertificates}).`,
    },
    {
      label: "XP earned",
      required: rules.minXp,
      actual: user?.xp || 0,
      passed: (user?.xp || 0) >= rules.minXp,
      suggestion: `Earn more XP by completing modules and exams (need ${rules.minXp} total).`,
    },
    {
      label: "Quiz average",
      required: `${rules.minQuizAverage}%`,
      actual: `${quizAverage}%`,
      passed: quizAverage >= rules.minQuizAverage,
      suggestion: `Retake weaker quizzes to raise your average above ${rules.minQuizAverage}%.`,
    },
    {
      label: "Learning streak",
      required: `${rules.minStreak} days`,
      actual: `${user?.streak || 0} days`,
      passed: (user?.streak || 0) >= rules.minStreak,
      suggestion: `Log in and complete a lesson daily to build your streak.`,
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const total = checks.length;

  let status;
  if (passedCount === total) status = "Eligible";
  else if (passedCount >= total - 1) status = "Nearly Eligible";
  else status = "Not Eligible";

  return {
    status,
    checks,
    passedCount,
    total,
  };
}

module.exports = { getEligibility, getActiveRules };