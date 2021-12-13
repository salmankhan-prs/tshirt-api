const User = require("../models/user");
const CustomError = require("../utils/CustomError");
const BigPromise = require("../middlewares/bigPromise");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const mailHelper = require("../utils/emailHelper");
const crypto = require("crypto");
const user = require("../models/user");
const getToken = require("../utils/genrateToken");
const logger = require("../logger/logger");

exports.signup = BigPromise(async (req, res, next) => {
  // console.log(req.body);
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return next(new CustomError("Name ,Email,Password are required", 400));
  }
  let result;
  if (req.files) {
    let file = req.files.photo;
    result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folders: "users",
      width: 150,
      crop: "scale",
    });
  }
  const verfication_token = getToken();

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
    verfication_token,
  });

  //send token to verify email

  const myurl = `${req.protocol}://${req.get("host")}/api/v1/verify/${
    user._id
  }/${verfication_token}`;
  const message = `Hi ${user.name}\n\nplease  click below link to verify\n\n ${myurl}`;

  try {
    await mailHelper({
      email: user.email,
      subject: "EMAIL VERIFICATION FOR T_Shirt_Store ",
      text: message,
    });
    logger("info", `email verfication link failed for  [${email}]`);
  } catch (e) {
    logger("error", "email verfication link failed for" + email);
  }
  console.log(myurl);

  cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  //check is for presence for email and password
  if (!email || !password) {
    return next(new CustomError("please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new CustomError("your not registered !!!", 400));
  }
  const isPasswordCorrect = await user.isValidatedPassword(password);
  if (!isPasswordCorrect) {
    return next(new CustomError("password not matched  !!!", 400));
  }
  cookieToken(user, res, req);
  logger("info", `user loggged  [${email}]`);
});

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now),
    httpOnly: true,
  });
  res.status(200).json({
    sucess: true,
    message: "LOgout sucess",
  });
});
exports.verifyEmail = BigPromise(async (req, res, next) => {
  const { userId, token } = req.params;
  const user = await User.findById(userId);
  if (user.verfication_token == token) {
    user.verfied = true;
    user.verfication_token = undefined;
    await user.save();
    return res.status(200).send("USER verfied ");
  }
  return next(new CustomError("user not verfied   !!!", 400));
});
exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomError("email not found  !!!", 400));
  }
  const forgotToken = user.getForgotPasswordToken();
  await user.save({ validateBeforeSave: false });

  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;

  const message = `copy paste this link in  your URL and hit enter \n\n ${myUrl}`;
  try {
    await mailHelper({
      email: user.email,
      subject: "T-store _password reset ",
      text: message,
    });
    res.status(200).send({ sucess: true, message: "EMAil send sucessfully" });
  } catch (e) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new CustomError(e.message, 500));
  }
});

exports.passwordReset = BigPromise(async (req, res, next) => {
  const token = req.params.token;
  const encryToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    encryToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });
  if (!user) {
    return next(new CustomError("Token is invalid or expired "));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new CustomError("password and confirm password don not match"));
  }
  user.password = req.body.password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();
  cookieToken(user, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    sucess: true,
    user,
  });
});

exports.changePassword = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isCorrectOldPassword = await user.isValidatedPassword(
    req.body.oldPassword
  );
  if (!isCorrectOldPassword) {
    return next(new CustomError("old password is incoorect  "), 400);
  }
  user.password = req.body.password;
  await user.save();
  cookieToken(user, res);
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.files) {
    const user = await User.findById(req.user.id);
    const imageId = user.photo.id;
    const resp = await cloudinary.v2.uploader.destroy(imageId);
    const result = await cloudinary.v2.uploader.upload(
      req.files.photo.tempFilePath,
      {
        folders: "users",
        width: 150,
        crop: "scale",
      }
    );
    newData.photo = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });
  await user.save();
  res.status(200).send({ sucess: true });
});

exports.adminAllUser = BigPromise(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).send({ sucess: true, users });
});
exports.adminGetOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new CustomError("No user found"), 400);
  }
  res.status(200).send({ sucess: true, user });
});
exports.managerAllUser = BigPromise(async (req, res, next) => {
  const users = await User.find({ role: "user" });
  res.status(200).send({ sucess: true, users });
});

exports.adminupdateOneUserDetails = BigPromise(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });
  await user.save();
  res.status(200).send({ sucess: true });
});
exports.adminDeleteOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new CustomError("NO USER FOUND"), 400);
  }
  console.log(user);
  const imageId = user.photo.id;
  await cloudinary.v2.uploader.destroy(imageId);
  user.remove();
  console.log(typeof resp);
  res.status(200).send({ sucess: true });
});
