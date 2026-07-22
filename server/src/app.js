const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const {
  errorHandler,
  notFoundHandler,
} = require("./middlewares/errorHandler");

const app = express();

// TEMPORARY: Hardcode the frontend URL for testing
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);
app.use("/api/users", require("./routes/dashboardRoutes"));

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;