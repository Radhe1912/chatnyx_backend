require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());

app.use("/auth", require("./modules/auth"));
app.use("/users", require("./modules/users"));
app.use("/chats", require("./modules/chats"));
app.use("/messages", require("./modules/messages"));
app.use("/notifications", require("./modules/notifications"));
app.use("/media", require("./modules/media"));
app.use("/uploads", express.static("src/uploads"));

module.exports = app;