/**
 * Public Routes
 * All routes accessible without authentication
 */

const express = require('express');
const router = express.Router();
const repo = require('../services/repo');
const injectCommonData = require('../middleware/injectCommonData');
const { contactLimiter } = require('../middleware/rateLimiter');
const { contactValidation } = require('../middleware/validators');
const { groupProjectsByType, sortAwardsByDate } = require('../utils/viewUtils');

// Controllers
const articleController = require('../controllers/articleController');
const projectController = require('../controllers/projectController');
const messageController = require('../controllers/messageController');

// Home Page
router.get('/', async (req, res, next) => {
  try {
    const [
      profile,
      experiences,
      education,
      skills,
      projects,
      socials,
      testimonials,
      awards,
      articles,
      services,
      organizations,
      publications,
    ] = await Promise.all([
      repo.getProfile(),
      repo.getExperiences(),
      repo.getEducation(),
      repo.getSkills(),
      repo.getProjects(),
      repo.getSocials(),
      repo.getTestimonials(),
      repo.getAwards(),
      repo.getRecentArticles(3),
      repo.getServices(),
      repo.getOrganizations(),
      repo.getPublications(),
    ]);

    // Group skills by category
    const skillCategories = skills.reduce((acc, skill) => {
      acc[skill.category] = acc[skill.category] || [];
      acc[skill.category].push(skill);
      return acc;
    }, {});

    res.render('index', {
      profile,
      experiences,
      education,
      skillCategories,
      projects,
      socials,
      testimonials,
      awards,
      articles,
      services,
      organizations,
      publications,
    });
  } catch (error) {
    next(error);
  }
});

// Blog Routes
router.get('/blog', injectCommonData, articleController.getPublicArticles);
router.get('/blog/:slug', injectCommonData, articleController.getArticleBySlug);

// Project Routes (use /projects for consistency)
router.get('/projects/:slug', injectCommonData, projectController.getProjectBySlug);

// Organizations Page
router.get('/organizations', async (req, res, next) => {
  try {
    const [profile, socials, organizations] = await Promise.all([
      repo.getProfile(),
      repo.getSocials(),
      repo.getOrganizations(),
    ]);
    res.render('organizations', { profile, socials, organizations, title: 'Organisasi' });
  } catch (error) {
    next(error);
  }
});

// Skills Page
router.get('/skills', async (req, res, next) => {
  try {
    const [profile, socials, skills] = await Promise.all([
      repo.getProfile(),
      repo.getSocials(),
      repo.getSkills(),
    ]);
    const skillCategories = skills.reduce((acc, skill) => {
      acc[skill.category] = acc[skill.category] || [];
      acc[skill.category].push(skill);
      return acc;
    }, {});
    res.render('skills', { profile, socials, skillCategories, title: 'Keterampilan' });
  } catch (error) {
    next(error);
  }
});

// Publications Page
router.get('/publications', async (req, res, next) => {
  try {
    const [profile, socials, publications] = await Promise.all([
      repo.getProfile(),
      repo.getSocials(),
      repo.getPublications(),
    ]);
    res.render('publications', { profile, socials, publications, title: 'Publikasi' });
  } catch (error) {
    next(error);
  }
});

// Showcase Page
router.get('/showcase', async (req, res, next) => {
  try {
    const [profile, socials, projects, awards, skills] = await Promise.all([
      repo.getProfile(),
      repo.getSocials(),
      repo.getProjects(),
      repo.getAwards(),
      repo.getSkills(),
    ]);

    const grouped = groupProjectsByType(projects);
    const sortedAwards = sortAwardsByDate(awards);

    res.render('showcase', {
      profile,
      socials,
      projectsAll: grouped.project,
      projectsDesign: grouped.design,
      projectsEditing: grouped.editing,
      awards: sortedAwards,
      skills,
      title: 'Showcase',
      metaDescription: 'Proyek, sertifikat, dan tech stack.',
    });
  } catch (error) {
    next(error);
  }
});

// Awards Page
router.get('/awards', injectCommonData, async (req, res, next) => {
  try {
    const awards = await repo.getAwards();
    res.render('awards', { awards });
  } catch (error) {
    next(error);
  }
});

// Contact Form
router.post('/contact', contactLimiter, contactValidation, messageController.sendMessage);

// Search Route
router.get('/search', async (req, res, next) => {
  try {
    const q = req.query.q;
    if (!q) return res.redirect('/');

    const [profile, socials, projects, articles] = await Promise.all([
      repo.getProfile(),
      repo.getSocials(),
      repo.searchProjects(q),
      repo.searchArticles(q),
    ]);

    res.render('search', {
      profile,
      socials,
      projects,
      articles,
      q,
      title: `Hasil Pencarian: ${q}`,
    });
  } catch (error) {
    next(error);
  }
});

// Public API for realtime clients
router.get('/api/experiences', async (req, res, next) => {
  try {
    const experiences = await repo.getExperiences();
    res.json({ experiences });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
