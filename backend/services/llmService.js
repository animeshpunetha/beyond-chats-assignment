const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const enhanceContent = async (originalArticle, referenceArticles) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        let referencesText = '';
        referenceArticles.forEach((ref, index) => {
            referencesText += `\n[Reference ${index + 1}]:\nTitle: ${ref.title}\nLink: ${ref.link}\nContent Summary: ${ref.content ? ref.content.substring(0, 1500) : 'Content unreadable'}...\n`;
        });

        const prompt = `
        You are a professional editor and content enhancer.
        
        Your task is to rewrite and improve the following blog article.
        You must incorporate information from the provided "Reference Articles" to make the content more comprehensive, accurate, and up-to-date.
        
        Original Article Title: ${originalArticle.title}
        Original Content:
        ${originalArticle.content}
        
        Reference Articles (Top Google Search Results):
        ${referencesText}
        
        Requirements:
        1. Rewrite the article to be engaging, professional, and well-structured.
        2. Use the information from the reference articles to add value.
        3. Maintain the original core message but improve flow and depth.
        4. At the very bottom, add a section called "References" and list the reference articles with their links properly cited.
        5. Return ONLY the new article content in Markdown format. Do not include introductory text like "Here is the rewritten article".
        
        Enhanced Article:
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('LLM Enhancement Error:', error.message);
        throw error;
    }
};

module.exports = { enhanceContent };
