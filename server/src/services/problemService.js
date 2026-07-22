const prisma = require("../config/db");
const { AppError } = require("../middlewares/errorHandler");

async function listProblemsByPlatform(platform) {
  return prisma.problem.findMany({
    where: { platform },
    orderBy: { order: "asc" },
    select: { id: true, slug: true, title: true, difficulty: true, topic: true, videoUrl: true },
  });
}

async function getProblem(slug) {
  const problem = await prisma.problem.findUnique({ where: { slug } });
  if (!problem) throw new AppError("Problem not found.", 404);
  return problem;
}

async function markCompleted(userId, slug) {
  const problem = await prisma.problem.findUnique({ where: { slug } });
  if (!problem) throw new AppError("Problem not found.", 404);

  await prisma.problemCompletion.upsert({
    where: { userId_problemId: { userId, problemId: problem.id } },
    update: {},
    create: { userId, problemId: problem.id },
  });

  return { completed: true };
}

async function getCompletions(userId) {
  const rows = await prisma.problemCompletion.findMany({
    where: { userId },
    select: { problemId: true },
  });
  return rows.map((r) => r.problemId);
}

module.exports = {
  listProblemsByPlatform,
  getProblem,
  markCompleted,
  getCompletions,
};