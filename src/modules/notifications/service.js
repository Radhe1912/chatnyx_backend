// modules/notifications/service.js
const pool = require("../../db/pool");
const queries = require("./queries");

async function getUnreadByChat(userId) {
    const { rows } = await pool.query(
        queries.unreadCountByChat,
        [userId]
    );
    return rows;
}

async function getTotalUnread(userId) {
    const { rows } = await pool.query(
        queries.totalUnreadCount,
        [userId]
    );
    return rows[0].total;
}

module.exports = {
    getUnreadByChat,
    getTotalUnread
};
