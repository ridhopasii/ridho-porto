/**
 * HTML Sanitization Utility
 */

const sanitizeHtml = require('sanitize-html');

/**
 * Sanitize HTML content
 * @param {string} dirty - Dirty HTML string
 * @returns {string} - Clean HTML string
 */
const sanitizeHtmlContent = (dirty) => {
  return sanitizeHtml(dirty, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'title', 'width', 'height'],
      a: ['href', 'name', 'target', 'rel'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
};

/**
 * Strip all HTML tags
 * @param {string} html - HTML string
 * @returns {string} - Plain text
 */
const stripHtml = (html) => {
  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

module.exports = {
  sanitizeHtml: sanitizeHtmlContent,
  stripHtml,
};
