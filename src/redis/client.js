const { createClient } = require("redis");

const redis = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

redis.on("connect", () => {
    console.log("Redis connected");
});

redis.on("error", (err) => {
    console.error("Redis error:", err);
});

redis.connect();

module.exports = redis;
