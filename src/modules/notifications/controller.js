// modules/notifications/controller.js
const service = require("./service");

async function getUnreadCounts(req, res) {
    const userId = req.user.id;

    const chats = await service.getUnreadByChat(userId);
    const total = await service.getTotalUnread(userId);

    res.json({
        totalUnread: Number(total),
        chats
    });
}

module.exports = {
    getUnreadCounts
};
