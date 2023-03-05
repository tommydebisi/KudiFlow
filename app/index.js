const mongoose = require('mongoose');
// load environment variables
require('dotenv').config();

const userName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const db = process.env.DB_NAME;

async function connectDb() {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ijtgnu3.mongodb.net/${process.env.DB_NAME}`
  );
}

module.exports = connectDb;
