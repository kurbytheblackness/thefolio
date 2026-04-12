const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  avatar: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  dob: Date,
  role: {
    type: String,
    enum: ["admin", "viewer"],
    default: "viewer"
  },
  isActive: {
    type: Boolean,
    default: true
  }
});


module.exports = mongoose.model("User", userSchema);