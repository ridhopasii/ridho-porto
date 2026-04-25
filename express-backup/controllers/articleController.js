const repo = require('../services/repo');
const fs = require('fs');
const path = require('path');
const { uploadLocalFileToSupabase, isSupabaseEnabled } = require('../utils/storage');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

const { optimizeImage } = require('../utils/imageOptimizer');

async function headRequest(u) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(u);
      const lib = urlObj.protocol === 'https:' ? https : http;
      const req = lib.request(
        { method: 'HEAD', hostname: urlObj.hostname, path: urlObj.pathname + (urlObj.search || ''), protocol: urlObj.protocol, port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80) },
        (res) => {
          resolve({ headers: res.headers, statusCode: res.statusCode });
        }
      );
      req.on('error', reject);
      req.end();
    } catch (e) {
      reject(e);
    }
  });
}

async function validateExternalImage(url) {
  if (!/^https?:\/\/.+/i.test(url)) throw new Error('Invalid Image URL');
  let info;
  try {
    info = await headRequest(url);
  } catch (e) {
    throw new Error('Failed to reach image URL');
  }
  const ct = (info.headers['content-type'] || '').toLowerCase();
  const cl = parseInt(info.headers['content-length'] || '0', 10);
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowed.some((t) => ct.startsWith(t))) throw new Error('URL must point to an image');
  if (cl && cl > 5 * 1024 * 1024) throw new Error('Image URL exceeds 5MB');
  return true;
}

const getArticles = async (req, res) => {
  try {
    const articles = await repo.getArticlesAdmin({ accessToken: req.supabaseAccessToken });
    res.render('admin/articles/index', { articles, success: req.query.success });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const getForm = async (req, res) => {
  try {
    let article = null;
    if (req.params.id) {
      article = await repo.getArticleById(req.params.id, { accessToken: req.supabaseAccessToken });
      if (!article) return res.status(404).send('Article not found');
    }
    res.render('admin/articles/form', { article });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const createArticle = async (req, res) => {
  try {
    const { title, content, tags, published, imageUrl: bodyImageUrl, imageSource } = req.body;
    let imageUrl = null;

    // Handle Image Upload
    if (req.file) {
      // Optimize image before saving
      const optimizedPath = req.file.path + '.webp';
      await optimizeImage(req.file.path, optimizedPath);

      // Upload optimized image
      // Note: uploadLocalFileToSupabase expects a file object, we mock it or modify utility.
      // Since `uploadLocalFileToSupabase` in local mode just moves the file, we can just use our optimized file.
      // But let's look at `uploadLocalFileToSupabase`. It uses `file.path` and `file.filename`.
      // We should swap the path to point to optimized file and update filename extension.

      const optimizedFile = {
        ...req.file,
        path: optimizedPath,
        filename: req.file.filename + '.webp',
        mimetype: 'image/webp'
      };

      imageUrl = await uploadLocalFileToSupabase(optimizedFile, 'articles');

      // Cleanup original upload and temp optimized file
      try {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        // The uploadLocalFileToSupabase (local version) moves or copies. 
        // If it moved, optimizedPath is gone. If copied, we need to delete.
        // Let's assume we need to cleanup if it still exists.
        // Actually `utils/storage.js` -> `uploadFile` does rename or copy+unlink.
        // So `optimizedPath` should be gone if rename worked.
      } catch (e) { console.error('Cleanup error', e); }

    } else if (imageSource === 'url' && bodyImageUrl) {
      await validateExternalImage(bodyImageUrl);
      imageUrl = bodyImageUrl;
    }

    let slug = slugify(title);
    // Check for duplicate slug
    let count = 0;
    let existing = await repo.getArticleBySlug(slug);
    while (existing) {
      count++;
      slug = slugify(title) + '-' + count;
      existing = await repo.getArticleBySlug(slug);
    }

    await repo.createArticle({
      title,
      slug,
      content,
      imageUrl,
      tags,
      published: published === 'on',
    }, { accessToken: req.supabaseAccessToken });

    res.redirect('/admin/articles?success=created');
  } catch (error) {
    console.error(error);
    res.render('admin/articles/form', {
      article: req.body,
      error: 'Error creating article: ' + error.message,
    });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, published, imageUrl: bodyImageUrl, imageSource } = req.body;

    const existingArticle = await repo.getArticleById(id, { accessToken: req.supabaseAccessToken });

    if (!existingArticle) return res.status(404).send('Article not found');

    let imageUrl = existingArticle.imageUrl;

    // Logic: 
    // If Source is File AND File is Uploaded -> Replace Image
    // If Source is URL AND URL is Provided -> Replace Image
    // If Source is File but NO File Uploaded -> Keep existing (if it was file) OR do nothing?
    // The UI toggles. If user selects URL, we should use that. 
    // If user selects File, and uploads new one, use new one.
    // If user selects File, but doesn't upload new, keep old.

    if (req.file) {
      // Optimize
      const optimizedPath = req.file.path + '.webp';
      await optimizeImage(req.file.path, optimizedPath);

      const optimizedFile = {
        ...req.file,
        path: optimizedPath,
        filename: req.file.filename + '.webp',
        mimetype: 'image/webp'
      };

      // Remove old local file if exists
      if (imageUrl && imageUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '../../public', imageUrl);
        if (fs.existsSync(oldPath)) { try { fs.unlinkSync(oldPath); } catch (_) { } }
      }

      imageUrl = await uploadLocalFileToSupabase(optimizedFile, 'articles');

      // Cleanup original upload
      try { if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); } catch (e) { }

    } else if (imageSource === 'url' && bodyImageUrl && bodyImageUrl !== existingArticle.imageUrl) {
      if (imageUrl && imageUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '../../public', imageUrl);
        if (fs.existsSync(oldPath)) { try { fs.unlinkSync(oldPath); } catch (_) { } }
      }
      await validateExternalImage(bodyImageUrl);
      imageUrl = bodyImageUrl;
    }

    await repo.updateArticle(id, {
      title,
      content,
      imageUrl,
      tags,
      published: published === 'on',
    }, { accessToken: req.supabaseAccessToken });

    res.redirect('/admin/articles?success=updated');
  } catch (error) {
    console.error(error);
    res.render('admin/articles/form', {
      article: { ...req.body, id: req.params.id },
      error: 'Error updating article: ' + error.message,
    });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await repo.getArticleById(id, { accessToken: req.supabaseAccessToken });

    if (article && article.imageUrl && article.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '../../public', article.imageUrl);
      if (fs.existsSync(imagePath)) {
        try { fs.unlinkSync(imagePath); } catch (_) { }
      }
    }

    await repo.deleteArticle(id, { accessToken: req.supabaseAccessToken });

    res.redirect('/admin/articles?success=deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting article');
  }
};

const getPublicArticles = async (req, res) => {
  try {
    const { search } = req.query;
    let articles = await repo.getArticles();
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      articles = articles.filter(
        (a) =>
          (a.title && a.title.toLowerCase().includes(q)) ||
          (a.content && a.content.toLowerCase().includes(q))
      );
    }
    res.render('blog', { articles, search });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await repo.getArticleBySlug(slug);

    if (!article || !article.published) {
      return res.status(404).render('404', { message: 'Article not found' });
    }

    res.render('article', { article });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getArticles,
  getForm,
  createArticle,
  updateArticle,
  deleteArticle,
  getPublicArticles,
  getArticleBySlug,
};
