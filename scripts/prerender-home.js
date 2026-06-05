import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import puppeteer from 'puppeteer';

const DIST_DIR = path.resolve('dist');
const PORT = 5174;
const PREVIEW_URL = `http://127.0.0.1:${PORT}/`;
const PRERENDER_ROUTES = ['/'];

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyForAppRoute() {
  const indexPath = path.join(DIST_DIR, 'index.html');
  const appDir = path.join(DIST_DIR, 'app');
  const appIndex = path.join(appDir, 'index.html');
  if (!(await fileExists(indexPath))) {
    throw new Error('dist/index.html not found. Run "vite build" first.');
  }
  await fs.mkdir(appDir, { recursive: true });
  const html = await fs.readFile(indexPath, 'utf8');
  // Write a generic SPA index for /app (no prerendered head from landing)
  await fs.writeFile(appIndex, html, 'utf8');
  console.log('[prerender] Copied base index.html to /app/index.html');
}

function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) return reject(new Error('Preview server start timeout'));
        setTimeout(attempt, 300);
      });
    };
    attempt();
  });
}

function startStaticServer() {
  console.log('[prerender] Starting static server...');
  const server = http.createServer(async (req, res) => {
    try {
      const reqUrl = req.url?.split('?')[0] || '/';
      let filePath = path.join(DIST_DIR, reqUrl);
      const statSafe = async (p) => {
        try { return await fs.stat(p); } catch { return null; }
      };
      let stat = await statSafe(filePath);
      if (!stat) {
        // Fallback to index.html for SPA routes
        filePath = path.join(DIST_DIR, 'index.html');
      } else if (stat.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
      const ext = path.extname(filePath).toLowerCase();
      const contentType = ext === '.html' ? 'text/html' :
                          ext === '.js' ? 'application/javascript' :
                          ext === '.css' ? 'text/css' :
                          ext === '.json' ? 'application/json' :
                          ext === '.svg' ? 'image/svg+xml' : 'application/octet-stream';
      const data = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch (e) {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log('[prerender] Static server up at', PREVIEW_URL);
      resolve(server);
    });
  });
}

const LANG = process.env.VITE_DEFAULT_LANGUAGE || 'pt-BR';

async function prerenderRoute(routePath) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', `--lang=${LANG}`],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.setExtraHTTPHeaders({ 'Accept-Language': `${LANG},${LANG.split('-')[0]};q=0.9` });
    await page.evaluateOnNewDocument((lang) => {
      localStorage.setItem('i18nextLng', lang);
    }, LANG);
    const url = `${PREVIEW_URL}${routePath.replace(/^\//, '')}?prerender=1`;
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    // Wait for Helmet tags to be injected
    await page.waitForSelector('meta[name="description"], meta[property="og:title"], script[type="application/ld+json"]', { timeout: 10000 });
    const html = await page.content();
    const outputDir = routePath === '/' ? DIST_DIR : path.join(DIST_DIR, routePath.replace(/^\//, ''));
    const outputPath = path.join(outputDir, 'index.html');
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputPath, html, 'utf8');
    console.log(`[prerender] Wrote prerendered HTML for ${routePath} -> ${outputPath}`);
  } finally {
    await browser.close();
  }
}

async function main() {
  await copyForAppRoute();
  const server = await startStaticServer();
  try {
    for (const routePath of PRERENDER_ROUTES) {
      await prerenderRoute(routePath);
    }
  } finally {
    server.close();
  }
}

main().catch((err) => {
  console.error('[prerender] Failed:', err);
  process.exit(1);
});
