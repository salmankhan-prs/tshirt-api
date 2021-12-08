const User = require("../models/user");
const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");
const BigPromise = require("../middlewares/bigPromise");
const { JsonWebTokenError } = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return next(new CustomError("login first to access page ", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

exports.customRole = (...roles) => {
  //roles convered into array from string
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new CustomError("your not allowed for this resource ", 400));
    }
    next();
  };
};
