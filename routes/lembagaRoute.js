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
    homeCreate,
    updateIssue,
    homeUpdate
} = require('../controllers/issueController');
const router = express.Router();

router.get("/", authorize("lembaga"), getInfoAkun, awalLembaga);
router.get("/galangDana", authorize("lembaga"), getInfoAkun, homeCreate);
router.post("/galangDana", authorize("lembaga"), getInfoAkun, upload.single('thumbnail'), createIssue);
router.get("/:id", authorize("lembaga"), detailDonasi);
router.get("/edit/:id", authorize("lembaga"), homeUpdate );
router.post("/edit/:id", authorize("lembaga"), getInfoAkun, upload.single('thumbnail'), updateIssue);

module.exports = router;