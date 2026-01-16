const redis = require("./client");

const ONLINE_TTL = 60; // seconds

async function setOnline(userId) {
    await redis.set(`user:online:${userId}`, "1", {
        EX: ONLINE_TTL
    });
}

async function refreshOnline(userId) {
    await setOnline(userId);
}

async function setOffline(userId) {
    await redis.del(`user:online:${userId}`);
    await redis.set(
        `user:last_seen:${userId}`,
        Date.now().toString()
    );
}

async function isOnline(userId) {
    return await redis.exists(`user:online:${userId}`);
}

async function getLastSeen(userId) {
    return await redis.get(`user:last_seen:${userId}`);
}

async function setTyping(chatId, userId) {
    await redis.set(
        `typing:${chatId}:${userId}`,
        "1",
        { EX: 5 }
    );
}

async function stopTyping(chatId, userId) {
    await redis.del(`typing:${chatId}:${userId}`);
}

module.exports = {
    setOnline,
    refreshOnline,
    setOffline,
    isOnline,
    getLastSeen,
    setTyping,
    stopTyping
};
