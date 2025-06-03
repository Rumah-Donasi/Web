const db = require('../config/db');
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

// Dashboard
const index = async (req, res) => {
    try {
        res.render('pages/lembaga', {
            title: 'Dashboard',
            currentPath: '/lembaga'
        });
    } catch (error) {
        console.log(error);
        res.render('pages/error', { error });
    }
};

// Create Issue (GET + POST)
const createIssue = async (req, res) => {
    try {
        if (req.method === 'POST') {
            const { nama_issue, description } = req.body;
            await db.query(
                'INSERT INTO issues (nama_issue, description) VALUES ($1, $2)',
                [nama_issue, description]
            );
            return res.redirect('/lembaga/issues');
        }

        res.render('pages/createIssue', {
            title: 'Buat Galang Dana',
            currentPath: '/lembaga/createIssue'
        });
    } catch (error) {
        console.log(error);
        res.render('pages/error', { error });
    }
};

// Detail Issue
const issue = async (req, res) => {
    try {
        const issueId = req.params.id;
        const result = await db.query('SELECT * FROM issues WHERE id = $1', [issueId]);
        const issueData = result.rows[0];

        res.render('pages/issue', {
            title: 'Detail Galang Dana',
            currentPath: '/lembaga/issue',
            issue: issueData
        });
    } catch (error) {
        console.log(error);
        res.render('pages/error', { error });
    }
};

// List Issues
const issues = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM issues ORDER BY id DESC');
        res.render('pages/issues', {
            title: 'Galang Dana',
            currentPath: '/lembaga/issue',
            issues: result.rows || []
        });
    } catch (error) {
        console.log(error);
        res.render('pages/error', { error });
    }
};

// Update Issue
const updateIssue = async (req, res) => {
    try {
        const issueId = req.params.id;
        const { nama_issue, description } = req.body;

        await db.query(
            'UPDATE issues SET nama_issue = $1, description = $2 WHERE id = $3',
            [nama_issue, description, issueId]
        );

        res.redirect('/lembaga/issues');
    } catch (error) {
        console.log(error);
        res.render('pages/error', { error });
    }
};

// Delete Issue
const deleteIssue = async (req, res) => {
    try {
        const issueId = req.params.id;
        await db.query('DELETE FROM issues WHERE id = $1', [issueId]);

        res.redirect('/lembaga/issues');
    } catch (error) {
        console.log(error);
        res.render('pages/error', { error });
    }
};

// Inbox
const inbox = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM messages ORDER BY created_at DESC');

        res.render('pages/inbox', {
            title: 'Inbox',
            currentPath: '/lembaga/pesan',
            messages: result.rows || []
        });
    } catch (error) {
        console.log(error);
        res.render('pages/error', { error });
    }
};

// Logout
const keluar = async (req, res) => {
    try {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    } catch (error) {
        console.log(error);
        res.render('pages/error', { error });
    }
};

module.exports = {
    accLembaga,
    rejectLembaga,
    index,
    createIssue,
    issue,
    issues,
    updateIssue,
    deleteIssue,
    inbox,
    keluar
}