# TempoSoul 命律 · 下一阶段多线程任务分配包

> 生成：2026-09-11 · 豆包（主控）
> 基线：仓库 `E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统`，分支 `codex/website-basic-settings`，HEAD=`52d9f24`
> 用法：每个线程一个独立对话框，把对应「任务包」整段复制为对话框首条指令，子 agent 执行完成后按「回报格式」汇报。

---

## 全局铁律（所有线程必须遵守）

1. **分支隔离**：执行前从基线开独立分支 `thread-<代号>`（如 `thread-a-468`），**禁止提交到 codex/website-basic-settings 主分支**。
2. **禁止部署**：不执行 `wrangler pages deploy`（部署由主控统一协调，防止线上互相覆盖）。本地 `pnpm build` 验证可以。
3. **文件范围隔离**：只改任务包指定的文件/目录，不碰其他线程范围（见各包「涉及范围」）。
4. **git 规范**：提交信息 `feat|fix|docs(<范围>): <说明>`；提交后推送到 `solaroran-rgb`（remote 名），**不要 push origin**（Brhiza 旧仓）。
5. **编码**：源码 CRLF + UTF-8 无 BOM。修改文件用 Python `io.open(newline='')` 精确替换（Edit 工具对 CRLF 大文件可能失败）；PowerShell 传 JSON 给 curl 会被剥引号，用 `--data-binary @文件`（文件必须无 BOM）。
6. **记忆沉淀**：任务完成把关键结论写 `E:\KnowledgeOS\memory\guoxue-overseas\2026-09-11-<线程名>.md`，并以 `[来源: <你的名字> @ 2026-09-11]` 开头写入 8877（`POST http://127.0.0.1:8877/memory/write`，Python urllib + ensure_ascii=False + utf-8 无 BOM）。
7. **不编造**：找不到文件/数据时如实报告，不虚构路径与结果。8877 不可用时降级 Read 本地文件。

**回报格式**（完成后在对话框回报）：
```
[线程<代号> 完成]
- commit: <hash>（分支 thread-<代号>，已推 solaroran-rgb）
- 交付物: <文件路径清单>
- 验收: <逐项验证结果>
- 待主控: <需要主控合并/部署/决策的点>
```

---

## 线程 A · P2-468 红线重审映射（代号 thread-a-468）

**背景**：CTO Phase1 核心。项目有《准确性核验清单审计标准 V5.0》（468 项红线）与真实引擎 `@temposoul/core`，需要逐项映射到实现，产出合规矩阵。

**目标**：468 项红线 → 引擎模块 → 实现状态（pass/fail/partial/na）→ 证据（文件/行号/测试）→ 缺口修复建议，输出可审计的 V5.1 合规报告。

**涉及范围**（只读+新增 docs）：
- 审计标准：`E:\KnowledgeOS\项目库\_商业项目\国学出海\国学网站建设\准确性核验清单审计标准 V5.0-网站各板块.md`（315KB，468 项红线，已确认存在；主地图索引写的 `AI地图\11_国学出海\国学网站建设\` 因目录重组已失效，勿用）
- 配套文档（同目录，可参考）：`CTO项目进展分析与下一步计划.html`（CTO 四阶段计划）、`TempoSoul 命律 网站全球排盘时间基准 · 最终修复执行方案.md`、`网站用户第一信任度引擎.md`
- 引擎源码：`packages/core/src/`（只读）
- 前端证据：`src/` 关键页（InputPage/ResultPage）、`tests/` 现有测试
- 交付：新建 `docs/audit/468-redline-mapping.md` + `docs/audit/468-redline-gaps.md`（缺口清单，按体系/严重度排序）

**步骤**：
1. 读审计标准全文，解析 468 项（按体系分组：八字/紫微/星盘/七政四余/六爻/梅花/奇门/六壬/太乙/塔罗/住宅风水/真太阳时等）
2. 对照 `packages/core/src` 各体系实现，逐项判定状态并记录证据（文件路径+行号或测试用例名）
3. 对 fail/partial 项给出修复建议（不改引擎代码，仅建议；若某缺口修复极小且明确，可修复并补测试）
4. 汇总输出两份文档

**验收**：
- 468 项逐项有状态 + 证据（无"未查证"空白）
- 缺口清单按体系分组、按严重度排序、每条含修复建议
- `pnpm build` 通过（若有代码改动）；无代码改动时 `pnpm --filter @temposoul/core test` 通过

---

## 线程 B · 词库 MVP 800 条（代号 thread-b-lexicon）

**背景**：CTO Phase3。词库数据在 `src/data/lexicon`（LexiconPage 从 `@/data/lexicon` 导入），需达 MVP 800 条（八字 480 + 紫微 330 为核心）。

**目标**：词库条目补齐至 ≥800 条，字段完整、无重复、LexiconPage 可正常展示。

**涉及范围**：
- `src/data/lexicon`（数据源，只读理解结构）
- 交付：补齐后的词库数据文件（在原数据文件上扩展，或新建 `src/data/lexicon-extra.ts` 合并——以不破坏现有导入为准）
- 可参考底料：`E:\KnowledgeOS\memory\guoxue-overseas\` 下历史文件（如 08-30 白皮书/盘点，用 8877 `POST /corpus/query` 检索"词库 八字 紫微 术语"，k=8）
- `src/pages/LexiconPage.tsx`（如需适配新条目结构，最小改动）

**步骤**：
1. 读现有词库数据结构（`LexiconEntry` 字段：术语/拼音/分类/来源等）与条目数
2. 按分类补齐：八字体系（十神/神煞/格局/大运流年术语等）≥480、紫微（星曜/宫位/四化等）≥330，其他体系适量
3. 写校验脚本（无重复术语、必填字段非空、分类合法）
4. LexiconPage 验证（构建 + 页面可展示）

**验收**：
- 词库总数 ≥800（提供分类计数）
- 校验脚本通过（0 重复、0 缺字段）
- `pnpm build` 通过；页面搜索/分类切换正常

---

## 线程 C · Lighthouse/PWA 验收与性能优化（代号 thread-c-perf）

**背景**：上线后未做性能验收。构建输出 chart-engine 908KB（gzip 255KB）、prompt-engine 639KB，超过 Vite 700KB 警告线；manifest/sw 已就绪但未线上实测。

**目标**：Lighthouse 线上实测（https://www.temposoul.com/），优化大 chunk（代码分割），PWA 离线能力验收。

**涉及范围**：
- `vite.config.*`（manualChunks/代码分割配置）
- `src/` 中大组件动态导入（chart-engine/prompt-engine 来源：AstrolabeChart/PromptShortcutPanel 等，用构建报告定位）
- `public/sw.js`、`public/manifest.webmanifest`（只读验收，发现问题最小修复）
- 交付：`docs/perf/2026-09-11-lighthouse.md`（实测分数 + 优化前后对比）

**步骤**：
1. 跑 Lighthouse（本地有 chrome 则 `npx lighthouse https://www.temposoul.com/ --preset=desktop --output=json --output-path=...`；无则用 PageSpeed Insights API 或手动记录关键指标）
2. 定位大 chunk 来源（构建报告/rollup 分析），对可安全拆分的做动态 import 或 manualChunks（如 echarts/图表库独立 chunk）
3. sw/manifest 线上检查：`curl https://www.temposoul.com/sw.js`、manifest 字段、图标 192/512 可访问
4. 优化后重新构建对比 chunk 体积与 Lighthouse 分数

**验收**：
- Lighthouse 桌面 ≥80（记录优化前分数作基线）
- 最大 chunk 显著下降（记录 before/after 数值；若业务必须保留大 chunk 则文档化决策）
- sw.js/manifest 线上 200、PWA 可安装性检查通过

---

## 线程 D · 法务与多语言页复核（代号 thread-d-legal）

**背景**：站点 7 语言 i18n 已就绪，但 PrivacyPage/TutorialPage 等页面可能仍有中文硬编码残留；法务免责合规需复核。

**目标**：privacy/tutorial 页 7 语言覆盖复核，补齐残留中文；法务免责声明合规性建议。

**涉及范围**：
- `src/pages/PrivacyPage.tsx`、`src/pages/TutorialPage.tsx`
- `src/i18n/locales/`（7 语言：en/es-ES/ja/ko-KN/th-TH/vi-VN/zh-CN）
- `src/components/` 中带硬编码中文的组件（用正则扫描 `[\u4e00-\u9fff]` 在非 zh-CN locale 相关文件）
- 交付：`docs/legal/2026-09-11-i18n-legal-review.md`（缺口清单 + 法务建议）

**步骤**：
1. 扫描 7 语言字典与页面，列出缺 key / 中文残留清单
2. 补齐缺失的 i18n key（翻译到 7 语言，参考现有翻译风格）
3. 复核免责声明（disclaimer）、隐私政策要点（本地存储声明、第三方服务、GDPR/个人信息保护法合规项）——不编造法律意见，给"建议核实点"
4. 构建验证

**验收**：
- 7 语言页面无中文残留（除品牌名"命律"与专有名词外）
- i18n 无缺 key（构建/运行时不回退中文）
- 合规建议文档列出核实点

---

## 线程 E · 架构治理规范化（代号 thread-e-gov）

**背景**：上线遗留治理问题：CF Pages 项目 `production_branch=codex/website-basic-settings`（不规范）；git 仓名仍 mingyu（solaroran-rgb/mingyu）；origin(Brhiza/mingyu) 未推；根域 temposoul.com 未配置。

**目标**：输出治理决策文档 + 安全可执行的规范化改动。

**涉及范围**：
- 文档交付：`docs/governance/2026-09-11-architecture.md`
- 可执行改动（谨慎评估）：wrangler.toml、.github 工作流（若有）、README 仓名引用
- **禁止**：直接改动 CF 项目 production_branch（涉及线上部署行为，需主控确认）；不推 origin

**步骤**：
1. 梳理现状（git remote、CF 项目配置、DNS 现状——用 `git remote -v`、8877/API 只读查询或文档依据）
2. 输出决策建议：①production_branch 改为 main 的迁移方案（含回滚）②git 仓改名 mingyu→temposoul 的步骤与影响（GitHub 重定向）③根域方案对比（忽略/301/CF 专业版）④origin 推送策略
3. 文档落盘；可执行的本地改动（README 引用等）做完提交

**验收**：
- 决策文档四议题各含：现状/方案对比/推荐/风险与回滚
- 本地改动不破坏构建（`pnpm build` 通过）
- 明确标注"哪些改动需主控/用户执行"

---

## 线程 F · Google/Bing 收录（代号 thread-f-seo，需用户接管）

**背景**：站点已上线但未提交搜索引擎收录，无自然流量入口。

**目标**：Google Search Console（GSC）+ Bing Webmaster 提交 sitemap，完成所有权验证。

**涉及范围**：浏览器操作（browser-use-automation：`computer_use_tool` plane="bu" + `seed_browser_use`）+ 无需代码改动。

**步骤**：
1. 打开 https://search.google.com/search-console → 添加资源 → 域名型（DNS TXT 验证）或网址前缀型（HTML 标签验证）。**若遇登录/验证 → 立即调用 `interaction.request_action`（type=browserControl）请用户接管完成登录，完成后重新读取页面继续**（skill：browser-use-automation，先 Read 其 SKILL.md）
2. 验证所有权后提交 sitemap：https://www.temposoul.com/sitemap.xml
3. Bing：https://www.bing.com/webmasters（可用 GSC 导入，减少重复验证）
4. 记录验证状态与 sitemap 提交结果

**验收**：
- GSC 显示 www.temposoul.com 已验证（记录截图/状态）
- sitemap 已提交（显示"成功"或处理中）
- Bing 同样状态

**注意**：本线程不涉及代码；完成后回报验证状态即可。

---

## 协调说明

- 6 线程互相独立（文件范围隔离），可同时开 6 个对话框。
- 完成顺序不限；每个线程完成即按回报格式汇报，主控统一做：代码审查 → 合并到主分支 → 统一构建部署 → 记忆归档。
- 线程 F 需要用户配合（登录），建议尽早开。
- 若某线程遇到阻塞（文件找不到/依赖缺失/权限），回报阻塞点，主控协调，不无限重试。
