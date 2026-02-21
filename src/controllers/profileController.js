const repo = require('../services/repo');

const getProfile = async (req, res) => {
  try {
    const profile = await repo.getProfile();
    res.render('admin/profile/edit', { profile });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      title,
      bio,
      location,
      email,
      phone,
      whatsappUrl,
      cvLink,
      avatarUrlUrl,
      heroImageUrl,
      aboutImageUrl,
    } = req.body;

    const data = {
      fullName,
      title,
      bio,
      location,
      email,
      phone,
      whatsappUrl,
      cvLink,
    };

    const existingProfile = await repo.getProfile();

    const { uploadLocalFileToSupabase, isSupabaseEnabled } = require('../utils/storage');
    const handleImageUpdate = async (fieldName, urlInputName, fileArray) => {
      let newPath = null;
      let currentPath = existingProfile ? existingProfile[fieldName] : null;

      if (req.body[urlInputName] && req.body[urlInputName] !== currentPath) {
        newPath = req.body[urlInputName];
      }

      if (fileArray && fileArray.length > 0) {
        if (currentPath && currentPath.startsWith('/uploads/')) {
          const oldPath = require('path').join(__dirname, '../../public', currentPath);
          if (require('fs').existsSync(oldPath)) { try { require('fs').unlinkSync(oldPath); } catch (_) {} }
        }
        if (isSupabaseEnabled()) {
          const url = await uploadLocalFileToSupabase(fileArray[0], 'profile');
          if (url) {
            newPath = url;
            try { require('fs').existsSync(fileArray[0].path) && require('fs').unlinkSync(fileArray[0].path); } catch (_) {}
          } else {
            newPath = '/uploads/' + fileArray[0].filename;
          }
        } else {
          newPath = '/uploads/' + fileArray[0].filename;
        }
      }

      if (newPath) {
        data[fieldName] = newPath;
      }
    };

    if (req.files) {
      await handleImageUpdate('avatarUrl', 'avatarUrlUrl', req.files['avatarUrl']);
      await handleImageUpdate('heroImage', 'heroImageUrl', req.files['heroImage']);
      await handleImageUpdate('aboutImage', 'aboutImageUrl', req.files['aboutImage']);
    } else {
      await handleImageUpdate('avatarUrl', 'avatarUrlUrl', null);
      await handleImageUpdate('heroImage', 'heroImageUrl', null);
      await handleImageUpdate('aboutImage', 'aboutImageUrl', null);
    }

    // Re-run safely for non-file url updates if handleImageUpdate didn't cover it?
    // Ah, handleImageUpdate logic handles null fileArray correctly?
    // Yes: if (fileArray && ...) will be false.

    await repo.upsertProfile(data);

    res.redirect('/admin/profile?success=true');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.render('admin/profile/edit', {
      error: 'Error updating profile: ' + error.message,
      profile: req.body,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
