const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('../models/Article');
const { searchGoogle } = require('../services/searchService');
const { scrapeUrl } = require('../services/scraperService');
const { enhanceContent } = require('../services/llmService');
const connectDB = require('../config/db');

dotenv.config();

const runEnhancement = async () => {
    try {
        await connectDB();

        // Find pending articles
        const articles = await Article.find({ status: 'pending' });

        if (articles.length === 0) {
            console.log('No pending articles found.');
            process.exit(0);
        }

        for (const article of articles) {
            console.log(`Processing article: ${article.title}`);

            // 1. Search Google (DuckDuckGo fallback)
            const searchResults = await searchGoogle(article.title);
            console.log(`Found ${searchResults.length} related articles.`);

            const references = [];

            // 2. Scrape Reference Content
            for (const result of searchResults) {
                console.log(`Scraping reference: ${result.link}`);
                const content = await scrapeUrl(result.link);
                if (content) {
                    references.push({
                        title: result.title,
                        link: result.link,
                        content: content
                    });
                }
            }

            if (references.length === 0) {
                console.log('Could not fetch reference content. Proceeding without references.');
                // Proceed anyway, but maybe add a note to the prompt? 
                // The prompt variable construction handles empty referencesText gracefully-ish (it will be empty string).
            }

            // 3. Call LLM
            console.log('Sending to LLM for enhancement...');
            const enhancedText = await enhanceContent(article, references);

            // 4. Update Database
            article.updatedContent = enhancedText;
            article.referenceLinks = references.map(r => r.link);
            article.status = 'completed';
            await article.save();

            console.log(`Successfully enhanced: ${article.title}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Enhancement Script Failed:', error);
        process.exit(1);
    }
};

runEnhancement();
