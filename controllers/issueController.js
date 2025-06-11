const db = require('../config/db');

const homeCreate = async (req, res) => {
    try {
        res.render('pages/createIssue', { tipe: 'def', prioritas: 'def', err: {} });
    } catch (error) {
        console.log(error);
        res.render("pages/error", { error: error });
    }
};

const createIssue = async (req, res) => {
    try {
        const {
            nama_issue,
            tipe,
            prioritas,
            deskripsi,
            target,
            deadline
        } = req.body;

        const jumlah = parseInt(target.replace(/\./g, ''), 10);
        const thumbnail = req.file ? req.file.buffer : null;

        if(!nama_issue){
            return res.render("pages/createIssue", {
                nama_issue,
                tipe,
                prioritas,
                deskripsi,
                thumbnail,
                target,
                deadline,
                err: { nama_issue: "Nama Issue harus diisi" }
            });
        }
        if(!tipe){
            return res.render("pages/createIssue", {
                nama_issue,
                tipe,
                prioritas,
                deskripsi,
                thumbnail,
                target,
                deadline,
                err: { nama_issue: "Nama Issue harus diisi" }
            });
        }
        if(!deskripsi){
            return res.render("pages/createIssue", {
                nama_issue,
                tipe,
                prioritas,
                deskripsi,
                thumbnail,
                target,
                deadline,
                err: { nama_issue: "Nama Issue harus diisi" }
            });
        }
        if(!target){
            return res.render("pages/createIssue", {
                nama_issue,
                tipe,
                prioritas,
                deskripsi,
                thumbnail,
                target,
                deadline,
                err: { nama_issue: "Nama Issue harus diisi" }
            });
        }
        if(!deadline){
            return res.render("pages/createIssue", {
                nama_issue,
                tipe,
                prioritas,
                deskripsi,
                thumbnail,
                target,
                deadline,
                err: { nama_issue: "Nama Issue harus diisi" }
            });
        }
        if (!thumbnail) {
            return res.render("pages/createIssue", {
                nama_issue,
                tipe,
                prioritas,
                deskripsi,
                thumbnail,
                target,
                deadline,
                err: { thumbnail: "Thumbnail harus diisi" }
            });
        }

        if (isNaN(jumlah)) {
            return res.render("pages/createIssue", {
                nama_issue,
                tipe,
                prioritas,
                deskripsi,
                target,
                deadline,
                err: { target: "Target harus berupa angka" }
            });
        }

        if (new Date(deadline) < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Deadline harus lebih besar dari hari ini"
            });
        }

        const insertQuery = `
            INSERT INTO issues (nama_issue, tipe, prioritas, deskripsi, thumbnail, target, deadline, id_pembuat)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `;
        const values = [
            nama_issue,
            tipe,
            prioritas,
            deskripsi,
            thumbnail,
            jumlah,
            deadline,
            req.user.id
        ];

        console.log(values);

        db.query(insertQuery, values, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Terjadi kesalahan pada server"
                });
            }
            res.redirect('/lembaga');
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error server" });
    }
};

const homeUpdate = async (req, res) => {
    try {
        const { id } = req.params;

        const issue = await db.query('SELECT * FROM issues WHERE id_issue = $1', [id]);
        if (issue.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Issue tidak ditemukan"
            });
        }
        
        res.render('pages/createIssue', { 
            id_issue : issue.rows[0].id_issue,
            nama_issue : issue.rows[0].nama_issue,
            tipe : issue.rows[0].tipe,
            prioritas : issue.rows[0].prioritas,
            deskripsi : issue.rows[0].deskripsi,
            target : issue.rows[0].target,
            deadline : issue.rows[0].deadline.toISOString().split('T')[0],
            err: {} 
        });
    } catch (error) {
        console.log(error);
        res.render("pages/error", { error: error });
    }
}

const updateIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nama_issue,
            tipe,
            prioritas,
            deskripsi,
            target,
            deadline
        } = req.body;

        const jumlah = parseInt(target.replace(/\./g, ''), 10);
        const thumbnail = req.file ? req.file.buffer : null;

        if(!nama_issue){
            return res.render("pages/createIssue", {
                nama_issue,
                tipe,
                prioritas,
                deskripsi,
                thumbnail,
                target,
                deadline,
                err: { nama_issue: "Nama Issue harus diisi" }
            });
        }
        if(!tipe){
            return res.render("pages/createIssue", {
                nama_issue,
                tipe,
                prioritas,
                deskripsi,
                thumbnail,
                target,
                deadline,
                err: { nama_issue: "Nama Issue harus diisi" }
            });
        }
        if(!deskripsi){
            return res.render("pages/createIssue", {
                nama_issue,
                tipe,
                prioritas,
                deskripsi,
                thumbnail,
                target,
                deadline,
                err: { nama_issue: "Nama Issue harus diisi" }
            });
        }
        if(!target){
            return res.render("pages/createIssue", {
                nama_issue,
                tipe,
                prioritas,
                deskripsi,
                thumbnail,
                target,
                deadline,
                err: { nama_issue: "Nama Issue harus diisi" }
            });
        }

        const issueCheck = await db.query('SELECT * FROM issues WHERE id_issue = $1', [id]);
        if (issueCheck.rows.length === 0) {
            return res.render("pages/error", { error: "Issue tidak ditemukan" });
        }

        const fields = ['nama_issue', 'tipe', 'prioritas', 'thumbnail', 'target', 'deadline', 'deskripsi'];
        const updates = [];
        const values = [];
        let paramIndex = 1;

        fields.forEach(field => {
            if(field=='target'){
                if(isNaN(jumlah)){
                    return res.render("pages/error", { error: "Target harus berupa angka" });
                }
                updates.push(`${field} = $${paramIndex++}`);
                values.push(jumlah);
            } else if (field == 'thumbnail') {
                if (thumbnail) {
                    updates.push(`${field} = $${paramIndex++}`);
                    values.push(thumbnail);
                }
            }
            else if (req.body[field] !== undefined) {
                updates.push(`${field} = $${paramIndex++}`);
                values.push(req.body[field]);
            }
        });

        console.log(updates);

        if (updates.length === 0) {
            res.render("pages/error", { error: "Tidak ada data yang diubah" });
        }

        values.push(id);

        const updateQuery = `
            UPDATE issues
            SET ${updates.join(', ')}
            WHERE id_issue = $${paramIndex}
            RETURNING *;
        `;

        console.log(updateQuery);

        const result = await db.query(updateQuery, values);

        return res.redirect('/lembaga/' + id);

    } catch (error) {
        return res.render("pages/error", { error: error });
    }
};

module.exports = {
    createIssue,
    updateIssue,
    homeCreate,
    homeUpdate
}