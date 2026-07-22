require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5050,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,

  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || "15m",
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES || "30d",

  databaseUrl: process.env.DATABASE_URL,
};