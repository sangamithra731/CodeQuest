const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/:slug/modules", async (req, res) => {
  try {
    const language = await prisma.language.findUnique({
      where: {
        slug: req.params.slug,
      },
      include: {
        modules: {
          include: {
            levels: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!language) {
      return res.status(404).json({
        message: "Language not found",
      });
    }

    res.json(language.modules);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/:languageSlug/modules/:moduleSlug", async (req, res) => {
  try {
    const { languageSlug, moduleSlug } = req.params;

    const language = await prisma.language.findUnique({
      where: {
        slug: languageSlug,
      },
      include: {
        modules: {
          where: {
            slug: moduleSlug,
          },
          include: {
            levels: {
              include: {
                questions: true,
              },
            },
          },
        },
      },
    });

    if (!language || language.modules.length === 0) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    res.json(language.modules[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;