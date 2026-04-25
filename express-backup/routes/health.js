/**
 * Health Check Routes
 */

const express = require('express');
const router = express.Router();
const cache = require('../utils/cache');
const { asyncHandler } = require('../middleware/errorHandler');
const repo = require('../services/repo');

// Basic health check
router.get(
  '/health',
  asyncHandler(async (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
      },
    });
  })
);

// Detailed readiness check
router.get(
  '/ready',
  asyncHandler(async (req, res) => {
    const checks = {
      database: false,
      cache: false,
    };

    try {
      // Check database
      await repo.dbPing();
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
  })
);

// Liveness probe
router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

module.exports = router;
