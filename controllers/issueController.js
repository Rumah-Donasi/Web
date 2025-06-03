const db = require('../config/db');

const createIssue = async (req, res) => {
    try {
        const {
            title,
            thumbnail,
            target,
            deadline,
            deskripsi,
            id_lembaga
        } = req.body;
        
        if(!title || !thumbnail || !target || !deadline || !deskripsi || !id_lembaga) {
            return res.status(400).json({
                success: false,
                message: "Mohon lengkapi semua field"
            });
        }

        imgBuffer = thumbnail;
        imgHex = imgBuffer.toString('hex');

        const insertQuery = `
            INSERT INTO issues (title, thumbnail, target, deadline, deskripsi, id_lembaga)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [title, imgHex, target, deadline, deskripsi, id_lembaga];

        db.query(insertQuery, values, (err, result) => {
            if(err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Terjadi kesalahan pada server"
                });
            }

            res.render("pages/createIssue", {
                success: true,
                message: "Issue berhasil dibuat"
            });
        });

    } catch (error) {
        console.log(error);
        res.render("pages/error", {
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

const accIssue = async (req, res) => {
    try {
        const issueId = req.params.id;
        if (!issueId) {
            return res.status(400).json({
                success: false,
                message: "Isi ID"
            });
        }

        const issue = await db.query('SELECT * FROM issues WHERE id = $1', [issueId]);
        if (issue.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Issue tidak ditemukan"
            });
        }

        const updateQuery = `
            UPDATE issues
            SET status = 'acc'
            WHERE id = $1;
        `;
        db.query(updateQuery, [issueId], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Terjadi kesalahan pada server"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Issue berhasil diterima",
                data: result.rows[0]
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

const rejectIssue = async (req, res) => {
    try {
        const issueId = req.params.id;
        if (!issueId) {
            return res.status(400).json({
                success: false,
                message: "Isi ID"
            });
        }

        const issue = await db.query('SELECT * FROM issues WHERE id = $1', [issueId]);
        if (issue.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Issue tidak ditemukan"
            });
        }

        const updateQuery = `
            UPDATE issues
            SET status = 'reject'
            WHERE id = $1;
        `;
        db.query(updateQuery, [issueId], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Terjadi kesalahan pada server"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Issue berhasil ditolak",
                data: result.rows[0]
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

const updateIssue = async (req, res) => {
    try {
        const issueId = req.params.id;
        if (!issueId) {
            return res.status(400).json({ success: false, message: "Isi ID" });
        }

        const issueCheck = await db.query('SELECT * FROM issues WHERE id = $1', [issueId]);
        if (issueCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Issue tidak ditemukan" });
        }

        const fields = ['title', 'thumbnail', 'target', 'deadline', 'deskripsi'];
        const updates = [];
        const values = [];
        let paramIndex = 1;

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates.push(`${field} = $${paramIndex++}`);
                values.push(req.body[field]);
            }
        });

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Tidak ada data yang dikirim untuk diupdate"
            });
        }

        values.push(issueId);

        const updateQuery = `
            UPDATE issues
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *;
        `;

        const result = await db.query(updateQuery, values);

        return res.status(200).json({
            success: true,
            message: "Issue berhasil diupdate",
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

const deleteIssue = async (req, res) => {
    try {
        const issueId = req.params.id;
        if (!issueId) {
            return res.status(400).json({ success: false, message: "Isi ID" });
        }

        const issueCheck = await db.query('SELECT * FROM issues WHERE id = $1', [issueId]);
        if (issueCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Issue tidak ditemukan" });
        }

        const deleteQuery = `
            DELETE FROM issues
            WHERE id = $1
            RETURNING *;
        `;

        const result = await db.query(deleteQuery, [issueId]);

        return res.status(200).json({
            success: true,
            message: "Issue berhasil dihapus",
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

const getAllIssue = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM issues');
        return res.status(200).json({
            success: true,
            message: "Issue berhasil diambil",
            data: result.rows
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

const getIssueById = async (req, res) => {
    try {
        const issueId = req.params.id;
        if (!issueId) {
            return res.status(400).json({ success: false, message: "Isi ID" });
        }

        const result = await db.query('SELECT * FROM issues WHERE id = $1', [issueId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Issue tidak ditemukan" });
        }

        return res.status(200).json({
            success: true,
            message: "Issue berhasil diambil",
            data: result.rows[0]
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

const homeCreate = async (req, res) => {
    try {
        res.render('pages/createIssue');
    } catch (error) {
        console.log(error);
        res.render("pages/error", { error: error });
    }
};

module.exports = {
    createIssue,
    rejectIssue,
    accIssue,
    updateIssue,
    deleteIssue,
    homeCreate
}