# 吠陀占星（Jyotish）体系接入方案 — 排期与架构评估

> **线程**：thread-g3-vedic（第二轮 g3）
> **基线**：codex/website-basic-settings @ cbeb64c（worktree：`.temposoul-wt/thread-g3-vedic`）
> **范围**：纯文档调研，不改 `packages/core/src` 引擎代码；只交付本文。
> **编制日期**：2026-09-11

---

## 1. 现状与缺口

### 1.1 第一轮 468 红线条目定位

吠陀占星（Vedic Astrology / Jyotish）是 1.2 节"排盘引擎法理与流派溯源（21 体系）"中唯一整段未独立实现的体系，对应 `docs/audit/468-redline-mapping.md` **1.2-96 ~ 1.2-105 共 10 项，全部 partial**：

| ID | 检查项（要点） | 第一轮状态 | 缺口说明 |
|---|---|---|---|
| 1.2-96 | Ayanamsa 锁定：默认 Lahiri（印度天文台年度更新），提供 KP / Raman 切换 | partial | core 无独立 ayanamsa 函数；`astrolabe.ts` 的恒星黄道开关是西洋 sidereal，未走 Lahiri |
| 1.2-97 | 恒星黄经 = 热带黄经 − Ayanamsa，独立函数 | partial | 仅 `qi_zheng/index.ts:776 toSidereal()` 用 IAU 2006 岁差（`getPrecessionOffset`），非 Lahiri，不能复用 |
| 1.2-98 | 27 Nakshatra 边界：每宿 13°20′，宿名/主星/deity 硬编码 | partial | 无；现有二十八宿是中国体系（`qi_zheng/mansion-boundaries.ts`），不是印度 27 宿 |
| 1.2-99 | Vimshottari Dasha：120 年周期，以月亮星宿主星起运，9 星顺序硬编码 | partial | 无任何 Dasha 时序模型 |
| 1.2-100 | 分盘 Varga：D1 本命 / D9 Navamsa / D10 Dasamsa / D12 / … | partial | 无任何分盘算法 |
| 1.2-101 | D60 Shashtiamsha 业力盘，与 D1 联动 | partial | 无 |
| 1.2-102 | Yoga 判定：Gajakesari / Pancha Mahapurusha（Ruchaka/Hamsa/Malavya/Bhadra/Sasa）/ Dhana | partial | 无 |
| 1.2-103 | Dosha 判定：Mangal（火星缺陷）/ Kaal Sarp（蛇噬）/ Pitra（祖先） | partial | 无 |
| 1.2-104 | 交叉验证：2000 组生辰对 Jagannatha Hora / AstroSage，黄经偏差 ≤ 0.05° | partial | 无测试用例集 |
| 1.2-105 | 南印度（星座固定）/ 北印度（宫位固定）两种星盘样式切换 | partial | 前端布局数据契约未定义 |

> 备注：468 映射矩阵头部写"astrolabe 用 astronomy-engine 2.1.19"，但 cbeb64c 实际 `packages/core/src/divination/algorithms/astrolabe.ts` 已改用 **`celestine@^0.2.1`** 作为西洋盘计算层（celestine 内部仍封装星历）；`qi_zheng/index.ts` 直接用 `astronomy-engine@2.1.19`。本方案以 cbeb64c 实际代码为准。

### 1.2 可复用资产盘点

| 资产 | 位置 | 复用方式 |
|---|---|---|
| 行星黄经计算 | `qi_zheng/index.ts:19-64` 已封装 `astronomy-engine` 动态 import 样板（Node22/Rollup 兼容） | 直接复制该样板；太阳/月亮/水金木火土/罗睺计都黄经复用 |
| 时区/民用时间解析 | `calendar/civil-time.ts resolveCivilTime`（IANA tzdata + 历史偏移） | 直接复用，吠陀排盘必须用民用钟时→UT，**不得**套用中式真太阳时 4 分/度修正（ASC 由 astronomy-engine 用 UT+经度自行求解） |
| 真太阳时证据链 | `calendar/true-solar-time.ts` | 仅作为可选展示证据输出，不参与排盘计算（与西洋盘同策略） |
| 日月食/月相证据 | `calendar/moon-phase-evidence.ts`、`solar-illumination-evidence.ts` | 直接复用，填入 evidenceTrail |
| 输入校验 | `shared/validation.ts` + `calendar/date-validation.ts` | 直接复用；经纬度 ±90/±180、年份 1900-2100 等 |
| 证据链契约 | `shared/evidence.ts` + 各 `*Evidence.ts` / `buildXEvidenceTrail` | 新增 `vedicEvidence.ts` 同构实现 |
| 包导出模式 | `packages/core/package.json` `"./divination/astrolabe"` 等子路径导出 | 新增 `"./vedic"` 导出，对齐现有子路径风格 |
| 星盘数据结构范式 | `types/divination.ts: AstrolabeBirthInput / AstrolabePoint / AstrolabeData` | Vedic 输入/输出接口按此范式设计（见 §3） |

---

## 2. 数据源与算法选型对比

### 2.1 核心天文层：行星位置

**结论：继续复用 `astronomy-engine@2.1.19`，不引入新星历。**

- `qi_zheng` 已验证它可在 Node22 + Rollup 下稳定输出日/月/五星黄经，并支持月球交点（Mean Node / True Node）。
- 吠陀占星只需要 9 Graha：Surya（日）、Chandra（月）、Mangala（火）、Budha（水）、Guru（木）、Shukra（金）、Shani（土）、Rahu（升交点）、Ketu（降交点）——全部是 astronomy-engine 的现成 `Body`。
- **不引入天王/海王/冥王/小行星**（传统 Jyotish 不用，与西洋盘区分）。

### 2.2 Ayanamsa：三选一

| 方案 | 精度 | 依赖 | 风险 |
|---|---|---|---|
| **A. 自研 Lahiri 查表 + 线性项**（推荐） | ±0.1″（1900-2100 内置 IAE 表） | 无 | 需维护查表；与 Swiss Ephemeris `SE_SIDM_LAHIRI` 对拍 2000 例 |
| B. 引入 `astrosk-wasm`（Swiss Ephemeris WASM） | ±0.001″，原生支持 Lahiri/True Chitra/KP/Raman/Fagan-Bradley | ~2-4 MB wasm，增加冷启动 | 包体积；wasm 在 Cloudflare Workers/Edge 的兼容性需验证 |
| C. 引入 `vedic-astrology` / `jyotish-calc` / `@node-jhora/prediction` 等纯 JS 库 | 各家不一，普遍 ±5-30″ | npm 依赖，作者维护活跃度低，许可证多为 MIT 但未经审计 | 与本仓"表格硬编码 + evidence 链"哲学冲突；黑盒库难以做 1.3-02 古籍/卷册级溯源 |

**推荐：P0 用方案 A 落地，P2 结束前用方案 B 的 wasm 构建一次性离线对拍脚本（不进运行时依赖）**，把对拍偏差固化成 golden test。这样既不增加运行时体积，又能拿到 Swiss Ephemeris 级精度作为裁判。

> Lahiri（Chitra Paksha）锚点：Spica（Chitra）位于恒星黄经 180°。工程近似公式（来自印度历改委员会 1955 方案，Swiss Ephemeris 实现）：
> `ayanamsa(J2000) ≈ 23.853°`，速率 `≈ 50.29″/年`（2000 年 ≈ 23.858°，2026 年 ≈ 24.20°）。生产实现必须用查表 + 二次项，不能只用线性式。

### 2.3 传统表格层：全部自研硬编码

下列内容都是确定性查表/算术，与本仓 `qi_zheng` 的 `DIGNITY`/`MING_ZHU`、六爻纳甲表、奇门 60 组克应表同一哲学：

- 12 Rashi：Mesha / Vrishabha / Mithuna / Karka / Simha / Kanya / Tula / Vrishchika / Dhanu / Makara / Kumbha / Meena（中英梵三语标签硬编码）。
- 27 Nakshatra（Ashwini … Revati，各 13°20′）+ 4 Pada（各 3°20′）+ 主星（dasha lord）+ deity + 象征星（对应恒星，如 Ashwini=β Ari）。
- Vimshottari Dasha 序列与年限：Ketu 7 / Venus 20 / Sun 6 / Moon 10 / Mars 7 / Rahu 18 / Jupiter 16 / Saturn 19 / Mercury 16 = 120 年。
- D9 Navamsa（Parashara chara navamsa 规则：Chara/Rashi 起始步进规则硬编码）、D10、D12、D60 的分度规则表。
- Yoga / Dosha 判定规则（见 §4 P3）。

### 2.4 开源库评估结论

| 库 | 用途定位 | 是否引入 |
|---|---|---|
| `astrosk-wasm` | 离线对拍 oracle（Swiss Ephemeris 全 ayanamsa 支持） | **仅 devDependency**，CI 跑对拍，不进运行时 |
| `openastrology-library` / `node-jhora` / `jyotish-calc` | 功能参考（Dasha 树、Ashtakavarga） | **不引入**，读源码参考算法，自研实现 |
| Jagannatha Hora（Windows 桌面） | 人工对拍 oracle | 保留 20-30 组知名命例作为 golden fixture |
| AstroSage / Prokerala 在线排盘 | 人工对拍 oracle | 同上，不做运行时 API 依赖（网络不确定性 + ToS） |

---

## 3. API 接口设计（对齐现有引擎风格）

### 3.1 输入 `VedicBirthInput`

对齐 `AstrolabeBirthInput`（`packages/core/src/types/divination.ts:1081`）的字段风格：

```ts
export interface VedicBirthInput {
  name: string;
  gender: '男' | '女' | '不确定';
  year: string; month: string; day: string;
  hour: string; minute: string;
  latitude: string;          // 十进制度，南纬为负
  longitude: string;          // 十进制度，西经为负
  timezone?: string;          // 与 AstrolabeBirthInput 一致：timezone 与 timeZoneId 二选一
  timeZoneId?: string;        // IANA，如 Asia/Kolkata
  useTrueSolarTime?: boolean; // 默认 false；true 时仅附加真太阳时证据，不改排盘瞬间
  ayanamsa?: 'lahiri' | 'kp' | 'raman' | 'fagan-bradley'; // 默认 'lahiri'
  nodeMode?: 'mean' | 'true'; // 默认 'mean'（吠陀传统用平均交点），与七政四余真交点区分
  chartStyle?: 'north' | 'south'; // 默认 'north'，仅影响布局元数据
}
```

### 3.2 输出 `VedicData`

```ts
export interface VedicData {
  birth: { /* 与 AstrolabeData.birth 同构：dateTime/lat/lng/timezone/timeZoneId/evidence */ };
  ayanamsa: {
    system: 'lahiri';
    degrees: number;          // 24.xxxx
    source: 'IAE-2024-table'; // 版本号入证据链
  };
  lagna: VedicPoint;          // 上升点，长在 Rashi 内的精确度数
  grahas: VedicPoint[];       // 9 颗（Rahu/Ketu 标注 mean node）
  nakshatra: {
    birthMoon: { name: string; pada: 1|2|3|4; lord: string; };
    balance: number;          // 出生时本命 Nakshatra 已过比例 0..1
  };
  vimshottari: {
    mahaDasha: VedicDashaPeriod[];     // 从出生起 120 年主星序列
    current?: VedicDashaPeriod;       // 调用时当下所在 Maha/Antara
  };
  vargas: {
    D1: VedicVarga;                 // 本命盘（= grahas + lagna 的 rashi 视图）
    D9?: VedicVarga;                // Navamsa，P2 交付
  };
  yogas: { name: string; sanskrit: string; planets: string[]; evidence: string }[];
  doshas: { name: string; severity: 'high'|'medium'|'low'|'none'; cancellation?: string }[];
  chartLayout: { style: 'north'|'south'; cells: ... }; // 前端渲染元数据
  evidenceAnalysis?: VedicEvidenceAnalysis;
  evidenceTrail?: EvidenceTrail;
  timestamp: number;
}

export interface VedicPoint {
  name: string;          // Sun / Moon / ... / Rahu / Ketu
  label: string;         // 太阳 / 月亮 / ... / 罗睺 / 计都
  tropicalLongitude: number;
  siderealLongitude: number;
  rashi: string;         // 梵名+中文名
  degreeInRashi: number;
  nakshatra: string;
  pada: 1|2|3|4;
  bhava: number;        // Whole Sign 1-12
  retrograde: boolean;
  formatted: string;     // 如 "Vrishabha 12°34′"
}
```

### 3.3 入口与导出

- 主函数：`packages/core/src/vedic/index.ts` → `export function generateVedicChart(input: VedicBirthInput): VedicData`
- 包导出：`packages/core/package.json` 新增 `"./vedic": { types: "./dist/vedic/index.d.ts", import: "./dist/vedic/index.js" }`
- evidence：`packages/core/src/vedic/vedicEvidence.ts` 同构 `astrolabeEvidence.ts`
- 在 `DivinationData` 联合类型（`types/divination.ts:1392` 附近）追加 `| VedicData`
- 在 `capabilities/index.ts SYSTEM_CAPABILITY_IDS` 登记 `vedic` 能力位（对齐 2.3-01 路由）

---

## 4. 分阶段实施计划

### P0 · 核心排盘（D1 本命盘）— 预计 6-8 人日

交付：1.2-96 / 1.2-97 / 1.2-98 / 1.2-105 主数据。

1. `ayanamsa.ts`：Lahiri 查表（1900-2100，5 年一格）+ KP / Raman / Fagan-Bradley 偏移常量；`tropicalToSidereal(tropical, year)` 独立函数。
2. `vedicRashi.ts`：12 Rashi 表；`longitudeToRashi(lon)`。
3. `nakshatra.ts`：27 宿表（梵名/中文名/主星/deity/象征星），`longitudeToNakshatra(lon) → { name, index, pada, lord }`。
4. `generateVedicChart`：复用 `resolveCivilTime` + astronomy-engine 取 9 Graha 黄经与 ASC；套 Whole Sign Bhava（以 Lagna 所在 Rashi 为第 1 宫）；逆行标记复用现有 `isRetrograde` 判据。
5. `chartLayout.ts`：北印度（宫位固定方格）/ 南印度（星座固定矩形）两种布局元数据。
6. 单测：`tests/vedic-ayanamsa.test.ts` / `vedic-nakshatra.test.ts` / `vedic-chart.test.ts`，含 5 组手算 fixture。

### P1 · Dasha 时序 — 预计 4-5 人日

交付：1.2-99。

1. `vimshottari.ts`：
   - 主星顺序 [Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury]，年限 [7,20,6,10,7,18,16,19,16]。
   - 出生时月亮 Nakshatra → 起运星 + 已过比例 → 剩余年数。
   - 展开 Maha Dasha 序列（120 年）+ 二级 Antardasha（Bhukti）按各主星年限比例切分。
   - `getCurrentVimshottari(chart, date)`：给定查询日，定位当下 Maha/Antara。
2. 单测：与 Jagannatha Hora 导出的 10 组命例对拍，起运星/剩余年数/当前 Dasha 0 误差（边界：出生当天恰在宿度交界处）。

### P2 · Varga 分盘 — 预计 6-8 人日

交付：1.2-100 / 1.2-101。

1. `varga.ts`：
   - **D9 Navamsa**（Parashara chara navamsa，最常用，优先）：每 Rashi 9 等分，步进规则硬编码（Charaparakramah 表）。
   - D10 Dashamsa（事业）、D12 Dwadashamsa（父母）：分段规则相对简单，随 P2 一起做。
   - D60 Shashtiamsha：60 分盘规则复杂，先做基础落位表，业力解读模板留 P3。
2. Varga 内 Lagna 重算：传统以 D1 Lagna 度数映射到分盘，不重新求 ASC。
3. 对拍：D9 是婚姻判断最常用盘，必须与 Jagannatha Hora D9 输出逐星对拍（偏差 ≤ 1 Navamsa 位）。

### P3 · Yoga / Dosha / 解读证据 — 预计 8-10 人日

交付：1.2-102 / 1.2-103 / 1.2-104 测试基建。

1. `yogas.ts`：
   - Pancha Mahapurusha（Ruchaka/Bhadra/Hamsa/Malavya/Sasa：Mangala/Budha/Shukra/Guru/Shani 在 own/exaltation 且落 Kendra 1/4/7/10）。
   - Gajakesari（Guru 与 Chandra 成 Kendra）。
   - Dhana Yoga（Dhanabhava 主与 Lagnabhava 主互相关联）。
2. `doshas.ts`：
   - Mangal/Kuja Dosha：Mangala 落 1/2/4/7/8/12 宫，带取消条件（Mangal 在 own/exaltation 或与 Shukra 合等）。
   - Kaal Sarp Dosha：7 颗行星全部位于 Rahu→Ketu 弧段内。
   - Pitra Dosha：Surya 或 Chandra 与 Rahu/Ketu/Shani 在特定宫位合相。
3. 2000 组对拍脚本（`scripts/vedic-crosscheck.mjs`）：随机生辰 × Lahiri ayanamsa × 随机经纬度，与 `astrosk-wasm` 离线输出比对，黄经偏差 ≤ 0.05°；结果落 `tests/fixtures/vedic-crosscheck/`。
4. evidenceTrail 文本模板：所有 Yoga/Dosha 命中附梵名 + 触发行星 + 度数证据，对齐 `qiZhengEvidence.ts` 风格。

### 工作量汇总

| 阶段 | 交付红线条目 | 人日 |
|---|---|---|
| P0 | 96/97/98/105（数据） | 6-8 |
| P1 | 99 | 4-5 |
| P2 | 100/101 | 6-8 |
| P3 | 102/103/104 | 8-10 |
| **合计** | **10 项 partial → pass** | **24-31 人日** |

---

## 5. 验收路径（逐项 pass 测试设计）

| 红线 ID | 验收用例 |
|---|---|
| 1.2-96 | 固定 50 个历史日期，本仓 Lahiri ayanamsa 输出 vs Swiss Ephemeris `SE_SIDM_LAHIRI` 偏差 ≤ 0.1″；KP/Raman/Fagan-Bradley 三档切换冒烟通过 |
| 1.2-97 | 任意 tropicalLongitude − ayanamsa(sidereal) 手算用例 20 组，公式 0 误差 |
| 1.2-98 | 27 宿边界度（0,13.3333,…,360）逐一边界用例；Pada 1-4 切换；deity/lord 查表全量快照测试 |
| 1.2-99 | 10 组 Jagannatha Hora 命例：起运星、出生剩余年数、当前 Maha Dasha 起止日 0 误差；Vimshottari 序列总长 = 120 年 |
| 1.2-100 | D1/D9/D10/D12 四盘逐星落位，与 JHora 对拍偏差 ≤ 1 Varga 位 |
| 1.2-101 | D60 盘规则表快照测试；与 D1 行星联动字段存在性测试 |
| 1.2-102 | 构造 30 张合成盘，分别命中 5 种 Mahapurusha Yoga + Gajakesari + Dhana Yoga，判定为 true；反例 30 张判定为 false |
| 1.2-103 | Mangal Dosha 6 个宫位各 1 例 + 取消条件 3 例；Kaal Sarp 全合弧/半合弧两例；Pitra 3 例 |
| 1.2-104 | `scripts/vedic-crosscheck.mjs` 跑 2000 组随机样本，graha sidereal longitude 与 astrosk-wasm 偏差 ≤ 0.05°，CI 门禁 |
| 1.2-105 | north/south 两种 chartLayout 元数据快照；前端消费字段契约测试 |

非红线条但必须做的工程验收：
- `tests/vedic-input-validation.test.ts`：复用 `shared/validation` 防呆（纬度越界、时区缺失、时辰未知降级）。
- `tests/vedic-evidence-contract.test.ts`：evidenceTrail 哈希幂等（对齐 1.3-03）。
- 性能基准：单盘排盘 ≤ 100ms（对齐 1.3-19 西洋占星档）。

---

## 6. 风险清单

| # | 风险 | 影响 | 缓解 |
|---|---|---|---|
| R1 | Lahiri 查表 vs Swiss Ephemeris 真值偏差 | ayanamsa 错 1′ 即可让 Nakshatra/Pada 边界案例翻案 | P0 内置 IAE 查表而非线性公式；P2 结束前用 astrosk-wasm 全量对拍固化 golden |
| R2 | Rahu/Ketu 平均交点 vs 真交点 | 七政四余用真交点，吠陀传统用平均交点；混用会被印度用户对盘打回 | `nodeMode` 显式入参，默认 mean；证据链标注节点模式 |
| R3 | 真太阳时误用 | 中式排盘习惯会把 4 分/度修正叠加到出生时刻；吠陀 ASC 由 UT+经度直接求解，叠加会偏移 | P0 代码评审明确：`useTrueSolarTime` 仅挂证据字段，不参与计算；文档显式标注 |
| R4 | 高纬度 ASC 畸变 | 同西洋盘 1.2-84：纬度 ≥ 66° 时 Whole Sign 仍可用（不依赖 house cusp），但必须降级提示 | 复用 astrolabe 高纬降级逻辑，Vedic 因 Whole Sign 天然免疫 Placidus 畸变，仅需提示 |
| R5 | Varga 流派分歧（Parashara vs Jaimini） | D9 以后各家分盘规则不同 | P2 只做 Parashari（主流）；Jaimini 分盘列入 backlog，不承诺 |
| R6 | 开源库质量/许可证 | 直接依赖年轻库可能带入黑盒 bug | 运行时零新增第三方占星库；astronomy-engine 已是锁定依赖；wasm 仅 devDependency |
| R7 | 2000 组对拍 oracle 获取 | Jagannatha Hora 仅 Windows；AstroSage 无官方 API | 用 astrosk-wasm（MIT，Swiss Ephemeris wasm）作为离线 oracle；人工抽 20 组与 JHora 核对 |
| R8 | 文化合规 | Dosha 文本（Kaal Sarp / Pitra）在印度市场易引发心理焦虑 | P3 文本模板走 `prompt/*` 越界约束（2.1-18 禁止医疗/心理恐吓），只描述倾向不下诊断 |
| R9 | 与西洋盘 sidereal 开关重复 | astrolabe 1.2-93 已有 tropical/sidereal 切换 | 明确边界：astrolabe 的 sidereal 是西洋 sidereal（Fagan-Bradley），吠陀模块独立 Lahiri 体系，不共享代码路径 |
| R10 | Dasha 子周期层数 | 红线只要求 Maha + Antar；要不要做 Pratyantar/Sookshma | P1 先做两级，三级及以后列入 P2 增量，不影响 1.2-99 pass |

---

## 7. 数据来源与参考书目清单

**天文/算法**
- Swiss Ephemeris `swe_version.h` / `sid_modes.h`（SE_SIDM_LAHIRI 实现参考，MIT/AGPL 双许可下仅读算法不拷贝代码）
- astronomy-engine 2.1.19 源码（`Body`/`Ecliptic`/`GeoVector`）
- Indian Astronomical Ephemeris（Lahiri ayanamsa 官方表）

**吠陀传统（L1 古籍锚定候选）**
- Parashara Hora Shastra（分盘 D9/D60、Mahapurusha Yoga 出处）
- Brihat Parashara Hora Shastra (BPHS)
- Phaladeepika（Nakshatra deity/Pada 表）
- Jaimini Sutras（仅作 backlog，本期不实现）
- K.S. Krishnamurti stellar astrology（KP ayanamsa 偏移参考）

**对拍 oracle**
- Jagannatha Hora 7.x（Windows 桌面，人工抽对）
- astrosk-wasm npm 包（CI 离线对拍）
- Prokerala / AstroSage 在线排盘（人工抽对，不做运行时依赖）

---

## 8. 待主控决策点

1. **自研 vs 开源运行时库**：本方案推荐"自研表格层 + astronomy-engine + wasm 离线对拍"（24-31 人日，零运行时新增占星依赖）。备选是直接引入 `jyotish-calc` 或 `@node-jhora/prediction` 作为运行时（约 12-15 人日，但黑盒、与 evidence 链哲学冲突、未审计）。**建议主控拍板前者。**
2. **Dasha 子周期深度**：P1 交付 Maha+Antar 两级是否够 pass 1.2-99？还是必须把 Pratyantar/Sookshma 一起做（+3-4 人日）？
3. **D60 Shashtiamsha 范围**：1.2-101 要求 D60 与 D1 联动解读模板；建议 P2 只做 D60 落位表，业力解读模板是否推到 P3 之后？
