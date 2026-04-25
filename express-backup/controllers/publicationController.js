const repo = require('../services/repo');

const getPublications = async (req, res) => {
  try {
    const publications = await repo.getPublications();
    res.render('admin/publications/index', { publications });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const getForm = async (req, res) => {
  try {
    let publication = null;
    if (req.params.id) {
      publication = await repo.getPublicationById(req.params.id);
      if (!publication) return res.status(404).send('Publication not found');
    }
    res.render('admin/publications/form', { publication });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const createPublication = async (req, res) => {
  try {
    const { title, outlet, date, url, description, imageUrl, tags } = req.body;
    await repo.createPublication({ title, outlet, date, url, description, imageUrl, tags });
    res.redirect('/admin/publications?success=created');
  } catch (error) {
    console.error('Error creating publication:', error);
    res.render('admin/publications/form', {
      publication: req.body,
      error: 'Error creating publication: ' + error.message,
    });
  }
};

const updatePublication = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, outlet, date, url, description, imageUrl, tags } = req.body;
    await repo.updatePublication(id, { title, outlet, date, url, description, imageUrl, tags });
    res.redirect('/admin/publications?success=updated');
  } catch (error) {
    console.error('Error updating publication:', error);
    res.render('admin/publications/form', {
      publication: { ...req.body, id: req.params.id },
      error: 'Error updating publication: ' + error.message,
    });
  }
};

const deletePublication = async (req, res) => {
  try {
    const { id } = req.params;
    await repo.deletePublication(id);
    res.redirect('/admin/publications?success=deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting publication');
  }
};

module.exports = {
  getPublications,
  getForm,
  createPublication,
  updatePublication,
  deletePublication,
};
