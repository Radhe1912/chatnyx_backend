// modules/chats/service.js
const pool = require("../../db/pool");
const q = require("./queries");

async function createPrivateChat(userId, otherUserId) {
    const { rows: existing } = await pool.query(q.findPrivateChat, [
        userId,
        otherUserId,
    ]);

    if (existing.length > 0) {
        return existing[0];
    }

    const { rows } = await pool.query(q.createChat, [
        "private",
        null,
        userId,
    ]);

    const chat = rows[0];

    await pool.query(q.addMember, [chat.id, userId, "member"]);
    await pool.query(q.addMember, [chat.id, otherUserId, "member"]);

    return chat;
}

async function createGroupChat(userId, name, members) {
    const { rows } = await pool.query(q.createChat, [
        "group",
        name,
        userId,
    ]);

    const chat = rows[0];

    await pool.query(q.addMember, [chat.id, userId, "admin"]);

    const uniqueMembers = new Set(members);

    for (const memberId of uniqueMembers) {
        if (memberId === userId) continue;

        await pool.query(q.addMember, [chat.id, memberId, "member"]);
    }

    return chat;
}

async function getUserChats(userId) {
    const { rows } = await pool.query(q.getUserChats, [userId]);
    return rows;
}

async function removeMember(chatId, adminId, memberId) {
    const { rows } = await pool.query(q.isAdmin, [chatId, adminId]);
    if (!rows.length) throw new Error("Not admin");

    await pool.query(q.removeMember, [chatId, memberId]);
}

module.exports = {
    createPrivateChat,
    createGroupChat,
    getUserChats,
    removeMember,
};
