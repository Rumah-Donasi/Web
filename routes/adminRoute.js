const path=require('path');
const express = require('express');
const { 
  getVerifikasi,
  getHistory,
  getIssue, 
  admlogout,
  putVerifikasi,
  putIssue,
  deleteVerifikasi,
  deleteHistory,
  deleteIssue
} = require('../controllers/adminController');
const { cekLogin } = require('../middleware/authUser');
const router = express.Router();

//redirect /admin to admintool.html
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/html/admintool.html'));
});

router.get('/verifikasi', getVerifikasi);
router.get('/history', getHistory);
router.get('/issue', getIssue);
router.put('/updateVerifikasi', putVerifikasi);
router.put('/updateIssue', putIssue);
router.delete("/deleteVerifikasi/:id_lembaga",deleteVerifikasi);
router.delete("/deleteHistory/:id_detail",deleteHistory)
router.delete("/deleteIssue/:id_issue",deleteIssue)
router.get('/logout', cekLogin, admlogout);
module.exports = router;
