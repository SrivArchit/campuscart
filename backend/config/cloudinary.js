const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "campuscart",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      // ✅ Unique filename so images never overwrite each other
      public_id: `listing_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      transformation: [{ width: 800, quality: "auto" }],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { upload, cloudinary };