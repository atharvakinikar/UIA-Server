const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
  },
  doctorid: {
    type: String,
    default: null,
  },
  // phoneNumber: {
  //   type: Number,
  // },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
