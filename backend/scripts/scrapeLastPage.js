const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Article = require('../models/Article');
const { scrapeUrl } = require('../services/scraperService');

dotenv.config();

const scrapeLastPage = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const baseUrl = 'https://beyondchats.com/blogs/';
        console.log(`Fetching main blog page: ${baseUrl}`);

        const { data: mainPageData } = await axios.get(baseUrl);
        const $ = cheerio.load(mainPageData);

        // Find the last page number
        // Selector provided by browser agent check: ".page-numbers"
        let maxPage = 1;
        $('.page-numbers').each((i, el) => {
            const num = parseInt($(el).text().trim());
            if (!isNaN(num) && num > maxPage) {
                maxPage = num;
            }
        });

        console.log(`Identified last page: ${maxPage}`);
        const lastPageUrl = `${baseUrl}page/${maxPage}/`;
        console.log(`Scraping last page: ${lastPageUrl}`);

        const { data: lastPageData } = await axios.get(lastPageUrl);
        const $$ = cheerio.load(lastPageData);

        const articlesToSave = [];

        // Selector from browser agent: ".ct-media-container" or "h2.entry-title a"
        // Let's use a robust strategy finding standard loop containers
        // The browser agent found "h2.entry-title a" is good for titles/links

        const seenLinks = new Set();

        $$('h2.entry-title a').each((i, el) => {
            const title = $$(el).text().trim();
            const link = $$(el).attr('href');

            if (link && !seenLinks.has(link)) {
                seenLinks.add(link);
                articlesToSave.push({ title, url: link });
            }
        });

        console.log(`Found ${articlesToSave.length} articles on the last page.`);

        for (const articleInfo of articlesToSave) {
            // Check if exists
            const existing = await Article.findOne({ url: articleInfo.url });
            if (existing) {
                console.log(`Article already exists: ${articleInfo.title}`);
                continue;
            }

            console.log(`Scraping content for: ${articleInfo.title}`);
            const content = await scrapeUrl(articleInfo.url);

            if (content) {
                await Article.create({
                    title: articleInfo.title,
                    url: articleInfo.url,
                    content: content,
                    status: 'pending' // Ready for enhancement
                });
                console.log(`Saved: ${articleInfo.title}`);
            } else {
                console.log(`Failed to scrape content for: ${articleInfo.title}`);
            }
        }

        console.log('Last page processing complete.');
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

scrapeLastPage();
