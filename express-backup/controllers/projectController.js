const repo = require('../services/repo');
const fs = require('fs');
const path = require('path');
const { uploadLocalFileToSupabase, isSupabaseEnabled } = require('../utils/storage');

// Helper to create slug
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

const getProjects = async (req, res) => {
  try {
    const projects = await repo.getProjects();
    res.render('admin/projects/index', {
      title: 'Manage Projects',
      path: '/admin/projects',
      projects,
      user: req.user,
      layout: 'admin/layout',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const getForm = async (req, res) => {
  try {
    let project = null;
    if (req.params.id) {
      project = await repo.getProjectById(req.params.id);
      if (!project) return res.status(404).send('Project not found');
    }
    res.render('admin/projects/form', {
      title: project ? 'Edit Project' : 'Add Project',
      path: '/admin/projects',
      project,
      user: req.user,
      layout: 'admin/layout',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      demoUrl,
      repoUrl,
      tags,
      category,
      featured,
      imageUrl: bodyImageUrl,
    } = req.body;
    let imageUrl = bodyImageUrl || null;

    if (req.file) {
      imageUrl = await uploadLocalFileToSupabase(req.file, 'projects');
    }

    const slug = createSlug(title);

    await repo.createProject({
      title,
      slug,
      description,
      content,
      imageUrl,
      demoUrl,
      repoUrl,
      tags,
      featured: featured === 'on',
    }, { accessToken: req.supabaseAccessToken });

    res.redirect('/admin/projects?success=created');
  } catch (error) {
    console.error(error);
    res.render('admin/projects/form', {
      title: 'Add Project',
      path: '/admin/projects',
      project: req.body,
      user: req.user,
      layout: 'admin/layout',
      error: 'Error creating project: ' + error.message,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      content,
      demoUrl,
      repoUrl,
      tags,
      category,
      featured,
      imageUrl: bodyImageUrl,
    } = req.body;

    const existingProject = await repo.getProjectById(id);

    if (!existingProject) return res.status(404).send('Project not found');

    let imageUrl = existingProject.imageUrl;

    // If a new URL is provided, use it (can be overwritten by file below)
    if (bodyImageUrl && bodyImageUrl !== existingProject.imageUrl) {
      imageUrl = bodyImageUrl;
    }

    // If a file is uploaded, it takes precedence and we delete the old local file if it exists
    if (req.file) {
      if (imageUrl && imageUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '../../public', imageUrl);
        if (fs.existsSync(oldPath)) { try { fs.unlinkSync(oldPath); } catch (_) { } }
      }
      imageUrl = await uploadLocalFileToSupabase(req.file, 'projects');
    }

    const slug = createSlug(title);

    await repo.updateProject(id, {
      title,
      slug,
      description,
      content,
      imageUrl,
      demoUrl,
      repoUrl,
      tags,
      featured: featured === 'on',
    }, { accessToken: req.supabaseAccessToken });

    res.redirect('/admin/projects?success=updated');
  } catch (error) {
    console.error(error);
    res.render('admin/projects/form', {
      title: 'Edit Project',
      path: '/admin/projects',
      project: { ...req.body, id: req.params.id },
      user: req.user,
      layout: 'admin/layout',
      error: 'Error updating project: ' + error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await repo.getProjectById(id);

    if (project && project.imageUrl && project.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '../../public', project.imageUrl);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await repo.deleteProject(id, { accessToken: req.supabaseAccessToken });

    res.redirect('/admin/projects?success=deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting project');
  }
};

// Public
const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await repo.getProjectBySlug(slug);

    if (!project) {
      res.status(404).render('404', {
        profile: res.locals.profile || {},
        socials: res.locals.socials || [],
      });
      return;
    }

    // Pass 'title' explicitly as it's often used in layout for <title>
    res.render('project-detail', {
      project,
      title: project.title,
      profile: res.locals.profile,
      socials: res.locals.socials,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getProjects,
  getForm,
  createProject,
  updateProject,
  deleteProject,
  getProjectBySlug,
};
