const express = require('express');
const router = express.Router();
const { awalBanget } = require('../controllers/awalController');
const { cekLogin, checkNotUsertype } = require('../middleware/authUser');

router.get("/", checkNotUsertype("lembaga"), awalBanget);
router.get("/tentang-kami", checkNotUsertype("lembaga"), (req, res) => res.render("pages/tentang"));
router.get("/kontak", checkNotUsertype("lembaga"), (req, res) => res.render("pages/kontak"));

module.exports = router;
