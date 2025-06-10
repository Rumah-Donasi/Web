const express = require('express');
<<<<<<< HEAD
const router = express.Router();
const {
  index,
  createIssue,
  issue,
  issues,
  updateIssue,
  deleteIssue,
  inbox,
  keluar,
} = require('../controllers/lembagaController');

router.get('/', index)
  .get('/createIssue', createIssue)
  .post('/createIssue', createIssue)
  .get('/issues', issues)
  .get('/issue/:id', issue)
  .post('/issue/:id', updateIssue)
  .post('/issue/:id/delete', deleteIssue)
  .post('/issue/:id/update', updateIssue)
  .get('/inbox', inbox)
  .get('/keluar', keluar)
=======
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
>>>>>>> origin/front_end

module.exports = router;