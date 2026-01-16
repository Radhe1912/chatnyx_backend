module.exports = {
  up: async (c) => {
    await c.query(`
      CREATE TABLE media (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        file_type VARCHAR(50),
        file_size INTEGER
      )
    `);
  },

  down: async (c) => {
    await c.query(`DROP TABLE IF EXISTS media`);
  }
};
