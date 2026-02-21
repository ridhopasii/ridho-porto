const https = require('https');
const querystring = require('querystring');

const HOST = process.env.CHECK_HOST || 'ridhi-porto.vercel.app';
const ADMIN_PASSWORD = process.env.CHECK_ADMIN_PASSWORD || 'B1smillah';
const PATH = process.env.CHECK_PATH || '/admin/articles';

function login(password) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({ password });
    const req = https.request(
      {
        hostname: HOST,
        port: 443,
        path: '/admin/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
          'User-Agent': 'Mozilla/5.0',
        },
      },
      (res) => {
        const cookies = res.headers['set-cookie'] || [];
        const adminCookie = cookies.find((c) => c.startsWith('admin_session='));
        if (!adminCookie) return reject(new Error('No admin_session cookie'));
        resolve(adminCookie.split(';')[0]); // key=value
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function checkArticles(cookie) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: HOST,
        port: 443,
        path: PATH,
        method: 'GET',
        headers: {
          Cookie: cookie,
          'User-Agent': 'Mozilla/5.0',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          const snippet = data.slice(0, 500);
          resolve({ status: res.statusCode, len: data.length, snippet });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    const cookie = await login(ADMIN_PASSWORD);
    const result = await checkArticles(cookie);
    console.log(JSON.stringify(result));
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
