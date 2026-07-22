const progressService = require("../services/progressService");

async function getCatalog(req, res, next) {
  try {
    const languages = await progressService.getLanguageCatalog();
    res.json({ languages });
  } catch (err) {
    next(err);
  }
}

async function getLanguageProgress(req, res, next) {
  try {
    const { slug } = req.params;
    const language = await progressService.getLanguageWithProgress(slug, req.userId);
    res.json({ language });
  } catch (err) {
    next(err);
  }
}

async function getLevel(req, res, next) {
  try {
    const { levelId } = req.params;
    const level = await progressService.getLevelForStudy(levelId, req.userId);
    res.json({ level });
  } catch (err) {
    next(err);
  }
}

async function getSummary(req, res, next) {
  try {
    const summary = await progressService.getUserSummary(req.userId);
    res.json({ summary });
  } catch (err) {
    next(err);
  }
}

async function submitLevel(req, res, next) {
  try {
    const { levelId } = req.params;
    const { passed } = req.body;

    const scorePercent = passed ? 100 : 0;

    const result = await progressService.recordLevelAttempt({
      userId: req.userId,
      levelId,
      scorePercent,
    });

    res.json({ result });
  } catch (err) {
    next(err);
  }
}

async function getExam(req, res, next) {
  try {
    const { levelId } = req.params;
    const exam = await progressService.getExamQuestions(levelId);
    res.json({ exam });
  } catch (err) {
    next(err);
  }
}

async function submitExam(req, res, next) {
  try {
    const { levelId } = req.params;
    const { answers } = req.body;
    const result = await progressService.submitExamAnswers({
      userId: req.userId,
      levelId,
      answers,
    });
    res.json({ result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCatalog,
  getLanguageProgress,
  getLevel,
  getSummary,
  submitLevel,
  getExam,
  submitExam,
};