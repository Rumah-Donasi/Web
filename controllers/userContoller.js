const db = require('../config/db');

// UPDATE USER
const updateUser = async (req, res) => {
    try {
        const userId = req.user.id; // Ambil dari JWT payload, bukan body

        const allowedFields = ['username', 'telp_user', 'alamat', 'nama_user'];
        const updates = [];
        const values = [];
        let paramIndex = 1;

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                if (field === 'username') {
                    // Cek username sudah dipakai user lain atau belum
                    const check = await db.query(
                        'SELECT id_user FROM users WHERE username = $1 AND id_user != $2',
                        [req.body.username, userId]
                    );
                    if (check.rows.length > 0) {
                        return res.status(400).json({
                            success: false,
                            message: "Username sudah digunakan"
                        });
                    }
                }
                updates.push(`${field} = $${paramIndex++}`);
                values.push(req.body[field]);
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Tidak ada data yang dikirim untuk diupdate"
            });
        }

        values.push(userId);

        const updateQuery = `
            UPDATE users
            SET ${updates.join(', ')}
            WHERE id_user = $${paramIndex}
            RETURNING id_user, username, email;
        `;

        const result = await db.query(updateQuery, values);

        return res.status(200).json({
            success: true,
            message: "User berhasil diupdate",
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: err
        });
    }
};

// CHANGE PASSWORD
const bcrypt = require('bcrypt');

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id; // Ambil dari JWT
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Password lama dan baru harus diisi"
            });
        }

        const result = await db.query('SELECT password FROM users WHERE id_user = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Password lama salah"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = $1 WHERE id_user = $2', [hashedPassword, userId]);

        return res.status(200).json({
            success: true,
            message: "Password berhasil diubah"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: err
        });
    }
};

module.exports = {
    registerController,
    loginController,
    updateUser,
    changePassword
};
