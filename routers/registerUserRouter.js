const { getView, postRegister } = require('../controllers/registerUserController');
const express = require('express');
const router = express.Router();

router.get('/', getView);
router.post('/', postRegister);

module.exports = router;