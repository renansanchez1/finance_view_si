import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, 'dist');
const PORT = parseInt(process.env.PORT || '3000', 10);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf',
};

const server = createServer((req, res) => {
  // Strip query string
  const url = req.url.split('?')[0];
  let filePath = join(DIST, url === '/' ? 'index.html' : url);

  // SPA fallback — serve index.html for unknown routes
  if (!existsSync(filePath)) {
    filePath = join(DIST, 'index.html');
  }

  try {
    const data = readFileSync(filePath);
    const ext = extname(filePath);
    const contentType = MIME[ext] || 'application/octet-stream';

    // Cache static assets, no-cache HTML
    const isHtml = ext === '.html';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': isHtml ? 'no-cache' : 'public, max-age=31536000, immutable',
    });
    res.end(data);
  } catch {
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ FinanceView running on http://0.0.0.0:${PORT}`);
});
