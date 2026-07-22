const prisma = require("../config/db");
const { AppError } = require("../middlewares/errorHandler");

async function listSkillTracks() {
  return prisma.skillTrack.findMany({
    orderBy: { name: "asc" },
    select: { id: true, slug: true, name: true, summary: true },
  });
}

async function getSkillTrack(slug) {
  const track = await prisma.skillTrack.findUnique({ where: { slug } });
  if (!track) throw new AppError("Skill track not found.", 404);
  return track;
}

module.exports = { listSkillTracks, getSkillTrack };