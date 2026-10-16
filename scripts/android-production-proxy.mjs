import http from 'node:http';

// A compiled debug APK requests dev=true even when Expo starts with --no-dev.
// Keep the APK unchanged and serve production JS only on this local test route.
const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1');
  if (url.pathname.endsWith('.bundle')) {
    url.searchParams.set('dev', 'false');
    url.searchParams.set('minify', 'true');
    url.searchParams.set('lazy', 'false');
  }
  const upstream = http.request(
    {
      hostname: '127.0.0.1',
      port: 8084,
      path: url.pathname + url.search,
      method: request.method,
      headers: { ...request.headers, host: '127.0.0.1:8084' },
    },
    (result) => {
      response.writeHead(result.statusCode, result.headers);
      result.pipe(response);
    },
  );
  upstream.on('error', (error) => {
    console.error(error.message);
    response.writeHead(502);
    response.end('Local Metro unavailable');
  });
  request.pipe(upstream);
});

server.listen(8083, '127.0.0.1', () => {
  console.log('Android production JS: 127.0.0.1:8083 → Metro 127.0.0.1:8084');
});
