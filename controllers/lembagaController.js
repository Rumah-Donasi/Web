const db = require('../config/db');

const awalLembaga = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                i.*, 
                COUNT(dd.id_user) AS jumlah_donatur
            FROM issues i
            LEFT JOIN detail_donasi dd ON i.id_issue = dd.id_issue
            WHERE i.id_pembuat = $1
            GROUP BY i.id_issue
        `, [res.locals.user.id_user]);

        req.issues = result.rows.map(issue => {
            const progress = Math.round((issue.terkumpul / issue.target) * 100);

            let hariTersisa = 0;
            if (issue.deadline) {
                const deadline = new Date(issue.deadline);
                const now = new Date();
                const diffTime = deadline.getTime() - now.getTime();
                hariTersisa = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Konversi ke hari
            }

            let imageSrc = null;
            if (issue.thumbnail) {
                const base64Image = issue.thumbnail.toString('base64');
                const mimeType = 'image/jpeg';
                imageSrc = `data:${mimeType};base64,${base64Image}`;
            }

            return {
                ...issue,
                progress,
                thumbnail: imageSrc,
                jumlahDonatur: parseInt(issue.jumlah_donatur, 10),
                hariTersisa: hariTersisa
            };
        });

        
        res.render('pages/awalLembaga', {
            issues: req.issues
        });
    } catch (error) {
        console.log(error);
        res.render('pages/error', {
            error: error
        });
    }
};

const detailDonasi = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT 
                i.*,
                u.username
            FROM issues i
            LEFT JOIN users u ON i.id_pembuat = u.id_user
            WHERE i.id_issue = $1
        `, [id]);

        req.issues = result.rows.map(issue => {
            const progress = Math.round((issue.terkumpul / issue.target) * 100);

            let hariTersisa = 0;
            if (issue.deadline) {
                const deadline = new Date(issue.deadline);
                const now = new Date();
                const diffTime = deadline.getTime() - now.getTime();
                hariTersisa = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Konversi ke hari
            }

            let imageSrc = null;
            if (issue.thumbnail) {
                const base64Image = issue.thumbnail.toString('base64');
                const mimeType = 'image/jpeg';
                imageSrc = `data:${mimeType};base64,${base64Image}`;
            }

            return {
                ...issue,
                progress,
                thumbnail: imageSrc,
                jumlahDonatur: parseInt(issue.jumlah_donatur, 10),
                hariTersisa: hariTersisa
            };
        });

        if (req.issues.length > 0) {
            res.render('pages/viewIssue', {
                issue: req.issues,
                donatur:{}
            });
        } else {
            res.render('pages/error', {
                error: 'Data tidak ditemukan'
            });
    }
    } catch (error) {
        console.log(error);
        res.render('pages/error', {
            error: error
        });
    }
};

module.exports = {
    awalLembaga,
    detailDonasi
}