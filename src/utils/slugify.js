/**
 * Slug Generator Utility
 */

const slugify = require('slugify');

/**
 * Generate URL-friendly slug from text
 * @param {string} text - Text to slugify
 * @returns {string} - Slugified text
 */
const generateSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

/**
 * Generate unique slug with timestamp
 * @param {string} text - Text to slugify
 * @returns {string} - Unique slug
 */
const generateUniqueSlug = (text) => {
  const baseSlug = generateSlug(text);
  const timestamp = Date.now();
  return `${baseSlug}-${timestamp}`;
};

module.exports = {
  generateSlug,
  generateUniqueSlug,
};
