const db = require('../config/db');

gverify = 'SELECT id_lembaga,nama_lembaga,verifikasi FROM lembaga ORDER BY id_lembaga ASC';
ghistory = 'SELECT id_detail,id_user,id_issue,jumlah_bayar,tanggal,nama_donatur FROM detail_donasi ORDER BY id_detail ASC';
gissue = 'SELECT id_issue,id_lembaga,deskripsi,deadline,pilihan,alasan FROM issues ORDER BY id_issue ASC';
//get
exports.getVerifikasi = async (req, res) => {
    try {
        const data = await pool.query(gverify);
        res.json(data.rows);
    } catch (error) {
        console.error("Query error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getHistory = async (req, res) => {
    try {
        const data = await pool.query(ghistory);
        res.json(data.rows);
    } catch (error) {
        console.error("Query error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getIssue = async (req, res) => {
    try {
        const data = await pool.query(gissue);
        res.json(data.rows);
    } catch (error) {
        console.error("Query error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.admlogout = (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ success: false, message: "Logout failed." });
            }
            return res.redirect("/admin"); // Redirect to login page
        });
    } else {
        return res.redirect("/admin");
    }
};


//updata
exports.putVerifikasi = async (req, res) => {
    try {
        const { id_lembaga, verifikasi } = req.body;

        // Check if the record exists
        const existingData = await pool.query(
            "SELECT verifikasi FROM lembaga WHERE id_lembaga = $1",
            [id_lembaga]
        );

        if (existingData.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        // Skip update if verifikasi is unchanged
        if (existingData.rows[0].verifikasi == verifikasi) {
            return res.status(200).json({ success: true, message: "No changes detected" });
        }

        // Update verification status only
        await pool.query(
            "UPDATE lembaga SET verifikasi = $1 WHERE id_lembaga = $2",
            [verifikasi, id_lembaga]
        );

        res.status(200).json({ success: true, message: "Verification status updated successfully" });

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.putIssue = async (req, res) => {
    try {
        const { id_issue, pilihan, alasan } = req.body;

        const existingData = await pool.query(
            "SELECT * FROM issues WHERE id_issue = $1",
            [id_issue]
        );

        if (existingData.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }

        await pool.query(
            "UPDATE issues SET pilihan = $1, alasan = $2 WHERE id_issue = $3",
            [pilihan, alasan, id_issue]
        );

        res.status(200).json({ success: true, message: "Issue updated successfully" });

    } catch (error) {
        console.error("Update issue error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//delete
exports.deleteVerifikasi = async (req, res) => {
    try {
        const { id_lembaga } = req.params;
        const existingData = await pool.query("select id_lembaga from lembaga where id_lembaga = $1", [id_lembaga])

        if (existingData.rows.length === 0) {
            return res.status(404).json({ success: false, message: "record not found" })

        }
        // Delete the record
        await pool.query("DELETE FROM lembaga WHERE id_lembaga = $1", [id_lembaga]);

        res.status(200).json({ success: true, message: "Record deleted successfully" });

    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.deleteHistory = async (req, res) => {
    try {
        const { id_detail } = req.params;
        const existingData = await pool.query("select id_detail from detail_donasi where id_detail = $1", [id_detail])

        if (existingData.rows.length === 0) {
            return res.status(404).json({ success: false, message: "record not found" })

        }
        // Delete the record
        await pool.query("DELETE FROM detail_donasi WHERE id_detail = $1", [id_detail]);

        res.status(200).json({ success: true, message: "Record deleted successfully" });

    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.deleteIssue = async (req, res) => {
    try {
        const { id_issue } = req.params;
        const existingData = await pool.query("select id_issue from issues where id_issue = $1", [id_issue])

        if (existingData.rows.length === 0) {
            return res.status(404).json({ success: false, message: "record not found" })

        }
        // Delete the record
        await pool.query("DELETE FROM issues WHERE id_issue = $1", [id_issue]);

        res.status(200).json({ success: true, message: "Record deleted successfully" });

    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
