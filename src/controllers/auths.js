const { createUserSchema } = require('../validators');
const { User } = require('./../models');

const errorMessages = {
  name: 'Name has to start with a letter, can contain spaces, must be at least 3 characters, and no more than 30 characters. No special characters allowed',
  email: 'Email has to start with a letter, can contain numbers and underscores, must be at least 3 characters, must have @com or @net. No spaces and no other special characters allowed',
  password: 'Password must be between 8 and 30 characters and contain at least one letter, one number, and one special character: !@#$%^&*()_+-=[]{};:\\|,.<>/?',
};

const errorMap = {
  name: 'Name',
  email: 'Email',
  password: 'Password',
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Use object destructuring to get error and value from the validation result
  const { error, value } = createUserSchema.validate({ name, email, password });

  const errorMessages = new Map([
    ['name', 'Name has to start with a letter, can contain spaces, must be at least 3 characters, and no more than 30 characters. No special characters allowed'],
    ['email', 'Email has to start with a letter, can contain numbers and underscores, must be at least 3 characters, must have @com or @net. No spaces and no other special characters allowed'],
    ['password', 'Password must be between 8 and 30 characters and contain at least one letter, one number, and one special character: !@#$%^&*()_+-=[]{};:\\|,.<>/?']
  ]);

  if (error) {
    const path = error.details[0].path[0];
    const message = errorMessages.get(path) || 'Invalid input';
    return res.json({message:message})
  }

  // Check if user already exists
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};



const signin = async (req, res)=>{
  const { email, password } = req.body;

  const { error, value } = createUserSchema.validate({ email, password });
  const errorMessages = new Map([
    ['name', 'Name has to start with a letter, can contain spaces, must be at least 3 characters, and no more than 30 characters. No special characters allowed'],
    ['email', 'Email has to start with a letter, can contain numbers and underscores, must be at least 3 characters, must have @com or @net. No spaces and no other special characters allowed'],
    ['password', 'Password must be between 8 and 30 characters and contain at least one letter, one number, and one special character: !@#$%^&*()_+-=[]{};:\\|,.<>/?']
  ]);

  if (error) {
    const path = error.details[0].path[0];
    const message = errorMessages.get(path) || 'Invalid input';
    return res.json({message:message})
  }

  const user = await User.findOne({ email: email })
    .exec(async (err, user) => {
    
      if (err) {
      res.status(500)
        .send({
          message: err
        });
      return;
    }
    if (!user || !(await user.comparePassword(password, user.password))) {
    
    return res.status(401)
          .send({
            accessToken: null,
            message: 'incorrect email or password'
          });
  }
  });

 //signing token with user id
  let token = jwt.sign({
        id: user.id
      }, process.env.API_SECRET, {
        expiresIn: 86400
  });
  
   //responding to client request with user profile success message and  access token .
   res.status(200)
   .send({
     user: {
       id: user._id,
       email: user.email,
       fullName: user.fullName,
     },
     message: "Login successfull",
     accessToken: token,
   });

 
}

module.exports = {
  signup,
  signin,
   
  };
  