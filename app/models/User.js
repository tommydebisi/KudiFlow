const mongoose = require('mongoose');
const Track = require('./Track');

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
});

const Image = mongoose.model('Image', imageSchema);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  hashed_password: {
    type: String,
    required: true
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


const User = mongoose.model('User', userSchema);
module.exports = {
  User,
  Image
};
