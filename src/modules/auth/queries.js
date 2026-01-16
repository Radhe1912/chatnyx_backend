// modules/auth/queries.js
module.exports = {
    createUser: `
    INSERT INTO users(username, email, password_hash)
    VALUES($1, $2, $3)
    RETURNING id, username, email, created_at
  `,

    getUserByEmail: `
    SELECT * FROM users WHERE email = $1
  `,

    getUserById: `
    SELECT id, username, email, last_seen, created_at
    FROM users WHERE id = $1
  `
};
