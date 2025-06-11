const express = require('express');
const {
    histori,
    akun,
    editProfile,
    editProfileHome
} = require('../controllers/akunController');
const {
    authorize,
    getInfoAkun
} = require('../middleware/authUser');
const router = express.Router();
router.use(authorize("user"));

router.get("/histori", histori);
router.get("/", getInfoAkun, akun);
router.get("/editProfile", getInfoAkun, editProfileHome);
router.post("/editProfile", editProfile);

module.exports = router;