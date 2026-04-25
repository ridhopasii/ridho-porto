/**
 * Request ID Middleware
 * Adds a unique ID to each request for tracing and logging
 */

const { randomBytes } = require('crypto');

function generateRequestId() {
  return randomBytes(16).toString('hex');
}

const requestIdMiddleware = (req, res, next) => {
  // Check if request ID already exists in header (from load balancer/proxy)
  const requestId = req.headers['x-request-id'] || generateRequestId();

  // Attach to request object
  req.id = requestId;

  // Add to response headers
  res.setHeader('X-Request-ID', requestId);

  // Add to res.locals for use in views/templates
  res.locals.requestId = requestId;

  next();
};

module.exports = requestIdMiddleware;
