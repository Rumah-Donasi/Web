exports.getVerifikasi = async (req, res) => {
    const data = await db.query('SELECT * FROM verifikasi'); // Example
    res.json(data.rows);
};