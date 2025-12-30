const express = require('express');
const router = express.Router();
const { scrapeAndSaveArticles, getAllArticles, getArticleById } = require('../controllers/articleController');

router.post('/scrape', scrapeAndSaveArticles);
router.get('/', getAllArticles);
router.get('/:id', getArticleById);

module.exports = router;
