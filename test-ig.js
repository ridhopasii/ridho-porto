const token = "IGAASRWMVF7xpBZAFotTWhfYmlNLVhaTVBNRnFVTVN5YVNRYThIV2x3TTE0MHNIZA2ZAsUWpjdTMtTXBoYkdEUjJsV0tJaU43LWNUQmJ5eVFSY29VempvLUNDMWVfLVB4YmNOYXNoYjBBdWNIZA1pRSTZA1TkZAzcWNoQS16MVVUazdKZAwZDZD";
fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`)
.then(res => res.json())
.then(console.log)
.catch(console.error);
