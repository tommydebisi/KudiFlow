const { User } = require('../models/User');
const Track = require('../models/Track');

async function start() {
  try{
    const user = await User.where('email').equals('tommy@foo.com').limit(1);
    user[0].track = '6404b7c8ecd5a4b7a6d5fbde';
    user[0].save();
    console.log(user);
  } catch(e) {
    console.log(e.message);
  }
}
