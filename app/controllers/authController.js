const jwt = require('jsonwebtoken');
const { compare } = require('bcrypt');
const { Types } = require('mongoose');
const { randomBytes } = require('crypto');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const { User } = require('../models/User');
const { hashPassword, generateAccessToken, sendEmail } = require('../utils/helper');


class AuthController {
  static async signUp(req, res) {
    const { username, email, password } = req.body;

    if (!username) return res.status(400).json({ error: 'Missing username' });
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    // validate password meets criteria

    // Check if user already exists
    const existingUser = await dbClient.getSchemaOne(User, { email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashed_password = await hashPassword(password);
    try {
      // Create new user
      const user = await User.create({ username, email, hashed_password });

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  static async signIn(req, res) {
    const { email, password } = req.body;

    // check if email and password is present
    if (!email) return res.status(400).json({ error: 'Missing email' });

    // do the validation for email here

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

  static async forgot(req, res) {
    const { email } = req.body;

    // check if the user email is present in db
    const user = await dbClient.getSchemaOne(User, { email });

    if (!user) return res.status(404).json({ error: "Not Found" });
    const resetToken = require('crypto').randomBytes(30).toString('hex');

    try {
      // store reset password with expiry for 2min
      await redisClient.setex(`reset_${resetToken}`, user._id.toString(), 300);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    // send email with reset token
    sendEmail(resetToken, email);

    return res.status(202).json({ message: 'success' });
  }

  static async postReset(req, res) {
    // get and update user with id, change userId in str to objectId
    const user = await dbClient.getSchemaOne(User, { _id: new Types.ObjectId(req.userId) });

    if (!user) return res.send('Error getting user');

    user.hashed_password = await hashPassword(req.newPass);
    user.save();

    return res.status(200).json({ message: 'success' })
  }
}

module.exports = AuthController;
