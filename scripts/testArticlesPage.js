const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/admin/articles',
  method: 'GET',
  headers: {
    'Cookie': 'admin_session=eyJyb2xlIjoiYWRtaW4iLCJ0aW1lc3RhbXAiOjE3NzE1NjcyODUzMzgsImV4cGlyZXMiOjE3NzE2NTM2ODUzMzh9',
    'User-Agent': 'Mozilla/5.0'
  }
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Articles page loaded successfully');
      console.log('Response length:', data.length, 'characters');
    } else if (res.statusCode === 302) {
      console.log('❌ Redirected to:', res.headers.location);
    } else {
      console.log('❌ Error:', res.statusCode);
      console.log('Response:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.end();