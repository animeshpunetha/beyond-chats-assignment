const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('./models/Article');

dotenv.config();

const resetArticles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const result = await Article.deleteMany({});
        console.log(`Deleted ${result.deletedCount} articles.`);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

resetArticles();
