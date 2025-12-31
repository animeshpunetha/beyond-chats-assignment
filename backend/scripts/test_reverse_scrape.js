const { fetchArticles } = require('../services/scraperService');
const mongoose = require('mongoose');
const Article = require('../models/Article');
const connectDB = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

const testScrape = async () => {
    try {
        await connectDB();
        console.log('Testing reverse pagination scrape (Limit: 5)...');

        const articles = await fetchArticles(5);

        console.log(`Fetched ${articles.length} articles.`);
        articles.forEach((a, i) => {
            console.log(`[${i + 1}] ${a.title} (${a.url})`);
        });

        // Optional: Save to DB
        for (const art of articles) {
            const exists = await Article.findOne({ url: art.url });
            if (!exists) {
                await Article.create({
                    ...art,
                    status: 'pending'
                });
                console.log(`Saved: ${art.title}`);
            } else {
                console.log(`Exists: ${art.title}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

testScrape();
