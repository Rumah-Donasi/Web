require ('../database/db.js')
exports.getVerifikasi = async (req, res) => {
    const data = await db.query('SELECT id_lembaga,nama_lembaga,verifikasi FROM lembaga'); // Example
    res.json(data.rows);
};