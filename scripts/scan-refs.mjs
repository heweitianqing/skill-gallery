#!/usr/bin/env node
// Recompute `external_refs` / `rule_violations` in run.json from each cell's
// index.html (the runners already do this; use it after changing the scanner).
//
//   node scripts/scan-refs.mjs                 # every runs/<prompt>/<cell>/
//   node scripts/scan-refs.mjs runs/landing-saas/codex__native [...]

import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, RUNS_DIR, scanExternalRefs, scanLocalRefs } from './lib/common.mjs';

const args = process.argv.slice(2).map((a) => path.resolve(a));
const cells = args.length ? args : fs.readdirSync(RUNS_DIR)
  .filter((p) => fs.statSync(path.join(RUNS_DIR, p)).isDirectory())
  .flatMap((p) => fs.readdirSync(path.join(RUNS_DIR, p)).filter((c) => !c.startsWith('_')).map((c) => path.join(RUNS_DIR, p, c)));

for (const cell of cells) {
  const html = path.join(cell, 'index.html');
  const runJson = path.join(cell, 'run.json');
  if (!fs.existsSync(html) || !fs.existsSync(runJson)) continue;
  const record = JSON.parse(fs.readFileSync(runJson, 'utf8'));
  const refs = scanExternalRefs(fs.readFileSync(html, 'utf8'));
  delete record.output?.external_refs;
  record.external_refs = refs;
  // Local references are checked against the files kept next to index.html.
  const missing = [];
  const seen = new Set();
  const queue = scanLocalRefs(fs.readFileSync(html, 'utf8')).map((ref) => ({ ref, from: cell }));
  while (queue.length) {
    const { ref, from } = queue.shift();
    const abs = path.resolve(ref.startsWith('/') ? cell : from, ref.replace(/^\/+/, ''));
    if (seen.has(abs)) continue;
    seen.add(abs);
    if (!abs.startsWith(cell + path.sep) || !fs.existsSync(abs)) { missing.push(ref); continue; }
    const ext = path.extname(abs).toLowerCase();
    if (['.css', '.js', '.mjs'].includes(ext)) {
      for (const r of scanLocalRefs(fs.readFileSync(abs, 'utf8'), ext === '.css' ? 'css' : 'js')) queue.push({ ref: r, from: path.dirname(abs) });
    }
  }
  if (record.output) record.output.missing_local_refs = missing;
  const runtime = record.runtime_remote_images?.length ? ['remote_image'] : [];
  const extra = record.output?.kept_assets?.length ? ['extra_files'] : [];
  const overCap = record.output?.assets_over_cap?.length ? ['assets_over_cap'] : [];
  record.rule_violations = [...new Set([...refs.violations, ...runtime, ...extra, ...overCap])];
  record.previous_attempts ??= [];
  fs.writeFileSync(runJson, JSON.stringify(record, null, 2) + '\n');
  console.error(`${path.relative(REPO_ROOT, cell)}: ${refs.count} external refs (${Object.entries(refs.counts).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'})${record.rule_violations.length ? `  VIOLATIONS: ${record.rule_violations.join(', ')}` : ''}${missing.length ? `  MISSING LOCAL: ${missing.join(', ')}` : ''}`);
}
