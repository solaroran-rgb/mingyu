# 规则审计分表 · taiyi 太乙 / huangji-jingshi 皇极经世 / wuyun-liuqi 五运六气

> T1·S2 批次1 ｜ 2026-09-13 ｜ 取证：Explore 代理深读 ｜ 未证实处标【待核】
> 根 = `E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统`，core = `packages\core\src`

## taiyi 太乙神数

- **规则来源**：自述依《太乙金镜式经》并与固定版本 Kintaiyi（github kentang2017/kintaiyi @9842d8f，commit 链接硬编码于 core\taiyi\index.ts:305）交叉校核。硬编码常数：TAIYI_BASE_YEARS = 10153917（太乙统宗年家积年基数，index.ts:34）；积年+公元年 → 除 72 余 0 作第 72 局（index.ts:312-315,446）；360 周期余数、72/60 数段（index.ts:445,469-470）；七十二局太乙/文昌/始击位置与主客定算为阳遁/阴遁两套硬编码立成表（index.ts:68-233）；计神按年支查阴阳遁两表（:235-263）；八宫编号非洛书（1乾2离3艮4震6兑7坤8坎9巽，:37-46）。年计干支取自 tyme4ts 八字年柱（getGanZhiFromDate → eightChar.getYear()，core\ganzhi\index.ts:470-478）。
- **代码位置**：core\taiyi\index.ts（排盘主体+立成表）；core\taiyi\evidence.ts（结构化证据，含算式复算核验 evidence.ts:532-538）；core\taiyi\taiyiEvidence.ts（v3.0 四字段 evidenceTrail）。
- **输入契约**：capability 仅 `year`（number，必填）+ 可选 `scope`（仅 'year'，capabilities\index.ts:913-933）。函数入参 {date?, ganZhi?, scope?(默认'year'), year?}（index.ts:285-290）；年计强制只收 year、拒绝 date（index.ts:418），year 限 1–9999 安全整数；可选 ganZhi 须与 tyme4ts 算出一致否则抛错（:426-433）。
- **输出契约**：scope/ganZhi/accumulatedValue/accumulatedYears/entryYears/yuan/ji/yinYang(恒'阳遁')/bureau/taiyiPosition/taiyiPalace/taiyiGua/taiyiDir/wenChang*/shiJi*/jiShen*/lord·guest·setCount/将参 6 宫位/sixteenGods(16)/judgments(掩囚等)/model/evidenceAnalysis/prompt/evidenceTrail（index.ts:547-584；tests\core-new-systems.test.ts:341-376 全字段断言）。
- **边界处理**：月/日/时计失败关闭（抛错拒绝近似盘，index.ts:404-407；test 511-516）。积年换算内部自校验（evidence.ts:532-538）。年界：探针日期用 `new Date(0)`+`setFullYear(year,6,1)`（7 月 1 日）规避两位数年陷阱，测试明确覆盖公元 1 年（tests\core-new-systems.test.ts:570-576）。positiveOneBased 双实现互为等价复算。无随机源（supports 全 false，capabilities:935-941）。闰月/时区不涉及（只取年柱，7 月探针避开立春节界）。
- **判定与疑点**：
  1. 【待核·D类】阴遁表（YIN_*、YIN_JISHEN、YIN_CALCULATIONS）实际永不执行——yinYang 恒 '阳遁' as const（index.ts:448），阴遁支路是死代码，无法验证正确性。
  2. 【待核·B类】积年 10153917 仅注明「太乙统宗」，未注明版本出处细节；evidenceTrail 自认「积年基准不同流派存在差异」（taiyiEvidence.ts:47）。
  3. 【待核】yuan/ji 仅是 ceil(entryYears/72) 与 /60 的「数段」，代码自承「不等同于已经统一版本口径的元纪」（evidence.ts:127,500-516）。
  4. 【待核】generalPalaceFromCount 主方 value%10===0 特判返 1、客方返 5（index.ts:359-363），规则出处未注明。
  5. 【待核】始击 SHIJI_POINTS 无阴遁版本，阳遁表直接共用（index.ts:80-82,451）。
  6. 【待核】年柱口径是 tyme4ts 立春界（ganzhi\index.ts:469-478），与太乙积年整年口径是否一致无注释说明。

## huangji-jingshi 皇极经世

- **规则来源**：纯数学换算，标注传统依据《皇极经世》与蔡元定《皇极经世指要》（core\huangji-jingshi\index.ts:4,25-34）。硬编码常数：1 世=30 年、1 运=360、1 会=10800、1 元=129600；12 会/元、30 运/会、12 世/运、4320 世/元（index.ts:9-23）。**无固定历元**：纪元 epochYear 由调用方必填给出（index.ts:37-39）。
- **代码位置**：core\huangji-jingshi\index.ts（换算+提示词）；core\huangji-jingshi\huangjiJingshiEvidence.ts（v3.0 证据链）。
- **输入契约**：capability epochYear（number 必填）、year/elapsedYears（二选一，capabilities:997-1023）+ question。函数同构；year 与 elapsedYears 必须且只能一个、year≥epochYear、elapsedYears≥0、全量安全整数校验（index.ts:122-147）。
- **输出契约**：input{mode:'年坐标'|'已过年数'}/position{yuan.hui.yun.shi.year 各层序号+起止年}/progress{各层 currentYearIndex/completedYears/remainingYearsAfterCurrent/nextCycleStartYear}/conversion/calculationChain/sources/limitations/prompt/evidenceTrail（index.ts:59-97；tests\huangji-jingshi.test.ts:19-67 断言）。
- **边界处理**：换算基准 floor(elapsed/129600)+逐层取余，一基序号（index.ts:209-218）；差一错误有显式测试（第 129599/129600 年边界，tests\huangji-jingshi.test.ts:40-67）；buildProgress 对越界抛错（index.ts:153-171）。公元前：仅整数年坐标，**不解释为公元/民国纪年**（limitations，index.ts:291-295）；epochYear 允许负整数（仅安全整数校验），但无 BCE 专门口径【待核】。随机/闰月/时区不涉及（纯整数年坐标）。
- **判定与疑点**：
  1. 【待核】不含值年卦、卦气、事件预测（自述，index.ts:294）——产品口径需在文案层声明。
  2. 【待核·B类】纪元选择完全依赖调用方，代码不提供推荐 epochYear（如邵雍尧元），「更换纪元会改变全部位置」（index.ts:293）——S3 比对时必须固定同一 epochYear，否则比对无意义。
  3. 【待核】换算为通行口径，代码/测试自认「不同版本有差异」（huangjiJingshiEvidence.ts:77,110）。

## wuyun-liuqi 五运六气

- **规则来源**：标注《素问·天元纪大论/五运行大论/六微旨大论》及吴谦《运气要诀》（core\wuyun-liuqi\index.ts:10-28）。硬编码：天干化五运+太过不及表（甲己土、乙庚金、丙辛水、丁壬木、戊癸火，阳干太过阴干不及，index.ts:161-175）；地支配司天在泉 12 支表（:267-280）；主气序与客气序（少阳/太阴次序两表不同，:249-265）；五步交司=大寒日起、春分后13日、芒种后10日、处暑后7日、立冬后4日（《运气要诀》口径，:197-237）；六步节令自大寒起每步四节气（:292-299）；岁会本位表（木卯火午土辰戌丑未金酉水子，:301-311）；符会 26 vs 28 年校勘说明（:313-318）。五行生克复用 core\wuxing 的 isKe/isSheng（index.ts:7）。
- **代码位置**：core\wuyun-liuqi\index.ts（排盘主体）；core\wuyun-liuqi\wuyunLiuqiEvidence.ts（v3.0 证据链）。
- **输入契约**：capability year（可选）/yearGanZhi（可选，至少一项）/question（capabilities:945-964）。函数 {year?, yearGanZhi?, question?}；二者同供须一致（index.ts:349-354），year 限 1–9999（:324-329）。
- **输出契约**：input{yearGanZhiSource:'明确年干支'|'公历年年中换算'}/annualMovement(岁运五行、五音太少toneName、太过不及)/sitian/zaiquan/annualRelation(同气顺化天刑小逆不和)/annualConformities(五类符会+facts+sourceReconciliation)/movementSteps(5步主客运+startBoundary+periodRule+主客关系)/qiSteps(6步主客气+solarTerms+guestRole)/calculationChain/sources/limitations/prompt/evidenceTrail（index.ts:137-159；tests\wuyun-liuqi.test.ts:288-318）。
- **边界处理**：交司口径取**大寒**起初运（非立春/冬至），且显式声明「不把节气后第几日换算成精确到时分秒的交运时刻」（index.ts:200-203,692；test:166-205）；客气轮转以司天落三之气、在泉落终之气反推并自校验（:573-591,658-660）；司天在泉纯查表（:267-280）；年干支=年中口径（1984 甲子基准 mod(year-1984,60)，:331-337），避开元旦/立春混淆。无随机源。闰月/时区不涉及（年粒度）。生克五分类 60 甲子各 12 年有全量测试（test:207-216）；符会逐年名单锁定（test:218-267）。
- **判定与疑点**：
  1. 【待核·B类】交司按《运气要诀》大寒起运，与其它学派（冬至/立春起运）无对比实现；代码仅单一口径——S6 归「口径文档化」。
  2. 【待核】主运五音太少以「中运位置奇偶」推定（mod(index-annualIndex,2)，index.ts:470-475），即「太少相生」简化为隔位同太少，未注释与《运气要诀》逐年五音建运条文的一致性（测试仅锁 4 例+60 甲子规律性）。
  3. 【待核】同天符/同岁会以中运阴阳干+在泉同五行判定（index.ts:526-528），tongTianfu 含甲辰戌、庚子午等 6 年，依赖测试硬编码名单而非古籍条文引注。
  4. 【待核·已知源内冲突】sourceReconciliation 明示逐项去重 26 年与原文「二十八年」汇总不一致，采用逐项定义（index.ts:313-318）。

## 共用测试

tests\core-new-systems.test.ts：太乙三处（338-576：2004 全字段对拍、72 局全覆盖、公元 1 年边界、month/day/hour 拒绝）；ganzhi/tyme4ts 权威后端测试佐证干支依赖（626-661）。三体系 capability supports 均全 false（capabilities:935-941,984-990,1034-1039），无随机可复现需求。
