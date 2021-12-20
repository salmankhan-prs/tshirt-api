const BigPromise = require("../middlewares/bigPromise");
const Product = require("../models/product");
const CustomError = require("../utils/CustomError");
const cloudinary = require("cloudinary");

const fileUpload = require("express-fileupload");
const WhereClause = require("../utils/whereClause");
const product = require("../models/product");

//TODO://    handle error in reveiw routes
//####################   REDUCERS ########################
//MORE INFO :  https://stylades.hashnode.dev/a-guide-to-using-the-javascript-reduce-array-method

//####################   REDUCERS ########################
//testing product route ###  DUMMY ROUTE
exports.testProduct = async (req, res) => {
  res.send({ message: "Product are working " });
};

exports.addProduct = BigPromise(async (req, res, next) => {
  let imageArray = [];
  if (!req.files) {
    return next(new CustomError("images are required", 401));
  }
  if (req.files) {
    //#### get single photo
    if (!req.files.photos.length) {
      req.files.photos = [req.files.photos];
    }
    //### get a sinle photo

    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );
      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
    req.body.photos = imageArray;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(200).send({
      sucess: true,
      product,
    });
  }
});

exports.getAllProduct = BigPromise(async (req, res, next) => {
  const resultPerPage = 6;
  const totalCountProduct = await Product.countDocuments();
  const productsObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();
  let products = await productsObj.base.clone();
  const filteredProductNumber = products.length;

  // const product = Product.find({});
  productsObj.pager(resultPerPage);
  products = await productsObj.base;
  res.status(200).send({
    sucess: true,
    products,
    totalCountProduct,
    filteredProductNumber,
  });
});
exports.getOneProduct = BigPromise(async (req, res, next) => {
  console.log("ENTER");
  const product = await Product.findById(req.params.id).populate("user");
  if (!product) {
    return next(new CustomError("No product found "), 401);
  }
  res.status(200).send({
    sucess: true,
    product,
  });
});

exports.getOnlyReviewsForOneProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  res.status(200).send({
    sucess: true,
    product,
  });
});

exports.adminUpdateOneProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new CustomError("No product found "), 401);
  }
  let imagesArray = [];

  if (req.files) {
    for (let index = 0; index < product.photos.length; index++) {
      await cloudinary.v2.uploader.destroy(product.photos[index].id);
    }

    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );
      imagesArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
    req.body.photos = imagesArray;
  }
  updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).send({
    sucess: true,
    updatedProduct,
  });
});

exports.adminDeleteOneProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new CustomError("No product found "), 401);
  }

  for (let index = 0; index < product.photos.length; index++) {
    await cloudinary.v2.uploader.destroy(product.photos[index].id);
  }
  await product.remove();
  res.status(200).send({
    sucess: true,
    message: "Product deleted ",
  });
});

exports.addReview = BigPromise(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const alreadyReviewed = await product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  console.log(alreadyReviewed);
  if (alreadyReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        console.log(review.user.toString() + "  " + req.user._id.toString());
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }

  // product.ratings = product.reviews.reduce((acc, item) => {
  //   (item.rating + acc, 0) / product.reviews.length;
  // });
  let totalRatings = 0;
  product.reviews.forEach((rev) => {
    totalRatings += rev.rating;
  });
  let AvgRating = totalRatings / product.reviews.length;
  product.ratings = AvgRating;
  console.log(product.reviews.length);
  console.log(product.reviews.length);
  product.save({ validateBeforeSave: false });
  res.status(200).json({
    sucess: true,
  });
});

exports.deleteReview = BigPromise(async (req, res, next) => {
  const { productId } = req.query;
  const product = await Product.findById(productId);

  const reviews = await product.reviews.filter(
    (rev) => rev.user.toString() !== req.user._id.toString()
  );

  const numberOfReviews = reviews.length;

  ratings = product.reviews.reduce(
    (acc, item) => (item.rating + acc) / numberOfReviews,
    0
  );
  console.log(ratings);
  await Product.findByIdAndUpdate(productId, {
    reviews,
    ratings,
    numberOfReviews,
  });
  res.status(200).json({
    sucess: true,
  });
});
