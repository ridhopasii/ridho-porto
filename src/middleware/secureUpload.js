/**
 * Secure File Upload Middleware
 */

const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs').promises; // Keep as promises for async/await
const sharp = require('sharp');
const os = require('os'); // Added os import
const constants = require('../config/constants');
const logger = require('../config/logger');

// Configure storage
const uploadDir = os.tmpdir(); // Use os.tmpdir() for destination
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // No need to mkdir for os.tmpdir() as it's guaranteed to exist
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueName}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (constants.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: constants.MAX_FILE_SIZE },
});

// Middleware to optimize uploaded image
const optimizeImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const optimizedPath = req.file.path.replace('\\temp\\', '\\').replace('/temp/', '/');

    await sharp(req.file.path)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(optimizedPath);

    // Delete temp file
    await fs.unlink(req.file.path);

    req.file.path = optimizedPath;
    req.file.filename = path.basename(optimizedPath);

    logger.info(`Image optimized: ${optimizedPath}`);
    next();
  } catch (error) {
    logger.error('Image optimization error:', error);
    next(error);
  }
};

module.exports = { upload, optimizeImage };
