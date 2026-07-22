const prisma = require("../config/db");

async function getLeaderboard() {
  const users = await prisma.user.findMany({
    orderBy: { xp: "desc" },
    take: 20,
    select: {
      id: true,
      name: true,
      level: true,
      xp: true,
      streak: true,
    },
  });

  return users.map((u, i) => ({ ...u, rank: i + 1 }));
}

module.exports = { getLeaderboard };