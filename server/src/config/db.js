const { PrismaClient } = require("@prisma/client");

// Reuse a single Prisma client across the app (avoids exhausting
// MySQL connections during dev hot-reloads).
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

module.exports = prisma;