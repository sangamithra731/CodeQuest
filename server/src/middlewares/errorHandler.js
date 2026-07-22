// Central error handler — every controller can just throw or call next(err).
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message =
    status === 500 ? "Something went wrong on our end. Please try again." : err.message;

  res.status(status).json({ message });
}

function notFoundHandler(req, res) {
  res.status(404).json({ message: "Route not found." });
}

class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

module.exports = { errorHandler, notFoundHandler, AppError };