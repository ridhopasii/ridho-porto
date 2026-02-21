const repo = require('../services/repo');
const fs = require('fs');
const path = require('path');
const { uploadLocalFileToSupabase, isSupabaseEnabled } = require('../utils/storage');

const getSkills = async (req, res) => {
  try {
    const skills = await repo.getSkills();
    res.render('admin/skills/index', { skills });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const getForm = async (req, res) => {
  try {
    let skill = null;
    if (req.params.id) {
      skill = await repo.getSkillById(req.params.id);
      if (!skill) return res.status(404).send('Skill not found');
    }
    res.render('admin/skills/form', { skill });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const createSkill = async (req, res) => {
  try {
    const { name, category, percentage, iconType, iconName, iconUrl } = req.body;
    let icon = null;

    if (iconType === 'name') {
      icon = iconName;
    } else {
      // iconType === 'image'
      icon = iconUrl || null;
      if (req.file) {
        if (isSupabaseEnabled()) {
          const url = await uploadLocalFileToSupabase(req.file, 'skills');
          if (url) {
            icon = url;
            try { fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path); } catch (e) {}
          } else {
            icon = '/uploads/' + req.file.filename;
          }
        } else {
          icon = '/uploads/' + req.file.filename;
        }
      }
    }

    await repo.createSkill({ name, category, percentage: parseInt(percentage), icon });

    res.redirect('/admin/skills?success=created');
  } catch (error) {
    console.error('Error creating skill:', error);
    res.render('admin/skills/form', {
      skill: req.body,
      error: 'Error creating skill: ' + error.message,
    });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, percentage, iconType, iconName, iconUrl } = req.body;

    const existingSkill = await repo.getSkillById(id);

    if (!existingSkill) return res.status(404).send('Skill not found');

    let icon = existingSkill.icon;

    if (iconType === 'name') {
      icon = iconName;
    } else {
      // iconType === 'image'
      // If user provided a new URL, use it
      if (iconUrl && iconUrl !== existingSkill.icon) {
        icon = iconUrl;
      }

      if (req.file) {
        if (icon && icon.startsWith('/uploads/')) {
          const oldPath = path.join(__dirname, '../../public', icon);
          if (fs.existsSync(oldPath)) { try { fs.unlinkSync(oldPath); } catch (_) {} }
        }
        if (isSupabaseEnabled()) {
          const url = await uploadLocalFileToSupabase(req.file, 'skills');
          if (url) {
            icon = url;
            try { fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path); } catch (e) {}
          } else {
            icon = '/uploads/' + req.file.filename;
          }
        } else {
          icon = '/uploads/' + req.file.filename;
        }
      }
    }

    await repo.updateSkill(id, { name, category, percentage: parseInt(percentage), icon });

    res.redirect('/admin/skills?success=updated');
  } catch (error) {
    console.error('Error updating skill:', error);
    res.render('admin/skills/form', {
      skill: { ...req.body, id: req.params.id },
      error: 'Error updating skill: ' + error.message,
    });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await repo.getSkillById(id);

    if (skill && skill.icon && skill.icon.startsWith('/')) {
      const imagePath = path.join(__dirname, '../../public', skill.icon);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await repo.deleteSkill(id);

    res.redirect('/admin/skills?success=deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting skill');
  }
};

module.exports = {
  getSkills,
  getForm,
  createSkill,
  updateSkill,
  deleteSkill,
};
