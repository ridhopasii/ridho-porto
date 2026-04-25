/**
 * SEO Routes
 * Sitemap, robots.txt, and other SEO-related endpoints
 */

const express = require('express');
const router = express.Router();
const repo = require('../services/repo');
const logger = require('../config/logger');

// Sitemap XML
router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const baseUrl = req.protocol + '://' + req.get('host');
    const [projects, articles] = await Promise.all([repo.getProjects(), repo.getArticles()]);

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
    <url>
        <loc>${baseUrl}/showcase</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${baseUrl}/awards</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`;

    projects.forEach((project) => {
      xml += `
    <url>
        <loc>${baseUrl}/projects/${project.slug}</loc>
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
    next(error);
  }
});

// Robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${baseUrl}/sitemap.xml`);
});

module.exports = router;
