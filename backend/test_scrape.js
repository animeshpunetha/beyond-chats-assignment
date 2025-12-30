const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { fetchArticles } = require('./services/scraperService');

dotenv.config();

const testScraper = async () => {
    try {
        console.log('Testing Scraper Service...');
        const articles = await fetchArticles();
        console.log(`Fetched ${articles.length} articles.`);
        if (articles.length > 0) {
            console.log('First article title:', articles[0].title);
            console.log('First article URL:', articles[0].url);
            console.log('First article content preview:', articles[0].content.substring(0, 100));
        } else {
            console.log('No articles found.');
        }
    } catch (error) {
        console.error('Scraper Test Failed:', error);
    }
};

testScraper();
