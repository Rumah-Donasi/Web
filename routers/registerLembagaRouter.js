const { getView, postRegister } = require('../controllers/registerController');
const express = require('express');
const router = express.Router();

router.get('/', getView);
module.exports = router;