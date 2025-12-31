const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('../models/Article');
const { fetchArticles } = require('../services/scraperService');

dotenv.config();

const manualScrape = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        console.log('Fetching articles...');
        const scrapedData = await fetchArticles();
        console.log(`Fetched ${scrapedData.length} articles.`);

        if (scrapedData.length === 0) {
            console.log('No articles found.');
            process.exit(0);
        }

        let savedCount = 0;
        for (const data of scrapedData) {
            // Check if already exists
            const exists = await Article.findOne({ url: data.url });
            if (!exists) {
                await Article.create({
                    title: data.title,
                    content: data.content,
                    url: data.url,
                    status: 'pending'
                });
                savedCount++;
            }
        }

        console.log(`Saved ${savedCount} new articles.`);
        process.exit(0);
    } catch (error) {
        console.error('Manual Scrape Failed:', error);
        process.exit(1);
    }
};

manualScrape();
