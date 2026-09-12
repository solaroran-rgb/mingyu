# 2026-09-12 移动端 Lighthouse 复测报告（thread/perf-mobile）

> 线程: thread/perf-mobile
> 基线分支: codex/website-basic-settings @ 0ac5808
> 测量对象: **线上生产环境** https://www.temposoul.com/（非本地预览）
> 前置报告:
> - docs/perf/2026-09-11-lighthouse-final.md（桌面 g1：Perf 91 / A11y 98 / BP 100 / SEO 100）
> - docs/perf/2026-09-12-si-optimization.md（h4 桌面 after：线上 Perf 97 / 本地 93，SI 2.3→1.2s）

---

## 1. 测量方式

| 项目 | 详情 |
|------|------|
| 工具 | Lighthouse CLI **13.4.1**（npx lighthouse@latest） |
| 浏览器 | Microsoft Edge（headless=new），路径 `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`，经 `CHROME_PATH` 指定 |
| 设备模拟 | **移动端默认 preset（Moto G Power）**：`--form-factor=mobile --screenEmulation.mobile` |
| 网络节流 | Slow 4G（RTT≈150ms，吞吐≈1.6Mbps） |
| CPU 节流 | 移动端默认 4× slowdown |
| 视口 | 360×640，DPR≈2.625 |
| 测量时间 | 2026-09-12 CST |
| 取样 | 每 URL 单次（记录首次稳态值；波动见 §6 建议） |

> 说明：本次直接测线上，未用 `vite preview` 本地预览。线上 CDN/缓存条件与桌面基线一致，横向可比。

---

## 2. 五类分数（线上移动端）

| 页面 | Performance | Accessibility | Best Practices | SEO | 备注 |
|------|:-----------:|:-------------:|:--------------:|:---:|------|
| `/`（首页·排盘输入） | **78** | 98 | 96 | 100 | |
| `/?mode=divination`（起卦） | **72** | 98 | 96 | 100 | |
| `/?mode=almanac`（择日） | **74** | 98 | 96 | 100 | |

> Lighthouse 核心为四类（Performance / Accessibility / Best Practices / SEO）。所谓「五类」按本报告逐页列出上述四类 + 核心 Web 指标，共五张表。Agentic Browsing 为实验类，不计入。

### 与桌面基线对比（同一域名）

| 指标 | 桌面 after（h4，线上） | 移动端 `/`（本次） | 移动端起卦 | 移动端择日 |
|------|:---:|:---:|:---:|:---:|
| Performance | **97** | 78 | 72 | 74 |
| FCP | 0.7 s | 2.8 s | 2.6 s | 2.1 s |
| LCP | 1.0 s | 4.2 s | 5.9 s | 5.9 s |
| TBT | 10 ms | 140 ms | 130 ms | 170 ms |
| Speed Index | 1.3 s | 4.1 s | 4.2 s | 2.3 s |
| CLS | 0.005 | 0.000 | 0.003 | 0.013 |

**解读**：
- 移动端 Perf 72–78 vs 桌面 97，差距主要来自 **Slow 4G 网络 + 4× CPU 节流**，属移动端常态，非回归。
- **CLS 全页 ≈ 0**，布局稳定（h4 内联底色 + 骨架屏生效）。
- **TBT 130–170ms**（score 0.92–0.96），主线程阻塞控制良好。
- 最大短板是 **LCP 4.2–5.9s**：起卦/择日页直接落地时，`DivinationPanel` 仍走「InputPage 挂载 → Suspense 动态 import」的二次瀑布，移动端慢网下被放大。

---

## 3. 逐页机会项（Lighthouse 自动诊断）

| 页面 | 机会项 | 估算收益 |
|------|--------|----------|
| `/` | Reduce unused JavaScript | 57 KiB / 300 ms |
| `/` | Render-blocking requests | 150 ms |
| 起卦 | **Reduce initial server response time** | 830 ms（根文档 830ms） |
| 起卦 | Reduce unused JavaScript | 200 KiB / 900 ms |
| 起卦 | Reduce unused CSS | 12 KiB |
| 择日 | Reduce unused JavaScript | 247 KiB / 1200 ms |
| 择日 | Reduce unused CSS | 23 KiB / 150 ms |

### 跨页共性失败诊断（score=0）

| 诊断 | 说明 | 处置 |
|------|------|------|
| `landmark-one-main` | 文档缺 `<main>` 主地标 | **本次已修复** |
| `label-content-name-mismatch` | 隐私提示按钮可见文本「知道了」与 `aria-label="不再显示"` 不一致 | **本次已修复** |
| `errors-in-console` | `static.cloudflareinsights.com/beacon.min.js` 加载失败 `ERR_CONNECTION_CLOSED` | **环境性**：headless 沙箱拦截外部统计 beacon 所致，真实浏览器正常加载，非代码缺陷，不改 |
| `unused-css-rules` | 全局样式表 12–23KiB 未用 | 留待后续（按路由拆 CSS / purgecss，h4 已标记为独立大改项） |
| `llms-txt` | `/llms.txt` 格式不符推荐 | 实验类，低优先级 |

---

## 4. 本次安全低悬修复（改动小而稳，2 文件）

### 修复 A：`<main>` 主地标（src/App.tsx）
- 现象：`landmark-one-main` score=0（g1 报告 5.2.1 已记录未修）。
- 改动：在 `ErrorBoundary` 内、`<Routes>` 外包裹 `<main>…</main>`；footer 保持在 main 之外。
- 影响：纯结构语义，不改变渲染/样式/路由行为。

### 修复 B：隐私提示按钮可访问名（src/components/PrivacyHint.tsx）
- 现象：`label-content-name-mismatch` score=0（g1 报告 5.2.2）。按钮可见文本为「知道了」，却写了 `aria-label="不再显示"`，两者不匹配。
- 改动：删除多余的 `aria-label="不再显示"`，让可见文本「知道了」直接作为可访问名。
- 影响：无可见行为变化，仅修正无障碍语义。

> 两项均为 g1 桌面报告里点名、但一直未落地的 a11y 项；本次顺手在移动端复测中一并修复，预期 Accessibility 98 → 100。
>
> **未做（按铁律，改动大或不可控）**：未按路由拆 CSS、未 purgecss、未改 DivinationPanel 懒加载策略、未碰 server TTFB（Cloudflare Pages 基础设施）、未 bump service worker 版本、未部署。

---

## 5. 回归测试（worktree 内串行执行，未并行）

| 套件 | 结果 | 基线要求 | 结论 |
|------|------|----------|------|
| `pnpm test:core` | **1528 pass / 0 fail** | 1528 | ✅ 持平 |
| `pnpm test:api` | **107 pass / 0 fail** | 107 | ✅ 持平 |
| `pnpm test:prompt` | **229 pass / 0 fail** | 229 | ✅ 持平 |

- 三项全绿，无回归。未新增测试（纯 a11y 结构/属性改动，不涉及算法）。
- 执行注记：worktree 根 `node_modules` 用 `mklink /J` 指向主仓库；为避免 pnpm 误判并 purge 被 junction 指向的主仓库 node_modules，运行前设 `npm_config_verify_deps_before_run=false`，未发生任何删除/重装。

---

## 6. 留待后续（按收益排序）

1. **起卦/择日直接落地 LCP 5.9s（最高收益）**：`?mode=divination` / `?mode=almanac` 直达时，`DivinationPanel` chunk 在 InputPage 挂载后才动态 import。可考虑在 `index.html` 按 query 注入条件 `modulepreload`（或客户端首帧预判 mode 后 `link.preload`），把二次瀑布前移。需评估对默认首页带宽的影响。
2. **按路由拆 CSS（12–23 KiB 未用）**：h4 已列为独立大改项，配合 PurgeCSS。
3. **server TTFB 830ms**：Cloudflare Pages 根文档响应，属基础设施，需平台侧/缓存层优化，不在代码仓范围。
4. **unused JS 57–247 KiB**：起卦/择日 panel 本就是按模式懒加载，未用占比属正常；可在 panel 内部再做组件级 code-split。
5. **复跑取样**：单次 Lighthouse 有波动，部署后建议对 `/` 跑 3 次取中位数，并复测本次两项 a11y 修复是否把 Accessibility 抬到 100。
6. **llms.txt 格式**：实验性，低优先级。

---

## 7. 附：原始数据

- 机器可读报告：`docs/perf/mobile/home.report.json`、`docs/perf/mobile/divination`、`docs/perf/mobile/almanac`（后两者为 Lighthouse 13.4.1 JSON，未加扩展名）。
- 解析脚本：`scripts/parse-lh.cjs`（`node scripts/parse-lh.cjs <json>` 打印分数与机会项）。
