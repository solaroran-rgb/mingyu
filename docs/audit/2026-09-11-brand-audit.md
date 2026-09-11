# 旧品牌残留扫描与清理报告

- 日期：2026-09-11
- 分支：thread-g5-lexicon（基线 codex/website-basic-settings @ cbeb64c）
- 范围：src/、packages/core/src/、public/、functions/、wrangler.toml、README.md
- 关键词（大小写不敏感）：命语、mingyu、aov.cc、aov-mingyu-api、Brhiza

## 一、扫描方法

使用 Grep 工具在 worktree 内按上述路径定点检索正则
`命语|mingyu|aov\.cc|aov-mingyu-api|Brhiza`（`-i`），未从仓库根递归全扫（E 盘 HDD 约束）。
docs/ 历史文档、mcp/、packages/core/README.md 中的 git 引用按规则只读不写。

## 二、初始命中清单与处理决策

### A. 已清理（面向用户 / 公开 API / 公开静态资源）

| # | 文件 | 命中 | 处理 |
|---|------|------|------|
| 1 | src/lib/public-api/metadata.ts | `service: 'mingyu'`（默认运行时） | 改为 `'temposoul'` |
| 2 | src/lib/public-api/metadata.ts | `'GET /.well-known/aov-mingyu-api.json'` | 改为 `'GET /.well-known/temposoul-api.json'` |
| 3 | src/lib/public-api/metadata.ts | manifest `name: 'AOV 命理与占卜公开 API'` | 改为 `'TempoSoul 命律 · 命理与占卜公开 API'` |
| 4 | src/lib/public-api/metadata.ts | `skillUrl: .../skills/aov-mingyu-api/SKILL.md` | 改为 `.../skills/temposoul-api/SKILL.md` |
| 5 | functions/.well-known/[[path]].ts | `WELL_KNOWN_API_FILE = 'aov-mingyu-api.json'` | 改为 `'temposoul-api.json'` |
| 6 | public/skills/aov-mingyu-api/ | 目录名 + SKILL.md 全文（27 处：frontmatter name/description、标题「AOV 命理与占卜 API」、23 处 `https://aov.cc/api/v1`、2 处 `"service": "aov.cc"`） | 目录改名为 `public/skills/temposoul-api/`；SKILL.md 内 `aov.cc/api/v1` → `www.temposoul.com/api/v1`，service → `temposoul`，标题与 frontmatter 改为 TempoSoul 命律 |
| 7 | src/components/AiChatPanel.tsx:40 | localStorage 前缀 `'mingyu:ai-chat-history:v1:'` | 改为 `'temposoul:ai-chat-history:v1:'`（注意：老用户本地历史 key 迁移，旧 key 不再读取，属预期品牌迁移副作用） |
| 8 | README.md:375 | `/.well-known/aov-temposoul-api.json`（与代码不一致的历史残留） | 统一为 `/.well-known/temposoul-api.json` |
| 9 | README.md:376,392 | `mingyu-runtime-config.js`（实际文件早已改名 `temposoul-runtime-config.js`） | 改为 `temposoul-runtime-config.js` |

### B. 保留不动（内部标识符 / 非用户可见）

| 文件 | 命中 | 保留原因 |
|------|------|----------|
| src/lib/public-api/handler.ts | 5 处 `MingyuCoreError`（import / instanceof / 注释） | 内部 TS 类名，序列化 JSON 只暴露 code/message，类名不上 UI；重命名会破坏 `@temposoul/core` 公开导出面 |
| packages/core/src/（11 个文件，73 处） | `MingyuCoreError`、`MINGYU_CORE_VERSION`、`MINGYU_SCHEMA_VERSION`、`MingyuCapabilities`、`MingyuClient*`、`MingyuSafeClient`、`createMingyuClient`、`MingyuCoreConfig`，以及 foundation/index.ts 注释「命语公共地基工具箱」、index.ts 注释「Mingyu core algorithms...」 | 均为核心包内部/公开 API 标识符与源码注释，不进入 UI 与公开 API 响应体；属包级 breaking rename，需单独评审，不在本线程范围 |

### C. 保留不动（docs / git 历史引用）

| 文件 | 命中 | 保留原因 |
|------|------|----------|
| mcp/README.md | 「命语 MCP Server」「git clone https://github.com/Brhiza/mingyu.git」等 8 处 | 文档 + 上游 git 仓库引用，按规则保留 |
| packages/core/README.md | `@temposoul/core` 源自 `github.com/Brhiza/mingyu` 的署名、`createMingyuClient` 示例等 8 处 | 上游开源署名与 API 示例文档 |

## 三、复扫结果（清理后）

- src/ 面向用户代码（UI / i18n / 公开 API 文案）：0 命中（仅剩 5 处内部 `MingyuCoreError` 标识符，见 B）
- functions/：0 命中
- public/（含 manifest.webmanifest、robots/sitemap/sw/runtime-config）：0 命中
- wrangler.toml：0 命中（早已为 temposoul）
- README.md：0 命中
- src/i18n/locales/（7 语言）：0 命中（本轮扫描未发现旧品牌串）

## 四、LexiconPage 筛选按钮

- 词库实际分类：37 个（src/data/lexicon.ts + lexicon-extra.ts 合计 1180 条）
- 原 CATEGORIES 仅 8 个，已补全为全部 37 个
- UI 处理：按命理域分 7 组（基础干支 / 干支关系 / 神煞格局 / 紫微斗数 / 周易八卦 / 星象历法 / 术数流派），每组一行横向滚动，「全部」单独一行，避免 38 个按钮撑爆布局
- pnpm build 通过（26.52s，exit 0）

## 五、待主控决策

1. packages/core 内部标识符 `MingyuCoreError` / `MINGYU_CORE_*` / `MingyuClient*` 是否单独立项做包级 rename（breaking change，影响 `@temposoul/core` 导出面）。
2. localStorage 前缀从 `mingyu:` 改为 `temposoul:` 会清空老用户浏览器内 AI 对话历史，是否需要做一次 key 迁移读取。
3. well-known 文件名统一为 `temposoul-api.json`（README 此前写作 `aov-temposoul-api.json`，已一并纠正）。
