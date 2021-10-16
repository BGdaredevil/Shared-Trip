const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const saltRounds = require("../../index.js").saltRounds;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: [5, "email is too short"],
    unique: true,
    validate: [/^\w+@{1}\w+\.{1}[a-z]{2,3}$/i, "Email must be valid to mailbox@domain.bg/com"],
  },
  password: {
    type: String,
    required: true,
    minlength: [4, "Password is too short"],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  tripHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "trip" }],
});

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

UserSchema.method("verifyPass", function (pass) {
  return bcrypt.compare(pass, this.password);
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
