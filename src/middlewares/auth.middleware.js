const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "SUPERSECRET";

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Invalid token" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.id }; // ✅ THIS IS THE KEY LINE
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalid" });
    }
};
