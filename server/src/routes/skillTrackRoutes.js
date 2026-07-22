const express = require("express");
const skillTrackController = require("../controllers/skillTrackController");

const router = express.Router();

router.get("/", skillTrackController.getSkillTracks);
router.get("/:slug", skillTrackController.getSkillTrack);

module.exports = router;