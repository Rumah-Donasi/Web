const db = require('../config/db');

const histori = async (req, res) => {
    try {
        const result = await db.query (`
            SELECT * FROM detail_donasi
            WHERE id_user = $1
            ORDER BY tanggal DESC
        `, [req.user.id_user]);

        res.render('pages/account', {
            hostori: result.rows
        });
    } catch (error) {
        console.log(error);
        res.render('pages/error', {
            error: error
        });
    }
};

const akun = (req, res) => {
    res.render('pages/account');
};

const pesan = async (req, res) => {
    try {
        const result = await db.query (`
            SELECT * FROM pesan
            WHERE id_user = $1
            ORDER BY tanggal DESC
        `, [req.user.id_user]);

        res.render('pages/account', {
            pesan: result.rows
        });
    } catch (error) {
        console.log(error);
        res.render('pages/error', {
            error: error
        });
    }
};

module.exports = {
    histori,
    akun,
    pesan
}