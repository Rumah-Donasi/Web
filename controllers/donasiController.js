const db = require("../config/db");

const getKirimDonasi = (req, res) => {
  res.render("pages/donasiView", { id: req.params.id, err: {} });
  console.log("Rendering donasi view for ID:", req.params.id);
};

const postKirimDonasi = (req, res) => {
  const { id_issue, nominal, pesan, metode, nama_donatur } = req.body;

  // Logic untuk mengirimkan data donasi
  console.log("Data Donasi:", { id_issue, nominal, pesan, nama_donatur });

  db.query(
    `INSERT INTO detail_donasi (id_issue, id_user, nama_donatur, jumlah_bayar, pesan, tanggal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
    [id_issue, req?.user?.id, nama_donatur, nominal, pesan, new Date()]
  )

  db.query(
    `UPDATE issues
   SET terkumpul = COALESCE(terkumpul, 0) + $1
   WHERE id_issue = $2`,
    [nominal, id_issue]
  );

  res.redirect(`/detail/${id_issue}`);
};

module.exports = {
  getKirimDonasi,
  postKirimDonasi
};
