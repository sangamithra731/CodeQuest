const prisma = require('../config/db');

async function getDashboardData(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const progressRows = await prisma.progress.findMany({
    where: { userId },
    include: {
      level: {
        include: {
          module: {
            include: { language: true },
          },
        },
      },
    },
  });

  const courseProgress = {};
  progressRows.forEach((p) => {
    const languageSlug = p.level.module.language.slug;
    if (!courseProgress[languageSlug]) {
      courseProgress[languageSlug] = { completedLevels: 0, totalLevels: 0 };
    }
    courseProgress[languageSlug].totalLevels += 1;
    if (p.completed) {
      courseProgress[languageSlug].completedLevels += 1;
    }
  });

  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
  });

  return {
    level: user.level,
    xp: user.xp,
    xpIntoLevel: user.xp % 100,
    xpForNextLevel: 100,
    streak: user.streak,
    badges: userBadges.map((ub) => ub.badge),
    certificates: await prisma.certificate.findMany({ where: { userId } }),
    courseProgress,
  };
}

module.exports = { getDashboardData };