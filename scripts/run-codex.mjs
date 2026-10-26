#!/usr/bin/env node
// Run one Codex cell in an isolated throwaway environment.
//
//   node scripts/run-codex.mjs <prompt-id> native
//   node scripts/run-codex.mjs <prompt-id> <skill-name> <skill-source-dir>
//
// Isolation: env built from scratch, empty throwaway HOME, throwaway
// CODEX_HOME holding only a symlink to the operator's auth.json plus a minimal
// config.toml, and a fresh working directory. A skill is copied only into the
// working directory's project-level location (.agents/skills/<name>/).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  REPO_ROOT, SCHEMA_VERSION, baseEnv, cleanup, collectOutput, copySkill, die, hostInfo, loadPrompt,
  log, makeRunDir, makeSanitizer, parseCellArgs, prepareOutDir, readJsonl, runProcess, shellQuote,
  skillSourceMeta, writeRunJson, writeTranscript, realKeychainState, createThrowawayKeychain,
  deleteThrowawayKeychain, listTree, startEvidenceWatch,
} from './lib/common.mjs';
import { resolveSkill } from './lib/skills.mjs';

const AGENT = 'codex';
// Fixed for every Codex cell. Passed explicitly because the operator's own
// default model may differ.
const MODEL = 'gpt-6.1-sol';
const EFFORT = 'high';
const SANDBOX = 'workspace-write';

// Features that would pull in account-level or operator-level state
// (ChatGPT apps/connectors, remote plugins, memories, plugin suggestions).
const DISABLED_FEATURES = ['apps', 'remote_plugin', 'plugins', 'memories', 'tool_suggest'];

const SOURCE_CODEX_HOME = process.env.SG_CODEX_AUTH_HOME || path.join(os.homedir(), '.codex');

// Pinned so every cell runs the same CLI (see run-claude.mjs).
const CODEX_VERSION = process.env.SG_CODEX_VERSION || '0.164.0';

function findCodex() {
  let bin = process.env.CODEX_BIN;
  if (!bin) {
    try {
      bin = execFileSync('/bin/sh', ['-c', 'command -v codex'], { encoding: 'utf8' }).trim();
    } catch {
      die(`codex not found. Install it with: npm install -g @openai/codex@${CODEX_VERSION}`);
    }
  }
  const version = execFileSync(bin, ['--version'], { encoding: 'utf8' }).trim().replace(/^codex-cli\s*/, '');
  if (version !== CODEX_VERSION) die(`codex ${version} found at ${bin}, expected ${CODEX_VERSION}. Install it with npm install -g @openai/codex@${CODEX_VERSION}, or set SG_CODEX_VERSION.`);
  return bin;
}

function minimalConfig() {
  return [
    '# Written by skill-gallery scripts/run-codex.mjs for one isolated run.',
    `model = "${MODEL}"`,
    `model_reasoning_effort = "${EFFORT}"`,
    'cli_auth_credentials_store = "file"',
    'approval_policy = "never"',
    `sandbox_mode = "${SANDBOX}"`,
    'check_for_update_on_startup = false',
    '',
    '[features]',
    ...DISABLED_FEATURES.map((f) => `${f} = false`),
    '',
  ].join('\n');
}

function messageText(payload) {
  return (payload.content || []).map((c) => (typeof c?.text === 'string' ? c.text : '')).join('\n');
}

// Pull isolation and skill evidence out of the rollout Codex writes to
// $CODEX_HOME/sessions. The rollout itself is not committed (it carries
// account ids); only these derived facts are.
function analyzeRollout(rolloutFiles, skillName) {
  const ev = {
    rollout_files: rolloutFiles.length,
    tools: [],
    skills_listed: [],
    skill_roots: [],
    agents_md: null,
    plugins_instructions: null,
    apps_instructions: null,
    managed_developer_instructions: null,
    developer_sections: [],
    mcp_tools: [],
  };
  const skill = { injected: [], md_reads: [] };
  const toolNames = (tools, prefix = '') => tools.flatMap((t) =>
    t.type === 'namespace' ? toolNames(t.tools || [], `${prefix}${t.name}.`) : [`${prefix}${t.name || t.type}`]);
  for (const file of rolloutFiles) {
    for (const e of readJsonl(file)) {
      const p = e.payload || {};
      if (e.type === 'world_state' && p.state) {
        const st = p.state;
        ev.agents_md = st.agents_md ?? null;
        ev.plugins_instructions = st.plugins_instructions ?? null;
        ev.apps_instructions = st.apps_instructions ?? null;
        ev.managed_developer_instructions = st.managed_developer_instructions ?? null;
        const body = st.host_skills?.body || '';
        ev.skill_roots = [...body.matchAll(/^- `(r\d+)` = `([^`]+)`/gm)].map((m) => ({ id: m[1], path: m[2] }));
        ev.skills_listed = [...body.matchAll(/^- ([A-Za-z0-9._:-]+): .*\(file: ([^)]+)\)\s*$/gm)].map((m) => ({ name: m[1], file: m[2] }));
      }
      if (e.type === 'response_item' && p.type === 'additional_tools') {
        ev.tools = [...new Set([...ev.tools, ...toolNames(p.tools || [])])];
      }
      if (e.type === 'response_item' && p.type === 'message') {
        const text = messageText(p);
        if (p.role === 'developer') {
          for (const m of text.matchAll(/^<([a-z_]+)[ >]/gm)) ev.developer_sections.push(m[1]);
        }
        if (skillName && p.role !== 'assistant') {
          const blocks = [...text.matchAll(/<skill>([\s\S]*?)<\/skill>/g)].map((m) => m[1]);
          for (const b of blocks) {
            const name = b.match(/<name>([^<]+)<\/name>/)?.[1]?.trim();
            const p2 = b.match(/<path>([^<]+)<\/path>/)?.[1]?.trim();
            if (name === skillName) skill.injected.push({ role: p.role, name, path: p2 || null, chars: b.length });
          }
        }
      }
      if (skillName && e.type === 'response_item' && /call$/.test(p.type || '')) {
        const input = typeof p.input === 'string' ? p.input : JSON.stringify(p.arguments ?? p.input ?? '');
        if (input.includes(`${skillName}/SKILL.md`)) skill.md_reads.push({ tool: p.name || p.type, input: input.slice(0, 300) });
      }
    }
  }
  ev.developer_sections = [...new Set(ev.developer_sections)];
  ev.mcp_tools = ev.tools.filter((t) => /mcp__/.test(t));
  return { ev, skill };
}

function findRollouts(codexHome) {
  const dir = path.join(codexHome, 'sessions');
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const walk = (d) => {
    for (const n of fs.readdirSync(d)) {
      const p = path.join(d, n);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (/^rollout-.*\.jsonl$/.test(n)) out.push(p);
    }
  };
  walk(dir);
  return out.sort();
}

// The auth.json in the throwaway CODEX_HOME is a symlink so token refreshes
// land in the operator's real file. If Codex ever replaced the link with a
// copy, put the newer tokens back so the operator's login keeps working.
function releaseAuth(codexHome) {
  const link = path.join(codexHome, 'auth.json');
  let st;
  try { st = fs.lstatSync(link); } catch { return 'missing'; }
  if (st.isSymbolicLink()) { fs.unlinkSync(link); return 'symlink_intact'; }
  const real = path.join(SOURCE_CODEX_HOME, 'auth.json');
  const copy = fs.readFileSync(link);
  if (!copy.equals(fs.readFileSync(real))) {
    fs.copyFileSync(real, `${real}.skill-gallery-backup`);
    fs.writeFileSync(real, copy, { mode: 0o600 });
    log(`auth.json was replaced during the run; copied refreshed tokens back to ${real} (backup kept)`);
  }
  fs.unlinkSync(link);
  return 'replaced_and_restored';
}

async function main() {
  const cell = parseCellArgs(process.argv.slice(2), AGENT);
  if (cell.skill && !cell.skill.src) cell.skill.src = resolveSkill(cell.skill.name, AGENT);
  const codexBin = findCodex();
  const cliVersion = execFileSync(codexBin, ['--version'], { encoding: 'utf8' }).trim();
  const authSrc = path.join(SOURCE_CODEX_HOME, 'auth.json');
  if (!fs.existsSync(authSrc)) die(`no Codex login at ${authSrc}; run \`codex login\` first`);

  const skillLine = cell.skill ? `Use the $${cell.skill.name} skill.` : null;
  const prompt = loadPrompt(cell.promptId, skillLine);
  const dirs = makeRunDir(AGENT, cell.promptId, cell.variant);
  const keychainBefore = realKeychainState();
  const keychain = createThrowawayKeychain(dirs);
  const codexHome = path.join(dirs.runDir, 'codex-home');
  fs.mkdirSync(codexHome);
  fs.symlinkSync(authSrc, path.join(codexHome, 'auth.json'));
  const configToml = minimalConfig();
  fs.writeFileSync(path.join(codexHome, 'config.toml'), configToml);
  const preRunCodexHome = fs.readdirSync(codexHome).sort();

  let skillMeta = null;
  if (cell.skill) {
    skillMeta = skillSourceMeta(cell.skill);
    copySkill(cell.skill, path.join(dirs.work, '.agents', 'skills'));
    skillMeta.installed_to = `.agents/skills/${cell.skill.name}`;
  }
  fs.writeFileSync(path.join(dirs.runDir, 'prompt.txt'), prompt.text);

  const lastMsg = path.join(dirs.runDir, 'last-message.txt');
  const args = [
    'exec', '--json', '--skip-git-repo-check', '--strict-config',
    '-m', MODEL, '-c', `model_reasoning_effort="${EFFORT}"`,
    '-s', SANDBOX, '-C', dirs.work, '-o', lastMsg,
    prompt.text,
  ];
  const env = baseEnv(dirs, { CODEX_HOME: codexHome });
  const san = makeSanitizer(dirs);
  const cmdForRecord = shellQuote([codexBin, ...args.slice(0, -1)]) + ' "$(cat prompt.txt)"';

  const { out, attempt, previous } = prepareOutDir(cell.promptId, AGENT, cell.variant);
  const startedAt = new Date().toISOString();
  log(`codex ${cell.promptId} ${cell.variant}: running in ${dirs.runDir}`);
  const eventsFile = path.join(dirs.runDir, 'events.jsonl');
  const stderrFile = path.join(dirs.runDir, 'stderr.log');
  const stopEvidenceWatch = startEvidenceWatch(dirs.work, path.join(dirs.runDir, 'evidence-snapshots'));
  const proc = await runProcess({ cmd: codexBin, args, env, cwd: dirs.work, stdoutFile: eventsFile, stderrFile });
  stopEvidenceWatch();
  const finishedAt = new Date().toISOString();
  log(`codex exited ${proc.exitCode} after ${Math.round(proc.durationMs / 1000)}s`);

  const authState = releaseAuth(codexHome);
  const events = readJsonl(eventsFile);
  const { ev, skill } = analyzeRollout(findRollouts(codexHome), cell.skill?.name);

  // Skill evidence from the public event stream as well (commands that read SKILL.md).
  if (cell.skill) {
    for (const e of events) {
      const cmd = e.item?.type === 'command_execution' ? e.item.command : null;
      if (cmd && cmd.includes(`${cell.skill.name}/SKILL.md`) && e.type === 'item.completed') {
        skill.md_reads.push({ tool: 'command_execution', input: san.fix(cmd).slice(0, 300) });
      }
    }
  }

  const usage = { input_tokens: 0, cached_input_tokens: 0, output_tokens: 0, reasoning_output_tokens: 0 };
  let turnFailed = null;
  const itemCounts = {};
  for (const e of events) {
    if (e.type === 'turn.completed' && e.usage) for (const k of Object.keys(usage)) usage[k] += e.usage[k] || 0;
    if (e.type === 'turn.failed' || e.type === 'error') turnFailed = e.error?.message || e.message || JSON.stringify(e).slice(0, 500);
    if (e.type === 'item.completed' && e.item?.type) itemCounts[e.item.type] = (itemCounts[e.item.type] || 0) + 1;
  }

  const output = collectOutput(dirs.work, out, { ignoreTop: ['.agents'], sanitize: san.fix, snapshotDir: path.join(dirs.runDir, 'evidence-snapshots') });
  writeTranscript(events, path.join(out, 'transcript.jsonl'), san);

  const systemSkills = ev.skills_listed.filter((s) => ev.skill_roots.find((r) => s.file.startsWith(`${r.id}/`))?.path.endsWith('/skills/.system'));
  const otherSkills = ev.skills_listed.filter((s) => !systemSkills.includes(s));
  const allowedOther = cell.skill ? [cell.skill.name] : [];
  const checks = {
    no_agents_md: ev.agents_md !== null && Object.keys(ev.agents_md).length === 0,
    no_plugins: ev.plugins_instructions === false,
    no_apps: ev.apps_instructions === false,
    no_mcp_tools: ev.mcp_tools.length === 0,
    no_managed_instructions: ev.managed_developer_instructions !== null && Object.keys(ev.managed_developer_instructions).length === 0,
    only_expected_skills: otherSkills.every((s) => allowedOther.includes(s.name)),
    no_memory_sections: !ev.developer_sections.some((s) => /memor/i.test(s)),
    codex_home_was_minimal: preRunCodexHome.join(',') === 'auth.json,config.toml',
    real_keychain_unchanged: JSON.stringify(realKeychainState()) === JSON.stringify(keychainBefore),
  };
  const isolationOk = Object.values(checks).every(Boolean);

  const skillTriggered = cell.skill ? skill.injected.length > 0 || skill.md_reads.length > 0 : null;
  const failures = [];
  if (proc.timedOut) failures.push('timeout');
  if (proc.exitCode !== 0) failures.push(`exit_code_${proc.exitCode}`);
  if (turnFailed) failures.push(`turn_failed: ${turnFailed}`);
  if (!output.index_html) failures.push('no_index_html');
  if (output.missing_local_refs?.length) failures.push('broken_local_ref');
  if (!isolationOk) failures.push('isolation_check_failed');
  if (cell.skill && cell.skill.name && !ev.skills_listed.some((s) => s.name === cell.skill.name)) failures.push('skill_not_listed');
  if (cell.skill && !skillTriggered) failures.push('skill_not_triggered');

  const record = {
    schema_version: SCHEMA_VERSION,
    agent: AGENT,
    cli: { name: 'codex-cli', version: cliVersion.replace(/^codex-cli\s*/, ''), path: san.fix(codexBin) },
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
    usage: { ...usage, total_cost_usd: null },
    activity: itemCounts,
    success: failures.length === 0,
    failure_reasons: failures,
    skill_triggered: skillTriggered,
    skill_evidence: cell.skill ? { injected: skill.injected.map((x) => ({ ...x, path: x.path && san.fix(x.path) })), skill_md_reads: skill.md_reads.map((x) => ({ ...x, input: san.fix(x.input) })) } : null,
    builtin_skills_used: null,
    isolation: {
      ok: isolationOk,
      checks,
      method: [
        'env built from scratch (env -i equivalent); HOME is an empty throwaway directory',
        'CODEX_HOME is a throwaway directory containing only auth.json (symlink to the operator login) and the config.toml below',
        `features disabled: ${DISABLED_FEATURES.join(', ')}`,
        'macOS: the throwaway HOME has its own new, unlocked login keychain, so programs the agent starts (e.g. Chrome) do not show keychain dialogs; the real keychain settings are compared before and after',
        'working directory is a fresh throwaway directory outside any git repo',
      ],
      command: san.fix(cmdForRecord),
      cwd: '$RUN/work',
      env: san.deep({ ...env, USER: '$USER', LOGNAME: '$USER' }),
      config_toml: configToml,
      codex_home_before_run: preRunCodexHome,
      auth_link_after_run: authState,
      observed: san.deep({
        tools: ev.tools,
        mcp_tools: ev.mcp_tools,
        skills_listed: ev.skills_listed,
        skill_roots: ev.skill_roots,
        system_skills: systemSkills.map((s) => s.name),
        agents_md: ev.agents_md,
        plugins_instructions: ev.plugins_instructions,
        apps_instructions: ev.apps_instructions,
        developer_sections: ev.developer_sections,
        rollout_files: ev.rollout_files,
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
