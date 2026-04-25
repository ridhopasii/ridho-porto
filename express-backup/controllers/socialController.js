const repo = require('../services/repo');

const getSocials = async (req, res) => {
  try {
    const socials = await repo.getSocials();
    res.render('admin/socials/index', { socials });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const getForm = async (req, res) => {
  try {
    let social = null;
    if (req.params.id) {
      social = await repo.getSocialById(req.params.id);
      if (!social) return res.status(404).send('Social link not found');
    }
    res.render('admin/socials/form', { social });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const createSocial = async (req, res) => {
  try {
    const { platform, url, icon } = req.body;
    // Keep backward compatibility: attach userId if exists on req.user
    const payload = { platform, url, icon };
    if (req.user && req.user.id) payload.userId = req.user.id;
    await repo.createSocial(payload);

    res.redirect('/admin/socials?success=created');
  } catch (error) {
    console.error(error);
    res.render('admin/socials/form', {
      social: req.body,
      error: 'Error creating social link',
    });
  }
};

const updateSocial = async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, url, icon } = req.body;

    await repo.updateSocial(id, { platform, url, icon });

    res.redirect('/admin/socials?success=updated');
  } catch (error) {
    console.error(error);
    res.render('admin/socials/form', {
      social: { ...req.body, id: req.params.id },
      error: 'Error updating social link',
    });
  }
};

const deleteSocial = async (req, res) => {
  try {
    const { id } = req.params;
    await repo.deleteSocial(id);
    res.redirect('/admin/socials?success=deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting social link');
  }
};

module.exports = {
  getSocials,
  getForm,
  createSocial,
  updateSocial,
  deleteSocial,
};
