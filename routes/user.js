const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  logout,
  forgotPassword,
  passwordReset,
  getLoggedInUserDetails,
  changePassword,
  updateUserDetails,
  adminAllUser,
  managerAllUser,
  adminGetOneUser,
  adminupdateOneUserDetails,
  adminDeleteOneUser,
  verifyEmail,
} = require("../controllers/userController");

const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/password/update").post(isLoggedIn, changePassword);
router.route("/userdashboard/update").post(isLoggedIn, updateUserDetails);
//to verify email
router.route("/verify/:userId/:token").get(verifyEmail);

router.route("/admin/users").get(isLoggedIn, customRole("admin"), adminAllUser);
router
  .route("/manager/users")
  .get(isLoggedIn, customRole("manager"), managerAllUser);
router
  .route("/admin/user/:id")
  .get(isLoggedIn, customRole("admin"), adminGetOneUser)
  .put(isLoggedIn, customRole("admin"), adminupdateOneUserDetails)
  .delete(isLoggedIn, customRole("admin"), adminDeleteOneUser);

module.exports = router;
