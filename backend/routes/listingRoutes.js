const express = require("express");
const router = express.Router();
const {
  createListing,
  getAllListings,
  getSingleListing,
  getMyListings,
  deleteListing,
  markAsSold,
  updateListing, // ✅ import this
} = require("../controllers/listingController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

// Public routes
router.get("/", getAllListings);
router.get("/my", protect, getMyListings);
router.get("/:id", getSingleListing);

// Private routes
router.post("/", protect, upload.array("images", 5), createListing);
router.put("/:id", protect, upload.array("images", 5), updateListing); // ✅ new
router.delete("/:id", protect, deleteListing);
router.patch("/:id/sold", protect, markAsSold);

module.exports = router;