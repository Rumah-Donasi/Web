const { getView } = require('../controllers/loginController');
const express = require('express');
const router = express.Router();

router.get('/', getView);

module.exports = router;