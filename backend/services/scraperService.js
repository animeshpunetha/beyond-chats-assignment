const axios = require('axios');
const cheerio = require('cheerio');

const fetchArticles = async (limit = 5) => {
    console.log(`DEBUG: fetchArticles called with reverse pagination (Limit: ${limit})`);
    try {
        const baseUrl = 'https://beyondchats.com/blogs/';

        // 1. Determine the Last Page Number
        const { data: mainPageData } = await axios.get(baseUrl);
        const $ = cheerio.load(mainPageData);

        let maxPage = 1;
        // Robust check for pagination numbers
        $('.page-numbers').each((i, el) => {
            const num = parseInt($(el).text().trim());
            if (!isNaN(num) && num > maxPage) {
                maxPage = num;
            }
        });
        console.log(`Identified Last Page: ${maxPage}`);

        const articlesToFetch = [];
        const seenUrls = new Set();

        // 2. Iterate backwards from Last Page
        for (let page = maxPage; page >= 1; page--) {
            if (articlesToFetch.length >= limit) break;

            const pageUrl = page === 1 ? baseUrl : `${baseUrl}page/${page}/`;
            console.log(`Scanning page: ${pageUrl}`);

            let $page;
            if (page === 1 && page === maxPage) {
                $page = $; // Already loaded
            } else {
                try {
                    const { data } = await axios.get(pageUrl);
                    $page = cheerio.load(data);
                } catch (err) {
                    console.error(`Failed to load page ${page}: ${err.message}`);
                    continue;
                }
            }

            // Extract articles on this page
            const pageArticles = [];
            $page('h2.entry-title a').each((i, el) => {
                const title = $page(el).text().trim();
                const link = $page(el).attr('href');

                if (link) {
                    // Ensure absolute URL
                    // The site seems to use absolute URLs, but good to be safe if relative
                    // But typically they are absolute. Let's assume absolute based on previous checks.
                    if (!seenUrls.has(link)) {
                        seenUrls.add(link);
                        pageArticles.push({ title, url: link });
                    }
                }
            });

            // 3. Reverse order: Bottom to Top (Oldest on page first)
            pageArticles.reverse();

            // Add to main list until limit required
            for (const article of pageArticles) {
                if (articlesToFetch.length < limit) {
                    articlesToFetch.push(article);
                } else {
                    break;
                }
            }
        }

        console.log(`Found ${articlesToFetch.length} articles to scrape.`);

        // 4. Scrape Content for collected articles
        const results = [];
        for (const article of articlesToFetch) {
            console.log(`Scraping content: ${article.title}`);
            const content = await scrapeUrl(article.url);
            results.push({
                ...article,
                content: content || 'Content not found',
                date: new Date()
            });
        }

        return results;

    } catch (error) {
        console.error('Scraping Error:', error.message);
        throw error;
    }
};

// ... existing code ...

const scrapeUrl = async (url) => {
    try {
        // Simple cheerio scrape first
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        // Remove scripts, styles
        $('script').remove();
        $('style').remove();
        $('nav').remove();
        $('footer').remove();
        $('header').remove();

        // Try to find main content
        const content = $('p').map((i, el) => $(el).text()).get().join('\n\n');
        return content;
    } catch (error) {
        console.error(`Failed to scrape ${url}:`, error.message);
        return null;
    }
};

module.exports = { fetchArticles, scrapeUrl };
