const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Books", "Notes", "PYQs", "Electronics", "Other"],
        message: "{VALUE} is not a valid category",
      },
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: {
        values: ["New", "Like New", "Used"],
        message: "{VALUE} is not a valid condition",
      },
    },
    images: {
      type: [String], // Array of Cloudinary URLs
      validate: {
        validator: (arr) => arr.length <= 5,
        message: "You can upload a maximum of 5 images",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available",
    },
  },
  { timestamps: true }
);

// 🔍 Index for fast search by title and category
listingSchema.index({ title: "text" });
listingSchema.index({ category: 1 });
listingSchema.index({ seller: 1 });

module.exports = mongoose.model("Listing", listingSchema);


