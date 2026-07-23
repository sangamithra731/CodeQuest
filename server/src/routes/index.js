const express = require("express");
const authRoutes = require("./authRoutes");
const progressRoutes = require("./progressRoutes");
const quizRoutes = require("./quizRoutes");
const languageRoutes = require("./languageRoutes");

const router = express.Router();
const leaderboardRoutes = require("./leaderboardRoutes");
router.use("/leaderboard", leaderboardRoutes);
router.use("/auth", authRoutes);
router.use("/progress", progressRoutes);
router.use("/quiz", quizRoutes);
router.use("/languages", languageRoutes);
router.use("/placement", require("./placementRoutes"));

router.use("/skill-tracks", require("./skillTrackRoutes"));
router.use("/eligibility", require("./eligibilityRoutes"));
router.use("/problems", require("./problemRoutes"));

module.exports = router;
