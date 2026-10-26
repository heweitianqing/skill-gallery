// Shared Playwright helpers for the post-processing scripts (screenshot.mjs,
// a11y-scan.mjs, scroll-video.mjs). They all load a cell's index.html the same
// way, so their results describe the same rendered page.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { RUNS_DIR } from './common.mjs';

const require = createRequire(import.meta.url);
export const PLAYWRIGHT_VERSION = require('playwright/package.json').version;
const NAV_TIMEOUT_MS = 60_000;
const SETTLE_MS = 800;

// runs/<prompt>/<cell>/ directories that have an index.html (cells starting
// with "_" are earlier attempts and are skipped).
export function findCells() {
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

// Cells named on the command line, or every cell (filtered by `needsWork`
// unless --force is given).
export function selectCells(argv, needsWork) {
  const force = argv.includes('--force');
  const explicit = argv.filter((a) => !a.startsWith('--')).map((a) => path.resolve(a));
  if (explicit.length) return explicit;
  const cells = findCells();
  return force ? cells : cells.filter(needsWork);
}

// Browser: Playwright's own full Chromium in new headless mode by default
// (`npx playwright install --no-shell chromium`). SG_SCREENSHOT_CHANNEL=chrome
// uses the installed Google Chrome, SG_SCREENSHOT_EXECUTABLE=<path> any Chromium.
export async function launchBrowser() {
  const executablePath = process.env.SG_SCREENSHOT_EXECUTABLE || undefined;
  const channel = executablePath ? undefined : process.env.SG_SCREENSHOT_CHANNEL || 'chromium';
  const browser = await chromium.launch(executablePath ? { executablePath } : { channel });
  const name = executablePath
    ? `chromium (${path.basename(path.dirname(path.dirname(path.dirname(executablePath))))})`
    : channel === 'chrome' ? 'google-chrome' : 'playwright-chromium';
  return { browser, channel: channel ?? null, label: `${name} ${browser.version()}` };
}

export function cellUrl(cellDir) {
  return pathToFileURL(path.join(cellDir, 'index.html')).href;
}

// Scroll through the page so scroll-triggered content (IntersectionObserver
// reveals, lazy sections) is rendered, then return to the top. Scrolls are
// instant (pages often set `scroll-behavior: smooth`, which would still be
// animating at capture time), and focus is cleared so focus-only elements such
// as skip links stay hidden.
export async function scrollThrough(page) {
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

// Open the page and wait until it has settled: network idle, fonts loaded,
// scrolled through once, settled again. Returns whether network idle was reached.
export async function loadSettled(page, url, { scroll = true } = {}) {
  let networkIdle = true;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: NAV_TIMEOUT_MS });
  } catch {
    networkIdle = false;
  }
  await page.evaluate(() => document.fonts.ready);
  if (scroll) await scrollThrough(page);
  try {
    await page.waitForLoadState('networkidle', { timeout: 15_000 });
  } catch {
    networkIdle = false;
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(SETTLE_MS);
  return networkIdle;
}

export function readRecord(cellDir) {
  const f = path.join(cellDir, 'run.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
}

export function writeRecord(cellDir, record) {
  fs.writeFileSync(path.join(cellDir, 'run.json'), JSON.stringify(record, null, 2) + '\n');
}
