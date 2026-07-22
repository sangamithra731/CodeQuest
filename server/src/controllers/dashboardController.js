const dashboardService = require('../services/dashboardService');

async function getMyDashboard(req, res, next) {
  try {
    const data = await dashboardService.getDashboardData(req.userId);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyDashboard };