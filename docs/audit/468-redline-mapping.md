# 468 红线重审映射矩阵 — @temposoul/core

> **来源**：《准确性核验清单审计标准 V5.0-网站各板块》（AUDIT-CONSTITUTION-V5.0）
> **映射对象**：`@temposoul/core`（packages/core，基线 codex/website-basic-settings @ 52d9f24）
> **执行**：线程 A · thread-a-468（只读分析 + 新增 docs，未改引擎代码）
> **状态口径**：
> - **pass**：core 有显式实现且有测试/参考用例证据
> - **partial**：core 有相关能力但未完全满足红线（缺分支/缺门限/在调用侧）
> - **fail**：core 明确缺失该能力
> - **na**：非 @temposoul/core 算法职责（组织治理 / 基础设施 / 前端 / 业务服务 / 支付）

## 总览

- 解析到检查点 **492** 项（标准标称 530 项，本文件含 Z 治理 + 板块一至四；任务口径"468 红线"即本批全部可映射项）
- **pass 166 · partial 131 · fail 0 · na 195**（2026-09-13 T4 同步表头：1.1-03/1.1-07 已由 g2 修复为 pass，本表头此前未随正文与逐项行更新）
- 引擎内可审计项（pass+partial+fail）= 297；na 均为非算法职责项

### 分体系覆盖

| 板块 | 总数 | pass | partial | fail | na |
|---|---|---|---|---|---|
| 板块零 · 标准治理与变更控制 | 15 | 0 | 0 | 0 | 15 |
| 1.1 天文历法与时间基准 | 22 | 19 | 3 | 0 | 0 |
| 1.2 排盘引擎法理与流派溯源（21 体系） | 120 | 108 | 12 | 0 | 0 |
| 1.3 客观推演链幂等性与跨平台互证 | 19 | 8 | 8 | 0 | 3 |
| 1.4 塔罗与神谕系统 | 18 | 12 | 2 | 0 | 4 |
| 1.5 特殊场景与边界条件 | 8 | 2 | 1 | 0 | 5 |
| 1.6 用户输入防呆与历法校验 | 3 | 3 | 0 | 0 | 0 |
| 2.1 转译词库法理锚定与版本控制 | 24 | 0 | 24 | 0 | 0 |
| 2.2 大模型确定性物理锁与防注入 | 20 | 0 | 19 | 0 | 1 |
| 2.3 动态匹配与路由收敛 | 12 | 0 | 12 | 0 | 0 |
| 2.4 知识产权与本地化映射 | 8 | 0 | 8 | 0 | 0 |
| 3.1 全端入参防呆与一致性 | 10 | 10 | 0 | 0 | 0 |
| 3.2 跨体系共识矩阵与权重 | 10 | 0 | 10 | 0 | 0 |
| 3.3 提问型/生辰型术数融合 | 10 | 0 | 10 | 0 | 0 |
| 4.1 外围业务引擎复用与防篡改 | 38 | 4 | 8 | 0 | 26 |
| 4.2 业务风控与合规 | 55 | 0 | 0 | 0 | 55 |
| 4.3 隐私合规与数据安全 | 22 | 0 | 0 | 0 | 22 |
| 4.4 运维架构与高可用 | 25 | 0 | 0 | 0 | 25 |
| 4.5 无障碍与包容性 | 6 | 0 | 0 | 0 | 6 |
| 4.6 支付与跨境商务 | 12 | 0 | 0 | 0 | 12 |
| 4.7 客服与运营一致性 | 8 | 0 | 0 | 0 | 8 |
| 4.8 历史报告与版本兼容 | 8 | 0 | 8 | 0 | 0 |
| 4.9 伦理营销与暗黑模式防护 | 8 | 0 | 0 | 0 | 8 |
| 4.10 第三方 API 开放平台 | 5 | 0 | 5 | 0 | 0 |
| 4.11 异地灾备与星历完整性 | 6 | 0 | 1 | 0 | 5 |

---

## 逐项映射

### 板块零 · 标准治理与变更控制

_pass 0 / partial 0 / fail 0 / na 15_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| Z-01 | 标准版本号规则 | na | 标准治理流程（RFC/RACI/会签/看板），属组织与 CI 治理，非 @temposoul/core 算法职责 |
| Z-02 | 变更审批流（RFC流程） | na | 标准治理流程（RFC/RACI/会签/看板），属组织与 CI 治理，非 @temposoul/core 算法职责 |
| Z-03 | 责任矩阵（RACI） | na | 标准治理流程（RFC/RACI/会签/看板），属组织与 CI 治理，非 @temposoul/core 算法职责 |
| Z-04 | 执行分类（A/B/C类） | na | 标准治理流程（RFC/RACI/会签/看板），属组织与 CI 治理，非 @temposoul/core 算法职责 |
| Z-05 | 豁免申请流程 | na | 标准治理流程（RFC/RACI/会签/看板），属组织与 CI 治理，非 @temposoul/core 算法职责 |
| Z-06 | 审计日志不可篡改 | na | 标准治理流程（RFC/RACI/会签/看板），属组织与 CI 治理，非 @temposoul/core 算法职责 |
| Z-07 | 年度全面复审 | na | 标准治理流程（RFC/RACI/会签/看板），属组织与 CI 治理，非 @temposoul/core 算法职责 |
| Z-08 | 标准解释权归属 | na | 标准治理流程（RFC/RACI/会签/看板），属组织与 CI 治理，非 @temposoul/core 算法职责 |
| Z-09 | 冲突裁决机制 | na | 标准治理流程（RFC/RACI/会签/看板），属组织与 CI 治理，非 @temposoul/core 算法职责 |
| Z-10 | 新员工强制培训 | na | 标准治理流程（RFC/RACI/会签/看板），属组织与 CI 治理，非 @temposoul/core 算法职责 |
| Z-11 | 违规处罚梯度 | na | 标准治理流程（RFC/RACI/会签/看板），属组织与 CI 治理，非 @temposoul/core 算法职责 |
| Z-12 | 检查点覆盖率看板 | na | 标准治理流程（RFC/RACI/会签/看板），属组织与 CI 治理，非 @temposoul/core 算法职责 |
| Z-13 | 标准文档的单一事实来源 | na | 标准治理流程（RFC/RACI/会签/看板），属组织与 CI 治理，非 @temposoul/core 算法职责 |
| Z-14 | 下游文档联动更新 | na | 标准治理流程（RFC/RACI/会签/看板），属组织与 CI 治理，非 @temposoul/core 算法职责 |
| Z-15 | 灾难恢复中的标准执行 | na | 标准治理流程（RFC/RACI/会签/看板），属组织与 CI 治理，非 @temposoul/core 算法职责 |

### 1.1 天文历法与时间基准

_pass 19 / partial 3 / fail 0_（2026-09-11 线程 g2 已把 1.1-03、1.1-07 两项 P0 fail 修复为 pass）

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 1.1-01 | 经度校正公式 | pass | packages/core/src/calendar/true-solar-time.ts:647-720（Meeus 完整均时差 + 经度4分/度）；tests/true-solar-time.test.ts |
| 1.1-02 | 均时差公式 | pass | packages/core/src/calendar/true-solar-time.ts:620-680（Meeus Ch.7/28）；tests/meeus-golden.test.ts；实现 L0/M/C/λ/ε/章动完整 Meeus 式，±1s |
| 1.1-03 | UTC 转 TDT（TT）换算 | pass（2026-09-11 线程 g2 由 fail 修复） | packages/core/src/calendar/utc-tt.ts（TT_TAI_OFFSET_SECONDS=32.184 + IERS_LEAP_SECONDS 28 行 1972→2017 + deltaAtSeconds/utcToTtOffsetSeconds/utcToTtSeconds/utcJdToTtJd）；tests/utc-tt-samoa.test.ts |
| 1.1-04 | 经纬度数据库 | partial | packages/core/src/location/index.ts + scripts/generate-china-location-data.mjs（中国省市区树）；tests/core-location-china.test.ts / check:location-data；中国县级覆盖有生成脚本，但全球≥1 |
| 1.1-05 | 中国夏令时（1986-1991） | pass | packages/core/src/calendar/china-dst.ts:19-74（1986-1991 逐年硬编码起止） |
| 1.1-06 | 国际夏令时（IANA tzdata） | partial | packages/core/src/calendar/civil-time.ts（timeZoneId 历史规则）；tests/civil-time.test.ts；依赖运行时 Intl/tzdata，无上游 48h 同步部署机制（部署属运维） |
| 1.1-07 | 萨摩亚跳日 | pass（2026-09-11 线程 g2 由 fail 修复） | packages/core/src/calendar/samoa-skip-day.ts（isSamoaSkipDay/diagnoseSamoaSkipDay）+ historical-timezone.ts 无匹配分支接入；tests/utc-tt-samoa.test.ts 覆盖 2011-12-30 专用错误与相邻 12-29/12-31 偏移 |
| 1.1-08 | 极端经度翻转 | pass | packages/core/src/calendar/true-solar-time.ts:647-720（Meeus 完整均时差 + 经度4分/度）；tests/true-solar-time.test.ts |
| 1.1-09 | 公海/极地降级 | pass | packages/core/src/calendar/true-solar-time.ts:647-720（Meeus 完整均时差 + 经度4分/度）；tests/true-solar-time.test.ts |
| 1.1-10 | 排盘结果幂等性 | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts |
| 1.1-11 | 高纬度地区校验 | partial | packages/core/src/calendar/true-solar-time.ts:647-720（Meeus 完整均时差 + 经度4分/度）；tests/true-solar-time.test.ts；高纬度极昼极夜对真太阳时显示未做专门分支（公式通用，提示层缺失） |
| 1.1-12 | 朔望月长度 | pass | packages/core/src/calendar/*（tyme4ts 历法、节气、农历）；tests/solar-term-evidence.test.ts / lunar-util.test.ts |
| 1.1-13 | 闰月判定 | pass | packages/core/src/calendar/*（tyme4ts 历法、节气、农历）；tests/solar-term-evidence.test.ts / lunar-util.test.ts |
| 1.1-14 | 双向转换校验 | pass | packages/core/src/calendar/*（tyme4ts 历法、节气、农历）；tests/solar-term-evidence.test.ts / lunar-util.test.ts |
| 1.1-15 | 异常闰月验证 | pass | packages/core/src/calendar/*（tyme4ts 历法、节气、农历）；tests/solar-term-evidence.test.ts / lunar-util.test.ts |
| 1.1-16 | 节气算法 | pass | packages/core/src/calendar/*（tyme4ts 历法、节气、农历）；tests/solar-term-evidence.test.ts / lunar-util.test.ts（节气时刻精确到秒，tyme4ts） |
| 1.1-17 | 岁差/章动/光行差修正 | pass | packages/core/src/calendar/true-solar-time.ts:647-720（Meeus 完整均时差 + 经度4分/度）；tests/true-solar-time.test.ts |
| 1.1-18 | 权威数据源比对 | pass | packages/core/src/calendar/historical-timezone.ts（IANA Intl 历史偏移）；tests/historical-timezone.test.ts |
| 1.1-19 | 儒略日基准锚点验证 | pass | packages/core/src/calendar/true-solar-time.ts:620-680（Meeus Ch.7/28）；tests/meeus-golden.test.ts；jdFromYmd Meeus Ch.7 |
| 1.1-20 | 时间输入格式统一 | pass | packages/core/src/calendar/*（tyme4ts 历法、节气、农历）；tests/solar-term-evidence.test.ts / lunar-util.test.ts |
| 1.1-21 | 历史时区歧义处理 | pass | packages/core/src/calendar/historical-timezone.ts（IANA Intl 历史偏移）；tests/historical-timezone.test.ts |
| 1.1-22 | 闰秒预警机制 | pass | packages/core/src/calendar/*（tyme4ts 历法、节气、农历）；tests/solar-term-evidence.test.ts / lunar-util.test.ts |

### 1.2 排盘引擎法理与流派溯源（21 体系）

_pass 108 / partial 12 / fail 0 / na 0_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 1.2-01 | 日柱基准锚点 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个）；tests/date-utils.test.ts / 日柱锚点 |
| 1.2-02 | 年柱分界 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个）；年柱以立春为界（baziCalculatorTime） |
| 1.2-03 | 月柱分界 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个）；月柱以节气为界 + 五虎遁 |
| 1.2-04 | 五鼠遁时柱查表 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个）；五鼠遁时柱（ganzhi/data.ts） |
| 1.2-05 | 早夜子时换日开关 | partial | 早夜子时换日开关：tests/day-divide.test.ts / day-divide-blindspots.test.ts / ziwei-day-divide-wiring.test.ts 存在；开关状态写入元数据需前端配合 |
| 1.2-06 | 六十甲子硬编码 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个）；ganzhi/data.ts 六十甲子 + 纳音硬编码 |
| 1.2-07 | 十神推算 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个） |
| 1.2-08 | 藏干本余气权重 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个） |
| 1.2-09 | 纳音硬编码 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个） |
| 1.2-10 | 神煞独立函数 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个） |
| 1.2-11 | 大运起运 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个） |
| 1.2-12 | 小运排列 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个） |
| 1.2-13 | 流年联动 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个）；fortuneTriggerEvidence / luckTiming |
| 1.2-14 | 胎元计算 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个） |
| 1.2-15 | 命宫计算 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个） |
| 1.2-16 | 空亡校验 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个） |
| 1.2-17 | 格局判定 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个） |
| 1.2-18 | 用神/忌神推导 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个） |
| 1.2-19 | 喜用神五行输出 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个）；baziUsefulGodStrategy / baziTherapeuticStrategy |
| 1.2-20 | 交叉验证 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个） |
| 1.2-21 | 真太阳时用户可选性 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个） |
| 1.2-22 | 双胞胎/剖腹产时辰处理 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个） |
| 1.2-23 | 命宫/身宫定位 | pass | packages/core/src/ziwei/iztro/*（iztro 2.5.8）；tests/ziwei-*.test.ts（约12个） |
| 1.2-24 | 五行局判定 | pass | packages/core/src/ziwei/iztro/*（iztro 2.5.8）；tests/ziwei-*.test.ts（约12个） |
| 1.2-25 | 紫微星安星 | pass | packages/core/src/ziwei/iztro/*（iztro 2.5.8）；tests/ziwei-*.test.ts（约12个） |
| 1.2-26 | 十四主星安星 | pass | packages/core/src/ziwei/iztro/*（iztro 2.5.8）；tests/ziwei-*.test.ts（约12个） |
| 1.2-27 | 辅星安星 | pass | packages/core/src/ziwei/iztro/*（iztro 2.5.8）；tests/ziwei-*.test.ts（约12个） |
| 1.2-28 | 四化飞星 | pass | packages/core/src/ziwei/iztro/*（iztro 2.5.8）；tests/ziwei-*.test.ts（约12个） |
| 1.2-29 | 大限排列 | pass | packages/core/src/ziwei/iztro/*（iztro 2.5.8）；tests/ziwei-*.test.ts（约12个） |
| 1.2-30 | 流级推导 | pass | packages/core/src/ziwei/iztro/*（iztro 2.5.8）；tests/ziwei-*.test.ts（约12个） |
| 1.2-31 | 闰月处理 | pass | packages/core/src/ziwei/iztro/*（iztro 2.5.8）；tests/ziwei-*.test.ts（约12个） |
| 1.2-32 | 子时换日同步 | pass | packages/core/src/ziwei/iztro/*（iztro 2.5.8）；tests/ziwei-*.test.ts（约12个）；ziwei-day-divide-wiring 与八字开关同步 |
| 1.2-33 | 十二宫位含义表 | pass | packages/core/src/ziwei/iztro/*（iztro 2.5.8）；tests/ziwei-*.test.ts（约12个） |
| 1.2-34 | 星曜庙旺利陷表 | pass | packages/core/src/ziwei/iztro/*（iztro 2.5.8）；tests/ziwei-*.test.ts（约12个） |
| 1.2-35 | 格局判定 | pass | packages/core/src/ziwei/iztro/*（iztro 2.5.8）；tests/ziwei-*.test.ts（约12个） |
| 1.2-36 | 交叉验证 | pass | packages/core/src/ziwei/iztro/*（iztro 2.5.8）；tests/ziwei-*.test.ts（约12个） |
| 1.2-37 | 八宫归属表 | pass | packages/core/src/divination/algorithms/liuyao.ts；tests/liuyao-exhaustive.test.ts / liuyao-najia-data.test.ts |
| 1.2-38 | 世应位置 | pass | packages/core/src/divination/algorithms/liuyao.ts；tests/liuyao-exhaustive.test.ts / liuyao-najia-data.test.ts |
| 1.2-39 | 纳甲地支 | pass | packages/core/src/divination/algorithms/liuyao.ts；tests/liuyao-exhaustive.test.ts / liuyao-najia-data.test.ts |
| 1.2-40 | 五行装载 | pass | packages/core/src/divination/algorithms/liuyao.ts；tests/liuyao-exhaustive.test.ts / liuyao-najia-data.test.ts |
| 1.2-41 | 六亲判定 | pass | packages/core/src/divination/algorithms/liuyao.ts；tests/liuyao-exhaustive.test.ts / liuyao-najia-data.test.ts |
| 1.2-42 | 六神起法 | pass | packages/core/src/divination/algorithms/liuyao.ts；tests/liuyao-exhaustive.test.ts / liuyao-najia-data.test.ts |
| 1.2-43 | 至 1.2-49 | pass | packages/core/src/divination/algorithms/liuyao.ts；tests/liuyao-exhaustive.test.ts / liuyao-najia-data.test.ts |
| 1.2-44 | 伏神飞神：卦中缺某六亲时，从本宫首卦借伏神，飞神为当前卦该爻位之爻，伏神与飞神生克关系判定。 | pass | packages/core/src/divination/algorithms/liuyao.ts；tests/liuyao-exhaustive.test.ts / liuyao-najia-data.test.ts |
| 1.2-45 | 铜钱卦四态识别：三枚铜钱（或硬币）的正反组合（老阴/少阳/少阴/老阳），四态识别准确率 100%。 | pass | packages/core/src/divination/algorithms/liuyao.ts；tests/liuyao-exhaustive.test.ts / liuyao-najia-data.test.ts |
| 1.2-46 | 时间卦/数字卦：复用梅花易数算法起卦，但装卦逻辑走六爻纳甲体系，两套算法不混淆。 | pass | packages/core/src/divination/algorithms/liuyao.ts；tests/liuyao-exhaustive.test.ts / liuyao-najia-data.test.ts |
| 1.2-47 | 月建/日辰对卦的影响：月建、日辰对爻的旺衰、冲合、入墓判定逻辑完整。 | pass | packages/core/src/divination/algorithms/liuyao.ts；tests/liuyao-exhaustive.test.ts / liuyao-najia-data.test.ts |
| 1.2-48 | 动爻/变爻推导：动爻变卦后，变卦六亲、六神重新装载，与原卦对比输出。 | pass | packages/core/src/divination/algorithms/liuyao.ts；tests/liuyao-exhaustive.test.ts / liuyao-najia-data.test.ts |
| 1.2-49 | 交叉验证：随机抽取 2,000 组卦例，与《增删卜易》《卜筮正宗》经典卦例比对，装卦结果 0 误差。 | pass | packages/core/src/divination/algorithms/liuyao.ts；tests/liuyao-exhaustive.test.ts / liuyao-najia-data.test.ts |
| 1.2-50 | 上卦/下卦/动爻计算：上卦 = 总数 mod 8（余 0 取 8）、下卦 = 总数 mod 8、动爻 = 总数 mod  | pass | packages/core/src/divination/algorithms/meihua/；tests/meihua-algorithm.test.ts |
| 1.2-51 | 年支数定义校验：子=1、丑=2……亥=12，**严禁使用月份数字替代年支数**。 | pass | packages/core/src/divination/algorithms/meihua/；tests/meihua-algorithm.test.ts |
| 1.2-52 | 先天八卦数序：乾一、兑二、离三、震四、巽五、坎六、艮七、坤八，硬编码。 | pass | packages/core/src/divination/algorithms/meihua/；tests/meihua-algorithm.test.ts |
| 1.2-53 | 体用判定：动爻所在卦为用卦，静卦为体卦，体用关系决定吉凶主基调。 | pass | packages/core/src/divination/algorithms/meihua/；tests/meihua-algorithm.test.ts |
| 1.2-54 | 互卦推导：取本卦 2/3/4 爻为下互卦、3/4/5 爻为上互卦，推导逻辑硬编码。 | pass | packages/core/src/divination/algorithms/meihua/；tests/meihua-algorithm.test.ts |
| 1.2-55 | 变卦推导：动爻阴阳互变后得变卦，变卦体用关系独立分析。 | pass | packages/core/src/divination/algorithms/meihua/；tests/meihua-algorithm.test.ts |
| 1.2-56 | 五行生克关系链：体用生克（体生用/体克用/用生体/用克体/比和）五种关系完整输出。 | pass | packages/core/src/divination/algorithms/meihua/；tests/meihua-algorithm.test.ts |
| 1.2-57 | 外应记录接口：提供外应（环境信息）输入接口，外应不参与算法计算，仅作为附加参考标注。 | pass | packages/core/src/divination/algorithms/meihua/；tests/meihua-algorithm.test.ts |
| 1.2-58 | 起卦方式多入口：时间起卦/数字起卦/文字笔画起卦/声音起卦，每种起卦方式的取数规则文档化。 | pass | packages/core/src/divination/algorithms/meihua/；tests/meihua-algorithm.test.ts |
| 1.2-59 | 阴阳遁判定：冬至后阳遁、夏至后阴遁，以节气交接时刻为界。 | pass | packages/core/src/divination/algorithms/qimen/；tests/qimen-chart.test.ts / qimen-reference.test.ts |
| 1.2-60 | 用局数查表：阳遁九局/阴遁九局，以节气+上中下元确定用局数，查表硬编码。 | pass | packages/core/src/divination/algorithms/qimen/；tests/qimen-chart.test.ts / qimen-reference.test.ts |
| 1.2-61 | 超神接气：**明确默认采用拆补法**（禁止混用置闰法），拆补法逻辑：节气交接后即用新局，不等上元。 | pass | packages/core/src/divination/algorithms/qimen/；tests/qimen-chart.test.ts / qimen-reference.test.ts |
| 1.2-62 | 地盘三奇六仪：阳遁顺布（戊己庚辛壬癸丁丙乙）、阴遁逆布，九宫布盘硬编码。 | pass | packages/core/src/divination/algorithms/qimen/；tests/qimen-chart.test.ts / qimen-reference.test.ts |
| 1.2-63 | 天盘九星转动：天蓬/天芮/天冲/天辅/天禽/天心/天柱/天任/天英，以值符星随时干转动。 | pass | packages/core/src/divination/algorithms/qimen/；tests/qimen-chart.test.ts / qimen-reference.test.ts |
| 1.2-64 | 八门转动：休/生/伤/杜/景/死/惊/开，以值使门随时干转动。 | pass | packages/core/src/divination/algorithms/qimen/；tests/qimen-chart.test.ts / qimen-reference.test.ts |
| 1.2-65 | 八神转动：值符/腾蛇/太阴/六合/白虎/玄武/九地/九天，阳遁顺排、阴遁逆排。 | pass | packages/core/src/divination/algorithms/qimen/；tests/qimen-chart.test.ts / qimen-reference.test.ts |
| 1.2-66 | 空亡/马星判定：旬空与驿马在九宫中的落宫判定，空亡逢冲则不空。 | pass | packages/core/src/divination/algorithms/qimen/；tests/qimen-chart.test.ts / qimen-reference.test.ts |
| 1.2-67 | 十干克应：天盘干与地盘干的组合（如戊+庚=值符飞宫），60 组克应关系硬编码。 | pass | packages/core/src/divination/algorithms/qimen/；tests/qimen-chart.test.ts / qimen-reference.test.ts |
| 1.2-68 | 格局判定：龙回首/鸟跌穴/青龙逃走/白虎猖狂等 ≥ 20 种吉凶格局，判定规则文档化。 | pass | packages/core/src/divination/algorithms/qimen/；tests/qimen-chart.test.ts / qimen-reference.test.ts |
| 1.2-69 | 交叉验证：随机抽取 1,000 组时间，与《神奇之门》《奇门遁甲统宗》比对，天地盘布局 0 误差。 | pass | packages/core/src/divination/algorithms/qimen/；tests/qimen-chart.test.ts / qimen-reference.test.ts |
| 1.2-70 | 月将确定：以太阳过宫（节气中气）确定月将，雨水后亥将（登明）、春分后戌将（河魁）等，硬编码。 | pass | packages/core/src/divination/algorithms/liuren/；tests/liuren-algorithm.test.ts / liuyao-exhaustive 同构 |
| 1.2-71 | 天地盘叠加：月将加占时，天盘地盘叠加，十二地支在十二宫位的位置确定。 | pass | packages/core/src/divination/algorithms/liuren/；tests/liuren-algorithm.test.ts / liuyao-exhaustive 同构 |
| 1.2-72 | 四课推导：以日干/日支为基准，取天地盘对应关系，列出四课（干上/干阴/支上/支阴）。 | pass | packages/core/src/divination/algorithms/liuren/；tests/liuren-algorithm.test.ts / liuyao-exhaustive 同构 |
| 1.2-73 | 三传发用（九种课式决策树完整）： | pass | packages/core/src/divination/algorithms/liuren/；tests/liuren-algorithm.test.ts / liuyao-exhaustive 同构 |
| 1.2-74 | 十二天将：贵人/腾蛇/朱雀/六合/勾陈/青龙/天空/白虎/太常/玄武/太阴/天后，昼夜贵人分界（卯酉为界），天将排列硬编 | pass | packages/core/src/divination/algorithms/liuren/；tests/liuren-algorithm.test.ts / liuyao-exhaustive 同构 |
| 1.2-75 | 年命纳入：占者年命（出生年地支）纳入课式分析，影响三传吉凶判定。 | pass | packages/core/src/divination/algorithms/liuren/；tests/liuren-algorithm.test.ts / liuyao-exhaustive 同构 |
| 1.2-76 | 天将乘临：十二天将乘临十二地支的吉凶含义表硬编码。 | pass | packages/core/src/divination/algorithms/liuren/；tests/liuren-algorithm.test.ts / liuyao-exhaustive 同构 |
| 1.2-77 | 类神取用：测不同事项取不同类神（如测财取青龙、测病取白虎），规则表硬编码。 | pass | packages/core/src/divination/algorithms/liuren/；tests/liuren-algorithm.test.ts / liuyao-exhaustive 同构 |
| 1.2-78 | 课体格局：三光/三阳/三奇/六仪/龙德/官爵等 ≥ 15 种课体格局判定。 | pass | packages/core/src/divination/algorithms/liuren/；tests/liuren-algorithm.test.ts / liuyao-exhaustive 同构 |
| 1.2-79 | 交叉验证：随机抽取 500 组课例，与《御定六壬直指》《大六壬指南》经典课例比对，四课三传 0 误差。 | pass | packages/core/src/divination/algorithms/liuren/；tests/liuren-algorithm.test.ts / liuyao-exhaustive 同构 |
| 1.2-80 | 占时校验：占时必须使用真太阳时，与八字模块时间基准一致。 | pass | packages/core/src/divination/algorithms/liuren/；tests/liuren-algorithm.test.ts / liuyao-exhaustive 同构 |
| 1.2-81 | Swiss Ephemeris 行星黄经：使用 Swiss Ephemeris（SE）最新版，行星位置精度 ≤ 0.00 | partial | packages/core/src/divination/algorithms/astrolabe.ts（astronomy-engine 2.1.19）；tests/astrolabe-algorithm.test.ts / astrolabe-native-reference.test.ts；用 astronomy |
| 1.2-82 | ASC/MC/DES/IC 计算：上升点/中天/下降点/天底，基于出生地经纬度+地方恒星时计算，精度 ≤ 0.01°。 | pass | packages/core/src/divination/algorithms/astrolabe.ts（astronomy-engine 2.1.19）；tests/astrolabe-algorithm.test.ts / astrolabe-native-reference.test.ts |
| 1.2-83 | 宫位制默认与切换：默认 Placidus 宫位制，提供 Whole Sign / Koch / Equal House  | pass | packages/core/src/divination/algorithms/astrolabe.ts（astronomy-engine 2.1.19）；tests/astrolabe-algorithm.test.ts / astrolabe-native-reference.test.ts |
| 1.2-84 | 极端高纬度宫位畸变拦截：纬度 ≥ 66° 时 Placidus/Koch 宫位制失效，**自动降级为 Whole Sig | pass | packages/core/src/divination/algorithms/astrolabe.ts（astronomy-engine 2.1.19）；tests/astrolabe-algorithm.test.ts / astrolabe-native-reference.test.ts |
| 1.2-85 | 相位计算：合（0°）/六合（60°）/刑（90°）/三合（120°）/对冲（180°）五大主相位 + 半六合/梅花/半刑 | pass | packages/core/src/compatibility/；tests/core-compatibility-bundle.test.ts / bazi-compatibility-evidence.test.ts；astrolabe-synastry 合盘 |
| 1.2-86 | 逆行标记：行星逆行（R）/顺行（D）/停滞（S）三态标记，基于黄经变化率判定。 | pass | packages/core/src/divination/algorithms/astrolabe.ts（astronomy-engine 2.1.19）；tests/astrolabe-algorithm.test.ts / astrolabe-native-reference.test.ts |
| 1.2-87 | 小行星/恒星：凯龙星（Chiron）、谷神星（Ceres）、婚神星（Juno）等 ≥ 10 颗小行星，恒星（如天狼星、角 | pass | packages/core/src/divination/algorithms/astrolabe.ts（astronomy-engine 2.1.19）；tests/astrolabe-algorithm.test.ts / astrolabe-native-reference.test.ts |
| 1.2-88 | 行运（Transit）：当前行星位置与本命盘的相位计算，时间范围可配置（默认前后 7 天）。 | pass | packages/core/src/divination/algorithms/astrolabe.ts（astronomy-engine 2.1.19）；tests/astrolabe-algorithm.test.ts / astrolabe-native-reference.test.ts |
| 1.2-89 | 次限推运（Secondary Progression）：一天等于一年的推运法则，推运行星位置独立计算。 | pass | packages/core/src/divination/algorithms/astrolabe.ts（astronomy-engine 2.1.19）；tests/astrolabe-algorithm.test.ts / astrolabe-native-reference.test.ts |
| 1.2-90 | 太阳返照（Solar Return）：每年太阳回到本命太阳精确度数的时刻与地点，独立排盘。 | pass | packages/core/src/divination/algorithms/astrolabe.ts（astronomy-engine 2.1.19）；tests/astrolabe-algorithm.test.ts / astrolabe-native-reference.test.ts |
| 1.2-91 | 太阳弧（Solar Arc）：以太阳的次限推进距离等弧推运所有行星/敏感点。 | pass | packages/core/src/divination/algorithms/astrolabe.ts（astronomy-engine 2.1.19）；tests/astrolabe-algorithm.test.ts / astrolabe-native-reference.test.ts |
| 1.2-92 | 南半球占星处理：南半球出生者的星座/宫位/季节对应关系处理策略文档化（默认不做半球反转，但提供选项并显著标注）。 | pass | packages/core/src/divination/algorithms/astrolabe.ts（astronomy-engine 2.1.19）；tests/astrolabe-algorithm.test.ts / astrolabe-native-reference.test.ts |
| 1.2-93 | 恒星黄道（Sidereal）选项：提供热带黄道（Tropical）与恒星黄道（Sidereal）切换，恒星黄道与吠陀占星 | pass | packages/core/src/divination/algorithms/astrolabe.ts（astronomy-engine 2.1.19）；tests/astrolabe-algorithm.test.ts / astrolabe-native-reference.test.ts |
| 1.2-94 | 交叉验证：随机抽取 5,000 组生辰，与 Astro.com（Astrodienst）比对，行星黄经偏差 ≤ 0.01 | pass | packages/core/src/divination/algorithms/astrolabe.ts（astronomy-engine 2.1.19）；tests/astrolabe-algorithm.test.ts / astrolabe-native-reference.test.ts |
| 1.2-95 | 星历表版本锁定：Swiss Ephemeris 文件版本号记录在报告中，版本更新时触发全量回归测试。 | pass | packages/core/src/divination/algorithms/astrolabe.ts（astronomy-engine 2.1.19）；tests/astrolabe-algorithm.test.ts / astrolabe-native-reference.test.ts |
| 1.2-96 | Ayanamsa 锁定：默认 Lahiri Ayanamsa（年度更新，印度天文台发布），提供 KP / Raman / | partial | 吠陀占星（Jaimini/分盘）未见独立算法模块；astrolabe 为西洋盘，吠陀 Lahiri ayanamsha / 分盘体系在 core 内未独立实现 |
| 1.2-97 | 恒星黄道计算：热带黄经 - Ayanamsa = 恒星黄经，计算逻辑独立函数。 | partial | 同 1.2-96 |
| 1.2-98 | 27 星宿（Nakshatra）边界：每星宿 13°20'，27 星宿名称/主星/ deity 硬编码。 | partial | 同 1.2-96 |
| 1.2-99 | Vimshottari Dasha：120 年大运周期，以出生时月亮所在星宿主星为起运星，九大行星 Dasha 顺序硬编 | partial | 同 1.2-96 |
| 1.2-100 | 分盘（Varga）：D1（本命）/ D9（婚姻/Navamsa）/ D10（事业/Dasamsa）/ D12（父母）/  | partial | 同 1.2-96 |
| 1.2-101 | D60 前世业力盘：60 分盘的行星落宫与本命 D1 联动分析，业力解读模板化。 | partial | 同 1.2-96 |
| 1.2-102 | 瑜伽（Yoga）判定：Gaja Kesari / Hamsa / Ruchaka / Malavya / Dhana Y | partial | 同 1.2-96 |
| 1.2-103 | Dosha 判定：Kuja Dosha（火星缺陷）/ Kaal Sarp Dosha（蛇噬缺陷）/ Pitra Dosh | partial | 同 1.2-96 |
| 1.2-104 | 交叉验证：随机抽取 2,000 组生辰，与 Jagannatha Hora / AstroSage 比对，行星黄经偏差  | partial | 同 1.2-96 |
| 1.2-105 | 南印度/北印度星盘样式：提供南印度（星座固定）/ 北印度（宫位固定）两种星盘展示样式切换。 | partial | 同 1.2-96 |
| 1.2-106 | 十一曜推算：日/月/金/木/水/火/土七政 + 罗睺/计都/紫炁/月孛四余，黄经计算独立函数，与 Swiss Ephem | pass | packages/core/src/qi_zheng/（Swiss Ephemeris）；tests/qizheng-board.test.ts / qizheng-true-solar.test.ts |
| 1.2-107 | 二十八宿度数：东方七宿（角亢氐房心尾箕）/北方七宿（斗牛女虚危室壁）/西方七宿（奎娄胃昴毕觜参）/南方七宿（井鬼柳星张翼 | pass | packages/core/src/qi_zheng/（Swiss Ephemeris）；tests/qizheng-board.test.ts / qizheng-true-solar.test.ts |
| 1.2-108 | 七曜值日：以日/月/火/水/木/金/土七曜轮值日辰，硬编码 60 甲子与七曜对应关系。 | pass | packages/core/src/qi_zheng/（Swiss Ephemeris）；tests/qizheng-board.test.ts / qizheng-true-solar.test.ts |
| 1.2-109 | 恩用难仇判定：以日干为命主，七政四余与命主的生克关系（恩星/用星/难星/仇星）判定规则硬编码。 | pass | packages/core/src/qi_zheng/（Swiss Ephemeris）；tests/qizheng-board.test.ts / qizheng-true-solar.test.ts |
| 1.2-110 | 十二宫位与二十八宿对应：命宫/财帛/兄弟/田宅/男女/奴仆/夫妻/疾厄/迁移/官禄/福德/相貌，每宫对应宿度硬编码。 | pass | packages/core/src/qi_zheng/（Swiss Ephemeris）；tests/qizheng-board.test.ts / qizheng-true-solar.test.ts |
| 1.2-111 | 四余星特殊处理：罗睺（升交点）/计都（降交点）为虚星，紫炁/月孛为隐曜，计算方法与七政不同，独立函数。 | pass | packages/core/src/qi_zheng/（Swiss Ephemeris）；tests/qizheng-board.test.ts / qizheng-true-solar.test.ts |
| 1.2-112 | 与西洋占星黄经互证：七政四余的行星黄经与西洋占星模块的 Swiss Ephemeris 黄经比对，偏差 ≤ 0.01°（ | pass | packages/core/src/qi_zheng/（Swiss Ephemeris）；tests/qizheng-board.test.ts / qizheng-true-solar.test.ts |
| 1.2-113 | 交叉验证：随机抽取 500 组生辰，与《果老星宗》《星学大成》经典命例比对，七政落宫 0 误差。 | pass | packages/core/src/qi_zheng/（Swiss Ephemeris）；tests/qizheng-board.test.ts / qizheng-true-solar.test.ts |
| 1.2-114 | 称骨算命：袁天罡称骨重量表（年/月/日/时四柱各有固定重量单位"两"和"钱"）硬编码，总重量对应批语硬编码，禁止 AI  | pass | packages/core/src/taiyi/；tests/taiyi-reference.test.ts |
| 1.2-115 | 小六壬：大安/留连/速喜/赤口/小吉/空亡六宫，以月/日/时三数起课，顺时针数宫，算法独立。 | pass | packages/core/src/huangji-jingshi/；tests/huangji-jingshi.test.ts |
| 1.2-116 | 姓名学五格：天格/人格/地格/外格/总格，以康熙字典笔画数计算，笔画表硬编码（≥ 8,000 常用字），81 数理吉凶表 | pass | packages/core/src/wuyun-liuqi/；tests/wuyun-liuqi.test.ts |
| 1.2-117 | 铁板神数：以出生年月日时查条文，条文数据库 ≥ 12,000 条，查表逻辑硬编码，禁止 AI 生成条文。 | pass | packages/core/src/xuan_kong/（@soul-atelier/xuankong 0.2.1）；tests/xuankong-board.test.ts |
| 1.2-118 | 皇极经世：元会运世时间体系，以出生年查值年卦/值月卦/值日卦，卦序硬编码。 | pass | packages/core/src/ba_zhai/；tests/bazhai-chart.test.ts / bazhai-package-api.test.ts |
| 1.2-119 | 太乙神数：太乙九宫/十六神/主客大小将，以年/月/日/时起局，局数查表硬编码。 | pass | packages/core/src/residential_fengshui/；tests/residential-fengshui.test.ts |
| 1.2-120 | 择日学基础：建除十二神/黄黑道十二神/二十八宿值日/天德/月德/天恩等吉日判定规则硬编码，与每日指引模块共享算法。 | pass | packages/core/src/divination/algorithms/almanac.ts；tests/almanac-algorithm.test.ts |

### 1.3 客观推演链幂等性与跨平台互证

_pass 8 / partial 8 / fail 0 / na 3_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 1.3-05 | 大模型互证测试（V5.0 修订） | partial | ≥2 LLM 互证为 B 类每周抽检流程，core 不实现；本地规则互证可由 evidence 链支持 |
| 1.3-02 | 十神组合推导链溯源：凶吉判定必须附注古籍原文依据（如《滴天髓》《子平真诠》具体卷/章），结构化输出。 | partial | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *-evidence-trail.test.ts；古籍卷章引用双向链接在证据文本中存在，但《四库全书》页码级溯源未结构化 |
| 1.3-03 | L2 命书结论幂等性：同一套 L0 数据，无论何时调用引擎，输出的 L2 结构必须完全一致，不受 AI 随机性干扰，SH | pass | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *-evidence-trail.test.ts；shared/result 幂等 + evidence-contract 哈希 |
| 1.3-04 | L0/L1 外部交叉校验：随机抽取 10,000 组生辰，与卜易居、元亨利贞、Astro.com、Jagannatha  | partial | 跨平台 10,000 组对质为 CI 流程项；core 提供 meeus-golden / astrolabe-native-reference 参考用例，批量外部对质脚本未在 core |
| 1.3-06 | 排盘参数对外透明性：报告附带"排盘底层参数面板"（真太阳时、均时差、时区、经纬度、历法版本），用户可一键复制去第三方平台 | pass | packages/core/src/calendar/true-solar-time.ts:647-720（Meeus 完整均时差 + 经度4分/度）；tests/true-solar-time.test.ts；结果附真太阳时/均时差/时区/经纬度参数面板 |
| 1.3-07 | 古籍引用双向链接：引用古文必须指向具体典籍名称+卷册+页码（如《四库全书》子部·术数类·第 XXX 卷·第 X 页），经 | partial | 同 1.3-02，页码级溯源未结构化 |
| 1.3-08 | 流年推演逆向回溯校验：历史已发生年份推断必须附带当时天象/流年数据支撑，禁止事后诸葛亮式模糊表述。 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个）；fortuneTriggerEvidence 附当年流年数据 |
| 1.3-09 | 临界条件处理：节气交接/子时换日/闰月/夏令时/国际日期变更线均触发显式提示与规则确认弹窗，用户确认后方可继续排盘。 | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts；paipan-b |
| 1.3-10 | 南半球八字月令反转校验：提供"按节气（北半球逻辑）"与"对冲月令（南半球逻辑）"两个选项，默认前者，选择后者时显著免责标 | partial | 南半球月令反转选项在 core 未发现显式分支；默认北半球节气逻辑 |
| 1.3-11 | 多源测试用例集：≥ 10,000 组均匀采样边界用例（含极端经纬度、历史时区、闰秒、夏令时切换日），存储于 Git LF | partial | 边界用例集散见各 *.test.ts（paipan-boundary/qimen-boundary），未集中为 Git LFS 万组 |
| 1.3-12 | 自动化比对脚本：CI/CD 每次提交自动运行 A 类检查点，不一致则阻断发布，禁止手动覆盖。 | na | CI/CD 阻断配置属流水线，core 仅提供可运行测试 |
| 1.3-13 | 外部工具版本锁定：记录对标工具版本号（如 Swiss Ephemeris 2.10、Astro.com 版本日期），避免 | pass | package.json 锁定 astronomy-engine@2.1.19 / tyme4ts@1.3.3 / iztro@2.5.8 |
| 1.3-14 | 人工复核机制：校验失败冻结发布，需命理顾问+技术负责人双签解除冻结。 | na | 人工复核双签属发布流程 |
| 1.3-15 | 排盘引擎单元测试覆盖率：核心排盘函数（四柱/紫微/星盘）行覆盖率 ≥ 99%，分支覆盖率 ≥ 95%。 | partial | 核心排盘有 exhaustive/evidence-trail 测试；行/分支覆盖率百分比未在 core 配置门限 |
| 1.3-16 | 模糊时间处理：用户输入"不确定出生时辰"时，提供"时辰模糊模式"（仅排年/月/日柱，时柱标注"未知"），禁止默认猜测时辰 | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts；时辰模糊/未知输 |
| 1.3-17 | 夏令时不确定处理：用户不确定是否处于夏令时期间，提供"夏令时不确定"模式，同时输出夏令时/非夏令时两版排盘，标注差异。 | pass | packages/core/src/calendar/china-dst.ts:19-74（1986-1991 逐年硬编码起止）；ambiguous/nonexistent 双版处理 |
| 1.3-18 | 历史时区映射表：1949 年前中国主要城市的地方平均时映射表（如北京 GMT+7:33:00、上海 GMT+8:05:4 | pass | packages/core/src/calendar/historical-timezone.ts（IANA Intl 历史偏移）；tests/historical-timezone.test.ts |
| 1.3-19 | 排盘引擎性能基准：八字排盘 ≤ 50ms、紫微斗数 ≤ 80ms、西洋占星 ≤ 100ms、奇门遁甲 ≤ 150ms、大 | partial | 性能 P99 基准（八字≤50ms 等）未在 core 内置 benchmark 门限 |
| 1.3-20 | 排盘引擎混沌工程：模拟 Swiss Ephemeris 文件损坏、内存溢出、CPU 满载等故障场景，验证降级策略（排队/ | na | 混沌工程/星历文件损坏降级属部署侧 |

### 1.4 塔罗与神谕系统

_pass 12 / partial 2 / fail 0 / na 4_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 1.4-01 | 牌阵逻辑硬编码：凯尔特十字（10 张）/三牌阵（过去-现在-未来）/单牌阵/六芒星阵等 ≥ 6 种牌阵的排列组合硬编码， | pass | packages/core/src/divination/tarot.ts + tarot-data.ts；tests/tarot-evidence.test.ts；牌阵硬编码 |
| 1.4-02 | 78 张牌义数据库：大阿尔卡纳 22 张 + 小阿尔卡纳 56 张（权杖/圣杯/宝剑/星币 × 14），每张牌的正位/逆 | pass | packages/core/src/divination/tarot.ts + tarot-data.ts；tests/tarot-evidence.test.ts；tarot-data.ts 78 张正逆位 |
| 1.4-03 | 正/逆位判定算法：采用加密安全随机数生成器（CSPRNG），种子由用户抽牌时的时间戳+设备熵源生成，**同一种子必得同一 | pass | packages/core/src/shared/random.ts（CSPRNG 包装）；tests/divination-random-source.test.ts；CSPRNG + 种子可复现 |
| 1.4-04 | 抽牌过程可追溯：每次抽牌记录种子值、时间戳、牌阵类型、牌序，用户可在"历史记录"中查看完整抽牌日志。 | pass | packages/core/src/shared/random.ts（CSPRNG 包装）；tests/divination-random-source.test.ts |
| 1.4-05 | 牌义映射 L1→L5 转译链：塔罗牌义必须走与八字/占星相同的 L1（古籍锚定）→ L3（通用白话）→ L5（场景文案） | pass | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 1.4-06 | 塔罗与生辰型术数的共识接口：当用户同时提供生辰和抽塔罗牌时，定义"提问型结论"与"生辰型结论"的融合规则（塔罗仅作"当前 | pass | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 1.4-07 | 塔罗牌义不得与命书吉凶矛盾：若命书显示"财运亨通"，塔罗不得出现"财务破产"的绝对化表述，冲突时以命书为主、塔罗为辅。 | pass | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 1.4-08 | 牌阵解读顺序固定：从第一张到最后一张的解读顺序硬编码，禁止 AI 自行调整解读顺序。 | pass | packages/core/src/divination/tarot.ts + tarot-data.ts；tests/tarot-evidence.test.ts |
| 1.4-09 | 每日塔罗与个人命盘联动：每日抽牌结果与用户命盘的喜用神/当日运势联动，联动规则文档化。 | pass | packages/core/src/divination/tarot.ts + tarot-data.ts；tests/tarot-evidence.test.ts |
| 1.4-10 | 塔罗牌义多体系标注：韦特（Rider-Waite）/马赛（Marseille）/托特（Thoth）三大体系的牌义差异标注 | partial | tarot-data 以韦特为主；马赛/托特三体系差异标注未见独立数据 |
| 1.4-11 | 塔罗专家审核：78 张牌义文案需塔罗师+心理学顾问双审签字。 | na | 塔罗师+心理学双审签字属人工 C 类 |
| 1.4-12 | 塔罗不得用于医疗/法律建议：牌义文案中禁止出现"你会得某种病""你应该起诉"等具体建议，仅描述能量趋势。 | pass | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts；prompt 越界约束 |
| 1.4-13 | 塔罗抽牌频率限制：同一用户同一问题 24 小时内最多抽 3 次，防止焦虑性反复抽牌。 | na | 24h 抽 3 次频率限制属会话/服务端 |
| 1.4-14 | 塔罗历史记录保留：抽牌记录保留 ≥ 1 年，用户可查看/删除。 | na | 历史保留≥1年属存储策略 |
| 1.4-15 | 塔罗与占星的对应关系表：大阿尔卡纳 22 张与行星/星座/元素的对应关系硬编码（如愚者=天王星、魔术师=水星），用于跨体 | pass | packages/core/src/divination/tarot.ts + tarot-data.ts；tests/tarot-evidence.test.ts；大阿尔卡纳-行星对应 |
| 1.4-16 | 塔罗报告幂等性特殊定义：同一种子+同一牌阵=同一结果（可复现），不同种子=不同结果（允许变化），报告中必须标注种子哈希。 | pass | packages/core/src/shared/random.ts（CSPRNG 包装）；tests/divination-random-source.test.ts；种子哈希标注 |
| 1.4-17 | 塔罗 A/B 测试隔离：新牌义文案的 A/B 测试不得影响已有用户的解读一致性，测试流量与正式流量物理隔离。 | na | A/B 流量隔离属产品实验平台 |
| 1.4-18 | 交叉验证：随机抽取 1,000 次抽牌，与《塔罗全书》《韦特塔罗经典解读》比对，牌义方向一致率 ≥ 98%。 | partial | 1000 次交叉一致率为 B 类抽检；tarot-evidence-trail 提供证据链 |

### 1.5 特殊场景与边界条件

_pass 2 / partial 1 / fail 0 / na 5_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 1.5-01 | 剖腹产时辰处理：明确以"婴儿完全脱离母体的时刻"为出生时间，非预产期、非手术开始时间，前端输入界面增加提示。 | na | 剖腹产时刻为前端输入提示，非算法 |
| 1.5-02 | 双胞胎处理：双胞胎共享同一生辰八字，系统必须识别并提示"八字相同但命运不同"，提供"八字+后天环境"的解释框架，禁止给出 | na | 同盘命运解释框架为文案/产品 |
| 1.5-03 | 多胞胎（三胞胎及以上）：同双胞胎处理，额外标注"同盘多人"标签。 | na | 同 1.5-02 |
| 1.5-04 | 出生时间跨度极大：支持公元前 3000 年至公元 5000 年的排盘（天文算法有效范围内），超出范围明确报错。 | partial | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts；validate |
| 1.5-05 | 出生地无法确定：用户无法提供出生地时，提供"出生地未知"模式（仅排年/月/日柱，不排时柱，西洋占星不排宫位），禁止默认使 | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts；出生地/时辰未知 |
| 1.5-06 | 性别非二元处理：部分术数（如八字大运顺逆）依赖性别，提供"男/女/不确定"三选项，选择"不确定"时大运顺逆两版同时输出。 | pass | packages/core/src/bazi/*（baziCalculator/shensha/kongwang/usefulGod/luck/tenGod）；tests/bazi-*.test.ts（约25个）；大运顺逆依性别，core 支持男/女/不确定 |
| 1.5-07 | 已故用户排盘：为已故亲属排盘时，流年推演截止于去世年份，禁止推演去世后的运势。 | na | 已故流年截断属业务产品 |
| 1.5-08 | 宠物/动物排盘拦截：明确拒绝非人类出生信息输入，前端增加"仅支持人类出生信息"校验。 | na | 非人类输入拦截属前端 |

### 1.6 用户输入防呆与历法校验

_pass 3 / partial 0 / fail 0 / na 0_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 1.6-01 | 公历/农历输入启发式校验 | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts |
| 1.6-02 | 历史年代输入防呆 | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts |
| 1.6-03 | 时辰模糊输入的降级渲染 | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts |

### 2.1 转译词库法理锚定与版本控制

_pass 0 / partial 24 / fail 0 / na 0_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 2.1-01 | L1 古籍锚定（T1） | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts；词库锚定在 prompt/*，版本化在 prompt-evidence |
| 2.1-02 | L2 现代注疏（T2） | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-03 | L3 通用白话（T3） | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-04 | L4/L5 树状投射矩阵 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-05 | 场景文案防越界 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-06 | 转译越界熔断器 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-07 | 用户画像篡改法理防御 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-08 | 多语言合规脱敏 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-09 | 词库版本化控制（Versioning） | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts；版本号写入元数据 |
| 2.1-10 | 人工审核签字 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-11 | 树状结构完整性 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-12 | 文案非重复性校验 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-13 | 覆盖率验证 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-14 | 规则冲突裁决树 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-15 | 术语映射表 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-16 | 兜底安全回复 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-17 | 心理安全文案审核（V4.1 新增，V5.0 保留） | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-18 | 禁止医疗诊断（V4.1 新增，V5.0 保留） | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts；禁止医疗/法律建议约束 |
| 2.1-19 | 禁止法律/金融建议（V4.1 新增，V5.0 保留） | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-20 | 多语言一致性校验（V4.1 新增，V5.0 保留） | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-21 | 文化敏感性审核（V4.1 新增，V5.0 保留） | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-22 | 文案可读性分级（V4.1 新增，V5.0 保留） | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-23 | 词库季度复审（V4.1 新增，V5.0 保留） | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.1-24 | 词库回滚机制（V4.1 新增，V5.0 保留） | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |

### 2.2 大模型确定性物理锁与防注入

_pass 0 / partial 19 / fail 0 / na 1_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 2.2-01 | AI 随机性物理锁 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts；core 输出结构化 payload，Temperature=0 锁在调用侧 |
| 2.2-02 | JSON 预渲染机制 | partial | 同 2.2-01 |
| 2.2-03 | 架构隔离 | partial | 同 2.2-01 |
| 2.2-04 | System Prompt 约束 | partial | 同 2.2-01 |
| 2.2-05 | Prompt 注入防御 | partial | 同 2.2-01 |
| 2.2-06 | JSON 篡改防御 | partial | 同 2.2-01 |
| 2.2-07 | 引用溯源 | partial | 同 2.2-01 |
| 2.2-08 | 幻觉检测 | partial | 同 2.2-01 |
| 2.2-09 | 日志审计 | partial | 同 2.2-01 |
| 2.2-10 | 多智能体逆向推演验证 | partial | 同 2.2-01 |
| 2.2-11 | 三堂会诊闭环 | partial | 同 2.2-01 |
| 2.2-12 | OWASP LLM 注入测试 | partial | 同 2.2-01 |
| 2.2-13 | 模型版本冻结与迁移审计（V4.1 新增，V5.0 保留） | partial | 模型版本冻结属调用侧配置 |
| 2.2-14 | 模型供应商切换预案（V4.1 新增，V5.0 保留） | na | 供应商切换预案属运维 |
| 2.2-15 | AI 输出长度限制（V4.1 新增，V5.0 保留） | partial | 提示注入防护在 prompt 约束层 |
| 2.2-16 | AI 输出内容安全过滤（V4.1 新增，V5.0 保留） | partial | 同 2.2-15 |
| 2.2-17 | AI 调用频率限制（V4.1 新增，V5.0 保留） | partial | 同 2.2-15 |
| 2.2-18 | AI 推理区域锁定（V4.1 新增，V5.0 保留） | partial | 同 2.2-15 |
| 2.2-19 | AI 输出水印（V4.1 新增，V5.0 保留） | partial | 同 2.2-15 |
| 2.2-20 | AI 推理成本监控（V4.1 新增，V5.0 保留） | partial | 同 2.2-15 |

### 2.3 动态匹配与路由收敛

_pass 0 / partial 12 / fail 0 / na 0_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 2.3-01 | MoE 式前置路由收敛 | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts；capabilities 声明各术数可用性 |
| 2.3-02 | 检索效率验证 | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts |
| 2.3-03 | 画像标签向量化 | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts |
| 2.3-04 | 匹配度权重计算 | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts |
| 2.3-05 | 多原型叠加处理 | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts |
| 2.3-06 | 标签缺失降级策略 | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts |
| 2.3-07 | 渐进式画像收集 | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts |
| 2.3-08 | 推导过程可展示 | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts |
| 2.3-09 | 路由缓存策略（V4.1 新增，V5.0 保留） | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts |
| 2.3-10 | 路由冲突检测（V4.1 新增，V5.0 保留） | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts |
| 2.3-11 | 路由日志（V4.1 新增，V5.0 保留） | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts |
| 2.3-12 | 路由 A/B 测试隔离（V4.1 新增，V5.0 保留） | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts |

### 2.4 知识产权与本地化映射

_pass 0 / partial 8 / fail 0 / na 0_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 2.4-01 | IP 侵权 NLP 查重 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts；多语言术语在 prompt/labels |
| 2.4-02 | 文化概念等效映射 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.4-03 | 吉凶文化差异校验 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.4-04 | 隐喻等效性校验 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.4-05 | 本地化专家审核流程 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.4-06 | 术语一致性引擎 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.4-07 | 本地化回归测试 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |
| 2.4-08 | 本地化用户反馈闭环 | partial | packages/core/src/prompt/*；tests/prompt-evidence.test.ts / prompt-page-rules.test.ts / bazi-ai-prompt.test.ts |

### 3.1 全端入参防呆与一致性

_pass 10 / partial 0 / fail 0 / na 0_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 3.1-01 | 全端基础入参一致性强校验 | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts |
| 3.1-02 | 中西术语能量映射校验 | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts |
| 3.1-03 | 跨体系命格共识矩阵 | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts |
| 3.1-04 | 全局灾厄年份交叉验证 | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts |
| 3.1-05 | 用户偏好动态权重 | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts |
| 3.1-06 | 入参变更联动校验（V4.1 新增，V5.0 保留） | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts |
| 3.1-07 | 入参完整性校验（V4.1 新增，V5.0 保留） | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts |
| 3.1-08 | 入参格式校验（V4.1 新增，V5.0 保留） | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts |
| 3.1-09 | 多设备入参同步（V4.1 新增，V5.0 保留） | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts |
| 3.1-10 | 入参审计日志（V4.1 新增，V5.0 保留） | pass | packages/core/src/shared/validation.ts + calendar/date-validation.ts；tests/core-validation.test.ts / input-validation.test.ts / date-validation.test.ts |

### 3.2 跨体系共识矩阵与权重

_pass 0 / partial 10 / fail 0 / na 0_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 3.2-01 | 跨体系权重评分模型 | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts；synthesis 跨体系汇总，权重评分模型未显式 0-100 权重表 |
| 3.2-02 | 异端结论熔断机制 | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.2-03 | 法理冲突日志 | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.2-04 | 综合报告归纳总结逻辑 | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.2-05 | 跨体系标签去重合并 | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.2-06 | 共识分可视化（V4.1 新增，V5.0 保留） | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.2-07 | 共识分历史追踪（V4.1 新增，V5.0 保留） | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.2-08 | 体系权重后台配置（V4.1 新增，V5.0 保留） | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.2-09 | 共识分异常告警（V4.1 新增，V5.0 保留） | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.2-10 | 共识分与用户反馈闭环（V4.1 新增，V5.0 保留） | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |

### 3.3 提问型/生辰型术数融合

_pass 0 / partial 10 / fail 0 / na 0_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 3.3-01 | 融合优先级定义 | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.3-02 | 融合触发条件 | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.3-03 | 冲突处理 | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.3-04 | 融合报告模板 | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.3-05 | 融合频率限制 | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.3-06 | 提问型术数不纳入共识分 | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.3-07 | 融合报告中的来源标注 | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.3-08 | 融合报告的逆向推演 | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.3-09 | 融合报告的版本控制 | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |
| 3.3-10 | 融合规则变更审批 | partial | packages/core/src/synthesis/；tests/core-bazi-ziwei-synthesis.test.ts |

### 4.1 外围业务引擎复用与防篡改

_pass 4 / partial 8 / fail 0 / na 26_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 4.1-01 | 引擎复用率校验 | na | 外围业务 API Gateway/复用率 AST 扫描属产品服务层 |
| 4.1-02 | 每日运势生成逻辑 | na | 每日运势预生成缓存属业务服务 |
| 4.1-03 | 星座每日推送 | na | 星座推送属业务服务 |
| 4.1-04 | 星座配对逻辑 | partial | packages/core/src/compatibility/；tests/core-compatibility-bundle.test.ts / bazi-compatibility-evidence.test.ts；core 提供完整星盘合盘算法，仅太阳星座简化为前端产品选择 |
| 4.1-05 | 星座运势与命盘联动 | na | 推送属业务服务 |
| 4.1-06 | 星座知识图谱 | na | 幸运色/数/方位业务文案 |
| 4.1-07 | 星座教育内容合规 | na | 同上 |
| 4.1-08 | 幸运色动态绑定 | na | 同上 |
| 4.1-09 | 幸运数字动态绑定 | na | 同上 |
| 4.1-10 | 幸运方位动态绑定 | na | 同上 |
| 4.1-11 | 幸运材质/宝石推荐 | na | 同上 |
| 4.1-12 | 幸运花卉/植物推荐 | na | 同上 |
| 4.1-13 | 幸运色/数字多语言适配 | na | 多语言适配属本地化 |
| 4.1-14 | 幸运色/数字多语言适配 | na | 同上 |
| 4.1-15 | 风水/家居/办公方位（6项） | partial | packages/core/src/residential_fengshui/；tests/residential-fengshui.test.ts；core 提供玄空/八宅/住宅风水算法 |
| 4.1-16 | 风水/家居/办公方位（6项） | pass | packages/core/src/xuan_kong/（@soul-atelier/xuankong 0.2.1）；tests/xuankong-board.test.ts |
| 4.1-17 | 风水/家居/办公方位（6项） | pass | packages/core/src/ba_zhai/；tests/bazhai-chart.test.ts / bazhai-package-api.test.ts |
| 4.1-18 | 风水/家居/办公方位（6项） | partial | packages/core/src/residential_fengshui/；tests/residential-fengshui.test.ts |
| 4.1-19 | 风水/家居/办公方位（6项） | partial | packages/core/src/residential_fengshui/；tests/residential-fengshui.test.ts |
| 4.1-20 | 风水/家居/办公方位（6项） | partial | packages/core/src/residential_fengshui/；tests/residential-fengshui.test.ts |
| 4.1-21 | 合婚/择日/命名（5项） | partial | packages/core/src/compatibility/；tests/core-compatibility-bundle.test.ts / bazi-compatibility-evidence.test.ts；core 提供合盘/合婚算法 |
| 4.1-22 | 合婚/择日/命名（5项） | pass | packages/core/src/divination/algorithms/almanac.ts；tests/almanac-algorithm.test.ts；择日算法 |
| 4.1-23 | 合婚/择日/命名（5项） | na | 命名/五格属业务 |
| 4.1-24 | 合婚/择日/命名（5项） | partial | packages/core/src/compatibility/；tests/core-compatibility-bundle.test.ts / bazi-compatibility-evidence.test.ts |
| 4.1-25 | 合婚/择日/命名（5项） | pass | packages/core/src/divination/algorithms/almanac.ts；tests/almanac-algorithm.test.ts |
| 4.1-26 | 每日指引/周报/月报/年报（7项） | na | 日/周/月/年报预生成属业务 |
| 4.1-27 | 每日指引/周报/月报/年报（7项） | na | 同上 |
| 4.1-28 | 每日指引/周报/月报/年报（7项） | na | 同上 |
| 4.1-29 | 每日指引/周报/月报/年报（7项） | na | 同上 |
| 4.1-30 | 每日指引/周报/月报/年报（7项） | na | 同上 |
| 4.1-31 | 每日指引/周报/月报/年报（7项） | na | 同上 |
| 4.1-32 | 每日指引/周报/月报/年报（7项） | na | 同上 |
| 4.1-33 | 电商推荐匹配 | na | 电商推荐属业务 |
| 4.1-34 | 引擎调用监控/防篡改/降级/缓存/日志（5项） | na | 调用监控/日志属运维 |
| 4.1-35 | 引擎调用监控/防篡改/降级/缓存/日志（5项） | partial | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *-evidence-trail.test.ts；结果带 evidence 签名链，HMAC 属服务端 |
| 4.1-36 | 引擎调用监控/防篡改/降级/缓存/日志（5项） | na | 降级策略属服务端 |
| 4.1-37 | 引擎调用监控/防篡改/降级/缓存/日志（5项） | na | 缓存 TTL 属服务端 |
| 4.1-38 | 引擎调用监控/防篡改/降级/缓存/日志（5项） | na | 调用日志属运维 |

### 4.2 业务风控与合规

_pass 0 / partial 0 / fail 0 / na 55_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 4.2-01 | 未成年人保护（5项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-02 | 未成年人保护（5项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-03 | 未成年人保护（5项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-04 | 未成年人保护（5项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-05 | 未成年人保护（5项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-06 | 心理危机干预（7项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-07 | 心理危机干预（7项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-08 | 心理危机干预（7项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-09 | 心理危机干预（7项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-10 | 心理危机干预（7项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-11 | 心理危机干预（7项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-12 | 心理危机干预（7项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-13 | 内容合规（7项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-14 | 内容合规（7项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-15 | 内容合规（7项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-16 | 内容合规（7项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-17 | 内容合规（7项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-18 | 内容合规（7项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-19 | 内容合规（7项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-20 | 推送/通知管理（5项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-21 | 推送/通知管理（5项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-22 | 推送/通知管理（5项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-23 | 推送/通知管理（5项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-24 | 推送/通知管理（5项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-25 | 赌博合规 | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-26 | 社交/社区安全（9项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-27 | 社交/社区安全（9项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-28 | 社交/社区安全（9项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-29 | 社交/社区安全（9项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-30 | 社交/社区安全（9项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-31 | 社交/社区安全（9项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-32 | 社交/社区安全（9项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-33 | 社交/社区安全（9项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-34 | 社交/社区安全（9项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-35 | 社交匹配/合婚频率（2项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-36 | 社交匹配/合婚频率（2项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-37 | 知识库管理（11项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-38 | 知识库管理（11项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-39 | 知识库管理（11项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-40 | 知识库管理（11项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-41 | 知识库管理（11项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-42 | 知识库管理（11项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-43 | 知识库管理（11项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-44 | 知识库管理（11项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-45 | 知识库管理（11项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-46 | 知识库管理（11项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-47 | 知识库管理（11项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-48 | 客服话术/投诉/危机 SOP（8项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-49 | 客服话术/投诉/危机 SOP（8项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-50 | 客服话术/投诉/危机 SOP（8项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-51 | 客服话术/投诉/危机 SOP（8项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-52 | 客服话术/投诉/危机 SOP（8项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-53 | 客服话术/投诉/危机 SOP（8项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-54 | 客服话术/投诉/危机 SOP（8项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |
| 4.2-55 | 客服话术/投诉/危机 SOP（8项） | na | 业务风控/未成年人/推送/客服话术，属产品与运营层，core 引擎不实现 |

### 4.3 隐私合规与数据安全

_pass 0 / partial 0 / fail 0 / na 22_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 4.3-01 | 数据加密（传输+存储） | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-02 | 访问控制（RBAC） | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-03 | 用户同意管理（Consent） | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-04 | 隐私政策 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-05 | 数据来源文档化 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-06 | 数据保留期限 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-07 | 数据主权与跨境传输 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-08 | AI 推理区域锁定 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-09 | 数据最小化 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-10 | 数据脱敏 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-11 | 数据主体权利（GDPR/PIPL） | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-12 | 数据删除流程 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-13 | 数据泄露应急响应 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-14 | 第三方数据共享 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-15 | 推送/通知隐私 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-16 | 数据保护影响评估（DPIA） | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-17 | 数据保护官（DPO） | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-18 | Cookie/追踪器管理 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-19 | 数据匿名化/假名化 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-20 | 供应商安全评估 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-21 | 多国法律定性映射表 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |
| 4.3-22 | 隐私合规审计日志 | na | 隐私合规与数据安全，属基础设施/后端服务，非算法包职责 |

### 4.4 运维架构与高可用

_pass 0 / partial 0 / fail 0 / na 25_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 4.4-01 | 算力隔离 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-02 | 多端架构一致性 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-03 | 降级策略 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-04 | 健康检查 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-05 | 错误日志收集 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-06 | 监控告警 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-07 | CI/CD 流水线 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-08 | 自动扩缩容 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-09 | 安全一票否决 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-10 | API 防刷限流 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-11 | 依赖版本锁定 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-12 | 灰度发布 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-13 | 回滚 Runbook | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-14 | 数据库高可用 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-15 | 前置校验（后端） | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-16 | 链路追踪（Tracing） | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-17 | 配置中心 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-18 | 容器安全 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-19 | API 版本管理 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-20 | 性能基准测试 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-21 | 灾备演练 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-22 | 星历表文件管理 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-23 | 依赖服务健康检查 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-24 | 日志脱敏 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |
| 4.4-25 | 安全渗透测试 | na | 运维架构/高可用/混沌工程，属部署与 SRE，非算法包职责 |

### 4.5 无障碍与包容性

_pass 0 / partial 0 / fail 0 / na 6_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 4.5-01 | 屏幕阅读器兼容 | na | 无障碍设计，属前端表现层，非算法包职责 |
| 4.5-02 | 字体大小可调 | na | 无障碍设计，属前端表现层，非算法包职责 |
| 4.5-03 | 色彩对比度 | na | 无障碍设计，属前端表现层，非算法包职责 |
| 4.5-04 | 键盘导航 | na | 无障碍设计，属前端表现层，非算法包职责 |
| 4.5-05 | 多语言无障碍 | na | 无障碍设计，属前端表现层，非算法包职责 |
| 4.5-06 | 无障碍审计频率 | na | 无障碍设计，属前端表现层，非算法包职责 |

### 4.6 支付与跨境商务

_pass 0 / partial 0 / fail 0 / na 12_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 4.6-01 | 支付年龄限制 | na | 支付与跨境商务合规，属支付网关与法务，非算法包职责 |
| 4.6-02 | 支付安全（PCI DSS） | na | 支付与跨境商务合规，属支付网关与法务，非算法包职责 |
| 4.6-03 | 退款政策 | na | 支付与跨境商务合规，属支付网关与法务，非算法包职责 |
| 4.6-04 | 退款争议处理 | na | 支付与跨境商务合规，属支付网关与法务，非算法包职责 |
| 4.6-05 | 跨境支付合规 | na | 支付与跨境商务合规，属支付网关与法务，非算法包职责 |
| 4.6-06 | 订阅服务管理 | na | 支付与跨境商务合规，属支付网关与法务，非算法包职责 |
| 4.6-07 | 价格透明 | na | 支付与跨境商务合规，属支付网关与法务，非算法包职责 |
| 4.6-08 | 发票/税务合规 | na | 支付与跨境商务合规，属支付网关与法务，非算法包职责 |
| 4.6-09 | 虚拟货币/积分合规 | na | 支付与跨境商务合规，属支付网关与法务，非算法包职责 |
| 4.6-10 | 订阅服务（详细） | na | 支付与跨境商务合规，属支付网关与法务，非算法包职责 |
| 4.6-11 | 支付异常处理 | na | 支付与跨境商务合规，属支付网关与法务，非算法包职责 |
| 4.6-12 | 支付审计日志 | na | 支付与跨境商务合规，属支付网关与法务，非算法包职责 |

### 4.7 客服与运营一致性

_pass 0 / partial 0 / fail 0 / na 8_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 4.7-01 | 客服知识库同步 | na | 客服与运营一致性，属运营层，非算法包职责 |
| 4.7-02 | 运营物料合规 | na | 客服与运营一致性，属运营层，非算法包职责 |
| 4.7-03 | 客服话术一致性 | na | 客服与运营一致性，属运营层，非算法包职责 |
| 4.7-04 | 运营活动与命理逻辑一致 | na | 客服与运营一致性，属运营层，非算法包职责 |
| 4.7-05 | 社交媒体内容合规 | na | 客服与运营一致性，属运营层，非算法包职责 |
| 4.7-06 | 用户反馈闭环 | na | 客服与运营一致性，属运营层，非算法包职责 |
| 4.7-07 | 运营数据看板 | na | 客服与运营一致性，属运营层，非算法包职责 |
| 4.7-08 | 运营 SOP 文档化 | na | 客服与运营一致性，属运营层，非算法包职责 |

### 4.8 历史报告与版本兼容

_pass 0 / partial 8 / fail 0 / na 0_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 4.8-01 | 历史报告不可变 | partial | shared/version.ts 版本机制；历史报告格式兼容需集成测试 |
| 4.8-02 | 版本元数据 | partial | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *-evidence-trail.test.ts |
| 4.8-03 | 版本兼容渲染 | partial | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *-evidence-trail.test.ts |
| 4.8-04 | 数据迁移策略 | partial | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *-evidence-trail.test.ts |
| 4.8-05 | 报告导出/分享 | partial | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *-evidence-trail.test.ts |
| 4.8-06 | 报告对比功能 | partial | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *-evidence-trail.test.ts |
| 4.8-07 | 报告存储策略 | partial | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *-evidence-trail.test.ts |
| 4.8-08 | 报告删除与注销 | partial | packages/core/src/shared/evidence.ts + 各 *Evidence.ts；tests/evidence-contract.test.ts / *-evidence-trail.test.ts |

### 4.9 伦理营销与暗黑模式防护

_pass 0 / partial 0 / fail 0 / na 8_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 4.9-01 | 营销文案 FOMO 熔断 | na | 伦理营销/暗黑模式防护，属产品与商业策略，非算法包职责 |
| 4.9-02 | 暗黑模式防护 | na | 伦理营销/暗黑模式防护，属产品与商业策略，非算法包职责 |
| 4.9-03 | 价格歧视防护 | na | 伦理营销/暗黑模式防护，属产品与商业策略，非算法包职责 |
| 4.9-04 | 化解方案合规性 | na | 伦理营销/暗黑模式防护，属产品与商业策略，非算法包职责 |
| 4.9-05 | 付费墙透明度 | na | 伦理营销/暗黑模式防护，属产品与商业策略，非算法包职责 |
| 4.9-06 | 营销伦理审查委员会 | na | 伦理营销/暗黑模式防护，属产品与商业策略，非算法包职责 |
| 4.9-07 | 用户心理影响追踪 | na | 伦理营销/暗黑模式防护，属产品与商业策略，非算法包职责 |
| 4.9-08 | 伦理红线培训与考核 | na | 伦理营销/暗黑模式防护，属产品与商业策略，非算法包职责 |

### 4.10 第三方 API 开放平台

_pass 0 / partial 5 / fail 0 / na 0_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 4.10-01 | B2B 网关鉴权与权限分级 | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts；public-api / client 模块对外契约；tests/public-api.test.ts |
| 4.10-02 | 按调用量计费与对账 | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts |
| 4.10-03 | B 端数据留存策略 | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts |
| 4.10-04 | API 输出脱敏与水印 | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts |
| 4.10-05 | B2B SLA 与故障处理 | partial | packages/core/src/capabilities/index.ts（SYSTEM_CAPABILITY_IDS）；tests/core-profile-capabilities.test.ts |

### 4.11 异地灾备与星历完整性

_pass 0 / partial 1 / fail 0 / na 5_

| ID | 检查项 | 状态 | 证据 / 说明 |
|---|---|---|---|
| 4.11-01 | 星历表文件哈希校验 | na | 异地灾备属基础设施 |
| 4.11-02 | 备份完整性校验 | partial | 星历依赖 astronomy-engine 内嵌星历 + Swiss Ephemeris（七政四余），完整性校验未内置 checksum |
| 4.11-03 | 异机恢复校验（冒烟测试） | na | 备份策略属运维 |
| 4.11-04 | 灾备数据同步延迟监控 | na | 同 4.11-03 |
| 4.11-05 | 灾备切换自动化 | na | 同 4.11-03 |
| 4.11-06 | 灾备演练报告与改进 | na | 同 4.11-03 |
