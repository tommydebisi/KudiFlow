const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const { User } = require('../models/User');
const Track = require('../models/Track');

start()
async function start() {
  try{
    await setTimeout(() => console.log('done'), 5000);
    // const user = await User.where('email').equals('tommy@foo.com').limit(1);
    // user[0].track = '6404b7c8ecd5a4b7a6d5fbde';
    // user[0].save();

    const user = await User.create({
      username: '!1tommy',
      email: 'tom@foo.com',
      hashed_password: 'hello'
    });
    // user.income.push({
    //   amount: 100
    // })

    console.log(user);
  } catch(e) {
    console.log(e.message);
  }
}
