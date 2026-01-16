module.exports = {
  up: async (c) => {
    await c.query(`
      CREATE TABLE notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(20),
        reference_id UUID,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  },

  down: async (c) => {
    await c.query(`DROP TABLE IF EXISTS notifications`);
  }
};
