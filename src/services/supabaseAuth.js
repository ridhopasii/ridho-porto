const supabasePublic = require('../config/supabasePublic');

const SUPABASE_URL = process.env.SUPABASE_URL || supabasePublic.url;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || supabasePublic.anonKey;

function getHeaders(extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    ...extra,
  };
}

async function request(path, { method = 'GET', headers = {}, body } = {}) {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    method,
    headers: getHeaders(headers),
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text().catch(() => '');
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (_) {
    json = null;
  }

  if (!res.ok) {
    const err = new Error(json?.msg || json?.message || text || res.statusText);
    err.status = res.status;
    err.details = json;
    throw err;
  }

  return json;
}

async function signInWithPassword(email, password) {
  return request('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: { email, password },
  });
}

async function signUp(email, password) {
  return request('/auth/v1/signup', {
    method: 'POST',
    body: { email, password },
  });
}

async function getUser(accessToken) {
  return request('/auth/v1/user', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

module.exports = {
  signInWithPassword,
  signUp,
  getUser,
};

