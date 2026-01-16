module.exports = {
  createMessage: `
        INSERT INTO messages (chat_id, sender_id, content, type)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `,

  getMessagesByChat: `
        SELECT
    m.id,
    m.chat_id,
    m.sender_id,
    m.type,
    m.content,
    m.created_at,
    ms.status
    FROM messages m
    JOIN message_status ms
        ON ms.message_id = m.id
    WHERE m.chat_id = $1
      AND ms.user_id = $2
    ORDER BY m.created_at ASC
    LIMIT $3 OFFSET $4;
    `,

  getChatMembers: `
        SELECT user_id
        FROM chat_members
        WHERE chat_id = $1
    `,

  addMessageStatus: `
        INSERT INTO message_status (message_id, user_id, status)
        VALUES ($1, $2, $3)
    `,

  updateMessageStatus: `
        UPDATE message_status
        SET status = $3
        WHERE message_id = $1 AND user_id = $2
    `,
};
