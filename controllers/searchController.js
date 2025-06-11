const db = require('../config/db');

// Search Pilihan
const searchPilihan = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM issues WHERE isPilihan = true');
        res.render("pages/search", {
            
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
        const result = await db.query(`SELECT * FROM issues WHERE prioritas = 'high'`);
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

const searchTipe = (...tipeCari) => {
    return async (req, res) => {
        try {
            const result = await db.query(
                `SELECT issues.*, users.username FROM issues
                JOIN users ON issues.id_pembuat = users.id_user
                WHERE tipe = ANY($1)`,
                [tipeCari]
            );

            const formatRupiah = (angka) => {
                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(angka);
            };

            const issues = result.rows.map(issue => {
                const progress = Math.round((issue.terkumpul / issue.target) * 100);

                let imageSrc = null;
                if (issue.thumbnail) {
                    const base64 = issue.thumbnail.toString('base64');
                    imageSrc = `data:image/jpeg;base64,${base64}`;
                }

                return {
                    ...issue,
                    progress,
                    terkumpulFormatted : formatRupiah(issue.terkumpul),
                    thumbnail: imageSrc
                };
            });

            res.render("pages/search", {
                issues : issues || [],
                query: tipeCari
            });
        } catch (error) {
            console.log(error);
            res.render("pages/error", { error });
        }
    };
};


const searchQuery = async (req, res) => {
    try {
        const { q: query } = req.query;
        const result = await db.query(
            'SELECT * FROM issues WHERE nama_issue ILIKE $1',
            [`%${query}%`]
        );

        const formatRupiah = (angka) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(angka);
        };

        const issues = result.rows.map(issue => {
            const progress = Math.round((issue.terkumpul / issue.target) * 100);

            let imageSrc = null;
            if (issue.thumbnail) {
                const base64 = issue.thumbnail.toString('base64');
                imageSrc = `data:image/jpeg;base64,${base64}`;
            }

            return {
                ...issue,
                progress,
                terkumpulFormatted : formatRupiah(issue.terkumpul),
                thumbnail: imageSrc
            };
        });

        res.render("pages/search", {
            issues,
            query
        });
    } catch (error) {
        console.log(error);
        res.render("pages/error", {
            error: error
        });
    }
};


module.exports = { searchPilihan, searchMendesak, searchQuery, searchTipe };