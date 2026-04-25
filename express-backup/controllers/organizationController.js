const repo = require('../services/repo');

const getOrganizations = async (req, res) => {
  try {
    const organizations = await repo.getOrganizations();
    res.render('admin/organizations/index', { organizations });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const getForm = async (req, res) => {
  try {
    let organization = null;
    if (req.params.id) {
      organization = await repo.getOrganizationById(req.params.id);
      if (!organization) return res.status(404).send('Organization not found');
    }
    res.render('admin/organizations/form', { organization });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const createOrganization = async (req, res) => {
  try {
    const { name, role, period, description, logoUrl, website, order } = req.body;
    await repo.createOrganization({ name, role, period, description, logoUrl, website, order });
    res.redirect('/admin/organizations?success=created');
  } catch (error) {
    console.error('Error creating organization:', error);
    res.render('admin/organizations/form', {
      organization: req.body,
      error: 'Error creating organization: ' + error.message,
    });
  }
};

const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, period, description, logoUrl, website, order } = req.body;
    await repo.updateOrganization(id, { name, role, period, description, logoUrl, website, order });
    res.redirect('/admin/organizations?success=updated');
  } catch (error) {
    console.error('Error updating organization:', error);
    res.render('admin/organizations/form', {
      organization: { ...req.body, id: req.params.id },
      error: 'Error updating organization: ' + error.message,
    });
  }
};

const deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    await repo.deleteOrganization(id);
    res.redirect('/admin/organizations?success=deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting organization');
  }
};

module.exports = {
  getOrganizations,
  getForm,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
