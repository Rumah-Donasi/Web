const db = require('../config/db');

const pilihanIssue = async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT * 
            FROM issues
            WHERE isPilihan = true
            LIMIT 4;
        `);

        req.issues = result.rows.map(issue => {
            const progress = Math.round((issue.terkumpul / issue.target) * 100);
            return {
                ...issue,
                progress
            };
        });

        const random = await db.query(`
            SELECT * FROM issues
            ORDER BY RANDOM()
            LIMIT 4
        `);

        req.random = random.rows.map(issue => {
            const progress = Math.round((issue.terkumpul / issue.target) * 100);
            return {
                ...issue,
                progress
            };
        });
        next();
    } catch (error) {
        console.log(error);
        res.render("../views/pages/error.ejs", {
            error: error
        });
    }
};

const randomIssue = async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT * 
            FROM issues
            WHERE isPilihan = true
            LIMIT 4;
        `);

        const issues = result.rows.map(issue => {
            const progress = Math.round((issue.terkumpul / issue.target) * 100);
            return {
                ...issue,
                progress
            };
        });

        req.issues = random;
        next();
    } catch (error) {
        console.log(error);
        res.render("../views/pages/error.ejs", {
            error: error
        });
    }
};

const getIssue = async (req, res, next) => {
    try {
        const id = req.params.id;

        // Ambil data campaign/issue
        const issueResult = await db.query(`
            SELECT * FROM issues
            WHERE id_issue = $1
        `, [id]);

        if (issueResult.rows.length === 0) {
            return res.status(404).render("pages/error", {
                error: "Campaign tidak ditemukan."
            });
        }

        const issue = issueResult.rows[0];

        // Hitung progress
        const progress = Math.round((issue.terkumpul / issue.target) * 100);

        // Ambil data donatur
        const donaturResult = await db.query(`
            SELECT * FROM detail_donasi
            WHERE id_issue = $1
            ORDER BY tanggal DESC
            LIMIT 5
        `, [id]);

        // Gabungkan semua ke dalam satu objek
        req.issue = {
            ...issue,
            progress,
        };

        req.donatur = donaturResult.rows;

        next();
    } catch (error) {
        console.error(error);
        res.status(500).render("pages/error", {
            error: "Terjadi kesalahan pada server."
        });
    }
};

module.exports = getIssue;
module.exports = randomIssue;
module.exports = pilihanIssue;
