// modules/chats/queries.js
module.exports = {
  createChat: `
    INSERT INTO chats(type, name, created_by)
    VALUES($1, $2, $3)
    RETURNING *
  `,

  addMember: `
    INSERT INTO chat_members(chat_id, user_id, role)
    VALUES($1, $2, $3)
  `,

  findPrivateChat: `
    SELECT c.*
    FROM chats c
    JOIN chat_members cm1 ON cm1.chat_id = c.id
    JOIN chat_members cm2 ON cm2.chat_id = c.id
    WHERE c.type = 'private'
      AND cm1.user_id = $1
      AND cm2.user_id = $2
    LIMIT 1
  `,

  getUserChats: `
    SELECT
    c.id,
    c.type,
    c.name,
    c.created_at,

    json_agg(
        json_build_object(
            'user_id', u.id,
            'username', u.username
        )
    ) AS members

    FROM chats c
    JOIN chat_members cm ON cm.chat_id = c.id
    JOIN users u ON u.id = cm.user_id

    WHERE c.id IN (
        SELECT chat_id FROM chat_members WHERE user_id = $1
    )

    GROUP BY c.id;
  `,

  isAdmin: `
    SELECT 1 FROM chat_members
    WHERE chat_id = $1 AND user_id = $2 AND role = 'admin'
  `,

  removeMember: `
    DELETE FROM chat_members
    WHERE chat_id = $1 AND user_id = $2
  `
};
