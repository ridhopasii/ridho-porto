/**
 * Structured Data (JSON-LD) Generator
 */

class StructuredDataGenerator {
  /**
   * Generate Person schema
   * @param {Object} profile - Profile object
   * @param {Array} socials - Social links array
   * @returns {Object} - Person schema
   */
  generatePersonSchema(profile, socials = []) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.fullName,
      jobTitle: profile.title,
      description: profile.bio,
      email: profile.email,
      telephone: profile.phone,
      url: process.env.BASE_URL || 'http://localhost:3000',
      image: profile.heroImage,
      sameAs: socials.map((s) => s.url),
    };
  }

  /**
   * Generate Project/CreativeWork schema
   * @param {Object} project - Project object
   * @returns {Object} - CreativeWork schema
   */
  generateProjectSchema(project) {
    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      image: project.imageUrl,
      url: project.demoUrl,
      dateCreated: project.createdAt,
      keywords: project.tags,
      author: {
        '@type': 'Person',
        name: 'Ridhopasii',
      },
    };
  }

  /**
   * Generate Article schema
   * @param {Object} article - Article object
   * @returns {Object} - BlogPosting schema
   */
  generateArticleSchema(article) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.content.substring(0, 160),
      image: article.imageUrl,
      datePublished: article.createdAt,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Person',
        name: 'Ridhopasii',
      },
      publisher: {
        '@type': 'Person',
        name: 'Ridhopasii',
      },
    };
  }

  /**
   * Generate Website schema
   * @returns {Object} - WebSite schema
   */
  generateWebsiteSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Ridhopasii Portfolio',
      url: process.env.BASE_URL || 'http://localhost:3000',
      description: 'Portfolio website of Ridhopasii - UI/UX Designer & Web Developer',
      author: {
        '@type': 'Person',
        name: 'Ridhopasii',
      },
    };
  }

  /**
   * Generate BreadcrumbList schema
   * @param {Array} breadcrumbs - Array of breadcrumb items
   * @returns {Object} - BreadcrumbList schema
   */
  generateBreadcrumbSchema(breadcrumbs) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }
}

module.exports = new StructuredDataGenerator();
