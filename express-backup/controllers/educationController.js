const repo = require('../services/repo');

const getEducation = async (req, res) => {
  try {
    const education = await repo.getEducation();
    res.render('admin/education/index', { education });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const getForm = async (req, res) => {
  try {
    let education = null;
    if (req.params.id) {
      education = await repo.getEducationById(req.params.id);
      if (!education) return res.status(404).send('Education not found');
    }
    res.render('admin/education/form', { education });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const createEducation = async (req, res) => {
  try {
    const { institution, degree, major, period, status, order } = req.body;

    await repo.createEducation({ institution, degree, major, period, status, order: parseInt(order) || 0 }, { accessToken: req.supabaseAccessToken });

    res.redirect('/admin/education?success=created');
  } catch (error) {
    console.error(error);
    res.render('admin/education/form', {
      education: req.body,
      error: 'Error creating education',
    });
  }
};

const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { institution, degree, major, period, status, order } = req.body;

    await repo.updateEducation(id, { institution, degree, major, period, status, order: parseInt(order) || 0 }, { accessToken: req.supabaseAccessToken });

    res.redirect('/admin/education?success=updated');
  } catch (error) {
    console.error(error);
    res.render('admin/education/form', {
      education: { ...req.body, id: req.params.id },
      error: 'Error updating education',
    });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    await repo.deleteEducation(id, { accessToken: req.supabaseAccessToken });
    res.redirect('/admin/education?success=deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting education');
  }
};

module.exports = {
  getEducation,
  getForm,
  createEducation,
  updateEducation,
  deleteEducation,
};
