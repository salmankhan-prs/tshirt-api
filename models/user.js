const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide a name "],
    maxlength: [40, "Name should be under 40 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Provide an email  "],
    validate: [validator.isEmail, "please enter email in correct format "],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide an email  "],
    minlength: [6, "password should  at least 6"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  verfied: {
    type: Boolean,
    default: false,
  },
  verfication_token: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//encrypt password before save

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
//validate the password using methods FOR MORE: https://mongoosejs.com/docs/guide.html#methods
userSchema.methods.isValidatedPassword = async function (usersendPassword) {
  return await bcrypt.compare(usersendPassword, this.password);
};

//create and return jwt token

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

userSchema.methods.getForgotPasswordToken = function () {
  //TODO: we are genrertaing token and return ito user and we are hsh i and storing it database .when we we want to valid we have to hash token and match with the database
  //Genrating the token for forgot password using crypto
  const forgotToken = crypto.randomBytes(20).toString("hex");
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");
  //updatating password expiry time
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
  return forgotToken;
};
module.exports = mongoose.model("User", userSchema);
