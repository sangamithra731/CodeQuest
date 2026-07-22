const eligibilityService = require("../services/eligibilityService");

async function getMyEligibility(req, res, next) {
  try {
    const result = await eligibilityService.getEligibility(req.userId);
    res.json({ eligibility: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyEligibility };