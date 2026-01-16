module.exports = {
  up: async (c) => {
    await c.query(`
      CREATE TABLE chats (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        type VARCHAR(10) CHECK (type IN ('private','group')) NOT NULL,
        name VARCHAR(100),
        created_by UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  },

  down: async (c) => {
    await c.query(`DROP TABLE IF EXISTS chats`);
  }
};
