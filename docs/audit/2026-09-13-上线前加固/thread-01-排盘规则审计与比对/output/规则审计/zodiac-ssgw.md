# 规则审计分表 · zodiac 生肖 / ssgw 三山国王灵签

> T1·S2 批次1 ｜ 2026-09-13 ｜ 取证：Explore 代理深读 + ZCode 抽查复核（两条承重论断已实证）｜ 未证实处标【待核】
> 根 = `E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统`，core = `packages\core\src`

## zodiac 生肖

### 规则来源
- 干支关系全部复用 core\ganzhi\index.ts 公共层：文件头注释声明「深度整合 tyme4ts……直接委托 tyme4ts（按《钦定协纪辨方书》等实现的权威历法库）」（ganzhi\index.ts:1-12,15）。
- zodiac\index.ts:4-5 注释：「十二地支同支、合冲刑害破与三合三会固定关系表」；「生肖按立春为年界（调用方传入立春校正后的年柱）」。
- 六十甲子太岁星君名为硬编码表 TAI_SUI_STARS（zodiac\index.ts:40-101），加载时自检 60 项齐全无重名（:103-118）。

### 代码位置
- zodiac\index.ts：核心算法（犯太岁判定、年干五行关系、贵人/三会、太岁星君表）。
- zodiac\evidence.ts：关系矩阵结构化证据（4 步计算链、主/辅/反证、5 条限制）。
- zodiac\zodiacEvidence.ts：v3.0 四字段证据链构建（4 环节，depth 0-1）。
- tests\zodiac-evidence-trail.test.ts：仅测证据链契约。

### 输入契约
- capability（capabilities\index.ts:871-911）：inputs `zodiac`（text，必填，生肖或年支）、`year`（number，可选）、`yearGanZhi`（text，可选，「与流年年份至少提供一项；同时提供会校验一致性」）；supports 全 false；notes 声明「不根据运行日期静默选择流年」。
- 函数：`calculateZodiacYearFortune({zodiac, year?, yearGanZhi?})`（index.ts:220-226,395-400）；`year` 限 1900-2200（:241）；`getZodiacYearFortune(zodiacBranch, yearGanZhi)` 为底层入口。

### 输出契约
ZodiacYearFortune（index.ts:187-209）：zodiacBranch/zodiac/yearGanZhi/yearBranch/relation/elementRelation(kind+classification)/noble/meeting/conflicts[]（值冲刑害破五类，:120-124）/favorableRelations/riskRelations/actionSignals/evidenceAnalysis/prompt/evidenceTrail。

### 边界处理（年界口径）
- 便捷入口 resolveYearGanZhi 用固定 2 月 10 日探针取年柱：`getGanZhiFromDate(new Date(year, 1, 10, 12, 0, 0))`，注释「2 月 10 日一定在立春之后」（index.ts:246-249）。**ZCode 抽查已实证**（读 :240-262 原文一致）。
- getGanZhiFromDate 委托 tyme4ts `EightChar.getYear()`（ganzhi\index.ts:469-478）——年柱本身仍按 tyme4ts 节气口径。

### 判定与疑点
- **B 类（口径文档化）**：2 月 10 日探针是启发式。天文上立春落在 2 月 3-5 日（1900-2200 区间成立），探针结果正确；但正确性依赖「立春≤2 月 5 日」这一未校验前提，且与 paipan-boundary 用的节气直取路径不一致。建议：改为直接用 tyme4ts 节气 API 校验立春日期后取年柱，或至少在注释/limitations 声明前提。
- 【待核】tyme4ts 年柱是否确按立春换年，代码注释只写「已含节气换月」（ganzhi\index.ts:469），未显式声明年界口径；`getZodiacYearFortune` 直接收 yearGanZhi 不做立春校正，完全依赖注释约定。
- 【待核】`zodiac` capability 的端到端测试未见（仅 core-client.test.ts 引用）；evidenceTrail 测试只覆盖 `{zodiac:'鼠', year:2025}` 单一路径，无立春前后对比用例（bazhai 有，zodiac 无）。
- 【待核·D类】刑太岁直接用 `isSanxing`（三刑组任两支），未区分「三刑需三支齐全」的口径（index.ts:153-158）——属流派口径，需专家裁决后文档化。

## ssgw 三山国王灵签

### 规则来源
- 算法文件头（divination\algorithms\ssgw.ts:9-16）：「当前三山国王签谱资料；不同庙本的签序、题名和字句可能存在差异」；注明文件是**随机抽签**。
- 纯静态签文库：ssgw-data\index.ts:8-9「共 92 签，源自官方版本」，SIGNS_FULL 逐签注入 8 字段解读（SSGW_INTERPRETATION_FIELDS，ssgw-data\types.ts:1-10）；interpretation.ts:857-868 缺任一签解读即 throw（数据完整性由加载期强制）。
- 不直接排盘，仅经 getDivinationTime 取干支/时间戳（calendar\timeManager.ts:103-113，时区默认东八）。

### 代码位置
- divination\algorithms\ssgw.ts：drawRandomSign（随机抽）+ resolveSignByNumber（按号查签）。
- divination\ssgw-data\：index（92 签汇总）、types、interpretation（逐签 7 元组解读+89-92 签核心寓意覆盖）、signs-full.ts（权威 92 签）、signs-01/02/03.ts。
- divination\ssgw-content.ts：story 与 details.典故 去重合并（归一化标点后互含判断）。
- divination\ssgwEvidence.ts：四字段证据链（4 环节）。shared\random.ts：seed/replay/自定义源随机基建。

### 输入契约
- capability（capabilities\index.ts:739-763）：methods `random`(默认)/`manual`；inputs `number`（manual 时必填 requiredWhen）+ question；supports= randomSupports（seed/replay/customRandomSource 均 true）。
- 函数：`drawRandomSign(options?|customDate?, options?)`，`RandomOptions={seed?, replay?, random?, rng?(deprecated)}` 四者互斥（random.ts:5-13,199-261）；`resolveSignByNumber(number, customDate?)`，签号须 1-92 整数（ssgw.ts:82-84）。

### 输出契约
SsgwData（src\types\divination.ts:1365-1382）：number/title/poem/story/details/timestamp/ganzhi/draw{method,poolSize,selectedIndex,selectedNumber}/meta（含 random 轨迹 trace：mode/seed/samples，ssgw.ts:70-75）/evidenceTrail。

### 边界处理
- 可复现：randomInt(92, ctx.random)（ssgw.ts:56）用 32 位等宽桶+拒绝尾部消模偏差（random.ts:271-285），每次抽签恰消耗 1 个样本；trace 记录 mode/seed/samples 可重放。测试：同 seed 两次抽签签号相等（tests\divination-random-source.test.ts:28-39）；manual 路径 meta.random 为 undefined（tests\divination-engine.test.ts:4196-4202）。
- 数据完整性：SIGNS_FULL id 实测 1-92 连续无缺口；测试断言 length=92 且 id 序列=1..92、签题/签诗非空（tests\divination-engine.test.ts:58-66）；92 签在 interpretation.ts:18-847 均有解读。

### 判定与疑点
- **A 类（真 bug，ZCode 抽查已实证）**：证据链出处归错体系——ssgwEvidence.ts:36 `source: { type: 'classical', name: '观音灵签（第一百签）体系' }`、:92 `name: '观音灵签签文与注解'`，而数据是三山国王 92 签。证据链会把错误的古籍出处呈现给用户/下游。建议修复：source 改为「三山国王签谱（92 签）」+ limitations 保留「不同庙本存在差异」。:42 counterEvidence 提「不同灵签体系（观音/关帝/吕祖）」属合理的替代体系说明，可保留。**【✅ 已修复 @ ef0cb90，2026-09-13，thread/t1-paipan-audit 分支，含回归断言（不得混入观音/关帝/吕祖），ssgw+api 三测试文件 112/112 绿】**
- 【待核】signs-01/02/03.ts（20+20+21=61 签）未被任何文件 import，是与 signs-full 并存的旧版残料，存在双源风险——建议删除或归档。
- 【待核】details 键名不统一（「事业/求职」vs「事业」、吉凶/解签总论/此签核心/提醒混用），仅 interpretation 注入的 8 字段有类型保证，原始键无 schema 约束（signs-full.ts:10-20）。
- 【待核】签文库无来源文件/校验和佐证，「官方版本」仅为注释声明——S4 黄金样例需人工比对至少 1-2 个庙本。
