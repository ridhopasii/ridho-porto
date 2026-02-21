const repo = require('../services/repo');
const fs = require('fs');
const path = require('path');
const { uploadLocalFileToSupabase, isSupabaseEnabled } = require('../utils/storage');

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await repo.getTestimonials();
    res.render('admin/testimonials/index', { testimonials });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const getForm = async (req, res) => {
  try {
    let testimonial = null;
    if (req.params.id) {
      testimonial = await repo.getTestimonialById(req.params.id);
      if (!testimonial) return res.status(404).send('Testimonial not found');
    }
    res.render('admin/testimonials/form', { testimonial });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const createTestimonial = async (req, res) => {
  try {
    const { name, role, message, avatarUrl: bodyAvatarUrl } = req.body;
    let avatarUrl = bodyAvatarUrl || null;

    if (req.file) {
      avatarUrl = await uploadLocalFileToSupabase(req.file, 'testimonials');
    }

    await repo.createTestimonial({ name, role, message, avatarUrl }, { accessToken: req.supabaseAccessToken });

    res.redirect('/admin/testimonials?success=created');
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.render('admin/testimonials/form', {
      testimonial: req.body,
      error: 'Error creating testimonial: ' + error.message,
    });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, message, avatarUrl: bodyAvatarUrl } = req.body;

    const existingTestimonial = await repo.getTestimonialById(id);

    if (!existingTestimonial) return res.status(404).send('Testimonial not found');

    let avatarUrl = existingTestimonial.avatarUrl;

    if (bodyAvatarUrl && bodyAvatarUrl !== existingTestimonial.avatarUrl) {
      avatarUrl = bodyAvatarUrl;
    }

    if (req.file) {
      if (avatarUrl && avatarUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '../../public', avatarUrl);
        if (fs.existsSync(oldPath)) { try { fs.unlinkSync(oldPath); } catch (_) { } }
      }
      if (isSupabaseEnabled()) {
        const url = await uploadLocalFileToSupabase(req.file, 'testimonials');
        if (url) {
          avatarUrl = url;
          try { fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path); } catch (e) { }
        } else {
          avatarUrl = '/uploads/' + req.file.filename;
        }
      } else {
        avatarUrl = '/uploads/' + req.file.filename;
      }
    }

    await repo.updateTestimonial(id, { name, role, message, avatarUrl }, { accessToken: req.supabaseAccessToken });

    res.redirect('/admin/testimonials?success=updated');
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.render('admin/testimonials/form', {
      testimonial: { ...req.body, id: req.params.id },
      error: 'Error updating testimonial: ' + error.message,
    });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await repo.getTestimonialById(id);

    if (testimonial && testimonial.avatarUrl && testimonial.avatarUrl.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '../../public', testimonial.avatarUrl);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error('Failed to delete image:', err);
        }
      }
    }

    await repo.deleteTestimonial(id, { accessToken: req.supabaseAccessToken });

    res.redirect('/admin/testimonials?success=deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting testimonial');
  }
};

module.exports = {
  getTestimonials,
  getForm,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
