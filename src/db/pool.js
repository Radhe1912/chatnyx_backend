require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

pool.on("connect", () => {
    console.log("🟢 PostgreSQL connected");
});

pool.on("error", (err) => {
    console.error("🔴 PostgreSQL pool error", err);
    process.exit(1);
});

module.exports = pool;
