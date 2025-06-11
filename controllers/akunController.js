const db = require('../config/db');

const histori = async (req, res) => {
    try {
        const result = await db.query (`
            SELECT detail_donasi.*, issues.nama_issue FROM detail_donasi
            JOIN issues ON detail_donasi.id_issue = issues.id_issue
            WHERE id_user = $1
            ORDER BY tanggal DESC
        `, [req.user.id]);
        
        const formatRupiah = (angka) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(angka);
        };
        
        req.issues = result.rows.map(issue => {
            return {
                ...issue,
                jumlahFormatted: formatRupiah(issue.jumlah_bayar)
            };
        });

        res.render('pages/account', {
            donasi: req.issues
        });
    } catch (error) {
        console.log(error);
        res.render('pages/error', {
            error: error
        });
    }
};

const akun = (req, res) => {
    if(!req.user) return res.redirect('/login');
    res.render('pages/account');
};

const editProfileHome = async (req, res) => {
    try {
        res.render('pages/editProfile', {
            err: {}
        });
    } catch (error) {
        console.log(error);
        res.render('pages/error', {
            error: error
        });
    }
};

const editProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Cek apakah username dan email ada dan tidak kosong
        if (!req.body.username || !req.body.email) {
            return res.render('pages/editProfile', {
                username: req.body.username,
                email: req.body.email,
                telp_user: req.body.telp_user,
                alamat: req.body.alamat,
                nama_user: req.body.nama_user,
                err: {
                    username: !req.body.username ? "Mohon lengkapi username" : undefined,
                    email: !req.body.email ? "Mohon lengkapi email" : undefined
                }
            });
        }

        const allowedFields = ['username', 'email', 'telp_user', 'alamat', 'nama_user'];
        const updates = [];
        const values = [];
        let paramIndex = 1;

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                if ((field === 'nama_user' || field === 'telp_user' || field === 'alamat') && !req.body[field]) {
                    continue;
                }
                if (field === 'telp_user' && req.body[field]) {
                    let telp = req.body[field].replace(/\s+/g, '');

                    if (telp.startsWith('62')) {
                        telp = '0' + telp.slice(2);
                    } else if (!telp.startsWith('0')) {
                        telp = '0' + telp;
                    }
                    req.body[field] = telp;
                }
                if (field === 'username') {
                    const check = await db.query(
                        'SELECT id_user FROM users WHERE username = $1 AND id_user != $2',
                        [req.body.username, userId]
                    );
                    if (check.rows.length > 0) {
                        return res.render('pages/editProfile', {
                            username: req.body.username,
                            email: req.body.email,
                            telp_user: req.body.telp_user,
                            alamat: req.body.alamat,
                            nama_user: req.body.nama_user,
                            err: {
                                username: "Username sudah digunakan"
                            }
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

        res.redirect('/akun');
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
    histori,
    akun,
    editProfile,
    editProfileHome
}