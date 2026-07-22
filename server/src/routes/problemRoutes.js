const express = require("express");
const problemController = require("../controllers/problemController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/completions", authMiddleware, problemController.getCompletions);
router.get("/platforms/:platform", problemController.getProblemsByPlatform);
router.get("/:slug", problemController.getProblem);
router.post("/:slug/complete", authMiddleware, problemController.markCompleted);

module.exports = router;