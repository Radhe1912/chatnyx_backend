const pool = require("../../db/pool");
const q = require("./queries");

/**
 * Send message with transaction
 * - creates message
 * - creates message_status for each member
 */
async function sendMessage({ chatId, senderId, content, type = "text" }) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1️⃣ Create message
        const { rows } = await client.query(
            q.createMessage,
            [chatId, senderId, content, type]
        );
        const message = rows[0];

        // 2️⃣ Get members
        const { rows: members } = await client.query(
            q.getChatMembers,
            [chatId]
        );

        // 3️⃣ Insert status PER USER
        for (const member of members) {
            await client.query(
                q.addMessageStatus,
                [
                    message.id,
                    member.user_id,
                    member.user_id === senderId ? "sent" : "delivered"
                ]
            );
        }

        await client.query("COMMIT");
        return message;

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

async function getMessages(chatId, userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const { rows } = await pool.query(
        q.getMessagesByChat,
        [chatId, userId, limit, offset]
    );

    return rows;
}

async function markAsRead(messageId, userId) {
    await pool.query(
        q.updateMessageStatus,
        [messageId, userId, "read"]
    );
}

async function markChatRead(chatId, userId) {
    await pool.query(
        `
        UPDATE message_status ms
        SET status = 'read', updated_at = now()
        FROM messages m
        WHERE m.id = ms.message_id
          AND m.chat_id = $1
          AND ms.user_id = $2
        `,
        [chatId, userId]
    );
}

async function markChatAsRead(chatId, userId) {
    await pool.query(`
        UPDATE message_status ms
        SET status = 'read', updated_at = NOW()
        FROM messages m
        WHERE ms.message_id = m.id
          AND m.chat_id = $1
          AND ms.user_id = $2
          AND ms.status != 'read'
    `, [chatId, userId]);
}

module.exports = {
    sendMessage,
    getMessages,
    markAsRead,
    markChatRead,
    markChatAsRead
};
