# 规则审计分表 · bazi 八字 / ziwei 紫微斗数

> T1·S2 批次2a ｜ 2026-09-13 ｜ 取证：Explore 代理深读 ｜ 未证实处标【待核】
> 根 = `E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统`，core = `packages\core\src`，DIV/T 见文内
> 前置：真太阳时/子时/立春/闰月/DST/时区边界已在基础层分表审结（forward/current 双口径、tyme4ts 节气驱动、DST 1986-91、钳制 1900-2100），本表不重复。

## bazi 八字

### 规则来源
- 排盘主干：tyme4ts EightChar（四柱/命宫身宫/胎元胎息），空亡用 `SixtyCycle.getExtraEarthBranches` 逐柱旬空（core\bazi\kongWang.ts L7-24；正式分析按日柱旬空 kongWangAnalysis.ts）。
- 旺衰：baziStrengthAnalyzer.ts L472-557 —— 三倾向多数表决（月令合看司令 / 地支通根 / 成局+明透结构），输出 极强/身强/偏强/中和/偏弱/身弱/极弱；score/commanderScore 标 @deprecated 不参与判定（L22-28），ruleBasis 明言「不换算小数总分」（L553）。
- 格局取用：取格 baziPatternStrategy.ts（月令本气→司权透干→透干优先，注释引《子平真诠》L177；建禄/月刃按 LU/REN_BRANCH_MAP 精确禄刃位，阴干无真刃归劫财格 L329-336；魁罡四日标 isKuiGang L377）；取用 baziUsefulGodStrategy.ts = 基础扶抑 4 条（baziUsefulGodRules.ts，身强泄耗克/身弱印比/专旺顺势/从格从势）→ 调候 CLIMATE_RULES 覆盖 → 司令重排 → 病药优先，全程 strategyTrace+matchedRules 证据链。
- 十神：本地 10×10 矩阵（baziUtils.ts L107-127），地支十神取藏干主气；测试锁 10×10 全矩阵。
- 藏干/长生/纳音：本地表 baziMappingsData.ts（BRANCH_HIDDEN_STEMS/TWELVE_STAGES_MAP/NAYIN_MAP），土长生在寅派；墓库 tombStorage.ts（storageStem 取藏干末位）。
- 神煞：baziShenSha\helpers\ 6 族（noble/lu/day/marriage/disaster/global），分类总表 199 个神煞名（baziShenShaData.ts）；bazi-shensha.test.ts 100+ 用例锁五行精纪/三命通会细节。
- 合化：harmonyTransform.ts —— 天干五合成化=日干参与+紧贴+规定月令（TRANSFORM_MONTHS principal/secondary L63-69）+化神不受克，判定优先级 逢冲破合>争合不专>成化>合而不化（L160-179）；**地支六合永不作成化**（isTransformed 恒 false，L419）。接入点 baziPromptEnhancement.ts L235-265。
- 经典外格：baziEnhancement\classicPatterns.ts 26 条（金神/六乙鼠贵/日贵/福德秀气/子午双包等）。

### 代码位置
baziCalculator.ts（主流程+晚子时柱替换 L346-364）、baziCalculatorTime.ts（流月流日/seasonInfo）、baziStrengthAnalyzer.ts、baziPatternStrategy.ts、baziUsefulGodStrategy.ts+Rules、harmonyTransform.ts、baziShenSha\、LuckCalculator.ts+childLimit.ts、monthCommand.ts、baziMappingsData.ts、baziPromptEnhancement.ts、baziEvidence.ts。

### 输入契约
BAZI_SCHOOLS=['traditional','ziping','mangpai','xinpai']（prompt\public-api.ts L82，traditional→ziping 归一 L314；school 仅注入提示词流派任务/依据 L176-216）；BAZI_PROMPT_TOPICS 24 个（L15-40）；BAZI_FORTUNE_SCOPES natal/full/dayun/year/month/day（L81）；另有时辰索引 0-12、真太阳时 birthHour/Minute/Longitude/timezone/timeZoneId、applyChinaDst、dayDivide、isLunar/isLeapMonth、shenShaVariants（baziTypes.ts L36）、mode framework/custom。

### 输出契约
BaziChartResult（baziTypes.ts L343+）：四柱 pillars、tenGods/hiddenStems/hiddenTenGods、wuxingStrength(missing/present/dominantByRule/ruleBasis)、luckInfo(起运/12 大运/流年/小运)、mingGong/shenGong/taiYuan/taiXi、lifeStages、nayin、ziZuo、kongWang、monthCommander、seasonInfo、analysis{dayMasterStrength,mingGe,usefulGod}、shensha+shenShaAnalysis、pillarRelations{fuxin,fanyin,xingChong}、mingGua、evidenceAnalysis、evidenceTrail。

### 边界处理
- 月令司令=MONTH_COMMANDER 固定天数分野（寅[戊7,丙7,甲16]、辰[乙9,癸3,戊18]、午[丙10,己9,丁11]，baziMappingsData.ts L87+），按出生距节 JD 差累进（baziCalculatorTime.ts L231-268）。
- 起运=childLimit.ts 固定「三日折一年」精确到时分（L7），12 步大运，交运重叠年归后一步（baziCalculator L665-668），流年干支取 6/1 避边界（LuckCalculator L198-209）。
- 从格细分只看明透+本气+成局类别纯一，混杂→从势格（baziPatternStrategy L211-245）。

### 判定与疑点
① capability 'bazi' 无 schools/methods 字段，schools 纯 prompt 层【待核是否需进 capability】；② deprecated 评分与倾向制并存（测试已锁不被缩放改变，属残留口径【B类】）；③ 199 神煞名总表与 6 族实现未逐一交叉核数【待核】；④ classicPatterns 的建禄表含乙卯等阴干禄位，与主取格器 LU_BRANCH_MAP 是否一致未比对【待核】；⑤ 流年神煞将流年干支替换年柱重算（baziCalculatorTime L401-407），年柱系神煞口径属变通【B类文档化】；⑥ 地支六合永不化=实现取舍，与部分流派「地支合化」相左【D类需裁决】。

## ziwei 紫微斗数

### 规则来源
- iztro 承担：安星、十二宫、四化、大限流年流月流日流时 horoscope（core\ziwei\iztro\runtime-helpers.ts L95-122 `astro.withOptions`，L204-218）。dynamic import，缺依赖抛 IZTRO_DEPENDENCY_REQUIRED（L98-110）。
- 自研：runtime.ts calculateZiweiChart 组装 ZiweiRuntime（astrolabe+horoscope+payloadByScope+decadalTimeline+trueSolarEvidence+evidenceTrail L101-134）；calculatePublicZiweiChartForScopes 强制保留 origin（L154-161）；payload 结构化（iztro\build-analysis-payload\）；证据池（build-evidence-pool.ts，带「不得解释为吉凶分数」限制常量）；格局检测自研 79 条登记+24 条「不可唯一复算」边界+84 条退役格（pattern-detection.ts L17-18）；合盘 compatibility-evidence.ts analyzeZiweiCompatibility（宫位叠盘+生年四化落点）；大限时间轴 decadal.ts 含童年段补齐。
- 门派：ZIWEI_SCHOOLS=['sanhe','feixing','sihua']（public-api L83），仅改解读侧重不改安星——runtime-helpers L81 limitation 明文；安星算法枚举 'default'|'zhongzhou'（中州派，L14）。
- 真太阳时：true-solar-input.ts 校正为公历日+时辰索引 0-12；启用后强制 dateType='solar' 并清 isLeapMonth（runtime.ts L277-285）。
- fixLeap 硬编码 true（runtime.ts L286），口径=闰月十五日前按同名月、十六日起按下月（runtime-helpers L64-66）。

### 代码位置
runtime.ts、true-solar-input.ts、iztro\runtime-helpers.ts、iztro\build-analysis-payload\、iztro\build-evidence-pool.ts、iztro\pattern-detection.ts、iztro\compatibility-evidence.ts、iztro\decadal.ts、ziweiEvidence.ts（四字段证据链六环节）、fortune-options.ts（年月日联动选项，农历年位移）、prompt\（builders/combined/focus/snapshot，飞星四化专题 focus.ts L24-31）。

### 输入契约
scopes 7 种 origin/decadal/yearly/monthly/daily/hourly/age；ZIWEI_PROMPT_TOPICS 24 个；ZIWEI_PROMPT_SCOPES 8 个（含 full）；algorithm、yearDivide/horoscopeDivide/ageDivide/dayDivide；时辰 timeIndex 0-12 或真太阳时精确时分+经度；运限需 horoscopeContext{dateStr,hourIndex}（合参必填，capabilities L370-414）。

### 输出契约
AnalysisPayloadV1（src\types\analysis.ts L5-16）：basic_info(soul/body/五行局/四柱/命身宫支)、active_scope(palace_index+mutagen_map 四化落宫)、palaces[12](major/minor/other/scope_stars、changsheng12/boshi12/jiangqian12/suiqian12、decadal_range、ages、scope_hits、empty_state、self_mutagens)、evidence_pool、pattern_analysis、calculation_config(leap/late_zi_rule 口径自述)。

### 边界处理
- 晚子时 dayDivide→iztro late_zi_rule：forward=按次日干支安星（默认）、current=归当日（runtime-helpers L76-79）——与八字 forward/current 口径对齐。
- iztro 全局配置串盘防护=每次 horoscope 前 astro.config 恢复（L215-217，ziwei-invariants.test 锁定）。
- 农历年位移 shiftLunarYear 防虚岁错轨、闰月回退同名月、三十日遇小月回退廿九（L254-279）；运限月份 normal=农历分界/exact=节气分界（L70-71）。

### 判定与疑点
① fixLeap 不可配置恒 true【待核是否有需求要关】；② capability 'ziwei' 无 schools 字段；③ 84 条退役格局只登记边界不执行（pattern-detection L18）【B类：对外文案不得宣称已检测退役格】；④ ageDivide 支持 'birthday' 但公开输入层未见暴露【待核】；⑤ 真太阳时结果直接覆盖 birthDate/birthTimeIndex，晚子时后续靠 iztro dayDivide，真太阳时恰落 23 点段的 forward/current 交互未单独断言【待核·S4 黄金样例应补】。
