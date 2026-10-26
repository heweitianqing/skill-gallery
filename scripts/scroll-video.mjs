#!/usr/bin/env node
// scroll.webm: a recording of each cell's page scrolling from top to bottom at
// a constant speed, so motion (scroll reveals, parallax, pinned scenes) that
// screenshots cannot show is visible. Same parameters for every cell.
// Recording only: it does not change `success`.
//
//   node scripts/scroll-video.mjs                 # every cell without scroll.webm
//   node scripts/scroll-video.mjs --force         # redo all of them
//   node scripts/scroll-video.mjs runs/landing-saas/claude__native [...]
//
// The page is rendered at 1440x900 and recorded at 720x450: 0.5 s at the top,
// 7 s of mouse-wheel scrolling (wheel events, so smooth-scroll libraries such as
// Lenis react as they would for a reader), 0.5 s at the bottom. Unlike the
// screenshots, the page is not scrolled through beforehand, so scroll-triggered
// effects play during the recording. The raw recording is trimmed to start
// after the page has loaded and re-encoded as VP9 with Playwright's ffmpeg,
// at most 1 MB. Writes run.json `video`.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { REPO_ROOT } from './lib/common.mjs';
import { PLAYWRIGHT_VERSION, cellUrl, launchBrowser, readRecord, selectCells, writeRecord } from './lib/browser.mjs';

const VIEWPORT = { width: 1440, height: 900 };
const VIDEO = { width: 720, height: 450 };
const HOLD_START_MS = 500;
const SCROLL_MS = 7000;
const HOLD_END_MS = 500;
const SECONDS = (HOLD_START_MS + SCROLL_MS + HOLD_END_MS) / 1000;
const STEP_MS = 40;
const MAX_BYTES = 1_000_000;
const BITRATES = ['700k', '450k', '300k', '200k'];

function findFfmpeg() {
  if (process.env.SG_FFMPEG) return process.env.SG_FFMPEG;
  const cache = process.env.PLAYWRIGHT_BROWSERS_PATH
    || (process.platform === 'darwin' ? path.join(os.homedir(), 'Library/Caches/ms-playwright') : path.join(os.homedir(), '.cache/ms-playwright'));
  if (fs.existsSync(cache)) {
    for (const d of fs.readdirSync(cache).filter((n) => n.startsWith('ffmpeg-')).sort().reverse()) {
      for (const bin of ['ffmpeg-mac', 'ffmpeg-linux', 'ffmpeg']) {
        if (fs.existsSync(path.join(cache, d, bin))) return path.join(cache, d, bin);
      }
    }
  }
  return 'ffmpeg';
}

// The element a reader's wheel would scroll at the centre of the viewport:
// the nearest scrollable ancestor (dashboards often scroll an inner panel),
// otherwise the document.
async function scrollTarget(page) {
  return page.evaluate(({ x, y }) => {
    let el = document.elementFromPoint(x, y);
    while (el && el !== document.body && el !== document.documentElement) {
      const style = getComputedStyle(el);
      if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 4) {
        return { kind: 'element', distance: el.scrollHeight - el.clientHeight };
      }
      el = el.parentElement;
    }
    const s = document.scrollingElement || document.documentElement;
    return { kind: 'document', distance: Math.max(0, s.scrollHeight - window.innerHeight) };
  }, { x: VIEWPORT.width / 2, y: VIEWPORT.height / 2 });
}

async function record(browser, cellDir, tmp) {
  const context = await browser.newContext({ viewport: VIEWPORT, recordVideo: { dir: tmp, size: VIDEO } });
  const page = await context.newPage();
  const t0 = Date.now();
  try {
    await page.goto(cellUrl(cellDir), { waitUntil: 'networkidle', timeout: 60_000 });
  } catch {}
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  await page.mouse.move(VIEWPORT.width / 2, VIEWPORT.height / 2);
  const target = await scrollTarget(page);
  const offsetMs = Date.now() - t0;
  await page.waitForTimeout(HOLD_START_MS);
  const steps = Math.round(SCROLL_MS / STEP_MS);
  const perStep = target.distance / steps;
  const start = Date.now();
  for (let i = 1; i <= steps; i++) {
    await page.mouse.wheel(0, perStep);
    const wait = start + i * STEP_MS - Date.now();
    if (wait > 0) await page.waitForTimeout(wait);
  }
  await page.waitForTimeout(HOLD_END_MS);
  const end = await page.evaluate(() => {
    const s = document.scrollingElement || document.documentElement;
    return { y: s.scrollTop, max: s.scrollHeight - window.innerHeight };
  });
  const video = page.video();
  await context.close();
  return { raw: await video.path(), offsetMs, target, end };
}

function encode(ffmpeg, raw, offsetMs, dest) {
  for (const rate of BITRATES) {
    execFileSync(ffmpeg, [
      '-y', '-loglevel', 'error', '-ss', (offsetMs / 1000).toFixed(2), '-i', raw, '-t', String(SECONDS), '-an',
      '-c:v', 'libvpx-vp9', '-b:v', rate, '-maxrate', rate, '-bufsize', rate.replace('k', '') * 2 + 'k',
      '-deadline', 'good', '-cpu-used', '4', '-row-mt', '1', '-pix_fmt', 'yuv420p', dest,
    ], { stdio: ['ignore', 'ignore', 'pipe'] });
    const bytes = fs.statSync(dest).size;
    if (bytes <= MAX_BYTES) return { bytes, bitrate: rate };
  }
  return { bytes: fs.statSync(dest).size, bitrate: BITRATES.at(-1) };
}

async function main() {
  const cells = selectCells(process.argv.slice(2), (c) => !fs.existsSync(path.join(c, 'scroll.webm')));
  if (!cells.length) {
    console.error('nothing to record');
    return;
  }
  const ffmpeg = findFfmpeg();
  const { browser, label } = await launchBrowser();
  try {
    for (const cellDir of cells) {
      const rec = readRecord(cellDir);
      if (!rec) continue;
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-gallery-video-'));
      try {
        const r = await record(browser, cellDir, tmp);
        const dest = path.join(cellDir, 'scroll.webm');
        const { bytes, bitrate } = encode(ffmpeg, r.raw, r.offsetMs, dest);
        rec.video = {
          file: 'scroll.webm',
          width: VIDEO.width,
          height: VIDEO.height,
          seconds: SECONDS,
          bytes,
          codec: 'vp9',
          bitrate,
          viewport: VIEWPORT,
          script: `hold ${HOLD_START_MS} ms, mouse-wheel scroll for ${SCROLL_MS} ms at constant speed, hold ${HOLD_END_MS} ms`,
          scroll_target: r.target.kind,
          scroll_distance: Math.round(r.target.distance),
          reached_bottom: r.target.kind === 'document' ? r.end.y >= r.end.max - 4 : null,
          tool: `playwright ${PLAYWRIGHT_VERSION}`,
          browser: label,
          recorded_at: new Date().toISOString(),
        };
        writeRecord(cellDir, rec);
        console.error(`${path.relative(REPO_ROOT, cellDir)}: scroll.webm ${(bytes / 1024).toFixed(0)} KB at ${bitrate}, ${r.target.kind} ${Math.round(r.target.distance)} px${rec.video.reached_bottom === false ? ' (did not reach the bottom)' : ''}`);
      } finally {
        fs.rmSync(tmp, { recursive: true, force: true });
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
