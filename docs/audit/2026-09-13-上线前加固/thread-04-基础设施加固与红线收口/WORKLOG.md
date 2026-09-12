# WORKLOG · T4 基础设施加固与红线收口

> 状态标记：✅完成 / 🔄进行中 / ⚠️阻塞 / ❌失败（须写原因与替代路径）
> 接手顺序：本文件 → OUTPUT 清单 → 产物目录
> 执行者：ZCode（修复侧）；分支纪律：core/functions 改动走 `thread/t4-infra`，禁止部署线上

---

## 2026-09-13 04:20–05:00 · S0 接手 + S1 基线确认与复现 ✅

- 做了什么：
  - 读 README → 任务卡 → 三级检索漏斗（11_国学出海主地图 / guoxue-overseas 记忆 / 8877 memory query k=5）。已加载加固相关记忆 4 条（09-13 计划书、09-12 收口、09-11 treeshake、8877 检索）。最近状态：五线程合并全绿 1539/107/229，部署挂起（bump sw v6 未执行）。
  - 基线确认：分支 `codex/website-basic-settings` @ 8a1f7ae（thread/commerce 合并点），工作区有他人未提交改动（src/App.tsx / 网站搭建方案0830.md 等，不碰）。
  - 本地复现：`node _audit_20260912/run_local.mjs` → **10/10 全 OK**（bazi/ziwei/astrolabe/qizheng 四体系含全部边界样例），排除计算逻辑 bug。
  - 线上复现：`output/repro_503.py`（5 端点 × 10 样例 × 2 次 = 100 请求；注：python 默认 UA 被 CF 拦 403，须带浏览器头）+ `output/analyze_repro.py` 解析。
- 产物路径：`output/repro_503.py`、`output/analyze_repro.py`、`output/_raw_503_repro.json`、`output/01_503复现记录.md`
- 关键结论/数据：
  - **503 body 实为 `error code: 1102`**（17 字节，CF 边缘资源超限错误码），不是应用层 503。
  - 503 率 33%（ziwei 11/20、qimen 10/20、bazi 8/20、liuren 4/20），同一输入交替 503/200；503 快败（median 370ms），200 慢成（median 555ms，max 3.6s）。
  - 泛端点、与计算量正相关 → **CPU 超限**，非 ziwei 独有；推翻「ziwei 全 503 单端点问题」旧口径。
  - 另发现 1 个确定性 500 bug 与 2 处脚本契约问题（详见 02_根因分析.md）。
- 下一步：S2 根因成文 → S3 修复。
- 阻塞项：无。

## 2026-09-13 05:00–05:30 · S2 根因定位 ✅（三问题分层定性）

- 做了什么：handler / civil-time 源码对勘 + 本地最小复现 `output/repro_conflict.mjs`（含堆栈）。
- 产物路径：`output/02_根因分析.md`、`output/repro_conflict.mjs`
- 关键结论/数据：
  - **A · 503/1102**：CF Worker per-request CPU 超限（间歇性 = 冷/热 isolate 差异）；`src/lib/public-api/handler.ts` 静态导入全部 21 体系 → Pages Functions 冷启动模块初始化 CPU 逼近预算，重端点更易越限。
  - **B · 500 INTERNAL_ERROR（100% 复现）**：`packages/core/src/calendar/civil-time.ts` `resolveCivilTime()` 两处原生 `throw new Error`（timezone 与 timeZoneId 偏移冲突 / 夏令时回拨歧义未消解）→ handler `handleError` 兜底 500；而 OpenAPI schema 承诺「冲突时拒绝计算」应为 400。本地复现：`Error: timezone 固定偏移 UTC+8 与 America/New_York 在该当地时刻的历史偏移不一致。`（堆栈 civil-time.js:87 → true-solar-time.js:496）
  - **C · 400 × 2（审计脚本侧，非线上 bug）**：qizheng 契约要 `hour/minute/latitude/longitude`（脚本传 `birthHour`）；农历 case10 脚本传 month=7/day=30（该月不存在；正确为 month=6 + isLeapMonth，与 run_local.mjs 一致）→ 移交 T1 修 run_temposoul.py。
- 下一步：S3 修复（B 先行：civil-time throw 换 MingyuCoreError + 单测；A 走延迟加载策略另立项推进）。
- 阻塞项：无。

## 2026-09-13 05:30–06:30 · S3-B 修复（500→400）✅

- 做了什么：
  - 分支 `thread/t4-infra`，commit **98cad2a**：civil-time.ts 3 处 + historical-timezone.ts 4 处原生 throw → `MingyuCoreError(validation)`；handler 新增 `isMingyuCoreError` 跨 src/dist 副本判别（测试环境 instanceof 失效问题，详见 03_修复记录.md）；civil-time.test.ts + public-api.test.ts 各增回归断言。
  - 回归：**core 1539 / api 108（+1）/ prompt 229 全绿**，全部 ≥ 基线。
- 产物路径：`output/03_修复记录.md`（含 commit 明细与回滚方案：`git revert 98cad2a`）
- 关键结论/数据：时区冲突与夏令时跳时（两个线上 100% 复现 500 的输入）现返回 400 结构化错误码。
- 踩坑：本机 PATH 无 pnpm（只有 hermes node + corepack）→ `corepack enable --install-directory C:\Users\oran\AppData\Local\hermes\node` 生成 pnpm.cmd shim 后 test 脚本可跑；`set CI=true&&` 前缀防 pnpm 11 TTY 坑。工作区 package.json/pnpm-lock.yaml 的 three.js 改动属他人 sky 功能线，未纳入本 commit。
- 下一步：S3-A（1102 主修复：handler 21 体系静态导入 → 按端点延迟加载）→ S4 红线收口。
- 阻塞项：无。

## 2026-09-13 06:30–07:40 · S3-A 修复（1102/503 · handler 懒加载两片）✅（第三片待办）

- 做了什么：
  - 基线证据：`npx wrangler pages functions build --project-directory .` → **functions bundle 6916KB 单 Worker**（修复前），冷 isolate 首请求需评估全量模块图 → CPU 超限 1102 实证。
  - **Slice-1（commit 34da981）**：handler 去掉 `@temposoul/core` 根 barrel（bazhai/zodiac/taiyi/wuyunLiuqi/huangjiJingshi/qizheng/xuankong/residentialFengshui 八体系），改端点内 `await import('@temposoul/core/<sub>')`；MingyuCoreError 改走 `/result` 子路径。8 组 calculate/prompt 函数 async 化。bundle 6602KB；已验证 esbuild `init_*` 惰性闭包零顶层急切调用。
  - **Slice-2（commit 165a81f）**：ziwei（calculateZiweiRuntime/双盘合参）+ 占卜十一术（liuyao/qimen/meihua/liuren/xiaoliuren/jinkoujue/tarot/ssgw/almanac/lenormand/astrolabe）全链 async 化 + 端点内动态 import；almanac shaping 与组合占卜 prompt 链同步改造。
  - 回归：**test:api 108/108 + test:prompt 229/229 全绿**（两片各跑一次）；tsc 对改动文件零错误。
- 产物路径：commits 34da981 + 165a81f（分支 thread/t4-infra）；bundle 基线 `%TEMP%\t4_fn_before`（6.9MB）。
- 关键结论/数据：
  - 修复原理：静态导入的模块图在冷 isolate 首请求全量求值；改端点内动态 import 后每端点只付自己子图的初始化 CPU。体积持平（esbuild 内联惰性闭包）是预期行为，收益在延迟初始化。
  - **真实验证须主控部署后跑 `repro_503.py` ≥3 轮 × 100 请求 0 个 5xx**（本机不可部署）。
- 下一步：第三片（bazi/calendar 静态链 + core/prompt 文本 barrel ×4 本地 re-exporter 懒加载，方案已写在 03_修复记录.md）→ S4 红线收口。
- 阻塞项：无。

## 2026-09-13 07:40–08:30 · S4 红线收口 + S5 共享基座 + S6 回归 + S7 报告 ✅

- 做了什么：
  - **S4**：核实「2 fail」实为 g2（09-11）已修复（`tests/utc-tt-samoa.test.ts` 6/6 直跑实证）；`468-redline-mapping.md` 表头陈旧已同步（pass 166 / partial 131 / **fail 0** / na 195，1.1 行 19/3/0）；131 项 partial 三态判定排期表生成（`output/04`，脚本 `gen_schedule.py` 可重跑）：3 建议改 pass（吠陀组 vedic-p2 已实证 `vedic/ayanamsa.ts`+`vimshottari.ts`+双测试）/ 80 补证据（10 项 P1 建议上线前必做）/ 48 集成层排期；2.1 组 24 项归 T2 联动。矩阵 v2 建议版 = `output/05`。
  - **S5**：`shared/` 三件套（样例集 schema / 评测指标口径 / archetype_key 术语键约定）。
  - **S6**：回归报告 `output/06`（1539/108/229 ≥ 基线）+ CI 门禁建议。
  - **S7**：审计总报告 `output/审计报告_基础设施加固与红线收口.md`（含移交主控清单与踩坑 6 条）。
- 产物路径：见审计报告 §二。
- 关键结论/数据：T4 代码侧全部完成；**验收第 1 条（线上 0×5xx）待主控部署后跑 `repro_503.py` 3×100**。
- 下一步：主控收口（部署 + 矩阵确认）；第三片懒加载为可选优化。
- 阻塞项：CF 套餐档位确认（影响 1102 残余风险评估）——主控。
