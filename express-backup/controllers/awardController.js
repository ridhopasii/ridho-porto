const repo = require('../services/repo');
const fs = require('fs');
const path = require('path');
const { uploadLocalFileToSupabase, isSupabaseEnabled } = require('../utils/storage');

const getAwards = async (req, res) => {
  try {
    const awards = await repo.getAwards();
    res.render('admin/awards/index', { awards, success: req.query.success || null, error: req.query.error || null });
  } catch (e) {
    res.status(500).send('Server Error');
  }
};

const getForm = async (req, res) => {
  try {
    let award = null;
    if (req.params.id) {
      award = await repo.getAwardById(req.params.id);
      if (!award) return res.status(404).send('Award not found');
    }
    res.render('admin/awards/form', { award, error: req.query.error || null });
  } catch (e) {
    res.status(500).send('Server Error');
  }
};

const createAward = async (req, res) => {
  try {
    const { title, organizer, date, description, certificateUrl: bodyCertUrl, category, credentialId } = req.body;
    if (!title || !organizer || !date) {
      return res.render('admin/awards/form', { award: req.body, error: 'Title, organizer, and date are required' });
    }
    let certificateUrl = bodyCertUrl || null;
    if (req.file) {
      if (isSupabaseEnabled()) {
        const url = await uploadLocalFileToSupabase(req.file, 'certificates');
        if (url) {
          certificateUrl = url;
          try { fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path); } catch {}
        } else {
          certificateUrl = '/uploads/' + req.file.filename;
        }
      } else {
        certificateUrl = '/uploads/' + req.file.filename;
      }
    }
    await repo.createAward({ title, organizer, date, description, category, credentialId, certificateUrl }, { accessToken: req.supabaseAccessToken });
    res.redirect('/admin/awards?success=created');
  } catch (e) {
    res.render('admin/awards/form', { award: req.body, error: 'Error creating award: ' + e.message });
  }
};

const updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, organizer, date, description, certificateUrl: bodyCertUrl, category, credentialId } = req.body;

    const existing = await repo.getAwardById(id);
    if (!existing) {
      return res.status(404).send('Award not found');
    }

    let certificateUrl = existing.certificateUrl || null;
    if (bodyCertUrl && bodyCertUrl !== certificateUrl) {
      // If previous was an uploaded file, delete it
      if (certificateUrl && certificateUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '../../public', certificateUrl);
        try { if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); } catch {}
      }
      certificateUrl = bodyCertUrl;
    }
    if (req.file) {
      if (certificateUrl && certificateUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '../../public', certificateUrl);
        try { if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); } catch {}
      }
      if (isSupabaseEnabled()) {
        const url = await uploadLocalFileToSupabase(req.file, 'certificates');
        if (url) {
          certificateUrl = url;
          try { fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path); } catch {}
        } else {
          certificateUrl = '/uploads/' + req.file.filename;
        }
      } else {
        certificateUrl = '/uploads/' + req.file.filename;
      }
    }

    await repo.updateAward(id, { title, organizer, date, description, category, credentialId, certificateUrl }, { accessToken: req.supabaseAccessToken });
    res.redirect('/admin/awards?success=updated');
  } catch (e) {
    res.render('admin/awards/form', { award: { ...req.body, id: req.params.id }, error: 'Error updating award: ' + e.message });
  }
};

const deleteAward = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await repo.getAwardById(id);
    if (existing && existing.certificateUrl && existing.certificateUrl.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '../../public', existing.certificateUrl);
      try { if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); } catch {}
    }
    await repo.deleteAward(id, { accessToken: req.supabaseAccessToken });
    res.redirect('/admin/awards?success=deleted');
  } catch (e) {
    res.status(500).send('Error delete award');
  }
};

module.exports = { getAwards, getForm, createAward, updateAward, deleteAward };
