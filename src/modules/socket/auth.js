const jwt = require("jsonwebtoken");

module.exports = (socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("No token"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        socket.user = { id: decoded.id };

        next();
    } catch (err) {
        next(new Error("Unauthorized"));
    }
};
