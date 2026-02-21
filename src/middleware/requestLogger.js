/**
 * Request Logger Middleware using Morgan
 */

const logger = require('../config/logger');
const morgan = require('morgan');

// Create stream object for Morgan
const stream = {
  write: (message) => logger.http(message.trim()),
};

// Skip logging in test environment
const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'test';
};

// Morgan format
const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :remote-addr',
  { stream, skip }
);

module.exports = requestLogger;
