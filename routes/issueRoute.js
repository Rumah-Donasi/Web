const express = require('express');
const router = express.Router();
const {
  getIssueById
} = require('../controllers/issueController');

router.get('/:id', getIssueById);

module.exports = router;