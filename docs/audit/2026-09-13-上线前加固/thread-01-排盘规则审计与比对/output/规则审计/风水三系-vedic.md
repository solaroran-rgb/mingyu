# 规则审计分表 · ba_zhai 八宅 / xuan_kong 玄空 / residential_fengshui 住宅风水 / vedic 吠陀

> T1·S2 批次2c ｜ 2026-09-13 ｜ 取证：Explore 代理深读 ｜ 未证实处标【待核】
> 根 = `E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统`，tests = `tests`
> 前置：廿四山表（每山 15°、isBoundary 显式、子山中心 0°）、后天八卦、土长生在寅派已在基础层/批次1 审结。

## ba_zhai 八宅
- **规则来源**：packages\core\src\ba_zhai\index.ts；大游年表在 packages\core\src\direction\index.ts:459-468；命卦公式 packages\core\src\bazi\mingGua.ts。文件头标《八宅明镜》《阳宅十书》(index.ts:5, mingGua.ts:4)。
- **关键规则**：① 东四/西四按命卦定：男=(11−年%9)、女=(4+年%9) 归一 1-9，五黄男寄坤二女寄艮八（mingGua.ts:53-59）；东四=坎离震巽（direction\index.ts:496-501）。② 大游年为静态查表（8 基准卦×8 宫 BA_ZHAI_TABLE，direction\index.ts:459-468），四吉=伏位生气延年天医（452），非翻卦算法实现。③ 宅卦由坐山查 MOUNTAIN_TO_BAGUA（direction\index.ts:410-435）；命宅同组=「相合」（ba_zhai\index.ts:345-351）。④ 立春换年：生日午时与当年 7/1 午时干支年比较，异则年−1（index.ts:264-273）；金标测试 2024-02-04 男→2023/巽、02-05→2024/震（tests\bazhai-package-api.test.ts:35-53）。⑤ 门向量测：doorToInteriorDegree+180=坐向（index.ts:134-144），候选=±(误差+7.5°)（199-211），稳定性三级：稳定/山向边界敏感/宅卦不稳定（212-214）。
- **输入契约**：birthYear(1-9999)+gender 或 mingGua；sitMountain；或 doorToInteriorDegree(0-360)+northReference(默认 unspecified)+magneticDeclinationDegrees(±30)+measurementUncertaintyDegrees(0-45)。
- **输出契约**：mingGua/mingGroup/houseGua/mingPalace、housePalace（各 8 宫）/match/lucky+unlucky（各 4）/evidenceAnalysis/evidenceTrail/prompt；门向版附 directionMeasurement。
- **边界处理**：磁北必附磁偏角否则拒（index.ts:187-189）；isBoundary 且零误差抛错（396-399）；度数越界不静默归一（test 269-281）。
- **疑点/待核**：①「大运年」未实现——ba_zhai 目录及八宅相关测试 findstr「大运」零命中【实证：无】；② 游年用表驱动，正确性依赖金标（8 命卦×24 山=192 盘回归，test 283-305）。

## xuan_kong 玄空
- **规则来源**：packages\core\src\xuan_kong\index.ts；引擎 packages\core\node_modules\@soul-atelier\xuankong\src\{chart,combinations}.ts（版本 0.2.1，core\package.json:313），其内部 @soul-atelier\core@0.4.0\src\period.ts、flying.ts。
- **关键规则**：① 三元九运：CYCLE_START=1864、20 年/运（index.ts:144,174-191 与引擎 period.ts:12-17 同口径），2024→下元九运 2024-2043（tests\xuankong-board.test.ts:12-26）。② **仅下卦无替卦**：engine.mode='下卦'（index.ts:423-426），测试显式断言无 guaType/replacementApplied/replacementReason 字段（xuankong-board.test.ts:59-61,74-78）。③ 山向盘顺逆：入中星按其洛书宫同元龙阴阳，五黄入中借原山阴阳（引擎 chart.ts:23-29；evidence.ts:92）。④ 运盘顺飞走洛书路径 5→6→7→8→9→1→2→3→4（index.ts:197-212），方向由调用方显式给定不猜测（test 28-39）。⑤ 局型四分：旺山旺向/上山下水/双星到向/双星到坐（chart.ts:31-48）；到山到向由 core 本地复算（index.ts:391-409）。⑥ 组合：父母三般卦/连珠/山向星合十/全盘与单宫伏吟反吟/入囚/七星真打劫(乾震离)、假打劫(坎巽兑)+山星5全盘伏吟封禁（combinations.ts:32-166）。
- **输入契约**：year(1-9999) 必填；sitMountain/facingMountain 或 sitDegree/facingDegree（须严格相对，index.ts:238-241,293-297）；measurementUncertaintyDegrees 0-45。
- **输出契约**：period{yuan,yun,startYear,endYear}/plates{yun,shan,xiang} 三盘 9 宫/palaces/formation/combinations/daoShanXiang/measurement/evidenceTrail/prompt。
- **边界处理**：isBoundary 或容差跨界→「山向边界敏感」并全量枚举候选山向（244-274；test 113-131 断言不得只采样 3 点）；9 运×24 山 216 盘回归（test 133-164）。
- **疑点/待核**：①【B类·重要】运界按公历年切，立春口径未生效——引擎 period.ts:8-10 自注「边界应为立春」，core 仅传整年 buildChart（index.ts:372）【跨运年 1-2 月误差】；② 「下卦中央九度边界规则」仅是证据文案（evidence.ts:86），无替卦切换逻辑——**替卦整体未实现**；③ 无城门诀实现（combinations.ts 零命中）【实证：无】。

## residential_fengshui 住宅风水
- **规则来源**：packages\core\src\residential_fengshui\index.ts——纯编排层，无独立算法（文件头 3-5 自述）。
- **关键规则**：① 复用 analyzeBaZhai(ByDoorDegree)+generateXuanKong（8-18）。② 门向量测优先，同步两盘山向（410-424；玄空用八宅换算坐向 208-218）。③ 无居住人也可仅门向起玄空宅运盘（212-218；test 84-94）。④ agreements 分层：一致关注/可互补/资料不足/口径不同需分述（268-296），不出总分（324-326）。⑤ 玄空推出坐山后回填八宅宅卦（415-424）。
- **输入契约**：year(建造/起运年)+出生三要素或 mingGua+任一山向字段；两者至少其一（403-408）。
- **输出契约**：bazhai/xuankong 子结果（各带 evidenceTrail）+agreements+advice+evidencePromptText+evidenceTrail。
- **边界处理**：仅有山向缺年→报错，不静默套当前年（406-408；test 20-44）；门向参数校验与八宅一致（test 114-139）。
- **疑点/待核**：无外部环境规则（缺角/冲煞/形峦全无命中），玄空头明示「不做形峦」（xuan_kong\index.ts:5）【实证：无——对外文案不得宣称含形峦/缺角分析】。

## vedic 吠陀
- **规则来源**：packages\core\src\vedic\{ayanamsa,ephemeris,tables,varga,vimshottari,index}.ts，头注 BPHS 口径。
- **关键规则**：① Lahiri/Chitra Paksha：J2000.0=23°51′11.539″+IAU 黄经岁差多项式（5028.796195″/cy 含高次项，非线性，ayanamsa.ts:13-39）；测试锚 2000≈23.853205、2026∈24.20-24.24（tests\vedic-astrology.test.ts:36-49）。② 整宫制：bhava=(行星 Rashi−Lagna Rashi)mod12+1（tables.ts:149-152；index.ts:137）。③ 星历 astronomy-engine 2.1.19（ephemeris.ts:10；package.json:314）；Rahu 默认 mean（Meeus 125.04452−1934.136261t，:62-67），nodeMode='true' 用几何公式，Ketu=Rahu+180°。④ D9 Navamsa：移动自本宫/固定+8/双元+4，每份 3°20′，108 盘连续无空洞（varga.ts:28-69；vedic-p2.test.ts:40-91）；D9 不重求 Lagna（varga.ts:10）。⑤ Vimshottari：7/20/6/10/7/18/16/**17**/19=120，Budha=17 标准值「经多源核对」（vimshottari.ts:15-25；vedic-p2.test.ts:7,95-99 即勘误点）；起运=出生−balance×年限（:109），Antardasha=大运×段主星/120（:123），365.25 日/年（:42）。
- **输入契约**：VedicBirthInput 全字符串字段 name/gender('男'|'女'|'不确定')/year~minute/lat/lon，timezone|timeZoneId 二选一（types.ts:13-38）；nodeMode 默认 'mean'（index.ts:180），chartStyle 默认 'north'（:322），ayanamsa 仅 'lahiri'。
- **输出契约**：ayanamsa/lagna/grahas×9（恒星黄经/rashi/nakshatra/pada/bhava/retrograde）/nakshatra.birthMoon{lord,balance}/vargas{D1,D9}/vimshottari（9 Mahadasha 各 9 Antardasha）/yogas:[]/doshas:[]/evidenceTrail。
- **边界处理**：年份 1900-2100（index.ts:161）；真太阳时仅作证据不进排盘（ephemeris.ts:8；index.ts:147）；日月罗计不逆行（:119-124）；balance∈[0,1) 否则抛错。
- **疑点/待核**：①【架构事实】不共用 celestine——西占 divination\algorithms\astrolabe.ts:5 import celestine，vedic 目录零命中；vedic 与七政四余共用 astronomy-engine（ephemeris.ts:14 注释），并与西占 Asc 交叉校验 <0.5°（vedic-astrology.test.ts:155-162）；② Vimshottari 仅展开出生起 120 年（:111），超界 locateVimshottariAt 返 null【待核展示层】；③ yogas/doshas 恒为空数组（index.ts:327-328）【占位字段，对外不得宣称已检测瑜伽/病煞】；④ 非 Swiss Ephemeris，角秒级差异已列为反证（vedicEvidence.ts:79）。

## 批次2c 结论
无 A 类 bug。三个**能力边界实锤**（对外文案/T2 转译必须遵守）：玄空无替卦/无城门诀、八宅无大运年、住宅风水无形峦缺角分析、vedic yogas/doshas 占位为空。一个**B 类待办**：玄空运界立春口径未生效（跨运年 1-2 月误差），建议列 S6 修复或文档声明。
