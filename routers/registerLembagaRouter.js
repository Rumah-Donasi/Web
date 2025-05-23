const { getView, postRegister } = require('../controllers/registerController');
const express = require('express');
const router = express.Router();

router.get('/', getView);
//send to registerController.js with 2 as identifier
router.post('/', (req, res, next) => {
  req.body = {...req.body, code: 2 };
  next();
}, postRegister);
module.exports = router;