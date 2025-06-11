const { rootRedirect } = require('../controllers/rootController');
const express = require('express');
const router = express.Router();

router.get('/', rootRedirect);

module.exports = router;