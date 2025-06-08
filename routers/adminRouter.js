const express = require('express');
const { getVerifikasi } = require('../controllers/adminController');
const { adminLogin } = require('../controllers/loginController');
const router = express.Router();

router.get('/verifikasi', getVerifikasi);
router.post('/loginadmin', adminLogin);
module.exports = router;