const { rootRedirect } = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.get('/', rootRedirect);

module.exports = router;