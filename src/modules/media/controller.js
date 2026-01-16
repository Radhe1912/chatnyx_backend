const service = require("./service");

async function uploadMedia(req, res) {
    const userId = req.user.id;
    const { chatId } = req.body;

    if (!req.file)
        return res.status(400).json({ message: "File required" });

    const message = await service.saveMediaMessage({
        chatId,
        senderId: userId,
        file: req.file
    });

    res.status(201).json(message);
}

exports.uploadImage = async (req, res) => {
    const file = req.file;

    res.json({
        url: `/uploads/images/${file.filename}`,
    });
};


module.exports = { uploadMedia };
