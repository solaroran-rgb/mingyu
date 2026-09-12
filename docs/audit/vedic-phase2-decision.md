# 吠陀占星 Phase 2 — 选型决策与落地记录

> **线程**：thread/vedic-p2
> **基线**：codex/website-basic-settings @ 0ac5808（core 测试基线 1528 全绿）
> **编制日期**：2026-09-12
> **范围**：选型拍板 + Phase 2 最小可用子集（D9 Navamsa + Vimshottari Dasha 起算），不做 Yoga/Dosha。

---

## 1. 选型结论（best-in-class）

**结论：继续自研，不引入 `jyotish-calc` / `@node-jhora/*` 等任何第三方运行时占星库。**

Phase 1 已选定 `astronomy-engine@2.1.19` 取九曜回归黄经，并自实现 Meeus 平均交点 / 黄赤交角多项式。Phase 2 只在这条已验证的天文路线上叠加**纯确定性查表/时间轴**层（D9、Vimshottari），运行时**零新增第三方依赖**。

### 1.1 六维对比

| 维度 | 自研（本线程） | 引入 jyotish-calc 黑盒库 | 判定 |
|---|---|---|---|
| **天文精度 / Meeus 路线一致性** | 沿用 Phase1 astronomy-engine + Meeus 交点/交角，D9·Dasha 为纯查表，与现有恒星黄经口径严格一致 | 纯 JS 近似星历，普遍 ±5″–30″，且自带一套 ayanamsa/交点实现，与本仓 Meeus 路线**第二源并存**，对盘易出 0.1° 级分歧，无法做统一证据链 | 自研胜 |
| **可维护性 / 溯源** | 表项（Rashi/Nakshatra/D9 起算/Dasha 年限）全部硬编码、可读、可手算断言，契合本仓"表格硬编码 + evidence 链"哲学 | 黑盒输出难对 1.3-02 古籍/卷册级溯源；作者活跃度低，bug 不可见 | 自研胜 |
| **开源许可** | 无新依赖，零许可风险 | MIT 类居多但未经审计；部分 jhora 系许可混杂、依赖嵌套 | 自研胜 |
| **离线 / SSR** | astronomy-engine 已验证离线 SSR；查表层纯算术 | 同样离线，但不透明 | 平（自研更可控） |
| **依赖体积 / tree-shaking** | 新增 `varga.ts`+`vimshottari.ts` 约 **< 8 KB 源码**，tree-shake 后对首页 gzip **≈ 0**（不进首页入口，仅 vedic 子路径导出） | 整包引入（含其自带星历/查表），即便按需 import 也带未使用分支，**破坏现有体积门**，需量化回测 | 自研胜 |
| **Cloudflare Workers 运行时** | 纯 JS 算术 + 已验证 astronomy-engine，无 wasm/无原生模块 | 纯 JS 库本身可跑，但若其间接依赖星历表/wrangler 产物需验证 | 自研胜 |

### 1.2 为什么不选 Swiss Ephemeris wasm 作运行时

与 g3 方案文档一致：`astrosk-wasm` 仅作 **devDependency 离线对拍 oracle**（P3 再固化 golden），**不进运行时**。理由：wasm 二进制在 Workers/Edge 的冷启动与兼容风险，以及 ~2–4 MB 体积，对本项目体积门不划算。Phase 2 的 D9/Vimshottari 本就不需要更高星历精度。

### 1.3 人日估算修正

g3 文档 P0–P3 全量估 **24–31 人日**（覆盖 D1 数据/Dasha/Varga/Yoga·Dosha/2000 例对拍）。其中：
- D1 骨架（P0）已在 Phase 1 交付。
- **本线程 Phase 2 实际增量 = D9 Navamsa + Vimshottari Maha/Antar 两级 ≈ 1.5–2 人日**（确定性查表，无星历增量）。
- 剩余 P3（Yoga/Dosha/2000 例对拍脚本）仍按 ~8–10 人日另立线程。

---

## 2. 关键常量勘误

g3 文档 §2.3 写 Vimshottari 年限 `...Saturn 19 / Mercury 16 = 120`，**算术错误**：
`7+20+6+10+7+18+16+19+16 = 119`。多源核对（BPHS 通行表、paramarsh/vidhata/myastro360 等）标准值为
**Budha（Mercury）= 17 年**，九项之和恰为 **120**。本实现采用 **Budha=17**，并以单测断言 `Σ=120` 固化。

---

## 3. Phase 2 交付内容

| 能力 | 文件 | 说明 |
|---|---|---|
| D9 Navamsa 分盘 | `packages/core/src/vedic/varga.ts` | Parashari Chara 规则：移动宫自宫、固定宫 +8、双元宫 +4；每 Rashi 9 等分（3°20′） |
| Vimshottari Dasha | `packages/core/src/vedic/vimshottari.ts` | 起运星 + balance → 120 年主星序列；Antardasha 按 大运×段主星/120 切分；`locateVimshottariAt` 定位当下 |
| 主入口接线 | `packages/core/src/vedic/index.ts` | `vargas.D1/D9`、`vimshottari` 落位输出，导出新 API |
| 证据链 | `packages/core/src/vedic/vedicEvidence.ts` | 追加"Vimshottari 起算""D9 Navamsa"两条证据（depth 1） |
| 类型 | `packages/core/src/vedic/types.ts` | `VedicVarga`/`VedicVargaPlacement`/`VimshottariResult` 收紧原 `unknown` 占位 |
| 测试 | `tests/vedic-p2.test.ts` | 11 例 golden，期望值来源见下 |

**不做**：D10/D12/D60、Yoga/Dosha、Pratyantar/Sookshma 三级以下 Dasha、KP/Raman/Fagan-Bradley 岁差切换——均留后续线程。

---

## 4. 测试期望值来源（可复算）

- **D9 落点**：Parashari Chara 起始规则逐一手算（如 30° Vrishabha 起 Makara=9；60° Mithuna 双元起 Tula=6；120° Simha 固定 +8 回 Mesha=0），非外部库输出。
- **Dasha 年限**：BPHS 标准表 `7/20/6/10/7/18/16/19/17=120`；Antardasha `Ketu-Ketu=7×7/120=0.40833`、`Ketu-Shukra=7×20/120=1.16667` 手算。
- **balance 时间轴**：日历年取 365.25 日/年（与星历日计数一致），balance=0.5 → 首大运提前 3.5 年起、出生点落剩余半段。
- **全量排盘**：仅结构/自洽断言（10 落位、起运星=月亮宿主星、九段合计 120、每大运 Antardasha 之和=大运年限），不锁死天文数值（数值由 astronomy-engine 决定，与 Phase1 同源）。

---

## 5. 运行依赖与体积

- **运行时新增 npm 依赖：0**。D9/Vimshottari 为纯 TS 查表/算术。
- 体积增量：两个新文件源码合计 < 8 KB；vedic 为子路径导出，不进首页入口，对首页 gzip 体积门影响 **≈ 0**。
- Cloudflare Workers：纯算术，无 wasm/原生模块，兼容已验证的 astronomy-engine 路径。

---

## 6. 验收

- core：Phase1 16 例 + Phase2 11 例全绿；全量 core 由基线 1528 增至 **1539**。
- api / prompt：不回归（见提交记录）。
