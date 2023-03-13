const mongoose = require('mongoose');
class DBClient {
  constructor() {
    this._username = process.env.DB_USERNAME;
    this._password = process.env.DB_PASSWORD;
    this._db = process.env.DB_NAME;

    mongoose.connect(
     `mongodb+srv://${this._username}:${this._password}@cluster0.ijtgnu3.mongodb.net/${this._db}`

    //'mongodb://127.0.0.1:27017/product'
    

     
    ).then(() => console.log('db connected'));
  }

  /**
   * gets one row in the db that match the object passed
   * @param {mongoose.Schema} schema - db schema to query
   * @param {object} obj - obj to search for in db
   * @returns object in db if present else null
   */
  async getSchemaOne(schema, obj) {
    return schema.findOne(obj);
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
