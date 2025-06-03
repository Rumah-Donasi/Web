const express = require('express');
const {
    createIssue,
    rejectIssue,
    accIssue,
    updateIssue,
    deleteIssue,
    homeCreate
} = require('../controllers/issueController');
const router = express.Router();

router.get("/galangDana", homeCreate);
router.post("/galangDana", createIssue);

module.exports = router;