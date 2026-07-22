const express = require("express");
const progressController = require("../controllers/progressController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/catalog", progressController.getCatalog); // public — browsing doesn't require login
router.get("/languages/:slug", authMiddleware, progressController.getLanguageProgress);
router.get("/levels/:levelId", authMiddleware, progressController.getLevel);
router.get("/levels/:levelId/exam", authMiddleware, progressController.getExam);
router.get("/summary", authMiddleware, progressController.getSummary);
router.post("/levels/:levelId/submit", authMiddleware, progressController.submitLevel);
router.post("/levels/:levelId/exam/submit", authMiddleware, progressController.submitExam);

module.exports = router;