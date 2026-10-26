#!/usr/bin/env node
// Run one Claude Code cell in an isolated throwaway environment.
//
//   node scripts/run-claude.mjs <prompt-id> native
//   node scripts/run-claude.mjs <prompt-id> <skill-name> <skill-source-dir>
//
// Isolation: env built from scratch, empty throwaway HOME, empty throwaway
// CLAUDE_CONFIG_DIR (so no user settings, plugins, skills, CLAUDE.md or
// memory), --setting-sources project, --strict-mcp-config with no servers,
// auto-memory off, and a fresh working directory. A skill is copied only into
// the working directory's project-level location (.claude/skills/<name>/).
//
// Auth: CLAUDE_CODE_OAUTH_TOKEN or ANTHROPIC_API_KEY from the environment, or
// the token file written by scripts/setup-claude-auth.sh.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  CONFIG_DIR, REPO_ROOT, SCHEMA_VERSION, baseEnv, cleanup, collectOutput, copySkill, die, hostInfo,
  loadPrompt, log, makeRunDir, makeSanitizer, parseCellArgs, prepareOutDir, readJsonl, runProcess,
  shellQuote, skillSourceMeta, writeRunJson, writeTranscript, realKeychainState, createThrowawayKeychain,
  deleteThrowawayKeychain, listTree, startEvidenceWatch,
} from './lib/common.mjs';
import { resolveSkill } from './lib/skills.mjs';

const AGENT = 'claude';
// Fixed for every Claude cell.
const MODEL = 'claude-opus-5-5';
const EFFORT = 'high';
const PERMISSION_MODE = 'bypassPermissions';

// Pinned so every cell runs the same CLI, including the native baselines that
// later batches reuse. The desktop app updates itself and adds new version
// folders, so the newest copy is never picked automatically.
const CLAUDE_VERSION = process.env.SG_CLAUDE_VERSION || '2.1.308';

function claudeVersionOf(bin) {
  const probe = path.join(os.tmpdir(), 'skill-gallery-version-probe');
  try {
    return execFileSync(bin, ['--version'], { encoding: 'utf8', env: { PATH: '/usr/bin:/bin', HOME: probe, CLAUDE_CONFIG_DIR: probe } }).trim().split(/\s/)[0];
  } catch {
    return null;
  }
}

function findClaude() {
  const candidates = [];
  if (process.env.CLAUDE_BIN) candidates.push(process.env.CLAUDE_BIN);
  else {
    // The copy bundled with the Claude desktop app (macOS), at the pinned version.
    const dir = path.join(os.homedir(), 'Library/Application Support/Claude/claude-code', CLAUDE_VERSION);
    if (fs.existsSync(dir)) {
      for (const build of fs.readdirSync(dir)) candidates.push(path.join(dir, build, 'claude.app/Contents/MacOS/claude'));
    }
    try {
      candidates.push(execFileSync('/bin/sh', ['-c', 'command -v claude'], { encoding: 'utf8' }).trim());
    } catch {}
  }
  for (const bin of candidates) {
    if (bin && fs.existsSync(bin) && claudeVersionOf(bin) === CLAUDE_VERSION) return bin;
  }
  die(`Claude Code ${CLAUDE_VERSION} not found (checked: ${candidates.join(', ') || 'nothing'}). Set CLAUDE_BIN to that version, or SG_CLAUDE_VERSION to run another one.`);
}

function authEnv() {
  if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return [{ CLAUDE_CODE_OAUTH_TOKEN: process.env.CLAUDE_CODE_OAUTH_TOKEN }, 'oauth_token_env'];
  if (process.env.ANTHROPIC_API_KEY) return [{ ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY }, 'api_key_env'];
  const file = path.join(CONFIG_DIR, 'claude-oauth-token');
  if (fs.existsSync(file)) {
    const token = fs.readFileSync(file, 'utf8').trim();
    if (token) return [{ CLAUDE_CODE_OAUTH_TOKEN: token }, 'oauth_token_file'];
  }
  die(`no Claude credentials. Run scripts/setup-claude-auth.sh (writes ${file}) or export ANTHROPIC_API_KEY.`);
}

function contentBlocks(e) {
  const c = e.message?.content;
  return Array.isArray(c) ? c : typeof c === 'string' ? [{ type: 'text', text: c }] : [];
}

function analyzeStream(events, skillName) {
  const init = events.find((e) => e.type === 'system' && e.subtype === 'init') || null;
  const result = [...events].reverse().find((e) => e.type === 'result') || null;
  const toolUses = new Map();
  const skillCalls = [];
  const mdReads = [];
  const skillLoads = [];
  const toolCounts = {};
  for (const e of events) {
    for (const b of contentBlocks(e)) {
      if (e.type === 'assistant' && b.type === 'tool_use') {
        toolUses.set(b.id, b);
        toolCounts[b.name] = (toolCounts[b.name] || 0) + 1;
        const input = b.input || {};
        if (b.name === 'Skill') skillCalls.push({ id: b.id, skill: input.skill ?? input.command ?? input.name ?? null, ok: null });
        const target = input.file_path || input.path || input.command || '';
        if (skillName && typeof target === 'string' && target.includes(`${skillName}/SKILL.md`)) mdReads.push({ tool: b.name, input: target.slice(0, 300) });
      }
      if (e.type === 'user' && b.type === 'tool_result') {
        const call = skillCalls.find((s) => s.id === b.tool_use_id);
        if (call) {
          call.ok = !b.is_error;
          const text = Array.isArray(b.content) ? b.content.map((x) => x.text || '').join('\n') : String(b.content ?? '');
          call.result = text.slice(0, 300);
        }
      }
      if (e.type === 'user' && b.type === 'text' && skillName) {
        const m = b.text.match(/Base directory for this skill:\s*(\S+)/);
        if (m && m[1].includes(`/skills/${skillName}`)) skillLoads.push({ base_dir: m[1], chars: b.text.length });
      }
    }
  }
  const rateLimits = events.filter((e) => e.type === 'rate_limit_event').map((e) => e.rate_limit_info || {});
  return { init, result, skillCalls, mdReads, skillLoads, toolCounts, rateLimits };
}

async function main() {
  const cell = parseCellArgs(process.argv.slice(2), AGENT);
  if (cell.skill && !cell.skill.src) cell.skill.src = resolveSkill(cell.skill.name, AGENT);
  const claudeBin = findClaude();
  const [authVars, authMethod] = authEnv();

  const skillLine = cell.skill ? `Use the ${cell.skill.name} skill.` : null;
  const prompt = loadPrompt(cell.promptId, skillLine);
  const dirs = makeRunDir(AGENT, cell.promptId, cell.variant);
  const keychainBefore = realKeychainState();
  const keychain = createThrowawayKeychain(dirs);
  const configDir = path.join(dirs.runDir, 'claude-config');
  fs.mkdirSync(configDir);

  let skillMeta = null;
  if (cell.skill) {
    skillMeta = skillSourceMeta(cell.skill);
    copySkill(cell.skill, path.join(dirs.work, '.claude', 'skills'));
    skillMeta.installed_to = `.claude/skills/${cell.skill.name}`;
  }
  fs.writeFileSync(path.join(dirs.runDir, 'prompt.txt'), prompt.text);
  const before = { config_dir: fs.readdirSync(configDir), home: listTree(dirs.home) };

  const mcpConfig = '{"mcpServers":{}}';
  const args = [
    '-p', prompt.text,
    '--model', MODEL,
    '--effort', EFFORT,
    '--output-format', 'stream-json', '--verbose',
    '--setting-sources', 'project',
    '--strict-mcp-config', '--mcp-config', mcpConfig,
    '--permission-mode', PERMISSION_MODE,
    '--no-session-persistence',
  ];
  const isolationEnv = {
    CLAUDE_CONFIG_DIR: configDir,
    CLAUDE_CODE_DISABLE_AUTO_MEMORY: '1',
    DISABLE_AUTOUPDATER: '1',
  };
  const env = baseEnv(dirs, { ...isolationEnv, ...authVars });
  const san = makeSanitizer(dirs);
  const cmdForRecord = shellQuote([claudeBin, '-p']) + ' "$(cat prompt.txt)" ' + shellQuote(args.slice(2));
  const versionEnv = baseEnv(dirs, { ...isolationEnv, CLAUDE_CONFIG_DIR: path.join(dirs.tmp, 'version-probe') });
  const cliVersion = execFileSync(claudeBin, ['--version'], { encoding: 'utf8', env: versionEnv }).trim();

  const { out, attempt, previous } = prepareOutDir(cell.promptId, AGENT, cell.variant);
  const startedAt = new Date().toISOString();
  log(`claude ${cell.promptId} ${cell.variant}: running in ${dirs.runDir}`);
  const eventsFile = path.join(dirs.runDir, 'events.jsonl');
  const stderrFile = path.join(dirs.runDir, 'stderr.log');
  const stopEvidenceWatch = startEvidenceWatch(dirs.work, path.join(dirs.runDir, 'evidence-snapshots'));
  const proc = await runProcess({ cmd: claudeBin, args, env, cwd: dirs.work, stdoutFile: eventsFile, stderrFile });
  stopEvidenceWatch();
  const finishedAt = new Date().toISOString();
  log(`claude exited ${proc.exitCode} after ${Math.round(proc.durationMs / 1000)}s`);

  const events = readJsonl(eventsFile);
  const a = analyzeStream(events, cell.skill?.name);
  const init = a.init || {};
  const output = collectOutput(dirs.work, out, { ignoreTop: ['.claude'], sanitize: san.fix, snapshotDir: path.join(dirs.runDir, 'evidence-snapshots') });
  writeTranscript(events, path.join(out, 'transcript.jsonl'), san);

  const plugins = init.plugins || [];
  const skills = init.skills || [];
  const checks = {
    init_event_present: Boolean(a.init),
    only_builtin_plugins: plugins.every((p) => p.path === 'builtin' || /@builtin$/.test(p.source || '')),
    no_synced_plugins: plugins.every((p) => !/@synced\b/.test(p.source || '') && p.path !== 'synced'),
    no_mcp_servers: (init.mcp_servers || []).length === 0,
    no_plugin_skills: skills.every((s) => !s.includes(':')),
    config_dir_was_empty: before.config_dir.length === 0,
    home_had_only_throwaway_keychain: before.home.every((f) => f.startsWith('Library/Keychains/')),
    real_keychain_unchanged: JSON.stringify(realKeychainState()) === JSON.stringify(keychainBefore),
    auto_memory_disabled: env.CLAUDE_CODE_DISABLE_AUTO_MEMORY === '1',
  };
  if (cell.skill) checks.skill_listed = skills.includes(cell.skill.name);
  const isolationOk = Object.values(checks).every(Boolean);

  const ownCalls = cell.skill ? a.skillCalls.filter((c) => c.skill === cell.skill.name || c.skill?.endsWith(`:${cell.skill.name}`)) : [];
  const otherCalls = a.skillCalls.filter((c) => !ownCalls.includes(c));
  // Triggered = the Skill tool ran successfully for this skill (which loads its
  // SKILL.md), or the agent read the SKILL.md file directly.
  const skillTriggered = cell.skill ? ownCalls.some((c) => c.ok === true) || a.mdReads.length > 0 : null;

  const r = a.result || {};
  const failures = [];
  if (proc.timedOut) failures.push('timeout');
  if (proc.exitCode !== 0) failures.push(`exit_code_${proc.exitCode}`);
  if (!a.result) failures.push('no_result_event');
  else if (r.is_error) failures.push(`result_error: ${String(r.result || r.subtype).slice(0, 200)}`);
  if (!output.index_html) failures.push('no_index_html');
  if (output.missing_local_refs?.length) failures.push('broken_local_ref');
  if (!isolationOk) failures.push('isolation_check_failed');
  if (cell.skill && !skillTriggered) failures.push('skill_not_triggered');

  const record = {
    schema_version: SCHEMA_VERSION,
    agent: AGENT,
    cli: { name: 'claude-code', version: init.claude_code_version || cliVersion.replace(/\s*\(Claude Code\)$/, ''), path: san.fix(claudeBin) },
    model: MODEL,
    effort: EFFORT,
    prompt: { id: prompt.id, file: prompt.file, version: prompt.version, file_sha256: prompt.file_sha256, text_sha256: prompt.text_sha256, skill_line: prompt.skill_line },
    variant: cell.variant,
    skill: skillMeta,
    attempt,
    previous_attempts: previous,
    started_at: startedAt,
    finished_at: finishedAt,
    duration_ms: proc.durationMs,
    exit_code: proc.exitCode,
    timed_out: proc.timedOut,
    timeout_min: proc.timeoutMin,
    usage: r.usage ? {
      input_tokens: r.usage.input_tokens ?? null,
      cache_creation_input_tokens: r.usage.cache_creation_input_tokens ?? null,
      cache_read_input_tokens: r.usage.cache_read_input_tokens ?? null,
      output_tokens: r.usage.output_tokens ?? null,
      total_cost_usd: r.total_cost_usd ?? null,
      num_turns: r.num_turns ?? null,
      model_usage: r.modelUsage ?? null,
    } : null,
    activity: a.toolCounts,
    rate_limits: {
      events: a.rateLimits.length,
      not_allowed: a.rateLimits.filter((x) => x.status && x.status !== 'allowed').map((x) => ({ status: x.status, type: x.rateLimitType ?? null })),
      last: a.rateLimits.length ? (({ status, rateLimitType, unifiedWindows }) => ({ status, rateLimitType, unifiedWindows }))(a.rateLimits.at(-1)) : null,
    },
    success: failures.length === 0,
    failure_reasons: failures,
    skill_triggered: skillTriggered,
    skill_evidence: cell.skill ? {
      skill_tool_calls: ownCalls.map(({ id, ...rest }) => rest),
      skill_content_loaded: a.skillLoads.map((x) => ({ ...x, base_dir: san.fix(x.base_dir) })),
      skill_md_reads: a.mdReads.map((x) => ({ ...x, input: san.fix(x.input) })),
    } : null,
    builtin_skills_used: otherCalls.map(({ id, ...rest }) => rest),
    isolation: {
      ok: isolationOk,
      checks,
      method: [
        'env built from scratch (env -i equivalent); HOME is an empty throwaway directory',
        'CLAUDE_CONFIG_DIR is an empty throwaway directory (no user settings, plugins, skills, CLAUDE.md, memory)',
        'macOS: the throwaway HOME has its own new, unlocked login keychain, so programs the agent starts (e.g. Chrome) do not show keychain dialogs; the real keychain settings are compared before and after',
        '--setting-sources project; --strict-mcp-config with an empty server list; CLAUDE_CODE_DISABLE_AUTO_MEMORY=1',
        'working directory is a fresh throwaway directory outside any git repo',
      ],
      auth_method: authMethod,
      command: san.fix(cmdForRecord),
      cwd: '$RUN/work',
      env: san.deep({ ...env, USER: '$USER', LOGNAME: '$USER', ...Object.fromEntries(Object.keys(authVars).map((k) => [k, '<redacted>'])) }),
      before_run: before,
      observed: san.deep({
        tools: init.tools ?? null,
        mcp_servers: init.mcp_servers ?? null,
        skills: init.skills ?? null,
        plugins: init.plugins ?? null,
        agents: init.agents ?? null,
        slash_commands: init.slash_commands ?? null,
        model: init.model ?? null,
        permission_mode: init.permissionMode ?? null,
        api_key_source: init.apiKeySource ?? null,
        output_style: init.output_style ?? null,
        cwd: init.cwd ?? null,
      }),
    },
    output: (({ external_refs, ...rest }) => rest)(output),
    external_refs: output.external_refs ?? null,
    rule_violations: [
      ...(output.external_refs?.violations ?? []),
      ...(output.kept_assets?.length ? ['extra_files'] : []),
      ...(output.assets_over_cap?.length ? ['assets_over_cap'] : []),
    ],
    host: hostInfo(),
    stderr_tail: san.fix(fs.readFileSync(stderrFile, 'utf8').split('\n').filter((l) => l.trim()).slice(-15).join('\n')),
    screenshots: null,
  };
  writeRunJson(out, record);
  deleteThrowawayKeychain(dirs, keychain);
  cleanup(dirs);
  log(`${record.success ? 'OK' : 'FAILED'} -> ${path.relative(REPO_ROOT, out)}${failures.length ? ` (${failures.join('; ')})` : ''}`);
  process.exit(record.success ? 0 : 1);
}

main();
