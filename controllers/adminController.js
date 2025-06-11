const pool = require('../config/db');

// Query constants
const gverify = `SELECT id_user, username, verifikasi FROM users WHERE usertype = 'lembaga' ORDER BY id_user ASC`;
const ghistory = 'SELECT id_detail, id_user,id_issue,jumlah_bayar,tanggal,nama_donatur,pesan FROM detail_donasi ORDER BY id_detail ASC';
const gissue = 'SELECT id_issue, thumbnail,id_pembuat,deskripsi,deadline,ispilihan FROM issues ORDER BY id_issue ASC';

// GET Handlers
const getVerifikasi = async (req, res) => {
    try {
        const data = await pool.query(gverify);
        res.json(data.rows);
    } catch (error) {
        console.error("Query error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getHistory = async (req, res) => {
    try {
        const data = await pool.query(ghistory);
        res.json(data.rows);
    } catch (error) {
        console.error("Query error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getIssue = async (req, res) => {
    try {
        const data = await pool.query(gissue);
        res.json(data.rows);
    } catch (error) {
        console.error("Query error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const admlogout = (req, res) => {
    if (req.cookies.token) {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        res.redirect("/");
    } else {
        return res.redirect("/");
    }
};

// UPDATE Handlers
const putVerifikasi = async (req, res) => {
    try {
        const { id_lembaga, verifikasi } = req.body;
        const existingData = await pool.query("SELECT verifikasi FROM lembaga WHERE id_lembaga = $1", [id_lembaga]);

        if (existingData.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        if (existingData.rows[0].verifikasi == verifikasi) {
            return res.status(200).json({ success: true, message: "No changes detected" });
        }

        await pool.query("UPDATE lembaga SET verifikasi = $1 WHERE id_lembaga = $2", [verifikasi, id_lembaga]);
        res.status(200).json({ success: true, message: "Verification status updated successfully" });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const putIssue = async (req, res) => {
    try {
        const { id_issue, pilihan, alasan } = req.body;
        const existingData = await pool.query("SELECT * FROM issues WHERE id_issue = $1", [id_issue]);

        if (existingData.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }

        await pool.query("UPDATE issues SET isPilihan = $1, alasan = $2 WHERE id_issue = $3", [pilihan, alasan, id_issue]);
        res.status(200).json({ success: true, message: "Issue updated successfully" });
    } catch (error) {
        console.error("Update issue error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// DELETE Handlers
const deleteVerifikasi = async (req, res) => {
    try {
        const { id_lembaga } = req.params;
        const existingData = await pool.query("SELECT id_lembaga FROM lembaga WHERE id_lembaga = $1", [id_lembaga]);

        if (existingData.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        await pool.query("DELETE FROM lembaga WHERE id_lembaga = $1", [id_lembaga]);
        res.status(200).json({ success: true, message: "Record deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteHistory = async (req, res) => {
    try {
        const { id_detail } = req.params;
        const existingData = await pool.query("SELECT id_detail FROM detail_donasi WHERE id_detail = $1", [id_detail]);

        if (existingData.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        await pool.query("DELETE FROM detail_donasi WHERE id_detail = $1", [id_detail]);
        res.status(200).json({ success: true, message: "Record deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteIssue = async (req, res) => {
    try {
        const { id_issue } = req.params;
        const existingData = await pool.query("SELECT id_issue FROM issues WHERE id_issue = $1", [id_issue]);

        if (existingData.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        await pool.query("DELETE FROM issues WHERE id_issue = $1", [id_issue]);
        res.status(200).json({ success: true, message: "Record deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Export all functions
module.exports = {
    getVerifikasi,
    getHistory,
    getIssue,
    admlogout,
    putVerifikasi,
    putIssue,
    deleteVerifikasi,
    deleteHistory,
    deleteIssue
};
