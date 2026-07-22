const problemService = require("../services/problemService");

async function getProblemsByPlatform(req, res, next) {
  try {
    const problems = await problemService.listProblemsByPlatform(req.params.platform);
    res.json({ problems });
  } catch (err) {
    next(err);
  }
}

async function getProblem(req, res, next) {
  try {
    const problem = await problemService.getProblem(req.params.slug);
    res.json({ problem });
  } catch (err) {
    next(err);
  }
}

async function markCompleted(req, res, next) {
  try {
    const result = await problemService.markCompleted(req.user.id, req.params.slug);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getCompletions(req, res, next) {
  try {
    const completed = await problemService.getCompletions(req.user.id);
    res.json({ completed });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProblemsByPlatform,
  getProblem,
  markCompleted,
  getCompletions,
};