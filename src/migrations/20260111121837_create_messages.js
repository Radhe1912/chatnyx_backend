module.exports = {
  up: async (c) => {
    await c.query(`
      CREATE TABLE messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
        sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
        type VARCHAR(10) DEFAULT 'text',
        content TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  },

  down: async (c) => {
    await c.query(`DROP TABLE IF EXISTS messages`);
  }
};
