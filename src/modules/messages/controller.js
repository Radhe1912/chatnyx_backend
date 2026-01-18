const messageService = require("./service");
const cloudinary = require("../../config/cloudinary");

async function send(req, res) {
    try {
        const senderId = req.user.id;
        const chatId = req.body?.chatId;
        const content = req.body?.content;
        const type = req.body?.type;

        if (!chatId) {
            return res.status(400).json({ message: "chatId required" });
        }

        let finalContent = content;
        let finalType = type || "text";

        if (req.file) {
            finalContent = req.file.path;
            finalType = "image";
        }

        const message = await messageService.sendMessage({
            chatId,
            senderId,
            content: finalContent,
            type: finalType,
        });

        return res.status(201).json(message);
    } catch (err) {
        console.error("SEND MESSAGE ERROR:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

async function list(req, res) {
    try {
        const { chatId } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const userId = req.user.id;

        const messages = await messageService.getMessages(
            chatId,
            userId,
            Number(page),
            Number(limit)
        );

        return res.status(200).json(messages);
    } catch (err) {
        console.error("get messages error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

async function read(req, res) {
    try {
        const userId = req.user.id;
        const { messageId } = req.body;

        await messageService.markAsRead(messageId, userId);
        return res.status(200).json({ message: "Message read" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    send,
    list,
    read
};
