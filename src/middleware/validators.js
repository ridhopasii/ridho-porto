/**
 * Input Validation Middleware
 */

const { body, param, validationResult } = require('express-validator');
const { sanitizeHtml } = require('../utils/sanitizer');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Contact form validation
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .escape(),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject must not exceed 200 characters')
    .escape(),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
    .customSanitizer(sanitizeHtml),
  validate,
];

// Project validation
const projectValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .escape(),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters')
    .escape(),
  body('content').optional().customSanitizer(sanitizeHtml),
  body('tags')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Tags must not exceed 200 characters'),
  body('demoUrl').optional().isURL().withMessage('Demo URL must be a valid URL'),
  body('repoUrl').optional().isURL().withMessage('Repository URL must be a valid URL'),
  validate,
];

// Article validation
const articleValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .escape(),
  body('content')
    .trim()
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters')
    .customSanitizer(sanitizeHtml),
  body('tags')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Tags must not exceed 200 characters'),
  body('published').optional().isBoolean().withMessage('Published must be a boolean'),
  validate,
];

// Login validation
const loginValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .escape(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

// Slug parameter validation
const slugValidation = [
  param('slug')
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Invalid slug format'),
  validate,
];

module.exports = {
  contactValidation,
  projectValidation,
  articleValidation,
  loginValidation,
  slugValidation,
  validate,
};
