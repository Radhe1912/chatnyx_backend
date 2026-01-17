require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

/* ✅ ALLOWED ORIGINS */
const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow server-to-server, Postman, curl
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

/* ✅ PRE-FLIGHT SUPPORT */
app.options("*", cors());

app.use(express.json());

app.use("/auth", require("./modules/auth"));
app.use("/users", require("./modules/users"));
app.use("/chats", require("./modules/chats"));
app.use("/messages", require("./modules/messages"));
app.use("/notifications", require("./modules/notifications"));
app.use("/media", require("./modules/media"));
app.use("/uploads", express.static("src/uploads"));

module.exports = app;