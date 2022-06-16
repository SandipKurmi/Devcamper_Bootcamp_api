const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect('mongodb://localhost:27017/devcamper', () => {
        console.log(`MongoDB Connected with Database`.cyan.bold);
    });

}

module.exports = connectDB





