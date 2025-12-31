const Article = require('../models/Article');
const { fetchArticles } = require('../services/scraperService');
const { processArticle } = require('../services/processService');

// @desc Scrape and save articles
// @route POST /api/articles/scrape
// @access Public
const scrapeAndSaveArticles = async (req, res) => {
    try {
        const scrapedData = await fetchArticles();
        const savedArticles = [];

        for (const data of scrapedData) {
            // Check if already exists
            const exists = await Article.findOne({ url: data.url });
            if (!exists) {
                const article = await Article.create({
                    title: data.title,
                    content: data.content,
                    url: data.url,
                    status: 'pending'
                });
                savedArticles.push(article);

                // Trigger automatic enhancement in background
                // We do NOT await this, so the UI returns quickly.
                processArticle(article).catch(err => console.error('Background process error:', err));
            }
        }

        res.status(201).json({
            message: `Scraped and saved ${savedArticles.length} new articles. Enhancement started in background.`,
            articles: savedArticles
        });
    } catch (error) {
        res.status(500).json({ message: 'Scraping failed', error: error.message });
    }
};

// @desc Get all articles
// @route GET /api/articles
// @access Public
const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc Get single article
// @route GET /api/articles/:id
// @access Public
const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    scrapeAndSaveArticles,
    getAllArticles,
    getArticleById
};
