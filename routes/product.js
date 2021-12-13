const express = require("express");
const router = express.Router();
const {
  testProduct,
  addProduct,
  getAllProduct,
  getOneProduct,
  adminUpdateOneProduct,
  adminDeleteOneProduct,
  addReview,
  deleteReview,
  getOnlyReviewsForOneProduct,
} = require("../controllers/productController");
const { isLoggedIn, customRole } = require("../middlewares/user");
router.route("/testproduct").get(testProduct);
router.route("/product").get(getAllProduct);
router.route("/oneproduct/:id").get(getOneProduct);
router.route("/review").put(isLoggedIn, addReview);
router.route("/review").delete(isLoggedIn, deleteReview);
router.route("/review").get(getOnlyReviewsForOneProduct);

//TODO: by own remove after

//admin controller
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);
router.route("/admin/product/:id").put(isLoggedIn, adminUpdateOneProduct);
router.route("/admin/product/:id").delete(isLoggedIn, adminDeleteOneProduct);

module.exports = router;
