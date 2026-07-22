const express = require("express");
const eligibilityController = require("../controllers/eligibilityController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleware, eligibilityController.getMyEligibility);

module.exports = router;