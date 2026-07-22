const crypto = require("crypto");
const prisma = require("../config/db");
const { AppError } = require("../middlewares/errorHandler");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt");
const {
  jwtRefreshExpires,
} = require("../config/env");

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function msFromExpiry(expiresIn) {
  const match = /^(\d+)([smhd])$/.exec(String(expiresIn));
  if (!match) return 30 * 24 * 60 * 60 * 1000;
  const value = Number(match[1]);
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * multipliers[match[2]];
}

async function createUser({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("An account with that email already exists.", 409);
  }

  const user = await prisma.user.create({
    data: { name, email, password },
  });

  return sanitizeUser(user);
}

async function authenticateUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (user.password !== password) {
    throw new AppError("Invalid email or password.", 401);
  }

  return sanitizeUser(user);
}

async function issueTokens(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  const expiresAt = new Date(
    Date.now() + msFromExpiry(jwtRefreshExpires)
  );

  await prisma.refreshToken.create({
    data: {
      token: hashToken(refreshToken),
      userId: user.id,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
}

async function revokeRefreshToken(token) {
  await prisma.refreshToken.deleteMany({
    where: { token: hashToken(token) },
  });
}

async function refreshAccessToken(refreshToken) {
  if (!refreshToken) throw new AppError("Not authenticated.", 401);

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Session expired. Please log in again.", 401);
  }

  const hashed = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { token: hashed } });
  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError("Session expired. Please log in again.", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw new AppError("User not found.", 404);

  const accessToken = signAccessToken(user);
  return { accessToken, user: sanitizeUser(user) };
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError("User not found.", 404);
  }
  return sanitizeUser(user);
}

module.exports = {
  createUser,
  authenticateUser,
  issueTokens,
  revokeRefreshToken,
  refreshAccessToken,
  getUserById,
};