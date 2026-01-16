// modules/messages/controller.js
const messageService = require("./service");

async function send(req, res) {
    try {
        const senderId = req.user.id;
        const { chatId, content, type } = req.body;

        if (!chatId || !content) {
            return res.status(400).json({ message: "chatId and content required" });
        }

        const message = await messageService.sendMessage({
            chatId,
            senderId,
            content,
            type,
        });

        // 🔜 socket.emit("new_message", message)

        return res.status(201).json(message);
    } catch (err) {
        console.error(err);
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
