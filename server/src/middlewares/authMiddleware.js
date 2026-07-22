const { verifyAccessToken } = require("../utils/jwt");
const { AppError } = require("./errorHandler");

function authMiddleware(req, res, next) {
  console.log("========== AUTH ==========");
  console.log("Authorization Header:", req.headers.authorization);

  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    console.log("❌ No Authorization header");
    return next(new AppError("You must be logged in to do that.", 401));
  }

  const token = header.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    console.log("✅ Token verified:", payload);

    req.userId = payload.sub;
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    next(new AppError("Your session has expired. Please log in again.", 401));
  }
}

module.exports = authMiddleware;