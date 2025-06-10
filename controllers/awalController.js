const db = require('../config/db');

const awalBanget = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT i.id_issue, i.nama_issue, u.username, i.terkumpul, i.target, i.thumbnail, i.deskripsi, isPilihan, prioritas, tipe
            FROM issues i
            JOIN users u 
            ON i.id_pembuat = u.id_user
            LIMIT 4
        `);

        req.issues = result.rows.map(issue => {
            const progress = Math.round((issue.terkumpul / issue.target) * 100);

            let imageSrc = null;
            if (issue.thumbnail) {
                const base64Image = issue.thumbnail.toString('base64');
                const mimeType = 'image/jpeg';
                imageSrc = `data:${mimeType};base64,${base64Image}`;
            }

            return {
                ...issue,
                progress,
                thumbnail: imageSrc 
            };
        });


        const random = await db.query(`
            SELECT i.id_issue, i.nama_issue, u.username, i.terkumpul, i.target, i.thumbnail, i.deskripsi, isPilihan, prioritas, tipe
            FROM issues i
            JOIN users u 
            ON i.id_pembuat = u.id_user
            ORDER BY RANDOM()
            LIMIT 4
        `);
        req.random = random.rows.map(issue => {
            const progress = Math.round((issue.terkumpul / issue.target) * 100);

            let imageSrc = null;
            if (issue.thumbnail) {
                const base64Image = issue.thumbnail.toString('base64');
                const mimeType = 'image/jpeg';
                imageSrc = `data:${mimeType};base64,${base64Image}`;
            }

            return {
                ...issue,
                progress,
                thumbnail: imageSrc
            };
        });

        const mendesak = await db.query(`
            SELECT i.id_issue, i.nama_issue, u.username, i.terkumpul, i.target, i.thumbnail, i.deskripsi, isPilihan, prioritas, tipe
            FROM issues i
            JOIN users u 
            ON i.id_pembuat = u.id_user
            WHERE isPilihan = true
            LIMIT 4
        `);
        req.mendesak = mendesak.rows.map(issue => {
            const progress = Math.round((issue.terkumpul / issue.target) * 100);

            let imageSrc = null;
            if (issue.thumbnail) {
                const base64Image = issue.thumbnail.toString('base64');
                const mimeType = 'image/jpeg';
                imageSrc = `data:${mimeType};base64,${base64Image}`;
            }

            return {
                ...issue,
                progress,
                thumbnail: imageSrc
            };
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