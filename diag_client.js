const http = require('http');
const options = { hostname: '127.0.0.1', port: 3000, path: '/diag', method: 'GET', timeout: 3000 };
const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    try { console.log('Body:', JSON.parse(data)); } catch(e) { console.log('Body:', data); }
  });
});
req.on('error', (err) => console.error('Request error:', err.message));
req.on('timeout', () => { req.destroy(new Error('Request timed out')); });
req.end();
