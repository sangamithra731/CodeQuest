const prisma = require("../config/db");
const { AppError } = require("../middlewares/errorHandler");

async function listCompanies() {
  return prisma.company.findMany({
    orderBy: { name: "asc" },
    select: { id: true, slug: true, name: true, salaryRange: true, available: true },
  });
}
async function submitAttempt(userId, slug, answers) {
  // answers = [{ questionId, selectedIndex }]
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { questions: { where: { type: "aptitude" } } },
  });
  if (!company) throw new AppError("Company not found.", 404);

  const answerMap = new Map(answers.map((a) => [a.questionId, a.selectedIndex]));

  let correctCount = 0;
  const results = company.questions.map((q) => {
    const selectedIndex = answerMap.get(q.id);
    const isCorrect = selectedIndex === q.correctIndex;
    if (isCorrect) correctCount += 1;
    return { questionId: q.id, selectedIndex, correctIndex: q.correctIndex, isCorrect };
  });

  const totalQuestions = company.questions.length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  await prisma.placementAttempt.create({
    data: { userId, companyId: company.id, scorePercent, totalQuestions, correctCount },
  });

  return { scorePercent, correctCount, totalQuestions, results };
}

module.exports = { listCompanies, getCompany, submitAttempt };
async function getCompany(slug) {
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!company) throw new AppError("Company not found.", 404);

  // Hide MCQ answers from the payload — same pattern as your exam questions
  const questions = company.questions.map((q) => ({
    id: q.id,
    type: q.type,
    question: q.question,
    options: q.options,
    difficulty: q.difficulty,
    // answer/correctIndex intentionally omitted for aptitude MCQs;
    // included for coding/hr since those are explanations, not "cheat" answers
    answer: q.type === "aptitude" ? undefined : q.answer,
  }));

  return { ...company, questions };
}

module.exports = { listCompanies, getCompany };