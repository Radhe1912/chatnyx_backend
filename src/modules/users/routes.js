// modules/users/routes.js
const express = require("express");
const router = express.Router();
const controller = require("./controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.get("/me", authMiddleware, controller.getMe);
router.get("/search", authMiddleware, controller.search);

module.exports = router;
