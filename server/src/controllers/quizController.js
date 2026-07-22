const prisma = require("../config/db");
const progressService = require("../services/progressService");
const { AppError } = require("../middlewares/errorHandler");

async function getQuiz(req, res, next) {
  try {
    const { levelId } = req.params;

    // Never send correctIndex to the client — that's the whole point of grading server-side.
    const questions = await prisma.question.findMany({
      where: { levelId },
      orderBy: { order: "asc" },
      select: { id: true, question: true, options: true, order: true },
    });

    if (questions.length === 0) {
      throw new AppError("No quiz found for this level.", 404);
    }

    res.json({ questions });
  } catch (err) {
    next(err);
  }
}

async function submitQuiz(req, res, next) {
  try {
    const { levelId } = req.params;
    const { answers } = req.body; // [{ questionId, selectedIndex }]

    if (!Array.isArray(answers) || answers.length === 0) {
      throw new AppError("Submit at least one answer.", 422);
    }

    const questions = await prisma.question.findMany({ where: { levelId } });
    if (questions.length === 0) {
      throw new AppError("No quiz found for this level.", 404);
    }

    let correctCount = 0;
    const results = questions.map((q) => {
      const submitted = answers.find((a) => a.questionId === q.id);
      const isCorrect = submitted?.selectedIndex === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        correct: isCorrect,
        correctIndex: q.correctIndex, // safe to reveal after submission
      };
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);

const { passed, xpAwarded, user, certificateIssued } = await progressService.recordLevelAttempt({
      userId: req.userId,
      levelId,
      scorePercent,
    });

    res.json({
      scorePercent,
      passed,
      passThreshold: progressService.PASS_THRESHOLD,
      xpAwarded,
      results,
      user: { level: user.level, xp: user.xp, coins: user.coins, streak: user.streak },
      certificateIssued: certificateIssued
        ? { languageName: certificateIssued.languageName, issuedAt: certificateIssued.certificate.issuedAt }
        : null,
    });

    res.json({
      scorePercent,
      passed,
      passThreshold: progressService.PASS_THRESHOLD,
      xpAwarded,
      results,
      user: { level: user.level, xp: user.xp, coins: user.coins, streak: user.streak },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getQuiz, submitQuiz };