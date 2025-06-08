const path=require('path');
const express = require('express');
const { getVerifikasi } = require('../controllers/adminController');
const { adminLogin } = require('../controllers/loginController');
const router = express.Router();

//redirect /admin to admintool.html
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../private/admintool.html'));
});

router.get('/verifikasi', getVerifikasi);
module.exports = router;