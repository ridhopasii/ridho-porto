/**
 * Test Setup File
 */

const { PrismaClient } = require('@prisma/client');
let prisma;

beforeAll(async () => {
  // Setup test environment
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'file:./dev.db';
  process.env.LOG_LEVEL = 'error';

  prisma = new PrismaClient();
});

afterAll(async () => {
  // Cleanup
  if (prisma) await prisma.$disconnect();
});

beforeEach(async () => {
  // Clear cache before each test
  const cache = require('../src/utils/cache');
  cache.clear();
});

// Global test utilities
global.testUtils = {
  generateMockProject: () => ({
    title: 'Test Project',
    slug: 'test-project',
    description: 'This is a test project description',
    tags: 'test,project',
    featured: false,
  }),
  generateMockArticle: () => ({
    title: 'Test Article',
    slug: 'test-article',
    content: 'This is test article content with more than 50 characters to pass validation',
    published: true,
  }),
};
