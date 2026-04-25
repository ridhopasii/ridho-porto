require('dotenv').config();

// Validate environment variables before starting
const { validateEnv } = require('./config/env');
validateEnv();

const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');

// Import middleware
const securityConfig = require('./config/security');
const compressionMiddleware = require('./middleware/compression');
const requestLogger = require('./middleware/requestLogger');
const requestIdMiddleware = require('./middleware/requestId');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('./config/logger');

const app = express();
const server = http.createServer(app);

// Only init realtime if not in serverless environment to avoid connection issues
let io;
if (process.env.NODE_ENV !== 'production') {
  const { init: initRealtime } = require('./realtime');
  io = initRealtime(server);
}

const PORT = process.env.PORT || 3000;

// Request ID middleware (must be first)
app.use(requestIdMiddleware);

// Security middleware
app.use(securityConfig);

// Compression middleware
app.use(compressionMiddleware);

// Request logging
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static files with caching
app.use(
  express.static(path.join(__dirname, '../public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    etag: true,
  })
);

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// View locals
app.use((req, res, next) => {
  res.locals.realtimeEnabled = process.env.NODE_ENV !== 'production';
  next();
});

// Routes
app.use('/', require('./routes/public'));
app.use('/', require('./routes/seo'));
app.use('/', require('./routes/health'));
app.use('/admin', require('./routes/admin'));

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} signal received: closing HTTP server`);
  server.close(async () => {
    logger.info('HTTP server closed');
    // Close database connections if any
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.$disconnect();
      logger.info('Database connections closed');
    } catch (error) {
      logger.error('Error closing database connections:', error);
    }
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

if (require.main === module) {
  server.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
