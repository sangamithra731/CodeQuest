const express = require("express");
const placementController = require("../controllers/placementController");

const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware"); // adjust path/name to match your actual file

router.post("/companies/:slug/attempt", authMiddleware, placementController.submitAttempt);
router.get("/companies", placementController.getCompanies);
router.get("/companies/:slug", placementController.getCompany);

module.exports = router;