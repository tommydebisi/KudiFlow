const jwt = require('jsonwebtoken');
const { hash, compare } = require('bcrypt');
const { User } = require('../models/User');
const Track = require('../models/Track');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const { createUserSchema, loginUserSchema } = require('../validators/Validate');

/**
 * encrypts password
 * @param {string} password
 * @returns encrypted password
 */
async function _hashPassword(password) {
  // auto generate a salt and hash
  return hash(password, 10);
}

/**
 * generates new access token
 * @param {object} obj - field to pass in token
 * @returns {string} accessToken
 */
function generateAccessToken(obj) {
  return jwt.sign(obj, process.env.API_SECRET, {
    expiresIn: '15m'
  });
}

class AuthController {
  static async signUp(req, res) {
    const { username, email, password } = req.body;

    if (!username) return res.status(400).json({ error: 'Missing username' });
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    try {
      // Validate password meets criteria
      await createUserSchema.validateAsync({ email, password });

      // Check if user already exists
      const existingUser = await dbClient.getSchemaOne(User, { email });
      if (existingUser) return res.status(400).json({ error: 'User already exists' });

      const hashed_password = await _hashPassword(password);

      // Create new user
      const user = await User.create({ username, email, hashed_password });

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      // Handle validation errors
      return res.status(400).json({ error: error.message });
    }

  };

  static async signIn(req, res) {
    const { email, password } = req.body;

    // validate email using Joi schema
    const { error } = await loginUserSchema.validateAsync({ email });
    if (error) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // check if email and password is present
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });


    const user = await dbClient.getSchemaOne(User, { email });
    if (!user || !(await compare(password, user.hashed_password))) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }


    //signing token with user id
    const accessToken = generateAccessToken({ email });
    const refreshToken = jwt.sign({ email }, process.env.API_SECRET_REFRESH);

    // save refresh token in redis
    const result = await redisClient.set(`auth_${accessToken}`, refreshToken);

    //responding to client request access and request tokens.
    res.status(202)
      .json({ accessToken });
  }

  static async getNewToken(req, res) {
    // get expired accesstoken from request body
    const { token } = req.body

    if (!token) return res.status(400).json({ error: 'Missing Token' });
    const refreshToken = await redisClient.get(`auth_${token}`);

    // check if token is available
    if (!refreshToken) return res.status(403).json({ error: 'Forbidden' });

    // verify refresh token
    jwt.verify(refreshToken, process.env.API_SECRET_REFRESH, async (err, field) => {
      if (err) return res.status(403).json({ error: 'Unable to verify token' })

      const accessToken = generateAccessToken({ email: field.email })
      // remove previous accessToken
      await redisClient.del(`auth_${token}`);
      await redisClient.set(accessToken, refreshToken);
      return res.status(200).json({ accessToken });
    });

  }
  static async logout(req, res) {
    await redisClient.del(`auth_${req.user}`);
    return res.status(204).send('\n');
  }
}


//Reset password
module.exports = AuthController;
