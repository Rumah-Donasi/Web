const express = require('express');
const {
    awalLembaga,
    index,
    issue,
    issues,
    updateIssue,
    deleteIssue,
    inbox,
    keluar
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
    upload,
    createIssue,
    homeCreate
} = require('../controllers/issueController');
const router = express.Router();

router.get("/", authorize("lembaga"), getInfoAkun, awalLembaga)
  .get('/createIssue', createIssue)
  .post('/createIssue', upload.single('thumbnail'), createIssue)
  .get('/issues', issues)
  .get('/issue/:id', issue)
  .post('/issue/:id', updateIssue)
  .post('/issue/:id/delete', deleteIssue)
  .post('/issue/:id/update', updateIssue)
  .get('/inbox', inbox)
  .get('/keluar', keluar)
router.get("/register", (req, res) => res.render("pages/logres", { usertype: "lembaga", err: {}}));
router.post("/register", register('lembaga'));
router.get("/galangDana", cekLogin, getInfoAkun, homeCreate);
router.post("/galangDana", getInfoAkun, createIssue);

module.exports = router;