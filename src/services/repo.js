const { PrismaClient } = require('@prisma/client');
const supabase = require('./supabaseRest');

let prisma;
function getPrisma() {
  if (prisma) return prisma;

  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
    return prisma;
  }

  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
  return prisma;
}

function toCamelKey(key) {
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function toSnakeKey(key) {
  return key
    .replace(/([A-Z])/g, '_$1')
    .replace(/__/g, '_')
    .toLowerCase();
}

function toAppRow(row) {
  if (!row) return null;
  const out = { ...row };

  // Convert common date fields to Date objects if they are strings
  ['createdAt', 'updatedAt', 'date', 'publishedAt'].forEach(field => {
    if (out[field] && typeof out[field] === 'string') {
      out[field] = new Date(out[field]);
    }
  });

  return out;
}

function toDbRow(data) {
  return data;
}

async function dbPing() {
  if (supabase.isConfigured()) {
    await supabase.selectOne('profile', { select: 'id' });
    return true;
  }

  const p = getPrisma();
  await p.$queryRaw`SELECT 1`;
  return true;
}

async function getAdminUser() {
  if (supabase.isConfigured()) {
    const row = await supabase.selectOne('User', {
      select: '*',
      orderBy: { column: 'id', ascending: true },
      serviceRole: true,
    });
    return toAppRow(row);
  }

  const p = getPrisma();
  return p.user.findFirst();
}

module.exports = {
  dbPing,
  getAdminUser,

  isAdmin: async (userId, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('admin', {
        select: '*',
        filters: { user_id: `eq.${userId}` },
        accessToken,
      });
      return !!row;
    }
    const p = getPrisma();
    const user = await p.user.findFirst();
    return Boolean(user);
  },

  ensureAdmin: async (user, { accessToken } = {}) => {
    if (!supabase.isConfigured()) return true;

    const existing = await supabase.selectOne('admin', {
      select: '*',
      filters: { user_id: `eq.${encodeURIComponent(user.id)}` },
      accessToken,
    });
    if (existing) return toAppRow(existing);

    const inserted = await supabase.insertOne(
      'admin',
      {
        user_id: user.id,
        email: user.email,
      },
      { accessToken }
    );

    return toAppRow(inserted);
  },

  getProfile: async () => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Profile', { select: '*' });
      return toAppRow(row);
    }
    return getPrisma().profile.findFirst();
  },
  upsertProfile: async (data, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      const existing = await supabase.selectOne('Profile', { select: 'id', accessToken });
      if (existing) {
        return toAppRow(
          await supabase.updateOne(
            'Profile',
            {
              filters: { id: `eq.${existing.id}` },
              data: toDbRow(data),
            },
            { accessToken }
          )
        );
      }
      return toAppRow(await supabase.insertOne('Profile', toDbRow(data), { accessToken }));
    }

    const p = getPrisma();
    const existing = await p.profile.findFirst();
    if (existing) return p.profile.update({ where: { id: existing.id }, data });
    return p.profile.create({ data });
  },
  getExperiences: async () => {
    if (supabase.isConfigured()) {
      const rows = await supabase.selectMany('Experience', { select: '*', orderBy: { column: 'order', ascending: true } });
      return (rows || []).map(toAppRow);
    }
    return getPrisma().experience.findMany({ orderBy: { order: 'asc' } });
  },
  getEducation: async () => {
    if (supabase.isConfigured()) {
      const rows = await supabase.selectMany('Education', { select: '*', orderBy: { column: 'order', ascending: true } });
      return (rows || []).map(toAppRow);
    }
    return getPrisma().education.findMany({ orderBy: { order: 'asc' } });
  },
  getSkills: async () => {
    if (supabase.isConfigured()) {
      const rows = await supabase.selectMany('Skill', { select: '*' });
      return (rows || []).map(toAppRow);
    }
    return getPrisma().skill.findMany();
  },
  getProjects: async () => {
    if (supabase.isConfigured()) {
      const rows = await supabase.selectMany('Project', { select: '*' });
      return (rows || []).map(toAppRow);
    }
    return getPrisma().project.findMany();
  },
  getSocials: async () => {
    if (supabase.isConfigured()) {
      const rows = await supabase.selectMany('Social', { select: '*' });
      return (rows || []).map(toAppRow);
    }
    return getPrisma().social.findMany();
  },
  getTestimonials: async () => {
    if (supabase.isConfigured()) {
      const rows = await supabase.selectMany('Testimonial', { select: '*', orderBy: { column: 'createdAt', ascending: false } });
      return (rows || []).map(toAppRow);
    }
    return getPrisma().testimonial.findMany({ orderBy: { createdAt: 'desc' } });
  },
  getAwards: async () => {
    if (supabase.isConfigured()) {
      const rows = await supabase.selectMany('Award', { select: '*', orderBy: { column: 'date', ascending: false } });
      return (rows || []).map(toAppRow);
    }
    return getPrisma().award.findMany({ orderBy: { date: 'desc' } });
  },
  getArticles: async () => {
    if (supabase.isConfigured()) {
      const rows = await supabase.selectMany('Article', {
        select: '*',
        filters: { published: 'eq.true' },
        orderBy: { column: 'createdAt', ascending: false },
      });
      return (rows || []).map(toAppRow);
    }
    return getPrisma().article.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
  },
  getRecentArticles: async (limit = 3) => {
    if (supabase.isConfigured()) {
      const rows = await supabase.selectMany('Article', {
        select: '*',
        filters: { published: 'eq.true' },
        orderBy: { column: 'createdAt', ascending: false },
        limit,
      });
      return (rows || []).map(toAppRow);
    }
    return getPrisma().article.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: limit });
  },
  getArticleBySlug: async (slug) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Article', { select: '*', filters: { slug: `eq.${encodeURIComponent(slug)}` } });
      return toAppRow(row);
    }
    return getPrisma().article.findUnique({ where: { slug } });
  },
  getProjectBySlug: async (slug) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Project', { select: '*', filters: { slug: `eq.${encodeURIComponent(slug)}` } });
      return toAppRow(row);
    }
    return getPrisma().project.findUnique({ where: { slug } });
  },

  countProjects: async () => {
    if (supabase.isConfigured()) return supabase.count('Project');
    return getPrisma().project.count();
  },
  countArticles: async () => {
    if (supabase.isConfigured()) return supabase.count('Article');
    return getPrisma().article.count();
  },
  countSkills: async () => {
    if (supabase.isConfigured()) return supabase.count('Skill');
    return getPrisma().skill.count();
  },

  // Organizations
  getOrganizations: async () => {
    if (supabase.isConfigured()) {
      const rows = await supabase.selectMany('Organization', {
        select: '*',
        orderBy: { column: 'order', ascending: true },
      });
      return (rows || []).map(toAppRow);
    }
    return getPrisma().organization.findMany({ orderBy: { order: 'asc' } });
  },
  getOrganizationById: async (id) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Organization', {
        select: '*',
        filters: { id: `eq.${parseInt(id)}` },
      });
      return toAppRow(row);
    }
    return getPrisma().organization.findUnique({ where: { id: parseInt(id) } });
  },
  createOrganization: async (data, { accessToken } = {}) => {
    const payload = {
      name: data.name,
      role: data.role,
      period: data.period,
      description: data.description || null,
      logoUrl: data.logoUrl || null,
      website: data.website || null,
      order: parseInt(data.order) || 0,
    };
    if (supabase.isConfigured()) {
      return toAppRow(await supabase.insertOne('Organization', toDbRow(payload), { accessToken }));
    }
    return getPrisma().organization.create({ data: payload });
  },
  updateOrganization: async (id, data, { accessToken } = {}) => {
    const payload = {
      name: data.name,
      role: data.role,
      period: data.period,
      description: data.description || null,
      logoUrl: data.logoUrl || null,
      website: data.website || null,
      order: parseInt(data.order) || 0,
    };
    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.updateOne(
          'Organization',
          {
            filters: { id: `eq.${parseInt(id)}` },
            data: toDbRow(payload),
          },
          { accessToken }
        )
      );
    }
    return getPrisma().organization.update({ where: { id: parseInt(id) }, data: payload });
  },
  deleteOrganization: async (id, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.deleteOne('Organization', { filters: { id: `eq.${parseInt(id)}` } }, { accessToken })
      );
    }
    return getPrisma().organization.delete({ where: { id: parseInt(id) } });
  },

  // Publications
  getPublications: async () => {
    if (supabase.isConfigured()) {
      const rows = await supabase.selectMany('Publication', {
        select: '*',
        orderBy: { column: 'date', ascending: false },
      });
      return (rows || []).map(toAppRow);
    }
    return getPrisma().publication.findMany({ orderBy: { date: 'desc' } });
  },
  getPublicationById: async (id) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Publication', {
        select: '*',
        filters: { id: `eq.${parseInt(id)}` },
      });
      return toAppRow(row);
    }
    return getPrisma().publication.findUnique({ where: { id: parseInt(id) } });
  },
  createPublication: async (data, { accessToken } = {}) => {
    const payload = {
      title: data.title,
      outlet: data.outlet,
      date: data.date,
      url: data.url || null,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      tags: data.tags || null,
      updatedAt: new Date(),
    };
    if (supabase.isConfigured()) {
      return toAppRow(await supabase.insertOne('Publication', toDbRow(payload), { accessToken }));
    }
    return getPrisma().publication.create({ data: payload });
  },
  updatePublication: async (id, data, { accessToken } = {}) => {
    const payload = {
      title: data.title,
      outlet: data.outlet,
      date: data.date,
      url: data.url || null,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      tags: data.tags || null,
      updatedAt: new Date(),
    };
    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.updateOne(
          'Publication',
          {
            filters: { id: `eq.${parseInt(id)}` },
            data: toDbRow(payload),
          },
          { accessToken }
        )
      );
    }
    return getPrisma().publication.update({ where: { id: parseInt(id) }, data: payload });
  },
  deletePublication: async (id, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.deleteOne('Publication', { filters: { id: `eq.${parseInt(id)}` } }, { accessToken })
      );
    }
    return getPrisma().publication.delete({ where: { id: parseInt(id) } });
  },

  getArticlesAdmin: async ({ accessToken } = {}) => {
    if (supabase.isConfigured()) {
      const rows = await supabase.selectMany('Article', {
        select: '*',
        orderBy: { column: 'createdAt', ascending: false },
        accessToken,
        serviceRole: !accessToken,
      });
      return (rows || []).map(toAppRow);
    }
    return getPrisma().article.findMany({ orderBy: { createdAt: 'desc' } });
  },
  getArticleById: async (id, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Article', {
        select: '*',
        filters: { id: `eq.${parseInt(id)}` },
        accessToken,
      });
      return toAppRow(row);
    }
    return getPrisma().article.findUnique({ where: { id: parseInt(id) } });
  },
  createArticle: async (data, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      const payload = { ...data, updatedAt: new Date() };
      return toAppRow(await supabase.insertOne('Article', toDbRow(payload), { accessToken }));
    }
    return getPrisma().article.create({ data });
  },
  updateArticle: async (id, data, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      const payload = { ...data, updatedAt: new Date() };
      return toAppRow(
        await supabase.updateOne(
          'Article',
          {
            filters: { id: `eq.${parseInt(id)}` },
            data: toDbRow(payload),
          },
          { accessToken }
        )
      );
    }
    return getPrisma().article.update({ where: { id: parseInt(id) }, data });
  },
  deleteArticle: async (id, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.deleteOne('Article', { filters: { id: `eq.${parseInt(id)}` } }, { accessToken })
      );
    }
    return getPrisma().article.delete({ where: { id: parseInt(id) } });
  },

  getProjectById: async (id) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Project', { select: '*', filters: { id: `eq.${parseInt(id)}` } });
      return toAppRow(row);
    }
    return getPrisma().project.findUnique({ where: { id: parseInt(id) } });
  },
  createProject: async (data, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(await supabase.insertOne('Project', toDbRow(data), { accessToken }));
    }
    return getPrisma().project.create({ data });
  },
  updateProject: async (id, data, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.updateOne(
          'Project',
          {
            filters: { id: `eq.${parseInt(id)}` },
            data: toDbRow(data),
          },
          { accessToken }
        )
      );
    }
    return getPrisma().project.update({ where: { id: parseInt(id) }, data });
  },
  deleteProject: async (id, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(await supabase.deleteOne('Project', { filters: { id: `eq.${parseInt(id)}` } }, { accessToken }));
    }
    return getPrisma().project.delete({ where: { id: parseInt(id) } });
  },

  getTestimonialById: async (id) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Testimonial', { select: '*', filters: { id: `eq.${parseInt(id)}` } });
      return toAppRow(row);
    }
    return getPrisma().testimonial.findUnique({ where: { id: parseInt(id) } });
  },
  createTestimonial: async (data, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(await supabase.insertOne('Testimonial', toDbRow(data), { accessToken }));
    }
    return getPrisma().testimonial.create({ data });
  },
  updateTestimonial: async (id, data, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.updateOne(
          'Testimonial',
          {
            filters: { id: `eq.${parseInt(id)}` },
            data: toDbRow(data),
          },
          { accessToken }
        )
      );
    }
    return getPrisma().testimonial.update({ where: { id: parseInt(id) }, data });
  },
  deleteTestimonial: async (id, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.deleteOne('Testimonial', { filters: { id: `eq.${parseInt(id)}` } }, { accessToken })
      );
    }
    return getPrisma().testimonial.delete({ where: { id: parseInt(id) } });
  },

  getSkillById: async (id) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Skill', { select: '*', filters: { id: `eq.${parseInt(id)}` } });
      return toAppRow(row);
    }
    return getPrisma().skill.findUnique({ where: { id: parseInt(id) } });
  },
  createSkill: async (data, { accessToken } = {}) => {
    const payload = {
      name: data.name,
      category: data.category,
      percentage: parseInt(data.percentage) || 0,
      icon: data.icon || null,
    };

    if (supabase.isConfigured()) {
      return toAppRow(await supabase.insertOne('Skill', toDbRow(payload), { accessToken }));
    }
    return getPrisma().skill.create({ data: payload });
  },
  updateSkill: async (id, data, { accessToken } = {}) => {
    const payload = {
      name: data.name,
      category: data.category,
      percentage: parseInt(data.percentage) || 0,
      icon: data.icon || null,
    };

    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.updateOne(
          'Skill',
          {
            filters: { id: `eq.${parseInt(id)}` },
            data: toDbRow(payload),
          },
          { accessToken }
        )
      );
    }
    return getPrisma().skill.update({ where: { id: parseInt(id) }, data: payload });
  },
  deleteSkill: async (id, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(await supabase.deleteOne('Skill', { filters: { id: `eq.${parseInt(id)}` } }, { accessToken }));
    }
    return getPrisma().skill.delete({ where: { id: parseInt(id) } });
  },

  getAwardById: async (id) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Award', { select: '*', filters: { id: `eq.${parseInt(id)}` } });
      return toAppRow(row);
    }
    return getPrisma().award.findUnique({ where: { id: parseInt(id) } });
  },
  createAward: async (data, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(await supabase.insertOne('Award', toDbRow(data), { accessToken }));
    }
    return getPrisma().award.create({ data });
  },
  updateAward: async (id, data, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.updateOne(
          'Award',
          {
            filters: { id: `eq.${parseInt(id)}` },
            data: toDbRow(data),
          },
          { accessToken }
        )
      );
    }
    return getPrisma().award.update({ where: { id: parseInt(id) }, data });
  },
  deleteAward: async (id, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(await supabase.deleteOne('Award', { filters: { id: `eq.${parseInt(id)}` } }, { accessToken }));
    }
    return getPrisma().award.delete({ where: { id: parseInt(id) } });
  },

  getEducationById: async (id) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Education', { select: '*', filters: { id: `eq.${parseInt(id)}` } });
      return toAppRow(row);
    }
    return getPrisma().education.findUnique({ where: { id: parseInt(id) } });
  },
  createEducation: async (data, { accessToken } = {}) => {
    const payload = { ...data, order: parseInt(data.order) || 0 };
    if (supabase.isConfigured()) {
      return toAppRow(await supabase.insertOne('Education', toDbRow(payload), { accessToken }));
    }
    return getPrisma().education.create({ data: { ...data, order: parseInt(data.order) || 0 } });
  },
  updateEducation: async (id, data, { accessToken } = {}) => {
    const payload = { ...data, order: parseInt(data.order) || 0 };
    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.updateOne(
          'Education',
          {
            filters: { id: `eq.${parseInt(id)}` },
            data: toDbRow(payload),
          },
          { accessToken }
        )
      );
    }
    return getPrisma().education.update({ where: { id: parseInt(id) }, data: { ...data, order: parseInt(data.order) || 0 } });
  },
  deleteEducation: async (id, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.deleteOne('Education', { filters: { id: `eq.${parseInt(id)}` } }, { accessToken })
      );
    }
    return getPrisma().education.delete({ where: { id: parseInt(id) } });
  },

  getSocialById: async (id) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Social', { select: '*', filters: { id: `eq.${parseInt(id)}` } });
      return toAppRow(row);
    }
    return getPrisma().social.findUnique({ where: { id: parseInt(id) } });
  },
  createSocial: async (data, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(await supabase.insertOne('Social', toDbRow(data), { accessToken }));
    }
    return getPrisma().social.create({ data });
  },
  updateSocial: async (id, data, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.updateOne(
          'Social',
          {
            filters: { id: `eq.${parseInt(id)}` },
            data: toDbRow(data),
          },
          { accessToken }
        )
      );
    }
    return getPrisma().social.update({ where: { id: parseInt(id) }, data });
  },
  deleteSocial: async (id, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(await supabase.deleteOne('Social', { filters: { id: `eq.${parseInt(id)}` } }, { accessToken }));
    }
    return getPrisma().social.delete({ where: { id: parseInt(id) } });
  },

  getExperienceById: async (id) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Experience', { select: '*', filters: { id: `eq.${parseInt(id)}` } });
      return toAppRow(row);
    }
    return getPrisma().experience.findUnique({ where: { id: parseInt(id) } });
  },
  createExperience: async (data, { accessToken } = {}) => {
    const payload = {
      company: data.company,
      position: data.position,
      period: data.period,
      description: data.description || null,
      order: parseInt(data.order) || 0,
    };

    if (supabase.isConfigured()) {
      return toAppRow(await supabase.insertOne('Experience', toDbRow(payload), { accessToken }));
    }
    return getPrisma().experience.create({
      data: {
        company: data.company,
        position: data.position,
        period: data.period,
        description: data.description || null,
        order: parseInt(data.order) || 0,
      },
    });
  },
  updateExperience: async (id, data, { accessToken } = {}) => {
    const payload = {
      company: data.company,
      position: data.position,
      period: data.period,
      description: data.description || null,
      order: parseInt(data.order) || 0,
    };

    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.updateOne(
          'Experience',
          {
            filters: { id: `eq.${parseInt(id)}` },
            data: toDbRow(payload),
          },
          { accessToken }
        )
      );
    }
    return getPrisma().experience.update({
      where: { id: parseInt(id) },
      data: {
        company: data.company,
        position: data.position,
        period: data.period,
        description: data.description || null,
        order: parseInt(data.order) || 0,
      },
    });
  },
  deleteExperience: async (id, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.deleteOne('Experience', { filters: { id: `eq.${parseInt(id)}` } }, { accessToken })
      );
    }
    return getPrisma().experience.delete({ where: { id: parseInt(id) } });
  },
  findExperienceAbove: async (order) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Experience', {
        select: '*',
        filters: { order: `lt.${parseInt(order)}` },
        orderBy: { column: 'order', ascending: false },
      });
      return toAppRow(row);
    }
    return getPrisma().experience.findFirst({ where: { order: { lt: order } }, orderBy: { order: 'desc' } });
  },
  findExperienceBelow: async (order) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Experience', {
        select: '*',
        filters: { order: `gt.${parseInt(order)}` },
        orderBy: { column: 'order', ascending: true },
      });
      return toAppRow(row);
    }
    return getPrisma().experience.findFirst({ where: { order: { gt: order } }, orderBy: { order: 'asc' } });
  },

  getMessages: async ({ accessToken } = {}) => {
    if (supabase.isConfigured()) {
      const rows = await supabase.selectMany('Message', {
        select: '*',
        orderBy: { column: 'createdAt', ascending: false },
        accessToken,
      });
      return (rows || []).map(toAppRow);
    }
    return getPrisma().message.findMany({ orderBy: { createdAt: 'desc' } });
  },
  createMessage: async (data) => {
    if (supabase.isConfigured()) {
      return toAppRow(await supabase.insertOne('Message', toDbRow(data)));
    }
    return getPrisma().message.create({ data });
  },
  deleteMessage: async (id, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(await supabase.deleteOne('Message', { filters: { id: `eq.${parseInt(id)}` } }, { accessToken }));
    }
    return getPrisma().message.delete({ where: { id: parseInt(id) } });
  },

  getServices: async () => {
    if (supabase.isConfigured()) {
      const rows = await supabase.selectMany('Service', { select: '*', orderBy: { column: 'order', ascending: true } });
      return (rows || []).map(toAppRow);
    }
    return getPrisma().service.findMany({ orderBy: { order: 'asc' } });
  },
  getServiceById: async (id) => {
    if (supabase.isConfigured()) {
      const row = await supabase.selectOne('Service', { select: '*', filters: { id: `eq.${encodeURIComponent(id)}` } });
      return toAppRow(row);
    }
    return getPrisma().service.findUnique({ where: { id } });
  },
  createService: async (data, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      const payload = { ...data, updatedAt: new Date() };
      return toAppRow(await supabase.insertOne('Service', toDbRow(payload), { accessToken }));
    }
    return getPrisma().service.create({ data });
  },
  updateService: async (id, data, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      const payload = { ...data, updatedAt: new Date() };
      return toAppRow(
        await supabase.updateOne(
          'Service',
          {
            filters: { id: `eq.${encodeURIComponent(id)}` },
            data: toDbRow(payload),
          },
          { accessToken }
        )
      );
    }
    return getPrisma().service.update({ where: { id }, data });
  },
  deleteService: async (id, { accessToken } = {}) => {
    if (supabase.isConfigured()) {
      return toAppRow(
        await supabase.deleteOne('Service', { filters: { id: `eq.${encodeURIComponent(id)}` } }, { accessToken })
      );
    }
    return getPrisma().service.delete({ where: { id } });
  },
};
