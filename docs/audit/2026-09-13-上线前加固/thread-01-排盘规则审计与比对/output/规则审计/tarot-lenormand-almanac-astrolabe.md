# 规则审计分表 · tarot 塔罗 / lenormand 雷诺曼 / almanac 黄历择日 / astrolabe 西洋占星

> T1·S2 批次2b2 ｜ 2026-09-13 ｜ 取证：Explore 代理深读 ｜ 未证实处标【待核】
> 根 = `E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统`，DIV = `packages\core\src\divination`，T = `tests`

## tarot 塔罗
- **规则来源**：78 张牌表 DIV\tarot-data.ts:1-89（大阿尔卡那 22 张+四花色×14=56 小阿尔卡那，number 为 1-78 顺序 ID）；牌义硬编码 78 条 DIV\tarot.ts:186-265；文件头声明依据 RWS/Waite《Pictorial Key to the Tarot》(tarot.ts:3)。**牌阵 10 个（非任务卡所称 15）**：DIV\tarot-data.ts:91-192，测试断言 =10（T\tarot-evidence.test.ts:14）。
- **关键规则**：① 全 78 张 Fisher-Yates 洗牌取前 cardCount 张（tarot.ts:113-120,157）；② 正逆位每张独立 randomFloat<0.5（tarot.ts:66-69,159）；③ 相邻牌位逐对元素互参：火/水/风/土 相助/制约/同类强化/中性并置，大阿尔卡那不强行归元素（tarot.ts:274-280；T\tarot-evidence.test.ts:137-201）；④ 主题仅标签计数无权重（测试 390-408）；⑤ 逆位生成指向所属牌面的反证事实（测试 275-312）。
- **输入契约**：spreadType 枚举 single/three/love/career/decision/celtic/chakra/year/mindBodySpirit/horseshoe；RandomOptions{seed}；manualCards[{id,reversed}]（不可重复、数量须等于 cardCount）；interactiveSamples 每张牌 2 个样本（抽牌+正逆位），与 seed/manualCards 互斥（tarot.ts:310-316）。
- **输出契约**：{spreadType,spreadName,cards[{id,name,position,reversed,keywords,element,archetype}],draw{deckSize,method,orientationRule,order},evidenceAnalysis,evidenceTrail}；meta.algorithm=tarot.single/spread/manual/spread.interactive。
- **边界处理**：seed 可复现；interactive 回放 {mode:'system',samples}（tarot.ts:341）；手工录入 randomFact=不适用；缺 draw 记录→「来源链缺失」不反推（测试 314-331）；篡改→「来源链不一致」；不涉及占时/真太阳时。
- **疑点/待核**：①【B类】愚者编号=1（非传统 0 号）、力量居战车后——系顺序 ID 但未注明语义【待核出处，对外牌序展示需与 RWS 惯例核对】；② tarot.ts 的 getCardEvidence 与 tarot-evidence.ts 两套牌义引用无交叉校验【待核】。

## lenormand 雷诺曼
- **规则来源**：36 张牌表+29 条固定两牌组合 DIV\algorithms\lenormand.ts:28-205,281-311；头注依据 Petit Lenormand 及 1799《Das Spiel der Hoffnung》(lenormand.ts:3)。牌阵 **8 个**：single/three/five/relationship/decision/nine/element/grandTableau（lenormand.ts:207-239）。
- **关键规则**：① Fisher-Yates 36 张取前 N（268-275）；② 组合解读：nine/grandTableau 按 8 邻域（含对角）相邻对（324-354，九宫恒 20 对，T\lenormand-algorithm.test.ts:91），其余牌阵牌序相邻 n-1 对；③ 大桌仅保留固定组合或人物牌（男士/女士）近身组合（lenormand.ts:373-380）；④ 大桌宫位=同序牌名（1:1 落宫）+归宫牌检测（493-506,542-547）；⑤ 加载期自校验 36 张/宫位/组合引用（403-433）。
- **输入契约**：spreadType 8 枚举；RandomOptions|manualCardIds|interactiveSamples（1 样本/张，**无正逆位机制**），三者互斥（462-481）。
- **输出契约**：{cards[{position,house,row,column}],combinations[{card1,card2,relation,meaning,source:'固定组合'|'相邻牌义合读'}],layoutEvidence,draw{deckSize,method,order},evidenceAnalysis,evidenceTrail}。
- **边界处理**：大桌行末与次行行首不判相邻（测试 192-206）；手动/interactive 冲突校验同塔罗；旧数据缺 draw/布局→证据缺口不反推（测试 335-362）；未知牌阵报错不静默回退（测试 353-355）。
- **疑点/待核**：①【B类】大桌为 9 列×4 行行优先映射（lenormand.ts:494 columns=9），与传统 8×4 或 4×9 读法不同【待核口径出处】；② 固定组合仅 29 条，大桌多数相邻对无固定义不输出（设计如此，覆盖率有限）。

## almanac 黄历择日
- **规则来源**：宜忌/建除/十二神/神煞吉凶全部取自 tyme4ts ^1.3.3（LunarDay.getRecommends/getAvoids/getDuty/getTwelveStar/getGods→God.getLuck()，DIV\algorithms\almanac.ts:836-839,870-871；T\almanac-topic-rules.test.ts:5-38 明确「只映射原始宜忌、不生成本地硬规则」）。本地校勘表：彭祖百忌 10 干+12 支（almanac.ts:402-428）、二十八宿动物（430-459）、地支方位（99-112）、岁支十二神顺排（114-129）；头注《钦定协纪辨方书》《选择要略》(almanac.ts:3)。
- **关键规则**：① 逐日干支取正午八字（210-214），交节当天年/月柱按节气精确分界（T\almanac-algorithm.test.ts:170-190）；② 话题=关键词匹配原始宜忌（TOPIC_RECOMMEND/AVOID_KEYWORDS，63-87）；③ 排序=状态→宜项支持数→日期（939-952）；状态分级：强约束（话题忌限/参与人刑冲破害/诸事不宜）→慎用，其余约束→条件候选（DIV\almanac-evidence.ts:462-503）；④ 参与人≤30，候选日/时支对其年支、日支核六冲/三刑/六害/六破（almanac.ts:535-599）；⑤ 13 时辰（含早晚子）全列、不生成首选时辰（759-816；测试 356-388）。
- **输入契约**：topic 10 枚举 move/marriage/opening/contract/travel/medical/study/burial/renovation/custom（50-61）；startDate/endDate YYYY-MM-DD 1900-2100、跨度≤31 天（929-936）；participants≤30（gender/dateType solar|lunar/timeIndex 0-12/isLeapMonth；空行忽略、半填报错）。
- **输出契约**：{topic,topicLabel,startDate,endDate,days[{date,moonPhaseEvidence,weekday,lunarDate,ganzhi,zodiac,dayOfficer,twelveStar,twentyEightStar(+Detail),nineStar(+Detail),gods,recommends,avoids,pengZuGan/Zhi,clash,annualDirectionGods×12,highlights,cautions,topicMatchFacts,godFacts,participantRelationFacts,hours×13}],participants,evidenceAnalysis,evidenceTrail}。
- **边界处理**：月相证据统一用 Date.UTC(当日 04:00)≈北京正午参照，声明不参与评分（826-830）；参与人八字 useTrueSolarTime:false（307）；无 score 字段（测试 223）；1900-2100 年 4 关键日期资料链全量校验（测试 414-446）；纯确定性、无随机。
- **疑点/待核**：①「月将」未出现在黄历代码（属六壬概念）【已核：无月将依赖】；② 建除断言绑定 2026-06 固定日期，tyme4ts 版本漂移风险【待核】；③ 分页：核心层无分页参数，仅 31 天上限+证据链候选日期只列前 20（DIV\almanacEvidence.ts:57），线上 API 有分页（metadata.ts AlmanacPagination）——两侧口径已对上【已核】。

## astrolabe 西洋占星（含合盘）
- **规则来源**：星历库 celestine ^0.2.1（自述对标 NASA/JPL Horizons/Swiss Ephemeris，见 packages\core\node_modules\celestine\package.json；packages\core\package.json），calculateChart 指定 **houseSystem:'placidus'**，开启小行星/凯龙/Lilith('true')/交点('true')/阿拉伯点，10 种 AspectType，minimumAspectStrength:30（DIV\algorithms\astrolabe.ts:313-346）；astronomy-engine 2.1.19 仅用于 core\calendar\utc-tt.ts（ΔT/TT 换算）；月相/太阳光照同用 celestine（core\calendar\moon-phase-evidence.ts:5）。
- **关键规则**：① 相位紧密三档按 偏差/容许度 比率：≤1/3 紧密、≤2/3 中等（DIV\astrolabe-aspect-evidence.ts:3-8）；② 全相位返回不截 12 条（T\astrolabe-algorithm.test.ts:112-117）；③ 真太阳时仅作传统参考证据、不改盘面（astrolabe.ts:290-302；测试 100-110 deepEqual）；④ 金标回归：18 个边界/跨世纪样本逐黄经复现 celestine 原生输出（432 点位/216 宫头/551 相位，T\astrolabe-native-reference.test.ts:282-437）；⑤ 北交点别名归一（astrolabe.ts:52-60）。
- **合盘** analyzeAstrolabeSynastry（DIV\astrolabe-synastry.ts:653-790）：比较盘式（跨盘黄经最小夹角相位+双向宫位叠加 overlay），**无中点/组合盘**（全 DIV 无「中点」字样）；5 主要相位默认容许度 合8/六合4/刑6/拱6/冲8，可配 0-15（17-29,116-118）；orbRatio 排序、maxAspects 默认 40（1-200）截断；宫头区间半开定位（166-186）；不返回 strength/百分比/匹配分（methodology 注 780-786）。
- **输入契约**：AstrolabeBirthInput 全字符串字段（year/month/day/hour/minute/lat/long/timezone|timeZoneId/useTrueSolarTime/locationName）；年 1900-2100、时区 -12~14（astrolabe.ts:205-289）。高级时限 scope 枚举 natal/full/yearly/monthly/daily（DIV\astrolabe-scope.ts:11）：太阳返照（2h 步长+二分法定位太阳回归，scope.ts:1262-）、次限（一岁一日，686-）、太阳弧（推进太阳差值平移，954-），目标年 1900-2200（680-684）。
- **输出契约**：AstrolabeData{birth(含 trueSolarEvidence/timezoneEvidence),planets(>10),angles×4,houses×12,aspects[{exactAngle,actualAngle,orb,allowedOrb,normalizedOrbRatio,closeness,applying,isOutOfSign}],solarIllumination,summary{elements/modalities/retrograde/patterns},evidenceAnalysis,evidenceTrail}；合盘返回 calculationSteps×7/aspects/houseOverlays/summary/counterEvidenceFacts×4/limitationFacts×6/methodology。
- **边界处理**：时区 ambiguous 时按固定偏移消歧并保留诊断（测试 367-410）；极区 Placidus 有南极点样本（native-reference 229-244）；旧数据缺几何量不反推（astrolabe-algorithm.test.ts:260-294）；出生秒固定为 0。
- **疑点/待核**：① minimumAspectStrength=30 注释自认口径需评估（astrolabe.ts:342-344）【待核阈值依据】；② astrolabe-scope.ts（1885 行，返照/次限/太阳弧）不在 test:prompt 清单内，仅源码核对【待核其测试覆盖】；③【产品一致性】合盘无组合盘/中点且明令禁止匹配分——若产品层宣称「配对评分」即与代码不符，需 T2/前端对齐。

## 批次2b2 结论
四体系规则载体完整、证据链契约严格（不反推/不静默回退）。需主控知悉的三个口径级事实：塔罗 10 牌阵（任务卡 15 系口径差）；雷诺曼大桌 9×4 映射；占星合盘为比较盘、无配对评分。塔罗愚者编号语义、占星相位阈值 30 为两条待核项。
