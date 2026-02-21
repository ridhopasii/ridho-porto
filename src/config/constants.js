/**
 * Application Constants
 */

const os = require('os');

module.exports = {
  // Site Information
  SITE_NAME: 'Ridhopasii Portfolio',
  SITE_DESCRIPTION: 'Portfolio of Ridhopasii - UI/UX Designer & Web Developer',

  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  UPLOAD_DIR: 'public/uploads',
  TEMP_UPLOAD_DIR: os.tmpdir(),

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // Cache TTL (seconds)
  CACHE_TTL: {
    SHORT: 300, // 5 minutes
    MEDIUM: 1800, // 30 minutes
    LONG: 3600, // 1 hour
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
    LOGIN_MAX: 5,
    CONTACT_MAX: 3,
  },

  // JWT
  JWT_EXPIRES_IN: '7d',

  // Logging
  LOG_LEVELS: ['error', 'warn', 'info', 'http', 'debug'],

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },
};
