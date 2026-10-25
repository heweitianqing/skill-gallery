#!/usr/bin/env node
// Fetch a skill at the pinned source recorded in skills/<name>/meta.yaml into
// .cache/skills/ (git-ignored) and print the path of its folder.
//
//   node scripts/fetch-skill.mjs <name> [--agent claude|codex] [--refresh]
//   node scripts/fetch-skill.mjs --all [--refresh]

import fs from 'node:fs';
import { die } from './lib/common.mjs';
import { SKILLS_META_DIR, loadMeta, resolveSkill } from './lib/skills.mjs';

const args = process.argv.slice(2);
const refresh = args.includes('--refresh');
const agentIdx = args.indexOf('--agent');
const agent = agentIdx >= 0 ? args[agentIdx + 1] : null;
if (agent && !['claude', 'codex'].includes(agent)) die('--agent must be claude or codex');
const names = args.includes('--all')
  ? fs.readdirSync(SKILLS_META_DIR).filter((n) => fs.existsSync(`${SKILLS_META_DIR}/${n}/meta.yaml`))
  : args.filter((a, i) => !a.startsWith('--') && (agentIdx < 0 || i !== agentIdx + 1));
if (!names.length) die('usage: node scripts/fetch-skill.mjs <name> [--agent claude|codex] [--refresh] | --all');

for (const name of names) {
  const perAgent = loadMeta(name).fetch?.method === 'npm-cli';
  const agents = perAgent ? (agent ? [agent] : ['claude', 'codex']) : [agent];
  for (const a of agents) console.log(resolveSkill(name, a, { refresh }));
}
