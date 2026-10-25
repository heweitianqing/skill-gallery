#!/usr/bin/env node
// Recompute `external_refs` / `rule_violations` in run.json from each cell's
// index.html (the runners already do this; use it after changing the scanner).
//
//   node scripts/scan-refs.mjs                 # every runs/<prompt>/<cell>/
//   node scripts/scan-refs.mjs runs/landing-saas/codex__native [...]

import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, RUNS_DIR, scanExternalRefs } from './lib/common.mjs';

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
  const runtime = record.runtime_remote_images?.length ? ['remote_image'] : [];
  record.rule_violations = [...new Set([...refs.violations, ...runtime])];
  record.previous_attempts ??= [];
  fs.writeFileSync(runJson, JSON.stringify(record, null, 2) + '\n');
  console.error(`${path.relative(REPO_ROOT, cell)}: ${refs.count} external refs (${Object.entries(refs.counts).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'})${record.rule_violations.length ? `  VIOLATIONS: ${record.rule_violations.join(', ')}` : ''}`);
}
