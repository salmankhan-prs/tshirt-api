const express = require("express");
const {
  sendStripeKey,
  sendRazorpayKey,
  caputureStripePayment,
  caputureRazorpayPayment,
} = require("../controllers/paymentController");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/stripekey").get(isLoggedIn, sendStripeKey);
router.route("/razorpaykey").get(isLoggedIn, sendStripeKey);
router.route("/caputurestripe").post(isLoggedIn, caputureStripePayment);
router.route("/capturerazorpay").post(isLoggedIn, caputureRazorpayPayment);

module.exports = router;
