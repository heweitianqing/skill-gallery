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
import { REPO_ROOT } from './lib/common.mjs';
import { PLAYWRIGHT_VERSION, cellUrl, launchBrowser, loadSettled, readRecord, selectCells, writeRecord } from './lib/browser.mjs';

const VIEWPORTS = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
];
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

  const networkIdle = await loadSettled(page, cellUrl(cellDir));

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
  const cells = selectCells(process.argv.slice(2), (c) => VIEWPORTS.some((v) => !fs.existsSync(path.join(c, `${v.name}.png`))));
  if (!cells.length) {
    console.error('nothing to capture');
    return;
  }
  const { browser, channel, label } = await launchBrowser();
  try {
    for (const cellDir of cells) {
      if (!fs.existsSync(path.join(cellDir, 'index.html'))) {
        console.error(`skip (no index.html): ${cellDir}`);
        continue;
      }
      const shots = {};
      for (const vp of VIEWPORTS) shots[vp.name] = await capture(browser, cellDir, vp);
      const record = readRecord(cellDir);
      if (record) {
        // Remote images actually requested at runtime (also catches ones added by JS).
        const runtimeImages = [...new Set(Object.values(shots).flatMap((s) => s.remote_requests.filter((q) => q.type === 'image').map((q) => q.url)))];
        record.runtime_remote_images = runtimeImages;
        record.rule_violations = [...new Set([...(record.rule_violations || []), ...(runtimeImages.length ? ['remote_image'] : [])])];
        record.screenshots = {
          tool: `playwright ${PLAYWRIGHT_VERSION}`,
          browser: label,
          browser_channel: channel,
          taken_at: new Date().toISOString(),
          ...shots,
        };
        writeRecord(cellDir, record);
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
