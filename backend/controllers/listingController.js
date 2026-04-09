const Listing = require("../models/Listing");
const { cloudinary } = require("../config/cloudinary");

// ─────────────────────────────────────────
// Helper: Extract Cloudinary public_id from URL
// ─────────────────────────────────────────
const getPublicIdFromUrl = (url) => {
  try {
    // Cloudinary URLs look like: .../campuscart/listing_12345_abc.jpg
    const parts = url.split("/");
    const fileWithExt = parts[parts.length - 1];
    const folder = parts[parts.length - 2];
    const publicId = `${folder}/${fileWithExt.split(".")[0]}`;
    return publicId;
  } catch {
    return null;
  }
};

// ─────────────────────────────────────────
// @route   POST /api/listings
// @access  Private
// ─────────────────────────────────────────
const createListing = async (req, res) => {
  try {
    const { title, description, price, category, condition, phone, whatsapp } =
      req.body;

    // ✅ Validate required fields
    if (!title || !description || !price || !category || !condition || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Get uploaded image URLs from Cloudinary (via multer)
    const images = req.files ? req.files.map((file) => file.path || file.secure_url) : [];

    const uniqueImages = [...new Set(images)];

    const listing = await Listing.create({
      title,
      description,
      price,
      category,
      condition,
      images: uniqueImages,
      phone,
      whatsapp: whatsapp || phone,
      seller: req.user._id,
    });

    res.status(201).json(listing);
  } catch (error) {
    console.error("Create listing error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────
// @route   GET /api/listings
// @access  Public
// ─────────────────────────────────────────
const getAllListings = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter object dynamically
    let filter = { status: "available" };

    // 🔍 Search by title (case insensitive)
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // 🗂️ Filter by category
    if (category && category !== "All") {
      filter.category = category;
    }

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate("seller", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Listing.countDocuments(filter),
    ]);

    res.status(200).json({
      listings,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    console.error("Get listings error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────
// @route   GET /api/listings/:id
// @access  Public
// ─────────────────────────────────────────
const getSingleListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "seller",
      "name email"
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (error) {
    console.error("Get single listing error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────
// @route   GET /api/listings/my
// @access  Private
// ─────────────────────────────────────────
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(listings);
  } catch (error) {
    console.error("Get my listings error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────
// @route   DELETE /api/listings/:id
// @access  Private
// ─────────────────────────────────────────
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // ✅ Only the seller can delete their listing
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this listing" });
    }

    // 🗑️ Clean up Cloudinary images
    if (listing.images && listing.images.length > 0) {
      const deletePromises = listing.images.map((url) => {
        const publicId = getPublicIdFromUrl(url);
        if (publicId) {
          return cloudinary.uploader.destroy(publicId).catch((err) => {
            console.error(`Failed to delete image ${publicId}:`, err.message);
          });
        }
        return Promise.resolve();
      });
      await Promise.all(deletePromises);
    }

    await listing.deleteOne();
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Delete listing error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────
// @route   PATCH /api/listings/:id/sold
// @access  Private
// ─────────────────────────────────────────
const markAsSold = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // ✅ Only the seller can mark as sold
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this listing" });
    }

    listing.status = "sold";
    await listing.save();

    res.status(200).json({ message: "Listing marked as sold", listing });
  } catch (error) {
    console.error("Mark as sold error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────
// @route   PUT /api/listings/:id
// @access  Private
// ─────────────────────────────────────────
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // ✅ Only seller can edit
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this listing" });
    }

    const { title, description, price, category, condition, phone, whatsapp } =
      req.body;

    // ✅ Update fields
    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.price = price || listing.price;
    listing.category = category || listing.category;
    listing.condition = condition || listing.condition;
    listing.phone = phone || listing.phone;
    listing.whatsapp = whatsapp || listing.whatsapp;

    // ✅ Handle images: keep selected existing + add new uploads
    // Frontend sends 'keepImages' as JSON array of existing URLs to retain
    let keptImages = [];
    if (req.body.keepImages) {
      try {
        keptImages = JSON.parse(req.body.keepImages);
      } catch {
        keptImages = [];
      }
    }

    // Find which old images were removed by user
    const removedImages = (listing.images || []).filter(
      (url) => !keptImages.includes(url)
    );

    // Delete removed images from Cloudinary
    if (removedImages.length > 0) {
      const deletePromises = removedImages.map((url) => {
        const publicId = getPublicIdFromUrl(url);
        if (publicId) {
          return cloudinary.uploader.destroy(publicId).catch((err) => {
            console.error(`Failed to delete image ${publicId}:`, err.message);
          });
        }
        return Promise.resolve();
      });
      await Promise.all(deletePromises);
    }

    // Merge: kept existing images + newly uploaded images
    const newUploads = req.files
      ? req.files.map((file) => file.path || file.secure_url)
      : [];

    listing.images = [...new Set([...keptImages, ...newUploads])].slice(0, 5);

    const updated = await listing.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update listing error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createListing,
  getAllListings,
  getSingleListing,
  getMyListings,
  deleteListing,
  markAsSold,
  updateListing,
};