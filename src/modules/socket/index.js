const { Server } = require("socket.io");
const socketAuth = require("./auth");
const messageService = require("../messages/service");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", socket => {
    console.log("🔌 Connected:", socket.user.id);

    socket.on("join_chat", chatId => {
      socket.join(chatId);
    });

    socket.on("leave_chat", chatId => {
      socket.leave(chatId);
    });

    socket.on("send_message", async data => {
      try {
        const message = await messageService.sendMessage({
          chatId: data.chatId,
          senderId: socket.user.id,
          content: data.content,
          type: data.type,
        });

        // 🔥 Send to room
        io.to(data.chatId).emit("new_message", {
          ...message,
          sender_id: socket.user.id
        });

      } catch (err) {
        console.error("send_message error:", err);
      }
    });

    socket.on("mark_seen", async ({ chatId }) => {
      try {
        await messageService.markChatAsRead(chatId, socket.user.id);

        socket.to(chatId).emit("messages_seen", {
          chatId,
          userId: socket.user.id
        });
      } catch (err) {
        console.error("mark_seen failed", err);
      }
    });

  });
}

module.exports = { initSocket };
