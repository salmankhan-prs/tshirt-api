const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOneOrder,
  getLoggedUserOrders,
  adminGetAllOrders,
  adminUpdateProductStock,
  adminUpdateOrders,
  adminDeleteOrder,
} = require("../controllers/orderController");

const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/orders/create").post(isLoggedIn, createOrder);
router.route("/orders/me").get(isLoggedIn, getLoggedUserOrders);
router.route("/orders/:id").get(isLoggedIn, getOneOrder);
router
  .route("/admin/orders")

  .get(isLoggedIn, customRole("admin"), adminGetAllOrders);
router
  .route("/admin/orders/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateProductStock)
  .delete(isLoggedIn, customRole("admin"), adminDeleteOrder);

//update the order sttaues //TODO:// create Enum for status
router
  .route("/admin/orders/status/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateOrders);

module.exports = router;
