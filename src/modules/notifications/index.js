// modules/notifications/index.js
const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth.middleware");
const controller = require("./controller");

router.get("/unread", auth, controller.getUnreadCounts);

module.exports = router;
