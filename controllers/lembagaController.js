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

        const formatRupiah = (angka) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(angka);
        };

        req.issues = result.rows.map(issue => {
            const progress = (issue.terkumpul / issue.target) * 100;

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
                hariTersisa: hariTersisa,
                targetFormatted: formatRupiah(issue.target),
                terkumpulFormatted: formatRupiah(issue.terkumpul)
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

    const formatRupiah = (angka) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(angka);
    };

    const result = await db.query(`
      SELECT i.*, u.username
      FROM issues i
      LEFT JOIN users u ON i.id_pembuat = u.id_user
      WHERE i.id_issue = $1
    `, [id]);

    const donaturResult = await db.query(`
      SELECT nama_donatur AS nama, jumlah_bayar AS nominal, tanggal
      FROM detail_donasi
      WHERE id_issue = $1
      ORDER BY tanggal DESC
    `, [id]);

    const timeAgo = (date) => {
      const now = new Date();
      const diff = Math.floor((now - new Date(date)) / 1000);
      if (diff < 60) return `${diff} detik yang lalu`;
      if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
      return `${Math.floor(diff / 86400)} hari yang lalu`;
    };

    const donatur = donaturResult.rows.map(d => ({
      ...d,
      waktu: timeAgo(d.tanggal)
    }));

    const issues = result.rows.map(issue => {
      const progress = (issue.terkumpul / issue.target) * 100;

      let hariTersisa = 0;
      if (issue.deadline) {
        const deadline = new Date(issue.deadline);
        const now = new Date();
        const diffTime = deadline.getTime() - now.getTime();
        hariTersisa = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      let imageSrc = null;
      if (issue.thumbnail) {
        const base64Image = issue.thumbnail.toString('base64');
        imageSrc = `data:image/jpeg;base64,${base64Image}`;
      }

      return {
        ...issue,
        progress,
        thumbnail: imageSrc,
        hariTersisa,
        targetFormatted: formatRupiah(issue.target),
        terkumpulFormatted: formatRupiah(issue.terkumpul)
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
            const progress = (issue.terkumpul / issue.target) * 100;

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
                targetFormatted: formatRupiah(issue.target),
                terkumpulFormatted: formatRupiah(issue.terkumpul)
            };
        });

    if (issues.length > 0) {
      res.render('pages/viewIssue', {
        issues: issues[0],
        donatur,
        random: req.random
      });
    } else {
      res.render('pages/error', { error: 'Data tidak ditemukan' });
    }

  } catch (error) {
    console.error(error);
    res.render('pages/error', { error });
  }
};

const akunLembaga = async (req, res) => {
  if (req.method === 'GET' || req.method === 'get') {
    const id = res.locals.user.id_user;

    const result = await db.query(`
      SELECT * FROM users WHERE id_user = $1
    `, [id]);

    if (result.rows.length > 0) {
      res.render('pages/akunLembaga', { user: result.rows[0] });
    } else {
      res.render('pages/error', { error: 'Akun tidak ditemukan' });
    }
  }
  else if (req.method === 'POST' || req.method === 'post') {
    const { username, email, telp_user, alamat, deskripsi } = req.body;
    const id = res.locals.user.id_user;

    try {
      await db.query(`
        UPDATE users 
        SET username = $1, email = $2, telp_user = $3, alamat = $4, deskripsi = $5
        WHERE id_user = $6
      `, [username, email, telp_user, alamat, deskripsi, id]);

      res.redirect('/lembaga/akun');
    } catch (error) {
      console.error(error);
      res.render('pages/error', { error: 'Gagal memperbarui akun' });
    }
  }
};

module.exports = {
    awalLembaga,
    detailDonasi,
    akunLembaga,
    detailDonasi
}
