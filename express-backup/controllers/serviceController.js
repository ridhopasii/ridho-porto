const repo = require('../services/repo');

// Services Controller
const getServices = async (req, res) => {
    try {
        const services = await repo.getServices();
        res.render('admin/services/index', {
            title: 'Manage Services',
            path: '/admin/services',
            services,
            user: req.user,
            layout: 'admin/layout',
            success: req.query.success
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const getForm = async (req, res) => {
    try {
        let service = null;
        if (req.params.id) {
            service = await repo.getServiceById(req.params.id);
            if (!service) return res.status(404).send('Service not found');
        }
        res.render('admin/services/form', {
            title: service ? 'Edit Service' : 'Add New Service',
            path: '/admin/services',
            service,
            user: req.user,
            layout: 'admin/layout'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const createService = async (req, res) => {
    try {
        const { title, description, icon, order } = req.body;
        await repo.createService({
            title,
            description,
            icon,
            order: parseInt(order) || 0
        }, { accessToken: req.supabaseAccessToken });
        res.redirect('/admin/services?success=created');
    } catch (error) {
        console.error(error);
        res.render('admin/services/form', {
            title: 'Add New Service',
            path: '/admin/services',
            service: req.body,
            user: req.user,
            layout: 'admin/layout',
            error: error.message
        });
    }
};

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, icon, order } = req.body;
        await repo.updateService(id, {
            title,
            description,
            icon,
            order: parseInt(order) || 0
        }, { accessToken: req.supabaseAccessToken });
        res.redirect('/admin/services?success=updated');
    } catch (error) {
        console.error(error);
        res.render('admin/services/form', {
            title: 'Edit Service',
            path: '/admin/services',
            service: { ...req.body, id: req.params.id },
            user: req.user,
            layout: 'admin/layout',
            error: error.message
        });
    }
};

const deleteService = async (req, res) => {
    try {
        await repo.deleteService(req.params.id, { accessToken: req.supabaseAccessToken });
        res.redirect('/admin/services?success=deleted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting service');
    }
};

module.exports = {
    getServices,
    getForm,
    createService,
    updateService,
    deleteService
};
