const jwt = require('jsonwebtoken');
const { hash, compare } = require('bcrypt');
const { User } = require('../models/User');
const Track = require('../models/Track');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const { createUserSchema, loginUserSchema } = require('../validators/Validate');

const ACCESS_TOKEN_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION = 3600; // 1 hour in seconds

/**
 * encrypts password
 * @param {string} password
 * @returns encrypted password
 */
async function _hashPassword(password) {
  // auto generate a salt and hash
  return hash(password, 12); // increased cost factor for better security
}

/**
 * generates new access token
 * @param {object} obj - field to pass in token
 * @returns {string} accessToken
 */
function generateAccessToken(obj) {
  return jwt.sign(obj, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION
  });
}

class AuthController {
  static async signUp(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Validate password meets criteria
      await createUserSchema.validateAsync({ email, password });

      // Check if user already exists
      const existingUser = await dbClient.getSchemaOne(User, { email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashed_password = await _hashPassword(password);

      // Create new user
      const user = await User.create({ username, email, hashed_password });

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      // Handle validation errors
      return res.status(400).json({ error: 'Invalid input' });
    }
  }

}
