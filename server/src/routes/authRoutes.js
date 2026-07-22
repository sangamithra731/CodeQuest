const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const { signupValidator, loginValidator } = require("../validators/authValidator");

const router = express.Router();

router.post("/signup", signupValidator, authController.signup);
router.post("/login", loginValidator, authController.login);
router.post("/logout", authController.logout);
router.get("/me", authMiddleware, authController.me);
router.post("/refresh", authController.refresh);

module.exports = router;