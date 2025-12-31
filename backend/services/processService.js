const { searchGoogle } = require('./searchService');
const { scrapeUrl } = require('./scraperService');
const { enhanceContent } = require('./llmService');

const processArticle = async (article) => {
    console.log(`[ProcessService] Starting enhancement for: ${article.title}`);

    try {
        // 1. Search Google (DuckDuckGo fallback)
        const searchResults = await searchGoogle(article.title);
        console.log(`[ProcessService] Found ${searchResults.length} related articles.`);

        const references = [];

        // 2. Scrape Reference Content
        for (const result of searchResults) {
            console.log(`[ProcessService] Scraping reference: ${result.link}`);
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
            console.log('[ProcessService] Could not fetch reference content. Proceeding without references.');
        }

        // 3. Call LLM
        console.log('[ProcessService] Sending to LLM for enhancement...');
        const enhancedText = await enhanceContent(article, references);

        // 4. Update Database
        article.updatedContent = enhancedText;
        article.referenceLinks = references.map(r => r.link);
        article.status = 'completed';
        await article.save();

        console.log(`[ProcessService] Automatically enhanced: ${article.title}`);
    } catch (error) {
        console.error(`[ProcessService] Failed to enhance article ${article._id}:`, error);
        article.status = 'failed';
        await article.save();
    }
};

module.exports = { processArticle };
