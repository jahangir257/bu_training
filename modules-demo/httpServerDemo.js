/**
 * Module 2: Creating a web server using the HTTP module
 * --------------------------------------------------------
 * Shows the "traditional" Node.js way of building a server with the
 * built-in `http` module (no Express), handling requests/responses
 * and basic routing manually. Compare this with the Express server
 * in server.js to see why frameworks like Express simplify things.
 *
 * Run with:  node modules-demo/httpServerDemo.js
 * Then visit http://localhost:4000 in your browser or curl it.
 */

const http = require('http');
const url = require('url');

const PORT = 4000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname } = parsedUrl;

  res.setHeader('Content-Type', 'application/json');

  if (pathname === '/' && req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: 'Welcome to the raw Node.js HTTP server demo' }));
  } else if (pathname === '/greet' && req.method === 'GET') {
    const name = parsedUrl.query.name || 'stranger';
    res.statusCode = 200;
    res.end(JSON.stringify({ message: `Hello, ${name}!` }));
  } else if (pathname === '/echo' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      res.statusCode = 200;
      res.end(JSON.stringify({ youSent: body }));
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Raw HTTP server (Module 2 demo) running at http://localhost:${PORT}`);
  console.log('Try: curl http://localhost:4000/greet?name=Alice');
});
