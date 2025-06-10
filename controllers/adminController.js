const {pool} = require ('../database/db.js')
qverify='SELECT id_lembaga,nama_lembaga,verifikasi FROM lembaga';
exports.getVerifikasi = async (req, res) => {
    try {
        const data = await pool.query(qverify);
        res.json(data.rows);
    } catch (error) {
        console.error("Query error:", error);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
};

