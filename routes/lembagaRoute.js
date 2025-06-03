const express = require('express');
const router = express.Router();
const {
  index,
  createIssue,
  issue,
  issues,
  updateIssue,
  deleteIssue,
  inbox,
  keluar,
} = require('../controllers/lembagaController');

router.get('/', index)
  .get('/createIssue', createIssue)
  .post('/createIssue', createIssue)
  .get('/issues', issues)
  .get('/issue/:id', issue)
  .post('/issue/:id', updateIssue)
  .post('/issue/:id/delete', deleteIssue)
  .post('/issue/:id/update', updateIssue)
  .get('/inbox', inbox)
  .get('/keluar', keluar)

module.exports = router;