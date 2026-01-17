require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

/* ✅ ALLOWED ORIGINS */
const allowedOrigins = [
    "https://chatnyx.vercel.app",
    process.env.CLIENT_URL,
    "http://localhost:5173"
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

/* ✅ ROUTES */
app.use("/auth", require("./modules/auth"));
app.use("/users", require("./modules/users"));
app.use("/chats", require("./modules/chats"));
app.use("/messages", require("./modules/messages"));
app.use("/notifications", require("./modules/notifications"));
app.use("/media", require("./modules/media"));
app.use("/uploads", express.static("src/uploads"));

module.exports = app;
