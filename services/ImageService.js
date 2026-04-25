/**
 * Image Optimization Service
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../config/logger');

class ImageService {
  /**
   * Optimize image
   * @param {string} inputPath - Input file path
   * @param {string} outputPath - Output file path
   * @param {Object} options - Optimization options
   * @returns {Promise<string>} - Output path
   */
  async optimizeImage(inputPath, outputPath, options = {}) {
    const { width = 1920, height = 1080, quality = 85, format = 'jpeg' } = options;

    try {
      await sharp(inputPath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        [format]({ quality })
        .toFile(outputPath);

      logger.info(`Image optimized: ${outputPath}`);
      return outputPath;
    } catch (error) {
      logger.error('Image optimization error:', error);
      throw error;
    }
  }

  /**
   * Generate thumbnail
   * @param {string} inputPath - Input file path
   * @param {string} outputPath - Output file path
   * @param {number} size - Thumbnail size
   * @returns {Promise<string>} - Output path
   */
  async generateThumbnail(inputPath, outputPath, size = 300) {
    try {
      await sharp(inputPath)
        .resize(size, size, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toFile(outputPath);

      logger.info(`Thumbnail generated: ${outputPath}`);
      return outputPath;
    } catch (error) {
      logger.error('Thumbnail generation error:', error);
      throw error;
    }
  }

  /**
   * Convert image to WebP
   * @param {string} inputPath - Input file path
   * @param {string} outputPath - Output file path
   * @returns {Promise<string>} - Output path
   */
  async convertToWebP(inputPath, outputPath) {
    try {
      await sharp(inputPath).webp({ quality: 85 }).toFile(outputPath);

      logger.info(`WebP conversion: ${outputPath}`);
      return outputPath;
    } catch (error) {
      logger.error('WebP conversion error:', error);
      throw error;
    }
  }

  /**
   * Get image metadata
   * @param {string} imagePath - Image file path
   * @returns {Promise<Object>} - Image metadata
   */
  async getMetadata(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      return metadata;
    } catch (error) {
      logger.error('Error getting image metadata:', error);
      throw error;
    }
  }

  /**
   * Resize image to multiple sizes
   * @param {string} inputPath - Input file path
   * @param {string} outputDir - Output directory
   * @param {Array} sizes - Array of size objects
   * @returns {Promise<Array>} - Array of output paths
   */
  async resizeMultiple(inputPath, outputDir, sizes = []) {
    const results = [];

    for (const size of sizes) {
      const filename = `${size.name}-${path.basename(inputPath)}`;
      const outputPath = path.join(outputDir, filename);

      await this.optimizeImage(inputPath, outputPath, {
        width: size.width,
        height: size.height,
        quality: size.quality || 85,
      });

      results.push(outputPath);
    }

    return results;
  }
}

module.exports = new ImageService();
