/**
 * Environment Variable Validation
 * Validates required environment variables on startup
 */

const logger = require('./logger');

const requiredEnvVars = ['NODE_ENV', 'PORT', 'DATABASE_URL', 'JWT_SECRET', 'SESSION_SECRET'];

const optionalEnvVars = {
  BASE_URL: 'http://localhost:3000',
  LOG_LEVEL: 'info',
  RATE_LIMIT_WINDOW_MS: '900000',
  RATE_LIMIT_MAX_REQUESTS: '100',
  MAX_FILE_SIZE: '5242880',
  UPLOAD_DIR: 'public/uploads',
  CACHE_ENABLED: 'true',
  CACHE_TTL: '600',
  HELMET_ENABLED: 'true',
  COMPRESSION_ENABLED: 'true',
  COMPRESSION_LEVEL: '6',
};

function validateEnv() {
  const missing = [];
  const warnings = [];

  // Check required variables
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`);
    logger.error('Please check your .env file');
    process.exit(1);
  }

  // Set defaults for optional variables
  Object.entries(optionalEnvVars).forEach(([varName, defaultValue]) => {
    if (!process.env[varName]) {
      process.env[varName] = defaultValue;
      warnings.push(`${varName} not set, using default: ${defaultValue}`);
    }
  });

  // Validate specific formats
  if (process.env.PORT && isNaN(parseInt(process.env.PORT))) {
    logger.error('PORT must be a number');
    process.exit(1);
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    logger.warn('JWT_SECRET should be at least 32 characters for security');
  }

  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
    logger.warn('SESSION_SECRET should be at least 32 characters for security');
  }

  // Log warnings
  if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
    warnings.forEach((warning) => logger.warn(warning));
  }

  logger.info('Environment variables validated successfully');
}

module.exports = { validateEnv };
