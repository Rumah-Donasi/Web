const db = require('../config/db');

// Search Pilihan
const searchPilihan = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM issues WHERE isPilihan = true');
        res.render("pages/search", {
            user: { name: "Egit", image: null },
            issues: result.rows || [],
            query: "Campaign Pilihan"
        });
    } catch (error) {
        console.log(error);
        res.render("../views/pages/error.ejs", {
            error: error
        });
    }
};

const searchQuery = async (req, res) => {
    try {
        const { q: query } = req.query;
        const result = await db.query(
            'SELECT * FROM issues WHERE nama_issue ILIKE $1',
            [`%${query}%`]
        );

        res.render("pages/search", {
            user: { name: "Egit", image: null },
            issues: result.rows || [],
            query
        });
    } catch (error) {
        console.log(error);
        res.render("pages/error", {
            error
        });
    }
};


module.exports = { searchPilihan, searchQuery };