// modules/messages/routes.js
const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../middlewares/auth.middleware");

router.post("/", auth, controller.send);
router.get("/:chatId", auth, controller.list);
router.post("/read", auth, controller.read);

module.exports = router;
