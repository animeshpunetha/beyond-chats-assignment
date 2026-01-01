const puppeteer = require('puppeteer');

const searchGoogle = async (query) => {
    try {
        console.log(`Searching DuckDuckGo (Puppeteer) for: "${query}"`);
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });
        const page = await browser.newPage();

        // Mimic real browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // Use DuckDuckGo HTML version which is easier to scrape and lighter
        await page.goto(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded' });

        const results = await page.evaluate(() => {
            const items = [];
            // DDG HTML selectors
            const results = document.querySelectorAll('.result');

            results.forEach(result => {
                const titleEl = result.querySelector('.result__a');
                const linkEl = result.querySelector('.result__a');

                if (titleEl && linkEl) {
                    const title = titleEl.innerText;
                    const link = linkEl.href;

                    if (link && !link.includes('duckduckgo.com') && !link.includes('google.com')) {
                        items.push({ title, link });
                    }
                }
            });
            return items;
        });

        await browser.close();

        // Filter out beyondchats and get top 2
        const filtered = results.filter(result =>
            result.link && !result.link.includes('beyondchats.com')
        );

        return filtered.slice(0, 2);
    } catch (error) {
        console.error('DuckDuckGo Search Error:', error.message);
        return [];
    }
};

module.exports = { searchGoogle };
