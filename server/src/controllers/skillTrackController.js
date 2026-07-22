const skillTrackService = require("../services/skillTrackService");

async function getSkillTracks(req, res, next) {
  try {
    const tracks = await skillTrackService.listSkillTracks();
    res.json({ tracks });
  } catch (err) {
    next(err);
  }
}

async function getSkillTrack(req, res, next) {
  try {
    const { slug } = req.params;
    const track = await skillTrackService.getSkillTrack(slug);
    res.json({ track });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSkillTracks, getSkillTrack };