const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 6
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/fx2000/image/upload/v1571924502/cubee/img/default-avatar_s8v2ls.png'
  }
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;