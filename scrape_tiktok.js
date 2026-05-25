const https = require('https');
const fs = require('fs');

https.get('https://www.tiktok.com/@ridhopasii', { 
  headers: { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9',
  } 
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    fs.writeFileSync('tiktok_raw.html', data);
    const match = data.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.+?)<\/script>/);
    if(match) {
      fs.writeFileSync('tiktok_data.json', match[1]);
      console.log('Saved to tiktok_data.json');
    } else {
      console.log('Not found. Saved to tiktok_raw.html for inspection');
    }
  });
});
