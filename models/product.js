//####    PONITS TO REMBERER         #####
/**
 * photos are array of objects and each objecct should have id and secure url
 *
 *
 *
 */
//####    PONITS TO REMBERER         #####

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide product name "],
    maxlength: [120, "product name should not be more than 120 charcters "],
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: [true, "please provide product price "],
    maxlength: [5, "product name should not be more than 5 didgits  "],
    trim: true,
  },

  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [
      true,
      "please select category from short slleves ,long-sleves,long-sleves  ",
    ],
    enum: {
      values: ["shortsleeves", "longslvess", "sweatshirt", "hoodies"],
      message: "plasese select from category ",
    },
  },

  brand: {
    type: String,
    required: [true, "please add brand for clothing "],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: [true, "please add number in stock field "],
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
