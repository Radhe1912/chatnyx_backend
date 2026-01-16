module.exports = {
  up: async (c) => {
    await c.query(`
      CREATE TABLE chat_members (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(10) DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(chat_id, user_id)
      )
    `);
  },

  down: async (c) => {
    await c.query(`DROP TABLE IF EXISTS chat_members`);
  }
};
