const repo = require('../services/repo');
const supabaseAuth = require('../services/supabaseAuth');
const adminConfig = require('../config/admin');

const getDashboard = async (req, res) => {
  try {
    const [projectCount, articleCount, skillCount] = await Promise.all([
      repo.countProjects(),
      repo.countArticles(),
      repo.countSkills(),
    ]);

    // Mock site visits for now
    const siteVisits = 1205;

    res.render('admin/dashboard', {
      stats: {
        projects: projectCount,
        articles: articleCount,
        skills: skillCount,
        visits: siteVisits,
      },
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const getLogin = (req, res) => {
  res.render('admin/login', { error: null });
};

const postLogin = async (req, res) => {
  const { password } = req.body;
  const adminPassword = 'B1smillah'; // Simple password-only auth

  try {
    if (!password) {
      return res.render('admin/login', { error: 'Password wajib diisi' });
    }

    if (password !== adminPassword) {
      return res.render('admin/login', { error: 'Password salah' });
    }

    // Create a simple session token for admin
    const sessionToken = Buffer.from(JSON.stringify({
      role: 'admin',
      timestamp: Date.now(),
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    })).toString('base64');

    res.cookie('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.render('admin/login', { error: 'Terjadi kesalahan saat login' });
  }
};

const logout = (req, res) => {
  res.clearCookie('sb_access_token');
  res.clearCookie('admin_session');
  res.redirect('/admin/login');
};

const getSetup = async (req, res) => {
  const token = req.cookies.sb_access_token;
  if (!token) return res.redirect('/admin/login');

  try {
    const user = await supabaseAuth.getUser(token);
    const isAdmin = await repo.isAdmin(user.id, { accessToken: token });
    if (isAdmin) return res.redirect('/admin/dashboard');

    return res.render('admin/setup', {
      error: null,
      email: user.email,
      allowedEmail: adminConfig.adminEmail,
    });
  } catch (_) {
    res.clearCookie('sb_access_token');
    return res.redirect('/admin/login');
  }
};

const postSetup = async (req, res) => {
  const token = req.cookies.sb_access_token;
  if (!token) return res.redirect('/admin/login');

  try {
    const user = await supabaseAuth.getUser(token);
    const isAdmin = await repo.isAdmin(user.id, { accessToken: token });
    if (isAdmin) return res.redirect('/admin/dashboard');

    await repo.ensureAdmin(user, { accessToken: token });
    return res.redirect('/admin/dashboard');
  } catch (e) {
    try {
      const user = await supabaseAuth.getUser(token);
      return res.render('admin/setup', {
        error: e.message || 'Gagal setup admin',
        email: user.email,
        allowedEmail: adminConfig.adminEmail,
      });
    } catch (_) {
      res.clearCookie('sb_access_token');
      return res.redirect('/admin/login');
    }
  }
};

module.exports = {
  getDashboard,
  getLogin,
  postLogin,
  logout,
  getSetup,
  postSetup,
};
