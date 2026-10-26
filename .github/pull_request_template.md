## What this changes · 改动内容

<!-- One or two sentences. 一两句话说明。 -->

## Checklist · 检查

- [ ] Cells in `runs/` come from `scripts/run-*.mjs` and are unedited; no cell was rerun to get a nicer result. · `runs/` 里的格子由运行脚本生成、未经修改，没有为了更好看而重跑。
- [ ] `node scripts/build-site.mjs` passes. · 站点构建通过。
- [ ] `node scripts/build-readme.mjs` was run if results or skills changed. · 结果或 skill 有变化时已重新生成 README。
- [ ] No credentials, tokens or personal paths are committed. · 没有提交凭据、token 或个人路径。
- [ ] Translations keep keys, `{placeholders}` and code unchanged. · 翻译保留了键名、`{占位符}` 和代码。
