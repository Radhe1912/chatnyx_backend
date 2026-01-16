// modules/auth/service.js
const pool = require("../../db/pool");
const queries = require("./queries");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

async function registerUser({ username, email, password }) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const { rows } = await pool.query(queries.createUser, [
        username,
        email,
        hashedPassword,
    ]);

    return rows[0];
}

async function getUserByEmail(email) {
    const { rows } = await pool.query(queries.getUserByEmail, [email]);
    return rows[0];
}

async function validatePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

async function getUserById(id) {
    const { rows } = await pool.query(queries.getUserById, [id]);
    return rows[0];
}

module.exports = {
    registerUser,
    getUserByEmail,
    validatePassword,
    getUserById
};
