const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
    awalLembaga,
    detailDonasi
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
router.get("/galangDana", authorize("lembaga"), getInfoAkun, homeCreate);
router.post("/galangDana", authorize("lembaga"), getInfoAkun, upload.single('thumbnail'), createIssue);
router.get("/:id", authorize("lembaga"), detailDonasi);

module.exports = router;