const express = require('express');
const { getVerifikasi } = require('../controllers/lembagaController');
const router = express.Router();

router.get('/verifikasi', getVerifikasi);

module.exports = router;