// src/socket/events.js
const messageService = require("../../modules/messages/service");
const notificationService = require("../../modules/notifications/service");
const presence = require("../../redis/presence");

module.exports = (io, socket) => {

    // Join a chat room
    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
    });

    // Leave a chat room
    socket.on("leave_chat", (chatId) => {
        socket.leave(chatId);
    });

    // Typing indicator (Redis-backed)
    socket.on("typing", async ({ chatId }) => {
        await presence.setTyping(chatId, socket.user.id);

        socket.to(chatId).emit("typing", {
            chatId,
            userId: socket.user.id
        });
    });

    socket.on("stop_typing", async ({ chatId }) => {
        await presence.stopTyping(chatId, socket.user.id);

        socket.to(chatId).emit("stop_typing", {
            chatId,
            userId: socket.user.id
        });
    });

    // Send message
    socket.on("send_message", async ({ chatId, content, type }) => {
        // save message + message_status
        const message = await messageService.sendMessage({
            chatId,
            senderId: socket.user.id,
            content,
            type
        });

        // emit message to chat room
        io.to(chatId).emit("new_message", message);

        // notify chat members (except sender)
        const members = await messageService.getChatMembers(chatId);

        for (const m of members) {
            if (m.user_id !== socket.user.id) {
                const totalUnread =
                    await notificationService.getTotalUnread(m.user_id);

                io.to(m.user_id).emit("notification_update", {
                    chatId,
                    totalUnread
                });
            }
        }
    });
};
