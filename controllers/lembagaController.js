const db = require('../config/db');

const awalLembaga = async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM issues WHERE id_pembuat = $1`, [req.user.id_user]);

        res.locals.issues = result.rows;
        res.render('pages/awalLembaga', {
            issues: result.rows
        });
    } catch (error) {
        console.log(error);
        res.render('pages/error', {
            error: error
        });
    }
};

const accLembaga = async (req, res) => {
    try {
        const id_user = req.params.id_user;

        if (!id_user) {
            return res.status(400).json({
                success: false,
                message: "id_user diperlukan"
            });
        }

        const existing = await db.query('SELECT * FROM users WHERE id_user = $1', [id_user]);
        if (existing.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        const result = await db.query(`
            UPDATE users
            SET verifikasi = true
            WHERE id_user = $1
            RETURNING *;
        `, [id_user]);

        return res.status(200).json({
            success: true,
            message: "Lembaga berhasil diverifikasi",
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error
        });
    }
};


const rejectLembaga = async (req, res) => {
    try {
        const id_user = req.params.id_user;

        if (!id_user) {
            return res.status(400).json({
                success: false,
                message: "id_user diperlukan"
            });
        }

        const existing = await db.query('SELECT * FROM users WHERE id_user = $1', [id_user]);
        if (existing.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        const result = await db.query(`
            UPDATE users
            SET verifikasi = false
            WHERE id_user = $1
            RETURNING *;
        `, [id_user]);

        return res.status(200).json({
            success: true,
            message: "Lembaga berhasil ditolak",
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error
        });
    }
};


module.exports = {
    awalLembaga,
    accLembaga,
    rejectLembaga
}