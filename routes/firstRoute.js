const express = require('express');
const {
    login,
    register
} = require('../controllers/loginController');
const { awalBanget } = require('../controllers/awalController');
const { cekLogin, checkNotUsertype } = require('../middleware/authUser');
const router = express.Router();

router.get("/", checkNotUsertype("lembaga"), awalBanget);
router.get("/tentang-kami", checkNotUsertype("lembaga"), (req, res) => res.render("pages/tentang"));
router.get("/kontak", checkNotUsertype("lembaga"), (req, res) => res.render("pages/kontak"));
router.get("/register", (req, res) => res.render("pages/logres", { err: {}, usertype: "user"}));
router.post("/register", register('user'));
router.get("/login", (req, res) => res.render("pages/logres", { err: {}}));
router.post("/login", login);
router.get('/keluar', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;