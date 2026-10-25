#!/usr/bin/env node
// Full-page screenshots of each run's index.html with Playwright (Chromium).
//
//   node scripts/screenshot.mjs                 # every runs/<prompt>/<cell>/ missing a screenshot
//   node scripts/screenshot.mjs --force         # redo all of them
//   node scripts/screenshot.mjs runs/landing-saas/claude__native [...]
//
// Browser: Playwright's own Chromium by default. SG_SCREENSHOT_CHANNEL=chrome
// uses the installed Google Chrome instead, and SG_SCREENSHOT_EXECUTABLE=<path>
// any Chromium binary. The browser and its version are recorded in run.json.
//
// Writes desktop.png (1440 wide) and mobile.png (390 wide) next to index.html
// and records the capture details in that cell's run.json under "screenshots".

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { REPO_ROOT, RUNS_DIR } from './lib/common.mjs';

const VIEWPORTS = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
];
const NAV_TIMEOUT_MS = 60_000;
const SETTLE_MS = 800;

function findCells() {
  const cells = [];
  if (!fs.existsSync(RUNS_DIR)) return cells;
  for (const p of fs.readdirSync(RUNS_DIR)) {
    const pd = path.join(RUNS_DIR, p);
    if (!fs.statSync(pd).isDirectory()) continue;
    for (const c of fs.readdirSync(pd)) {
      if (c.startsWith('_')) continue;
      const cd = path.join(pd, c);
      if (fs.existsSync(path.join(cd, 'index.html'))) cells.push(cd);
    }
  }
  return cells.sort();
}

// Scroll through the page so scroll-triggered content (IntersectionObserver
// reveals, lazy sections) is rendered, then return to the top. Scrolls are
// instant (pages often set `scroll-behavior: smooth`, which would still be
// animating at capture time), and focus is cleared so focus-only elements such
// as skip links stay hidden.
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const go = (top) => window.scrollTo({ top, left: 0, behavior: 'instant' });
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      go(y);
      await new Promise((r) => setTimeout(r, 120));
    }
    go(document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 300));
    go(0);
    for (let i = 0; i < 50 && window.scrollY !== 0; i++) await new Promise((r) => setTimeout(r, 50));
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
  });
}

async function capture(browser, cellDir, vp) {
  const context = await browser.newContext({
    viewport: vp.viewport,
    deviceScaleFactor: vp.deviceScaleFactor,
    isMobile: vp.isMobile,
    hasTouch: vp.hasTouch,
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const remoteRequests = [];
  page.on('request', (r) => { if (/^https?:/i.test(r.url())) remoteRequests.push({ url: r.url().slice(0, 300), type: r.resourceType() }); });
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300)); });
  page.on('pageerror', (e) => pageErrors.push(String(e.message || e).slice(0, 300)));
  page.on('requestfailed', (r) => failedRequests.push({ url: r.url().slice(0, 200), error: r.failure()?.errorText || null }));

  const url = pathToFileURL(path.join(cellDir, 'index.html')).href;
  let networkIdle = true;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: NAV_TIMEOUT_MS });
  } catch {
    networkIdle = false;
  }
  await page.evaluate(() => document.fonts.ready);
  await scrollThrough(page);
  try {
    await page.waitForLoadState('networkidle', { timeout: 15_000 });
  } catch {
    networkIdle = false;
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(SETTLE_MS);

  const metrics = await page.evaluate(() => ({
    scroll_width: document.documentElement.scrollWidth,
    scroll_height: document.documentElement.scrollHeight,
    fonts_loaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')),
    fonts_failed: [...document.fonts].filter((f) => f.status === 'error').map((f) => f.family.replace(/"/g, '')),
  }));
  const file = `${vp.name}.png`;
  await page.screenshot({ path: path.join(cellDir, file), fullPage: true, animations: 'disabled' });
  await context.close();
  return {
    file,
    viewport: vp.viewport,
    device_scale_factor: vp.deviceScaleFactor,
    is_mobile: vp.isMobile,
    page_height: metrics.scroll_height,
    horizontal_overflow: metrics.scroll_width > vp.viewport.width,
    scroll_width: metrics.scroll_width,
    network_idle: networkIdle,
    fonts_loaded: [...new Set(metrics.fonts_loaded)],
    fonts_failed: [...new Set(metrics.fonts_failed)],
    console_errors: consoleErrors,
    page_errors: pageErrors,
    failed_requests: failedRequests,
    remote_requests: remoteRequests,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const explicit = args.filter((a) => !a.startsWith('--')).map((a) => path.resolve(a));
  let cells = explicit.length ? explicit : findCells();
  if (!explicit.length && !force) {
    cells = cells.filter((c) => VIEWPORTS.some((v) => !fs.existsSync(path.join(c, `${v.name}.png`))));
  }
  if (!cells.length) {
    console.error('nothing to capture');
    return;
  }
  const require = createRequire(import.meta.url);
  const playwrightVersion = require('playwright/package.json').version;
  // Default: Playwright's full Chromium in new headless mode (closer to desktop
  // Chrome than the separate headless shell; `npx playwright install --no-shell chromium`).
  const executablePath = process.env.SG_SCREENSHOT_EXECUTABLE || undefined;
  const channel = executablePath ? undefined : process.env.SG_SCREENSHOT_CHANNEL || 'chromium';
  const browser = await chromium.launch(executablePath ? { executablePath } : { channel });
  const browserName = executablePath ? `chromium (${path.basename(path.dirname(path.dirname(path.dirname(executablePath))))})` : channel === 'chrome' ? 'google-chrome' : 'playwright-chromium';
  try {
    for (const cellDir of cells) {
      if (!fs.existsSync(path.join(cellDir, 'index.html'))) {
        console.error(`skip (no index.html): ${cellDir}`);
        continue;
      }
      const shots = {};
      for (const vp of VIEWPORTS) shots[vp.name] = await capture(browser, cellDir, vp);
      const runJson = path.join(cellDir, 'run.json');
      if (fs.existsSync(runJson)) {
        const record = JSON.parse(fs.readFileSync(runJson, 'utf8'));
        // Remote images actually requested at runtime (also catches ones added by JS).
        const runtimeImages = [...new Set(Object.values(shots).flatMap((s) => s.remote_requests.filter((q) => q.type === 'image').map((q) => q.url)))];
        record.runtime_remote_images = runtimeImages;
        record.rule_violations = [...new Set([...(record.rule_violations || []), ...(runtimeImages.length ? ['remote_image'] : [])])];
        record.screenshots = {
          tool: `playwright ${playwrightVersion}`,
          browser: `${browserName} ${browser.version()}`,
          browser_channel: channel ?? null,
          taken_at: new Date().toISOString(),
          ...shots,
        };
        fs.writeFileSync(runJson, JSON.stringify(record, null, 2) + '\n');
      }
      const issues = Object.values(shots).flatMap((s) => [
        ...(s.horizontal_overflow ? [`${s.file}: horizontal overflow (${s.scroll_width}px)`] : []),
        ...(s.page_errors.length ? [`${s.file}: ${s.page_errors.length} page error(s)`] : []),
        ...(s.failed_requests.length ? [`${s.file}: ${s.failed_requests.length} failed request(s)`] : []),
      ]);
      console.error(`${path.relative(REPO_ROOT, cellDir)}: ${VIEWPORTS.map((v) => `${v.name}.png`).join(', ')}${issues.length ? `  [${issues.join('; ')}]` : ''}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
