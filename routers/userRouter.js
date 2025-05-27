const { landingPageView, issuesView, issueView, profileView } = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.get('/', landingPageView);
router.get('/issues', issuesView);
router.get('/issue/:id', issueView);
router.get('/profile', profileView);