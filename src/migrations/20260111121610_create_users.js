module.exports = {
  up: async (c) => {
    await c.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await c.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        last_seen TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  },

  down: async (c) => {
    await c.query(`DROP TABLE IF EXISTS users`);
  }
};
