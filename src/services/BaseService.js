/**
 * Base Service Class
 */

const logger = require('../config/logger');
const { NotFoundError } = require('../utils/errors');

class BaseService {
  constructor(model, modelName) {
    this.model = model;
    this.modelName = modelName;
  }

  async findAll(options = {}) {
    try {
      logger.debug(`Finding all ${this.modelName}`);
      return await this.model.findMany(options);
    } catch (error) {
      logger.error(`Error finding all ${this.modelName}:`, error);
      throw error;
    }
  }

  async findById(id) {
    try {
      logger.debug(`Finding ${this.modelName} by id: ${id}`);
      const record = await this.model.findUnique({
        where: { id: parseInt(id) },
      });
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
      logger.info(`Creating ${this.modelName}`);
      return await this.model.create({ data });
    } catch (error) {
      logger.error(`Error creating ${this.modelName}:`, error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      logger.info(`Updating ${this.modelName} with id: ${id}`);
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
      logger.info(`Deleting ${this.modelName} with id: ${id}`);
      return await this.model.delete({ where: { id: parseInt(id) } });
    } catch (error) {
      logger.error(`Error deleting ${this.modelName}:`, error);
      throw error;
    }
  }

  async count(where = {}) {
    try {
      return await this.model.count({ where });
    } catch (error) {
      logger.error(`Error counting ${this.modelName}:`, error);
      throw error;
    }
  }
}

module.exports = BaseService;
