// modules/chats/controller.js
const chatService = require("./service");

async function createPrivate(req, res) {
    try {
        const userId = req.user.id;
        const { userId: otherUserId } = req.body;

        if (!otherUserId) {
            return res.status(400).json({ message: "User ID required" });
        }
        const chat = await chatService.createPrivateChat(userId, otherUserId);
        res.status(201).json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function createGroup(req, res) {
    try {
        const userId = req.user.id;
        const { name, members } = req.body;

        if (!name || !Array.isArray(members))
            return res.status(400).json({ message: "Invalid data" });

        const chat = await chatService.createGroupChat(userId, name, members);
        res.status(201).json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getChats(req, res) {
    try {
        const chats = await chatService.getUserChats(req.user.id);
        res.status(200).json(chats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function remove(req, res) {
    try {
        const adminId = req.user.id;
        const { chatId, memberId } = req.body;

        await chatService.removeMember(chatId, adminId, memberId);
        res.status(200).json({ message: "Member removed" });
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
}

module.exports = {
    createPrivate,
    createGroup,
    getChats,
    remove,
};
