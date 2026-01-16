const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../uploads");

// ✅ ensure folder exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (_, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

module.exports = multer({ storage });
