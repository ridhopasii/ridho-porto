const http = require('http');
const querystring = require('querystring');

const postData = querystring.stringify({
  password: 'B1smillah'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData),
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
    // Check if login was successful (200 or 302 redirect)
    if (res.statusCode === 200 || res.statusCode === 302) {
      console.log('✅ Login successful!');
      if (res.statusCode === 302) {
        console.log('Redirected to:', res.headers.location);
      }
      
      // Check for session cookie
      const setCookie = res.headers['set-cookie'];
      if (setCookie) {
        console.log('✅ Session cookie set:', setCookie.find(cookie => cookie.includes('admin_session')));
      }
    } else {
      console.log('❌ Login failed');
      console.log('Response:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.write(postData);
req.end();