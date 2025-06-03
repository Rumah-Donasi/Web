const express = require('express');
const {
    awalBanget
} = require('../controllers/awalController');
const router = express.Router();

router.get("/", awalBanget);

module.exports = router;