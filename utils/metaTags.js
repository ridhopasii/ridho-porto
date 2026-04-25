/**
 * Meta Tags Generator for SEO
 */

const constants = require('../config/constants');

class MetaTagsGenerator {
  /**
   * Generate meta tags for a page
   * @param {string} page - Page identifier
   * @param {Object} data - Page data
   * @returns {Object} - Meta tags object
   */
  generatePageMeta(page, data = {}) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    const defaults = {
      title: constants.SITE_NAME,
      description: constants.SITE_DESCRIPTION,
      image: `${baseUrl}/images/og-default.jpg`,
      url: baseUrl,
      type: 'website',
    };

    const meta = { ...defaults, ...data };

    return {
      title: meta.title,
      description: meta.description,
      canonical: meta.url,
      keywords: meta.keywords || '',
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: meta.url,
        type: meta.type,
        image: meta.image,
        siteName: constants.SITE_NAME,
      },
      twitter: {
        card: 'summary_large_image',
        title: meta.title,
        description: meta.description,
        image: meta.image,
        site: '@hfdzhummaidiii_',
      },
    };
  }

  /**
   * Generate meta tags for project page
   * @param {Object} project - Project object
   * @returns {Object} - Meta tags object
   */
  generateProjectMeta(project) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    return this.generatePageMeta('project', {
      title: `${project.title} | ${constants.SITE_NAME}`,
      description: project.description,
      image: project.imageUrl || `${baseUrl}/images/og-default.jpg`,
      url: `${baseUrl}/project/${project.slug}`,
      type: 'article',
      keywords: project.tags,
    });
  }

  /**
   * Generate meta tags for article page
   * @param {Object} article - Article object
   * @returns {Object} - Meta tags object
   */
  generateArticleMeta(article) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    return this.generatePageMeta('article', {
      title: `${article.title} | ${constants.SITE_NAME}`,
      description: article.content.substring(0, 160),
      image: article.imageUrl || `${baseUrl}/images/og-default.jpg`,
      url: `${baseUrl}/blog/${article.slug}`,
      type: 'article',
      keywords: article.tags,
    });
  }

  /**
   * Generate meta tags for blog listing page
   * @returns {Object} - Meta tags object
   */
  generateBlogMeta() {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    return this.generatePageMeta('blog', {
      title: `Blog | ${constants.SITE_NAME}`,
      description: 'Read articles about web development, design, and technology',
      url: `${baseUrl}/blog`,
      type: 'website',
    });
  }
}

module.exports = new MetaTagsGenerator();
