const express = require('express');
const {
    histori,
    pesan,
    akun,
    editProfile,
    editProfileHome
} = require('../controllers/akunController');
const {
    cekLogin,
    getInfoAkun
} = require('../middleware/authUser');
const router = express.Router();

router.get("/histori", cekLogin, histori);
router.get("/pesan", cekLogin, pesan);
router.get("/", cekLogin, getInfoAkun, akun);
router.get("/editProfile", cekLogin, getInfoAkun, editProfileHome);
router.post("/editProfile", cekLogin, editProfile);

module.exports = router;