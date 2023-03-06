const { createUserSchema } = require('../validators');
const { User } = require('./../models');
const asyncHandler = require('express-async-handler');

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Use object destructuring to get error and value from the validation result
  const { error, value } = createUserSchema.validate({ name, email, password });

  if (error) {
    // Use a map to associate error paths with messages instead of if statements
    const errorMessages = {
      'name': 'Name has to start with a letter, can contain spaces, must be at least 3 characters, and no more than 30 characters. No special characters allowed',
      'email': 'Email has to start with a letter, can contain numbers and underscores, must be at least 3 characters, must have @com or @net. No spaces and no other special characters allowed',
      'password': 'Password must be between 8 and 30 characters and contain at least one letter, one number, and one special character: !@#$%^&*()_+-=[]{};:\\|,.<>/?'
    };
    const message = errorMessages[error.details[0].path[0]];
    
      return res.json({message:message})
  }

   // Check if user already exists
    try{
   const existingUser = await User.findOne({ email });

   if (existingUser) {
     return res.status(409).json({ message: 'User already exists' });
   }

   // Create new user
   const user = new User({ email, password });
   await user.save();

   return res.status(201).json({ message: 'User created successfully' });
 } catch (error) {
   return res.status(500).json({ message: 'Internal server error' });
 }
};


module.exports = {
    signup,
   
  };
  