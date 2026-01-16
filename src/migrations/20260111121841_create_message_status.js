module.exports = {
  up: async (c) => {
    await c.query(`
      CREATE TABLE message_status (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(15) CHECK (status IN ('sent','delivered','read')) NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(message_id, user_id)
      )
    `);
  },

  down: async (c) => {
    await c.query(`DROP TABLE IF EXISTS message_status`);
  }
};
