const db = require('../config/db');
const bcrypt = require('bcrypt');
const JWT = require("jsonwebtoken");
require('dotenv').config();

// REGISTER
const registerController = (usertype) => {
    return async (req, res) => {
        try {
            const { username, password, email } = req.body;

            if (!username || !password || !email) {
                return res.status(400).json({
                    success: false,
                    message: "Mohon lengkapi semua field (username, password, email)"
                });
            }

            if (!['user', 'lembaga'].includes(usertype)) {
                return res.status(400).json({
                    success: false,
                    message: "Tipe user tidak valid (user atau lembaga)"
                });
            }

            const existing = await db.query(
                'SELECT id_user FROM users WHERE username = $1',
                [username]
            );
            if (existing.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Username sudah digunakan"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const insertQuery = `
                INSERT INTO users (username, email, password, usertype, verifikasi)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id_user, username, email, usertype, verifikasi;
            `;

            const result = await db.query(insertQuery, [
                username,
                email,
                hashedPassword,
                usertype,
                usertype === 'lembaga' ? false : true
            ]);

            const user = result.rows[0];

            return res.status(201).json({
                success: true,
                message: `${usertype} berhasil terdaftar`,
                user,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Terjadi kesalahan pada server",
                error: err,
            });
        }
    };
};

const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Mohon lengkapi username dan password"
            });
        }

        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        const user = result.rows[0];

        if (user.usertype === 'lembaga' && !user.verifikasi) {
            return res.status(403).json({
                success: false,
                message: "Akun lembaga belum diverifikasi oleh admin"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Password salah"
            });
        }

        const token = JWT.sign(
            { id: user.id_user, usertype: user.usertype },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        delete user.password;

        return res.status(200).json({
            success: true,
            message: "Login berhasil",
            user,
            token,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: err,
        });
    }
};

module.exports = { 
    registerController, 
    loginController 
};