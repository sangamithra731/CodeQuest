const jwt = require("jsonwebtoken");

const {
  jwtAccessSecret,
  jwtRefreshSecret,
  jwtAccessExpires,
  jwtRefreshExpires,
} = require("../config/env");

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    jwtAccessSecret,
    {
      expiresIn: jwtAccessExpires,
    }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
    },
    jwtRefreshSecret,
    {
      expiresIn: jwtRefreshExpires,
    }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, jwtAccessSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, jwtRefreshSecret);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};