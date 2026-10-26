#!/usr/bin/env node
// Fills the generated blocks in every README from runs/ and skills/*/meta.yaml.
//
//   node scripts/build-readme.mjs               # tables, thumbnails and images
//   node scripts/build-readme.mjs --no-images   # skip the two Playwright images
//   node scripts/build-readme.mjs --lang en,ja  # only these READMEs
//
// Each README (README.md and README.<lang>.md, one per language in
// scripts/build-readme.strings.json) has three blocks, filled in its own language:
//
//   <!-- status:start -->  … <!-- status:end -->    one status line: cells run, failures, dates
//   <!-- results:start --> … <!-- results:end -->   thumbnail grid, linked to the gallery
//   <!-- skills:start -->  … <!-- skills:end -->    install and invoke, per agent
//   <!-- credits:start --> … <!-- credits:end -->   source, license, pinned commit
//
// Text outside the blocks is left alone. Thumbnails go to docs/launch/assets/. The gallery
// itself is English only, so every README links to the same pages (SG_GALLERY_URL overrides).
// With Playwright installed (a dev dependency of the repo), the script also renders
// docs/launch/overview.png and docs/launch/social-preview.png (1280×640).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadInputs, installInfo, writeThumbs, encodePng, shortSha, githubRepo, warnings } from './build-site.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LAUNCH = path.join(REPO_ROOT, 'docs', 'launch');
const ASSETS = path.join(LAUNCH, 'assets');
const THUMB_W = 160;
const AGENT_ORDER = ['codex', 'claude'];
const GALLERY = (process.env.SG_GALLERY_URL || 'https://heweitianqing.github.io/skill-gallery/').replace(/\/?$/, '/');
const STRINGS = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'scripts', 'build-readme.strings.json'), 'utf8'));

const args = process.argv.slice(2);
const withImages = !args.includes('--no-images');
const langIdx = args.indexOf('--lang');
const onlyLangs = langIdx >= 0 ? (args[langIdx + 1] || '').split(',').filter(Boolean) : null;
if (args.some((a, i) => a !== '--no-images' && a !== '--lang' && i !== langIdx + 1) || (onlyLangs && !onlyLangs.length)) {
  console.error('usage: node scripts/build-readme.mjs [--no-images] [--lang en,zh-CN,…]');
  process.exit(2);
}

// Strings for one language from scripts/build-readme.strings.json, with English
// fallback. README text is Markdown, so values are inserted as they are.
function strings(code) {
  return (key, vars = {}) => {
    let s = STRINGS[code]?.[key];
    if (typeof s !== 'string') s = STRINGS.en?.[key];
    if (typeof s !== 'string') return key;
    return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
  };
}

const htmlEsc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const mdCode = (s) => `\`${s}\``;
const posix = (p) => p.split(path.sep).join('/');

function stripedPng(w, h) {
  const rgb = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const v = Math.floor((x + y) / 10) % 2 ? 236 : 226;
      rgb.fill(v, (y * w + x) * 3, (y * w + x) * 3 + 3);
    }
  }
  return encodePng(rgb, w, h);
}

function fillBlock(text, name, content, file) {
  const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(<!-- ${name}:end -->)`);
  if (!re.test(text)) {
    console.error(`warn: ${file}: no <!-- ${name}:start/end --> block`);
    return text;
  }
  return text.replace(re, (_, a, b) => `${a}\n${content}\n${b}`);
}

async function main() {
  const g = loadInputs(path.join(REPO_ROOT, 'runs'));
  const { prompts, cells, skills } = g;
  const agentLabel = (id) => g.agents.find((a) => a.id === id)?.label || id;
  const relevant = [...cells.values()].filter((c) => c.variant === 'native' || skills.some((s) => s.name === c.variant));
  const stats = {
    total: prompts.size * (skills.length + 1) * AGENT_ORDER.length,
    done: relevant.length,
    failed: relevant.filter((c) => c.run?.success === false).length,
    dates: [...new Set(relevant.map((c) => c.run?.started_at?.slice(0, 10)).filter(Boolean))].sort(),
  };

  // README thumbnails: first screen at desktop width, THUMB_W wide.
  fs.rmSync(path.join(ASSETS, 'thumbs'), { recursive: true, force: true });
  fs.mkdirSync(ASSETS, { recursive: true });
  const pendingPng = path.join(ASSETS, 'pending.png');
  fs.writeFileSync(pendingPng, stripedPng(THUMB_W, Math.round(THUMB_W * 0.75)));
  const thumbFor = new Map();
  for (const c of cells.values()) {
    if (!c.files['desktop.png']) continue;
    const file = path.join(ASSETS, 'thumbs', c.prompt, `${c.name}.png`);
    try {
      await writeThumbs(path.join(c.dir, 'desktop.png'), c.run?.screenshots?.desktop?.viewport?.width || 1440, 0.75, [{ file, width: THUMB_W }]);
      thumbFor.set(c, posix(path.relative(REPO_ROOT, file)));
    } catch (e) {
      console.error(`warn: runs/${c.prompt}/${c.name}/desktop.png: no README thumbnail (${e.message})`);
    }
  }
  const pendingRel = posix(path.relative(REPO_ROOT, pendingPng));

  const cols = ['native', ...skills.map((s) => s.name)];
  for (const code of Object.keys(STRINGS)) {
    if (onlyLangs && !onlyLangs.includes(code)) continue;
    const t = strings(code);
    const file = STRINGS[code].readme_file || (code === 'en' ? 'README.md' : `README.${code}.md`);
    const full = path.join(REPO_ROOT, file);
    if (!fs.existsSync(full)) {
      console.error(`warn: ${file} does not exist, skipped`);
      continue;
    }
    const gallery = GALLERY;
    const promptTitle = (p) => STRINGS[code].prompts?.[p.id] || STRINGS.en.prompts?.[p.id] || p.title;
    const nativeLabel = t('native');

    // Results grid. Codex above Claude Code in each square, so the table fits GitHub's width.
    const head = `<tr><th>${htmlEsc(t('th_prompt'))}</th>${cols
      .map((v) => (v === 'native' ? `<th>${htmlEsc(t('th_native'))}</th>` : `<th><a href="${gallery}skills/${v}/">${htmlEsc(v)}</a></th>`))
      .join('')}</tr>`;
    const rows = [...prompts.values()].map((p) => {
      const tds = cols.map((v) => {
        const parts = AGENT_ORDER.map((a) => {
          const c = cells.get(`${p.id}/${a}__${v}`) || null;
          const label = `${agentLabel(a)} · ${v === 'native' ? nativeLabel : `+ ${v}`}`;
          const href = c ? `${gallery}cells/${p.id}/${c.name}/` : v === 'native' ? `${gallery}prompts/${p.id}/` : `${gallery}skills/${v}/#${p.id}`;
          const img = (c && thumbFor.get(c)) || pendingRel;
          const state = !c ? ` · ${t('pending')}` : c.run?.success === false ? ` · ${t('failed')}` : !thumbFor.get(c) ? ` · ${t('no_screenshot')}` : '';
          return `<a href="${href}"><img src="${img}" width="${THUMB_W}" alt="${htmlEsc(t('thumb_alt', { cell: label, prompt: promptTitle(p) }))}"></a><br><sub>${htmlEsc(agentLabel(a))}${htmlEsc(state)}</sub>`;
        });
        return `<td align="center">${parts.join('<br>')}</td>`;
      });
      return `<tr><th><a href="${gallery}prompts/${p.id}/">${htmlEsc(promptTitle(p))}</a></th>${tds.join('')}</tr>`;
    });
    const pending = stats.total - stats.done;
    const sp = /^(zh|ja)\b/.test(code) ? '' : ' ';
    const results = [
      t('results_note'),
      '',
      ...(pending ? [`${t('progress', { done: stats.done, total: stats.total })}${sp}${t('pending_note')}`, ''] : []),
      `<table>\n<thead>${head}</thead>\n<tbody>\n${rows.join('\n')}\n</tbody>\n</table>`,
    ].join('\n');

    // One status line, so it never lags behind runs/. The space after the bold label is
    // needed: GitHub does not close ** that ends in 。 when a letter follows directly.
    const dates = stats.dates.length ? (stats.dates[0] === stats.dates.at(-1) ? stats.dates[0] : `${stats.dates[0]} – ${stats.dates.at(-1)}`) : '';
    const statusText = !stats.done ? t('status_none') : pending ? t('status_partial', { done: stats.done, total: stats.total, dates }) : t('status_all', { total: stats.total, dates });
    const status = `> **${t('status_label')}** ${statusText}${stats.failed ? `${sp}${t('status_failed', { n: stats.failed })}` : ''}`;

    // Install and invoke, one row per skill.
    const skillRows = skills.map((s) => {
      const info = installInfo(s, cells);
      // installInfo gives a command when meta.yaml has one (text is null), else copy commands.
      const how = (inst, dir, invoke) => `${inst.text === null ? t('install_run', { cmd: mdCode(inst.cmds) }) : t('install_copy', { path: mdCode(`${dir}/${s.name}/`) })}${t('then_sep')}${invoke}`;
      const claude = how(info.ic, '.claude/skills', t('invoke_claude', { line: mdCode(info.claudeLine), slash: mdCode(`/${s.name} …`) }));
      const codex = how(info.ix, '.agents/skills', t('invoke_codex', { mention: mdCode(info.codexMention) }));
      return `| [${s.name}](${gallery}skills/${s.name}/#install) | ${claude} | ${codex} |`;
    });
    const skillsBlock = [`| ${t('th_skill')} | ${t('th_claude')} | ${t('th_codex')} |`, '| --- | --- | --- |', ...skillRows].join('\n');

    // Credits: source, license and pinned commit (or CLI version) of each skill.
    const creditRows = skills.map((s) => {
      const gh = githubRepo(s.repo);
      const source = s.repo ? `[${s.repo.replace(/^https:\/\/github\.com\//, '')}](${s.repo})${s.path ? ` ${mdCode(s.path)}` : ''}` : '—';
      const owner = s.copyright ? `<br><sub>${htmlEsc(s.copyright)}</sub>` : '';
      const license = s.license ? (s.license_url ? `[${s.license}](${s.license_url})` : s.license) : '—';
      const tree = gh && s.commit ? `${gh}/tree/${s.commit}${s.path ? `/${s.path}` : ''}` : null;
      const sha = s.commit ? (tree ? `[${mdCode(shortSha(s.commit))}](${tree})` : mdCode(shortSha(s.commit))) : '—';
      const commit = s.fetch.method === 'npm-cli' ? `${t('via_cli', { pkg: mdCode(`${s.fetch.package}@${s.fetch.version}`) })}<br><sub>${sha}</sub>` : sha;
      return `| [${s.name}](${gallery}skills/${s.name}/) | ${source}${owner} | ${license} | ${commit} |`;
    });
    const credits = [`| ${t('th_skill')} | ${t('th_source')} | ${t('th_license')} | ${t('th_commit')} |`, '| --- | --- | --- | --- |', ...creditRows].join('\n');

    let text = fs.readFileSync(full, 'utf8');
    text = fillBlock(text, 'status', status, file);
    text = fillBlock(text, 'results', results, file);
    text = fillBlock(text, 'skills', skillsBlock, file);
    text = fillBlock(text, 'credits', credits, file);
    fs.writeFileSync(full, text);
    console.log(`updated ${file}`);
  }

  if (withImages) await renderImages(g);
  console.log(`${stats.done} of ${stats.total} cells; ${thumbFor.size} README thumbnails in ${posix(path.relative(REPO_ROOT, ASSETS))}/`);
  if (warnings.length) console.log(`${warnings.length} warning(s), see stderr`);
}

// ---------------------------------------------------------------- images

async function renderImages(g) {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.error('warn: Playwright not installed; overview.png and social-preview.png not rendered (npm install)');
    return;
  }
  const { prompts, cells, skills } = g;
  const tmp = fs.mkdtempSync(path.join(fs.realpathSync(process.env.TMPDIR || '/tmp'), 'sg-readme-'));
  const dataUri = async (c, width) => {
    if (!c?.files['desktop.png']) return null;
    const file = path.join(tmp, `${c.prompt}-${c.name}-${width}.png`);
    try {
      await writeThumbs(path.join(c.dir, 'desktop.png'), c.run?.screenshots?.desktop?.viewport?.width || 1440, 0.75, [{ file, width }]);
      return `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
    } catch {
      return null;
    }
  };
  const cols = ['native', ...skills.map((s) => s.name)];
  const label = (id) => g.agents.find((a) => a.id === id)?.label || id;
  const css = `*{box-sizing:border-box}body{margin:0;font-family:-apple-system,system-ui,"Segoe UI","Helvetica Neue",Arial,"PingFang SC","Hiragino Sans GB","Noto Sans CJK SC",sans-serif;color:#1c1c1f;background:#f6f6f7}
.shot{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;object-position:top;border:1px solid #dcdce0;border-radius:6px;background:#fff}
.pending{display:flex;align-items:center;justify-content:center;width:100%;aspect-ratio:4/3;border:1px dashed #c3c4ca;border-radius:6px;color:#63646c;font-size:13px;background:repeating-linear-gradient(135deg,#ececee 0 10px,#f3f3f5 10px 20px)}`;

  // Overview: prompts × (native + skills), Codex and Claude Code in each square.
  let grid = '';
  for (const p of prompts.values()) {
    grid += `<div class="rh">${htmlEsc(p.title)}</div>`;
    for (const v of cols) {
      const pair = [];
      for (const a of AGENT_ORDER) {
        const c = cells.get(`${p.id}/${a}__${v}`);
        const src = await dataUri(c, 360);
        pair.push(`<div class="cell">${src ? `<img class="shot" src="${src}">` : `<div class="pending">${c ? 'No screenshot yet' : 'Pending'}</div>`}<div class="lab">${htmlEsc(label(a))}</div></div>`);
      }
      grid += `<div class="sq">${pair.join('')}</div>`;
    }
  }
  const overview = `<!doctype html><html><head><meta charset="utf-8"><style>${css}
body{width:1600px;padding:36px 40px 40px}.top{display:flex;align-items:baseline;gap:16px;margin-bottom:22px}.top b{font-size:28px}.top span{color:#5d5e66;font-size:17px}
.grid{display:grid;grid-template-columns:170px repeat(${cols.length},1fr);gap:12px;align-items:stretch}.ch{font-weight:650;font-size:16px;padding:0 2px 2px;align-self:end}.ch small{display:block;font-weight:400;color:#5d5e66;font-size:13px}
.rh{font-weight:650;font-size:16px;padding-top:8px}.sq{display:grid;grid-template-columns:1fr 1fr;gap:8px;background:#fff;border:1px solid #dcdce0;border-radius:8px;padding:8px}.lab{font-size:12px;color:#5d5e66;padding-top:4px}</style></head><body>
<div class="top"><b>skill-gallery</b><span>Same prompts, Codex and Claude Code, with and without each skill</span></div>
<div class="grid"><div></div>${cols.map((v) => `<div class="ch">${v === 'native' ? 'Native<small>no added skill</small>' : `${htmlEsc(v)}<small>with skill</small>`}</div>`).join('')}${grid}</div></body></html>`;

  // Social preview: title on the left, six results on the right.
  const preferred = [];
  for (const p of prompts.values()) {
    for (const v of cols) {
      for (const a of AGENT_ORDER) {
        const c = cells.get(`${p.id}/${a}__${v}`);
        if (c?.files['desktop.png'] && c.run?.success !== false) preferred.push(c);
      }
    }
  }
  const picks = [];
  for (const p of prompts.values()) {
    const ofPrompt = preferred.filter((c) => c.prompt === p.id);
    const native = ofPrompt.find((c) => c.variant === 'native');
    const skill = ofPrompt.find((c) => c.variant !== 'native' && !picks.some((x) => x.variant === c.variant)) || ofPrompt.find((c) => c.variant !== 'native');
    for (const c of [native, skill]) if (c && !picks.includes(c)) picks.push(c);
  }
  const tiles = [];
  for (const c of picks.slice(0, 6)) tiles.push(`<img class="shot" src="${await dataUri(c, 400)}">`);
  const social = `<!doctype html><html><head><meta charset="utf-8"><style>${css}
body{width:1280px;height:640px;overflow:hidden;display:grid;grid-template-columns:520px 1fr;gap:36px;padding:56px 56px 56px 64px}
.l{display:flex;flex-direction:column;justify-content:center}.k{font-size:15px;letter-spacing:.08em;text-transform:uppercase;color:#5d5e66;margin-bottom:14px}
h1{font-size:64px;line-height:1.05;margin:0 0 22px;letter-spacing:-.02em}.en{font-size:25px;line-height:1.4;margin:0 0 14px}.zh{font-size:22px;line-height:1.5;color:#3f4047;margin:0}
.f{margin-top:30px;font-size:16px;color:#5d5e66}.r{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-content:center}.r .shot{aspect-ratio:16/9;box-shadow:0 2px 10px rgb(0 0 0/.08)}</style></head><body>
<div class="l"><div class="k">Claude Code · Codex · SKILL.md</div><h1>skill-gallery</h1>
<p class="en">What web-design agent skills actually do: the same prompts, with and without each skill.</p>
<p class="zh">同一道题，用和不用 skill，Claude Code 与 Codex 做出的网页并排对比。</p>
<div class="f">${skills.length} skills · ${prompts.size} prompts · ${AGENT_ORDER.length} agents · every result shown</div></div>
<div class="r">${tiles.join('')}</div></body></html>`;

  const browser = await chromium.launch();
  try {
    // A short viewport, so the full-page capture ends where the content ends.
    const page = await browser.newPage({ viewport: { width: 1600, height: 200 }, deviceScaleFactor: 1 });
    await page.setContent(overview, { waitUntil: 'load' });
    await page.screenshot({ path: path.join(LAUNCH, 'overview.png'), fullPage: true });
    await page.setViewportSize({ width: 1280, height: 640 });
    await page.setContent(social, { waitUntil: 'load' });
    await page.screenshot({ path: path.join(LAUNCH, 'social-preview.png'), clip: { x: 0, y: 0, width: 1280, height: 640 } });
    console.log('rendered docs/launch/overview.png and docs/launch/social-preview.png');
  } finally {
    await browser.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(`error: ${e.message}`);
  process.exit(1);
});
