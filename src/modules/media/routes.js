const express = require("express");
const multer = require("multer");
const auth = require("../../middlewares/auth.middleware");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// ensure folder exists
const uploadDir = "src/uploads/images";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({ storage });

router.post("/upload", auth, upload.single("file"), (req, res) => {
    res.json({
        url: `/uploads/images/${req.file.filename}`
    });
});

module.exports = router;
