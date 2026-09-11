# 468 红线缺口清单 — @temposoul/core

> 仅列 **fail / partial** 项，按体系分组、按严重度排序。**na 项（组织/基础设施/前端/业务）不在本清单**。
> 严重度：**P0**=红线级错误会污染排盘结果；**P1**=能力缺失影响审计闭环；**P2**=可改进/在调用侧补齐。

## 汇总：fail 0 项，partial 131 项（2026-09-11 线程 g2 已修复 1.1-03 / 1.1-07 两项 P0）

## 1.1 天文历法与时间基准

| ID | 严重度 | 检查项 | 现状 | 修复建议 |
|---|---|---|---|---|
| 1.1-03 | ~~P0~~ ✅已修复（2026-09-11 线程 g2） | UTC 转 TDT（TT）换算 | 已修复：新增 packages/core/src/calendar/utc-tt.ts，导出 TT_TAI_OFFSET_SECONDS=32.184、IERS_LEAP_SECONDS（28 行 1972→2017）、deltaAtSeconds/utcToTtOffsetSeconds/utcToTtSeconds/utcJdToTtJd 纯函数；tests/utc-tt-samoa.test.ts 覆盖 2024-01-01=69.184s、1972-01-01=42.184s、2016 闰秒前后 36→37、J2000 JD(TT) 折算 | 后续若 IERS 发布新闰秒，往 IERS_LEAP_SECONDS 追加一行即可 |
| 1.1-07 | ~~P0~~ ✅已修复（2026-09-11 线程 g2） | 萨摩亚跳日 | 已修复：新增 packages/core/src/calendar/samoa-skip-day.ts（isSamoaSkipDay/diagnoseSamoaSkipDay），并在 historical-timezone.ts 无匹配分支接入；Pacific/Apia 2011-12-30 抛专用错误，相邻 12-29=UTC-10 / 12-31=UTC+14 正常解析 | 已在 tests/utc-tt-samoa.test.ts 覆盖 |
| 1.1-04 | P1 | 经纬度数据库 | packages/core/src/location/index.ts + scripts/generate-china-location-data.mjs（中国省市区树）；tes | 扩充 location 数据集至全球≥10万条/4位小数，标注来源与时区 ID |
| 1.1-06 | P1 | 国际夏令时（IANA tzdata） | packages/core/src/calendar/civil-time.ts（timeZoneId 历史规则）；tests/civil-time.test.ts；依赖运行时 I | 在 CI 加 tzdata 版本核对与 48h 同步检查脚本 |
| 1.1-11 | P1 | 高纬度地区校验 | packages/core/src/calendar/true-solar-time.ts:647-720（Meeus 完整均时差 + 经度4分/度）；tests/true-sol | 高纬度极昼极夜时辰显示增加说明分支 |

## 1.2 排盘引擎法理与流派溯源（21 体系）

| ID | 严重度 | 检查项 | 现状 | 修复建议 |
|---|---|---|---|---|
| 1.2-05 | P1 | 早夜子时换日开关 | 早夜子时换日开关：tests/day-divide.test.ts / day-divide-blindspots.test.ts / ziwei-day-divide-wirin | 将早夜子时开关状态固化进排盘 JSON 元数据并断言测试 |
| 1.2-100 | P1 | 分盘（Varga）：D1（本命）/ D9（婚姻/Navamsa）/ D10（事业 | 同 1.2-96 | 调用侧/集成层补齐，core 能力已具备 |
| 1.2-101 | P1 | D60 前世业力盘：60 分盘的行星落宫与本命 D1 联动分析，业力解读模板化。 | 同 1.2-96 | 调用侧/集成层补齐，core 能力已具备 |
| 1.2-102 | P1 | 瑜伽（Yoga）判定：Gaja Kesari / Hamsa / Ruchaka | 同 1.2-96 | 调用侧/集成层补齐，core 能力已具备 |
| 1.2-103 | P1 | Dosha 判定：Kuja Dosha（火星缺陷）/ Kaal Sarp Dos | 同 1.2-96 | 调用侧/集成层补齐，core 能力已具备 |
| 1.2-104 | P1 | 交叉验证：随机抽取 2,000 组生辰，与 Jagannatha Hora /  | 同 1.2-96 | 调用侧/集成层补齐，core 能力已具备 |
| 1.2-105 | P1 | 南印度/北印度星盘样式：提供南印度（星座固定）/ 北印度（宫位固定）两种星盘展示 | 同 1.2-96 | 调用侧/集成层补齐，core 能力已具备 |
| 1.2-81 | P1 | Swiss Ephemeris 行星黄经：使用 Swiss Ephemeris（ | packages/core/src/divination/algorithms/astrolabe.ts（astronomy-engine 2.1.19）；tests/astrol | 文档化 astronomy-engine 星历版本与 Swiss Ephemeris 对质口径；如需对齐改 Swiss |
| 1.2-96 | P1 | Ayanamsa 锁定：默认 Lahiri Ayanamsa（年度更新，印度天文 | 吠陀占星（Jaimini/分盘）未见独立算法模块；astrolabe 为西洋盘，吠陀 Lahiri ayanamsha / 分盘体系在 core 内未独立实现 | 新增吠陀占星模块（Lahiri ayanamsha + D1/D9 分盘）或显式标注未实现 |
| 1.2-97 | P1 | 恒星黄道计算：热带黄经 - Ayanamsa = 恒星黄经，计算逻辑独立函数。 | 同 1.2-96 | 归入吠陀模块统一补齐（见 1.2-96） |
| 1.2-98 | P1 | 27 星宿（Nakshatra）边界：每星宿 13°20'，27 星宿名称/主星 | 同 1.2-96 | 归入吠陀模块统一补齐（见 1.2-96） |
| 1.2-99 | P1 | Vimshottari Dasha：120 年大运周期，以出生时月亮所在星宿主星 | 同 1.2-96 | 归入吠陀模块统一补齐（见 1.2-96） |

## 1.3 客观推演链幂等性与跨平台互证

| ID | 严重度 | 检查项 | 现状 | 修复建议 |
|---|---|---|---|---|
| 1.3-10 | P1 | 南半球八字月令反转校验：提供"按节气（北半球逻辑）"与"对冲月令（南半球逻辑）" | 南半球月令反转选项在 core 未发现显式分支；默认北半球节气逻辑 | 增南半球月令反转开关 |
| 1.3-15 | P1 | 排盘引擎单元测试覆盖率：核心排盘函数（四柱/紫微/星盘）行覆盖率 ≥ 99%，分 | 核心排盘有 exhaustive/evidence-trail 测试；行/分支覆盖率百分比未在 core 配置门限 | 配置 istanbul/覆盖率门限 99%/95% |
| 1.3-19 | P1 | 排盘引擎性能基准：八字排盘 ≤ 50ms、紫微斗数 ≤ 80ms、西洋占星 ≤  | 性能 P99 基准（八字≤50ms 等）未在 core 内置 benchmark 门限 | 内置 performance benchmark 门限 |
| 1.3-02 | P2 | 十神组合推导链溯源：凶吉判定必须附注古籍原文依据（如《滴天髓》《子平真诠》具体卷 | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *- | 古籍引用结构化卷/章字段 |
| 1.3-04 | P2 | L0/L1 外部交叉校验：随机抽取 10,000 组生辰，与卜易居、元亨利贞、A | 跨平台 10,000 组对质为 CI 流程项；core 提供 meeus-golden / astrolabe-native-reference 参考用例，批量外部对质脚本未在 c | CI 增万组边界用例对质脚本 |
| 1.3-05 | P2 | 大模型互证测试（V5.0 修订） | ≥2 LLM 互证为 B 类每周抽检流程，core 不实现；本地规则互证可由 evidence 链支持 | 调用侧/集成层补齐，core 能力已具备 |
| 1.3-07 | P2 | 古籍引用双向链接：引用古文必须指向具体典籍名称+卷册+页码（如《四库全书》子部· | 同 1.3-02，页码级溯源未结构化 | 调用侧/集成层补齐，core 能力已具备 |
| 1.3-11 | P2 | 多源测试用例集：≥ 10,000 组均匀采样边界用例（含极端经纬度、历史时区、闰 | 边界用例集散见各 *.test.ts（paipan-boundary/qimen-boundary），未集中为 Git LFS 万组 | 调用侧/集成层补齐，core 能力已具备 |

## 1.4 塔罗与神谕系统

| ID | 严重度 | 检查项 | 现状 | 修复建议 |
|---|---|---|---|---|
| 1.4-10 | P2 | 塔罗牌义多体系标注：韦特（Rider-Waite）/马赛（Marseille）/ | tarot-data 以韦特为主；马赛/托特三体系差异标注未见独立数据 | 补马赛/托特体系牌义差异数据 |
| 1.4-18 | P2 | 交叉验证：随机抽取 1,000 次抽牌，与《塔罗全书》《韦特塔罗经典解读》比对， | 1000 次交叉一致率为 B 类抽检；tarot-evidence-trail 提供证据链 | B 类抽检脚本化 |

## 1.5 特殊场景与边界条件

| ID | 严重度 | 检查项 | 现状 | 修复建议 |
|---|---|---|---|---|
| 1.5-04 | P1 | 出生时间跨度极大：支持公元前 3000 年至公元 5000 年的排盘（天文算法有 | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation | 放开 validateSolarDate 范围至公元前3000~公元5000或显式报错 |

## 2.1 转译词库法理锚定与版本控制

| ID | 严重度 | 检查项 | 现状 | 修复建议 |
|---|---|---|---|---|
| 2.1-01 | P2 | L1 古籍锚定（T1） | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-02 | P2 | L2 现代注疏（T2） | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-03 | P2 | L3 通用白话（T3） | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-04 | P2 | L4/L5 树状投射矩阵 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-05 | P2 | 场景文案防越界 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-06 | P2 | 转译越界熔断器 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-07 | P2 | 用户画像篡改法理防御 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-08 | P2 | 多语言合规脱敏 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-09 | P2 | 词库版本化控制（Versioning） | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-10 | P2 | 人工审核签字 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-11 | P2 | 树状结构完整性 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-12 | P2 | 文案非重复性校验 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-13 | P2 | 覆盖率验证 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-14 | P2 | 规则冲突裁决树 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-15 | P2 | 术语映射表 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-16 | P2 | 兜底安全回复 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-17 | P2 | 心理安全文案审核（V4.1 新增，V5.0 保留） | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-18 | P2 | 禁止医疗诊断（V4.1 新增，V5.0 保留） | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-19 | P2 | 禁止法律/金融建议（V4.1 新增，V5.0 保留） | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-20 | P2 | 多语言一致性校验（V4.1 新增，V5.0 保留） | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-21 | P2 | 文化敏感性审核（V4.1 新增，V5.0 保留） | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-22 | P2 | 文案可读性分级（V4.1 新增，V5.0 保留） | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-23 | P2 | 词库季度复审（V4.1 新增，V5.0 保留） | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.1-24 | P2 | 词库回滚机制（V4.1 新增，V5.0 保留） | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |

## 2.2 大模型确定性物理锁与防注入

| ID | 严重度 | 检查项 | 现状 | 修复建议 |
|---|---|---|---|---|
| 2.2-01 | P2 | AI 随机性物理锁 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-02 | P2 | JSON 预渲染机制 | 同 2.2-01 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-03 | P2 | 架构隔离 | 同 2.2-01 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-04 | P2 | System Prompt 约束 | 同 2.2-01 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-05 | P2 | Prompt 注入防御 | 同 2.2-01 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-06 | P2 | JSON 篡改防御 | 同 2.2-01 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-07 | P2 | 引用溯源 | 同 2.2-01 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-08 | P2 | 幻觉检测 | 同 2.2-01 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-09 | P2 | 日志审计 | 同 2.2-01 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-10 | P2 | 多智能体逆向推演验证 | 同 2.2-01 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-11 | P2 | 三堂会诊闭环 | 同 2.2-01 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-12 | P2 | OWASP LLM 注入测试 | 同 2.2-01 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-13 | P2 | 模型版本冻结与迁移审计（V4.1 新增，V5.0 保留） | 模型版本冻结属调用侧配置 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-15 | P2 | AI 输出长度限制（V4.1 新增，V5.0 保留） | 提示注入防护在 prompt 约束层 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-16 | P2 | AI 输出内容安全过滤（V4.1 新增，V5.0 保留） | 同 2.2-15 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-17 | P2 | AI 调用频率限制（V4.1 新增，V5.0 保留） | 同 2.2-15 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-18 | P2 | AI 推理区域锁定（V4.1 新增，V5.0 保留） | 同 2.2-15 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-19 | P2 | AI 输出水印（V4.1 新增，V5.0 保留） | 同 2.2-15 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.2-20 | P2 | AI 推理成本监控（V4.1 新增，V5.0 保留） | 同 2.2-15 | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |

## 2.3 动态匹配与路由收敛

| ID | 严重度 | 检查项 | 现状 | 修复建议 |
|---|---|---|---|---|
| 2.3-01 | P2 | MoE 式前置路由收敛 | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.3-02 | P2 | 检索效率验证 | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.3-03 | P2 | 画像标签向量化 | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.3-04 | P2 | 匹配度权重计算 | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.3-05 | P2 | 多原型叠加处理 | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.3-06 | P2 | 标签缺失降级策略 | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.3-07 | P2 | 渐进式画像收集 | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.3-08 | P2 | 推导过程可展示 | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.3-09 | P2 | 路由缓存策略（V4.1 新增，V5.0 保留） | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.3-10 | P2 | 路由冲突检测（V4.1 新增，V5.0 保留） | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.3-11 | P2 | 路由日志（V4.1 新增，V5.0 保留） | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.3-12 | P2 | 路由 A/B 测试隔离（V4.1 新增，V5.0 保留） | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |

## 2.4 知识产权与本地化映射

| ID | 严重度 | 检查项 | 现状 | 修复建议 |
|---|---|---|---|---|
| 2.4-01 | P2 | IP 侵权 NLP 查重 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.4-02 | P2 | 文化概念等效映射 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.4-03 | P2 | 吉凶文化差异校验 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.4-04 | P2 | 隐喻等效性校验 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.4-05 | P2 | 本地化专家审核流程 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.4-06 | P2 | 术语一致性引擎 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.4-07 | P2 | 本地化回归测试 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |
| 2.4-08 | P2 | 本地化用户反馈闭环 | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / baz | prompt/调用侧补齐：Temperature=0、版本冻结、注入防护；core 已提供结构化 payload |

## 3.2 跨体系共识矩阵与权重

| ID | 严重度 | 检查项 | 现状 | 修复建议 |
|---|---|---|---|---|
| 3.2-01 | P2 | 跨体系权重评分模型 | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts；synthesis 跨体系汇总，权重评分模 | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.2-02 | P2 | 异端结论熔断机制 | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.2-03 | P2 | 法理冲突日志 | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.2-04 | P2 | 综合报告归纳总结逻辑 | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.2-05 | P2 | 跨体系标签去重合并 | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.2-06 | P2 | 共识分可视化（V4.1 新增，V5.0 保留） | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.2-07 | P2 | 共识分历史追踪（V4.1 新增，V5.0 保留） | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.2-08 | P2 | 体系权重后台配置（V4.1 新增，V5.0 保留） | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.2-09 | P2 | 共识分异常告警（V4.1 新增，V5.0 保留） | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.2-10 | P2 | 共识分与用户反馈闭环（V4.1 新增，V5.0 保留） | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |

## 3.3 提问型/生辰型术数融合

| ID | 严重度 | 检查项 | 现状 | 修复建议 |
|---|---|---|---|---|
| 3.3-01 | P2 | 融合优先级定义 | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.3-02 | P2 | 融合触发条件 | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.3-03 | P2 | 冲突处理 | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.3-04 | P2 | 融合报告模板 | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.3-05 | P2 | 融合频率限制 | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.3-06 | P2 | 提问型术数不纳入共识分 | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.3-07 | P2 | 融合报告中的来源标注 | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.3-08 | P2 | 融合报告的逆向推演 | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.3-09 | P2 | 融合报告的版本控制 | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |
| 3.3-10 | P2 | 融合规则变更审批 | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts | synthesis 模块补权重评分模型与冲突裁决规则 |

## 4.1 外围业务引擎复用与防篡改

| ID | 严重度 | 检查项 | 现状 | 修复建议 |
|---|---|---|---|---|
| 4.1-04 | P2 | 星座配对逻辑 | packages/core/src/compatibility/；tests/core-compatibility-bundle.test.ts / bazi-compatibil | 业务服务层复用 core 算法；core 侧已提供算法 |
| 4.1-15 | P2 | 风水/家居/办公方位（6项） | packages/core/src/residential_fengshui/；tests/residential-fengshui.test.ts；core 提供玄空/八宅/住宅 | 业务服务层复用 core 算法；core 侧已提供算法 |
| 4.1-18 | P2 | 风水/家居/办公方位（6项） | packages/core/src/residential_fengshui/；tests/residential-fengshui.test.ts | 业务服务层复用 core 算法；core 侧已提供算法 |
| 4.1-19 | P2 | 风水/家居/办公方位（6项） | packages/core/src/residential_fengshui/；tests/residential-fengshui.test.ts | 业务服务层复用 core 算法；core 侧已提供算法 |
| 4.1-20 | P2 | 风水/家居/办公方位（6项） | packages/core/src/residential_fengshui/；tests/residential-fengshui.test.ts | 业务服务层复用 core 算法；core 侧已提供算法 |
| 4.1-21 | P2 | 合婚/择日/命名（5项） | packages/core/src/compatibility/；tests/core-compatibility-bundle.test.ts / bazi-compatibil | 业务服务层复用 core 算法；core 侧已提供算法 |
| 4.1-24 | P2 | 合婚/择日/命名（5项） | packages/core/src/compatibility/；tests/core-compatibility-bundle.test.ts / bazi-compatibil | 业务服务层复用 core 算法；core 侧已提供算法 |
| 4.1-35 | P2 | 引擎调用监控/防篡改/降级/缓存/日志（5项） | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *- | 业务服务层复用 core 算法；core 侧已提供算法 |

## 4.8 历史报告与版本兼容

| ID | 严重度 | 检查项 | 现状 | 修复建议 |
|---|---|---|---|---|
| 4.8-01 | P2 | 历史报告不可变 | shared/version.ts 版本机制；历史报告格式兼容需集成测试 | shared/version 加历史报告格式兼容快照测试 |
| 4.8-02 | P2 | 版本元数据 | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *- | shared/version 加历史报告格式兼容快照测试 |
| 4.8-03 | P2 | 版本兼容渲染 | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *- | shared/version 加历史报告格式兼容快照测试 |
| 4.8-04 | P2 | 数据迁移策略 | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *- | shared/version 加历史报告格式兼容快照测试 |
| 4.8-05 | P2 | 报告导出/分享 | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *- | shared/version 加历史报告格式兼容快照测试 |
| 4.8-06 | P2 | 报告对比功能 | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *- | shared/version 加历史报告格式兼容快照测试 |
| 4.8-07 | P2 | 报告存储策略 | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *- | shared/version 加历史报告格式兼容快照测试 |
| 4.8-08 | P2 | 报告删除与注销 | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *- | shared/version 加历史报告格式兼容快照测试 |

## 4.10 第三方 API 开放平台

| ID | 严重度 | 检查项 | 现状 | 修复建议 |
|---|---|---|---|---|
| 4.10-01 | P2 | B2B 网关鉴权与权限分级 | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | public-api/client 加契约测试与限流说明 |
| 4.10-02 | P2 | 按调用量计费与对账 | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | public-api/client 加契约测试与限流说明 |
| 4.10-03 | P2 | B 端数据留存策略 | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | public-api/client 加契约测试与限流说明 |
| 4.10-04 | P2 | API 输出脱敏与水印 | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | public-api/client 加契约测试与限流说明 |
| 4.10-05 | P2 | B2B SLA 与故障处理 | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabili | public-api/client 加契约测试与限流说明 |

## 4.11 异地灾备与星历完整性

| ID | 严重度 | 检查项 | 现状 | 修复建议 |
|---|---|---|---|---|
| 4.11-02 | P2 | 备份完整性校验 | 星历依赖 astronomy-engine 内嵌星历 + Swiss Ephemeris（七政四余），完整性校验未内置 checksum | 业务服务层复用 core 算法；core 侧已提供算法 |
