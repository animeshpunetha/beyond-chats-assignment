const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('../models/Article');

dotenv.config();

const checkStatus = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const total = await Article.countDocuments();
        const pending = await Article.countDocuments({ status: 'pending' });
        const completed = await Article.countDocuments({ status: 'completed' });
        const failed = await Article.countDocuments({ status: 'failed' });

        console.log(`Total: ${total}`);
        console.log(`Pending: ${pending}`);
        console.log(`Completed: ${completed}`);
        console.log(`Failed: ${failed}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkStatus();
