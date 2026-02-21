const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const profileController = require('../controllers/profileController');
const { requireAuth, checkAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // images only
const uploadCertificate = require('../middleware/uploadCertificate'); // images or PDF for certificates

// Public Admin Routes
router.get('/login', checkAuth, adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

router.get('/setup', adminController.getSetup);
router.post('/setup', adminController.postSetup);

// Protected Admin Routes
router.use(requireAuth);

router.get('/dashboard', adminController.getDashboard);

// Projects
const projectController = require('../controllers/projectController');
router.get('/projects', projectController.getProjects);
router.get('/projects/create', projectController.getForm);
router.post('/projects/create', upload.single('image'), projectController.createProject);
router.get('/projects/edit/:id', projectController.getForm);
router.post('/projects/edit/:id', upload.single('image'), projectController.updateProject);
router.post('/projects/delete/:id', projectController.deleteProject);

// Articles
const articleController = require('../controllers/articleController');
router.get('/articles', articleController.getArticles);
router.get('/articles/create', articleController.getForm);
router.post('/articles/create', upload.single('image'), articleController.createArticle);
router.get('/articles/edit/:id', articleController.getForm);
router.post('/articles/edit/:id', upload.single('image'), articleController.updateArticle);
router.post('/articles/delete/:id', articleController.deleteArticle);

// Experience
const experienceController = require('../controllers/experienceController');
router.get('/experience', experienceController.getExperiences);
router.get('/experience/create', experienceController.getForm);
router.post('/experience/create', experienceController.createExperience);
router.get('/experience/edit/:id', experienceController.getForm);
router.post('/experience/edit/:id', experienceController.updateExperience);
router.post('/experience/delete/:id', experienceController.deleteExperience);
router.post('/experience/move-up/:id', experienceController.moveUp);
router.post('/experience/move-down/:id', experienceController.moveDown);

// Education
const educationController = require('../controllers/educationController');
router.get('/education', educationController.getEducation);
router.get('/education/create', educationController.getForm);
router.post('/education/create', educationController.createEducation);
router.get('/education/edit/:id', educationController.getForm);
router.post('/education/edit/:id', educationController.updateEducation);
router.post('/education/delete/:id', educationController.deleteEducation);

// Skills
const skillController = require('../controllers/skillController');
router.get('/skills', skillController.getSkills);
router.get('/skills/create', skillController.getForm);
router.post('/skills/create', upload.single('image'), skillController.createSkill);
router.get('/skills/edit/:id', skillController.getForm);
router.post('/skills/edit/:id', upload.single('image'), skillController.updateSkill);
router.post('/skills/delete/:id', skillController.deleteSkill);

// Profile
router.get('/profile', profileController.getProfile);
router.post(
  '/profile',
  upload.fields([{ name: 'avatarUrl' }, { name: 'heroImage' }, { name: 'aboutImage' }]),
  profileController.updateProfile
);

// Socials
const socialController = require('../controllers/socialController');
router.get('/socials', socialController.getSocials);
router.get('/socials/create', socialController.getForm);
router.post('/socials/create', socialController.createSocial);
router.get('/socials/edit/:id', socialController.getForm);
router.post('/socials/edit/:id', socialController.updateSocial);
router.post('/socials/delete/:id', socialController.deleteSocial);

// Testimonials
const testimonialController = require('../controllers/testimonialController');
router.get('/testimonials', testimonialController.getTestimonials);
router.get('/testimonials/create', testimonialController.getForm);
router.post(
  '/testimonials/create',
  upload.single('image'),
  testimonialController.createTestimonial
);
router.get('/testimonials/edit/:id', testimonialController.getForm);
router.post(
  '/testimonials/edit/:id',
  upload.single('image'),
  testimonialController.updateTestimonial
);
router.post('/testimonials/delete/:id', testimonialController.deleteTestimonial);

// Messages
const messageController = require('../controllers/messageController');
router.get('/messages', messageController.getMessages);
router.post('/messages/delete/:id', messageController.deleteMessage);

// Awards
const awardController = require('../controllers/awardController');
router.get('/awards', awardController.getAwards);
router.get('/awards/create', awardController.getForm);
router.post('/awards/create', uploadCertificate.single('certificate'), awardController.createAward);
router.get('/awards/edit/:id', awardController.getForm);
router.post('/awards/edit/:id', uploadCertificate.single('certificate'), awardController.updateAward);
router.post('/awards/delete/:id', awardController.deleteAward);

module.exports = router;
