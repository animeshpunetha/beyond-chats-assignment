const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const listModels = async () => {
    const key = process.env.GEMINI_API_KEY;
    // Try gemini-2.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;

    console.log('Testing Model: gemini-2.5-flash');

    try {
        const response = await axios.post(url, {
            contents: [{
                parts: [{ text: "Hello, are you working?" }]
            }]
        });
        console.log('Success:', response.status);
        console.log('Response:', response.data.candidates[0].content.parts[0].text);
    } catch (error) {
        console.error('List Models Failed:', error.message);
        if (error.response) {
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
};

listModels();
