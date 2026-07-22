const express = require("express");
const quizController = require("../controllers/quizController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:levelId", authMiddleware, quizController.getQuiz);
router.post("/:levelId/submit", authMiddleware, quizController.submitQuiz);

module.exports = router;