# Portfolio Improvements - Design Document

## 1. Architecture Overview

### 1.1 Current Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Browser - HTML/CSS/JS + EJS Templates)                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Express.js Server                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Routes      │→ │ Controllers  │→ │   Prisma     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      SQLite Database                         │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Improved Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Enhanced)                   │
│  • Service Worker (PWA)                                      │
│  • Lazy Loading Images                                       │
│  • Loading States & Error Boundaries                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Middleware Stack (New)                      │
│  • Helmet (Security Headers)                                 │
│  • Rate Limiter                                              │
│  • CSRF Protection                                           │
│  • Compression (Gzip/Brotli)                                 │
│  • Request Logger                                            │
│  • Input Validator                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer (Refactored)             │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Routes  │→ │Controllers │→ │ Services │→ │Repository│ │
│  └──────────┘  └────────────┘  └──────────┘  └──────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Centralized Error Handler                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer (Enhanced)                     │
│  • Prisma ORM                                                │
│  • Memory Cache                                              │
│  • Image Optimization (Sharp)                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      SQLite Database                         │
└─────────────────────────────────────────────────────────────┘
```

## 2. Component Design

### 2.1 Security Layer

#### 2.1.1 Rate Limiter Configuration

**File:** `src/middleware/rateLimiter.js`

```javascript
const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again after 15 minutes.',
});

// Contact form limiter
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many messages sent, please try again later.',
});

module.exports = { apiLimiter, loginLimiter, contactLimiter };
```

#### 2.1.2 Security Headers (Helmet)

**File:** `src/config/security.js`

```javascript
const helmet = require('helmet');

const securityConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://cdn.tailwindcss.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
});

module.exports = securityConfig;
```

#### 2.1.3 Input Validation

**File:** `src/middleware/validators.js`

```javascript
const { body, param, validationResult } = require('express-validator');
const { sanitizeHtml } = require('../utils/sanitizer');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const contactValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('subject').optional().trim().isLength({ max: 200 }).escape(),
  body('message').trim().isLength({ min: 10, max: 1000 }).customSanitizer(sanitizeHtml),
  validate,
];

const projectValidation = [
  body('title').trim().isLength({ min: 3, max: 200 }).escape(),
  body('description').trim().isLength({ min: 10, max: 500 }).escape(),
  body('content').optional().customSanitizer(sanitizeHtml),
  body('tags').optional().trim().isLength({ max: 200 }),
  body('demoUrl').optional().isURL(),
  body('repoUrl').optional().isURL(),
  validate,
];

module.exports = { contactValidation, projectValidation, validate };
```

#### 2.1.4 File Upload Security

**File:** `src/middleware/secureUpload.js`

```javascript
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/temp');
  },
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueName}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

// Middleware to optimize uploaded image
const optimizeImage = async (req, res, next) => {
  if (!req.file) return next();
  
  try {
    const optimizedPath = req.file.path.replace('/temp/', '/');
    await sharp(req.file.path)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(optimizedPath);
    
    // Delete temp file
    fs.unlinkSync(req.file.path);
    req.file.path = optimizedPath;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, optimizeImage };
```

### 2.2 Error Handling Layer

#### 2.2.1 Custom Error Classes

**File:** `src/utils/errors.js`

```javascript
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403);
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
};
```

#### 2.2.2 Centralized Error Handler

**File:** `src/middleware/errorHandler.js`

```javascript
const logger = require('../config/logger');
const { AppError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error
  logger.error({
    message: error.message,
    statusCode: error.statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Prisma errors
  if (err.code === 'P2002') {
    error.message = 'Duplicate field value entered';
    error.statusCode = 400;
  }

  if (err.code === 'P2025') {
    error.message = 'Record not found';
    error.statusCode = 404;
  }

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error.message = 'File too large. Maximum size is 5MB';
    }
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  // Response
  const response = {
    success: false,
    error: {
      message: error.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  };

  res.status(error.statusCode).json(response);
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

module.exports = { errorHandler, notFoundHandler };
```

### 2.3 Logging System

#### 2.3.1 Logger Configuration

**File:** `src/config/logger.js`

```javascript
const winston = require('winston');
const path = require('path');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'portfolio-api' },
  transports: [
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

module.exports = logger;
```

#### 2.3.2 Request Logger Middleware

**File:** `src/middleware/requestLogger.js`

```javascript
const logger = require('../config/logger');
const morgan = require('morgan');

const stream = {
  write: (message) => logger.http(message.trim()),
};

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'test';
};

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

module.exports = requestLogger;
```

### 2.4 Service Layer

#### 2.4.1 Base Service

**File:** `src/services/BaseService.js`

```javascript
const logger = require('../config/logger');
const { NotFoundError } = require('../utils/errors');

class BaseService {
  constructor(model, modelName) {
    this.model = model;
    this.modelName = modelName;
  }

  async findAll(options = {}) {
    try {
      return await this.model.findMany(options);
    } catch (error) {
      logger.error(`Error finding all ${this.modelName}:`, error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const record = await this.model.findUnique({ where: { id: parseInt(id) } });
      if (!record) {
        throw new NotFoundError(this.modelName);
      }
      return record;
    } catch (error) {
      logger.error(`Error finding ${this.modelName} by id:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      return await this.model.create({ data });
    } catch (error) {
      logger.error(`Error creating ${this.modelName}:`, error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      return await this.model.update({
        where: { id: parseInt(id) },
        data,
      });
    } catch (error) {
      logger.error(`Error updating ${this.modelName}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      return await this.model.delete({ where: { id: parseInt(id) } });
    } catch (error) {
      logger.error(`Error deleting ${this.modelName}:`, error);
      throw error;
    }
  }
}

module.exports = BaseService;
```



#### 2.4.2 Project Service Example

**File:** `src/services/ProjectService.js`

```javascript
const BaseService = require('./BaseService');
const { PrismaClient } = require('@prisma/client');
const cache = require('../utils/cache');
const logger = require('../config/logger');

const prisma = new PrismaClient();

class ProjectService extends BaseService {
  constructor() {
    super(prisma.project, 'Project');
  }

  async getFeaturedProjects() {
    const cacheKey = 'featured_projects';
    const cached = cache.get(cacheKey);
    
    if (cached) {
      logger.debug('Returning cached featured projects');
      return cached;
    }

    const projects = await this.model.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
    });

    cache.set(cacheKey, projects, 300); // Cache for 5 minutes
    return projects;
  }

  async getProjectBySlug(slug) {
    const cacheKey = `project_${slug}`;
    const cached = cache.get(cacheKey);
    
    if (cached) return cached;

    const project = await this.model.findUnique({ where: { slug } });
    if (!project) {
      throw new NotFoundError('Project');
    }

    cache.set(cacheKey, project, 600);
    return project;
  }

  async createProject(data) {
    const project = await super.create(data);
    cache.clear(); // Clear all cache when new project is created
    return project;
  }

  async updateProject(id, data) {
    const project = await super.update(id, data);
    cache.clear();
    return project;
  }
}

module.exports = new ProjectService();
```

### 2.5 Cache System

#### 2.5.1 Memory Cache Implementation

**File:** `src/utils/cache.js`

```javascript
const NodeCache = require('node-cache');
const logger = require('../config/logger');

class CacheManager {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: 600, // Default TTL: 10 minutes
      checkperiod: 120, // Check for expired keys every 2 minutes
      useClones: false,
    });

    this.cache.on('expired', (key, value) => {
      logger.debug(`Cache key expired: ${key}`);
    });
  }

  get(key) {
    try {
      const value = this.cache.get(key);
      if (value) {
        logger.debug(`Cache hit: ${key}`);
        return value;
      }
      logger.debug(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  set(key, value, ttl) {
    try {
      this.cache.set(key, value, ttl);
      logger.debug(`Cache set: ${key}`);
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  del(key) {
    try {
      this.cache.del(key);
      logger.debug(`Cache deleted: ${key}`);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  clear() {
    try {
      this.cache.flushAll();
      logger.info('Cache cleared');
      return true;
    } catch (error) {
      logger.error('Cache clear error:', error);
      return false;
    }
  }

  getStats() {
    return this.cache.getStats();
  }
}

module.exports = new CacheManager();
```

### 2.6 Performance Optimization

#### 2.6.1 Compression Middleware

**File:** `src/middleware/compression.js`

```javascript
const compression = require('compression');

const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Compression level (0-9)
  threshold: 1024, // Only compress responses > 1KB
});

module.exports = compressionMiddleware;
```

#### 2.6.2 Image Optimization Service

**File:** `src/services/ImageService.js`

```javascript
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../config/logger');

class ImageService {
  async optimizeImage(inputPath, outputPath, options = {}) {
    const {
      width = 1920,
      height = 1080,
      quality = 85,
      format = 'jpeg',
    } = options;

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

  async convertToWebP(inputPath, outputPath) {
    try {
      await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(outputPath);

      logger.info(`WebP conversion: ${outputPath}`);
      return outputPath;
    } catch (error) {
      logger.error('WebP conversion error:', error);
      throw error;
    }
  }
}

module.exports = new ImageService();
```

### 2.7 SEO Enhancement

#### 2.7.1 Meta Tags Helper

**File:** `src/utils/metaTags.js`

```javascript
const config = require('../config/constants');

class MetaTagsGenerator {
  generatePageMeta(page, data = {}) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    const defaults = {
      title: config.SITE_NAME,
      description: config.SITE_DESCRIPTION,
      image: `${baseUrl}/images/og-default.jpg`,
      url: baseUrl,
      type: 'website',
    };

    const meta = { ...defaults, ...data };

    return {
      title: meta.title,
      description: meta.description,
      canonical: meta.url,
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: meta.url,
        type: meta.type,
        image: meta.image,
        siteName: config.SITE_NAME,
      },
      twitter: {
        card: 'summary_large_image',
        title: meta.title,
        description: meta.description,
        image: meta.image,
      },
    };
  }

  generateProjectMeta(project) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    return this.generatePageMeta('project', {
      title: `${project.title} | ${config.SITE_NAME}`,
      description: project.description,
      image: project.imageUrl || `${baseUrl}/images/og-default.jpg`,
      url: `${baseUrl}/project/${project.slug}`,
      type: 'article',
    });
  }

  generateArticleMeta(article) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    return this.generatePageMeta('article', {
      title: `${article.title} | ${config.SITE_NAME}`,
      description: article.content.substring(0, 160),
      image: article.imageUrl || `${baseUrl}/images/og-default.jpg`,
      url: `${baseUrl}/blog/${article.slug}`,
      type: 'article',
    });
  }
}

module.exports = new MetaTagsGenerator();
```

#### 2.7.2 Structured Data Generator

**File:** `src/utils/structuredData.js`

```javascript
class StructuredDataGenerator {
  generatePersonSchema(profile) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.fullName,
      jobTitle: profile.title,
      description: profile.bio,
      email: profile.email,
      telephone: profile.phone,
      url: process.env.BASE_URL,
      image: profile.heroImage,
      sameAs: [], // Will be populated with social links
    };
  }

  generateProjectSchema(project) {
    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      image: project.imageUrl,
      url: project.demoUrl,
      dateCreated: project.createdAt,
      keywords: project.tags,
    };
  }

  generateArticleSchema(article) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.content.substring(0, 160),
      image: article.imageUrl,
      datePublished: article.createdAt,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Person',
        name: 'Hafidz Humaidi',
      },
    };
  }

  generateWebsiteSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Hafidz Humaidi Portfolio',
      url: process.env.BASE_URL,
      description: 'Portfolio website of Hafidz Humaidi - UI/UX Designer & Web Developer',
    };
  }
}

module.exports = new StructuredDataGenerator();
```

### 2.8 Frontend Enhancements

#### 2.8.1 Service Worker for PWA

**File:** `public/sw.js`

```javascript
const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/js/main.js',
  '/images/asset_1.jpg',
  '/images/asset_2.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

#### 2.8.2 Lazy Loading Implementation

**File:** `public/js/lazyload.js`

```javascript
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target);
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );

      this.images.forEach((img) => this.observer.observe(img));
    } else {
      // Fallback for older browsers
      this.images.forEach((img) => this.loadImage(img));
    }
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    img.src = src;
    img.removeAttribute('data-src');
    img.classList.add('loaded');

    if (this.observer) {
      this.observer.unobserve(img);
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new LazyLoader());
} else {
  new LazyLoader();
}
```

#### 2.8.3 Loading States Component

**File:** `public/js/loadingStates.js`

```javascript
class LoadingManager {
  constructor() {
    this.createLoadingOverlay();
  }

  createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden items-center justify-center';
    overlay.innerHTML = `
      <div class="bg-secondary p-8 rounded-2xl border border-white/10">
        <div class="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto"></div>
        <p class="text-white mt-4 text-center">Loading...</p>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  show(message = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      const text = overlay.querySelector('p');
      if (text) text.textContent = message;
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
    }
  }

  hide() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
    }
  }

  showSkeleton(container) {
    container.innerHTML = `
      <div class="animate-pulse space-y-4">
        <div class="h-4 bg-white/10 rounded w-3/4"></div>
        <div class="h-4 bg-white/10 rounded w-1/2"></div>
        <div class="h-4 bg-white/10 rounded w-5/6"></div>
      </div>
    `;
  }
}

window.loadingManager = new LoadingManager();
```

### 2.9 Configuration Management

#### 2.9.1 Constants File

**File:** `src/config/constants.js`

```javascript
module.exports = {
  // Site Information
  SITE_NAME: 'Hafidz Humaidi Portfolio',
  SITE_DESCRIPTION: 'Portfolio of Hafidz Humaidi - UI/UX Designer & Web Developer',
  
  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  UPLOAD_DIR: 'public/uploads',
  
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
    INTERNAL_SERVER_ERROR: 500,
  },
};
```



#### 2.9.2 Environment Configuration

**File:** `.env.example`

```env
# Server
NODE_ENV=development
PORT=3000
BASE_URL=http://localhost:3000

# Database
DATABASE_URL="file:./prisma/dev.db"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Session
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=public/uploads

# Cache
CACHE_ENABLED=true
CACHE_TTL=600

# Email (for future use)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

### 2.10 Testing Strategy

#### 2.10.1 Test Structure

```
tests/
├── unit/
│   ├── services/
│   │   ├── ProjectService.test.js
│   │   ├── ImageService.test.js
│   │   └── CacheManager.test.js
│   ├── utils/
│   │   ├── errors.test.js
│   │   ├── metaTags.test.js
│   │   └── structuredData.test.js
│   └── middleware/
│       ├── validators.test.js
│       └── errorHandler.test.js
├── integration/
│   ├── api/
│   │   ├── projects.test.js
│   │   ├── articles.test.js
│   │   └── contact.test.js
│   └── auth/
│       └── login.test.js
└── setup.js
```

#### 2.10.2 Jest Configuration

**File:** `jest.config.js`

```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/config/**',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true,
};
```

#### 2.10.3 Test Setup

**File:** `tests/setup.js`

```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup test database
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'file:./prisma/test.db';
});

afterAll(async () => {
  // Cleanup
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clear cache before each test
  const cache = require('../src/utils/cache');
  cache.clear();
});
```

#### 2.10.4 Example Unit Test

**File:** `tests/unit/services/ProjectService.test.js`

```javascript
const ProjectService = require('../../../src/services/ProjectService');
const { NotFoundError } = require('../../../src/utils/errors');

describe('ProjectService', () => {
  describe('getFeaturedProjects', () => {
    it('should return featured projects', async () => {
      const projects = await ProjectService.getFeaturedProjects();
      expect(Array.isArray(projects)).toBe(true);
    });

    it('should cache featured projects', async () => {
      const first = await ProjectService.getFeaturedProjects();
      const second = await ProjectService.getFeaturedProjects();
      expect(first).toEqual(second);
    });
  });

  describe('getProjectBySlug', () => {
    it('should throw NotFoundError for invalid slug', async () => {
      await expect(
        ProjectService.getProjectBySlug('non-existent-slug')
      ).rejects.toThrow(NotFoundError);
    });
  });
});
```

#### 2.10.5 Example Integration Test

**File:** `tests/integration/api/projects.test.js`

```javascript
const request = require('supertest');
const app = require('../../../src/app');

describe('Projects API', () => {
  describe('GET /api/projects', () => {
    it('should return all projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(response.body).toHaveProperty('projects');
      expect(Array.isArray(response.body.projects)).toBe(true);
    });
  });

  describe('GET /project/:slug', () => {
    it('should return 404 for invalid slug', async () => {
      await request(app)
        .get('/project/invalid-slug')
        .expect(404);
    });
  });

  describe('POST /contact', () => {
    it('should accept valid contact form', async () => {
      const response = await request(app)
        .post('/contact')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message',
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    it('should reject invalid email', async () => {
      await request(app)
        .post('/contact')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          message: 'This is a test message',
        })
        .expect(400);
    });
  });
});
```

### 2.11 Code Quality Tools

#### 2.11.1 ESLint Configuration

**File:** `.eslintrc.js`

```javascript
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'quote-props': ['error', 'as-needed'],
    'prefer-template': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'no-param-reassign': 'error',
    'prefer-destructuring': ['error', { object: true, array: false }],
    'max-len': ['warn', { code: 100, ignoreStrings: true, ignoreTemplateLiterals: true }],
    'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
    complexity: ['warn', 10],
  },
};
```

#### 2.11.2 Prettier Configuration

**File:** `.prettierrc.js`

```javascript
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'lf',
};
```

#### 2.11.3 Husky Pre-commit Hook

**File:** `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint-staged
```

#### 2.11.4 Lint-staged Configuration

**File:** `.lintstagedrc.js`

```javascript
module.exports = {
  '*.js': ['eslint --fix', 'prettier --write', 'jest --bail --findRelatedTests'],
  '*.{json,md}': ['prettier --write'],
};
```

### 2.12 DevOps Configuration

#### 2.12.1 GitHub Actions CI/CD

**File:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build --if-present

      - name: Test build
        run: node src/app.js &
        env:
          NODE_ENV: production
```

#### 2.12.2 Dockerfile

**File:** `Dockerfile`

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production && \
    npx prisma generate

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

# Copy application code
COPY --chown=nodejs:nodejs . .

# Create necessary directories
RUN mkdir -p logs public/uploads && \
    chown -R nodejs:nodejs logs public/uploads

USER nodejs

EXPOSE 3000

ENV NODE_ENV=production

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/app.js"]
```

#### 2.12.3 Docker Compose

**File:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=file:/app/data/prod.db
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
      - ./public/uploads:/app/public/uploads
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'node', 'healthcheck.js']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Development service
  dev:
    build:
      context: .
      target: builder
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=development
      - PORT=3000
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
```

#### 2.12.4 Health Check Endpoint

**File:** `src/routes/health.js`

```javascript
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const cache = require('../utils/cache');

const prisma = new PrismaClient();

// Basic health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Detailed readiness check
router.get('/ready', async (req, res) => {
  const checks = {
    database: false,
    cache: false,
  };

  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;

    // Check cache
    const cacheStats = cache.getStats();
    checks.cache = true;

    const allHealthy = Object.values(checks).every((check) => check === true);

    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? 'ready' : 'not ready',
      checks,
      cacheStats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      checks,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
```

### 2.13 Documentation Structure

#### 2.13.1 README.md Template

```markdown
# Portfolio Website

Modern portfolio website built with Express.js, Prisma, and EJS.

## Features

- ✅ Secure authentication with rate limiting
- ✅ Image optimization and lazy loading
- ✅ SEO optimized with meta tags and structured data
- ✅ PWA support with service worker
- ✅ Comprehensive error handling and logging
- ✅ Caching for improved performance
- ✅ Responsive design
- ✅ Admin dashboard for content management

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** SQLite with Prisma ORM
- **Template Engine:** EJS
- **Styling:** Tailwind CSS
- **Testing:** Jest, Supertest
- **Code Quality:** ESLint, Prettier, Husky

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure
4. Run migrations: `npx prisma migrate dev`
5. Seed database: `npm run seed`
6. Start server: `npm run dev`

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

See [ARCHITECTURE.md](docs/ARCHITECTURE.md)

## API Documentation

See [API.md](docs/API.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
```

## 3. Implementation Phases

### Phase 1: Security & Error Handling (Priority: High)
- Install security dependencies
- Implement rate limiting
- Add CSRF protection
- Create error classes and centralized handler
- Add input validation
- Secure file upload

### Phase 2: Testing & Code Quality (Priority: High)
- Setup Jest and testing infrastructure
- Write unit tests for services
- Write integration tests for APIs
- Configure ESLint and Prettier
- Setup Husky pre-commit hooks

### Phase 3: Performance & Caching (Priority: Medium)
- Implement memory cache
- Add compression middleware
- Create image optimization service
- Add lazy loading to frontend
- Implement service worker

### Phase 4: SEO & Accessibility (Priority: Medium)
- Add meta tags generator
- Implement structured data
- Update sitemap to include articles
- Add ARIA labels
- Improve semantic HTML

### Phase 5: Logging & Monitoring (Priority: Medium)
- Setup Winston logger
- Add request logging
- Create health check endpoints
- Implement error logging

### Phase 6: Architecture Refactoring (Priority: Low)
- Create service layer
- Extract constants
- Improve separation of concerns
- Add JSDoc comments

### Phase 7: DevOps & Documentation (Priority: Low)
- Create Dockerfile
- Setup Docker Compose
- Configure GitHub Actions
- Write comprehensive documentation

## 4. Backward Compatibility

All improvements maintain backward compatibility:
- Existing routes remain unchanged
- Database schema not modified
- Existing admin users continue to work
- Frontend functionality preserved
- API responses maintain same structure

## 5. Performance Targets

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90
- Test Coverage: > 80%

## 6. Security Checklist

- ✅ Rate limiting on sensitive endpoints
- ✅ CSRF protection
- ✅ Security headers (Helmet)
- ✅ Input validation and sanitization
- ✅ Secure file upload
- ✅ XSS protection
- ✅ SQL injection protection (Prisma)
- ✅ Secure session management
- ✅ HTTPS enforcement (production)

## 7. Testing Strategy

- Unit tests: 80%+ coverage
- Integration tests for all API endpoints
- E2E tests for critical user flows
- Performance testing
- Security testing

## 8. Monitoring & Observability

- Health check endpoints
- Request logging
- Error logging with stack traces
- Performance metrics
- Cache statistics
