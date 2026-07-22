const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();
const CONTENT_DIR = path.join(__dirname, "..", "content");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

async function seedLanguages() {
  const languages = [
    { slug: "python", name: "Python", icon: "🐍", difficulty: "Beginner", order: 1, description: "Learn programming fundamentals with the world's most versatile language." },
    { slug: "javascript", name: "JavaScript", icon: "⚡", difficulty: "Beginner", order: 2, description: "Bring web pages to life, one script at a time." },
    { slug: "html-css", name: "HTML & CSS", icon: "🎨", difficulty: "Beginner", order: 3, description: "Build and style your very first website." },
    { slug: "c", name: "C", icon: "⚙️", difficulty: "Intermediate", order: 4, description: "Understand what's really happening under the hood." },
  ];

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { slug: lang.slug },
      update: {},
      create: lang,
    });
  }
  console.log(`Seeded ${languages.length} languages.`);
}

async function seedPythonModule1() {
  const python = await prisma.language.findUnique({ where: { slug: "python" } });
  if (!python) return;

  const module1Dir = path.join(CONTENT_DIR, "python", "module-1");
  const theory = readJson(path.join(module1Dir, "theory.json"));
  const examples = readJson(path.join(module1Dir, "examples.json"));
  const practice = readJson(path.join(module1Dir, "practice.json"));
  const quiz = readJson(path.join(module1Dir, "quiz.json"));

  const module1 = await prisma.module.upsert({
    where: { languageId_slug: { languageId: python.id, slug: "module-1" } },
    update: {},
    create: {
      languageId: python.id,
      slug: "module-1",
      title: "Getting Started",
      order: 1,
    },
  });

  const level1 = await prisma.level.upsert({
    where: { moduleId_slug: { moduleId: module1.id, slug: "level-1" } },
    update: {},
    create: {
      moduleId: module1.id,
      slug: "level-1",
      title: theory.title,
      order: 1,
      theory: theory.body,
      examples,
      practice,
      xpReward: 50,
    },
  });

  // Only seed questions if this level has none yet
  const existingQuestions = await prisma.question.count({ where: { levelId: level1.id } });
  if (existingQuestions === 0) {
    for (let i = 0; i < quiz.length; i++) {
      const q = quiz[i];
      await prisma.question.create({
        data: {
          levelId: level1.id,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          order: i,
        },
      });
    }
  }

  console.log("Seeded Python → Module 1 → Level 1 with quiz questions.");
}

async function seedBadges() {
  const badges = [
    { code: "first_steps", name: "First Steps", description: "Complete your first level.", icon: "👣" },
    { code: "seven_day_streak", name: "7-Day Streak", description: "Learn for 7 days in a row.", icon: "🔥" },
    { code: "quiz_master", name: "Quiz Master", description: "Score 100% on a quiz.", icon: "🎯" },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { code: badge.code },
      update: {},
      create: badge,
    });
  }
  console.log(`Seeded ${badges.length} badges.`);
}

async function main() {
  await seedLanguages();
  await seedPythonModule1();
  await seedBadges();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });