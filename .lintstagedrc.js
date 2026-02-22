/**
 * Lint-staged Configuration
 */

module.exports = {
  '*.js': ['prettier --write'],
  '*.{json,md,css}': ['prettier --write'],
};
