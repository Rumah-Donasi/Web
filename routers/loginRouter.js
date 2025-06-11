const { getView, postLogin } = require('../controllers/loginController');
const express = require('express');
const router = express.Router();

router.get('/', getView);
router.post('/', postLogin);

module.exports = router;