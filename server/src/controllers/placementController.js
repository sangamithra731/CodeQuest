const placementService = require("../services/placementService");

async function getCompanies(req, res, next) {
  try {
    const companies = await placementService.listCompanies();
    res.json({ companies });
  } catch (err) {
    next(err);
  }
}

async function getCompany(req, res, next) {
  try {
    const { slug } = req.params;
    const company = await placementService.getCompany(slug);
    res.json({ company });
  } catch (err) {
    next(err);
  }
}

async function submitAttempt(req, res, next) {
  try {
    const { slug } = req.params;
    const { answers } = req.body; // [{ questionId, selectedIndex }]
    const userId = req.user.id; // set by your auth middleware
    const result = await placementService.submitAttempt(userId, slug, answers);
    res.json({ result });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCompanies, getCompany, submitAttempt };
