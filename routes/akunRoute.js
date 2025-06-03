const express = require('express');
const {
    histori,
    pesan,
    akun
} = require('../controllers/akunController');
const router = express.Router();

router.get("/histori", histori);
router.get("/pesan", pesan);
router.get("/", akun);

module.exports = router;