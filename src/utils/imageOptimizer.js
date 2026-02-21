const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Optimizes an image file: resize, compress, and convert to WebP
 * @param {string} inputPath - Path to the input file
 * @param {string} outputPath - Path to save the optimized file
 * @param {Object} options - Options for sharp
 * @returns {Promise<Object>} - Metadata of the processed image
 */
async function optimizeImage(inputPath, outputPath, options = {}) {
    try {
        const { width = 1200, quality = 80 } = options;

        // Ensure output directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const info = await sharp(inputPath)
            .resize({ width, withoutEnlargement: true }) // Resize to max width, don't upscale
            .webp({ quality }) // Convert to WebP for better compression
            .toFile(outputPath);

        return info;
    } catch (error) {
        console.error('Image optimization error:', error);
        throw error;
    }
}

/**
 * Deletes a file if it exists
 * @param {string} filePath 
 */
function deleteFile(filePath) {
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch (e) {
            console.error(`Failed to delete file ${filePath}:`, e);
        }
    }
}

module.exports = {
    optimizeImage,
    deleteFile
};
