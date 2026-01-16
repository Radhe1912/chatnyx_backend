// modules/users/controller.js
const userService = require("./service");

async function getMe(req, res) {
    try {
        const userId = req.user.id;

        const user = await userService.getUserById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

async function search(req, res) {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: "Query is required" });

        const users = await userService.searchUsers(q);
        return res.status(200).json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getMe,
    search
};
