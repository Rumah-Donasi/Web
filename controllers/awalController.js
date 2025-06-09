const db = require('../config/db');

const awalBanget = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * 
            FROM issues
            WHERE isPilihan = true
            LIMIT 4
        `);
        req.issues = result.rows.map(issue => {
            const progress = Math.round((issue.terkumpul / issue.target) *100);
            return {
                ...issue,
                progress
            }
        });

        const random = await db.query(`
            SELECT * FROM issues
            ORDER BY RANDOM()
            LIMIT 4
        `);
        req.random = random.rows.map(issue => {
            const progress = Math.round((issue.terkumpul / issue.target) *100);
            return {
                ...issue,
                progress
            }
        });

        const mendesak = await db.query(`
           SELECT * FROM issues
           WHERE prioritas='high'
           ORDER BY RANDOM()
           LIMIT 4 
        `);
        req.mendesak = mendesak.rows.map(issues => {
            const progress = Math.round((issue.terkumpul / issue.target) *100);
            return {
                ...issue,
                progress
            }
        });

        res.render('pages/index.ejs', {


            issues: req.issues,
            random: req.random,
            mendesak: req.mendesak
        });
    } catch (err) {
        res.render('pages/error', {
            error: err
        });
    }
};

module.exports = { awalBanget };