const express = require('express');
const {
    awalLembaga
} = require('../controllers/lembagaController');
const {
    cekLogin,
    getInfoAkun,
    authorize
} = require('../middleware/authUser');
const {
    login,
    register
} = require('../controllers/loginController');
const {
    createIssue,
    homeCreate
} = require('../controllers/issueController');
const router = express.Router();

router.get("/", authorize("lembaga"), getInfoAkun, awalLembaga);
router.get("/register", (req, res) => res.render("pages/logres", { usertype: "lembaga", err: {}}));
router.post("/register", register('lembaga'));
router.get("/galangDana", cekLogin, getInfoAkun, homeCreate);
router.post("/galangDana", getInfoAkun, createIssue);

module.exports = router;