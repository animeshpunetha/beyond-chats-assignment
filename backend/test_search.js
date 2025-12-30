const { searchGoogle } = require('./services/searchService');
const { scrapeUrl } = require('./services/scraperService');

const testSearchAndScrape = async () => {
    try {
        const query = 'AI in Healthcare';
        console.log(`Testing search for: ${query}`);
        const results = await searchGoogle(query);

        console.log(`Found ${results.length} results.`);
        results.forEach((r, i) => console.log(`${i + 1}. ${r.title} - ${r.link}`));

        if (results.length > 0) {
            const firstLink = results[0].link;
            if (firstLink) {
                console.log(`\nTesting scrape for: ${firstLink}`);
                const content = await scrapeUrl(firstLink);
                console.log('Content preview:');
                console.log(content ? content.substring(0, 200) + '...' : 'Failed to scrape.');
            }
        }
    } catch (error) {
        console.error('Test Failed:', error);
    }
};

testSearchAndScrape();
