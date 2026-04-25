/**
 * Winston Logger Configuration with Request ID support
 */

const winston = require('winston');
const path = require('path');

// Custom format to include request ID
const requestIdFormat = winston.format((info, opts) => {
  if (opts.requestId) {
    info.requestId = opts.requestId;
  }
  return info;
});

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  requestIdFormat(),
  winston.format.json()
);

const consoleFormat =
  process.env.NODE_ENV !== 'production'
    ? winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, requestId, ...meta }) => {
          const reqId = requestId ? `[${requestId}]` : '';
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
          return `${timestamp} ${level} ${reqId}: ${message} ${metaStr}`;
        })
      )
    : logFormat;

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

// File transports (only in non-serverless environments)
if (process.env.LOG_TO_FILE === 'true' && !process.env.VERCEL) {
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: logFormat,
    })
  );
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: logFormat,
    })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'portfolio-api' },
  transports,
  // Don't exit on handled exceptions
  exitOnError: false,
});

// Create child logger with request ID
logger.withRequestId = (requestId) => {
  return logger.child({ requestId });
};

module.exports = logger;
