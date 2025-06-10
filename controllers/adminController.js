const {pool} = require ('../database/db.js')
gverify='SELECT id_lembaga,nama_lembaga,verifikasi FROM lembaga';
ghistory='SELECT id_detail,id_user,id_issue,jumlah_bayar,tanggal,nama_donatur FROM detail_donasi';
gissue='SELECT id_issue,id_lembaga,deskripsi,deadline,alasan FROM issues';
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



