// modules/users/service.js
const pool = require("../../db/pool");
const queries = require("./queries");

async function getUserById(userId) {
    const { rows } = await pool.query(queries.getUserById, [userId]);
    return rows[0];
}

async function searchUsers(query) {
    const searchValue = `%${query}%`;
    const { rows } = await pool.query(queries.searchUsers, [searchValue]);
    return rows;
}

async function updateLastSeen(userId) {
    await pool.query(queries.updateLastSeen, [userId]);
}

async function getUserPresence(userId) {
  const online = await presence.isOnline(userId);

  if (online) return { status: "online" };

  const lastSeen = await presence.getLastSeen(userId);
  return {
    status: "offline",
    lastSeen
  };
}

module.exports = {
    getUserById,
    searchUsers,
    updateLastSeen,
    getUserPresence
};
