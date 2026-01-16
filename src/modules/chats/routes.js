const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const controller = require("./controller");

router.post("/private", authMiddleware, controller.createPrivate);
router.post("/group", authMiddleware, controller.createGroup);
router.get("/", authMiddleware, controller.getChats);
router.delete("/member", authMiddleware, controller.remove);

module.exports = router;
