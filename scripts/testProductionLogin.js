const https = require('https');

function testLogin() {
  const postData = JSON.stringify({
    email: 'admin@ridhoportofolio.com',
    password: 'RidhoAdmin123!'
  });

  const options = {
    hostname: 'ridhi-porto.vercel.app',
    port: 443,
    path: '/admin/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Status Message: ${res.statusMessage}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', data);
      
      // Check if login was successful (200 or 302 redirect)
      if (res.statusCode === 200 || res.statusCode === 302) {
        console.log('✅ Login successful!');
        if (res.statusCode === 302) {
          console.log('Redirected to:', res.headers.location);
        }
        try {
          const response = JSON.parse(data);
          if (response.token) {
            console.log('Token:', response.token);
          }
        } catch (e) {
          // HTML response is fine for successful login
        }
      } else {
        console.log('❌ Login failed with status:', res.statusCode);
      }
    });
  });

  req.on('error', (e) => {
    console.error('Request error:', e.message);
  });

  req.write(postData);
  req.end();
}

testLogin();