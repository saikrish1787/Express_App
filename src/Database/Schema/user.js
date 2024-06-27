const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email:String,
  age: {
    type: Number,
    min: 1,
    validate: {
      validator: (v) => v > 18,
      message: "User should have an age above 18",
    },
  },
});

module.exports = mongoose.model("User", userSchema);
