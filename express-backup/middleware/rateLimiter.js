/**
 * Rate Limiting Middleware
 */

const rateLimit = require('express-rate-limit');
const constants = require('../config/constants');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: constants.RATE_LIMIT.WINDOW_MS,
  max: constants.RATE_LIMIT.MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests, please try again later.',
        retryAfter: Math.ceil(constants.RATE_LIMIT.WINDOW_MS / 1000),
      },
    });
  },
});

// Strict limiter for login
const loginLimiter = rateLimit({
  windowMs: constants.RATE_LIMIT.WINDOW_MS,
  max: constants.RATE_LIMIT.LOGIN_MAX,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again after 15 minutes.',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many login attempts. Please try again after 15 minutes.',
      },
    });
  },
});

// Contact form limiter
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: constants.RATE_LIMIT.CONTACT_MAX,
  message: 'Too many messages sent, please try again later.',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many messages sent. Please try again in an hour.',
      },
    });
  },
});

module.exports = { apiLimiter, loginLimiter, contactLimiter };
