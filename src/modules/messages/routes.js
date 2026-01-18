// modules/messages/routes.js
const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");

router.post("/", auth, upload.single("image"), controller.send);
router.get("/:chatId", auth, controller.list);
router.post("/read", auth, controller.read);

module.exports = router;
