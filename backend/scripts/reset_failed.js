const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('../models/Article');
const connectDB = require('../config/db');

dotenv.config();

const resetFailed = async () => {
    try {
        await connectDB();
        const res = await Article.updateMany({ status: 'failed' }, { status: 'pending' });
        console.log(`Reset ${res.modifiedCount} failed articles to pending.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetFailed();
