const mongoose = require('mongoose');
// load environment variables
require('dotenv').config();

class DBClient {
  constructor() {
    this._username = process.env.DB_USERNAME;
    this._password = process.env.DB_PASSWORD;
    this._db = process.env.DB_NAME;

    mongoose.connect(
      `mongodb+srv://${this._username}:${this._password}@cluster0.ijtgnu3.mongodb.net/${this._db}`
    ).then(() => console.log('db connected'));
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
