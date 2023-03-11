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
    minLength: [4, 'username must be more than 4 characters'],
    validate: {
      validator: function (v) {
        return /^\w[a-zA-Z0-9]+/.test(v);
      },
      message: (props) => {
        return "shouldn't contain special character and spaces"
      }
    }
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9]+@\w+.\w+/.test(v);
      },
      message: function (props) {
        return `${props.value} is not a valid email!`
      }
    }
  },
  hashed_password: {
    type: String,
    required: true,
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

// Instance method.available in the whole model
userSchema.methods.comparePassword = async function (
  inputtedPassword,
  userPassword
) {
  const passwordStatus = bcrypt.compare(inputtedPassword, userPassword);
  return passwordStatus;
};


const User = mongoose.model('User', userSchema);
module.exports = {
  User,
  Image
};
