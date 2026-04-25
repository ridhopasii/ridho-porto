const supabasePublic = require('../config/supabasePublic');

const SUPABASE_URL = process.env.SUPABASE_URL || supabasePublic.url;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || supabasePublic.anonKey;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_REST_ENABLED = process.env.SUPABASE_REST_ENABLED === 'true';

function isConfigured() {
  const enabled = SUPABASE_REST_ENABLED;
  return Boolean(enabled && SUPABASE_URL && SUPABASE_ANON_KEY);
}

function isWriteConfigured() {
  const enabled = SUPABASE_REST_ENABLED;
  return Boolean(enabled && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function getBaseUrl() {
  if (!SUPABASE_URL) throw new Error('SUPABASE_URL belum dikonfigurasi');
  return `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1`;
}

function requireKey(value, name) {
  if (!value) throw new Error(`${name} belum dikonfigurasi`);
  return value;
}

function getHeaders({ accessToken, serviceRole = false } = {}, extra = {}) {
  const apiKey = serviceRole
    ? requireKey(SUPABASE_SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY')
    : requireKey(SUPABASE_ANON_KEY, 'SUPABASE_ANON_KEY');

  const bearer = accessToken
    ? accessToken
    : serviceRole
      ? requireKey(SUPABASE_SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY')
      : requireKey(SUPABASE_ANON_KEY, 'SUPABASE_ANON_KEY');

  return {
    apikey: apiKey,
    Authorization: `Bearer ${bearer}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

async function request(table, { method = 'GET', query = {}, body, headers = {}, accessToken, serviceRole } = {}) {
  if (!isConfigured()) {
    throw new Error('Supabase belum dikonfigurasi (cek SUPABASE_URL & SUPABASE_ANON_KEY)');
  }

  const isRead = method === 'GET' || method === 'HEAD';
  const resolvedServiceRole =
    serviceRole !== undefined ? serviceRole : !isRead && Boolean(SUPABASE_SERVICE_ROLE_KEY) && !accessToken;

  const url = new URL(`${getBaseUrl()}/${table}`);
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url, {
    method,
    headers: getHeaders({ accessToken, serviceRole: resolvedServiceRole }, headers),
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const error = new Error(`Supabase error (${res.status}): ${text || res.statusText}`);
    error.status = res.status;
    throw error;
  }

  if (method === 'HEAD') {
    return {
      headers: res.headers,
    };
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  return res.json();
}

async function selectMany(
  table,
  { select = '*', filters = {}, orderBy, limit, accessToken, serviceRole } = {}
) {
  const query = { select };
  if (limit !== undefined) query.limit = limit;
  if (orderBy) query.order = `${orderBy.column}.${orderBy.ascending ? 'asc' : 'desc'}`;

  for (const [column, clause] of Object.entries(filters)) {
    query[column] = clause;
  }

  return request(table, { method: 'GET', query, accessToken, serviceRole });
}

async function selectOne(table, { select = '*', filters = {}, orderBy, accessToken, serviceRole } = {}) {
  const rows = await request(table, {
    method: 'GET',
    query: {
      select,
      ...Object.fromEntries(Object.entries(filters || {}).filter(([, v]) => v !== undefined && v !== null)),
      ...(orderBy ? { order: `${orderBy.column}.${orderBy.ascending ? 'asc' : 'desc'}` } : {}),
      limit: 1,
    },
    accessToken,
    serviceRole,
  });
  if (!rows || rows.length === 0) return null;
  return rows[0];
}

async function insertOne(table, data, { accessToken, serviceRole } = {}) {
  const rows = await request(table, {
    method: 'POST',
    query: { select: '*' },
    headers: { Prefer: 'return=representation' },
    body: data,
    accessToken,
    serviceRole,
  });
  if (!rows || rows.length === 0) return null;
  return rows[0];
}

async function updateMany(table, { filters = {}, data }, { accessToken, serviceRole } = {}) {
  const query = { select: '*' };
  for (const [column, clause] of Object.entries(filters)) {
    query[column] = clause;
  }

  return request(table, {
    method: 'PATCH',
    query,
    headers: { Prefer: 'return=representation' },
    body: data,
    accessToken,
    serviceRole,
  });
}

async function updateOne(table, { filters = {}, data }, { accessToken, serviceRole } = {}) {
  const rows = await updateMany(table, { filters, data }, { accessToken, serviceRole });
  if (!rows || rows.length === 0) return null;
  return rows[0];
}

async function deleteMany(table, { filters = {} } = {}, { accessToken, serviceRole } = {}) {
  const query = {};
  for (const [column, clause] of Object.entries(filters)) {
    query[column] = clause;
  }
  return request(table, {
    method: 'DELETE',
    query,
    headers: { Prefer: 'return=representation' },
    accessToken,
    serviceRole,
  });
}

async function deleteOne(table, { filters = {} } = {}, { accessToken, serviceRole } = {}) {
  const rows = await deleteMany(table, { filters }, { accessToken, serviceRole });
  if (!rows || rows.length === 0) return null;
  return rows[0];
}

async function count(table, { filters = {} } = {}, { accessToken, serviceRole } = {}) {
  const query = { select: 'id' };
  for (const [column, clause] of Object.entries(filters)) {
    query[column] = clause;
  }

  const result = await request(table, {
    method: 'HEAD',
    query,
    headers: { Prefer: 'count=exact' },
    accessToken,
    serviceRole,
  });

  const range = result.headers.get('content-range') || '';
  const m = range.match(/\/(\d+)$/);
  return m ? parseInt(m[1], 10) : 0;
}

module.exports = {
  isConfigured,
  isWriteConfigured,
  selectMany,
  selectOne,
  insertOne,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
  count,
};

