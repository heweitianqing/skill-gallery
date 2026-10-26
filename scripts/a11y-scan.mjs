#!/usr/bin/env node
// Accessibility scan of each cell's index.html with axe-core (pinned dev
// dependency) at the desktop viewport. Recording only: it does not change
// `success`.
//
//   node scripts/a11y-scan.mjs                 # every cell without an a11y result
//   node scripts/a11y-scan.mjs --force         # redo all of them
//   node scripts/a11y-scan.mjs runs/form-states/claude__native [...]
//
// Writes run.json `a11y`. The page is loaded the same way as for screenshots
// (network idle, fonts, one scroll-through so revealed content is present).

import path from 'node:path';
import { createRequire } from 'node:module';
import { REPO_ROOT } from './lib/common.mjs';
import { PLAYWRIGHT_VERSION, cellUrl, launchBrowser, loadSettled, readRecord, selectCells, writeRecord } from './lib/browser.mjs';

const require = createRequire(import.meta.url);
const AXE_PATH = require.resolve('axe-core/axe.min.js');
const AXE_VERSION = require('axe-core/package.json').version;
const VIEWPORT = { width: 1440, height: 900 };
const IMPACTS = ['critical', 'serious', 'moderate', 'minor'];
// Let entrance transitions finish so contrast is measured on the final state.
const EXTRA_SETTLE_MS = 1500;

async function scan(browser, cellDir) {
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  try {
    await loadSettled(page, cellUrl(cellDir));
    await page.waitForTimeout(EXTRA_SETTLE_MS);
    await page.addScriptTag({ path: AXE_PATH });
    // axe's default rule set: WCAG 2.0–2.2 A/AA plus best practices, experimental rules off.
    return await page.evaluate(async () => {
      const r = await window.axe.run(document, { resultTypes: ['violations'] });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
    });
  } finally {
    await context.close();
  }
}

async function main() {
  const cells = selectCells(process.argv.slice(2), (c) => !readRecord(c)?.a11y);
  if (!cells.length) {
    console.error('nothing to scan');
    return;
  }
  const { browser, label } = await launchBrowser();
  try {
    for (const cellDir of cells) {
      const record = readRecord(cellDir);
      if (!record) continue;
      const rules = await scan(browser, cellDir);
      const count = (key) => Object.fromEntries(IMPACTS.map((i) => [i, rules.filter((r) => r.impact === i).reduce((n, r) => n + (key === 'rules' ? 1 : r.nodes), 0)]));
      record.a11y = {
        tool: 'axe-core',
        version: AXE_VERSION,
        rule_set: 'axe-core default (WCAG 2.0-2.2 A/AA and best practices; experimental rules off)',
        runner: `playwright ${PLAYWRIGHT_VERSION}`,
        browser: label,
        viewport: VIEWPORT,
        violations: count('rules'),
        violation_nodes: count('nodes'),
        rule_ids: rules.map((r) => r.id).sort(),
        rules: rules.sort((a, b) => IMPACTS.indexOf(a.impact) - IMPACTS.indexOf(b.impact) || a.id.localeCompare(b.id)),
        scanned_at: new Date().toISOString(),
      };
      writeRecord(cellDir, record);
      const v = record.a11y.violations;
      console.error(`${path.relative(REPO_ROOT, cellDir)}: ${IMPACTS.map((i) => `${i} ${v[i]}`).join(', ')}${rules.length ? `  [${record.a11y.rule_ids.join(', ')}]` : ''}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
