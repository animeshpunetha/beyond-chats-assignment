const axios = require('axios');

const verify = async () => {
    console.log('Starting verification...');

    // 1. Check Manifest
    try {
        const manifestRes = await axios.get('http://localhost:5173/manifest.webmanifest');
        if (manifestRes.status === 200) {
            console.log('✅ Manifest is accessible.');
        } else {
            console.error('❌ Manifest returned status:', manifestRes.status);
        }
    } catch (err) {
        console.error('❌ Failed to fetch manifest:', err.message);
    }

    // 2. Trigger Scrape
    try {
        console.log('Triggering scrape...');
        const scrapeRes = await axios.post('http://localhost:5000/api/articles/scrape');
        if (scrapeRes.status === 201) {
            console.log('✅ Scrape successful.');
            console.log('Response:', scrapeRes.data);
        } else {
            console.error('❌ Scrape returned status:', scrapeRes.status);
        }
    } catch (err) {
        console.error('❌ Scrape failed:', err.message);
        if (err.response) {
            console.error('Error data:', err.response.data);
        }
    }
};

verify();
