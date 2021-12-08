const bigPromise = require("../middlewares/bigPromise");
const Razorpay = require("razorpay");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
exports.sendStripeKey = bigPromise(async (req, res, next) => {
  res.status(200).json({
    razorpay: process.env.STRIPE_KEY,
  });
});

exports.sendRazorpayKey = bigPromise(async (req, res, next) => {
  res.status(200).json({
    razorpay: process.env.RAZORPAY_KEY,
  });
});

exports.caputureStripePayment = bigPromise(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntent.create({
    amount: req.body.amount,
    currency: "INR",
    metadata: {
      integration_check: "accept_a_payment",
    },
  });

  res
    .status(200)
    .send({ success: true, client_secret: paymentIntent.client_secret });
});

exports.caputureRazorpayPayment = bigPromise(async (req, res, next) => {
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  instance.orders.create({
    amount: req.body.amount,
    currency: "INR",
    receipt: "receipt#1",
    notes: { key1: "value3", key2: "value2" },
  });

  res.status(200).send({ success: true, amount: req.body.amount });
});
