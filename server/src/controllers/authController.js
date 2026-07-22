const { validationResult } = require("express-validator");
const authService = require("../services/authService");
const { AppError } = require("../middlewares/errorHandler");

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/api/auth",
};

async function signup(req, res, next) {
  try {
    console.log("========== SIGNUP START ==========");
    console.log(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 422);
    }

    const { name, email, password } = req.body;

    const user = await authService.createUser({
      name,
      email,
      password,
    });

    const { accessToken, refreshToken } =
      await authService.issueTokens(user);

    res.cookie(
      "cq_refresh_token",
      refreshToken,
      REFRESH_COOKIE_OPTIONS
    );

    res.status(201).json({
      user,
      accessToken,
    });
  } catch (err) {
    console.log("========== SIGNUP ERROR ==========");
    console.error(err);

    next(err);
  }
}

async function login(req, res, next) {
  try {
    console.log("========== LOGIN START ==========");
    console.log(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 422);
    }

    const { email, password } = req.body;

    const user = await authService.authenticateUser({
      email,
      password,
    });

    const { accessToken, refreshToken } =
      await authService.issueTokens(user);

    res.cookie(
      "cq_refresh_token",
      refreshToken,
      REFRESH_COOKIE_OPTIONS
    );

    res.status(200).json({
      user,
      accessToken,
    });
  } catch (err) {
    console.log("========== LOGIN ERROR ==========");
    console.error(err);

    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies?.cq_refresh_token;

    if (token) {
      await authService.revokeRefreshToken(token);
    }

    res.clearCookie("cq_refresh_token", {
      path: "/api/auth",
    });

    res.status(200).json({
      message: "Logged out.",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getUserById(req.userId);

    res.status(200).json({
      user,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}
async function refresh(req, res, next) {
  try {
    const token = req.cookies?.cq_refresh_token;
    const { accessToken, user } = await authService.refreshAccessToken(token);
    res.status(200).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  signup,
  login,
  logout,
  me,
  refresh,
};