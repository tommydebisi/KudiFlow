require('dotenv').config();
const redis = require('redis');
const { promisify } = require('util');


class RedisClient {
  constructor() {
    this.client = redis.createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    });
    this._get = promisify(this.client.get).bind(this.client);
    this._set = promisify(this.client.set).bind(this.client);
    this._del = promisify(this.client.del).bind(this.client);

    this.client.on('connect', () => {
      console.log('Redis Connected');
    });

    this.client.on('error', (err) => {
      console.log(`Error: ${err}`);
    });
  }

  /**
  * gets the value of a key from the database
  * @param {string} key - key to get it's value
  * @returns {any} The value of the key
  */
  async get(key) {
    return this._get(key);
  }

  /**
   * sets a key and value in db
   *
   * @param {string} key - key to set
   * @param {string} value - value to set with key
   */
  async set(key, value) {
    // set key with expiration
    await this._set(key, value);
  }

  /**
   * deletes the key passed from the database
   * @param {string} key - key to delete from database
   */
  async del(key) {
    await this._del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
