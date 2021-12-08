const Order = require("../models/order");
const Product = require("../models/product");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/CustomError");
const mongoose = require("mongoose");

exports.createOrder = BigPromise(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,

    user: req.user._id,
  });

  res.status(200).json({ order });
});
exports.getOneOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new CustomError("please check order id ", 401));
  }

  res.status(200).json({ order });
});
exports.getLoggedUserOrders = BigPromise(async (req, res, next) => {
  const order = await Order.find({
    user: req.user._id,
  }).populate("user", "name email");
  if (!order) {
    return next(new CustomError("please check order id ", 401));
  }

  res.status(200).json({ order });
});

exports.adminGetAllOrders = BigPromise(async (req, res, next) => {
  const order = await Order.find({}).populate("user", "name email");
  if (!order) {
    return next(new CustomError("please check order id ", 401));
  }

  res.status(200).json({ order });
});
exports.adminUpdateOrders = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order || order.orderStatus === "Delivered") {
    return next(
      new CustomError(
        "please check order id|| item is alreday delevevered  ",
        401
      )
    );
  }
  order.orderStatus = req.body.orderStatus;
  await order.save();
  res.status(200).json({ order });
});

exports.adminUpdateProductStock = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new CustomError("please check order id  ", 401));
  }
  // product.stock = product;
  order.updateTheStock("dec");
  await order.save();
  res.status(200).json({ order });
});
exports.adminDeleteOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new CustomError("please check order id  ", 401));
  }
  // product.stock = product;
  order.updateTheStock("inc");
  await order.remove();
  res.status(200).json({ order });
});
