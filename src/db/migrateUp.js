const fs = require("fs");
const path = require("path");
const pool = require("./pool");

async function migrateUp() {
    const client = await pool.connect();

    await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      run_at TIMESTAMP DEFAULT NOW()
    );
  `);

    const dir = path.join(__dirname, "../migrations");
    const files = fs.readdirSync(dir).sort();

    for (const file of files) {
        const { rows } = await client.query(
            "SELECT 1 FROM migrations WHERE name = $1",
            [file]
        );

        if (rows.length === 0) {
            console.log(`🚀 Running UP ${file}`);
            const migration = require(path.join(dir, file));

            await client.query("BEGIN");
            await migration.up(client);
            await client.query(
                "INSERT INTO migrations(name) VALUES ($1)",
                [file]
            );
            await client.query("COMMIT");
        }
    }

    client.release();
    console.log("✅ Migration UP complete");
}

migrateUp().catch(console.error);
