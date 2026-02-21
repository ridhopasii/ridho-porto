/**
 * Project Service
 */

const BaseService = require('./BaseService');
const { PrismaClient } = require('@prisma/client');
const cache = require('../utils/cache');
const logger = require('../config/logger');
const { NotFoundError } = require('../utils/errors');
const constants = require('../config/constants');

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

    cache.set(cacheKey, projects, constants.CACHE_TTL.MEDIUM);
    return projects;
  }

  async getProjectBySlug(slug) {
    const cacheKey = `project_${slug}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      logger.debug(`Returning cached project: ${slug}`);
      return cached;
    }

    const project = await this.model.findUnique({ where: { slug } });
    if (!project) {
      throw new NotFoundError('Project');
    }

    cache.set(cacheKey, project, constants.CACHE_TTL.LONG);
    return project;
  }

  async createProject(data) {
    const project = await super.create(data);
    cache.clear(); // Clear all cache when new project is created
    logger.info(`Project created: ${project.id}`);
    return project;
  }

  async updateProject(id, data) {
    const project = await super.update(id, data);
    cache.clear(); // Clear all cache when project is updated
    logger.info(`Project updated: ${id}`);
    return project;
  }

  async deleteProject(id) {
    const project = await super.delete(id);
    cache.clear(); // Clear all cache when project is deleted
    logger.info(`Project deleted: ${id}`);
    return project;
  }

  async getAllProjects(page = 1, limit = constants.DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * limit;
    const cacheKey = `projects_page_${page}_limit_${limit}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const [projects, total] = await Promise.all([
      this.model.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.count(),
    ]);

    const result = {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    cache.set(cacheKey, result, constants.CACHE_TTL.SHORT);
    return result;
  }
}

module.exports = new ProjectService();
