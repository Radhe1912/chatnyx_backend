const fs = require("fs");
const path = require("path");
const pool = require("./pool");

async function migrateDown() {
    const client = await pool.connect();

    const { rows } = await client.query(
        "SELECT name FROM migrations ORDER BY run_at DESC LIMIT 1"
    );

    if (rows.length === 0) {
        console.log("⚠️ No migrations to rollback");
        return;
    }

    const file = rows[0].name;
    const migration = require(
        path.join(__dirname, "../migrations", file)
    );

    console.log(`⏪ Rolling back ${file}`);

    await client.query("BEGIN");
    await migration.down(client);
    await client.query(
        "DELETE FROM migrations WHERE name = $1",
        [file]
    );
    await client.query("COMMIT");

    client.release();
    console.log("✅ Migration DOWN complete");
}

migrateDown().catch(console.error);
