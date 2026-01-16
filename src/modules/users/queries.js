// modules/users/queries.js
module.exports = {
    getUserById: `
    SELECT id, username, email, last_seen, created_at
    FROM users
    WHERE id = $1
  `,

    searchUsers: `
    SELECT id, username, email
    FROM users
    WHERE username ILIKE $1 OR email ILIKE $1
    LIMIT 20
  `,

    updateLastSeen: `
    UPDATE users
    SET last_seen = NOW()
    WHERE id = $1
  `
};
