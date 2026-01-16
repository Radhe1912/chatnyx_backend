const pool = require("../../db/pool");
const messageQueries = require("../messages/queries");

function getType(mime) {
    if (mime.startsWith("image")) return "image";
    if (mime.startsWith("video")) return "video";
    return "file";
}

async function saveMediaMessage({ chatId, senderId, file }) {
    const type = getType(file.mimetype);
    const path = file.path;

    const { rows } = await pool.query(
        messageQueries.createMessage,
        [chatId, senderId, path, type]
    );

    return rows[0];
}

module.exports = { saveMediaMessage };
