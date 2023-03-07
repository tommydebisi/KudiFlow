const mongoose = require('mongoose');
// load environment variables


const dotenv = require('dotenv');
const asyncHandler = require('express-async-handler');
const app = require('./app');


// configure dotenv and port
dotenv.config({ path: "./.env" });


async function connectDb() {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ijtgnu3.mongodb.net/${process.env.DB_NAME}`
  );
  console.log('Database connection is successful');
}



module.exports = connectDb;

