/**
 * Middleware to inject common data (profile, socials) into res.locals
 * This avoids code duplication across routes
 */

const repo = require('../services/repo');
const logger = require('../config/logger');

const injectCommonData = async (req, res, next) => {
  try {
    const [profile, socials] = await Promise.all([repo.getProfile(), repo.getSocials()]);

    res.locals.profile = profile;
    res.locals.socials = socials;
    res.locals.realtimeEnabled = process.env.NODE_ENV !== 'production';

    next();
  } catch (error) {
    logger.error('Error injecting common data:', error);
    next(error);
  }
};

module.exports = injectCommonData;
