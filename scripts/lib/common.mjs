// Shared helpers for run-claude.mjs and run-codex.mjs.
//
// A "cell" is one (prompt, agent, variant) combination, where variant is
// "native" or the name of a skill. Each run happens in a throwaway directory
// outside the repo with its own HOME, config home and working directory, and
// its results are copied into runs/<prompt>/<agent>__<variant>/.

import { spawn, execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const PROMPTS_DIR = process.env.SG_PROMPTS_DIR || path.join(REPO_ROOT, 'prompts');
export const RUNS_DIR = process.env.SG_RUNS_DIR || path.join(REPO_ROOT, 'runs');
// Per-operator state such as credentials. Never inside the repo.
export const CONFIG_DIR = process.env.SKILL_GALLERY_CONFIG_DIR || path.join(os.homedir(), '.config', 'skill-gallery');
export const TMP_ROOT = path.join(process.env.SKILL_GALLERY_TMP || os.tmpdir(), 'skill-gallery');
export const SCHEMA_VERSION = 1;
const DEFAULT_TIMEOUT_MIN = 60;

export function die(msg) {
  console.error(`error: ${msg}`);
  process.exit(2);
}

export function log(msg) {
  console.error(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
}

export function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function sha256File(file) {
  return sha256(fs.readFileSync(file));
}

// Deterministic hash of a directory tree: sorted relative paths + file hashes.
export function treeSha256(dir) {
  const entries = [];
  const walk = (d) => {
    for (const name of fs.readdirSync(d).sort()) {
      if (name === '.git' || name === '.DS_Store') continue;
      const p = path.join(d, name);
      const st = fs.lstatSync(p);
      if (st.isDirectory()) walk(p);
      else if (st.isFile()) entries.push(`${path.relative(dir, p)}\0${sha256File(p)}`);
    }
  };
  walk(dir);
  return sha256(entries.join('\n'));
}

export function parseCellArgs(argv, agent) {
  const usage = `usage: node scripts/run-${agent}.mjs <prompt-id> native
       node scripts/run-${agent}.mjs <prompt-id> <skill-name> [<skill-source-dir>]

  <skill-source-dir> is the folder that contains SKILL.md. If omitted, the skill
  is taken from skills/<skill-name>/meta.yaml via the fetch cache (scripts/fetch-skill.mjs).
  Optional env: SKILL_SOURCE_URL, SKILL_SOURCE_COMMIT (override what is read from git),
                SG_TIMEOUT_MIN (default ${DEFAULT_TIMEOUT_MIN}), SG_KEEP_TMP=1 (keep the throwaway dir).`;
  const [promptId, variant, skillSrc] = argv;
  if (!promptId || !variant || argv.includes('-h') || argv.includes('--help')) die(usage);
  if (variant === 'native') {
    if (skillSrc) die(`native runs take no skill directory\n${usage}`);
    return { promptId, variant, skill: null };
  }
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(variant)) die(`invalid skill name: ${variant}`);
  if (!skillSrc) return { promptId, variant, skill: { name: variant, src: null } };
  const src = path.resolve(skillSrc);
  if (!fs.existsSync(path.join(src, 'SKILL.md'))) die(`no SKILL.md in ${src}`);
  return { promptId, variant, skill: { name: variant, src } };
}

function stripFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2];
  }
  return { meta, body: text.slice(m[0].length) };
}

// Returns the exact text sent to the agent. The skill line is the only
// difference between native and skill cells.
export function loadPrompt(promptId, skillLine) {
  const file = path.join(PROMPTS_DIR, `${promptId}.md`);
  if (!fs.existsSync(file)) die(`prompt not found: ${file}`);
  const raw = fs.readFileSync(file, 'utf8');
  const { meta, body } = stripFrontmatter(raw);
  let text = body.trim();
  if (skillLine) text += `\n\n${skillLine}`;
  return {
    id: promptId,
    file: path.relative(REPO_ROOT, file),
    version: meta.version ?? null,
    file_sha256: sha256(raw),
    text,
    text_sha256: sha256(text),
    skill_line: skillLine || null,
  };
}

function git(dir, args) {
  try {
    return execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

export function skillSourceMeta(skill) {
  // Written by scripts/fetch-skill.mjs next to the cached skill folder.
  const fetched = path.join(path.dirname(skill.src), 'source.json');
  if (fs.existsSync(fetched)) {
    const s = JSON.parse(fs.readFileSync(fetched, 'utf8'));
    const tree = treeSha256(skill.src);
    if (s.tree_sha256 && s.tree_sha256 !== tree) die(`cached skill ${skill.src} was modified after fetching; run fetch-skill --refresh`);
    return {
      name: skill.name,
      source_url: s.source_url,
      source_commit: s.source_commit,
      source_path: s.source_path,
      source_dirty: false,
      fetch: { method: s.method, cli: s.cli ?? null, upstream_repo: s.upstream_repo ?? null, upstream_commit_reference: s.upstream_commit_reference ?? null, fetched_at: s.fetched_at },
      license_spdx: s.license_spdx ?? null,
      tree_sha256: tree,
      installed_to: null,
    };
  }
  const top = git(skill.src, ['rev-parse', '--show-toplevel']);
  let url = null, commit = null, subpath = null, dirty = null;
  if (top) {
    url = git(skill.src, ['remote', 'get-url', 'origin']);
    commit = git(skill.src, ['rev-parse', 'HEAD']);
    subpath = path.relative(fs.realpathSync(top), fs.realpathSync(skill.src)) || '.';
    dirty = (git(skill.src, ['status', '--porcelain', '--', '.']) || '') !== '';
  }
  return {
    name: skill.name,
    source_url: process.env.SKILL_SOURCE_URL || url,
    source_commit: process.env.SKILL_SOURCE_COMMIT || commit,
    source_path: subpath,
    source_dirty: dirty,
    tree_sha256: treeSha256(skill.src),
    installed_to: null,
  };
}

export function copySkill(skill, destParent) {
  const dest = path.join(destParent, skill.name);
  fs.mkdirSync(destParent, { recursive: true });
  fs.cpSync(skill.src, dest, {
    recursive: true,
    dereference: true,
    filter: (p) => !p.split(path.sep).includes('.git'),
  });
  return dest;
}

// Fresh throwaway directory tree for one run, outside the repo.
export function makeRunDir(agent, promptId, variant) {
  fs.mkdirSync(TMP_ROOT, { recursive: true });
  const runDir = fs.realpathSync(fs.mkdtempSync(path.join(TMP_ROOT, `${agent}__${variant}__${promptId}__`)));
  if (runDir.startsWith(fs.realpathSync(REPO_ROOT) + path.sep)) die(`run dir must be outside the repo: ${runDir}`);
  const dirs = { runDir, work: path.join(runDir, 'work'), home: path.join(runDir, 'home'), tmp: path.join(runDir, 'tmp') };
  for (const d of [dirs.work, dirs.home, dirs.tmp]) fs.mkdirSync(d, { recursive: true });
  return dirs;
}

// Same minimal PATH for both agents: node, Homebrew, system.
export function isolatedPath(extraDirs = []) {
  const nodeDir = path.dirname(process.execPath);
  const dirs = [...extraDirs, nodeDir, '/opt/homebrew/bin', '/usr/local/bin', '/usr/bin', '/bin', '/usr/sbin', '/sbin'];
  return [...new Set(dirs)].filter((d) => fs.existsSync(d)).join(':');
}

// Environment built from scratch. Nothing from the operator's shell leaks in
// except USER/LOGNAME/LANG; HOME points at an empty throwaway directory.
export function baseEnv(dirs, extra) {
  return {
    HOME: dirs.home,
    USER: os.userInfo().username,
    LOGNAME: os.userInfo().username,
    PATH: isolatedPath(),
    LANG: 'en_US.UTF-8',
    TERM: 'dumb',
    TMPDIR: dirs.tmp + '/',
    ...extra,
  };
}

// Output dir for this cell. A previous attempt is moved to runs/<prompt>/_attempts/
// rather than deleted, so every attempt stays on record; the new run.json lists
// them in previous_attempts.
export function prepareOutDir(promptId, agent, variant) {
  const cell = `${agent}__${variant}`;
  const out = path.join(RUNS_DIR, promptId, cell);
  const attemptsDir = path.join(RUNS_DIR, promptId, '_attempts');
  if (fs.existsSync(out)) {
    let stamp = `unknown-${Date.now()}`;
    try {
      stamp = JSON.parse(fs.readFileSync(path.join(out, 'run.json'), 'utf8')).started_at.replace(/[:.]/g, '-');
    } catch {}
    fs.mkdirSync(attemptsDir, { recursive: true });
    const dest = path.join(attemptsDir, `${cell}__${stamp}`);
    fs.renameSync(out, dest);
    log(`previous attempt moved to ${path.relative(REPO_ROOT, dest)}`);
  }
  const previous = [];
  if (fs.existsSync(attemptsDir)) {
    for (const n of fs.readdirSync(attemptsDir).filter((x) => x.startsWith(`${cell}__`)).sort()) {
      let r = {};
      try { r = JSON.parse(fs.readFileSync(path.join(attemptsDir, n, 'run.json'), 'utf8')); } catch {}
      previous.push({
        attempt: r.attempt ?? null,
        started_at: r.started_at ?? null,
        success: r.success ?? null,
        failure_reasons: r.failure_reasons ?? null,
        skill_triggered: r.skill_triggered ?? null,
        archived_to: path.relative(path.join(RUNS_DIR, promptId), path.join(attemptsDir, n)),
      });
    }
  }
  fs.mkdirSync(out, { recursive: true });
  return { out, attempt: previous.length + 1, previous };
}

// Spawn with a timeout; stdout/stderr go straight to files.
export function runProcess({ cmd, args, env, cwd, stdoutFile, stderrFile, timeoutMin }) {
  const timeoutMs = (Number(timeoutMin || process.env.SG_TIMEOUT_MIN) || DEFAULT_TIMEOUT_MIN) * 60_000;
  return new Promise((resolve) => {
    const out = fs.openSync(stdoutFile, 'w');
    const err = fs.openSync(stderrFile, 'w');
    const started = Date.now();
    const child = spawn(cmd, args, { env, cwd, stdio: ['ignore', out, err], detached: true });
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      log(`timeout after ${timeoutMs / 60_000} min, killing`);
      try { process.kill(-child.pid, 'SIGTERM'); } catch {}
      setTimeout(() => { try { process.kill(-child.pid, 'SIGKILL'); } catch {} }, 10_000);
    }, timeoutMs);
    const onSigint = () => { try { process.kill(-child.pid, 'SIGTERM'); } catch {} };
    process.on('SIGINT', onSigint);
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      process.off('SIGINT', onSigint);
      fs.closeSync(out);
      fs.closeSync(err);
      resolve({ exitCode: code, signal, timedOut, durationMs: Date.now() - started });
    });
  });
}

export function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  const events = [];
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { events.push(JSON.parse(line)); } catch { events.push({ type: '_unparsed', raw: line.slice(0, 2000) }); }
  }
  return events;
}

// Replace machine-specific paths so committed files do not carry them.
export function makeSanitizer(dirs) {
  const pairs = [];
  const add = (from, to) => { if (from && !pairs.some(([f]) => f === from)) pairs.push([from, to]); };
  for (const d of [dirs.runDir, dirs.runDir.replace(/^\/private/, '')]) add(d, '$RUN');
  // Agents sometimes probe parent directories of the run dir (e.g. for AGENTS.md).
  const tmp = fs.realpathSync(os.tmpdir());
  for (const d of [tmp, tmp.replace(/^\/private/, '')]) {
    add(d, '$TMPDIR');
    add(path.dirname(d), '$TMPDIR/..');
  }
  add(os.homedir(), '~');
  pairs.sort((a, b) => b[0].length - a[0].length);
  const fix = (s) => {
    for (const [from, to] of pairs) s = s.split(from).join(to);
    return s;
  };
  const deep = (v) => {
    if (typeof v === 'string') return fix(v);
    if (Array.isArray(v)) return v.map(deep);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x)]));
    return v;
  };
  return { fix, deep };
}

// Output of commands and tools is dropped from committed transcripts: agents
// can read outside their work dir (e.g. `ls /tmp`), so the output may describe
// the operator's machine. Commands, tool inputs and messages are kept.
const OMIT_KEYS = new Set(['aggregated_output', 'tool_use_result']);
const omitted = (v) => `[output omitted: ${typeof v === 'string' ? v.length : JSON.stringify(v ?? '').length} chars]`;
export function redactToolOutput(v) {
  if (Array.isArray(v)) return v.map(redactToolOutput);
  if (!v || typeof v !== 'object') return v;
  if (v.type === 'tool_result' || v.type === 'custom_tool_call_output' || v.type === 'function_call_output') {
    const { content, output, ...rest } = v;
    return { ...rest, ...(content !== undefined && { content: omitted(content) }), ...(output !== undefined && { output: omitted(output) }) };
  }
  return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, OMIT_KEYS.has(k) && x != null && x !== '' ? omitted(x) : redactToolOutput(x)]));
}

// Trimmed, sanitized copy of an event stream. Long strings (file bodies) are
// cut; index.html is kept separately anyway.
export function writeTranscript(events, outFile, sanitizer, maxLen = 4000) {
  const trim = (v) => {
    if (typeof v === 'string') return v.length > maxLen ? `${v.slice(0, maxLen)}…[trimmed ${v.length - maxLen} chars]` : v;
    if (Array.isArray(v)) return v.map(trim);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, trim(x)]));
    return v;
  };
  const lines = events.map((e) => JSON.stringify(trim(sanitizer.deep(redactToolOutput(e)))));
  fs.writeFileSync(outFile, lines.join('\n') + '\n');
}

// Copy index.html (and note any other files the agent left in the work dir).
export function collectOutput(work, out, ignoreTop = []) {
  const src = path.join(work, 'index.html');
  const others = [];
  const walk = (d) => {
    for (const name of fs.readdirSync(d)) {
      const p = path.join(d, name);
      const rel = path.relative(work, p);
      if (ignoreTop.includes(rel.split(path.sep)[0])) continue;
      const st = fs.lstatSync(p);
      if (st.isDirectory()) walk(p);
      else if (rel !== 'index.html') others.push({ path: rel, bytes: st.size });
    }
  };
  walk(work);
  if (!fs.existsSync(src)) return { index_html: false, other_files: others };
  fs.copyFileSync(src, path.join(out, 'index.html'));
  const buf = fs.readFileSync(src);
  return { index_html: true, index_html_bytes: buf.length, index_html_sha256: sha256(buf), other_files: others, external_refs: scanExternalRefs(buf.toString('utf8')) };
}

// Static scan of index.html for references to other origins. Remote images
// break the prompt's rules; fonts and CDN scripts/styles are allowed.
// <a href> links and XML namespace URIs are not resources and are skipped.
export function scanExternalRefs(html) {
  const refs = [];
  const seen = new Set();
  const add = (url, context) => {
    url = url.trim().replace(/&amp;/g, '&');
    if (!/^(https?:)?\/\//i.test(url)) return;
    if (/^(https?:)?\/\/www\.w3\.org\//i.test(url)) return;
    const key = `${context}\0${url}`;
    if (seen.has(key)) return;
    seen.add(key);
    refs.push({ url, context, kind: classifyRef(url, context) });
  };
  const attr = (tag, name) => tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  const attrVal = (m) => (m ? m[2] ?? m[3] ?? m[4] : null);
  for (const m of html.matchAll(/<(link|script|img|source|video|audio|iframe|embed|object|image|use|input)\b[^>]*>/gi)) {
    const tag = m[0];
    const name = m[1].toLowerCase();
    for (const a of ['src', 'href', 'xlink:href', 'poster', 'data']) {
      const v = attrVal(attr(tag, a));
      if (!v) continue;
      if (name === 'link') add(v, `link[rel=${(attrVal(attr(tag, 'rel')) || '').toLowerCase()}]`);
      else add(v, `${name}[${a}]`);
    }
    const srcset = attrVal(attr(tag, 'srcset'));
    if (srcset) for (const part of srcset.split(',')) add(part.trim().split(/\s+/)[0], `${name}[srcset]`);
  }
  for (const m of html.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi)) add(m[2], 'css url()');
  for (const m of html.matchAll(/@import\s+(?:url\()?\s*['"]([^'"]+)['"]/gi)) add(m[1], 'css @import');
  // Anything else that looks like a URL inside scripts/styles (e.g. dynamic imports, fetch).
  const known = new Set(refs.map((r) => r.url));
  const stripped = html.replace(/<a\b[^>]*>/gi, '').replace(/xmlns(:\w+)?="[^"]*"/gi, '');
  for (const m of stripped.matchAll(/(?:https?:)?\/\/[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s"'`<>()\\]*)?/gi)) {
    if (!known.has(m[0]) && !/^\/\/[^/]*$/.test(m[0]) && /^https?:/i.test(m[0])) add(m[0], 'other');
  }
  const hosts = [...new Set(refs.map((r) => { try { return new URL(r.url, 'https://x').host; } catch { return null; } }).filter(Boolean))].sort();
  const counts = {};
  for (const r of refs) counts[r.kind] = (counts[r.kind] || 0) + 1;
  const remoteImages = refs.filter((r) => r.kind === 'image');
  return { count: refs.length, counts, hosts, refs, remote_images: remoteImages.map((r) => r.url), violations: remoteImages.length ? ['remote_image'] : [] };
}

function classifyRef(url, context) {
  const u = url.toLowerCase();
  const p = u.split(/[?#]/)[0];
  if (/fonts\.(googleapis|gstatic)\.com|use\.typekit|fonts\.bunny\.net|rsms\.me\/inter/.test(u) || /\.(woff2?|ttf|otf|eot)$/.test(p)) return 'font';
  if (/^(img|image|source|video|input)\[|\[poster\]|\[srcset\]/.test(context) || /\.(png|jpe?g|gif|webp|avif|svg|ico|bmp)$/.test(p) || /images\.unsplash|picsum\.photos|placehold|via\.placeholder|pravatar|randomuser\.me\/api\/portraits/.test(u)) {
    if (context.startsWith('link[rel=') && !/icon/.test(context) && !/\.(png|jpe?g|gif|webp|avif|svg|ico)$/.test(p)) return 'other';
    return 'image';
  }
  if (context.startsWith('script')) return 'script';
  if (context === 'link[rel=stylesheet]' || context === 'css @import' || /\.css$/.test(p)) return 'stylesheet';
  if (/link\[rel=(preconnect|dns-prefetch|preload|modulepreload)\]/.test(context)) return 'preconnect';
  if (/\.m?js$/.test(p)) return 'script';
  return 'other';
}

export function hostInfo() {
  return { os: `${os.type()} ${os.release()}`, arch: os.arch(), node: process.version };
}

export function shellQuote(args) {
  return args.map((a) => (/^[A-Za-z0-9_@%+=:,./-]+$/.test(a) ? a : `'${a.replace(/'/g, `'\\''`)}'`)).join(' ');
}

export function writeRunJson(out, record) {
  fs.writeFileSync(path.join(out, 'run.json'), JSON.stringify(record, null, 2) + '\n');
}

export function cleanup(dirs) {
  if (process.env.SG_KEEP_TMP === '1') {
    log(`kept throwaway dir: ${dirs.runDir}`);
    return;
  }
  fs.rmSync(dirs.runDir, { recursive: true, force: true });
}
