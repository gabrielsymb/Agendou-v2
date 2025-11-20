import http from 'http';

const email = process.argv[2];
const senha = process.argv[3];
if(!email || !senha){
  console.error('Usage: ts-node src/backend/scripts/http-login-test.ts <email> <senha>');
  process.exit(1);
}

const data = JSON.stringify({ email, senha });

const options: http.RequestOptions = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log('HEADERS', res.headers);
    try{ console.log('BODY', JSON.parse(body)); } catch(e){ console.log('BODY', body); }
  });
});

req.on('error', (e) => { console.error('Request error', e); process.exit(2); });
req.write(data);
req.end();
