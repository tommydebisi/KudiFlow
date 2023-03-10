const mongoose = require('mongoose');
const Track = require('./Track');
const bcrypt = require('bcrypt')

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
});

const Image = mongoose.model('Image', imageSchema);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  hashed_password: {
    type: String,
    required: true,
    minLength: [6, 'Minimum password length is 6']
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  profileImage: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Image'
  },
  trackId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Track'
  }
},
{
  versionKey: '0.1'
});


//fire a function before doc saved to db
userSchema.pre('save', async function (next) {
  if (!this.password) next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method.available in the whole model
userSchema.methods.comparePassword = async function (
  inputtedPassword,
  userPassword
) {
  const passwordStatus = await bcrypt.compare(inputtedPassword, userPassword);
  return passwordStatus;
};


const User = mongoose.model('User', userSchema);
module.exports = {
  User,
  Image
};
