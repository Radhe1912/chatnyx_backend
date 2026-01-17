const { Server } = require("socket.io");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const socketAuth = require("./auth");
const messageService = require("../messages/service");
const presence = require("../../redis/presence");

let io;

async function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  // --------- REDIS ADAPTER FOR MULTI-INSTANCE ---------
  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();
  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));
  // ---------------------------------------------------

  // SOCKET.IO AUTH
  io.use(socketAuth);

  io.on("connection", socket => {
    console.log("🔌 Connected:", socket.user.id);

    // --------- PRESENCE ---------
    presence.setOnline(socket.user.id);

    socket.on("disconnect", async () => {
      await presence.setOffline(socket.user.id);
    });

    socket.on("heartbeat", async () => {
      await presence.refreshOnline(socket.user.id);
    });
    // ----------------------------

    // --------- JOIN / LEAVE CHAT ---------
    socket.on("join_chat", chatId => {
      socket.join(chatId);
    });

    socket.on("leave_chat", chatId => {
      socket.leave(chatId);
    });
    // ----------------------------

    // --------- SEND MESSAGE ---------
    socket.on("send_message", async data => {
      try {
        const message = await messageService.sendMessage({
          chatId: data.chatId,
          senderId: socket.user.id,
          content: data.content,
          type: data.type,
        });

        // Emit to all users in chat
        io.to(data.chatId).emit("new_message", {
          ...message,
          sender_id: socket.user.id,
          status: "sent", // initial status
        });
      } catch (err) {
        console.error("❌ send_message error:", err);
      }
    });
    // ----------------------------

    // --------- MARK SEEN ---------
    socket.on("mark_seen", async ({ chatId }) => {
      try {
        await messageService.markChatAsRead(chatId, socket.user.id);

        // Notify others in the chat
        io.to(chatId).emit("messages_seen", {
          chatId,
          userId: socket.user.id,
        });
      } catch (err) {
        console.error("❌ mark_seen failed:", err);
      }
    });
    // ----------------------------
  });
}

module.exports = { initSocket };
