// modules/notifications/queries.js
module.exports = {

    unreadCountByChat: `
    SELECT m.chat_id, COUNT(*) AS unread_count
    FROM message_status ms
    JOIN messages m ON m.id = ms.message_id
    WHERE ms.user_id = $1
      AND ms.status != 'read'
    GROUP BY m.chat_id
  `,

    totalUnreadCount: `
    SELECT COUNT(*) AS total
    FROM message_status
    WHERE user_id = $1
      AND status != 'read'
  `
};
