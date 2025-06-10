const db = require('../config/db');

// Search Pilihan
const searchPilihan = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM issues WHERE isPilihan = true');
        res.render("pages/search", {
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

// Search Mendesak
const searchMendesak = async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM issues WHERE prioritas_donasi = 'high'`);
        res.render("pages/search", {
            issues: result.rows || [],
            query: "Kebutuhan Mendesak"
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
            issues: result.rows || [],
            query
        });
    } catch (error) {
        console.log(error);
        res.render("pages/error", {
            error: error
        });
    }
};


module.exports = { searchPilihan, searchMendesak, searchQuery };