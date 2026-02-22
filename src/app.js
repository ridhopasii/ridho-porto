require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');

// Import middleware
const securityConfig = require('./config/security');
const compressionMiddleware = require('./middleware/compression');
const requestLogger = require('./middleware/requestLogger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./config/logger');
const { requireAuth } = require('./middleware/authMiddleware');
const upload = require('./middleware/upload');

const repo = require('./services/repo');

// Controllers
const projectController = require('./controllers/projectController');
const articleController = require('./controllers/articleController');
const skillController = require('./controllers/skillController');
const experienceController = require('./controllers/experienceController');
const profileController = require('./controllers/profileController');
const serviceController = require('./controllers/serviceController');
const messageController = require('./controllers/messageController');

const app = express();
const server = http.createServer(app);
// Only init realtime if not in serverless environment to avoid connection issues
let io;
if (process.env.NODE_ENV !== 'production') {
  const { init: initRealtime } = require('./realtime');
  io = initRealtime(server);
}
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(securityConfig);

// Compression middleware
app.use(compressionMiddleware);

// Request logging
app.use(requestLogger);

// View locals
app.use((req, res, next) => {
  res.locals.realtimeEnabled = process.env.NODE_ENV !== 'production';
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static files with caching
app.use(
  express.static(path.join(__dirname, '../public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    etag: true,
  })
);

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Routes
// Profile Routes
app.get('/admin/profile', requireAuth, profileController.getProfile);
app.post(
  '/admin/profile',
  requireAuth,
  upload.fields([
    { name: 'avatarUrl', maxCount: 1 },
    { name: 'heroImage', maxCount: 1 },
    { name: 'aboutImage', maxCount: 1 },
  ]),
  profileController.updateProfile
);

// Service Routes
app.get('/admin/services', requireAuth, serviceController.getServices);
app.get('/admin/services/new', requireAuth, serviceController.getForm);
app.post('/admin/services/new', requireAuth, serviceController.createService);
app.get('/admin/services/:id/edit', requireAuth, serviceController.getForm);
app.post('/admin/services/:id/edit', requireAuth, serviceController.updateService);
app.post('/admin/services/:id/delete', requireAuth, serviceController.deleteService);

// Public Routes
app.get('/', async (req, res) => {
  try {
    const profile = await repo.getProfile();
    const experiences = await repo.getExperiences();
    const education = await repo.getEducation();
    const skills = await repo.getSkills();
    const projects = await repo.getProjects();
    const socials = await repo.getSocials();
    const testimonials = await repo.getTestimonials();
    const awards = await repo.getAwards();
    const articles = await repo.getRecentArticles(3);
    const services = await repo.getServices();
    const organizations = await repo.getOrganizations();
    const publications = await repo.getPublications();

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

// Blog/Articles Public Route
app.get('/blog', async (req, res, next) => {
  try {
    const articles = await repo.getArticles();
    const profile = await repo.getProfile();
    const socials = await repo.getSocials();
    res.render('blog', { articles, profile, socials, title: 'Blog' });
  } catch (error) {
    next(error);
  }
});

// Article Detail Public Route
app.get('/blog/:slug', async (req, res, next) => {
  try {
    const article = await repo.getArticleBySlug(req.params.slug);
    if (!article) return res.status(404).render('404');
    const profile = await repo.getProfile();
    const socials = await repo.getSocials();
    res.render('article', { article, profile, socials, title: article.title });
  } catch (error) {
    next(error);
  }
});

// Project Detail Public Route
app.get('/projects/:slug', async (req, res, next) => {
  try {
    const project = await repo.getProjectBySlug(req.params.slug);
    if (!project) return res.status(404).render('404');
    const profile = await repo.getProfile();
    const socials = await repo.getSocials();
    res.render('project-detail', { project, profile, socials, title: project.title });
  } catch (error) {
    next(error);
  }
});

// Organizations Page
app.get('/organizations', async (req, res, next) => {
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
app.get('/skills', async (req, res, next) => {
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
app.get('/publications', async (req, res, next) => {
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

// Public API for realtime clients
app.get('/api/experiences', async (req, res) => {
  try {
    const experiences = await repo.getExperiences();
    res.json({ experiences });
  } catch (e) {
    console.error('Error fetching experiences API:', e);
    res.status(500).json({ error: 'Failed to load experiences' });
  }
});

// Blog Routes
app.get(
  '/blog',
  async (req, res, next) => {
    // Middleware to inject common data for header/footer
    // We need profile and socials for header/footer
    try {
      const profile = await repo.getProfile();
      const socials = await repo.getSocials();
      res.locals.profile = profile;
      res.locals.socials = socials;
      next();
    } catch (error) {
      next(error);
    }
  },
  articleController.getPublicArticles
);

app.get(
  '/blog/:slug',
  async (req, res, next) => {
    try {
      const profile = await repo.getProfile();
      const socials = await repo.getSocials();
      res.locals.profile = profile;
      res.locals.socials = socials;
      next();
    } catch (error) {
      next(error);
    }
  },
  articleController.getArticleBySlug
);

// Contact Route
const { contactLimiter } = require('./middleware/rateLimiter');
const { contactValidation } = require('./middleware/validators');
app.post('/contact', contactLimiter, contactValidation, messageController.sendMessage);

// Project Detail Route
app.get(
  '/project/:slug',
  async (req, res, next) => {
    try {
      const profile = await repo.getProfile();
      const socials = await repo.getSocials();
      res.locals.profile = profile;
      res.locals.socials = socials;
      next();
    } catch (error) {
      next(error);
    }
  },
  projectController.getProjectBySlug
);

// Showcase page
const { groupProjectsByType, sortAwardsByDate } = require('./utils/viewUtils');
app.get('/showcase', async (req, res, next) => {
  try {
    const profile = await repo.getProfile();
    const socials = await repo.getSocials();
    const projects = await repo.getProjects();
    const awards = await repo.getAwards();
    const skills = await repo.getSkills();

    res.locals.profile = profile;
    res.locals.socials = socials;

    const grouped = groupProjectsByType(projects);
    const sortedAwards = sortAwardsByDate(awards);

    res.render('showcase', {
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

app.get('/__health/db', async (req, res) => {
  try {
    await repo.dbPing();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Public Awards Page
app.get('/awards', async (req, res, next) => {
  try {
    const profile = await repo.getProfile();
    const socials = await repo.getSocials();
    res.locals.profile = profile;
    res.locals.socials = socials;
    const awards = await repo.getAwards();
    res.render('awards', { awards });
  } catch (error) {
    next(error);
  }
});

// SEO Routes
app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = req.protocol + '://' + req.get('host');
    const projects = await repo.getProjects();
    const articles = await repo.getArticles();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/blog</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    </url>`;

    projects.forEach((project) => {
      xml += `
    <url>
        <loc>${baseUrl}/project/${project.slug}</loc>
        <lastmod>${project.createdAt ? project.createdAt.toISOString() : new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`;
    });

    articles.forEach((article) => {
      xml += `
    <url>
        <loc>${baseUrl}/blog/${article.slug}</loc>
        <lastmod>${article.updatedAt ? article.updatedAt.toISOString() : new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>`;
    });

    xml += `
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    logger.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

app.get('/robots.txt', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${baseUrl}/sitemap.xml`);
});

// Health check routes
app.use('/', require('./routes/health'));

// Admin Routes
app.use('/admin', require('./routes/admin'));

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
