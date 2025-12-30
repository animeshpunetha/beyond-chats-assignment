const puppeteer = require('puppeteer');
const fs = require('fs');

const debugSearch = async () => {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        await page.goto('https://www.google.com/search?q=AI+in+Healthcare', { waitUntil: 'domcontentloaded' });

        const content = await page.content();
        fs.writeFileSync('debug_google.html', content);
        console.log('HTML dumped to debug_google.html');

        await browser.close();
    } catch (error) {
        console.error('Debug Error:', error);
    }
};

debugSearch();
