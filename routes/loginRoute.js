const express = require('express');
const {
    login,
    register
} = require('../controllers/loginController');
const router = express.Router();

router.get("/register", (req, res) => res.render("pages/logres", { err: {}, usertype: "user"}));
router.post("/register", register('user'));
router.get("/login", (req, res) => res.render("pages/logres", { err: {}}));
router.post("/login", login);
router.get('/keluar', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;