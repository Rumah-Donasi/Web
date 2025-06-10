const path=require('path');
const express = require('express');
const { 
  getVerifikasi,
  getHistory,
  getIssue, 
  admlogout
} = require('../controllers/adminController');
const { adminLogin } = require('../controllers/loginController');
const router = express.Router();

//redirect /admin to admintool.html
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../private/admintool.html'));
});

router.get('/verifikasi', getVerifikasi);
router.get('/history', getHistory);
router.get('/issue', getIssue);
router.get('/logout',admlogout);
module.exports = router;