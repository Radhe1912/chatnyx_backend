const express = require("express");
const router = express.Router();
const upload = require("./upload");
const auth = require("../auth/middleware");

router.post("/upload", auth, upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        res.json({
            url: `/uploads/${req.file.filename}`,
            type: req.file.mimetype
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload failed" });
    }
});

router.get("/:chatId", auth, controller.getMessages);

module.exports = router;
