const supabaseAuth = require('../services/supabaseAuth');
const repo = require('../services/repo');

const requireAuth = (req, res, next) => {
  // Check for admin session first (password-only auth)
  const adminSession = req.cookies.admin_session;
  if (adminSession) {
    try {
      const sessionData = JSON.parse(Buffer.from(adminSession, 'base64').toString());
      if (sessionData.role === 'admin' && sessionData.expires > Date.now()) {
        req.user = { id: 'admin', email: 'admin@admin.com', role: 'admin' };
        req.supabaseAccessToken = null; // No Supabase token for password-only auth
        return next();
      }
    } catch (e) {
      // Invalid session, continue to check Supabase auth
    }
  }

  // Fallback to Supabase auth
  const token = req.cookies.sb_access_token;
  if (!token) return res.redirect('/admin/login');

  supabaseAuth
    .getUser(token)
    .then(async (user) => {
      req.supabaseUser = user;
      req.supabaseAccessToken = token;

      const isAdmin = await repo.isAdmin(user.id, { accessToken: token });
      if (!isAdmin) {
        return res.redirect('/admin/setup');
      }

      req.user = { id: user.id, email: user.email };
      next();
    })
    .catch(() => {
      res.clearCookie('sb_access_token');
      return res.redirect('/admin/login');
    });
};

const checkAuth = (req, res, next) => {
  const token = req.cookies.sb_access_token;
  if (!token) return next();

  supabaseAuth
    .getUser(token)
    .then(async (user) => {
      const isAdmin = await repo.isAdmin(user.id, { accessToken: token });
      if (isAdmin) return res.redirect('/admin/dashboard');
      return next();
    })
    .catch(() => {
      res.clearCookie('sb_access_token');
      next();
    });
};

module.exports = { requireAuth, checkAuth };
