const repo = require('../services/repo');
const { getIO } = require('../realtime');
const logger = require('../config/logger');
const cache = require('../utils/cache');

async function broadcastExperiences() {
  try {
    const io = getIO();
    if (!io) return;
    const experiences = await repo.getExperiences();
    io.emit('experience:update', experiences);
    logger.info(`[realtime] broadcast experiences: ${experiences.length}`);
    
    // Clear cache when experiences are updated
    cache.clear();
  } catch (e) {
    logger.error('[realtime] broadcast error:', e);
  }
}

const getExperiences = async (req, res) => {
  try {
    const experiences = await repo.getExperiences();
    
    logger.info(`Fetched ${experiences.length} experiences for admin`);
    
    res.render('admin/experience/index', {
      experiences,
      success: req.query.success || null,
      error: req.query.error || null,
    });
  } catch (error) {
    logger.error('Error fetching experiences:', error);
    res.status(500).send('Server Error');
  }
};

const getForm = async (req, res) => {
  try {
    let experience = null;
    
    if (req.params.id) {
      experience = await repo.getExperienceById(req.params.id);
      
      if (!experience) {
        return res.status(404).send('Experience not found');
      }
      
      logger.info(`Editing experience: ${experience.id}`);
    } else {
      logger.info('Creating new experience');
    }
    
    res.render('admin/experience/form', {
      experience,
      error: req.query.error || null,
    });
  } catch (error) {
    logger.error('Error loading form:', error);
    res.status(500).send('Server Error');
  }
};

const createExperience = async (req, res) => {
  try {
    const { company, position, period, description, order } = req.body;

    // Validation
    if (!company || !position || !period) {
      return res.render('admin/experience/form', {
        experience: req.body,
        error: 'Company, position, and period are required',
      });
    }

    const experience = await repo.createExperience({
      company: company.trim(),
      position: position.trim(),
      period: period.trim(),
      description: description ? description.trim() : null,
      order: order ? parseInt(order) : 0,
    });

    logger.info(`Experience created: ${experience.id} - ${experience.position} at ${experience.company}`);
    
    await broadcastExperiences();
    res.redirect('/admin/experience?success=created');
  } catch (error) {
    logger.error('Error creating experience:', error);
    res.render('admin/experience/form', {
      experience: req.body,
      error: 'Error creating experience: ' + error.message,
    });
  }
};

const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, position, period, description, order } = req.body;

    // Validation
    if (!company || !position || !period) {
      return res.render('admin/experience/form', {
        experience: { ...req.body, id: parseInt(id) },
        error: 'Company, position, and period are required',
      });
    }

    // Check if exists
    const existing = await repo.getExperienceById(id);
    
    if (!existing) {
      return res.status(404).send('Experience not found');
    }

    const experience = await repo.updateExperience(id, {
      company: company.trim(),
      position: position.trim(),
      period: period.trim(),
      description: description ? description.trim() : null,
      order: order ? parseInt(order) : 0,
    });

    logger.info(`Experience updated: ${experience.id} - ${experience.position} at ${experience.company}`);
    
    await broadcastExperiences();
    res.redirect('/admin/experience?success=updated');
  } catch (error) {
    logger.error('Error updating experience:', error);
    res.render('admin/experience/form', {
      experience: { ...req.body, id: req.params.id },
      error: 'Error updating experience: ' + error.message,
    });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    
    const experience = await repo.getExperienceById(id);
    
    if (!experience) {
      return res.status(404).send('Experience not found');
    }
    
    await repo.deleteExperience(id);
    
    logger.info(`Experience deleted: ${id} - ${experience.position} at ${experience.company}`);
    
    await broadcastExperiences();
    res.redirect('/admin/experience?success=deleted');
  } catch (error) {
    logger.error('Error deleting experience:', error);
    res.status(500).send('Error deleting experience');
  }
};

const moveUp = async (req, res) => {
  try {
    const { id } = req.params;
    
    const current = await repo.getExperienceById(id);
    
    if (!current) {
      return res.status(404).send('Experience not found');
    }
    
    const above = await repo.findExperienceAbove(current.order);
    
    if (!above) {
      return res.redirect('/admin/experience?error=already_first');
    }
    
    await repo.updateExperience(current.id, { order: above.order });
    await repo.updateExperience(above.id, { order: current.order });
    
    logger.info(`Experience moved up: ${current.id}`);
    
    await broadcastExperiences();
    res.redirect('/admin/experience?success=reordered');
  } catch (error) {
    logger.error('Error moving experience up:', error);
    res.status(500).send('Error reordering experience');
  }
};

const moveDown = async (req, res) => {
  try {
    const { id } = req.params;
    
    const current = await repo.getExperienceById(id);
    
    if (!current) {
      return res.status(404).send('Experience not found');
    }
    
    const below = await repo.findExperienceBelow(current.order);
    
    if (!below) {
      return res.redirect('/admin/experience?error=already_last');
    }
    
    await repo.updateExperience(current.id, { order: below.order });
    await repo.updateExperience(below.id, { order: current.order });
    
    logger.info(`Experience moved down: ${current.id}`);
    
    await broadcastExperiences();
    res.redirect('/admin/experience?success=reordered');
  } catch (error) {
    logger.error('Error moving experience down:', error);
    res.status(500).send('Error reordering experience');
  }
};

module.exports = {
  getExperiences,
  getForm,
  createExperience,
  updateExperience,
  deleteExperience,
  moveUp,
  moveDown,
};
