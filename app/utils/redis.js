const redis = require('redis');


class RedisClient {
  constructor() {
    this.client = redis.createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    });

    this.client.on('connect', () => {
      console.log('Redis Connected');
    });

    this.client.on('error', (err) => {
      console.log(`Error: ${err}`);
    });

    this.client.connect();
  }

  /**
  * gets the value of a key from the database
  * @param {string} key - key to get it's value
  * @returns {any} The value of the key
  */
  async get(key) {
    return this.client.get(key);
  }

  /**
   * sets a key and value in db
   *
   * @param {string} key - key to set
   * @param {string} value - value to set with key
   */
  async set(key, value) {
    // set key with expiration
    await this.client.set(key, value);
    // return this._set(key, value);
  }

  /**
   * deletes the key passed from the database
   * @param {string} key - key to delete from database
   */
  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
