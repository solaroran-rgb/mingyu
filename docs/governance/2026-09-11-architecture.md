# 架构治理决策记录 · 上线遗留收口

- 日期：2026-09-11（UTC+8）
- 线程：线程 E · 架构治理规范化（分支 `thread-e-gov`）
- 基线：`codex/website-basic-settings` @ `52d9f24`（HEAD 已核验）
- 推送远程：`solaroran-rgb` = https://github.com/solaroran-rgb/mingyu.git
- 禁止远程：`origin` = https://github.com/Brhiza/mingyu.git（本线程未做任何 push origin）
- 范围说明：本线程只产出决策文档 + 安全的本地文档改动；**不改动** Cloudflare Pages `production_branch`、不执行 GitHub 改名、不 `wrangler pages deploy`、不推 `origin`。凡涉及线上行为的操作，一律列为「待主控/用户在线上执行」。

---

## 0. 现状总览（只读核查所得）

### 0.1 Git 远程与分支拓扑（已实测）

```text
solaroran-rgb 远程分支实测（git ls-remote）：
  HEAD                                          fc09fdb  (= main)
  refs/heads/main                               fc09fdb
  refs/heads/codex/website-basic-settings       52d9f24  ← 当前线上 production_branch（任务简报口径）
  refs/heads/codex/optimize-algorithm-foundation c94ad9a
  refs/heads/codex/true-solar-iana-forwarding   9b7b91a
  refs/tags/v0.1.0
```

- 分支发散关系（`git rev-list` 实测）：
  - `codex/website-basic-settings` 相对 `main`：**领先 39 个提交，落后 0 个提交**；`merge-base(main, codex/website-basic-settings) = fc09fdb = main 当前 tip`。
  - 含义：当前线上分支是 `main` 的**纯线性快进**，可无冲突 `git push solaroran-rgb codex/website-basic-settings:main` 把 `main` 快进到 `52d9f24`。

### 0.2 Cloudflare Pages 配置（读 wrangler.toml 所得）

- `wrangler.toml`：`name = "temposoul"`、`pages_build_output_dir = "dist"`、KV 绑定 `AUTH_KV` / `newsletter_emails`、vars `AUTH_ENABLED=true` / `ANALYTICS_PROVIDER=cf`。
- **`wrangler.toml` 中不存在 `production_branch` 字段** → 该值在 Cloudflare Dashboard（Pages 项目 → Settings → Builds & deployments）维护。当前值 `codex/website-basic-settings` 为任务简报口径，**未经 CF 控制台直读，待核实**。

### 0.3 CI 门禁现状（读 .github/workflows/ci.yml 所得）

- `ci.yml` 触发条件：`push` 与 `pull_request` 均只监听 `branches: [main]`。
- **治理缺口**：实际线上部署分支 `codex/website-basic-settings` 不在 CI 触发列表中 → 线上分支当前没有 lint / type-check / test / build 门禁。
- CI 不硬编码仓名（用 `actions/checkout` 自动探测），故 GitHub 仓改名本身不会让 CI 失效。

### 0.4 域名现状

- 线上实例：`https://www.temposoul.com`（README 与提交 `b709621 fix(seo): 生产域名改为 www.temposoul.com canonical/og:url` 一致）。
- 裸域 `temposoul.com`：任务简报称未配置，**未经 DNS/控制台直读，待核实**。

### 0.5 仓名残留（grep 工作区所得，非全 E 盘扫描）

- 包名已收口：根 `package.json` name = `temposoul`；算法包 `@temposoul/core` 已发 npm；`wrangler.toml` name = `temposoul`。
- 仍含旧名 `mingyu` 的引用：
  - 顶层 `README.md`：clone URL、`npx skills add`、目录树标签、docker 镜像标签（本线程已改，见 §5）。
  - `mcp/README.md`、`packages/core/README.md`：仍指 `Brhiza/mingyu`（origin）——随议题②④一并收口，本线程不动。
  - `public/skills/aov-mingyu-api/`：目录/技能名仍是旧名（代码与文件层重命名，属另一工作流，本线程不动）。
  - `README.md` 中 `/mingyu-runtime-config.js`：这是**运行时服务文件名**，改动需同步 Vite/functions 代码，**待代码层核实**，本线程不改。

---

## 议题 ①：`production_branch` 改为 `main` 的迁移方案

### 现状
- CF Pages 项目 `production_branch = codex/website-basic-settings`（任务简报口径，待控制台核实）。
- 该分支 = `main` + 39 提交，线性可快进。
- CI 只监听 `main`，线上分支无门禁。

### 方案对比
| 方案 | 做法 | 优点 | 缺点 |
| --- | --- | --- | --- |
| **A（推荐）** | 先 `main` 快进到 `52d9f24`，再在 CF Dashboard 把 `production_branch` 切到 `main` | 主干唯一；CI 触发分支与部署分支一致；历史线性 | 切换瞬间 CF 会用 `main` 重新构建一次生产部署 |
| B | 不动 `production_branch`，仅把 `codex/website-basic-settings` 加进 `ci.yml` 触发列表 | 零线上变更 | 不规范分支名长期存在；新协作者困惑；治标不治本 |
| C | 远程重命名分支为 `main`（先删旧 main） | 表面统一 | 与 A 类同且更危险；需重建 CF Git 对接，KV/环境变量绑定需复核 |

### 推荐
**方案 A**。执行顺序：
1. （待主控）`git push solaroran-rgb codex/website-basic-settings:main` —— 把 `main` 快进到 `52d9f24`（fast-forward，无冲突）。
2. （待主控/用户，CF Dashboard）Pages 项目 → Settings → Builds & deployments → Production branch：`codex/website-basic-settings` → `main`。
3. 触发或等待一次 `main` 的 production 部署，验证 `https://www.temposoul.com` 与 `/api/v1/manifest` 正常。
4. 观察 GitHub Actions：`main` 上 CI（lint/type-check/test/build）应自动跑通，确认门禁接上。

### 风险与回滚
- 风险：切换 `production_branch` 后 CF 自动用 `main` 构建一次；若 `main` 构建失败会暴露——这正是建立门禁的目的。KV / 环境变量（`AUTH_KV`、`AUTH_SECRET`、`ANALYTICS_*`）是**项目级**配置，不随 production_branch 变化，不受影响。
- 前置：必须**先**完成第 1 步（`main` 已 = `52d9f24`）**再**切 `production_branch`，避免 CF 用落后的 `main@fc09fdb` 部署。
- 回滚：CF Dashboard 把 `Production branch` 改回 `codex/website-basic-settings` 即可（该远程分支仍在，未删除）。
- 备注：本线程 `pnpm build` 只验证本地构建；CI 全量 lint/test/e2e 需在 GitHub Actions 实跑确认。

---

## 议题 ②：Git 仓改名 `mingyu` → `temposoul`

### 现状
- GitHub 仓仍名 `mingyu`：`solaroran-rgb/mingyu.git`（推送目标）、`origin=Brhiza/mingyu.git`（禁推）。
- 品牌侧已收口：npm 包 `@temposoul/core`、`wrangler` name、根 `package.json` name 均为 temposoul。
- 残留文档引用：顶层 README（本线程已改）、`mcp/README.md`、`packages/core/README.md`（仍指 `Brhiza/mingyu`）。

### 方案对比
| 方案 | 做法 | 优点 | 缺点 |
| --- | --- | --- | --- |
| **A（推荐）** | GitHub Settings → Rename repo：`solaroran-rgb/mingyu` → `solaroran-rgb/temposoul` | canonical URL 与品牌一致；GitHub 旧 URL 自动永久重定向，旧 clone/fetch/push/网页链接不失效；操作一步 | 改名瞬间的极短一致性窗口 |
| B | 新建空仓 `temposoul`，push 全量历史，弃用 `mingyu` | 无 | 失去 GitHub 自动重定向；旧 fork/star/issue/PR 关联断裂；操作重 |
| C | 维持 `mingyu` 不改名 | 零操作 | 品牌割裂（包 temposoul / 仓 mingyu）；README 误导 |

### 推荐
**方案 A**。步骤与影响面：
1. （待用户，GitHub）`solaroran-rgb` → repo `mingyu` → Settings → 把 Repository name 改为 `temposoul`。
2. 本地 remote 升级到 canonical（旧 URL 经重定向仍可用，但建议更新）：
   - `git remote set-url solaroran-rgb https://github.com/solaroran-rgb/temposoul.git`
3. 文档引用同步（与改名同波次）：
   - 顶层 `README.md`：本线程已改为 `solaroran-rgb/temposoul`。
   - `mcp/README.md`、`packages/core/README.md`：`Brhiza/mingyu` 引用随议题④裁决后一并更新。
   - `public/skills/aov-mingyu-api/` 目录与技能名重命名：代码层工作流，不在本线程。
4. CI：`ci.yml` 不硬编码仓名，**无需改**；若存在 badge / repo URL 硬编码，需随改名同步。
5. npm 包名 `@temposoul/core` 与仓名解耦，**不受影响**。

### GitHub 改名重定向机制（事实依据）
- GitHub 对仓库改名会：在旧路径保留 HTTP 301 重定向（网页）；`git clone/fetch/push` 走旧 URL 仍能工作（重定向到新仓）；fork / webhook / GitHub API 客户端自动跟随。
- 因此「先改仓名、后合并本线程 README 更新」是安全顺序；反之（README 已写 temposoul、仓未改名）会出现短暂 404。

### 风险与回滚
- 风险：改名极短窗口内，旧 CI runner 缓存的 remote URL 仍经重定向工作（低风险）；webhook 自动跟随。
- 回滚：GitHub Settings 再次 Rename 回 `mingyu`（改名可逆）。
- 注意：`origin=Brhiza/mingyu` 是否同步改名取决于议题④——若放弃上游则不必动。

---

## 议题 ③：根域 `temposoul.com` 方案对比

### 现状
- `www.temposoul.com` 已上线（CF Pages 绑定）；canonical / og:url 指向 www。
- 裸域 `temposoul.com` 未配置（任务简报口径，**待核实** DNS/控制台）。

### 方案对比
| 方案 | 做法 | 优点 | 缺点 |
| --- | --- | --- | --- |
| **A（推荐）** | 同 zone 内把裸域 `temposoul.com` 加为 Pages custom domain，并用 Redirect Rule / 301 跳转到 `https://www.temposoul.com` | SEO 归一（避免裸域/www 重复内容）；用户直输裸域可达；免费版 Redirect Rule 即可 | DNS/证书分钟级生效 |
| B | 裸域作主站，www 跳裸域 | 裸域更短 | 与现有 canonical=www 相反，需全站改 canonical/og:url/sitemap，改动大 |
| C | 忽略裸域，只保 www | 零配置 | 用户直输 `temposoul.com` 无法访问，品牌漏损 |
| D | 上 Cloudflare Pro 付费版做复杂规则 | — | 单人/小站无需付费；免费版 Redirect Rule 足够 |

### 推荐
**方案 A**：`www` 为主站，裸域 `301 → https://www.temposoul.com`。
- （待用户，CF Dashboard）Pages 项目 → Custom domains 添加 `temposoul.com`；同 zone 内 Universal SSL 自动覆盖裸域证书。
- （待用户，CF Dashboard）创建 Redirect Rule：`http.host eq "temposoul.com"` → 301 `https://www.temposoul.com` 并保留路径与查询串。

### 风险与回滚
- 前置：**待核实** `temposoul.com` 的 DNS NS 是否已托管在 Cloudflare；若不在 CF，需先把 zone 迁入 CF 才能用 Pages custom domain + Redirect Rule。
- 风险：301 对 SEO 权重传递；确保同时覆盖 HTTP/HTTPS 与裸域/`www` 双方向证书。
- 回滚：移除裸域 custom domain 或禁用该 Redirect Rule。

---

## 议题 ④：`origin`（Brhiza/mingyu）推送策略

### 现状
- `origin = Brhiza/mingyu.git`：上游原作者开源仓（MIT）。本任务**禁止 push origin**。
- `solaroran-rgb` 是实际开发/推送目标。
- **待核实**：`solaroran-rgb/mingyu` 是否为 `Brhiza/mingyu` 的 GitHub fork 关系。

### 方案对比
| 方案 | 做法 | 优点 | 缺点 |
| --- | --- | --- | --- |
| **A（推荐）** | origin 归档为只读上游：本地 `git remote rename origin upstream`；日常只 push `solaroran-rgb` | 消除误推上游风险；权限边界清晰；保留只读跟踪上游能力 | 无 |
| B | 镜像 origin（定期 push 同步） | — | 向上游原作者仓持续 push 需其授权；擅自 push 污染其历史；无必要 |
| C | 直接删除 origin remote | 彻底 | 失去跟踪上游更新；不如改名为 upstream 保留只读 |

### 推荐
**方案 A**：把 `origin` 语义化为 `upstream`（只读），不 push。
- （待用户，主工作区执行）`git remote rename origin upstream`；保留 `solaroran-rgb` 为唯一推送远程。
- 如确需向上游贡献，走标准 fork → PR 流程，**不直接 push**。

### 风险与回滚
- 风险：误推上游的最有效防护是「无 push 权限 + remote 改名提醒」；改名后 `git push upstream` 会因无权限而失败，形成第二道防线。
- 回滚：`git remote rename upstream origin` 即恢复。
- 待核实：fork 关系确认后，PR 通道（`solaroran-rgb` → `Brhiza`）是否可用。

---

## 5. 本线程本地已落地的安全改动（commit 于 `thread-e-gov`）

- 新增本决策文档：`docs/governance/2026-09-11-architecture.md`。
- 顶层 `README.md` 仓名引用（`mingyu` → `temposoul`，假设议题②仓改名按推荐执行；执行顺序见议题②）：
  - clone URL `https://github.com/solaroran-rgb/mingyu.git` → `.../temposoul.git`
  - `npx skills add solaroran-rgb/mingyu` → `solaroran-rgb/temposoul`
  - 目录树标签 `mingyu/` → `temposoul/`
  - docker 镜像标签 `mingyu` → `temposoul`
- **未改动**：`wrangler.toml`（仅只读核对）、`.github/workflows/ci.yml`（不改触发分支，理由见议题①——迁移后 CI 监听 main 与 production 自然一致）、`/mingyu-runtime-config.js` 运行时文件引用（代码层，待核实）。
- **未执行**：任何 CF 控制台操作、任何 GitHub rename、任何 `push origin`、任何 `wrangler pages deploy`、任何对 `main` / `codex/website-basic-settings` 的直接 push。

---

## 6. 待主控 / 用户在线上执行的操作清单（本线程不能做）

1. （主干时机决策，主控）把 `main` 快进到 `52d9f24`：`git push solaroran-rgb codex/website-basic-settings:main`。
2. （CF Dashboard，用户）议题①：Production branch `codex/website-basic-settings` → `main`（前置第 1 步完成）。
3. （GitHub，用户）议题②：`solaroran-rgb/mingyu` → `solaroran-rgb/temposoul` rename；随后 `git remote set-url solaroran-rgb ...`。
4. （CF + DNS，用户）议题③：裸域 `temposoul.com` custom domain + 301→www；先核实 DNS zone 是否在 CF。
5. （主工作区，用户）议题④：`git remote rename origin upstream`。
6. （主控）协调 6 线程分支合并顺序；本线程 README 改动须与议题② GitHub 改名**同波次**落地。

---

## 7. 待核实项（不臆造）

- CF Pages `production_branch` 当前确切值（任务简报 = `codex/website-basic-settings`；wrangler.toml 无此字段，实际在 Dashboard）。
- `temposoul.com` 的 DNS NS 记录是否托管在 Cloudflare。
- `solaroran-rgb/mingyu` 与 `Brhiza/mingyu` 的 GitHub fork 关系。
- `README.md` 中 `/mingyu-runtime-config.js` 与代码实际 runtime-config 文件名是否一致（规划文档称已为 `temposoul-runtime-config.js`，需代码层核对后统一）。
- `mcp/README.md`、`packages/core/README.md` 的 `Brhiza/mingyu` 引用随议题②④收口。
