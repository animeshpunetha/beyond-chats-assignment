const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('./models/Article');

dotenv.config();

const verifyFix = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const article = await Article.findOne({ status: 'completed' });
        if (article && article.updatedContent) {
            console.log('SUCCESS: Article enhanced.');
            console.log('Title:', article.title);
            console.log('Enhanced Content Length:', article.updatedContent.length);
        } else {
            console.log('FAILURE: No completed article found.');
            const failed = await Article.findOne({ status: 'failed' });
            if (failed) console.log('Found failed article:', failed.title);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyFix();
