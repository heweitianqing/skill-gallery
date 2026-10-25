// Fetch skills listed in skills/<name>/meta.yaml into the git-ignored cache
// (.cache/skills/), pinned to the commit or CLI version recorded there.
//
// Cache layout, one folder per pinned source:
//   .cache/skills/<name>@<commit12>/skill/            git method (same for both agents)
//   .cache/skills/<name>@<pkg-version>/<agent>/skill/  npm-cli method (generated per agent)
// Each folder has a source.json next to skill/ describing where it came from;
// the run scripts copy that into run.json.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import YAML from 'yaml';
import { REPO_ROOT, die, log, treeSha256 } from './common.mjs';

export const SKILLS_META_DIR = path.join(REPO_ROOT, 'skills');
export const CACHE_DIR = process.env.SG_SKILL_CACHE || path.join(REPO_ROOT, '.cache', 'skills');

export function loadMeta(name) {
  const file = path.join(SKILLS_META_DIR, name, 'meta.yaml');
  if (!fs.existsSync(file)) die(`no ${path.relative(REPO_ROOT, file)}`);
  const meta = YAML.parse(fs.readFileSync(file, 'utf8'));
  if (meta.name !== name) die(`${file}: name is ${meta.name}, expected ${name}`);
  return meta;
}

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim();
}

function finish(dest, srcDir, source) {
  const staging = `${dest}.partial`;
  fs.rmSync(staging, { recursive: true, force: true });
  fs.mkdirSync(staging, { recursive: true });
  fs.cpSync(srcDir, path.join(staging, 'skill'), { recursive: true, filter: (p) => path.basename(p) !== '.git' });
  if (!fs.existsSync(path.join(staging, 'skill', 'SKILL.md'))) die(`fetched folder has no SKILL.md: ${srcDir}`);
  const record = { ...source, tree_sha256: treeSha256(path.join(staging, 'skill')), fetched_at: new Date().toISOString() };
  fs.writeFileSync(path.join(staging, 'source.json'), JSON.stringify(record, null, 2) + '\n');
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(staging, dest);
  return record;
}

function fetchGit(meta, dest) {
  const { repo, commit, path: subpath } = meta.upstream;
  if (!/^[0-9a-f]{40}$/.test(commit)) die(`${meta.name}: upstream.commit must be a full SHA`);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `skill-gallery-fetch-${meta.name}-`));
  try {
    run('git', ['init', '-q', tmp]);
    run('git', ['-C', tmp, 'remote', 'add', 'origin', repo]);
    run('git', ['-C', tmp, 'fetch', '-q', '--depth', '1', '--filter=blob:none', 'origin', commit]);
    run('git', ['-C', tmp, 'sparse-checkout', 'set', '--no-cone', `/${subpath}/`, '/LICENSE', '/LICENSE.*', '/LICENSE.txt']);
    run('git', ['-C', tmp, 'checkout', '-q', 'FETCH_HEAD']);
    const head = run('git', ['-C', tmp, 'rev-parse', 'HEAD']);
    if (head !== commit) die(`${meta.name}: fetched ${head}, expected ${commit}`);
    const src = path.join(tmp, subpath);
    if (!fs.existsSync(src)) die(`${meta.name}: ${subpath} not found at ${commit}`);
    const record = finish(dest, src, {
      name: meta.name, method: 'git', source_url: repo, source_commit: commit, source_path: subpath,
      license_spdx: meta.license?.spdx ?? null,
    });
    // Keep the repo-level license next to the skill when the skill folder has none.
    const rootLicense = ['LICENSE', 'LICENSE.md', 'LICENSE.txt'].map((f) => path.join(tmp, f)).find((f) => fs.existsSync(f));
    if (rootLicense && !meta.license?.in_skill_folder) fs.copyFileSync(rootLicense, path.join(dest, 'LICENSE.upstream'));
    return record;
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function fetchNpmCli(meta, agent, dest) {
  const f = meta.fetch;
  const args = f.args?.[agent];
  const outPath = f.output_path?.[agent];
  if (!args || !outPath) die(`${meta.name}: no npm-cli args/output_path for agent ${agent}`);
  const spec = `${f.package}@${f.version}`;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `skill-gallery-fetch-${meta.name}-`));
  const project = path.join(tmp, 'project');
  fs.mkdirSync(project);
  try {
    // npx with an exact version, run in an empty directory outside the repo; nothing is installed globally.
    const outText = run('npx', ['--yes', spec, ...args], { cwd: project, env: { ...process.env, CI: '1', NO_COLOR: '1' } });
    const src = path.join(project, outPath);
    if (!fs.existsSync(src)) die(`${meta.name}: ${spec} did not create ${outPath}\n${outText}`);
    const generated = [];
    const walk = (d) => {
      for (const n of fs.readdirSync(d)) {
        const p = path.join(d, n);
        const rel = path.relative(project, p);
        if (rel === outPath) continue;
        if (fs.statSync(p).isDirectory()) walk(p);
        else generated.push(rel);
      }
    };
    walk(project);
    return finish(dest, src, {
      name: meta.name, method: 'npm-cli', source_url: `npm:${spec}`, source_commit: null,
      source_path: outPath, cli: { package: f.package, version: f.version, command: `npx ${spec} ${args.join(' ')}` },
      other_generated_files: generated, upstream_repo: meta.upstream?.repo ?? null,
      upstream_commit_reference: meta.upstream?.commit ?? null, license_spdx: meta.license?.spdx ?? null,
    });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// Returns the path of the cached skill folder (the one with SKILL.md),
// fetching it first if needed.
export function resolveSkill(name, agent, { refresh = false } = {}) {
  const meta = loadMeta(name);
  const method = meta.fetch?.method;
  let dest;
  if (method === 'git') dest = path.join(CACHE_DIR, `${name}@${meta.upstream.commit.slice(0, 12)}`);
  else if (method === 'npm-cli') {
    if (!agent) die(`${name} is generated per agent; pass --agent claude|codex`);
    dest = path.join(CACHE_DIR, `${name}@${meta.fetch.version}`, agent);
  } else die(`${name}: unknown fetch.method ${method}`);
  if (refresh || !fs.existsSync(path.join(dest, 'source.json'))) {
    log(`fetching ${name}${method === 'npm-cli' ? ` (${agent})` : ''} -> ${path.relative(REPO_ROOT, dest)}`);
    if (method === 'git') fetchGit(meta, dest);
    else fetchNpmCli(meta, agent, dest);
  }
  return path.join(dest, 'skill');
}
