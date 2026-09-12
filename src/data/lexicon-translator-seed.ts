// 词库转译种子（M1）：来源=国学资产线 lexicon 统一 Schema，318 条，license 全部 public_domain。
// 由 __资产基础设施__ 按体系/配置数据/lexicon_*.json 合并生成；更新时重跑合并脚本并 bump meta.dict_version。
// 消费方：src/lib/ai/compliance.ts buildTermHints（术语口径查表注入，零 LLM 生成）。

export interface LexiconTranslatorEntry {
  archetypeKey: string;
  system: string;
  category: 'term' | 'semantic' | 'translation';
  displayZh: string;
  classicalTerm?: string;
  professionalDef: string;
  evidenceQuote?: string;
  semanticLibrary?: string;
  translations?: { zh?: string; en?: string; es?: string; ar?: string; th?: string; pt?: string };
  positiveKeywords?: string[];
  cautionKeywords?: string[];
  negativeKeywords?: string[];
  licenseTier: 'public_domain' | 'internal_only' | 'unknown';
  version: string;
  termGroup?: string;
  l1_status?: 'verified' | 'draft' | 'pending_manual';
}

export const LEXICON_TRANSLATOR_SEED: { meta: { dict_version: string; source: string; generated: string; count: number; l1_status_note: string }; entries: LexiconTranslatorEntry[] } = {
 "meta": {
  "dict_version": "1.1.0",
  "source": "国学出海 __资产基础设施__ lexicon-schema v1（审计 A11 静态冻结 / P1 单键 / P5 L1-L4 静态化）",
  "generated": "2026-09-13",
  "count": 318,
  "l1_status_note": "verified=人工核验 | draft=AI依通行本起草待核验 | pending_manual=待补"
 },
 "entries": [
  {
   "archetypeKey": "bazi.changsheng.bing",
   "system": "bazi",
   "category": "term",
   "displayZh": "病",
   "classicalTerm": "病",
   "professionalDef": "十二长生第七位，喻气衰受病、多忧。",
   "evidenceQuote": "《三命通会》：病者，物有病也。",
   "semanticLibrary": "病主困顿与隐患：宜静养、查漏。",
   "translations": {
    "zh": "像生病；宜休养、查问题。",
    "en": "Sickness phase; rest and fix issues."
   },
   "positiveKeywords": [],
   "cautionKeywords": [
    "困顿",
    "隐患",
    "多忧"
   ],
   "negativeKeywords": [],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "changsheng",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.changsheng.changsheng",
   "system": "bazi",
   "category": "term",
   "displayZh": "长生",
   "classicalTerm": "长生",
   "professionalDef": "十二长生第一位，喻万物始生、朝气、萌发之机。",
   "evidenceQuote": "《三命通会》：长生者，犹人之初生也。",
   "semanticLibrary": "长生主生机与起点：得气方萌，宜开创、不宜骤进。",
   "translations": {
    "zh": "像刚出生的状态；有朝气、适合开端。",
    "en": "Birth phase; fresh vitality, good for beginnings."
   },
   "positiveKeywords": [
    "生机",
    "开端",
    "萌发"
   ],
   "cautionKeywords": [
    "稚嫩",
    "未稳"
   ],
   "negativeKeywords": [],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "changsheng",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.changsheng.diwang",
   "system": "bazi",
   "category": "term",
   "displayZh": "帝旺",
   "classicalTerm": "帝旺",
   "professionalDef": "十二长生第五位，喻极盛、当令、顶峰。",
   "evidenceQuote": "《三命通会》：帝旺者，言万物壮盛也。",
   "semanticLibrary": "帝旺主极盛与巅峰：气最旺、宜发力；过旺则易折。",
   "translations": {
    "zh": "最旺的状态；能成事，但过犹不及。",
    "en": "Peak phase; at full power, but excess breaks."
   },
   "positiveKeywords": [
    "极盛",
    "巅峰",
    "发力"
   ],
   "cautionKeywords": [
    "过旺",
    "易折"
   ],
   "negativeKeywords": [],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "changsheng",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.changsheng.guandai",
   "system": "bazi",
   "category": "term",
   "displayZh": "冠带",
   "classicalTerm": "冠带",
   "professionalDef": "十二长生第三位，喻渐有成仪、入世、责任渐起。",
   "evidenceQuote": "《三命通会》：冠带者，犹人既冠，有容仪也。",
   "semanticLibrary": "冠带主成长与担当：气渐充、宜进取、立事。",
   "translations": {
    "zh": "像行冠礼；渐渐成熟、可担事。",
    "en": "Coming-of-age phase; maturing, ready to take on roles."
   },
   "positiveKeywords": [
    "成长",
    "担当",
    "进取"
   ],
   "cautionKeywords": [
    "青涩"
   ],
   "negativeKeywords": [],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "changsheng",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.changsheng.jue",
   "system": "bazi",
   "category": "term",
   "displayZh": "绝",
   "classicalTerm": "绝",
   "professionalDef": "十二长生第十位，喻气尽、断绝、物极必反。注：术语，非绝境。",
   "evidenceQuote": "《三命通会》：绝者，物之尽也。",
   "semanticLibrary": "绝主断绝与反转：气已尽、亦含物极必反之机。",
   "translations": {
    "zh": "气尽的状态；也是转折之机，不是绝路。",
    "en": "Cessation phase; end and turning point."
   },
   "positiveKeywords": [
    "转折",
    "反转"
   ],
   "cautionKeywords": [
    "断绝"
   ],
   "negativeKeywords": [],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "changsheng",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.changsheng.linguan",
   "system": "bazi",
   "category": "term",
   "displayZh": "临官",
   "classicalTerm": "临官",
   "professionalDef": "十二长生第四位，喻出仕、有禄、自立可行。",
   "evidenceQuote": "《三命通会》：临官者，犹人出仕，官临其身也。",
   "semanticLibrary": "临官主自立与禄位：气已盛、宜任事、得权。",
   "translations": {
    "zh": "像去做官；能自立、有职位。",
    "en": "Taking office phase; self-reliant, in position."
   },
   "positiveKeywords": [
    "自立",
    "禄位",
    "任事"
   ],
   "cautionKeywords": [],
   "negativeKeywords": [],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "changsheng",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.changsheng.mu",
   "system": "bazi",
   "category": "term",
   "displayZh": "墓",
   "classicalTerm": "墓（库）",
   "professionalDef": "十二长生第九位，喻收藏、入库、蓄积。注：术语，非凶。",
   "evidenceQuote": "《三命通会》：墓者，库也，物藏于中。",
   "semanticLibrary": "墓主收藏与蓄积：宜收纳、沉淀，亦为四库之位。",
   "translations": {
    "zh": "收藏入库；宜积累沉淀，不是坏字。",
    "en": "Tomb/treasury phase; store and accumulate."
   },
   "positiveKeywords": [
    "收藏",
    "蓄积",
    "沉淀"
   ],
   "cautionKeywords": [],
   "negativeKeywords": [],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "changsheng",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.changsheng.muyu",
   "system": "bazi",
   "category": "term",
   "displayZh": "沐浴",
   "classicalTerm": "沐浴",
   "professionalDef": "十二长生第二位，喻形体初成、易受感、桃花之位。",
   "evidenceQuote": "《三命通会》：沐浴者，犹人既生，沐浴而去垢也。",
   "semanticLibrary": "沐浴主魅力与动摇：正面主亲和、人缘；负面主桃花、不稳。",
   "translations": {
    "zh": "像洗去污垢；有人缘桃花，但也易动摇。",
    "en": "Cleansing phase; charm and attraction, also instability."
   },
   "positiveKeywords": [
    "人缘",
    "亲和",
    "桃花"
   ],
   "cautionKeywords": [
    "动摇",
    "桃花",
    "不稳"
   ],
   "negativeKeywords": [],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "changsheng",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.changsheng.shuai",
   "system": "bazi",
   "category": "term",
   "displayZh": "衰",
   "classicalTerm": "衰",
   "professionalDef": "十二长生第六位，喻气渐退、力渐减。",
   "evidenceQuote": "《三命通会》：衰者，物既盛而衰也。",
   "semanticLibrary": "衰主退势与守成：气转弱、宜守不宜攻。",
   "translations": {
    "zh": "开始走下坡；适合守成，不宜冒进。",
    "en": "Declining phase; hold, don't push."
   },
   "positiveKeywords": [
    "守成"
   ],
   "cautionKeywords": [
    "退势",
    "力减"
   ],
   "negativeKeywords": [],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "changsheng",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.changsheng.si",
   "system": "bazi",
   "category": "term",
   "displayZh": "死",
   "classicalTerm": "死",
   "professionalDef": "十二长生第八位，喻气绝、沉滞。注：此为术语，非凶兆。",
   "evidenceQuote": "《三命通会》：死者，物之究也。",
   "semanticLibrary": "死主终结与沉滞：气已绝、宜蛰伏转化，不可与凶煞混同。",
   "translations": {
    "zh": "气绝的状态；是术语不是坏兆，宜蛰伏。",
    "en": "Extinction phase; a term, not an omen—lie low and transform."
   },
   "positiveKeywords": [
    "终结",
    "转化"
   ],
   "cautionKeywords": [
    "沉滞",
    "蛰伏"
   ],
   "negativeKeywords": [],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "changsheng",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.changsheng.tai",
   "system": "bazi",
   "category": "term",
   "displayZh": "胎",
   "classicalTerm": "胎",
   "professionalDef": "十二长生第十一位，喻受气、酝酿、新生之始。",
   "evidenceQuote": "《三命通会》：胎者，受气也。",
   "semanticLibrary": "胎主潜伏与酝酿：新机初萌、宜蓄势。",
   "translations": {
    "zh": "像受孕；新机会萌芽，宜蓄势。",
    "en": "Conception phase; new potential gestating."
   },
   "positiveKeywords": [
    "酝酿",
    "新生",
    "蓄势"
   ],
   "cautionKeywords": [
    "潜伏"
   ],
   "negativeKeywords": [],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "changsheng",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.changsheng.yang",
   "system": "bazi",
   "category": "term",
   "displayZh": "养",
   "classicalTerm": "养",
   "professionalDef": "十二长生第十二位，喻成形、滋养、待发。",
   "evidenceQuote": "《三命通会》：养者，犹人养胎于母腹也。",
   "semanticLibrary": "养主滋养与待发：气渐复、宜培植。",
   "translations": {
    "zh": "像在母腹滋养；慢慢培植待发。",
    "en": "Nourishment phase; nurture before emergence."
   },
   "positiveKeywords": [
    "滋养",
    "培植",
    "待发"
   ],
   "cautionKeywords": [],
   "negativeKeywords": [],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "changsheng",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.dizhi.chen",
   "system": "bazi",
   "category": "term",
   "termGroup": "dizhi",
   "displayZh": "辰",
   "classicalTerm": "辰",
   "attributes": {
    "cangGan": [
     "戊",
     "乙",
     "癸"
    ],
    "wuxingYueling": "阳土·季春三月"
   },
   "professionalDef": "配龙。藏戊土为主、乙木癸水为余，为水库。四墓库之一。与酉合，与戌冲。辰为天罗。",
   "evidenceQuote": "《三命通会》：「辰者，震也，物经震动而长。」",
   "semanticLibrary": "配龙。藏戊土为主、乙木癸水为余，为水库。四墓库之一。与酉合，与戌冲。辰为天罗。",
   "translations": {
    "zh": "春末的湿土：想法多、层次多，能同时装下理想和现实。"
   },
   "positiveKeywords": [
    "格局大",
    "善统筹",
    "有想象力"
   ],
   "cautionKeywords": [
    "想得多做得慢",
    "内在矛盾"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "生肖优劣论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.dizhi.chou",
   "system": "bazi",
   "category": "term",
   "termGroup": "dizhi",
   "displayZh": "丑",
   "classicalTerm": "丑",
   "attributes": {
    "cangGan": [
     "己",
     "癸",
     "辛"
    ],
    "wuxingYueling": "阴土·季冬十二月"
   },
   "professionalDef": "配牛。藏己土为主、癸水辛金为余，为金库、湿土。四墓库之一，主收藏。与子合，与未冲。",
   "evidenceQuote": "《三命通会》：「丑者，纽也，寒气自屈曲也。」",
   "semanticLibrary": "配牛。藏己土为主、癸水辛金为余，为金库、湿土。四墓库之一，主收藏。与子合，与未冲。",
   "translations": {
    "zh": "冬末的冻土：耐磨、能忍、愿意长期投入，慢热但一旦上手很扎实。"
   },
   "positiveKeywords": [
    "坚忍",
    "能积累",
    "踏实"
   ],
   "cautionKeywords": [
    "固执",
    "转弯慢",
    "压抑情绪"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "生肖优劣论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.dizhi.hai",
   "system": "bazi",
   "category": "term",
   "termGroup": "dizhi",
   "displayZh": "亥",
   "classicalTerm": "亥",
   "attributes": {
    "cangGan": [
     "壬",
     "甲"
    ],
    "wuxingYueling": "阴水·孟冬十月"
   },
   "professionalDef": "配猪。藏壬水为主、甲木为余，为木之长生。四生之一。与寅合，与巳冲。",
   "evidenceQuote": "《三命通会》：「亥者，核也，万物收藏，皆坚核也。」",
   "semanticLibrary": "配猪。藏壬水为主、甲木为余，为木之长生。四生之一。与寅合，与巳冲。",
   "translations": {
    "zh": "初冬的静水：厚道、想得远、心里装得下事。"
   },
   "positiveKeywords": [
    "宽厚",
    "有远见",
    "包容"
   ],
   "cautionKeywords": [
    "太随和",
    "界限模糊"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "生肖优劣论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.dizhi.mao",
   "system": "bazi",
   "category": "term",
   "termGroup": "dizhi",
   "displayZh": "卯",
   "classicalTerm": "卯",
   "attributes": {
    "cangGan": [
     "乙"
    ],
    "wuxingYueling": "阴木·仲春二月"
   },
   "professionalDef": "配兔。纯乙木藏之，为木之旺地。四正之一。与戌合，与酉冲。",
   "evidenceQuote": "《三命通会》：「卯者，茂也，日照东方，万物滋茂。」",
   "semanticLibrary": "配兔。纯乙木藏之，为木之旺地。四正之一。与戌合，与酉冲。",
   "translations": {
    "zh": "仲春最盛的草木：讲究美感与人情，善于经营关系。"
   },
   "positiveKeywords": [
    "亲和",
    "审美好",
    "人缘佳"
   ],
   "cautionKeywords": [
    "优柔",
    "难拒绝人"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "生肖优劣论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.dizhi.shen",
   "system": "bazi",
   "category": "term",
   "termGroup": "dizhi",
   "displayZh": "申",
   "classicalTerm": "申",
   "attributes": {
    "cangGan": [
     "庚",
     "壬",
     "戊"
    ],
    "wuxingYueling": "阳金·孟秋七月"
   },
   "professionalDef": "配猴。藏庚金为主、壬水戊土为余，为水之长生。四生之一。与巳合，与寅冲。",
   "evidenceQuote": "《三命通会》：「申者，身也，物体皆成就也。」",
   "semanticLibrary": "配猴。藏庚金为主、壬水戊土为余，为水之长生。四生之一。与巳合，与寅冲。",
   "translations": {
    "zh": "初秋的金气：灵活、多才、善变通，学什么都上手快。"
   },
   "positiveKeywords": [
    "机灵",
    "多才",
    "善变通"
   ],
   "cautionKeywords": [
    "不专一",
    "三分钟热度"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "生肖优劣论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.dizhi.si",
   "system": "bazi",
   "category": "term",
   "termGroup": "dizhi",
   "displayZh": "si_snake",
   "classicalTerm": "si_snake",
   "attributes": {
    "cangGan": [
     "丙",
     "庚",
     "戊"
    ],
    "wuxingYueling": "阳火·孟夏四月"
   },
   "professionalDef": "配蛇。藏丙火为主、庚金戊土为余，为金之长生。四生之一。与申合，与亥冲。",
   "evidenceQuote": "《三命通会》：「巳者，起也，物毕尽而起。」",
   "semanticLibrary": "配蛇。藏丙火为主、庚金戊土为余，为金之长生。四生之一。与申合，与亥冲。",
   "translations": {
    "zh": "初夏的旺火：聪明、反应快、会看局势，擅长把机会变成结果。"
   },
   "positiveKeywords": [
    "聪慧",
    "洞察力强",
    "善抓时机"
   ],
   "cautionKeywords": [
    "心思重",
    "不轻易交底"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "生肖优劣论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.dizhi.wei",
   "system": "bazi",
   "category": "term",
   "termGroup": "dizhi",
   "displayZh": "未",
   "classicalTerm": "未",
   "attributes": {
    "cangGan": [
     "己",
     "丁",
     "乙"
    ],
    "wuxingYueling": "阴土·季夏六月"
   },
   "professionalDef": "配羊。藏己土为主、丁火乙木为余，为木库。四墓库之一。与午合，与丑冲。",
   "evidenceQuote": "《三命通会》：「未者，味也，日中则昃，阳向幽也。」",
   "semanticLibrary": "配羊。藏己土为主、丁火乙木为余，为木库。四墓库之一。与午合，与丑冲。",
   "translations": {
    "zh": "盛夏的燥土：重情义、念旧、愿意为人情让步。"
   },
   "positiveKeywords": [
    "重情",
    "有艺术感",
    "肯付出"
   ],
   "cautionKeywords": [
    "顾虑多",
    "放不下过去"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "生肖优劣论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.dizhi.wu",
   "system": "bazi",
   "category": "term",
   "termGroup": "dizhi",
   "displayZh": "午",
   "classicalTerm": "午",
   "attributes": {
    "cangGan": [
     "丁",
     "己"
    ],
    "wuxingYueling": "阴火·仲夏五月"
   },
   "professionalDef": "配马。藏丁火为主、己土为余，为火之旺地。四正之一。与未合，与子冲。",
   "evidenceQuote": "《三命通会》：「午者，仵也，阴气从下上，与阳相仵逆。」",
   "semanticLibrary": "配马。藏丁火为主、己土为余，为火之旺地。四正之一。与未合，与子冲。",
   "translations": {
    "zh": "正午最烈的阳光：热情、外向、行动力强，是场子里的发动机。"
   },
   "positiveKeywords": [
    "热忱",
    "主动",
    "有活力"
   ],
   "cautionKeywords": [
    "性急",
    "忽冷忽热"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "生肖优劣论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.dizhi.xu",
   "system": "bazi",
   "category": "term",
   "termGroup": "dizhi",
   "displayZh": "戌",
   "classicalTerm": "戌",
   "attributes": {
    "cangGan": [
     "戊",
     "辛",
     "丁"
    ],
    "wuxingYueling": "阳土·季秋九月"
   },
   "professionalDef": "配狗。藏戊土为主、辛金丁火为余，为火库。四墓库之一。与卯合，与辰冲。戌为地网。",
   "evidenceQuote": "《三命通会》：「戌者，灭也，万物皆衰灭也。」",
   "semanticLibrary": "配狗。藏戊土为主、辛金丁火为余，为火库。四墓库之一。与卯合，与辰冲。戌为地网。",
   "translations": {
    "zh": "深秋的燥土：忠诚、守规矩、有原则，是可托付底线的人。"
   },
   "positiveKeywords": [
    "忠诚",
    "守信",
    "有原则"
   ],
   "cautionKeywords": [
    "较真",
    "难妥协"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "生肖优劣论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.dizhi.yin",
   "system": "bazi",
   "category": "term",
   "termGroup": "dizhi",
   "displayZh": "寅",
   "classicalTerm": "寅",
   "attributes": {
    "cangGan": [
     "甲",
     "丙",
     "戊"
    ],
    "wuxingYueling": "阳木·孟春正月"
   },
   "professionalDef": "配虎。藏甲木为主、丙火戊土为余，为火之长生。寅申巳亥为四生，主启动。与亥合，与申冲。",
   "evidenceQuote": "《三命通会》：「寅者，演也，津也，寒土将去，暖气始生。」",
   "semanticLibrary": "配虎。藏甲木为主、丙火戊土为余，为火之长生。寅申巳亥为四生，主启动。与亥合，与申冲。",
   "translations": {
    "zh": "初春破土的那一下：有闯劲、爱开新局，适合从零到一。"
   },
   "positiveKeywords": [
    "开创",
    "行动派",
    "阳光"
   ],
   "cautionKeywords": [
    "急于求成",
    "耐性不足"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "生肖优劣论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.dizhi.you",
   "system": "bazi",
   "category": "term",
   "termGroup": "dizhi",
   "displayZh": "酉",
   "classicalTerm": "酉",
   "attributes": {
    "cangGan": [
     "辛"
    ],
    "wuxingYueling": "阴金·仲秋八月"
   },
   "professionalDef": "配鸡。纯辛金藏之，为金之旺地。四正之一。与辰合，与卯冲。",
   "evidenceQuote": "《三命通会》：「酉者，緧也，万物皆緧缩收敛也。」",
   "semanticLibrary": "配鸡。纯辛金藏之，为金之旺地。四正之一。与辰合，与卯冲。",
   "translations": {
    "zh": "仲秋收割的锋刃：条理清楚、标准高，把事情做到精确。"
   },
   "positiveKeywords": [
    "精准",
    "有条理",
    "专业感强"
   ],
   "cautionKeywords": [
    "挑剔",
    "苛求",
    "不易放松"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "生肖优劣论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.dizhi.zi",
   "system": "bazi",
   "category": "term",
   "termGroup": "dizhi",
   "displayZh": "子",
   "classicalTerm": "子",
   "attributes": {
    "cangGan": [
     "癸"
    ],
    "wuxingYueling": "阳水·仲冬十一月"
   },
   "professionalDef": "十二支之首，配鼠。纯癸水藏之，为水之旺地。子午卯酉为四正，主专一。子与丑合化土，与午冲。",
   "evidenceQuote": "《三命通会·论支干源流》：「子者，孳也，阳气始萌，孳生于下也。」",
   "semanticLibrary": "十二支之首，配鼠。纯癸水藏之，为水之旺地。子午卯酉为四正，主专一。子与丑合化土，与午冲。",
   "translations": {
    "zh": "深夜与深冬的能量：安静、机敏、会储存资源，在别人休息时悄悄准备。"
   },
   "positiveKeywords": [
    "机敏",
    "善谋划",
    "有储备意识"
   ],
   "cautionKeywords": [
    "夜型作息",
    "心思难被看透"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "生肖优劣论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.guasu",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "寡宿",
   "classicalTerm": "寡宿",
   "attributes": {
    "qiFa": "亥子丑年见戌，寅卯辰年见丑，巳午未年见辰，申酉戌年见未。"
   },
   "professionalDef": "孤神。与孤辰相对，女重寡宿。主自守、少倚仗。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：亥子丑年见戌，寅卯辰年见丑，巳午未年见辰，申酉戌年见未。",
   "semanticLibrary": "孤神。与孤辰相对，女重寡宿。主自守、少倚仗。",
   "translations": {
    "zh": "与孤辰同类：自我空间需求大。把它当作「需要独处充电」来管理，而不是关系的判词。"
   },
   "positiveKeywords": [
    "自足",
    "有定力",
    "能独处"
   ],
   "cautionKeywords": [
    "亲密关系需主动经营"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.guchen",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "孤辰",
   "classicalTerm": "孤辰",
   "attributes": {
    "qiFa": "亥子丑年见寅，寅卯辰年见巳，巳午未年见申，申酉戌年见亥。"
   },
   "professionalDef": "孤神。主独立自处、亲缘缘浅。以年支起，男重孤辰。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：亥子丑年见寅，寅卯辰年见巳，巳午未年见申，申酉戌年见亥。",
   "semanticLibrary": "孤神。主独立自处、亲缘缘浅。以年支起，男重孤辰。",
   "translations": {
    "zh": "偏独立的一格：习惯自己扛，需要刻意练习求助与共处，而非天生注定孤单。"
   },
   "positiveKeywords": [
    "独立",
    "自省力强",
    "专注"
   ],
   "cautionKeywords": [
    "社交主动性不足",
    "需练习表达需求"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.hongluan",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "红鸾",
   "classicalTerm": "红鸾",
   "attributes": {
    "qiFa": "子年见卯，逆行十二支。"
   },
   "professionalDef": "喜神。主婚喜、缔结、新缘。以年支起。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：子年见卯，逆行十二支。",
   "semanticLibrary": "喜神。主婚喜、缔结、新缘。以年支起。",
   "translations": {
    "zh": "关系推进的信号：适合谈感情、办喜事、建立新的合作关系。"
   },
   "positiveKeywords": [
    "利姻缘",
    "喜事",
    "关系升温"
   ],
   "cautionKeywords": [
    "勿冲动决定终身事"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.huagai",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "华盖",
   "classicalTerm": "华盖",
   "attributes": {
    "qiFa": "寅午戌见戌，申子辰见辰，巳酉丑见丑，亥卯未见未。"
   },
   "professionalDef": "半吉神。主艺术、宗教、玄学、孤高。三合局墓库位。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：寅午戌见戌，申子辰见辰，巳酉丑见丑，亥卯未见未。",
   "semanticLibrary": "半吉神。主艺术、宗教、玄学、孤高。三合局墓库位。",
   "translations": {
    "zh": "偏精神与审美的一格：对哲学、艺术、灵性话题天生有感应，也更享受独处。"
   },
   "positiveKeywords": [
    "有艺术感",
    "悟性高",
    "专注",
    "独立"
   ],
   "cautionKeywords": [
    "偏内向",
    "社交耗能",
    "易被误解清高"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.jiangxing",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "将星",
   "classicalTerm": "将星",
   "attributes": {
    "qiFa": "寅午戌见午，申子辰见子，巳酉丑见酉，亥卯未见卯。"
   },
   "professionalDef": "吉神。主统御、掌权、居中调度。以年支或日支三合局中神取。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：寅午戌见午，申子辰见子，巳酉丑见酉，亥卯未见卯。",
   "semanticLibrary": "吉神。主统御、掌权、居中调度。以年支或日支三合局中神取。",
   "translations": {
    "zh": "天然的组织者位置：容易被推到牵头、协调、带队的角色上。"
   },
   "positiveKeywords": [
    "领导力",
    "有威信",
    "善统筹"
   ],
   "cautionKeywords": [
    "压力集中",
    "不易授权"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.jiesha",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "劫煞",
   "classicalTerm": "劫煞",
   "attributes": {
    "qiFa": "寅午戌见亥，申子辰见巳，巳酉丑见寅，亥卯未见申。"
   },
   "professionalDef": "凶神。主意外破耗、被夺。三合局绝位。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：寅午戌见亥，申子辰见巳，巳酉丑见寅，亥卯未见申。",
   "semanticLibrary": "凶神。主意外破耗、被夺。三合局绝位。",
   "translations": {
    "zh": "提示要看紧钱和边界：合同、财务、授权这些地方多设一道复核。"
   },
   "positiveKeywords": [
    "风控意识",
    "善守边界"
   ],
   "cautionKeywords": [
    "财务需复核",
    "慎做担保",
    "防信息外泄"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.jinshen",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "金神",
   "classicalTerm": "金神",
   "attributes": {
    "qiFa": "癸酉、己巳、乙丑三组。"
   },
   "professionalDef": "刚神。主刚锐果决，喜火制。时柱多取。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：癸酉、己巳、乙丑三组。",
   "semanticLibrary": "刚神。主刚锐果决，喜火制。时柱多取。",
   "translations": {
    "zh": "锐利而不肯将就的性格：需要有能约束你的规则或对手，才能发挥最好。"
   },
   "positiveKeywords": [
    "锐利",
    "不妥协",
    "专业硬"
   ],
   "cautionKeywords": [
    "易冲突",
    "需外部约束"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.jinyu",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "金舆",
   "classicalTerm": "金舆",
   "attributes": {
    "qiFa": "甲龙乙蛇丙戊羊，丁己见猴庚犬方，辛猪壬牛癸逢虎。"
   },
   "professionalDef": "吉神。主富贵安享、得配偶之助。以日干起。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：甲龙乙蛇丙戊羊，丁己见猴庚犬方，辛猪壬牛癸逢虎。",
   "semanticLibrary": "吉神。主富贵安享、得配偶之助。以日干起。",
   "translations": {
    "zh": "生活质感与配偶助力的标记：容易得到家庭层面的支持。"
   },
   "positiveKeywords": [
    "生活优渥",
    "配偶助力",
    "有依靠"
   ],
   "cautionKeywords": [
    "易依赖",
    "进取心需自持"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.kongwang",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "空亡",
   "classicalTerm": "空亡",
   "attributes": {
    "qiFa": "甲子旬中戌亥空，甲戌旬中申酉空，依旬推。"
   },
   "professionalDef": "虚神。主落空、转虚、心思向内。六十甲子旬中缺二支。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：甲子旬中戌亥空，甲戌旬中申酉空，依旬推。",
   "semanticLibrary": "虚神。主落空、转虚、心思向内。六十甲子旬中缺二支。",
   "translations": {
    "zh": "这一块容易「用力却抓不实」：与其硬求，不如把它转到精神、学术、宗教这类务虚方向。"
   },
   "positiveKeywords": [
    "适合务虚领域",
    "放下执着",
    "精神追求"
   ],
   "cautionKeywords": [
    "实务落空",
    "期待需下调",
    "换赛道更顺"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.kuigang",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "魁罡",
   "classicalTerm": "魁罡",
   "attributes": {
    "qiFa": "庚辰、庚戌、壬辰、戊戌四日。"
   },
   "professionalDef": "刚神。主性烈聪敏、好胜掌权、不受制。日柱专取。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：庚辰、庚戌、壬辰、戊戌四日。",
   "semanticLibrary": "刚神。主性烈聪敏、好胜掌权、不受制。日柱专取。",
   "translations": {
    "zh": "个性鲜明的一格：主见强、不服软、想自己说了算，适合独当一面。"
   },
   "positiveKeywords": [
    "果断",
    "有主见",
    "不畏权",
    "效率高"
   ],
   "cautionKeywords": [
    "强势",
    "难合作",
    "少柔软"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.liuxia",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "流霞",
   "classicalTerm": "流霞",
   "attributes": {
    "qiFa": "甲鸡乙犬丙羊加，丁猴戊猪己虎嗟，庚马辛蛇壬见兔，癸人见龙世人夸。"
   },
   "professionalDef": "杂神。古主酒色损伤，今取「过度即损」之戒。以日干起。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：甲鸡乙犬丙羊加，丁猴戊猪己虎嗟，庚马辛蛇壬见兔，癸人见龙世人夸。",
   "semanticLibrary": "杂神。古主酒色损伤，今取「过度即损」之戒。以日干起。",
   "translations": {
    "zh": "一条节制提醒：应酬、饮酒、熬夜这类事上给自己设上限即可。"
   },
   "positiveKeywords": [
    "自律受益"
   ],
   "cautionKeywords": [
    "注意作息节制",
    "应酬有度"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.lushen",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "禄神",
   "classicalTerm": "禄神",
   "attributes": {
    "qiFa": "甲禄在寅，乙禄在卯，丙戊禄在巳，丁己禄在午，庚禄在申，辛禄在酉，壬禄在亥，癸禄在子。"
   },
   "professionalDef": "吉神。主衣食、俸禄、自立根基。日干临官位。",
   "evidenceQuote": "《渊海子平·神煞总论》载其起例：甲禄在寅，乙禄在卯，丙戊禄在巳，丁己禄在午，庚禄在申，辛禄在酉，壬禄在亥，癸禄在子。",
   "semanticLibrary": "吉神。主衣食、俸禄、自立根基。日干临官位。",
   "translations": {
    "zh": "自食其力的底盘：靠本事吃饭这条路走得比较稳。"
   },
   "positiveKeywords": [
    "自立",
    "衣食无忧",
    "有专业立身"
   ],
   "cautionKeywords": [
    "守成有余开创不足"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.taohua",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "桃花",
   "classicalTerm": "桃花",
   "attributes": {
    "qiFa": "寅午戌见卯，申子辰见酉，巳酉丑见午，亥卯未见子。"
   },
   "professionalDef": "又名咸池。主人缘、魅力、艺文才情。三合局沐浴位。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：寅午戌见卯，申子辰见酉，巳酉丑见午，亥卯未见子。",
   "semanticLibrary": "又名咸池。主人缘、魅力、艺文才情。三合局沐浴位。",
   "translations": {
    "zh": "亲和力与吸引力的标记：容易被人喜欢，适合做需要露脸和打交道的事。"
   },
   "positiveKeywords": [
    "有魅力",
    "人缘好",
    "艺术天分",
    "镜头感"
   ],
   "cautionKeywords": [
    "情感线复杂",
    "需守边界"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.tiande_guiren",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "天德贵人",
   "classicalTerm": "天德贵人",
   "attributes": {
    "qiFa": "正丁二申宫，三壬四辛同，五亥六甲上，七癸八寅逢……"
   },
   "professionalDef": "德神。主慈祥福厚，化解刑冲。以月支起，见天干地支为是。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：正丁二申宫，三壬四辛同，五亥六甲上，七癸八寅逢……",
   "semanticLibrary": "德神。主慈祥福厚，化解刑冲。以月支起，见天干地支为是。",
   "translations": {
    "zh": "一种「厚道有回报」的运势底色：与人为善时更容易得到善意回馈。"
   },
   "positiveKeywords": [
    "福德深厚",
    "化解冲突",
    "口碑好"
   ],
   "cautionKeywords": [
    "需以德行兑现"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.tianxi",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "天喜",
   "classicalTerm": "天喜",
   "attributes": {
    "qiFa": "红鸾对宫。子年见酉，逆行。"
   },
   "professionalDef": "喜神。主喜庆、添丁、意外之喜。红鸾对宫。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：红鸾对宫。子年见酉，逆行。",
   "semanticLibrary": "喜神。主喜庆、添丁、意外之喜。红鸾对宫。",
   "translations": {
    "zh": "偏「好消息」的一格：容易碰上添人进口、意外之喜这类事。"
   },
   "positiveKeywords": [
    "喜庆",
    "好消息",
    "家庭添彩"
   ],
   "cautionKeywords": [
    "喜中易疏忽细节"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.tianyi_guiren",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "天乙贵人",
   "classicalTerm": "天乙贵人",
   "attributes": {
    "qiFa": "甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸兔蛇藏，庚辛逢马虎。"
   },
   "professionalDef": "吉神之首。主逢凶化吉、得人提携。以日干或年干起，见地支为是。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸兔蛇藏，庚辛逢马虎。",
   "semanticLibrary": "吉神之首。主逢凶化吉、得人提携。以日干或年干起，见地支为是。",
   "translations": {
    "zh": "最典型的「贵人运」标记：关键时刻容易遇到愿意拉你一把的人。要主动经营关系才用得上。"
   },
   "positiveKeywords": [
    "贵人相助",
    "逢凶化吉",
    "人缘通达"
   ],
   "cautionKeywords": [
    "不可坐等",
    "需主动求助才生效"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.wangshen",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "亡神",
   "classicalTerm": "亡神",
   "attributes": {
    "qiFa": "寅午戌见巳，申子辰见亥，巳酉丑见申，亥卯未见寅。"
   },
   "professionalDef": "凶神。主耗神、内忧、失据。三合局临官之冲。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：寅午戌见巳，申子辰见亥，巳酉丑见申，亥卯未见寅。",
   "semanticLibrary": "凶神。主耗神、内忧、失据。三合局临官之冲。",
   "translations": {
    "zh": "容易内耗的信号：情绪与精力管理是这一格的主课题。"
   },
   "positiveKeywords": [
    "自我觉察",
    "善于内省"
   ],
   "cautionKeywords": [
    "注意休息节奏",
    "减少过度思虑"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.wenchang",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "文昌贵人",
   "classicalTerm": "文昌贵人",
   "attributes": {
    "qiFa": "甲巳乙午报君知，丙戊申宫丁己鸡，庚猪辛鼠壬逢虎，癸人见卯入云梯。"
   },
   "professionalDef": "吉神。主聪明好学、利考试文书。以日干起见地支。",
   "evidenceQuote": "《渊海子平·神煞总论》载其起例：甲巳乙午报君知，丙戊申宫丁己鸡，庚猪辛鼠壬逢虎，癸人见卯入云梯。",
   "semanticLibrary": "吉神。主聪明好学、利考试文书。以日干起见地支。",
   "translations": {
    "zh": "读书、考试、写作、表达上的加成：学东西快，笔头和口头都容易出彩。"
   },
   "positiveKeywords": [
    "聪慧",
    "利学业",
    "善表达",
    "文书顺"
   ],
   "cautionKeywords": [
    "需持续投入才兑现"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.xuetang_yima",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "天罗地网",
   "classicalTerm": "天罗地网",
   "attributes": {
    "qiFa": "辰为天罗，戌为地网。辰见巳、戌见亥为重。"
   },
   "professionalDef": "困神。主束缚、进退受限。辰戌相配取。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：辰为天罗，戌为地网。辰见巳、戌见亥为重。",
   "semanticLibrary": "困神。主束缚、进退受限。辰戌相配取。",
   "translations": {
    "zh": "阶段性受限的格局：适合用这段时间打基础、修内功，而不是硬闯。"
   },
   "positiveKeywords": [
    "蓄力期",
    "适合深造",
    "打基础"
   ],
   "cautionKeywords": [
    "扩张宜缓",
    "按流程走"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.xueyan",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "学堂",
   "classicalTerm": "学堂",
   "attributes": {
    "qiFa": "金命见巳，木命见亥，水命见申，火命见寅，土命见申。"
   },
   "professionalDef": "吉神。主学有所成、师承有源。以纳音五行长生位取。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：金命见巳，木命见亥，水命见申，火命见寅，土命见申。",
   "semanticLibrary": "吉神。主学有所成、师承有源。以纳音五行长生位取。",
   "translations": {
    "zh": "有「读书种子」的倾向：适合走需要系统学习和资历积累的路。"
   },
   "positiveKeywords": [
    "好学",
    "有师缘",
    "专业深耕"
   ],
   "cautionKeywords": [
    "理论强于实操"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.yangren",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "羊刃",
   "classicalTerm": "羊刃",
   "attributes": {
    "qiFa": "甲见卯，乙见寅，丙戊见午，丁己见巳，庚见酉，辛见申，壬见子，癸见亥。"
   },
   "professionalDef": "刚神。主刚烈、决断、锋芒。日干帝旺之次位，古谓刚极。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：甲见卯，乙见寅，丙戊见午，丁己见巳，庚见酉，辛见申，壬见子，癸见亥。",
   "semanticLibrary": "刚神。主刚烈、决断、锋芒。日干帝旺之次位，古谓刚极。",
   "translations": {
    "zh": "很强的爆发力与执行锋芒：适合放到需要硬碰硬的位置。要配上纪律，否则容易伤到自己人。"
   },
   "positiveKeywords": [
    "魄力",
    "执行力猛",
    "抗压",
    "敢冲"
   ],
   "cautionKeywords": [
    "锋芒过露",
    "冲突多",
    "需刻意收敛"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.yima",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "驿马",
   "classicalTerm": "驿马",
   "attributes": {
    "qiFa": "寅午戌见申，申子辰见寅，巳酉丑见亥，亥卯未见巳。"
   },
   "professionalDef": "动神。主奔波、迁移、出行、变动。三合局冲位。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：寅午戌见申，申子辰见寅，巳酉丑见亥，亥卯未见巳。",
   "semanticLibrary": "动神。主奔波、迁移、出行、变动。三合局冲位。",
   "translations": {
    "zh": "闲不住的动能：换城市、换赛道、常出差都算兑现方式，主动安排比被动挪动更顺。"
   },
   "positiveKeywords": [
    "机动",
    "适合出海/外派",
    "视野广"
   ],
   "cautionKeywords": [
    "奔波",
    "定不下来",
    "开销大"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.yuede_guiren",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "月德贵人",
   "classicalTerm": "月德贵人",
   "attributes": {
    "qiFa": "寅午戌月见丙，申子辰月见壬，亥卯未月见甲，巳酉丑月见庚。"
   },
   "professionalDef": "德神。主平顺无灾、事有转圜。以月支三合局取天干。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：寅午戌月见丙，申子辰月见壬，亥卯未月见甲，巳酉丑月见庚。",
   "semanticLibrary": "德神。主平顺无灾、事有转圜。以月支三合局取天干。",
   "translations": {
    "zh": "遇事总有转圜余地的那种气质：不容易被逼到死角。"
   },
   "positiveKeywords": [
    "平顺",
    "有回旋余地",
    "少是非"
   ],
   "cautionKeywords": [
    "易安于现状"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shensha.zaisha",
   "system": "bazi",
   "category": "term",
   "termGroup": "shensha",
   "displayZh": "灾煞",
   "classicalTerm": "灾煞",
   "attributes": {
    "qiFa": "寅午戌见子，申子辰见午，巳酉丑见卯，亥卯未见酉。"
   },
   "professionalDef": "凶神。主突发阻滞。三合局沐浴之冲位。",
   "evidenceQuote": "《三命通会·论诸神煞》载其起例：寅午戌见子，申子辰见午，巳酉丑见卯，亥卯未见酉。",
   "semanticLibrary": "凶神。主突发阻滞。三合局沐浴之冲位。",
   "translations": {
    "zh": "变数偏多的一格：把冗余和预案做足，波动就转成了机会。"
   },
   "positiveKeywords": [
    "预案意识",
    "应变练习"
   ],
   "cautionKeywords": [
    "计划留缓冲",
    "避免全压一处"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "血光/伤亡预言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shishen.bijian",
   "system": "bazi",
   "category": "term",
   "displayZh": "比肩",
   "classicalTerm": "比肩",
   "professionalDef": "与日主同阴阳同五行的天干，主同辈、朋友、竞争者，帮扶亦分财。",
   "evidenceQuote": "《渊海子平》：比肩者，兄弟也，同我者也。",
   "semanticLibrary": "比肩为协助与分担并存之星：正面主自立、助力；负面主争夺、耗财。",
   "translations": {
    "zh": "同辈、朋友、伙伴；既帮你也和你争。",
    "en": "Same-element peer; friend and rival at once."
   },
   "positiveKeywords": [
    "助力",
    "自立",
    "同辈"
   ],
   "cautionKeywords": [
    "分财",
    "竞争",
    "耗散"
   ],
   "negativeKeywords": [
    "七杀",
    "正官"
   ],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "shishen",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shishen.jiecai",
   "system": "bazi",
   "category": "term",
   "displayZh": "劫财",
   "classicalTerm": "劫财",
   "professionalDef": "与日主异阴阳同五行的天干，主劫夺财星、主动手实干。",
   "evidenceQuote": "《子平真诠》：劫财者，劫我之财者也。",
   "semanticLibrary": "劫财主行动力与争夺：正面主果敢、实干；负面主破财、争执。",
   "translations": {
    "zh": "抢钱的同辈（异性）；敢干但也容易破财。",
    "en": "Grabber of wealth; action-taker, also loss-maker."
   },
   "positiveKeywords": [
    "实干",
    "果敢",
    "行动"
   ],
   "cautionKeywords": [
    "破财",
    "争执",
    "争夺"
   ],
   "negativeKeywords": [
    "正财",
    "偏财"
   ],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "shishen",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shishen.piancai",
   "system": "bazi",
   "category": "term",
   "displayZh": "偏财",
   "classicalTerm": "偏财",
   "professionalDef": "日主所克且同阴阳者，主横财、投机、父亲、风流。",
   "evidenceQuote": "《三命通会》：偏财者，乃众人之财。",
   "semanticLibrary": "偏财主流动之财：正面主机缘、慷慨、灵活；负面主浮滥、投机、不稳。",
   "translations": {
    "zh": "意外之财和人际财；慷慨灵活，但易来易去。",
    "en": "Windfall and social wealth; generous but unstable."
   },
   "positiveKeywords": [
    "机缘",
    "慷慨",
    "灵活"
   ],
   "cautionKeywords": [
    "投机",
    "不稳",
    "易散"
   ],
   "negativeKeywords": [
    "劫财",
    "比肩"
   ],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "shishen",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shishen.pianyin",
   "system": "bazi",
   "category": "term",
   "displayZh": "偏印",
   "classicalTerm": "偏印（枭神）",
   "professionalDef": "生日主且同阴阳者，主偏门学识、直觉、孤独，亦称枭神。",
   "evidenceQuote": "生日主而同阴阳者，偏印也，偏得其荫，谓之枭。",
   "semanticLibrary": "偏印主冷门才学与直觉：正面主专精、洞察；负面主孤僻、夺食（枭神夺食）。",
   "translations": {
    "zh": "偏门的才华和直觉；专精冷门，但易孤僻。",
    "en": "Unconventional skill and intuition; specialist, but isolated."
   },
   "positiveKeywords": [
    "专精",
    "洞察",
    "直觉"
   ],
   "cautionKeywords": [
    "孤僻",
    "夺食"
   ],
   "negativeKeywords": [
    "食神",
    "伤官"
   ],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "shishen",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shishen.qisha",
   "system": "bazi",
   "category": "term",
   "displayZh": "七杀",
   "classicalTerm": "七杀",
   "professionalDef": "克日主且同阴阳者，主权威、魄力、压力、小人，偏激之官星。",
   "evidenceQuote": "《子平真诠》：七杀者，偏官也，无制谓之七杀。",
   "semanticLibrary": "七杀主魄力与压力：身旺有制化为权，身弱无制主灾。关键在'食神制杀'或'印绶化杀'。",
   "translations": {
    "zh": "压力和魄力；身强能驾驭就是权，身弱就成灾。",
    "en": "Pressure and power; mastered becomes authority, unmastered becomes crisis."
   },
   "positiveKeywords": [
    "魄力",
    "权威",
    "果断"
   ],
   "cautionKeywords": [
    "压力",
    "小人",
    "灾厄"
   ],
   "negativeKeywords": [
    "食神",
    "正印"
   ],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "shishen",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shishen.shangguan",
   "system": "bazi",
   "category": "term",
   "displayZh": "伤官",
   "classicalTerm": "伤官",
   "professionalDef": "日主所生且异阴阳者，主才华外露、叛逆、口才，克官之星。",
   "evidenceQuote": "《子平真诠》：伤官者，我生而泄秀，与食神同而阴阳异。",
   "semanticLibrary": "伤官主才气与不服管：正面主聪颖、艺术、表达；负面主傲气、犯官、是非。",
   "translations": {
    "zh": "外露的才华和脾气；聪明但有棱角，易顶撞上司。",
    "en": "Outspoken talent; brilliant but rebellious, clashes with authority."
   },
   "positiveKeywords": [
    "才气",
    "表达",
    "艺术",
    "聪颖"
   ],
   "cautionKeywords": [
    "傲气",
    "犯官",
    "是非"
   ],
   "negativeKeywords": [
    "正官",
    "正印"
   ],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "shishen",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shishen.shishen",
   "system": "bazi",
   "category": "term",
   "displayZh": "食神",
   "classicalTerm": "食神",
   "professionalDef": "日主所生且同阴阳者，主才华、口福、技艺、子孙，泄秀生财之星。",
   "evidenceQuote": "《滴天髓》：食神者，我生而泄秀者也。",
   "semanticLibrary": "食神主才华与享受：正面主聪慧、才艺、福气；过旺主懒散、贪安逸。",
   "translations": {
    "zh": "你的才华和口福；聪明会享受，但别太懒。",
    "en": "Talent and pleasure; smart and artistic, watch laziness."
   },
   "positiveKeywords": [
    "才华",
    "聪慧",
    "福气",
    "技艺"
   ],
   "cautionKeywords": [
    "懒散",
    "贪安逸"
   ],
   "negativeKeywords": [
    "伤官",
    "七杀"
   ],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "shishen",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shishen.zhengcai",
   "system": "bazi",
   "category": "term",
   "displayZh": "正财",
   "classicalTerm": "正财",
   "professionalDef": "日主所克且异阴阳者，主稳定收入、妻子（男命）、务实。",
   "evidenceQuote": "《三命通会》：正财者，受我克制，为我之财。",
   "semanticLibrary": "正财主踏实财源：正面主勤劳、守信、稳定；负面主吝啬、拘泥。",
   "translations": {
    "zh": "稳定的正经收入；勤恳踏实，但别太抠。",
    "en": "Steady legitimate income; diligent and reliable."
   },
   "positiveKeywords": [
    "稳定",
    "勤劳",
    "务实"
   ],
   "cautionKeywords": [
    "吝啬",
    "拘泥"
   ],
   "negativeKeywords": [
    "劫财",
    "偏财"
   ],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "shishen",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shishen.zhengguan",
   "system": "bazi",
   "category": "term",
   "displayZh": "正官",
   "classicalTerm": "正官",
   "professionalDef": "克日主且异阴阳者，主事业、名望、约束、丈夫（女命），贵气之星。",
   "evidenceQuote": "《三命通会》：正官者，克我而得其正者也。",
   "semanticLibrary": "正官主秩序与贵气：正面主责任、地位；负面主压抑、束缚。",
   "translations": {
    "zh": "事业和规矩；给你地位，也给你压力。",
    "en": "Career and order; status with pressure."
   },
   "positiveKeywords": [
    "事业",
    "责任",
    "名望"
   ],
   "cautionKeywords": [
    "压抑",
    "束缚"
   ],
   "negativeKeywords": [
    "七杀",
    "伤官"
   ],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "shishen",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.shishen.zhengyin",
   "system": "bazi",
   "category": "term",
   "displayZh": "正印",
   "classicalTerm": "正印",
   "professionalDef": "生日主且异阴阳者，主母亲、学识、庇护、清贵，生身之星。",
   "evidenceQuote": "且生日主而异阴阳者，正印也，为母、为文、为荫。",
   "semanticLibrary": "正印主生养与文教：正面主慈爱、智慧、庇佑；负面主依赖、保守。",
   "translations": {
    "zh": "生养你的力量和文凭；慈爱有学识，但别太依赖。",
    "en": "Nurturing and learning; caring, wise, but avoid dependence."
   },
   "positiveKeywords": [
    "学识",
    "庇护",
    "慈爱",
    "清贵"
   ],
   "cautionKeywords": [
    "依赖",
    "保守"
   ],
   "negativeKeywords": [
    "财星",
    "食伤"
   ],
   "licenseTier": "public_domain",
   "version": "0.1.0",
   "termGroup": "shishen",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.tiangan.bing",
   "system": "bazi",
   "category": "term",
   "termGroup": "tiangan",
   "displayZh": "丙",
   "classicalTerm": "丙",
   "attributes": {
    "wuxing": "火",
    "yinyang": "阳"
   },
   "professionalDef": "阳火。象太阳之光，主照耀、宣发、无私普及。《滴天髓》谓丙火猛烈，能锻庚金，逢辛而怯。",
   "evidenceQuote": "《滴天髓·天干论》：「丙火猛烈，欺霜侮雪。」",
   "semanticLibrary": "阳火。象太阳之光，主照耀、宣发、无私普及。《滴天髓》谓丙火猛烈，能锻庚金，逢辛而怯。",
   "translations": {
    "zh": "像正午的太阳：热情外放、照亮别人，做事直来直去，不藏心事。"
   },
   "positiveKeywords": [
    "热情",
    "坦率",
    "有感染力",
    "乐于付出"
   ],
   "cautionKeywords": [
    "过于张扬",
    "急躁",
    "不留余地"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.tiangan.ding",
   "system": "bazi",
   "category": "term",
   "termGroup": "tiangan",
   "displayZh": "丁",
   "classicalTerm": "丁",
   "attributes": {
    "wuxing": "火",
    "yinyang": "阴"
   },
   "professionalDef": "阴火。象灯烛之火，主内敛、精微、持久。能炼庚金而成器，喜甲木为薪。",
   "evidenceQuote": "《滴天髓·天干论》：「丁火柔中，内性昭融。」",
   "semanticLibrary": "阴火。象灯烛之火，主内敛、精微、持久。能炼庚金而成器，喜甲木为薪。",
   "translations": {
    "zh": "像一盏灯：不刺眼但耐久，心思细腻、有洞察力，在小范围里持续发光。"
   },
   "positiveKeywords": [
    "细腻",
    "专注",
    "有洞察",
    "温和坚持"
   ],
   "cautionKeywords": [
    "多思",
    "易内耗",
    "计较细节"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.tiangan.geng",
   "system": "bazi",
   "category": "term",
   "termGroup": "tiangan",
   "displayZh": "庚",
   "classicalTerm": "庚",
   "attributes": {
    "wuxing": "金",
    "yinyang": "阳"
   },
   "professionalDef": "阳金。象斧钺刀兵，主肃杀、决断、革故。得丁火锻炼、壬水淘洗则成大器。",
   "evidenceQuote": "《滴天髓·天干论》：「庚金带煞，刚健为最。」",
   "semanticLibrary": "阳金。象斧钺刀兵，主肃杀、决断、革故。得丁火锻炼、壬水淘洗则成大器。",
   "translations": {
    "zh": "像一把未开刃的刀：果断、有魄力、敢下决定，需要历练才能真正锋利。"
   },
   "positiveKeywords": [
    "果断",
    "执行力强",
    "讲义气",
    "不拖泥带水"
   ],
   "cautionKeywords": [
    "刚硬",
    "冲撞",
    "少回旋"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.tiangan.gui",
   "system": "bazi",
   "category": "term",
   "termGroup": "tiangan",
   "displayZh": "癸",
   "classicalTerm": "癸",
   "attributes": {
    "wuxing": "水",
    "yinyang": "阴"
   },
   "professionalDef": "阴水。象雨露泉涓，主润泽、渗透、深藏。至弱而至柔，能滋万物于无形。",
   "evidenceQuote": "《滴天髓·天干论》：「癸水至弱，达于天津。」",
   "semanticLibrary": "阴水。象雨露泉涓，主润泽、渗透、深藏。至弱而至柔，能滋万物于无形。",
   "translations": {
    "zh": "像细雨和泉水：安静、体贴、润物无声，善于在背后把事情做成。"
   },
   "positiveKeywords": [
    "细致",
    "共情强",
    "有耐性",
    "不张扬"
   ],
   "cautionKeywords": [
    "多虑",
    "情绪内收",
    "决断慢"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.tiangan.ji",
   "system": "bazi",
   "category": "term",
   "termGroup": "tiangan",
   "displayZh": "己",
   "classicalTerm": "己",
   "attributes": {
    "wuxing": "土",
    "yinyang": "阴"
   },
   "professionalDef": "阴土。象田园之土，主蓄养、包容、化育。能生万物而藏其功，喜丙火暖、癸水润。",
   "evidenceQuote": "《滴天髓·天干论》：「己土卑湿，中正蓄藏。」",
   "semanticLibrary": "阴土。象田园之土，主蓄养、包容、化育。能生万物而藏其功，喜丙火暖、癸水润。",
   "translations": {
    "zh": "像一块沃土：不显眼却能养育万物，善于容纳不同的人和事。"
   },
   "positiveKeywords": [
    "包容",
    "务实",
    "善经营",
    "不争锋"
   ],
   "cautionKeywords": [
    "优柔",
    "界限不清",
    "被动"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.tiangan.jia",
   "system": "bazi",
   "category": "term",
   "termGroup": "tiangan",
   "displayZh": "甲",
   "classicalTerm": "甲",
   "attributes": {
    "wuxing": "木",
    "yinyang": "阳"
   },
   "professionalDef": "十天干之首，阳木。象参天之木，主生发、条达、领袖之性。《渊海子平》以甲为栋梁之材，喜庚金修削、丁火吐秀。",
   "evidenceQuote": "《渊海子平·论天干》：「甲木参天，脱胎要火。」",
   "semanticLibrary": "十天干之首，阳木。象参天之木，主生发、条达、领袖之性。《渊海子平》以甲为栋梁之材，喜庚金修削、丁火吐秀。",
   "translations": {
    "zh": "像一棵向上长的大树：有主见、想开创、愿意扛事。需要外部规则来修剪，才不会长偏。"
   },
   "positiveKeywords": [
    "开创",
    "正直",
    "有担当",
    "目标感强"
   ],
   "cautionKeywords": [
    "固执",
    "不肯低头",
    "容易硬碰硬"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.tiangan.ren",
   "system": "bazi",
   "category": "term",
   "termGroup": "tiangan",
   "displayZh": "壬",
   "classicalTerm": "壬",
   "attributes": {
    "wuxing": "水",
    "yinyang": "阳"
   },
   "professionalDef": "阳水。象江河大海，主奔流、周通、智谋。能泄金气、润木根，得戊土为堤则不泛滥。",
   "evidenceQuote": "《滴天髓·天干论》：「壬水通河，能泄金气。」",
   "semanticLibrary": "阳水。象江河大海，主奔流、周通、智谋。能泄金气、润木根，得戊土为堤则不泛滥。",
   "translations": {
    "zh": "像奔流的大江：脑子活、路子广、见识开阔，缺了边界就容易散。"
   },
   "positiveKeywords": [
    "机变",
    "广交",
    "视野宽",
    "反应快"
   ],
   "cautionKeywords": [
    "漂泊",
    "难定性",
    "注意力分散"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.tiangan.wu",
   "system": "bazi",
   "category": "term",
   "termGroup": "tiangan",
   "displayZh": "戊",
   "classicalTerm": "戊",
   "attributes": {
    "wuxing": "土",
    "yinyang": "阳"
   },
   "professionalDef": "阳土。象城墙堤岸，主厚重、承载、镇守。居中央而调四时，能止水、能生金。",
   "evidenceQuote": "《滴天髓·天干论》：「戊土固重，既中且正。」",
   "semanticLibrary": "阳土。象城墙堤岸，主厚重、承载、镇守。居中央而调四时，能止水、能生金。",
   "translations": {
    "zh": "像高大的堤坝：稳当、可靠、扛得住压力，是团队里让人放心的那一个。"
   },
   "positiveKeywords": [
    "稳重",
    "可靠",
    "抗压",
    "有信用"
   ],
   "cautionKeywords": [
    "迟缓",
    "保守",
    "不易变通"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.tiangan.xin",
   "system": "bazi",
   "category": "term",
   "termGroup": "tiangan",
   "displayZh": "辛",
   "classicalTerm": "辛",
   "attributes": {
    "wuxing": "金",
    "yinyang": "阴"
   },
   "professionalDef": "阴金。象珠玉首饰，主精纯、贵气、洁净。忌火炼而喜壬水洗淘，见丁则伤其明。",
   "evidenceQuote": "《滴天髓·天干论》：「辛金软弱，温润而清。」",
   "semanticLibrary": "阴金。象珠玉首饰，主精纯、贵气、洁净。忌火炼而喜壬水洗淘，见丁则伤其明。",
   "translations": {
    "zh": "像一件精工首饰：讲究品质与体面，对细节和审美很敏感。"
   },
   "positiveKeywords": [
    "精致",
    "审美好",
    "要求高",
    "有品位"
   ],
   "cautionKeywords": [
    "敏感",
    "挑剔",
    "难将就"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "bazi.tiangan.yi",
   "system": "bazi",
   "category": "term",
   "termGroup": "tiangan",
   "displayZh": "乙",
   "classicalTerm": "乙",
   "attributes": {
    "wuxing": "木",
    "yinyang": "阴"
   },
   "professionalDef": "阴木。象藤萝花草，主柔韧、攀附、生生不息。得甲为依托则贵，喜丙火向阳、癸水滋润。",
   "evidenceQuote": "《滴天髓·天干论》：「乙木虽柔，刲羊解牛。」",
   "semanticLibrary": "阴木。象藤萝花草，主柔韧、攀附、生生不息。得甲为依托则贵，喜丙火向阳、癸水滋润。",
   "translations": {
    "zh": "像藤蔓和花草：柔软但极有韧性，善于借力、绕过障碍，在夹缝里也能长起来。"
   },
   "positiveKeywords": [
    "柔韧",
    "善协调",
    "适应力强",
    "懂借势"
   ],
   "cautionKeywords": [
    "依赖他人",
    "立场易摇摆"
   ],
   "negativeKeywords": [
    "医疗诊断",
    "寿数断言",
    "绝对化结论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "chenggu.deng.baliang",
   "system": "chenggu",
   "systemCn": "称骨姓名学",
   "category": "term",
   "termGroup": "deng",
   "displayZh": "八两档",
   "professionalDef": "总重约八两，古诀谓极顶，主帝王将相之格，富贵寿考俱全，世所稀遇。",
   "translations": {
    "zh": "这一档古诀说“到顶了”。纯属古人的最高赞词。现实中把它当上限想象就好：它提醒你人生有天花板，但天花板从来不是出生数字定的，而是你每一步撑起来的。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "chenggu.deng.erliang",
   "system": "chenggu",
   "systemCn": "称骨姓名学",
   "category": "term",
   "termGroup": "deng",
   "displayZh": "二两档",
   "professionalDef": "总重约二两（含一、二钱），古诀多称劳碌、离祖、自立之象，属下等之轻。谓早年多波、须自撑。",
   "translations": {
    "zh": "这一档在古诀里常被说成“起步辛苦、要靠自己闯”。把它当作提醒：你这路可能早年不顺、少靠山，得早早练独立。真要改，靠的是现在多学本事、攒人脉，不是认命。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "chenggu.deng.liuliang",
   "system": "chenggu",
   "systemCn": "称骨姓名学",
   "category": "term",
   "termGroup": "deng",
   "displayZh": "六两档",
   "professionalDef": "总重约六两，古诀谓上等，主官贵、富厚、声名远播，一生多得外力扶持。",
   "translations": {
    "zh": "这一档古诀说“有贵人、有资源、名声能传开”。底子好，但越是顺越要稳：别因有人扶就松懈，也别挥霍人情。你可以做的是：把好运转化成长期资产，而不是一时风光。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "chenggu.deng.qiliang",
   "system": "chenggu",
   "systemCn": "称骨姓名学",
   "category": "term",
   "termGroup": "deng",
   "displayZh": "七两档",
   "professionalDef": "总重约七两，古诀谓上上，主极贵、大富、权位兼隆，非常人之局。",
   "translations": {
    "zh": "这一档古诀说“极好、大富大贵”。当趣味看就好——现实中没有人靠一个数字就赢一生。若你恰在这一档，更该提醒自己：运气牌再好，也得有脑子配上，否则来得快去得也快。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "chenggu.deng.sanliang",
   "system": "chenggu",
   "systemCn": "称骨姓名学",
   "category": "term",
   "termGroup": "deng",
   "displayZh": "三两档",
   "professionalDef": "总重约三两，古诀谓中下，主奔波谋为、衣食渐裕而少安逸，须勤力方稳。",
   "translations": {
    "zh": "这一档古诀说“得忙活才能稳”。类比现实：你大概不是躺赢型，收入靠持续出力换来，安逸少一点。可以做的是：把努力变成可积累的东西（技能、资产），别让辛苦白白流走。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "chenggu.deng.siliang",
   "system": "chenggu",
   "systemCn": "称骨姓名学",
   "category": "term",
   "termGroup": "deng",
   "displayZh": "四两档",
   "professionalDef": "总重约四两，古诀谓中平，主衣禄无亏、中年渐立，平稳少大起大落。",
   "translations": {
    "zh": "这一档古诀说“温饱不愁、中年立得住”。算是比较稳的命。你可以把它当成：你的人生大概率是平稳线，少大起大落——想突破上限，得主动去拼一把，光稳着不会自动变好。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "chenggu.deng.wuliang",
   "system": "chenggu",
   "systemCn": "称骨姓名学",
   "category": "term",
   "termGroup": "deng",
   "displayZh": "五两档",
   "professionalDef": "总重约五两，古诀谓中上，主建功、得名、晚年安享，才具可得展布。",
   "translations": {
    "zh": "这一档古诀说“能成事、得名声、晚年安稳”。算不错的底子。你可以做的是：别浪费这股势能，把才华放到能出成果的地方，中年前后容易见收获；但也别飘，踏实才能接住。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "chenggu.jie.fu",
   "system": "chenggu",
   "systemCn": "称骨姓名学",
   "category": "term",
   "termGroup": "jie",
   "displayZh": "福泽",
   "professionalDef": "古诀中主荫庇、顺遂、少灾之象，多见于中上之格。谓得天独厚、行事多助。",
   "translations": {
    "zh": "福泽指“古诀里说你比较被眷顾、做事多有人帮”的那类说法。真要它有，靠的是你平时攒下的好人缘和好口碑——人对你好，机会才容易轮到你。可以主动经营，别坐等。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "chenggu.jie.lao",
   "system": "chenggu",
   "systemCn": "称骨姓名学",
   "category": "term",
   "termGroup": "jie",
   "displayZh": "劳碌",
   "professionalDef": "古诀中主奔忙、少逸、亲力亲为之象，多见于轻骨之格。谓须以勤补局。",
   "translations": {
    "zh": "劳碌指“古诀说你这型得自己多干活”。如果认了这说法，就别等天上掉馅饼，早点把“靠自己”当成默认设置。可以把辛苦导向能积累的方向，让忙有意义，而不是瞎忙。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "chenggu.jie.mingge",
   "system": "chenggu",
   "systemCn": "称骨姓名学",
   "category": "term",
   "termGroup": "jie",
   "displayZh": "命格",
   "professionalDef": "合总骨重所归之局，分富贵、平稳、劳碌诸格。格为古诀对人生大势之归类，非定数。",
   "translations": {
    "zh": "命格就是“你这串数字归到哪类说法”。它给的是古人对人生大势的一种归类标签。你可以把它当性格/处境的自检：看看自己更像“稳”还是“拼”那一型，借此想清楚该往哪使劲。别被标签绑住。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "chenggu.jie.wen",
   "system": "chenggu",
   "systemCn": "称骨姓名学",
   "category": "term",
   "termGroup": "jie",
   "displayZh": "安稳",
   "professionalDef": "古诀中主平顺、无大波、衣食可守之象，多见于中平之格。谓守成则安。",
   "translations": {
    "zh": "安稳指“古诀说你这型少大起大落、守得住”。这是好事也是提醒：安稳容易变成停滞。你可以做的是：在稳的基础上，每年主动冒一次小险、学一样新东西，别让“稳”退化成“停”。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "chenggu.method.fa",
   "system": "chenggu",
   "systemCn": "称骨姓名学",
   "category": "term",
   "termGroup": "fa",
   "displayZh": "称骨法",
   "professionalDef": "以生年、月、日、时各依口诀折骨重，合计总两数定命局，分上中下三等。唐以后世传袁氏称量骨法，属趣味命术之一。",
   "translations": {
    "zh": "称骨法是把你的出生年、月、日、时各换成一个数，加总成一个“骨重”，再对照古诀看属于哪类说法。它就是古人一种把人生阶段浓缩成数字的小游戏，图个趣味和反思，别当真命。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "daliuren.struct.fayong",
   "system": "daliuren",
   "systemCn": "大六壬",
   "category": "term",
   "termGroup": "jiegou",
   "displayZh": "发用",
   "professionalDef": "三传之初传，由四课中取克贼、涉害、遥克等法所得，为事之机括、动之源头。发用得吉神则事易发，得凶神则事多舛。",
   "translations": {
    "zh": "发用是整件事的“第一颗扣子”，定调。它吉利，事容易启动；它凶，开头就磕绊。你可以做的是：启动新事之前先看第一反应顺不顺——如果一上手就处处卡，可能是时机 or 方向不对，先调再进。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "daliuren.struct.sanchuan",
   "system": "daliuren",
   "systemCn": "大六壬",
   "category": "term",
   "termGroup": "jiegou",
   "displayZh": "三传",
   "professionalDef": "由发用依次遁出初传、中传、末传，象人事之初、中、末三际。初传主事端，中传主过程，末传主结局。传逆则事乖，传顺则事济。",
   "translations": {
    "zh": "三传是这件事的“开头—中间—结尾”一条线。它帮你判断一件事是越走越顺还是开头好结尾烂。你可以做的是：别只盯眼前第一步，顺着想清楚中后段会怎样；如果末传明显走下坡，趁早设止损。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "daliuren.struct.sike",
   "system": "daliuren",
   "systemCn": "大六壬",
   "category": "term",
   "termGroup": "jiegou",
   "displayZh": "四课",
   "professionalDef": "以日干支上下神相生克布列四课：干上神为第一课，干阴为第二课，支上神为第三课，支阴为第四课。四课显宾主、明暗、内外之象，为起传之本。",
   "translations": {
    "zh": "四课是把“你、对方、明面、暗面”四个角度摆出来对照。它帮你看出谁主动、谁藏心思、问题在表面还是底下。你可以做的是：遇到拿不准的事，分四栏写——我表面要什么、我藏着什么、对方明说啥、对方没说啥，往往就看清了。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "daliuren.struct.yuanshou",
   "system": "daliuren",
   "systemCn": "大六壬",
   "category": "term",
   "termGroup": "guaming",
   "displayZh": "元首卦",
   "professionalDef": "六壬第一卦，寅午辰之类，主君明臣良、事从正面发端、自上而下而易成。占政务主得位，占常事主顺遂，为诸卦之正。",
   "translations": {
    "zh": "这一卦象代表“正正当当、从上往下好推进”。它出现，说明事由正当渠道、靠正常流程就能成，不用走歪门。你可以做的是：走正规申请、正式汇报、公开透明的路径，比私下运作更稳。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "daliuren.tianjiang.baihu",
   "system": "daliuren",
   "systemCn": "大六壬",
   "category": "term",
   "termGroup": "shierjiang",
   "displayZh": "白虎",
   "professionalDef": "十二天将之一，属金，主凶丧、血光、刑伤、疾病、威权。临干主灾疾，占病主危，占事主刑伤。旺则肃杀有权，衰则无害。",
   "translations": {
    "zh": "这一位提醒“注意安全和身体”。它出现时，容易有磕碰、病痛或强硬的压力。你可以做的是：这几天少冒险、开车慢点、体检别拖；遇到强势的人或规矩，先配合别硬顶，把伤害降到最低。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "daliuren.tianjiang.guiren",
   "system": "daliuren",
   "systemCn": "大六壬",
   "category": "term",
   "termGroup": "shierjiang",
   "displayZh": "贵人",
   "professionalDef": "十二天将之首，阴贵人、阳贵人随昼夜之分。主爵禄、解救、尊长、助力。临干支旺相则得人扶持，空陷则虚望无依。占事遇贵人为转机之象。",
   "translations": {
    "zh": "这一位代表“能帮你的关键人物”。它出现，说明事情有转圜余地，可能遇到肯拉你一把的长辈、上级或贵人。你可以做的是：遇到困难别硬扛，主动去请教、求助那些有分量的人；但别把希望全押在别人身上，对方也得旺才行。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "daliuren.tianjiang.liuhe",
   "system": "daliuren",
   "systemCn": "大六壬",
   "category": "term",
   "termGroup": "shierjiang",
   "displayZh": "六合",
   "professionalDef": "十二天将之一，属木，主和合、婚姻、交易、中介、文书合约。临干支主成合之事，占婚主媒妁，占讼主和解。旺则和顺，空则虚约。",
   "translations": {
    "zh": "这一位代表“谈成、撮合”。它出现时，合作、签合同、撮合关系都顺，是谈和的好信号。你可以做的是：把想达成的协议趁这时候推进，找中间人牵线也有效；但对方若落空，口头承诺可能不算数，得落字据。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "daliuren.tianjiang.qinglong",
   "system": "daliuren",
   "systemCn": "大六壬",
   "category": "term",
   "termGroup": "shierjiang",
   "displayZh": "青龙",
   "professionalDef": "十二天将之一，属木，主官贵、财喜、生育、文采、喜庆。临财主进益，临官主升迁，占婚主佳偶。旺相则福臻，囚死则虚花。",
   "translations": {
    "zh": "这一位代表“好事和进账”。它出现时，容易有喜事、加薪、成交或受人赏识。你可以做的是：把能展示成果、争取资源的事往前推；有才艺或作品就趁这时候亮出来，容易被看见。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "daliuren.tianjiang.taiyin",
   "system": "daliuren",
   "systemCn": "大六壬",
   "category": "term",
   "termGroup": "shierjiang",
   "displayZh": "太阴",
   "professionalDef": "十二天将之一，属金，主阴私、女人、暗昧、策划、藏书。临干主密谋渐成，占事主阴人助力，占病主虚寒。旺则隐秀，空则虚谋。",
   "translations": {
    "zh": "这一位代表“暗中的筹谋和女性助力”。它出现时，适合私下准备、悄悄布局，不宜张扬。你可以做的是：把计划先捂着打磨，必要时找信任的女性长辈或伙伴商量；公开场合少表态，等时机成熟再亮。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "daliuren.tianjiang.tengshe",
   "system": "daliuren",
   "systemCn": "大六壬",
   "category": "term",
   "termGroup": "shierjiang",
   "displayZh": "螣蛇",
   "professionalDef": "十二天将之一，属火，主虚惊、怪异、缠绕、阴私、血光。临身主疑惧多梦，占病主惊痫，占事主纠缠不清。旺则灵变，衰则妖妄。",
   "translations": {
    "zh": "这一位代表“自己吓自己”和剪不断理还乱。它出现时，容易疑神疑鬼、被小事缠住、越想越怕。你可以做的是：把担心的事写下来逐条核实，多半是虚惊；别在焦虑时做重大决定，先让情绪落地。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "daliuren.tianjiang.xuanwu",
   "system": "daliuren",
   "systemCn": "大六壬",
   "category": "term",
   "termGroup": "shierjiang",
   "displayZh": "玄武",
   "professionalDef": "十二天将之一，属水，主盗贼、欺骗、阴私、遗失、暧昧。临财主失脱，临干主暗昧，占失主被盗。旺则智巧，衰则为非。",
   "translations": {
    "zh": "这一位代表“看不清的坑”。它出现时，容易丢东西、遇骗、或被蒙在鼓里。你可以做的是：贵重物品收好，转账前核实对方身份，听起来太好的事先打问号；感情里含糊的事，别自欺。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "daliuren.tianjiang.zhuque",
   "system": "daliuren",
   "systemCn": "大六壬",
   "category": "term",
   "termGroup": "shierjiang",
   "displayZh": "朱雀",
   "professionalDef": "十二天将之一，属火，主文书、口舌、音信、文章、讼非。临干主信至，空亡则信虚；占讼主口辩，占病主心火。旺则文章显，衰则口舌生。",
   "translations": {
    "zh": "这一位管“信息和嘴”。它出现时，消息、邮件、文字往来会变多，也容易因话说不清而起争执。你可以做的是：重要的事落到书面，反复确认对方真听懂了；发火前先核实，别凭一条消息就下结论。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "fengshui.liqi.bagua",
   "system": "fengshui",
   "systemCn": "风水堪舆",
   "category": "term",
   "termGroup": "liqi",
   "displayZh": "八卦方位",
   "professionalDef": "以乾坤坎离震巽艮兑配八方，各统人事物类。如坎北主陷、离南主明、震东主动。方位与人事相配，为理气流布之纲。",
   "translations": {
    "zh": "八卦方位是把“八个方向”对应不同生活主题（比如东边管行动、南边管名声）。它给你一个整理空间的思路：想加强哪块生活，就在对应方位多花点心思布置。当作收纳和分区参考就好，别当成铁律。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "fengshui.liqi.caiwei",
   "system": "fengshui",
   "systemCn": "风水堪舆",
   "category": "term",
   "termGroup": "liqi",
   "displayZh": "财位",
   "professionalDef": "明财位在入门对角线，暗财位依飞星而定。财位宜亮、净、实、有生气，忌空、污、压、动。摆聚宝盆、绿植以引气。",
   "translations": {
    "zh": "财位泛指“家里那个该收拾干净、显得有生机”的角落。把它保持明亮、整洁、不堆杂物、摆盆绿植，心理上你会更看重资源和机会。你可以做的是：每周顺手打理那个角，比摆什么吉祥物更实在。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "fengshui.liqi.wuxing",
   "system": "fengshui",
   "systemCn": "风水堪舆",
   "category": "term",
   "termGroup": "liqi",
   "displayZh": "五行生克",
   "professionalDef": "金木水火土相生相克，为理气推演之基。生则助、克则制。布局配色、材质皆可纳入生克以调气场之偏。",
   "translations": {
    "zh": "五行生克是套“互相助长或互相制约”的关系，用来解释为什么某些搭配顺、某些别扭。你可以把它当配色和材质的协调原则：想要某处更有活力，就加相生的元素；某处太燥，就用相克的元素中和。图个协调舒服。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "fengshui.qiju.chuang",
   "system": "fengshui",
   "systemCn": "风水堪舆",
   "category": "term",
   "termGroup": "qiju",
   "displayZh": "床",
   "professionalDef": "床为人休止之要，宜靠实墙、避梁压、不对镜门。床头有靠主安稳，脚对门谓犯冲。卧房之局系身心之养。",
   "translations": {
    "zh": "床的摆法直接影响睡眠质量。最稳的放法是床头贴实墙、不悬空、不正对门、不被横梁压着。你可以做的是：把床调成“躺下能看见门、但门不对着脚”的位置，安全感一下就上来了。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "fengshui.qiju.men",
   "system": "fengshui",
   "systemCn": "风水堪舆",
   "category": "term",
   "termGroup": "qiju",
   "displayZh": "门",
   "professionalDef": "门为气口，纳气之枢。门宜开旺方、避直冲、不对灶厕。两门相对谓对骂，门对梯为牵牛。门之吉凶系一家之咽喉。",
   "translations": {
    "zh": "门是“家的嘴巴”，进出的气口。它最忌正对着直冲来的路、电梯或另一道门，那样人进出都慌。你可以做的是：门口留缓冲、加个玄关或地垫柔化；门别正对厕所厨房，保持入口干净明亮。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "fengshui.qiju.zhen",
   "system": "fengshui",
   "systemCn": "风水堪舆",
   "category": "term",
   "termGroup": "qiju",
   "displayZh": "镇煞",
   "professionalDef": "以屏、镜、石、植物等物化解形煞冲射，谓之镇。法贵因形制宜，先避后化。镇者调气非斗气，过则反扰。",
   "translations": {
    "zh": "镇煞就是“用东西把不舒服的冲射柔化掉”，比如用屏风挡住直冲的走道、用绿植化解尖角视线。原则是先避开再化解，别硬碰。你可以做的是：发现哪处看着别扭、视线被刺，先用屏障或植物隔开，舒服了就行，不必求复杂。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "fengshui.xingfa.long",
   "system": "fengshui",
   "systemCn": "风水堪舆",
   "category": "term",
   "termGroup": "xingfa",
   "displayZh": "来龙",
   "professionalDef": "山脉起伏绵延而入首之处曰龙。龙分祖宗、少祖、入首，贵在生旺、开帐、过峡有情。来龙脉气厚则地灵，孤散则气薄。峦头之根本。",
   "translations": {
    "zh": "来龙可以理解为“这片地方的气场来路”。它讲的是背后有没有靠山、地势是不是连贯有生气。你可以类比挑住处：背后有稳固依托（高楼或山形）、视野不被切断，人住着更踏实。这只是环境感受，别当成定命。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "fengshui.xingfa.mingtang",
   "system": "fengshui",
   "systemCn": "风水堪舆",
   "category": "term",
   "termGroup": "xingfa",
   "displayZh": "明堂",
   "professionalDef": "穴前开阔聚气之平面曰明堂，分内明堂、外明堂。明堂宜宽广平正、水聚天心，主前途、心胸、事业之展布。逼窄则局促。",
   "translations": {
    "zh": "明堂是“你面前的开阔地”。办公桌或进门处前面留一片空，人会觉得有空间、有奔头；前面被堵死，容易胸闷心窄。你可以做的是：座位正前方保持空净、不堆杂物，视野开阔一点，思路和心情都松。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "fengshui.xingfa.sha",
   "system": "fengshui",
   "systemCn": "风水堪舆",
   "category": "term",
   "termGroup": "xingfa",
   "displayZh": "砂",
   "professionalDef": "穴场前后左右之山丘、建筑谓之砂，分青龙白虎朱雀玄武四势。砂要环抱有情，护卫穴场；反背、尖射、破碎则为恶砂。",
   "translations": {
    "zh": "砂是“周围围着你的人或物”。左右有对称、不压迫的楼房或家具，像有人护着；如果一侧空、一侧逼，就容易觉得不稳。你可以做的是：把高大家具放两侧而非正对坐卧处，留出左右平衡的格局。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "fengshui.xingfa.shui",
   "system": "fengshui",
   "systemCn": "风水堪舆",
   "category": "term",
   "termGroup": "xingfa",
   "displayZh": "水",
   "professionalDef": "水主财禄、气运之流动。来水宜屈曲环抱、缓聚于前；去水忌直泻、反弓、割脚。水法关乎纳气与明堂格局。",
   "translations": {
    "zh": "水代表“流动的资源和生活节奏”。门前路、过道、气流像水——弯弯绕绕、不冲直撞最舒服；直冲而来的通道容易让人心不安。你可以做的是：让主要动线缓和、不直顶座位，摆点绿植柔化冲来的视线。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "fengshui.xingfa.xiang",
   "system": "fengshui",
   "systemCn": "风水堪舆",
   "category": "term",
   "termGroup": "xingfa",
   "displayZh": "朝向",
   "professionalDef": "建筑正面所对之方位曰向，立向须合元运与龙局。向首纳生旺之气则吉，纳衰死之气则乖。向为理气之枢。",
   "translations": {
    "zh": "朝向是“房子脸朝哪边”。简单说，主要采光和视野朝南或朝开阔面，白天亮堂、通风好，人住着舒服。你可以做的是：挑房或摆床，优先让主要活动面迎自然光，少对着又暗又闷的墙角。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "fengshui.xingfa.xue",
   "system": "fengshui",
   "systemCn": "风水堪舆",
   "category": "term",
   "termGroup": "xingfa",
   "displayZh": "穴",
   "professionalDef": "龙、砂、水三方交会聚气之处曰穴，为建筑或安坟之核心。穴贵藏风聚气、窝钳乳突得宜。点穴差毫厘则气散。",
   "translations": {
    "zh": "穴就是“气聚拢的那个点”，好比房间里最舒服、最聚气的那块地。挑书桌或床的位置时，可以找那种背后有靠、左右不空、前面开阔的角落——待着不飘、能沉下心，就是好的“穴”。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "liuyao.bagua.dui",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "兑",
   "classicalTerm": "兑卦",
   "professionalDef": "经卦之一，上缺之象，象泽，性喜悦。为少女、为口舌、为羊、为金刃、为娱乐宴饮，属金居西。于人事取象言谈欢愉、交际游乐，亦取象口角损伤、毁折缺损。",
   "evidenceQuote": "《说卦传》：兑，说也。",
   "semanticLibrary": "上缺之象象泽，性喜悦：为少女为口舌为羊，属金居西，主言谈娱乐与口舌。",
   "translations": {
    "zh": "这一象代表张嘴和高兴：说话、唱歌、社交、吃喝玩乐，也对应年轻女性、湖泊水塘、缺了一角的东西。它出现，说明这件事的关键在于怎么说，谈得开心就成，气氛僵了就黄。好处是气氛轻松、容易拉近距离；坏处是话多失言、只顾着热闹忘了正事，或者被几句甜话哄住。可以做的事：把要谈的三个要点写进手机备忘录，聊得再开心也回头对一遍；对方说得越好听，越要追一句具体怎么落实。"
   },
   "positiveKeywords": [
    "亲和",
    "会说话",
    "气氛好"
   ],
   "cautionKeywords": [
    "失言",
    "被哄住",
    "只顾热闹"
   ],
   "negativeKeywords": [
    "缺损"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.bagua.gen",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "艮",
   "classicalTerm": "艮卦",
   "professionalDef": "经卦之一，一阳止于上，象山，性止。为少男、为手、为狗、为门阙、为山石坟墓，属土居东北。于人事取象静止阻隔、稳重守成、知止不进；亦取象闭塞不通、进退维谷。",
   "evidenceQuote": "《说卦传》：艮，止也。",
   "semanticLibrary": "一阳止于上象山，性止：为少男为手为狗，属土居东北，主静止坚守与阻隔。",
   "translations": {
    "zh": "这一象代表停住：山、墙、门槛、挡在前面走不过去的东西，也对应年轻男性和一双手。它出现，说明这件事现在推不动，不是你不努力，是时候没到、路被挡住了。好处是适合守成、沉淀、把手上已有的东西整理好；坏处是憋屈、原地打转、越急越出不去。可以做的事：把这件事先放下三到七天，期间转去做另一件能出成果的小事；同时找出挡路的那一块具体是什么，是钱、是人、还是缺一个批复。挡路的东西一说清楚，往往就有绕法。"
   },
   "positiveKeywords": [
    "守成",
    "沉淀",
    "知进退"
   ],
   "cautionKeywords": [
    "阻隔",
    "原地打转",
    "闭塞"
   ],
   "negativeKeywords": [
    "推不动"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.bagua.kan",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "坎",
   "classicalTerm": "坎卦",
   "professionalDef": "经卦之一，一阳陷二阴，象水，性陷。为中男、为耳、为豕、为江河沟渎、为险难盗寇，属水居北。于人事取象险中求通、劳心费力、外柔内刚；亦取象沉溺陷落、暗昧不明。",
   "evidenceQuote": "《说卦传》：坎，陷也。",
   "semanticLibrary": "一阳陷二阴象水，性陷：为中男为耳为豕，属水居北，主险难忧患与智慧。",
   "translations": {
    "zh": "这一象代表往下陷：水、坑、夜路、看不清的处境，也对应耳朵和腰肾。它出现，说明眼前这件事里有坑，而且不是绕一下就完事，得蹚过去才行。好处是能磨出真本事，别人不敢接的活你能接下来；坏处是耗神、孤单、越陷越深还看不到头。可以做的事：先把最坏会怎样写出来，如果最坏你也扛得住，就往前走；扛不住就现在退。同时找一个能说真话的人定期跟你对一次进展，别一个人闷着熬。"
   },
   "positiveKeywords": [
    "能扛事",
    "险中得机",
    "沉得住气"
   ],
   "cautionKeywords": [
    "耗神",
    "孤军奋战",
    "越陷越深"
   ],
   "negativeKeywords": [
    "看不清"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.bagua.kun",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "坤",
   "classicalTerm": "坤卦",
   "professionalDef": "经卦之一，三阴爻，象地，性顺。为母、为腹、为牛、为布帛舆釜、为众为田野，属土居西南。于人事取象承载包容、厚积柔顺、以众成事；亦取象迟缓因循、依赖无断。",
   "evidenceQuote": "《说卦传》：坤，顺也。",
   "semanticLibrary": "三阴爻象地，性顺：为母为腹为牛，属土居西南，主承载包容与众人。",
   "translations": {
    "zh": "这一象代表托着：像大地一样承载，对应母亲、一群人、后勤保障，还有布料、粮食、田地这类实在东西。它出现，说明这件事靠一个人冲不成，得靠人多、靠积累、靠慢慢铺开，适合做服务、做基础、做支持性的工作。好处是稳、能容人、越做越厚；坏处是太被动、什么都顺着别人、该说不的时候说不出口。可以做的事：把要做的事拆成很多小份分给能帮上忙的人，自己做统筹；同时给自己划一条底线，越过这条线就明确拒绝，别一味迁就。"
   },
   "positiveKeywords": [
    "包容",
    "积累",
    "以众成事"
   ],
   "cautionKeywords": [
    "被动",
    "迟缓",
    "不懂拒绝"
   ],
   "negativeKeywords": [
    "一味迁就"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.bagua.li",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "离",
   "classicalTerm": "离卦",
   "professionalDef": "经卦之一，中虚之象，象火，性丽明。为中女、为目、为文书、为炉灶甲胄，属火居南。于人事取象光明显达、文明礼乐、名声外扬；性急易燥，外实中虚，热极而衰。",
   "evidenceQuote": "《说卦传》：离，丽也。",
   "semanticLibrary": "中虚之象象火，性丽明：为中女为目为文书，属火居南，主光明文采。",
   "translations": {
    "zh": "这一象代表亮出来：光、火、屏幕、眼睛、证书文凭，还有那些需要被人看见的场合。它出现，说明这件事藏不住也不该藏，要往台面上放，展示、发布、面试、上台讲都算对路。好处是显眼、来得快、容易被认可；坏处是外表光鲜里面空，热度一过就凉，人的脾气也容易上来。可以做的事：先把最拿得出手的那一件成果打磨到能公开的程度，再去争取曝光；同时留意用眼和用火用电的安全，别整夜盯着屏幕。"
   },
   "positiveKeywords": [
    "显达",
    "被看见",
    "有热度"
   ],
   "cautionKeywords": [
    "外实中虚",
    "性急",
    "热度难持久"
   ],
   "negativeKeywords": [
    "虚有其表"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.bagua.qian",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "乾",
   "classicalTerm": "乾卦",
   "professionalDef": "经卦之一，三阳爻，象天，性刚健。为君为父、为首为马、为金玉圆物，属金居西北。于人事取象领导决断、开创统御、刚强不屈；过刚则亢而无辅，独断寡助。",
   "evidenceQuote": "《说卦传》：乾，健也。",
   "semanticLibrary": "三阳爻象天，性刚健：为君为父为首为马，属金居西北，主领导决断与开创。",
   "translations": {
    "zh": "这一象代表往前顶的那股劲：像天一样不停歇，对应当家拿方向的那个角色、父亲、老板，以及圆的、硬的、贵重的东西。它出现，说明这件事需要有人站出来定方向、扛责任，靠一圈人商量到底商量不出结果。好处是推得动、有魄力；坏处是容易一个人扛太多、听不进劝、把身边人使唤狠了。可以做的事：该拍板就痛快拍板，别拖着；但每做一个决定，留一个人在旁边专门给你挑毛病。"
   },
   "positiveKeywords": [
    "决断",
    "开创",
    "担当"
   ],
   "cautionKeywords": [
    "独断",
    "过刚",
    "一人扛太多"
   ],
   "negativeKeywords": [
    "孤立无援"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.bagua.xun",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "巽",
   "classicalTerm": "巽卦",
   "professionalDef": "经卦之一，一阴伏于下，象风，性入。为长女、为股、为鸡、为绳直、为草木香气，属木居东南。于人事取象柔顺渗透、往来交易、传播消息；亦取象进退不果、随风摇摆。",
   "evidenceQuote": "《说卦传》：巽，入也。",
   "semanticLibrary": "一阴伏于下象风，性入：为长女为股为鸡，属木居东南，主柔顺进退与传闻。",
   "translations": {
    "zh": "这一象代表钻进去：像风一样无孔不入，对应打听消息、跑关系、做买卖、来回沟通协调这类活，也对应家里的大女儿、绳子电线、来来回回的路。它出现，说明这件事硬闯不行，得慢慢渗、多方打点、找对缝隙进去。好处是柔和、不树敌、消息灵通；坏处是心里摇摆、来回反复、被人牵着走。可以做的事：找三个能说上话的人分别聊一次，把信息拼起来再决定；给自己定一个截止时间，到点必须选一个，不许再改。"
   },
   "positiveKeywords": [
    "消息灵通",
    "善周旋",
    "不树敌"
   ],
   "cautionKeywords": [
    "摇摆",
    "反复",
    "被人牵着走"
   ],
   "negativeKeywords": [
    "下不了决心"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.bagua.zhen",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "震",
   "classicalTerm": "震卦",
   "professionalDef": "经卦之一，一阳动于下，象雷，性动。为长男、为足、为龙、为大涂、为惊惧鼓乐，属木居东。于人事取象奋发振作、动而有声、事起突然；亦取象虚惊躁动、有始无终。",
   "evidenceQuote": "《说卦传》：震，动也。",
   "semanticLibrary": "一阳动于下象雷，性动：为长男为足为龙，属木居东，主奋发惊惧与鼓乐。",
   "translations": {
    "zh": "这一象代表突然一下：打雷、开机、发动、一个电话把你从座位上叫起来。它对应家里的大儿子、脚和腿、大马路，也对应那种吓一跳但没造成实际损失的动静。它出现，说明事情会动起来，而且来得比你预期快，需要马上反应。好处是有冲劲、能把僵局撞开；坏处是慌里慌张、雷声大雨点小、动完了没有下文。可以做的事：机会来的时候先应下来再补细节，别因为没准备好就错过；但三天之内要给它一个具体安排，不然这股劲很快就散了。"
   },
   "positiveKeywords": [
    "行动力",
    "破局",
    "机会来得快"
   ],
   "cautionKeywords": [
    "躁进",
    "有始无终",
    "虚惊"
   ],
   "negativeKeywords": [
    "雷声大雨点小"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.liuqin.fumu",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "liuqin",
   "displayZh": "父母",
   "classicalTerm": "父母爻",
   "professionalDef": "六亲之一，生我者为父母。取象长辈师长、文书契约、房屋车马、庇荫与劳心之事。占文书、考试、房产、行舟车皆以父母爻为凭；旺相则事有依托，休囚则文书迟滞、尊长少助。父母爻能克子孙，故占子嗣、求医时须防其制。",
   "evidenceQuote": "《卜筮正宗》六亲章：生我者，为父母。",
   "semanticLibrary": "生我者父母：主庇荫、文书、长辈；占文书考试房屋以父母爻为用神。",
   "translations": {
    "zh": "这一格代表罩着你的人和纸面上的凭据：长辈、老师、前辈，还有合同、证书、房本、执照、保单这类东西。它有力的时候，说明你办事有人兜底、材料齐全，签约、考证、买房搬家都比较顺；它弱的时候，往往卡在手续没齐、批复没下来，或者想找人搭把手却找不到合适的人。可以做的事：把该盖的章、该补的材料、该问的长辈电话理成一张清单，一样样落实，比反复催进度有用得多。"
   },
   "positiveKeywords": [
    "庇护",
    "凭据",
    "学养"
   ],
   "cautionKeywords": [
    "操劳",
    "拖批",
    "依赖长辈"
   ],
   "negativeKeywords": [
    "手续受阻"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.liuqin.guagui",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "liuqin",
   "displayZh": "官鬼",
   "classicalTerm": "官鬼爻",
   "professionalDef": "六亲之一，克我者为官鬼。取象官职上司、法度规章、词讼考核、忧疑病患，女占婚姻则以官鬼为夫。占功名、求职、诉讼以官鬼为凭，旺相有制则职位可期；过旺无制则压力沉重、是非缠身。官鬼能克兄弟，为忌之时须以子孙制之。",
   "evidenceQuote": "《卜筮正宗》六亲章：克我者，为官鬼。",
   "semanticLibrary": "克我者官鬼：主官禄、法度、忧疑病患；女占婚以官鬼为夫，占疾病忌官鬼旺动。",
   "translations": {
    "zh": "这一格代表管着你的那股力量：上级、规章制度、考核标准、审批流程，也包括让你睡不好的那点压力和身体上的不舒服；女性问感情时，它常常指对方那个人。它清晰有力，说明你待在一个有规矩、有晋升通道的地方，评审、立项、升职这类事有指望。它太重，就是被截止日期追着、被检查盯着、被闲话围着，喘不过气。可以做的事：把压力拆成谁在要求、要什么、什么时候要三栏写下来，能谈的去谈，谈不了的按最低标准先交付，别一个人硬扛。"
   },
   "positiveKeywords": [
    "职位",
    "规矩",
    "被认可"
   ],
   "cautionKeywords": [
    "压力大",
    "被约束",
    "口舌是非"
   ],
   "negativeKeywords": [
    "纠纷缠身"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.liuqin.qicai",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "liuqin",
   "displayZh": "妻财",
   "classicalTerm": "妻财爻",
   "professionalDef": "六亲之一，我克者为妻财。取象钱财货物、薪俸利息、器用资产，男占婚姻则以妻财为妻。占求财、买卖、讨债以妻财为凭，旺相则进项可期；被兄弟爻夺则耗散，逢空破则财到手而复失。妻财能克父母，故占文书时忌其独旺。",
   "evidenceQuote": "《卜筮正宗》六亲章：我克者，为妻财。",
   "semanticLibrary": "我克者妻财：主钱财货物薪俸；占求财买卖以妻财为用神，男占婚以妻财为妻。",
   "translations": {
    "zh": "这一格代表你能拿到手、能支配的东西：工资、货款、存款、可以变现的资源；男性问感情时，它也指对方那个人。它有力，说明近期进账、回款、成交比较顺，谈价钱底气足。它弱，或者旁边有人来分，就容易出现钱到不了账、被人借走不还、预算被砍掉一半。可以做的事：把确定能进的钱和只是口头答应的钱分成两栏记，别拿后者做开销计划；同时看看是不是有好几个人在抢同一份预算，早点把自己那份定死。"
   },
   "positiveKeywords": [
    "进项",
    "可支配",
    "谈得动价"
   ],
   "cautionKeywords": [
    "被分走",
    "开销超支",
    "只是口头承诺"
   ],
   "negativeKeywords": [
    "空欢喜"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.liuqin.wo",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "liuqin",
   "displayZh": "我",
   "classicalTerm": "我/立极",
   "professionalDef": "六亲取象的参照原点，即卦宫五行本身，或所占之事的立极处。生我者为父母，克我者为官鬼，我克者为妻财，我生者为子孙，比和者为兄弟。定我即定坐标，五类六亲方能各归其位；参照点若立错，全卦六亲皆错。",
   "evidenceQuote": "《增删卜易》六亲取法：以本宫卦所属五行立为我，与他爻论生克而定六亲。",
   "semanticLibrary": "卦宫五行为立极原点：生克比和关系定出六亲，为六爻取象的坐标系。",
   "translations": {
    "zh": "这是整张卦的原点：先确定这件事到底是谁的事，其他五类关系才有意义。就像看一张家庭合影，得先指出照片里哪个是你，才能说清谁是长辈、谁是伴侣、谁是孩子。占卜也一样，问自己的事，原点就是你；替公司问，原点就是这家公司；替孩子问，原点就是孩子。可以做的事：开口之前先想清楚我这一问站的是哪个位置，一次只站一个位置。站错了位置，后面所有解读都会跟着跑偏。"
   },
   "positiveKeywords": [
    "立足点",
    "坐标清晰",
    "自身定位"
   ],
   "cautionKeywords": [
    "立场混淆",
    "一问多头",
    "越位代人"
   ],
   "negativeKeywords": [
    "参照错位"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.liuqin.xiongdi",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "liuqin",
   "displayZh": "兄弟",
   "classicalTerm": "兄弟爻",
   "professionalDef": "六亲之一，同我者为兄弟。取象兄弟姐妹、同僚同学、朋辈竞争者。兄弟能克妻财，占财、占婚、占竞标皆忌其旺动，主分夺阻隔；占谋事得同辈之助、占合伙则可赖其力。兄弟爻动多主破耗、争执、劫夺。",
   "evidenceQuote": "《卜筮正宗》六亲章：比和者，为兄弟。",
   "semanticLibrary": "比和者兄弟：主同辈竞争、分夺；兄弟能克妻财，占财占婚皆忌兄弟持世旺动。",
   "translations": {
    "zh": "这一格代表和你站在同一层的人：兄弟姐妹、同事、同学、同行对手。它有力，说明你身边有人可以搭伙、有人愿意帮你抬事，做合作、拼团、找搭档比较容易谈成。但同一份钱、同一个名额也会被这些人分掉，问收入、问竞标、问追求对象的时候，它越旺越要留神被截胡。可以做的事：合作之前先把出资比例、分成方式、谁拍板写清楚；如果在抢同一个机会，别只顾埋头做，先去把关键那个人的态度问明白。"
   },
   "positiveKeywords": [
    "同辈支持",
    "合伙",
    "人多力大"
   ],
   "cautionKeywords": [
    "分薄利益",
    "竞争激烈",
    "口角"
   ],
   "negativeKeywords": [
    "被截胡"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.liuqin.zisun",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "liuqin",
   "displayZh": "子孙",
   "classicalTerm": "子孙爻",
   "professionalDef": "六亲之一，我生者为子孙。取象子女门徒、下属僧道、医药娱乐、六畜财源，为解忧之神。子孙能克官鬼，占疾病、避祸、脱讼喜其旺相；占功名求官则子孙为碍，旺则职位难成。子孙又能生妻财，为财之源。",
   "evidenceQuote": "《卜筮正宗》六亲章：我生者，为子孙。",
   "semanticLibrary": "我生者子孙：为解忧喜悦之神，能克官鬼；占疾病药医、占平安以子孙为福神。",
   "translations": {
    "zh": "这一格代表能让你松一口气的东西：孩子、学生、下属、宠物，也包括医生、药、假期、爱好和玩乐。它有力，说明烦心事有出口，病痛能缓、纠纷能消、心情能松下来，做内容、做服务、带团队都容易出成绩，还能顺带把钱生出来。但它旺的时候会顶掉升官那条线，想求职位、求名分的人反而不占便宜。可以做的事：最近焦虑或者身体不舒服，就优先安排休息、检查和一件让自己高兴的小事；正在谋求晋升，就要收一收玩心，把精力放回正事上。"
   },
   "positiveKeywords": [
    "解忧",
    "生财之源",
    "轻松自在"
   ],
   "cautionKeywords": [
    "妨碍升迁",
    "贪玩误事",
    "散漫"
   ],
   "negativeKeywords": [
    "名分难成"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.liushen.baihu",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "liushen",
   "displayZh": "白虎",
   "classicalTerm": "白虎",
   "professionalDef": "属金居西。取象刚猛争斗、跌撞伤损、丧服疾患、迅疾果决。临吉爻则威令得行、果断建功、宜决断裁汰之事；临凶爻则纠纷激烈、意外磕碰、家中长者有事相扰。",
   "evidenceQuote": "《卜筮正宗》六神章：白虎，西方之金神，主凶丧伤损疾患。",
   "semanticLibrary": "六神之一属金：主刚猛争斗、跌打伤损、丧服疾患；宜决断裁汰，忌临病爻。",
   "translations": {
    "zh": "这个标记代表硬碰硬：动作大、速度快、有冲击力，也容易磕碰或者把关系撕破。它落得好，是雷厉风行、敢下狠手做取舍，适合处理那种拖了很久必须一刀切的事。落得不好，就是话说重了、手上磕着了、和人当场闹僵。这里只讲倾向，不对任何人的身体状况下判断。可以做的事：这段时间开车、运动、用刀具都慢一点；和人起冲突先离开现场十分钟再回来说话；家里长辈的事多问一句，别等消息找上门。"
   },
   "positiveKeywords": [
    "果断",
    "执行力强",
    "敢做取舍"
   ],
   "cautionKeywords": [
    "冲突激烈",
    "磕碰留意",
    "言语过重"
   ],
   "negativeKeywords": [
    "关系撕破"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.liushen.gouchen",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "liushen",
   "displayZh": "勾陈",
   "classicalTerm": "勾陈",
   "professionalDef": "属土居中。取象田土房产、迟滞牵连、旧事积案、勾连不清。临吉爻则田宅可得、根基稳固、积久成功；临凶爻则事久不决、旧债缠身、一事牵出一事。",
   "evidenceQuote": "《卜筮正宗》六神章：勾陈，中央之土神，主田土迟滞牵连。",
   "semanticLibrary": "六神之一属土：主田土房产、迟滞牵连；临世则事缓，临用神则根基稳固或积案纠缠。",
   "translations": {
    "zh": "这个标记代表慢和粘：跟土地、房子、老物件、陈年旧账有关，也代表事情推不动、一件事拖出另一件事。它落得好，是根基扎实、稳扎稳打能攒下东西，适合置业、修缮、做那种需要熬时间的活。落得不好，就是被卡在流程里，审批不下来、旧账被翻出来、说好的事一拖再拖。可以做的事：把手上拖着的事按卡在谁那里分类，能自己解决的今天做完，卡在别人那里的定个时间点当面催一次，不要只发消息干等回复。"
   },
   "positiveKeywords": [
    "根基稳",
    "田宅",
    "积久见效"
   ],
   "cautionKeywords": [
    "迟滞",
    "牵连旧事",
    "流程卡壳"
   ],
   "negativeKeywords": [
    "久拖不决"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.liushen.qinglong",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "liushen",
   "displayZh": "青龙",
   "classicalTerm": "青龙",
   "professionalDef": "六神之首，属木居东。取象喜庆婚娶、酒食宴乐、贵人提携、文采风流。临吉爻则事有喜色、得体面之助；临凶爻则乐极生忧、酒色伤身、虚耗于交际排场。",
   "evidenceQuote": "《卜筮正宗》六神章：青龙，东方之木神，主喜庆喜事。",
   "semanticLibrary": "六神之一属木：主喜庆婚娶、贵人提携；临吉爻添喜色，临凶爻亦减其凶。",
   "translations": {
    "zh": "这个标记代表体面和喜气：办喜事、请客吃饭、遇到愿意提携你的人，做事有派头、有人缘。它落在好位置上，说明这段时间适合谈婚论嫁、公开露面、请人吃饭把关系走近一步。落在不好的位置上，就是喝多了误事、场面撑得太大、为面子花了不该花的钱。可以做的事：把预算里的人情开销单独列一栏，该花的大方花，超出的坚决停；重要的事尽量约在饭桌之外谈，酒后不做决定。"
   },
   "positiveKeywords": [
    "喜庆",
    "贵人",
    "人缘好"
   ],
   "cautionKeywords": [
    "排场过大",
    "酒色误事",
    "面子开销"
   ],
   "negativeKeywords": [
    "虚耗"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.liushen.tengshe",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "liushen",
   "displayZh": "螣蛇",
   "classicalTerm": "螣蛇",
   "professionalDef": "属土居中。取象虚惊怪异、缠绕反复、梦寐心神、疑虑不宁。临吉爻则虚惊而无实害、事有奇遇；临凶爻则疑云丛生、事态盘曲反复、心绪难安。",
   "evidenceQuote": "《卜筮正宗》六神章：螣蛇，中央之土神，主虚惊怪异缠绕。",
   "semanticLibrary": "六神之一属土：主虚惊怪异、梦寐疑虑；临之多为缠绕不宁，然虚惊多无实害。",
   "translations": {
    "zh": "这个标记代表心里发毛：说不清缘由的不安、反复做的怪梦、总觉得哪里不对劲，还有那种绕来绕去、变来变去、抓不住实底的事。它出现，多半不是真出了大事，而是信息不全把人吓着了，或者对方话说得含糊。可以做的事：把让你不安的那件事写下来，分成我确切知道的和我只是猜的两栏，你会发现多数恐慌都落在第二栏。然后只针对第一栏去核实一次，睡前少刷手机，情绪会稳很多。"
   },
   "positiveKeywords": [
    "直觉敏锐",
    "察觉异常",
    "虚惊无实害"
   ],
   "cautionKeywords": [
    "疑神疑鬼",
    "反复无常",
    "睡不安稳"
   ],
   "negativeKeywords": [
    "自己吓自己"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.liushen.xuanwu",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "liushen",
   "displayZh": "玄武",
   "classicalTerm": "玄武",
   "professionalDef": "属水居北。取象盗贼暗昧、私情隐匿、欺瞒诈伪、暗中损耗。临吉爻则谋略深沉、暗处得利、宜密而不宜张；临凶爻则失窃受骗、隐私外泄、暗有第三方牵扯。",
   "evidenceQuote": "《卜筮正宗》六神章：玄武，北方之水神，主盗贼暗昧私情。",
   "semanticLibrary": "六神之一属水：主盗贼暗昧、欺瞒隐匿；临财爻防失窃，临世爻谋事宜密。",
   "translations": {
    "zh": "这个标记代表看不见的那一面：私下进行的事、没摆到台面上的关系、悄悄流走的钱，也包括别人对你有所隐瞒。它落得好，是你懂得低调行事、在暗处布局，适合谈那些还不宜公开的合作。落得不好，就是被骗、被顺走东西、隐私被人知道，或者感情里冒出第三方的影子。可以做的事：这段时间把账户密码换一遍，扫码付款和陌生链接多看两眼；重要的口头承诺补一份书面记录；有疑问直接摊开问，别靠猜。"
   },
   "positiveKeywords": [
    "低调",
    "谋略",
    "暗处得利"
   ],
   "cautionKeywords": [
    "被隐瞒",
    "财物暗耗",
    "隐私外泄"
   ],
   "negativeKeywords": [
    "受骗"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.liushen.zhuque",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "liushen",
   "displayZh": "朱雀",
   "classicalTerm": "朱雀",
   "professionalDef": "属火居南。取象口舌言语、文书信息、词讼是非、文章消息。临吉爻则喜讯传来、文章得意、辩才见用；临凶爻则争吵诽谤、书契生瑕、词讼缠身。",
   "evidenceQuote": "《卜筮正宗》六神章：朱雀，南方之火神，主口舌文书信息。",
   "semanticLibrary": "六神之一属火：主口舌言语、文书消息；旺则文章得意，动则多口舌是非。",
   "translations": {
    "zh": "这个标记代表话和字：消息、通知、评论、合同上的条款、聊天框里的一段话。它落得好，说明会有好消息传来，写材料、做宣传、面试答辩容易出彩。落得不好，就是嘴上惹祸，一句话被截图、一条评论引来争吵、一份文件漏了个字惹出纠纷。可以做的事：这几天说话慢半拍，重要的话先打字存成草稿再发；合同和邮件发出去之前，逐条核对数字和日期。能不争的先不争，争赢了也是亏。"
   },
   "positiveKeywords": [
    "消息灵通",
    "表达出彩",
    "文书顺利"
   ],
   "cautionKeywords": [
    "口角",
    "失言",
    "文件疏漏"
   ],
   "negativeKeywords": [
    "流言"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.quyong.yongshen",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "quyong",
   "displayZh": "用神",
   "classicalTerm": "用神",
   "professionalDef": "所占之事在卦中的取象核心，即一卦之太极点。占父母尊长取父母爻，占钱财买卖取妻财爻，占功名词讼取官鬼爻，占子女疾患取子孙爻，占同辈竞争取兄弟爻。取定之后，观其旺衰、动静、空破、生克，方能定成败缓急；取错则全盘皆错。",
   "evidenceQuote": "《增删卜易》用神章：占何事，先取何爻为用神，而后观其旺衰动静。",
   "semanticLibrary": "用神为一卦太极点：占父母取父母爻、占财取妻财爻、占功名取官鬼爻，用神定而后断卦有主。",
   "translations": {
    "zh": "这是问卦最要紧的第一步：先确定这一次到底该盯着哪一处看。就像去医院要先挂对科室，问的是钱，就盯着代表钱的那一格；问的是考试，就盯着代表证书文书的那一格；问孩子，就盯着代表孩子的那一格。盯错了地方，后面推得再细也是白推。可以做的事：开口之前把问题写成一句完整的话，比如我想知道下个月这笔尾款能不能收到，这比问我最近运气怎么样强一百倍。问题越具体，答案越有用。"
   },
   "positiveKeywords": [
    "聚焦",
    "问题清晰",
    "有的放矢"
   ],
   "cautionKeywords": [
    "取错方向",
    "问题笼统",
    "一次问太多"
   ],
   "negativeKeywords": [
    "全盘跑偏"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.shiying.shi",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "shiying",
   "displayZh": "世爻",
   "classicalTerm": "世爻",
   "professionalDef": "卦中所立之爻，为问卜者自身或己方一造的立足处。观其旺衰、动静、空破，以断己方的处境、意愿与能力。世旺相则己方有力可为，世休囚则力有不逮，世空则心意未定或本无诚心，世动则己方先有变意。",
   "evidenceQuote": "《卜筮正宗》世应章：世者，自己也；应者，他人也。",
   "semanticLibrary": "世为己方立足处：观世爻旺衰动静空破断己方处境与能力，世应生合则事易成。",
   "translations": {
    "zh": "这一爻代表你这一边：你的处境、你的意愿、你手上有多少牌。它稳，说明你心里有数、进退自如，可以按自己的节奏推进；它虚，说明你其实还没想好，或者手上资源不够，这时候急着表态、急着签字容易吃亏。可以做的事：先诚实回答三个问题，我真的想要吗、我现在能拿出什么、如果对方不答应我怎么办。三个都答得上来再去谈；答不上来，就先别开口。"
   },
   "positiveKeywords": [
    "己方有力",
    "心中有数",
    "掌握节奏"
   ],
   "cautionKeywords": [
    "心意未定",
    "力有不逮",
    "急于表态"
   ],
   "negativeKeywords": [
    "虚张声势"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "liuyao.shiying.ying",
   "system": "liuyao",
   "systemCn": "六爻",
   "category": "term",
   "termGroup": "shiying",
   "displayZh": "应爻",
   "classicalTerm": "应爻",
   "professionalDef": "与世爻相对之爻，代表对方、他人、外部环境与所求之事的外缘。世应相生相合则彼此有意、易于成交；相克相冲则各怀异心、勉强难合。应爻空破则对方无心或事无着落，应动则外境先变。",
   "evidenceQuote": "《卜筮正宗》世应章：应者，他人也；世应相合则人和。",
   "semanticLibrary": "应为对方与外缘：世应相生相合彼此有意，相克相冲彼此相左，事之成败可由世应关系察之。",
   "translations": {
    "zh": "这一爻代表对面那一边：谈判对手、客户、面试官、你想追的那个人，或者你控制不了的大环境。它和你这边关系融洽，说明对方也有意愿，事情谈得拢；两边顶着来，说明各打各的算盘，勉强凑合也长不了。可以做的事：别只盘算自己想要什么，花十分钟站到对方位置上想一遍，他图什么、他怕什么、他有没有权限拍板。想不出来就直接问；问不出来，说明时机还没到，不如先等。"
   },
   "positiveKeywords": [
    "对方有意",
    "外缘配合",
    "谈得拢"
   ],
   "cautionKeywords": [
    "各怀心思",
    "对方敷衍",
    "外部变数"
   ],
   "negativeKeywords": [
    "无心应付"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "meihua.bagua.dui",
   "system": "meihua",
   "systemCn": "梅花易数",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "兑",
   "classicalTerm": "兑卦",
   "professionalDef": "先天卦数二，属金，居西，象泽。万物类象为少女、口舌、羊、金刃、缺损破口之物、沼泽井泉、乐器食物，其色白，其时秋。于体用生克中为悦、为毁折，断事宜取言语、饮食、损缺之象。",
   "evidenceQuote": "《梅花易数》八卦数：兑二；《说卦传》：兑，说也。",
   "semanticLibrary": "先天卦数二，属金居西象泽：类象少女、口舌、羊、金刃，主喜悦言谈。",
   "translations": {
    "zh": "兑这一页写的是缺了一块、跟嘴有关：豁口的杯子、坏了一角的东西、水塘水井、羊、刀具、乐器和吃食，人物上对应年轻女孩和话多的人。占到它，答案常常和说出来的话或者某处缺口连着，找东西往西边和水边找，事情多半是谁一句话引起的，时间往秋天和傍晚算。可以做的事：现场先扫一眼有没有破口、裂缝、水池这类东西，有就往那儿追；同时把最近谁跟你说过什么反常的话回想一遍。"
   },
   "positiveKeywords": [
    "善言",
    "愉悦",
    "人际热络"
   ],
   "cautionKeywords": [
    "口舌",
    "破损",
    "只图开心"
   ],
   "negativeKeywords": [
    "言语伤人"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "meihua.bagua.gen",
   "system": "meihua",
   "systemCn": "梅花易数",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "艮",
   "classicalTerm": "艮卦",
   "professionalDef": "先天卦数七，属土，居东北，象山。万物类象为少男、手指、狗、山石土丘、门阙墙垣、果蓏、坟墓，其色黄，其时冬春之交。于体用生克中为止、为阻，断事宜取阻隔、静止、山土之象。",
   "evidenceQuote": "《梅花易数》八卦数：艮七；《说卦传》：艮，止也。",
   "semanticLibrary": "先天卦数七，属土居东北象山：类象少男、手指、山石、门阙，主静止阻守。",
   "translations": {
    "zh": "艮这一页写的是不动、挡着、堆起来的：山、石头、墙、门、台阶、坟地、摆着的水果，人物上对应小儿子和守店看门的人，身上对应手和后背。占到它，多半是卡住了，找东西往东北方、墙角、柜子边和高处堆放的地方找，时间往冬末春初算。可以做的事：别急着推，先确认挡路的是什么、是谁；很多时候只要一个签字、一把钥匙、一句准话，堵点就通了。"
   },
   "positiveKeywords": [
    "稳固",
    "守得住",
    "知止"
   ],
   "cautionKeywords": [
    "阻滞",
    "闭塞",
    "进展缓慢"
   ],
   "negativeKeywords": [
    "卡死"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "meihua.bagua.kan",
   "system": "meihua",
   "systemCn": "梅花易数",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "坎",
   "classicalTerm": "坎卦",
   "professionalDef": "先天卦数六，属水，居北，象水。万物类象为中男、耳、豕、江河沟渎、酒醋盐水、带核之物、弓轮、隐伏之处，其色黑，其时冬。于体用生克中为陷、为险，断事宜取水事、隐伏、险难之象。",
   "evidenceQuote": "《梅花易数》八卦数：坎六；《说卦传》：坎，陷也。",
   "semanticLibrary": "先天卦数六，属水居北象水：类象中男、耳、江河、隐伏，主险难智谋。",
   "translations": {
    "zh": "坎这一页写的是跟水有关、带黑色、藏在里面：河沟、下水道、酒瓶饮料、带核的果子、轮子、耳朵，人物上对应中间那个儿子和做水产、做酒水的人。占到它，事情常常藏着一层看不见的部分，找东西往北边、低处、有水的地方找，时间往冬天和深夜算。可以做的事：先假设还有一层情况没人告诉你，把已知的和听说的分开列；涉及水边、酒局、夜路的安排都放慢一点，别赶。"
   },
   "positiveKeywords": [
    "深沉",
    "耐得住",
    "暗中有机"
   ],
   "cautionKeywords": [
    "隐情未明",
    "险处",
    "耗神"
   ],
   "negativeKeywords": [
    "陷落"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "meihua.bagua.kun",
   "system": "meihua",
   "systemCn": "梅花易数",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "坤",
   "classicalTerm": "坤卦",
   "professionalDef": "先天卦数八，属土，居西南，象地。万物类象为母、腹、牛、布帛舆釜、五谷田野、众多之物、方形柔顺之器，其色黄黑，其时夏秋之交。于体用生克中为顺、为众，断事宜取土地、群众、承载之象。",
   "evidenceQuote": "《梅花易数》八卦数：坤八；《说卦传》：坤，顺也。",
   "semanticLibrary": "先天卦数八，属土居西南象地：类象母、腹、牛、田野，主承载柔顺。",
   "translations": {
    "zh": "坤这一页写的是平的、多的、能装东西的：土地、田野、布料、袋子、锅、粮食、一大群人，人物上对应母亲、上了年纪的女性和做后勤的人，身上对应肚子。占到它，事情多半跟数量多和承接有关，找东西往西南方、平地、储物间和布袋里找，时间往夏末秋初和下午算。可以做的事：这类事一个人办不成，先想清楚要把哪一部分交给谁；同时清点一下手上囤着没用的东西，答案往往就在里面。"
   },
   "positiveKeywords": [
    "承载",
    "众人相助",
    "厚实"
   ],
   "cautionKeywords": [
    "迟缓",
    "过于顺从",
    "杂而多"
   ],
   "negativeKeywords": [
    "无人拍板"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "meihua.bagua.li",
   "system": "meihua",
   "systemCn": "梅花易数",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "离",
   "classicalTerm": "离卦",
   "professionalDef": "先天卦数三，属火，居南，象火。万物类象为中女、目、雉、甲胄戈兵、炉灶窑冶、文书图籍、干燥中空之物，其色赤，其时夏。于体用生克中为丽、为明，断事宜取光明、文书、炉火之象。",
   "evidenceQuote": "《梅花易数》八卦数：离三；《说卦传》：离，丽也。",
   "semanticLibrary": "先天卦数三，属火居南象火：类象中女、目、文书、炉灶，主光明文明。",
   "translations": {
    "zh": "离这一页写的是发光发热、中间是空的：灯、火、炉子、屏幕、证件文书、眼睛、红色的东西。占到它，线索就往这几样上找，丢的东西可能在南边、靠近电器或者灶台的地方，问人往中年女性或者做文字、做设计的人身上想，时间往夏天和正午算。可以做的事：在现场先找亮的那一处和热的那一处；如果问的是事情能不能成，就看它有没有摆到明面上，藏着掖着的通常成不了。"
   },
   "positiveKeywords": [
    "明朗",
    "文书凭证",
    "被看见"
   ],
   "cautionKeywords": [
    "中空不实",
    "急躁",
    "耐力不足"
   ],
   "negativeKeywords": [
    "虚火"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "meihua.bagua.qian",
   "system": "meihua",
   "systemCn": "梅花易数",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "乾",
   "classicalTerm": "乾卦",
   "professionalDef": "先天卦数一，属金，居西北，象天。万物类象为君父尊长、首、马、金玉圆物、寒冰、镜镜之属，其色白，其时秋冬之交。于体用生克中为刚健之气，断事宜取尊贵、开创、圆器、高远之象。",
   "evidenceQuote": "《梅花易数》八卦数：乾一；《说卦传》：乾，健也。",
   "semanticLibrary": "先天卦数一，属金居西北象天：类象君父尊长、首、马、金玉，主刚健决断。",
   "translations": {
    "zh": "在这一派里，每个卦都是一本看图识物的小册子，乾这一页写的是又硬又圆又贵重：天空、金属、玉器、车轮、钟表、单位里说了算的那位、父亲、脑袋。占到它，就顺着这几样去找答案，丢东西往西北方向和高处找，问人往年长男性身上想，问时间往秋冬和下午偏晚算。可以做的事：把卦象当线索用，先在现场找出对应得上的实物或人，再回头验证判断准不准，这比背一堆吉凶断语管用得多。"
   },
   "positiveKeywords": [
    "尊长可依",
    "开创",
    "贵重之物"
   ],
   "cautionKeywords": [
    "过于强硬",
    "不容商量",
    "劳心"
   ],
   "negativeKeywords": [
    "孤高"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "meihua.bagua.xun",
   "system": "meihua",
   "systemCn": "梅花易数",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "巽",
   "classicalTerm": "巽卦",
   "professionalDef": "先天卦数五，属木，居东南，象风。万物类象为长女、股、鸡、绳直、草木花卉、香气、往来舟车、长而柔之物，其色青白，其时春夏之交。于体用生克中为入、为不果，断事宜取风声、往来、交易之象。",
   "evidenceQuote": "《梅花易数》八卦数：巽五；《说卦传》：巽，入也。",
   "semanticLibrary": "先天卦数五，属木居东南象风：类象长女、股、鸡、草木，主柔顺渗透。",
   "translations": {
    "zh": "巽这一页写的是细长、能钻缝、会飘：风、绳子、电线、草木花卉、香味、来回跑的快递和车，人物上对应家里的大女儿和做中介、跑业务的人。占到它，事情多半跟传有关，消息是传过来的、东西是被风吹走的、路是中间人牵的。找东西往东南方、缝隙里和高处找，时间往春末夏初和上午算。可以做的事：顺着是谁传给你的这条线往回查一层，源头常常就在那里；同时留意有没有说好了又反悔的情况。"
   },
   "positiveKeywords": [
    "消息通达",
    "善于渗透",
    "往来顺畅"
   ],
   "cautionKeywords": [
    "飘忽",
    "反悔",
    "拖泥带水"
   ],
   "negativeKeywords": [
    "无定见"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "meihua.bagua.zhen",
   "system": "meihua",
   "systemCn": "梅花易数",
   "category": "term",
   "termGroup": "bagua",
   "displayZh": "震",
   "classicalTerm": "震卦",
   "professionalDef": "先天卦数四，属木，居东，象雷。万物类象为长男、足、龙、竹木、大涂、鼓乐钟铃、蕃鲜之物，其色青碧，其时春。于体用生克中为动、为决躁，断事宜取惊动、声响、突发之象。",
   "evidenceQuote": "《梅花易数》八卦数：震四；《说卦传》：震，动也。",
   "semanticLibrary": "先天卦数四，属木居东象雷：类象长男、足、龙、鼓乐，主奋发行动。",
   "translations": {
    "zh": "震这一页写的是会响、会动、细细长长的：雷声、音响、乐器、竹子树木、大马路、脚和腿，人物上对应家里的大儿子和年轻好动的人。占到它，多半有个突发的动静，找东西往东边、路边、有声音的地方找，事情往往由一个电话或者一次意外触发，时间往春天和清晨算。可以做的事：回想最近三天有什么突然响起来、突然动起来的事，起因常常就在那儿；判断成败时看它有没有真的动起来，只在嘴上说的不算。"
   },
   "positiveKeywords": [
    "起势",
    "行动",
    "消息突至"
   ],
   "cautionKeywords": [
    "突发",
    "浮躁",
    "后继乏力"
   ],
   "negativeKeywords": [
    "虚惊"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "meihua.qigua.fangfa",
   "system": "meihua",
   "systemCn": "梅花易数",
   "category": "term",
   "termGroup": "qigua",
   "displayZh": "起卦法",
   "classicalTerm": "起卦法",
   "professionalDef": "不拘蓍龟钱币，凡耳目所触之数皆可成卦。以数起卦者，先得之数除八取余为上卦，后得之数除八取余为下卦，两数相加除六取余为动爻，余零则取满数。以时起卦者，年月日数相加除八为上卦，再加时辰数除八为下卦，总数除六定动爻。要在心念专一，一事一占。",
   "evidenceQuote": "《梅花易数》：以数起卦，先得之数除八取余为上卦，后得之数为下卦。",
   "semanticLibrary": "耳目所触之数皆可成卦：数除八取余定上下卦，加时数取动爻，凡动皆可占。",
   "translations": {
    "zh": "这一派最大的特点是随手就能问：不用铜钱不用蓍草，眼前碰到的任何数字都能拿来用，电话号码、车牌、门牌、几点几分、报纸上一行有几个字都行。做法很简单，拿一个数按八来除看余几，就对上其中一象；再拿一个数同样处理，配成上下两半；两数相加按八改按六来除，就知道哪一处会变动。关键不在算得多快，而在起念那一刻要专心，一件事只问一次。可以做的事：问之前先把问题在心里说完整，随手取一次数就定下来，别嫌结果不合心意反复重取，重取出来的答案没有参考价值。"
   },
   "positiveKeywords": [
    "随处可起",
    "简便",
    "贵在专心"
   ],
   "cautionKeywords": [
    "心念散乱",
    "反复重占",
    "取数随意"
   ],
   "negativeKeywords": [
    "一事多占"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "meihua.tiyong.biangua",
   "system": "meihua",
   "systemCn": "梅花易数",
   "category": "term",
   "termGroup": "tiyong",
   "displayZh": "变卦",
   "classicalTerm": "变卦",
   "professionalDef": "由动爻阴阳互易所成之卦，表事情的最终趋向与结局。变卦生体则终得善果，克体则收尾不利；亦可据变卦所属之象与其数，推断应期迟速与最终情状。断卦须以体为主轴，合观用、互、变三者，取多数生克定吉凶。",
   "evidenceQuote": "《梅花易数》：变卦者，以动爻变而得之，以占事之终应。",
   "semanticLibrary": "动爻阴阳互易所成，表最终趋向：变卦生体终得善果，克体收尾不利。",
   "translations": {
    "zh": "这一层看的是最后会走到哪：事情兜兜转转之后的落点。它对你有利，说明现在再难，收尾是好的，值得咬牙撑过去；它对你不利，说明眼下看着顺，后面会翻盘，不如早点调整方向或者见好就收。可以做的事：把现在的感觉和最后的落点分开看，别被开头的顺利或者挫折带着走。给自己设一个复盘的日子，到那天用事实核对一次，而不是凭当时的情绪下判断。"
   },
   "positiveKeywords": [
    "善终",
    "趋势向好",
    "值得坚持"
   ],
   "cautionKeywords": [
    "后期反转",
    "见好要收",
    "落点不佳"
   ],
   "negativeKeywords": [
    "虎头蛇尾"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "meihua.tiyong.hugua",
   "system": "meihua",
   "systemCn": "梅花易数",
   "category": "term",
   "termGroup": "tiyong",
   "displayZh": "互卦",
   "classicalTerm": "互卦",
   "professionalDef": "取本卦第二、三、四爻组成下互，第三、四、五爻组成上互，合成互卦，表事情发展的中段过程与内里隐情。互卦生体则中途得助、暗有转机；互卦克体则过程生变、有人从中作梗或另有未明之情。",
   "evidenceQuote": "《梅花易数》互卦法：取本卦二三四爻为下互，三四五爻为上互。",
   "semanticLibrary": "互卦表事情发展的中段与内里隐情：与体用参看，可察过程之吉凶转折。",
   "translations": {
    "zh": "这一层看的是中间那一段：事情从开头走到结果之间会经历什么，以及有没有还没摆到台面上的内情。它对你有利，说明过程中会冒出帮手、会有转机，撑一撑就过去了；它对你不利，说明中途要出岔子，可能是有人从中作梗，也可能是你自己没料到的麻烦。可以做的事：别只盯着结果，把这件事的中间环节列成三到五步，逐步想一遍这一步最可能卡在哪，再给最危险的那一步准备一个备选方案。"
   },
   "positiveKeywords": [
    "中途得助",
    "暗中转机",
    "过程可控"
   ],
   "cautionKeywords": [
    "中段生变",
    "另有隐情",
    "有人掣肘"
   ],
   "negativeKeywords": [
    "半途生阻"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "meihua.tiyong.ti",
   "system": "meihua",
   "systemCn": "梅花易数",
   "category": "term",
   "termGroup": "tiyong",
   "displayZh": "体卦",
   "classicalTerm": "体卦",
   "professionalDef": "一卦分上下二经卦，无动爻之一卦为体，代表求测者自身或所问之事的本体。断法以体为我，观其旺衰及与用卦、互卦、变卦之间的生克：体受生比则事顺，体被克泄则事难。体宜旺，宜得生扶，忌重重受克。",
   "evidenceQuote": "《梅花易数》体用总诀：以体卦为其自己，以用卦为应事。",
   "semanticLibrary": "无动爻之经卦为体，代表求测者本体：断法以体为我，观其旺衰与用卦生克。",
   "translations": {
    "zh": "每一卦拆成上下两半，其中不动的那一半代表你自己这一边：你的身体、你的处境、你手上的本钱。判断好坏的办法很直白，看另外几半是在给你添力气，还是在抽你的力气。添力气的多，事情往好走；抽力气的多，就算场面热闹，最后也是你吃亏。可以做的事：先老实评估自己现在有多少精力、多少钱、多少时间，再看这件事是让你越做越有劲，还是越做越掏空。掏空的那种，再诱人也要减量。"
   },
   "positiveKeywords": [
    "自身有力",
    "得助",
    "根基稳"
   ],
   "cautionKeywords": [
    "被消耗",
    "力量不足",
    "勉强支撑"
   ],
   "negativeKeywords": [
    "透支"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "meihua.tiyong.yong",
   "system": "meihua",
   "systemCn": "梅花易数",
   "category": "term",
   "termGroup": "tiyong",
   "displayZh": "用卦",
   "classicalTerm": "用卦",
   "professionalDef": "含动爻之一卦为用，代表所求之事、所对之人或外部情境。用生体则事来就我，用克体则外来相逼，体克用则我能制彼、事在掌握，体生用则耗己以成人，体用比和则彼此相安、其事易谐。",
   "evidenceQuote": "《梅花易数》体用总诀：以用卦为应事；用生体则事吉，用克体则事艰。",
   "semanticLibrary": "含动爻之经卦为用，代表所求之事与外境：用生体事来就我，体克用我能制事。",
   "translations": {
    "zh": "另外那一半会动的，代表事情本身和对面的人：客户、对手、你想办成的那件事。它和你这边的关系无非四种，它给你送好处，也就是事情自己找上门；它压着你，也就是对方强势、条件苛刻；你压得住它，也就是你说了算、事情办得成；你倒贴它，也就是成全了别人累坏了自己。可以做的事：把这四种对号入座一次，如果发现自己长期落在倒贴那一格，就该重新谈条件或者收手，别用勤奋掩盖亏损。"
   },
   "positiveKeywords": [
    "外缘有利",
    "事在掌握",
    "彼此相安"
   ],
   "cautionKeywords": [
    "对方强势",
    "条件苛刻",
    "白白付出"
   ],
   "negativeKeywords": [
    "得不偿失"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "draft"
  },
  {
   "archetypeKey": "qimen.men.du",
   "system": "qimen",
   "systemCn": "奇门遁甲",
   "category": "term",
   "termGroup": "bamen",
   "displayZh": "杜门",
   "professionalDef": "八门之一，属木，居东南。为平门偏凶，主闭塞、隐藏、保密、滞留、不通。利潜藏、避祸、防守、研发；忌出行、求见、开放之事。旺则密谋成，衰则路堵心塞。",
   "translations": {
    "zh": "这一格代表“适合关起门来做事”的时期。它出现时，保密、沉淀、打磨方案比抛头露面更对路，公开露脸或贸然推进容易卡住。你可以做的是：把想法的细节先捂一阵，埋头把东西做扎实；需要躲开是非就低调一点，等这阵子过了再亮相。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qimen.men.jing",
   "system": "qimen",
   "systemCn": "奇门遁甲",
   "category": "term",
   "termGroup": "bamen",
   "displayZh": "景门",
   "professionalDef": "八门之一，属火，居南方。为中平门，主文书、信息、计划、宴乐、虚花。利献策、考试、广告、文书往来；忌争讼、远行。旺则文章显达，衰则浮言无实。",
   "translations": {
    "zh": "这一格代表“适合写和说”的窗口。它强的时候，写方案、做汇报、发内容、考试都比较顺，靠表达拿分。你可以做的是：把要讲清楚的稿子、PPT、文案趁这时候定稿；但别把它当成行动信号，它偏“说得好听”，落地的事要另找时机。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qimen.men.jingx",
   "system": "qimen",
   "systemCn": "奇门遁甲",
   "category": "term",
   "termGroup": "bamen",
   "displayZh": "惊门",
   "professionalDef": "八门之一，属金，居西方。为凶门，主惊恐、疑惧、词讼、 noise、口舌。利抓盗、诉讼、镇压；忌修造、出行、安睡。旺则惊扰多，衰则虚惊一场。",
   "translations": {
    "zh": "这一格代表“容易受惊、被吵、起口舌”的时段。它出现时，突发消息和人际摩擦会变多，也容易自己吓自己。你可以做的是：重要消息先核实再反应，别在群里秒回情绪；把合同和承诺看两遍再签；睡前少刷容易让你焦虑的信息。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qimen.men.kai",
   "system": "qimen",
   "systemCn": "奇门遁甲",
   "category": "term",
   "termGroup": "bamen",
   "displayZh": "开门",
   "professionalDef": "八门之一，属金，居西北。为大吉之门，主开创、通达、公门、事业、出行、谋为皆利。利求官、开业、出兵、远行、公开之事。旺则百事亨通，衰则虚张。",
   "translations": {
    "zh": "这一格代表“适合开门红”的时机。它强的时候，启动项目、公开亮相、跑手续、找领导签字都顺，是少有的“只管冲”的窗口。你可以做的是：把最重要的启动动作排到这几天——发产品、见关键人、交材料；趁势头在，别犹豫。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qimen.men.shang",
   "system": "qimen",
   "systemCn": "奇门遁甲",
   "category": "term",
   "termGroup": "bamen",
   "displayZh": "伤门",
   "professionalDef": "八门之一，属木，居东方。为凶门，主损伤、争斗、官司、车祸、疾病、破财。利捕盗、索债、医病（以毒攻毒）；忌嫁娶、出行、修造。旺则争讼起，衰则暗损。",
   "translations": {
    "zh": "这一格提醒你“容易磕碰吵架”的阶段。它出现时，开车、签字、与人较劲都要格外小心，也容易为钱或面子起冲突。你可以做的是：把重要的合同留到别的时段签；这几天少开快车、少在气头上做决定；真有纠纷，走正规渠道解决比硬刚更稳。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qimen.men.sheng",
   "system": "qimen",
   "systemCn": "奇门遁甲",
   "category": "term",
   "termGroup": "bamen",
   "displayZh": "生门",
   "professionalDef": "八门之一，属土，居东北。为大吉之门，主生育、生发、钱财、田宅、营建、利润。利求财、开业、置产、治病、出行。旺相则生机勃发，失陷则虚花不实。",
   "translations": {
    "zh": "这一格代表“适合搞钱和开张”的窗口。它强的时候，谈生意、开店、买房、推进能带来收入的事都比较顺。你可以做的是：把压了很久的报价、合作、签约提到这几天落地；想换工作或找新机会，也趁这股劲去推，别等它过去。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qimen.men.si",
   "system": "qimen",
   "systemCn": "奇门遁甲",
   "category": "term",
   "termGroup": "bamen",
   "displayZh": "死门",
   "professionalDef": "八门之一，属土，居西南。为大凶之门，主死亡、停滞、终结、丧失、坟茔。利安葬、决断了结旧事；忌求财、嫁娶、出行、开业。旺则事结，衰则困顿难舒。",
   "translations": {
    "zh": "这一格代表“适合画句号”的阶段。它出现时不适合开新局，但很适合把拖着的不了了之的事彻底了结——清账、断舍离、结束一段关系或项目。你可以做的是：列一张“该收尾”的清单，趁这时候一件件关掉；新计划先压住，别在此时启动。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qimen.men.xiu",
   "system": "qimen",
   "systemCn": "奇门遁甲",
   "category": "term",
   "termGroup": "bamen",
   "displayZh": "休门",
   "professionalDef": "八门之首，属水，居北方。为吉门，主休息、安养、退守、宴乐、人事和合。利出行、访友、疗养、缓和谈判；忌兴兵与急速进取。旺相则百事安宁，失陷则虚浮无功。",
   "translations": {
    "zh": "这一格代表“可以歇口气”的时机。它出现时适合把节奏放慢：养精神、陪家人、把悬着的事缓和地处理，不适合硬冲或挑起冲突。你可以做的是：把本周最耗神的一件事往后排，先处理能让你回血的小事；和人聊僵了就先冷一冷，过两天再谈往往更顺。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qimen.shen.bashen",
   "system": "qimen",
   "systemCn": "奇门遁甲",
   "category": "term",
   "termGroup": "bashen",
   "displayZh": "八神",
   "professionalDef": "值符、螣蛇、太阴、六合、白虎、玄武、九地、九天八神，随遁盘游走。神主隐微情态：值符至尊，六合和合，九天扬升，九地潜藏，玄武盗欺，白虎凶伤。",
   "translations": {
    "zh": "这八位是“背后的气氛和人心”。有的代表贵人撑腰、合作顺溜，有的代表藏着的小人、欺骗或突发凶险。你可以做的是：谈合作前感受下对方是不是真心；遇到“九地”类信号就别张扬，闷声做事；遇到“白虎”类信号，重大决定多留个心眼。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qimen.star.jiuxing",
   "system": "qimen",
   "systemCn": "奇门遁甲",
   "category": "term",
   "termGroup": "jiuxing",
   "displayZh": "九星",
   "professionalDef": "天蓬、天芮、天冲、天辅、天禽、天心、天柱、天任、天英九星，随局飞布。星主天时气运：天辅文雅，天英燥烈，天芮病星，天蓬险陷，天心吉医。星门相生则吉。",
   "translations": {
    "zh": "这九颗是“大环境的气候”。有的气候适合读书静心，有的适合冲劲干事，有的容易带来小病小灾或冒险冲动。你可以做的是：看当前气候对你要做的事是助力还是添乱，顺势安排——气候不对就别硬上，把节奏错开。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qimen.yiji.liuyi",
   "system": "qimen",
   "systemCn": "奇门遁甲",
   "category": "term",
   "termGroup": "yiji",
   "displayZh": "六仪",
   "professionalDef": "戊、己、庚、辛、壬、癸六天干为六仪，为阵体之骨干。戊主财库，己主私欲陷阱，庚主阻隔刑伤，辛主错误罪愆，壬主流动变化，癸主阴匿污浊。六仪逢庚多阻。",
   "translations": {
    "zh": "这六个是“底盘条件”。它们告诉你这件事的地基稳不稳：有的代表钱和本钱，有的代表坑和阻碍，有的代表变动和说不清的麻烦。你可以做的是：推进前先看清哪一个是当前的“地雷”——比如遇到阻隔就别硬闯，遇到变动就留好退路。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qimen.yiji.sanqi",
   "system": "qimen",
   "systemCn": "奇门遁甲",
   "category": "term",
   "termGroup": "yiji",
   "displayZh": "三奇",
   "professionalDef": "乙、丙、丁三日干为三奇。乙为日奇，主柔进、文书、女性；丙为月奇，主威严、光明、迅速；丁为星奇，主精灵、敏捷、秘密成事。三奇得使为吉，最利谋为。",
   "translations": {
    "zh": "这三样代表“手里好使的牌”。简单说，它们出现说明你有巧妙的办法把事办成：乙适合以柔克刚、走文书和人际；丙适合快速亮出来、占场面；丁适合悄悄把细节搞定。你可以做的是：遇到卡点，别硬碰，看看能不能换种更巧的方式绕过去。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qizheng.grid.gong",
   "system": "qizheng",
   "systemCn": "七政四余",
   "category": "term",
   "termGroup": "gong",
   "displayZh": "十二宫",
   "professionalDef": "命、财、兄弟、田宅、男女、奴仆、妻妾、疾厄、迁移、官禄、福德、相貌十二宫，为星曜栖所与人事分野。星落何宫染其职。",
   "translations": {
    "zh": "十二宫是“人生的十二个房间”：命、财、家、子女、健康、事业、关系等等。每颗星住进不同房间，管的事就不同。你可以把它当成：同一股能量，放在“事业房”还是“家庭房”，含义完全两样——看宫位才懂星怎么用。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qizheng.yu.jidu",
   "system": "qizheng",
   "systemCn": "七政四余",
   "category": "term",
   "termGroup": "yu",
   "displayZh": "计都（土余）",
   "professionalDef": "四余之一，月南交点，主孤克、隐疾、旧业、消散。计都旺则悟僻，凶则耗散无依。",
   "translations": {
    "zh": "计都代表“消散和看破”。它强，你对名利没那么执着，容易通哲理，但也可能疏离、身体小耗。你可以做的是：适合断舍离、收尾旧账、做减法；别在它旺时强求黏人的结果。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qizheng.yu.luohou",
   "system": "qizheng",
   "systemCn": "七政四余",
   "category": "term",
   "termGroup": "yu",
   "displayZh": "罗睺（火余）",
   "professionalDef": "四余之一，月北交点，主偏激、嗜欲、突发、异路。罗睺旺则奇才出，凶则颠倒招灾。",
   "translations": {
    "zh": "罗睺代表“上头和偏门”。它强，你容易对冷门、刺激、一夜成的事上头，也可能突然走运；但也容易迷失、成瘾。你可以做的是：新鲜机会先小注试水，凡让你“停不下来”的东西，先设限度。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qizheng.yu.yuebi",
   "system": "qizheng",
   "systemCn": "七政四余",
   "category": "term",
   "termGroup": "yu",
   "displayZh": "月孛",
   "professionalDef": "四余之一，主偏情、暗昧、桃花、隐私之扰。月孛旺则情偏，凶则秽乱。",
   "translations": {
    "zh": "月孛代表“暗昧的情和麻烦”。它出现，容易有说不清的桃花、隐私纠纷或心里发腻的事。你可以做的是：感情和金钱往来留清楚痕迹，含糊的承诺先打问号；别让暗线把正事拖垮。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qizheng.yu.ziqi",
   "system": "qizheng",
   "systemCn": "七政四余",
   "category": "term",
   "termGroup": "yu",
   "displayZh": "紫气",
   "professionalDef": "四余之一，主清贵、灵慧、虚恬、福德之余。紫气旺则心清得助，凶则虚浮。",
   "translations": {
    "zh": "紫气代表“清静的贵气”。它好，你心思干净、容易得暗中助力、适合修心和文化类的事。你可以做的是：把需要沉淀、创作、提升气质的事排到它旺时；少掺和喧嚣的争斗。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qizheng.zheng.huoxing",
   "system": "qizheng",
   "systemCn": "七政四余",
   "category": "term",
   "termGroup": "zheng",
   "displayZh": "火星",
   "professionalDef": "七政之一，主礼、急、兵、血光、暴烈。火星得用则敢为，失制则灾疾争斗。",
   "translations": {
    "zh": "火星是“火气和冲劲”。它强，你行动猛、不怕硬，但也容易发火、磕碰、起冲突。你可以做的是：把这股劲引到健身、赶工、解决硬茬上；跟人对话先压三秒，别让脾气替你拍板。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qizheng.zheng.jinxing",
   "system": "qizheng",
   "systemCn": "七政四余",
   "category": "term",
   "termGroup": "zheng",
   "displayZh": "金星（太白）",
   "professionalDef": "七政之一，主礼、义、兵戈、威勇、妻财。金星得地则果决有成，失度则刚暴。",
   "translations": {
    "zh": "金星代表“魄力和锋芒”。它强，你敢争、有威、办事利落；过旺，容易刚硬伤人、起冲突。你可以做的是：把需要强势推进、谈判、定规矩的事交给它；但留意语气，别把人怼翻。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qizheng.zheng.muxing",
   "system": "qizheng",
   "systemCn": "七政四余",
   "category": "term",
   "termGroup": "zheng",
   "displayZh": "木星（岁星）",
   "professionalDef": "七政之一，主仁、寿、文、生养、福德。木星庙旺则慈和通达、多吉庆；留逆则虚浮。",
   "translations": {
    "zh": "木星是“温和的福星”。它好，你包容、人缘好、做事有后劲，也利学习和养生。你可以做的是：把需要长期经营的关系、学业、健康习惯放到它旺时启动，细水长流最受益。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qizheng.zheng.ri",
   "system": "qizheng",
   "systemCn": "七政四余",
   "category": "term",
   "termGroup": "zheng",
   "displayZh": "日（太阳）",
   "professionalDef": "七政之首，君主之象，主尊贵、声名、父、官禄、光明。太阳庙旺则显达，失躔则晦。为命盘之枢。",
   "translations": {
    "zh": "太阳代表“你的名号和被看见的程度”。它强，你容易有身份感、被认可、走正道出头；它弱，容易没存在感、被埋没。你可以做的是：把要露脸、要争名分的事往前推，别躲在后面。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qizheng.zheng.shuixing",
   "system": "qizheng",
   "systemCn": "七政四余",
   "category": "term",
   "termGroup": "zheng",
   "displayZh": "水星",
   "professionalDef": "七政之一，主智、谋、辩、商、巧艺。水星得地则聪敏善变，失度则浮滑无根。",
   "translations": {
    "zh": "水星管“机灵和表达”。它好，你点子多、嘴皮子利、适合做需要脑子和沟通的事；它乱，容易小聪明、说话不实、算漏。你可以做的是：它旺时谈方案、做交易；但重要数字多核对，别被自己的嘴带偏。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qizheng.zheng.tuxing",
   "system": "qizheng",
   "systemCn": "七政四余",
   "category": "term",
   "termGroup": "zheng",
   "displayZh": "土星",
   "professionalDef": "七政之一，主信、迟、重、阻隔、田宅。土星得位则稳健有成，失陷则迟滞困顿。",
   "translations": {
    "zh": "土星是“慢和压实”。它过境，事情常卡、来得晚，但根基能打牢。你可以做的是：别求快，把目标拆成每天能做的一小步，咬牙坚持；它最奖励“熬得住、做得实”的人。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "qizheng.zheng.yue",
   "system": "qizheng",
   "systemCn": "七政四余",
   "category": "term",
   "termGroup": "zheng",
   "displayZh": "月（太阴）",
   "professionalDef": "七政之一，后妃之象，主母、妻、情绪、潜识、财富之库。月清则心安得荫，月浊则情扰。",
   "translations": {
    "zh": "月亮管“情绪和内在安全感”。它顺，你温和、招人亲近、直觉准；它乱，容易敏感起伏、夜里多思。你可以做的是：它弱时别做情绪化决定，先睡好、先独处，等心定再议事。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "taiyi.ju.dingju",
   "system": "taiyi",
   "systemCn": "太乙神数",
   "category": "term",
   "termGroup": "ju",
   "displayZh": "定局",
   "professionalDef": "依积年、求太乙巡行以立阴阳遁局，分七十二局或若干局。局定而后布神将、起算。定局为推演之基。",
   "translations": {
    "zh": "定局就是“先把盘摆对”。就像下棋前先把棋子按规则摆好，摆错了后面全错。你可以理解成：做任何推演或计划，第一步是把前提和条件理清，别跳步。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "taiyi.ju.yinyang",
   "system": "taiyi",
   "systemCn": "太乙神数",
   "category": "term",
   "termGroup": "ju",
   "displayZh": "阴阳遁",
   "professionalDef": "阳遁自坎顺行，阴遁自离逆行，随节气更移。阴阳遁别寒暑、升降、显隐之不同气机。",
   "translations": {
    "zh": "阴阳遁是两套不同的排列方向，随节气切换，代表“气机在升还是在降”。简单说，它区分现在是扩张期还是收敛期。你可以借此判断：当下适合往前冲（阳），还是先收着养（阴）。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "taiyi.li.bamen",
   "system": "taiyi",
   "systemCn": "太乙神数",
   "category": "term",
   "termGroup": "li",
   "displayZh": "八门",
   "professionalDef": "太乙八门（开休生伤杜景死惊）随局飞布，主人事出入之宜。开门、休门、生门为三吉，余各有宜忌。",
   "translations": {
    "zh": "八门是八种“行动建议”，有的门说适合开创，有的说适合休息，有的说别动。你可以把它当成一张行动宜忌表：今天这扇门开了，就做对应那类事，别逆着来。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "taiyi.li.sancai",
   "system": "taiyi",
   "systemCn": "太乙神数",
   "category": "term",
   "termGroup": "li",
   "displayZh": "三才",
   "professionalDef": "天、地、人三才，太乙占天时、奇门占地利、六壬占人事，三式各有所主而互补。三才合观则全局乃备。",
   "translations": {
    "zh": "三才指“天、地、人”三个层面。古人认为不同术数各管一层：有的看大环境时机，有的看空间地利，有的看人和事。你可以借鉴：做大事同时看趋势（天）、条件（地）、关系（人），别只看一面。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "taiyi.shen.jishen",
   "system": "taiyi",
   "systemCn": "太乙神数",
   "category": "term",
   "termGroup": "shen",
   "displayZh": "计神",
   "professionalDef": "太乙五将之一，主计谋、算度、机密、畴划。计神加临则谋事有方、算无遗策；失位则谋乖。",
   "translations": {
    "zh": "计神管“算计和谋略”。它旺，你做计划、算账、布策略特别清楚，适合下棋式地想三步。你可以做的是：把需要精密盘算的大事（报价、布局、排兵）放到它旺时，少出昏招。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "taiyi.shen.shiji",
   "system": "taiyi",
   "systemCn": "太乙神数",
   "category": "term",
   "termGroup": "shen",
   "displayZh": "始击",
   "professionalDef": "太乙五将之一，主兵革、击伐、变动、突发。始击加临多主事有冲击、须应机而动；安静则潜。",
   "translations": {
    "zh": "始击代表“冲击和突发”。它出现，事情容易被外部力量撞一下——突发变动、冲突、不得不反击。你可以做的是：预留缓冲，别把日程排太满；真撞上了，快速反应比犹豫强。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "taiyi.shen.taiyi",
   "system": "taiyi",
   "systemCn": "太乙神数",
   "category": "term",
   "termGroup": "shen",
   "displayZh": "太乙",
   "professionalDef": "太乙神数为三式之一，以太乙为元首，统五将、十六神、阴阳遁局以占天时人事。太乙本身象北辰居中，主运会枢机。",
   "translations": {
    "zh": "太乙是一种古老的推演术，把“太乙”当成核心的那颗星，用来排布一整套格局看大趋势。你可以把它理解为：它关心的是“大势和时机”，不是算你今天丢没丢钥匙。看个宏观走向就好，别拿它微观算命。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "taiyi.shen.wenchang",
   "system": "taiyi",
   "systemCn": "太乙神数",
   "category": "term",
   "termGroup": "shen",
   "displayZh": "文昌",
   "professionalDef": "太乙五将之一，主文运、谋议、辞令、科举。文昌加临则文书显达，谋为可成；受制则言路塞。",
   "translations": {
    "zh": "文昌管“文字和谋略”。它旺的时候，写材料、考试、出主意、谈判都顺，靠脑子拿分。你可以做的是：把要动笔、要答辩、要出方案的事排到它旺时，效率明显高。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "taiyi.shen.wujiang",
   "system": "taiyi",
   "systemCn": "太乙神数",
   "category": "term",
   "termGroup": "shen",
   "displayZh": "五将",
   "professionalDef": "太乙、文昌、始击、主客算将等合称五将，分主客、动静、文伐。五将加临之方定事之主客胜负与吉凶。",
   "translations": {
    "zh": "五将是这套推演里的五个关键角色，分别管“我方、对方、文书、发动、结果”这类面向。看它们落在哪边，就能大概判断一件事谁占上风。你可以类比谈判：看清桌上几股力量各自站哪边。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "taiyi.suan.ke",
   "system": "taiyi",
   "systemCn": "太乙神数",
   "category": "term",
   "termGroup": "suan",
   "displayZh": "客算",
   "professionalDef": "由客算所得之数，主彼、动、外之事。与主算参看，定主客之胜负、动静之宜。",
   "translations": {
    "zh": "客算代表“对方、外部、动态”那面的数字。把它和主算对照，就能看出是该主动出击还是防守。你可以当成：先看外面风向，再决定自己是冲还是等。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "taiyi.suan.zhu",
   "system": "taiyi",
   "systemCn": "太乙神数",
   "category": "term",
   "termGroup": "suan",
   "displayZh": "主算",
   "professionalDef": "由太乙局中主算所得之数，主我在、静、内之事。数之奇偶阴阳定动静，奇偶分主客，长短分远近。",
   "translations": {
    "zh": "主算代表“我方、内部、静态”这一面的数字走向。它吉，说明你按兵不动、守住基本盘更稳；它凶，说明内部有虚，先稳住自己再谈别的。可以当成：先盘点自家底牌。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "taiyi.xian.duke",
   "system": "taiyi",
   "systemCn": "太乙神数",
   "category": "term",
   "termGroup": "xian",
   "displayZh": "杜塞",
   "professionalDef": "太乙局中主客二目皆塞、无门可出之谓，主闭塞不通、谋为受阻、事宜守不宜攻。杜塞之局须待时可解。",
   "translations": {
    "zh": "杜塞是“前后都堵死”的局。它出现，说明这事暂时没有顺畅的出口，硬闯只会撞墙。你可以做的是：先停下来，别在死胡同里耗；等时机松动（换个窗口、换个路径）再动，比硬顶明智。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "tarot.major.emperor",
   "system": "tarot",
   "systemCn": "塔罗",
   "category": "term",
   "termGroup": "major",
   "displayZh": "皇帝（4号）",
   "professionalDef": "大阿尔卡纳四，象秩序、权威、结构、父权、掌控。正位主建章立制、掌局；逆位主专断、失控。为“把事立住”的框架。",
   "translations": {
    "zh": "这张牌代表“该立规矩了”。它出现，说明事情需要从散乱变成有结构——定目标、排流程、划边界。你可以做的是：把一团乱的事拆成清单和截止日，该拍板就拍板；但别变成控制狂，给别人留点余地。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "tarot.major.empress",
   "system": "tarot",
   "systemCn": "塔罗",
   "category": "term",
   "termGroup": "major",
   "displayZh": "皇后（3号）",
   "professionalDef": "大阿尔卡纳三，象丰饶、孕育、母性、感官、创造力。正位主生发、收获、关系润；逆位主停滞、过度纵容。为“万物生长”之母。",
   "translations": {
    "zh": "这张牌是“滋养和结果”。它出现，代表你播下的东西开始长，关系、项目、身体都适合好好养。你可以做的是：对自己和在意的人温柔点，给计划浇浇水、施施肥；也别光付出，记得收下别人的好意。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "tarot.major.fool",
   "system": "tarot",
   "systemCn": "塔罗",
   "category": "term",
   "termGroup": "major",
   "displayZh": "愚人（0号）",
   "professionalDef": "大阿尔卡纳之首，象纯真、启程、未知、自由、跃险。正位主新开始、无畏；逆位主鲁莽、漂泊无依。为灵魂之旅的出发点。",
   "translations": {
    "zh": "这张牌是“说走就走的新起点”。它出现，代表一段还没谱但充满可能的新旅程要开始了。你可以做的是：别等万事俱备才迈步，先容许自己笨拙地开头；但出发前至少想清楚“最坏能怎样”，免去真鲁莽。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "tarot.major.lovers",
   "system": "tarot",
   "systemCn": "塔罗",
   "category": "term",
   "termGroup": "major",
   "displayZh": "恋人（6号）",
   "professionalDef": "大阿尔卡纳六，象结合、抉择、价值观、亲密。正位主两情相悦、关键选择；逆位主失衡、错配、逃避决定。为“心之所向”的岔路。",
   "translations": {
    "zh": "这张牌是“做选择、定关系”。它出现，往往逼你在两条路里挑一条，尤其是关乎心和价值观的。你可以做的是：别拖，把选项写清楚，问自己“哪个更靠近真正想要的”；选了就别反复回头比。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "tarot.major.magician",
   "system": "tarot",
   "systemCn": "塔罗",
   "category": "term",
   "termGroup": "major",
   "displayZh": "魔术师（1号）",
   "professionalDef": "大阿尔卡纳一，象意志、显化、资源统合、沟通。正位主能耐足、事可成；逆位主投机、才能错用。为“心想事成”的发动者。",
   "translations": {
    "zh": "这张牌告诉你“手里牌其实够用了”。它出现，说明你现有的资源、技能、人脉足够把事做成，差的是去整合和行动。你可以做的是：把散着的本事和关系列一张表，挑一个目标，今天就开始拼，别再等“更好的条件”。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "tarot.major.priestess",
   "system": "tarot",
   "systemCn": "塔罗",
   "category": "term",
   "termGroup": "major",
   "displayZh": "女祭司（2号）",
   "professionalDef": "大阿尔卡纳二，象直觉、潜识、秘藏、阴柔之智。正位主静观、内明；逆位主压抑、误信表象。为“未说出口的真相”。",
   "translations": {
    "zh": "这张牌提醒你“答案在心里，不在外面”。它出现，适合暂停、内省、相信直觉，而不是到处问人。你可以做的是：给自己一段不被打扰的时间，把纠结的事放空，往往答案会自己浮上来；别被表面热闹带偏。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "tarot.major.star",
   "system": "tarot",
   "systemCn": "塔罗",
   "category": "term",
   "termGroup": "major",
   "displayZh": "星星（17号）",
   "professionalDef": "大阿尔卡纳十七，象希望、疗愈、指引、宁静的信心。正位主黯夜见光、复苏；逆位主失望、迷向。为“熬过后的光”。",
   "translations": {
    "zh": "这张牌是“撑过去就有光”。它出现，说明最难那段快过去了，希望和复原正在回来。你可以做的是：给自己一点温柔的期待，做件能让你心静的小事；别因为前面黑过就怀疑前面会亮。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "tarot.major.strength",
   "system": "tarot",
   "systemCn": "塔罗",
   "category": "term",
   "termGroup": "major",
   "displayZh": "力量（8号）",
   "professionalDef": "大阿尔卡纳八，象柔刚并济、勇气、自制、内化之能。正位主以柔克刚、稳操；逆位主怯懦、失控。为“不靠蛮力的强”。",
   "translations": {
    "zh": "这张牌说“真正的强是稳住自己”。它出现，代表你能用耐心和分寸搞定难搞的人或事，而不是比谁声音大。你可以做的是：遇到挑衅先不急着赢，用温和但坚定的方式把局面收住；对自己也别太狠。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "tarot.major.wheel",
   "system": "tarot",
   "systemCn": "塔罗",
   "category": "term",
   "termGroup": "major",
   "displayZh": "命运之轮（10号）",
   "professionalDef": "大阿尔卡纳十，象流转、周期、机遇、无常。正位主时来运转；逆位主下滑、失控。为“盛衰有时”之轮。",
   "translations": {
    "zh": "这张牌提醒你“潮起潮落很正常”。它出现，代表一段运势在转，可能向上也可能向下，关键在于接住变化。你可以做的是：好运时趁势收成果，坏运时别硬顶、先保底；记住没有一种状态会一直不变。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "tarot.major.world",
   "system": "tarot",
   "systemCn": "塔罗",
   "category": "term",
   "termGroup": "major",
   "displayZh": "世界（21号）",
   "professionalDef": "大阿尔卡纳终，象圆满、完成、归环、通达。正位主一程功成、境界圆熟；逆位主未尽、滞留。为“旅程之果”。",
   "translations": {
    "zh": "这张牌是“这一程圆满了”。它出现，代表一个阶段真正收尾、可以毕业了。你可以做的是：认真给自己一个句号——复盘、庆祝、归档，然后轻装走向下一程；别老赖在已完成的事上。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "tarot.suit.cups",
   "system": "tarot",
   "systemCn": "塔罗",
   "category": "term",
   "termGroup": "suit",
   "displayZh": "圣杯（水）",
   "professionalDef": "小阿尔卡纳四组之一，属水，主情感、关系、爱、直觉、内在满足。圣杯盈则情洽，亏则失落。",
   "translations": {
    "zh": "圣杯这组牌讲“心和感受”。它出现多，说明你近况被关系、情绪、爱恨牵动。你可以做的是：认真照顾重要的人，也诚实面对自己的感受；杯空了就别硬撑，找人聊聊或给自己一点温柔。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "tarot.suit.wands",
   "system": "tarot",
   "systemCn": "塔罗",
   "category": "term",
   "termGroup": "suit",
   "displayZh": "权杖（火）",
   "professionalDef": "小阿尔卡纳四组之一，属火，主行动、热情、创意、冲劲、事业动能。权杖旺则事兴，弱则倦怠散漫。",
   "translations": {
    "zh": "权杖这组牌讲“行动和热情”。它出现多，说明你最近的能量在“做”上——点火、冲、搞创作、拼事业。你可以做的是：把想法赶紧变成动作，别光想；但火太旺时也记得收一收，免得烧过头。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "vedic.angsha.lagna",
   "system": "vedic",
   "systemCn": "吠陀占星",
   "category": "term",
   "termGroup": "angsha",
   "displayZh": "上升点（拉格纳）",
   "professionalDef": "东方地平升起的黄道度，为命盘之轴、一身之体、 temperament 之根。诸宫诸星皆依此立。升点星座定命主星，统摄全盘格局。",
   "translations": {
    "zh": "上升点相当于“你给外界的第一印象和这辈子的底色”。它定调你这盘棋怎么摆。你可以把它理解为：别人初见你时的感觉，以及你习惯性的应对方式——了解它，比盯单颗星更能看清自己。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "vedic.angsha.rashi",
   "system": "vedic",
   "systemCn": "吠陀占星",
   "category": "term",
   "termGroup": "angsha",
   "displayZh": "黄道十二宫（罗睺字）",
   "professionalDef": "白羊至双鱼十二宿，每宿三十度，为星曜运行之场。各宫有自性：白羊勇、金牛稳、双子变、巨蟹情等。星落宫则染其性。",
   "translations": {
    "zh": "十二宫是“十二种场景和性格底色”。每颗星落到不同宫，就像演员进了不同布景，表现不一样。你可以把它当成：同一股能量，放在“事业场”和“家庭场”里，呈现完全不同——理解宫位才懂星怎么用。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "vedic.graha.budha",
   "system": "vedic",
   "systemCn": "吠陀占星",
   "category": "term",
   "termGroup": "graha",
   "displayZh": "水星（布达）",
   "professionalDef": "水为智慧、辩才、商业、文书、少年之星。吉则聪敏善谋、利交易学问；受克则口舌、欺诈、思维紊乱。随伴吉星则贵，伴凶则贬。",
   "translations": {
    "zh": "这一颗管“脑子转得快不快”。它好，你表达、算账、谈合同都灵；它乱，容易说错话、算漏账、被小谎绕进去。你可以做的是：把要动脑和动嘴的事排到它旺时；签数字相关的东西多看两遍，别信太顺的嘴。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "vedic.graha.chandra",
   "system": "vedic",
   "systemCn": "吠陀占星",
   "category": "term",
   "termGroup": "graha",
   "displayZh": "月亮（昌德拉）",
   "professionalDef": "月为心意之星，主母、情绪、滋养、公众、水。吉则心境安和、得母荫、受众人喜；受克则情绪浮动、母病、心不安。月之盈亏象运势起伏。",
   "translations": {
    "zh": "这一颗管“心情和直觉”。它顺的时候你更稳、更招人亲近；它乱的时候容易敏感、想太多、夜里睡不踏实。你可以做的是：情绪上来的事别急着定，先照顾好身体和睡眠；想不清就放一放，过两天直觉会清楚些。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "vedic.graha.guru",
   "system": "vedic",
   "systemCn": "吠陀占星",
   "category": "term",
   "termGroup": "graha",
   "displayZh": "木星（古鲁）",
   "professionalDef": "木为 Guru、智慧、福德、子嗣、财富、宗教之星，最吉之曜。吉则得师荫、名望、子息、财福；受克则失教、耗福、虚妄。为增益之根。",
   "translations": {
    "zh": "这一颗是“福气和贵人运”。它强，容易遇到好老师、好机会，小孩和钱财也顺。你可以做的是：想学东西、找导师、做长期投资，趁这时候下手；也多帮带后辈，木星讲究“给出去才回来”。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "vedic.graha.ketu",
   "system": "vedic",
   "systemCn": "吠陀占星",
   "category": "term",
   "termGroup": "node",
   "displayZh": "计都（南交点）",
   "professionalDef": "月南交点，虚星，主解脱、灵性、孤立、旧业、神秘、身伤。吉则悟性深、通玄；凶则离散、疑病、无依。其性如火而隐。",
   "translations": {
    "zh": "这一颗代表“放下和看破”。它强，你对名利没那么执着，反而容易通灵性、想通透，但也可能疏离、孤独、身体小伤不断。你可以做的是：适合做断舍离、冥想、收尾旧账；别在它旺时强求黏人的关系。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "vedic.graha.mangala",
   "system": "vedic",
   "systemCn": "吠陀占星",
   "category": "term",
   "termGroup": "graha",
   "displayZh": "火星（曼伽罗）",
   "professionalDef": "火为勇武、兄弟、兵刃、土地、血光之星。吉则果敢有执行力；受克则暴烈、争斗、血光、兄弟失和。庙旺则建功，陷落则招灾。",
   "translations": {
    "zh": "这一颗是“冲劲和脾气”。它强，你干活猛、敢拼，但也容易上火动手；它过旺，容易跟人起冲突、磕碰受伤。你可以做的是：把这股劲用到健身、赶工期、解决硬骨头上；跟人交谈时先数三秒，别让火气替你说话。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "vedic.graha.rahu",
   "system": "vedic",
   "systemCn": "吠陀占星",
   "category": "term",
   "termGroup": "node",
   "displayZh": "罗睺（北交点）",
   "professionalDef": "月北交点，虚星，主野心、妄想、外道、突发、成瘾、异域。吉则出奇制胜、名噪；凶则颠倒迷乱、横祸。其性如土而猛。",
   "translations": {
    "zh": "这一颗代表“越界和上头”。它强，你容易对冷门、刺激、一夜爆红的事上头，也可能突然走运；但也容易迷失、成瘾、被虚妄带跑。你可以做的是：新鲜机会先小注试，别 all in；凡让你“停不下来”的东西，先设个限度。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "vedic.graha.shani",
   "system": "vedic",
   "systemCn": "吠陀占星",
   "category": "term",
   "termGroup": "graha",
   "displayZh": "土星（沙尼）",
   "professionalDef": "土为业障、迟慢、劳苦、老、贱、铁石之星。吉则坚忍有成、持重；受克则阻滞、贫病、孤迟。其运缓而实，为磨炼之师。",
   "translations": {
    "zh": "这一颗是“慢和考”。它过境时，事情常卡、来得晚、要靠硬扛，但也逼你长结实。你可以做的是：别跟它较劲求快，把大目标拆成每天能做的一小步，咬牙坚持；它最奖励“熬得住”的人。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "vedic.graha.shukra",
   "system": "vedic",
   "systemCn": "吠陀占星",
   "category": "term",
   "termGroup": "graha",
   "displayZh": "金星（舒克拉）",
   "professionalDef": "金为爱欲、婚姻、艺术、享乐、财物之星。吉则人缘好、婚姻美、才艺显；受克则情变、奢靡、财散。为世间欢喜之因。",
   "translations": {
    "zh": "这一颗管“魅力和关系”。它好，你更招人喜欢，谈恋爱、搞审美、做需要人缘的事都顺。你可以做的是：把约会、社交、展示审美（穿搭、设计、作品）排到它旺时；但也别为面子乱花钱。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "vedic.graha.surya",
   "system": "vedic",
   "systemCn": "吠陀占星",
   "category": "term",
   "termGroup": "graha",
   "displayZh": "太阳（苏利耶）",
   "professionalDef": "新月宿中太阳为灵魂与权威之星，主自我、父、王、目、火性。吉则声名显达、有领导力；受克则体弱、父缘薄、权威受损。为诸星之君。",
   "translations": {
    "zh": "这一颗代表“你是谁、你说了算不算”。它强的时候，你更有主见、敢担当，也容易被看见；它弱的时候，容易没底气、被上级压着。你可以做的是：把要拿主意的事往前推，主动担一桩能体现你能力的事，比等别人安排更提气。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "vedic.time.dasha",
   "system": "vedic",
   "systemCn": "吠陀占星",
   "category": "term",
   "termGroup": "time",
   "displayZh": "大运周期（达沙）",
   "professionalDef": "以月宿定本命主运（Mahadasha），依次流转诸星之期，每期长短固定。运星吉凶统摄该时段休咎，为吠陀 Timing 之核心。",
   "translations": {
    "zh": "达沙是“你这几年归哪颗星管”的时间表。就像换班主任，不同的星当家，几年的主题完全不同——有的年头旺事业，有的年头适合沉淀。你可以做的是：先看清当下归谁管，顺势安排大事的节奏，别在“休养期”硬冲、在“行动期”躺平。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.aspect.conjunction",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "aspect",
   "displayZh": "合相",
   "classicalTerm": "",
   "professionalDef": "两能量合而为一、彼此强化。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "这两块特质拧在一起、互相放大，像叠了一套——重点加倍，好坏都更明显。"
   },
   "positiveKeywords": [
    "强化",
    "聚焦"
   ],
   "cautionKeywords": [
    "执拗"
   ],
   "negativeKeywords": [
    "过犹不及"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.aspect.opposition",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "aspect",
   "displayZh": "冲",
   "classicalTerm": "",
   "professionalDef": "对立、投射与需平衡的张力。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "这两块像镜子、容易在别人身上看到另一面——学会平衡，而非对抗。"
   },
   "positiveKeywords": [
    "平衡",
    "映照",
    "互补"
   ],
   "cautionKeywords": [
    "对立"
   ],
   "negativeKeywords": [
    "两极摇摆"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.aspect.sextile",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "aspect",
   "displayZh": "六合",
   "classicalTerm": "",
   "professionalDef": "温和助益、易发挥的机会相位。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "这两处顺手、稍微用心就有好处——轻松的助力，别浪费。"
   },
   "positiveKeywords": [
    "助力",
    "机会",
    "顺手"
   ],
   "cautionKeywords": [
    "懈怠"
   ],
   "negativeKeywords": [
    "错过"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.aspect.square",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "aspect",
   "displayZh": "刑",
   "classicalTerm": "",
   "professionalDef": "紧张、拉扯与需化解的内在冲突。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "这两块较劲、容易卡——不是坏事，是提醒你调节、别硬顶。"
   },
   "positiveKeywords": [
    "张力",
    "动力",
    "课题"
   ],
   "cautionKeywords": [
    "内耗"
   ],
   "negativeKeywords": [
    "钻牛角尖"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.aspect.trine",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "aspect",
   "displayZh": "三合",
   "classicalTerm": "",
   "professionalDef": "流畅、天赋与自然的和谐。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "这两处顺、像天生会——你的舒服区也是天赋区，善用它。"
   },
   "positiveKeywords": [
    "流畅",
    "天赋",
    "和谐"
   ],
   "cautionKeywords": [
    "懒散"
   ],
   "negativeKeywords": [
    "坐享其成"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.axis.asc",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "axis",
   "displayZh": "上升点",
   "classicalTerm": "",
   "professionalDef": "人格面具、外在表现与第一印象。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "别人初见你时的感觉、你自动呈现的样子——社交里的「门面」与启动方式。"
   },
   "positiveKeywords": [
    "外在",
    "第一印象",
    "面具"
   ],
   "cautionKeywords": [
    "伪装"
   ],
   "negativeKeywords": [
    "表里不一"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.axis.east_point",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "axis",
   "displayZh": "东点",
   "classicalTerm": "",
   "professionalDef": "自我表达与行动风格的显性接口。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你主动出击时的样子、怎么「启动」一件事——对外行动的第一反应。"
   },
   "positiveKeywords": [
    "启动",
    "表达",
    "行动"
   ],
   "cautionKeywords": [
    "急躁"
   ],
   "negativeKeywords": [
    "冒进"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.axis.mc",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "axis",
   "displayZh": "天顶（中天）",
   "classicalTerm": "",
   "professionalDef": "社会成就、事业方向与公众形象。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你在外头「成了什么」、事业怎么被看见——公众眼中的你与职业主线。"
   },
   "positiveKeywords": [
    "事业",
    "公众",
    "成就"
   ],
   "cautionKeywords": [
    "功利"
   ],
   "negativeKeywords": [
    "唯名是图"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.axis.vertex",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "axis",
   "displayZh": "宿命点",
   "classicalTerm": "",
   "professionalDef": "命运感强烈、似被推动的关键领域。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "某些缘分像「注定」遇上的人事——不主导你，只是提醒你留意那些强烈的相遇。"
   },
   "positiveKeywords": [
    "缘份",
    "推动",
    "关键"
   ],
   "cautionKeywords": [
    "被动"
   ],
   "negativeKeywords": [
    "宿命论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.body.chiron",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "body",
   "displayZh": "凯龙星",
   "classicalTerm": "",
   "professionalDef": "疗愈、伤口与化痛为慧之处。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你哪里带着老伤、却最能理解别人同样的痛——把伤变成助人的本事。"
   },
   "positiveKeywords": [
    "疗愈",
    "共情",
    "转化"
   ],
   "cautionKeywords": [
    "旧伤"
   ],
   "negativeKeywords": [
    "沉溺伤痛"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.body.jupiter",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "body",
   "displayZh": "木星",
   "classicalTerm": "",
   "professionalDef": "扩张、信念、机遇与意义感。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你往哪方面容易「走运」、信什么、哪里能长大——扩张、乐观与意义感的领域。"
   },
   "positiveKeywords": [
    "扩展",
    "信念",
    "机遇"
   ],
   "cautionKeywords": [
    "过度"
   ],
   "negativeKeywords": [
    "盲目乐观"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.body.mars",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "body",
   "displayZh": "火星",
   "classicalTerm": "",
   "professionalDef": "行动、欲望、驱动力与冲突能量。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你怎么争取、怎么吵架、干劲往哪使——你的「发动机」和脾气所在。"
   },
   "positiveKeywords": [
    "行动",
    "驱动力",
    "斗志"
   ],
   "cautionKeywords": [
    "冲动"
   ],
   "negativeKeywords": [
    "攻击"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.body.mean_node",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "body",
   "displayZh": "北交点（平均）",
   "classicalTerm": "",
   "professionalDef": "进化方向、此生该前往的功课轴线。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你这辈子值得往哪走、学什么——成长的前方，不是宿命，是建议方向。"
   },
   "positiveKeywords": [
    "成长",
    "方向",
    "进化"
   ],
   "cautionKeywords": [
    "盲从"
   ],
   "negativeKeywords": [
    "宿命论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.body.mercury",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "body",
   "displayZh": "水星",
   "classicalTerm": "",
   "professionalDef": "思维、沟通、学习与信息处理的模式。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你怎么想、怎么说话、怎么学——脑子转的方式和表达习惯，是交流的底色。"
   },
   "positiveKeywords": [
    "思维",
    "沟通",
    "学习"
   ],
   "cautionKeywords": [
    "多思"
   ],
   "negativeKeywords": [
    "碎嘴"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.body.moon",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "body",
   "displayZh": "月亮",
   "classicalTerm": "",
   "professionalDef": "情绪、潜意识、内在安全感与原生家庭的印记。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你私下怎么消化情绪、什么让你有安全感，是别人不太看得见的「里子」。"
   },
   "positiveKeywords": [
    "情绪",
    "安全感",
    "直觉"
   ],
   "cautionKeywords": [
    "情绪化"
   ],
   "negativeKeywords": [
    "逃避"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.body.neptune",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "body",
   "displayZh": "海王星",
   "classicalTerm": "",
   "professionalDef": "消融、想象、灵性与模糊地带。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你哪方面容易理想化、分不清边界、有艺术或逃避倾向——梦、灵感和迷糊的地方。"
   },
   "positiveKeywords": [
    "想象",
    "灵性",
    "包容"
   ],
   "cautionKeywords": [
    "迷糊"
   ],
   "negativeKeywords": [
    "逃避现实"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.body.pluto",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "body",
   "displayZh": "冥王星",
   "classicalTerm": "",
   "professionalDef": "深层转化、权力、执念与重生。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你哪方面有「非改不可」的执念、经历大起大落式的重生——深刻但剧烈。"
   },
   "positiveKeywords": [
    "转化",
    "深度",
    "重生"
   ],
   "cautionKeywords": [
    "执念"
   ],
   "negativeKeywords": [
    "控制"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.body.saturn",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "body",
   "displayZh": "土星",
   "classicalTerm": "",
   "professionalDef": "结构、责任、限制与长期功课。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你哪里要「扛」、哪里有门槛、什么得慢慢磨——责任、纪律与成熟的领域。"
   },
   "positiveKeywords": [
    "责任",
    "结构",
    "沉淀"
   ],
   "cautionKeywords": [
    "压抑"
   ],
   "negativeKeywords": [
    "固步"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.body.sun",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "body",
   "displayZh": "太阳",
   "classicalTerm": "",
   "professionalDef": "自我、生命力的核心，意志与身份的显化之所。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是谁、你要什么、你往外发光的方式——像性格里的「主轴」，别的行星都绕着它转。"
   },
   "positiveKeywords": [
    "自我",
    "意志",
    "身份"
   ],
   "cautionKeywords": [
    "自我中心"
   ],
   "negativeKeywords": [
    "独断"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.body.true_node",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "body",
   "displayZh": "北交点（真）",
   "classicalTerm": "",
   "professionalDef": "同北交，真黄经计算的进化节点。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "与平均北交同义，计算更精——你成长方向的轴线，值得有意识地去走。"
   },
   "positiveKeywords": [
    "成长",
    "方向",
    "精确"
   ],
   "cautionKeywords": [
    "盲从"
   ],
   "negativeKeywords": [
    "宿命论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.body.uranus",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "body",
   "displayZh": "天王星",
   "classicalTerm": "",
   "professionalDef": "突变、自由、独创与破规能量。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你哪方面求新求变、受不了被框——突如其来的转折和独立意识所在。"
   },
   "positiveKeywords": [
    "突破",
    "自由",
    "独创"
   ],
   "cautionKeywords": [
    "叛逆"
   ],
   "negativeKeywords": [
    "善变"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.body.venus",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "body",
   "displayZh": "金星",
   "classicalTerm": "",
   "professionalDef": "爱、价值、审美与吸引力的流向。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你喜欢什么、怎么爱人、靠什么觉得「值」——审美和关系里的口味与吸引力。"
   },
   "positiveKeywords": [
    "爱",
    "审美",
    "价值"
   ],
   "cautionKeywords": [
    "溺爱"
   ],
   "negativeKeywords": [
    "虚荣"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.house.1",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "house",
   "displayZh": "第一宫（命宫）",
   "classicalTerm": "",
   "professionalDef": "命宫，主自我、体格与外在气质，对应上升点所在。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "这是你给人的第一印象和启动方式——怎么开场、怎么被记住，从这块看。它是你对外的一张脸。"
   },
   "positiveKeywords": [
    "自我",
    "气质",
    "开局"
   ],
   "cautionKeywords": [
    "自我中心"
   ],
   "negativeKeywords": [
    "以貌取人"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.house.10",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "house",
   "displayZh": "第十宫（官禄宫）",
   "classicalTerm": "",
   "professionalDef": "官禄宫，主事业、声望与社会角色。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你在外头「成了啥」——职业主线、别人眼里的你。它是你社会身份的旗号。"
   },
   "positiveKeywords": [
    "事业",
    "声望",
    "成就"
   ],
   "cautionKeywords": [
    "功利",
    "压力"
   ],
   "negativeKeywords": [
    "唯名是图"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.house.11",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "house",
   "displayZh": "第十一宫（交友宫）",
   "classicalTerm": "",
   "professionalDef": "交友宫（偏），主群体、希望与未来。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你跟圈子、朋友、长远心愿的关系——人脉和理想的领域。找对圈子，梦想有人陪跑。"
   },
   "positiveKeywords": [
    "群体",
    "希望",
    "人脉"
   ],
   "cautionKeywords": [
    "从众",
    "空想"
   ],
   "negativeKeywords": [
    "孤军"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.house.12",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "house",
   "displayZh": "第十二宫（福德/隐秘宫）",
   "classicalTerm": "",
   "professionalDef": "福德/隐秘宫，主潜意识、独处与消融。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你独处时咋回血、哪些东西在暗里运作——给自己留白很重要，别一直往外耗。"
   },
   "positiveKeywords": [
    "独处",
    "潜意识",
    "疗愈"
   ],
   "cautionKeywords": [
    "逃避",
    "混沌"
   ],
   "negativeKeywords": [
    "自我封闭"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.house.2",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "house",
   "displayZh": "第二宫（财帛宫）",
   "classicalTerm": "",
   "professionalDef": "财帛宫，主资源、价值与自我价值感。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你看钱和「自己值多少」的方式——怎么赚、怎么花、怎么给自己定价，这里给线索。"
   },
   "positiveKeywords": [
    "资源",
    "价值",
    "务实"
   ],
   "cautionKeywords": [
    "贪财",
    "物化"
   ],
   "negativeKeywords": [
    "唯利是图"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.house.3",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "house",
   "displayZh": "第三宫（兄弟宫）",
   "classicalTerm": "",
   "professionalDef": "兄弟宫，主沟通、学习与时近人际。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你咋说话、咋学、跟平辈邻居咋处——日常交流的底色，也管短途和碎片信息。"
   },
   "positiveKeywords": [
    "沟通",
    "学习",
    "近邻"
   ],
   "cautionKeywords": [
    "碎嘴",
    "浅交"
   ],
   "negativeKeywords": [
    "沟通碎"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.house.4",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "house",
   "displayZh": "第四宫（田宅宫）",
   "classicalTerm": "",
   "professionalDef": "田宅宫，主家庭、根基与内在安全。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你的「根」——家、爸妈、安稳感从哪来，藏着你最私的底气。这块稳，人才稳。"
   },
   "positiveKeywords": [
    "家庭",
    "根基",
    "安全"
   ],
   "cautionKeywords": [
    "恋家",
    "封闭"
   ],
   "negativeKeywords": [
    "无根"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.house.5",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "house",
   "displayZh": "第五宫（子女宫）",
   "classicalTerm": "",
   "professionalDef": "子女宫，主创造、恋爱与自我表达。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你咋玩、咋谈情、咋「生」出作品——享受和创造的领域，也管孩子与灵感。"
   },
   "positiveKeywords": [
    "创造",
    "恋爱",
    "乐趣"
   ],
   "cautionKeywords": [
    "玩乐",
    "冒险"
   ],
   "negativeKeywords": [
    "滥情"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.house.6",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "house",
   "displayZh": "第六宫（奴仆宫）",
   "classicalTerm": "",
   "professionalDef": "奴仆宫，主工作、健康与日常秩序。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你干活的习惯和身体使用方式——节奏、条理、怎么照顾自己，藏在日常里。"
   },
   "positiveKeywords": [
    "条理",
    "勤劳",
    "保健"
   ],
   "cautionKeywords": [
    "操劳",
    "挑剔"
   ],
   "negativeKeywords": [
    "过劳"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.house.7",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "house",
   "displayZh": "第七宫（夫妻宫）",
   "classicalTerm": "",
   "professionalDef": "夫妻宫，主伴侣、合作与公开关系。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你跟「一对一」的人咋处——对象、搭档、签了字的关系。它是你照见自己的镜子。"
   },
   "positiveKeywords": [
    "伴侣",
    "合作",
    "契约"
   ],
   "cautionKeywords": [
    "依赖",
    "对立"
   ],
   "negativeKeywords": [
    "关系失衡"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.house.8",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "house",
   "displayZh": "第八宫（疾厄宫）",
   "classicalTerm": "",
   "professionalDef": "疾厄宫（偏），主深层资源、转化与共享。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你跟「别人的钱、秘密、大起大落」的关系——别怕深，学会转化，危机也能变转机。"
   },
   "positiveKeywords": [
    "深度",
    "转化",
    "共享"
   ],
   "cautionKeywords": [
    "执念",
    "隐秘"
   ],
   "negativeKeywords": [
    "沉溺"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.house.9",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "house",
   "displayZh": "第九宫（迁移宫）",
   "classicalTerm": "",
   "professionalDef": "迁移宫（偏），主信念、远行与高阶学习。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你信什么、想去哪、怎么长大——眼界和意义的领域。走出去、学进去，人才开阔。"
   },
   "positiveKeywords": [
    "信念",
    "远行",
    "求学"
   ],
   "cautionKeywords": [
    "空想",
    "好高骛远"
   ],
   "negativeKeywords": [
    "眼高手低"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.sign.aquarius",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "sign",
   "displayZh": "水瓶座",
   "classicalTerm": "",
   "professionalDef": "黄道第十一宫，风象固定星座，主独立、革新与群体。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你求新、不随大流、关心大伙。点子怪但前卫，做开创的事对味；别太飘，落地点地气更稳。"
   },
   "positiveKeywords": [
    "独立",
    "革新",
    "博爱"
   ],
   "cautionKeywords": [
    "叛逆",
    "疏离"
   ],
   "negativeKeywords": [
    "不接地气"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.sign.aries",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "sign",
   "displayZh": "白羊座",
   "classicalTerm": "",
   "professionalDef": "黄道第一宫，火象基本星座，主开创、冲动与自我主张。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是「先冲再说」型，行动快、不怕开头，新事你带头最来劲；就是别冲太猛摔跟头，冲之前扫一眼路。"
   },
   "positiveKeywords": [
    "开创",
    "勇敢",
    "热情"
   ],
   "cautionKeywords": [
    "冲动",
    "三分钟热度"
   ],
   "negativeKeywords": [
    "鲁莽"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.sign.cancer",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "sign",
   "displayZh": "巨蟹座",
   "classicalTerm": "",
   "professionalDef": "黄道第四宫，水象基本星座，主情绪、家庭与守护。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你心软、重家、护短，情绪是底色。给自己留个安全窝，但也别把情绪全闷着，久了伤自己。"
   },
   "positiveKeywords": [
    "顾家",
    "细腻",
    "守护"
   ],
   "cautionKeywords": [
    "情绪化",
    "敏感"
   ],
   "negativeKeywords": [
    "缩在壳里"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.sign.capricorn",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "sign",
   "displayZh": "摩羯座",
   "classicalTerm": "",
   "professionalDef": "黄道第十宫，土象基本星座，主结构、责任与成就。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你扛事、能熬、一步步往上。慢工出细活，但别把人生过成只有苦劳，记得给自己一点甜头。"
   },
   "positiveKeywords": [
    "责任",
    "坚韧",
    "务实"
   ],
   "cautionKeywords": [
    "压抑",
    "功利的"
   ],
   "negativeKeywords": [
    "苦劳命"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.sign.gemini",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "sign",
   "displayZh": "双子座",
   "classicalTerm": "",
   "professionalDef": "黄道第三宫，风象变动星座，主沟通、好奇与多变。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你脑子快、爱聊、兴趣换来换去。适合靠信息吃饭，但别样样浅尝，挑一两个深耕才出成果。"
   },
   "positiveKeywords": [
    "灵巧",
    "善沟通",
    "好奇"
   ],
   "cautionKeywords": [
    "善变",
    "肤浅"
   ],
   "negativeKeywords": [
    "三心二意"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.sign.leo",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "sign",
   "displayZh": "狮子座",
   "classicalTerm": "",
   "professionalDef": "黄道第五宫，火象固定星座，主表现、自信与领导。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你爱被看见、有范儿、乐意扛大旗。舞台是你的充电处，但别为了面子硬撑，该示弱时也示弱。"
   },
   "positiveKeywords": [
    "自信",
    "大方",
    "领导"
   ],
   "cautionKeywords": [
    "爱面子",
    "霸道"
   ],
   "negativeKeywords": [
    "死撑"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.sign.libra",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "sign",
   "displayZh": "天秤座",
   "classicalTerm": "",
   "professionalDef": "黄道第七宫，风象基本星座，主关系、平衡与审美。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你怕失衡、爱体面、处关系讲究。做调解、搭配、审美的事顺手；犹豫时先定一个再调，别来回摆。"
   },
   "positiveKeywords": [
    "平衡",
    "审美",
    "得体"
   ],
   "cautionKeywords": [
    "犹豫",
    "讨好"
   ],
   "negativeKeywords": [
    "两头摇摆"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.sign.pisces",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "sign",
   "displayZh": "双鱼座",
   "classicalTerm": "",
   "professionalDef": "黄道第十二宫，水象变动星座，主想象、共情与模糊。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你心软、爱幻想、易代入别人。艺术和疗愈你在行，但分不清边界时记得回神，别被拖垮。"
   },
   "positiveKeywords": [
    "共情",
    "想象",
    "柔软"
   ],
   "cautionKeywords": [
    "迷糊",
    "逃避"
   ],
   "negativeKeywords": [
    "边界不清"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.sign.sagittarius",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "sign",
   "displayZh": "射手座",
   "classicalTerm": "",
   "professionalDef": "黄道第九宫，火象变动星座，主扩张、信念与自由。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你心大、爱远方、信点啥就往前跑。适合闯和教，但别光画饼，落地才真，别答应了又飘走。"
   },
   "positiveKeywords": [
    "乐观",
    "开阔",
    "好学"
   ],
   "cautionKeywords": [
    "浮夸",
    "不落地"
   ],
   "negativeKeywords": [
    "画饼"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.sign.scorpio",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "sign",
   "displayZh": "天蝎座",
   "classicalTerm": "",
   "professionalDef": "黄道第八宫，水象固定星座，主深度、掌控与转化。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你看得透、抓得紧、不轻易信。深情也多疑，关系里给点信任，自己也松；别把人往最坏想。"
   },
   "positiveKeywords": [
    "深刻",
    "洞察",
    "专注"
   ],
   "cautionKeywords": [
    "多疑",
    "掌控"
   ],
   "negativeKeywords": [
    "猜忌"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.sign.taurus",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "sign",
   "displayZh": "金牛座",
   "classicalTerm": "",
   "professionalDef": "黄道第二宫，土象固定星座，主稳定、感官与务实积累。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你慢热但踏实，钱、物、感情都爱攒、爱稳。别太恋安稳，该变时也得动，不然容易卡在原地。"
   },
   "positiveKeywords": [
    "踏实",
    "稳健",
    "感官"
   ],
   "cautionKeywords": [
    "固执",
    "恋旧"
   ],
   "negativeKeywords": [
    "抗拒变化"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "western.sign.virgo",
   "system": "western",
   "systemCn": "西洋占星",
   "category": "term",
   "termGroup": "sign",
   "displayZh": "处女座",
   "classicalTerm": "",
   "professionalDef": "黄道第六宫，土象变动星座，主分析、细节与服务。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你细心、爱挑刺、想把事做漂亮。靠谱是你的招牌，但别抠到把自己和别人都累着，差不多就行。"
   },
   "positiveKeywords": [
    "细致",
    "靠谱",
    "务实"
   ],
   "cautionKeywords": [
    "挑剔",
    "焦虑"
   ],
   "negativeKeywords": [
    "钻牛角尖"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "zeri.jianchu.bi",
   "system": "zeri",
   "systemCn": "择日黄历",
   "category": "term",
   "termGroup": "shier",
   "displayZh": "闭",
   "professionalDef": "闭日主闭塞、收敛、筑堤、补垣；忌开市、出行、求医。闭者藏也，宜休养。",
   "translations": {
    "zh": "闭日适合“关门修养”。修墙、补漏洞、养精神、做收尾整理都顺；但不适合开业、远行、看病。记：闭=收工歇着，别往外冲。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "zeri.jianchu.cheng",
   "system": "zeri",
   "systemCn": "择日黄历",
   "category": "term",
   "termGroup": "shier",
   "displayZh": "成",
   "professionalDef": "成日主成就、和合、嫁娶、开市、入学；诸事皆宜，大吉之辰。成者就也，百事可成。",
   "translations": {
    "zh": "成日是“黄道好日子”。结婚、开业、入学、合作、签约，基本啥正事都适合。记：成=成事，重要的事优先排这天。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "zeri.jianchu.chu",
   "system": "zeri",
   "systemCn": "择日黄历",
   "category": "term",
   "termGroup": "shier",
   "displayZh": "除",
   "professionalDef": "除日主除旧布新、扫舍、疗病、解怨。宜祛污、出行、解除；忌求官、娶妇。除者去也，吐故之时。",
   "translations": {
    "zh": "除日适合“清掉”。大扫除、断舍离、跟人解开误会、处理陈年旧账，这天做最对路。不适合求官或办喜事。记：除=扔旧的、和解的。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "zeri.jianchu.ding",
   "system": "zeri",
   "systemCn": "择日黄历",
   "category": "term",
   "termGroup": "shier",
   "displayZh": "定",
   "professionalDef": "定日主安定、进人口、嫁娶、纳财；忌官讼、出行、医疗。定者静也，宜固守。",
   "translations": {
    "zh": "定日适合“定下来”。定亲、安床、添人进口、存钱落袋，这天稳。但不适合打官司、远行、看病。记：定=落定、守成。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "zeri.jianchu.jian",
   "system": "zeri",
   "systemCn": "择日黄历",
   "category": "term",
   "termGroup": "shier",
   "displayZh": "建",
   "professionalDef": "建除十二神之首，值月令本位。主创始、自建、出行、巡狩；忌动土、开仓。建日气方生，宜立新不宜卸旧。",
   "translations": {
    "zh": "建日适合“开头”。想启动项目、出门、定计划，挑这天挺顺。但不适合收尾、拆改、动土这类事。简单记：建=开新，别干收摊的活。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "zeri.jianchu.kai",
   "system": "zeri",
   "systemCn": "择日黄历",
   "category": "term",
   "termGroup": "shier",
   "displayZh": "开",
   "professionalDef": "开日主开通、开业、出行、求医、嫁娶；忌安葬、伐木。开者启也，宜开创。",
   "translations": {
    "zh": "开日适合“打开局面”。开业、出门、看病、办喜事都顺，有开启的势头。但不适合下葬、砍树这类“收尾/破坏”的活。记：开=开局、出门。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "zeri.jianchu.man",
   "system": "zeri",
   "systemCn": "择日黄历",
   "category": "term",
   "termGroup": "shier",
   "displayZh": "满",
   "professionalDef": "满日主丰盈、成就、嫁娶、开市；忌动土、葬埋。满者实也，物盛之时，宜成事。",
   "translations": {
    "zh": "满日适合“办成事的喜事”。开业、结婚、签约、收货，挑这天有“圆满”的意味。但不适合动土或下葬。记：满=成事、喜庆。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "zeri.jianchu.ping",
   "system": "zeri",
   "systemCn": "择日黄历",
   "category": "term",
   "termGroup": "shier",
   "displayZh": "平",
   "professionalDef": "平日主平顺、修造、安床、嫁娶；无大忌亦无大吉，百事平平。平者和也，宜守常。",
   "translations": {
    "zh": "平日就是“普普通通的一天”。没大吉也没大凶，适合做日常、常规的事，不适合赌一把或办大事。记：平=平常心，按部就班。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "zeri.jianchu.po",
   "system": "zeri",
   "systemCn": "择日黄历",
   "category": "term",
   "termGroup": "shier",
   "displayZh": "破",
   "professionalDef": "破日主破败、损坏、冲破，诸事不宜，惟宜破屋坏垣。破者裂也，大凶之辰。",
   "translations": {
    "zh": "破日就是“别折腾重要的事”。签约、结婚、开工、远行都别排这天，容易破功。唯一适合的是拆旧、破墙这类“本来就要弄坏”的活。记：破=宜破不宜立。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "zeri.jianchu.shou",
   "system": "zeri",
   "systemCn": "择日黄历",
   "category": "term",
   "termGroup": "shier",
   "displayZh": "收",
   "professionalDef": "收日主收敛、纳财、娶妇、入学；忌放债、开市、出行。收者敛也，宜进不宜出。",
   "translations": {
    "zh": "收日适合“往里收”。存钱、收款、娶进、学习充电都顺；但不适合借钱出去、开业、远行。记：收=进账、内收，别外放。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "zeri.jianchu.wei",
   "system": "zeri",
   "systemCn": "择日黄历",
   "category": "term",
   "termGroup": "shier",
   "displayZh": "危",
   "professionalDef": "危日主危险、高峻、不安，宜安守、捕猎；忌登高、嫁娶、移徙。危者险也，事须谨慎。",
   "translations": {
    "zh": "危日提醒“这天容易出岔子”。登高、冒险、办喜事、搬家都先缓。适合的是守着、把现有事做细。记：危=谨慎，别冒头。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "zeri.jianchu.zhi",
   "system": "zeri",
   "systemCn": "择日黄历",
   "category": "term",
   "termGroup": "shier",
   "displayZh": "执",
   "professionalDef": "执日主执行、捕捉、修造、嫁娶；忌移徙、出行。执者持也，宜有所把持。",
   "translations": {
    "zh": "执日适合“抓在手里的执行”。落实决定、抓进度、修缮、办婚礼都顺。但不适合搬家、远行。记：执=动手做、抓住。"
   },
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.dijie",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "地劫",
   "classicalTerm": "",
   "professionalDef": "劫耗之星，主波折、损耗与意外破财，庙旺则应变，陷地则雪上加霜。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你路上容易遇计划外的坑——钱、事说没就没。留点备用、别 all in，摔了也能爬起来。"
   },
   "positiveKeywords": [
    "应变",
    "警觉",
    "韧性"
   ],
   "cautionKeywords": [
    "损耗",
    "波折"
   ],
   "negativeKeywords": [
    "意外破财"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.dikong",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "地空",
   "classicalTerm": "",
   "professionalDef": "空亡之星，主虚耗、想法飘忽与计划落空，庙旺则创意，陷地则虚无。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你念头多但落地难，钱和计划容易空欢喜。适合搞创意点子，但重要的事要有人帮你收口执行。"
   },
   "positiveKeywords": [
    "创意",
    "空灵",
    "想象力"
   ],
   "cautionKeywords": [
    "虚耗",
    "飘忽"
   ],
   "negativeKeywords": [
    "计划落空"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.enguang",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "恩光",
   "classicalTerm": "",
   "professionalDef": "德庆之星，主恩荣、名声与受人称许，多主因德得誉。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你做好事容易被看见被夸，口碑帮你。待人实在点，名声会回头成你的助力。"
   },
   "positiveKeywords": [
    "恩荣",
    "名声",
    "口碑"
   ],
   "cautionKeywords": [
    "虚荣",
    "图名"
   ],
   "negativeKeywords": [
    "名不副实"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.fenggao",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "封诰",
   "classicalTerm": "",
   "professionalDef": "封赏之星，主嘉奖、名位与事成有果，多主努力得认可。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你的付出容易「被盖章认可」——奖、名、果实在你身上落得住。认准的事做到底，回报会来。"
   },
   "positiveKeywords": [
    "嘉奖",
    "名位",
    "成果"
   ],
   "cautionKeywords": [
    "图报",
    "功利"
   ],
   "negativeKeywords": [
    "怀才不遇"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.fengge",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "凤阁",
   "classicalTerm": "",
   "professionalDef": "修饰之星，主外貌、品味与装饰之才，多主仪表与审美。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你对好看有要求，自己也收拾得利落，审美在线。靠品味吃饭、靠形象加分，是你隐藏的王牌。"
   },
   "positiveKeywords": [
    "品味",
    "仪表",
    "审美"
   ],
   "cautionKeywords": [
    "虚荣",
    "外秀"
   ],
   "negativeKeywords": [
    "华而不实"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.guasu",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "寡宿",
   "classicalTerm": "",
   "professionalDef": "寡宿之星，主淡漠、清冷与情感疏离，多主内心疏离。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你对外在热闹不太热络，心里有一层距离感。不是没感情，是慢热。找几个真正合拍的，重质不重量。"
   },
   "positiveKeywords": [
    "清冷",
    "淡然",
    "自持"
   ],
   "cautionKeywords": [
    "疏离",
    "慢热"
   ],
   "negativeKeywords": [
    "情感隔离"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.guchen",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "孤辰",
   "classicalTerm": "",
   "professionalDef": "孤克之星，主孤独、独立与六亲缘薄，多主性格孤高。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你骨子里有点独，喜欢自己待着不凑热闹，也少依赖人。独处是充电，但也别忘了偶尔主动靠近在乎的人。"
   },
   "positiveKeywords": [
    "独立",
    "清醒",
    "自在"
   ],
   "cautionKeywords": [
    "孤僻",
    "疏离"
   ],
   "negativeKeywords": [
    "六亲缘薄"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.hongluan",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "红鸾",
   "classicalTerm": "",
   "professionalDef": "喜庆之星，主姻缘、桃花与喜事，多用于婚姻之期与情感升温。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是「有喜事体质」——谈恋爱、办喜事、人气旺的时候最顺。想脱单或升温，挑你状态好的节点出手。"
   },
   "positiveKeywords": [
    "姻缘",
    "喜庆",
    "桃花"
   ],
   "cautionKeywords": [
    "烂桃花",
    "冲动"
   ],
   "negativeKeywords": [
    "情迷"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.huagai",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "华盖",
   "classicalTerm": "",
   "professionalDef": "孤高之星，主才艺、宗教与玄学缘，多主超脱与艺术气质。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你有股仙气——爱独处、好玄的、搞艺术的，跟大众口味有点距离。这种清高是你特色，别硬融圈子。"
   },
   "positiveKeywords": [
    "才艺",
    "超脱",
    "玄缘"
   ],
   "cautionKeywords": [
    "孤高",
    "避世"
   ],
   "negativeKeywords": [
    "不合群"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.huoxing",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "火星",
   "classicalTerm": "",
   "professionalDef": "刚烈之星，主突发、暴躁与破坏，庙旺则果敢，陷地则急性招灾。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你点火快、脾气说来就来，事情也容易突然炸锅。好处是冲劲猛，坏处是烧着自己。发火先数三下，大事别当场拍板。"
   },
   "positiveKeywords": [
    "爆发力",
    "果敢",
    "热情"
   ],
   "cautionKeywords": [
    "暴躁",
    "急性"
   ],
   "negativeKeywords": [
    "引火烧身"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.lingxing",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "铃星",
   "classicalTerm": "",
   "professionalDef": "暗毒之星，主隐忍、阴狠与持久困扰，庙旺则蓄势，陷地则暗中生非。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你生气不爱当场爆，闷在心里慢慢磨——这种暗火更伤人。有疙瘩早点说出来，别攒成心结。"
   },
   "positiveKeywords": [
    "隐忍",
    "蓄势",
    "深沉"
   ],
   "cautionKeywords": [
    "暗火",
    "记仇"
   ],
   "negativeKeywords": [
    "心结难解"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.longchi",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "龙池",
   "classicalTerm": "",
   "professionalDef": "才艺之星，主声誉、技艺与高雅情趣，多主艺术天赋。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你在雅事上有天赋——音乐书画手工这类，做出来有格调。把爱好练精，它能成为你的标签。"
   },
   "positiveKeywords": [
    "才艺",
    "声誉",
    "格调"
   ],
   "cautionKeywords": [
    "清高",
    "小众"
   ],
   "negativeKeywords": [
    "曲高和寡"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.lucun",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "禄存",
   "classicalTerm": "",
   "professionalDef": "俸禄之星，主财富、积聚与安稳，性保守，主财库丰盈但吝于流动。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是存钱型，钱袋子捂得紧、攒得住，日子安稳。别抠到啥都自己扛，该花的地方花，财气才转得动。"
   },
   "positiveKeywords": [
    "积聚",
    "安稳",
    "财库"
   ],
   "cautionKeywords": [
    "吝啬",
    "守财"
   ],
   "negativeKeywords": [
    "不敢流动"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.qingyang",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "擎羊",
   "classicalTerm": "",
   "professionalDef": "刑伤之星，主刚烈、争执与血光，庙旺则勇武，陷地则招是非。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你性子冲、说话直，容易跟人起摩擦、小磕碰也多。动手前压三秒、嘴上留点余地，能少惹一半麻烦。"
   },
   "positiveKeywords": [
    "勇武",
    "果决",
    "冲劲"
   ],
   "cautionKeywords": [
    "急躁",
    "争执"
   ],
   "negativeKeywords": [
    "惹是非"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.taifu",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "台辅",
   "classicalTerm": "",
   "professionalDef": "佐贰之星，主辅佐、幕僚与职位之助，多主得副手之益。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你适合当关键副手——领导离不开的二把手，补位精准。把辅助做成专业，位置就稳。"
   },
   "positiveKeywords": [
    "辅佐",
    "幕僚",
    "补位"
   ],
   "cautionKeywords": [
    "甘当配角",
    "隐没"
   ],
   "negativeKeywords": [
    "埋没"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.tiancai",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "天才",
   "classicalTerm": "",
   "professionalDef": "聪敏之星，主禀赋、机智与专精，多主某方面过人天赋。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你脑子有专项特长——某件事一学就透、比别人灵。找到那块深耕下去，就是你的壁垒。"
   },
   "positiveKeywords": [
    "天赋",
    "机智",
    "专精"
   ],
   "cautionKeywords": [
    "偏才",
    "自负"
   ],
   "negativeKeywords": [
    "恃才"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.tiangui",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "天贵",
   "classicalTerm": "",
   "professionalDef": "贵显之星，主地位、信用与受人敬重，多主因信得贵。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你说话算数、靠谱，别人愿意信你给你位子。守住信用这金字招牌，贵人自然来。"
   },
   "positiveKeywords": [
    "信用",
    "地位",
    "敬重"
   ],
   "cautionKeywords": [
    "求名",
    "端着"
   ],
   "negativeKeywords": [
    "失信任"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.tiankui",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "天魁",
   "classicalTerm": "",
   "professionalDef": "昼贵之星，主科名、显达与贵人提携，多主长辈、男性贵人之助，利于功名。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你容易碰到「上面有人拉你」的运气——领导、长辈、前辈看中你、给你机会。关键时刻别怯场，接住机会就上。"
   },
   "positiveKeywords": [
    "提携",
    "功名",
    "显达"
   ],
   "cautionKeywords": [
    "恃宠",
    "被动"
   ],
   "negativeKeywords": [
    "错失机遇"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.tianma",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "天马",
   "classicalTerm": "",
   "professionalDef": "奔驰之星，主动荡、远行与变动，喜与禄存或吉星同宫，主迁动得财。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你待不住——换环境、出差、跑动反而来财来机会。别在一处闷死，动起来往外走，运气更活。"
   },
   "positiveKeywords": [
    "远行",
    "变动",
    "活力"
   ],
   "cautionKeywords": [
    "漂泊",
    "不安分"
   ],
   "negativeKeywords": [
    "定不下来"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.tianshou",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "天寿",
   "classicalTerm": "",
   "professionalDef": "延寿之星，主康宁、稳健与长久，多主平安耐久。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你底子稳、活得久、不慌不忙，是慢热但长线型。保重身子别透支，日子越往后越见你的稳。"
   },
   "positiveKeywords": [
    "康宁",
    "稳健",
    "耐久"
   ],
   "cautionKeywords": [
    "拖沓",
    "保守"
   ],
   "negativeKeywords": [
    "暮气"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.tianxi",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "天喜",
   "classicalTerm": "",
   "professionalDef": "欢悦之星，主喜庆、和乐与添丁之喜，常随红鸾同论。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你身边喜气重，聚会添人开心事容易落你头上。多制造轻松快乐的场合，关系自然升温。"
   },
   "positiveKeywords": [
    "和乐",
    "喜庆",
    "人缘"
   ],
   "cautionKeywords": [
    "玩乐",
    "分心"
   ],
   "negativeKeywords": [
    "乐极生悲"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.tianxing",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "天刑",
   "classicalTerm": "",
   "professionalDef": "刑罚之星，主规则、是非与官非，庙旺则自律，陷地则招讼。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你对规矩又爱又怕，容易碰上讲原则的事或小人官司。做事留痕守契约，别踩灰色地带，最稳。"
   },
   "positiveKeywords": [
    "自律",
    "规则",
    "原则"
   ],
   "cautionKeywords": [
    "官非",
    "较真"
   ],
   "negativeKeywords": [
    "惹讼"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.tianyao",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "天姚",
   "classicalTerm": "",
   "professionalDef": "媚惑之星，主风情、机智与是非口舌，庙旺则灵巧，陷地则招谣。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你灵俏会来事儿，招人也会招闲话。靠机灵吃饭可以，但别让风流韵事变成别人的谈资。"
   },
   "positiveKeywords": [
    "灵巧",
    "风情",
    "机智"
   ],
   "cautionKeywords": [
    "是非",
    "轻浮"
   ],
   "negativeKeywords": [
    "招谣"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.tianyue",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "天钺",
   "classicalTerm": "",
   "professionalDef": "夜贵之星，主荫庇、化解与女性贵人之助，多主意外之助与危机化解。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你常在卡住时被一位女性长辈或贵人拉一把，也能逢凶化吉。多谢恩记情，这份缘会回头帮你。"
   },
   "positiveKeywords": [
    "荫庇",
    "化解",
    "贵人"
   ],
   "cautionKeywords": [
    "欠人情",
    "被动"
   ],
   "negativeKeywords": [
    "忘恩"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.tuoluo",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "陀罗",
   "classicalTerm": "",
   "professionalDef": "纠缆之星，主纠缠、拖延与反复，庙旺则坚韧，陷地则拖泥带水。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你遇事容易绕、放不下、反复拉扯——好处是能磨，坏处是耗。定好的事设个截止线，别总再想想。"
   },
   "positiveKeywords": [
    "坚韧",
    "持久",
    "耐性"
   ],
   "cautionKeywords": [
    "拖延",
    "纠缠"
   ],
   "negativeKeywords": [
    "拖泥带水"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.wenchang",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "文昌",
   "classicalTerm": "",
   "professionalDef": "文魁之星，主文采、学识与功名，喜入命身宫及官禄宫，主聪明好学、利考试文书。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是吃「笔头饭」的料——写、学、考、表达这些事比旁人顺。备考、写方案、做文案时状态最好，把脑子用在文字和知识上最出彩。"
   },
   "positiveKeywords": [
    "文采",
    "聪慧",
    "功名"
   ],
   "cautionKeywords": [
    "书呆",
    "眼高手低"
   ],
   "negativeKeywords": [
    "疏于实践"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.wenqu",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "文曲",
   "classicalTerm": "",
   "professionalDef": "礼乐之星，主才艺、口才与巧思，偏诗词歌赋、技艺表演，与文昌同列文星。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你有点艺术细胞、嘴也巧，唱歌写东西耍点小手艺都比划得起来。适合把才气变成能秀出来的本事，别埋着。"
   },
   "positiveKeywords": [
    "才艺",
    "口才",
    "巧思"
   ],
   "cautionKeywords": [
    "浮滑",
    "贪玩"
   ],
   "negativeKeywords": [
    "华而不实"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.xianchi",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "咸池",
   "classicalTerm": "",
   "professionalDef": "桃花之星，主情欲、风流与艺术感性，庙旺则才情，陷地则滥情。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你自带吸引力，对美对情敏感，也容易招桃花。享受魅力但别贪多，挑真心的人，别让烂桃花缠身。"
   },
   "positiveKeywords": [
    "魅力",
    "才情",
    "感性"
   ],
   "cautionKeywords": [
    "滥情",
    "分心"
   ],
   "negativeKeywords": [
    "桃花劫"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.youbi",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "右弼",
   "classicalTerm": "",
   "professionalDef": "协助之星，主副手、计划与暗中扶持，性沉稳，主内助与幕后成全。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是那种在背后把事托住的人，也常遇到默默帮你兜底的人。计划统筹类的事你在行，别小看自己的辅助力。"
   },
   "positiveKeywords": [
    "内助",
    "沉稳",
    "计划"
   ],
   "cautionKeywords": [
    "隐忍",
    "幕后"
   ],
   "negativeKeywords": [
    "不被看见"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.aux.zuofu",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "aux",
   "displayZh": "左辅",
   "classicalTerm": "",
   "professionalDef": "佐助之星，主贵人、辅弼与助力，性温良，喜夹命或会吉，主得人力扶持。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你命里自带「帮手运」——做事容易遇到肯搭手的人，团队里你也愿意补位。多经营人脉，关键时刻有人拉你一把。"
   },
   "positiveKeywords": [
    "贵人",
    "辅佐",
    "助力"
   ],
   "cautionKeywords": [
    "依赖",
    "附和"
   ],
   "negativeKeywords": [
    "缺乏主见"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.palace.caibo",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "palace",
   "displayZh": "财帛宫",
   "classicalTerm": "",
   "professionalDef": "主财源、理财方式与进财之途。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "看钱怎么来、怎么花、怎么管——你是赚辛苦钱还是资源钱，是攒得住还是留不住，这里给线索。"
   },
   "positiveKeywords": [
    "财源",
    "理财",
    "进财"
   ],
   "cautionKeywords": [
    "贪财"
   ],
   "negativeKeywords": [
    "投机"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.palace.fude",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "palace",
   "displayZh": "福德宫",
   "classicalTerm": "",
   "professionalDef": "主内心福泽、精神享受与晚年心境。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "看你怎么「给自己充电」——什么让你真正松下来、觉得值。精神富不富，比账面更决定你舒不舒服。"
   },
   "positiveKeywords": [
    "心安",
    "精神",
    "福泽"
   ],
   "cautionKeywords": [
    "空想"
   ],
   "negativeKeywords": [
    "虚耗"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.palace.fumu",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "palace",
   "displayZh": "父母宫",
   "classicalTerm": "",
   "professionalDef": "主父母庇荫、长辈缘与文书缘分。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "看你和父母、长辈的缘分，也管「文书、契约、证照」一类事的顺逆。长辈是你早年的靠山或课题。"
   },
   "positiveKeywords": [
    "长辈",
    "庇荫",
    "文书"
   ],
   "cautionKeywords": [
    "依赖"
   ],
   "negativeKeywords": [
    "推诿"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.palace.fuqi",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "palace",
   "displayZh": "夫妻宫",
   "classicalTerm": "",
   "professionalDef": "主配偶性情、姻缘早晚与相处模式。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "看亲密关系的样子——对方大概什么脾气、你们是和睦型还是磨合型。注意它只说「相处模式」，不是注定，经营才是关键。"
   },
   "positiveKeywords": [
    "姻缘",
    "伴侣",
    "相处"
   ],
   "cautionKeywords": [
    "挑剔"
   ],
   "negativeKeywords": [
    "宿命论"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.palace.guanlu",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "palace",
   "displayZh": "官禄宫",
   "classicalTerm": "",
   "professionalDef": "主事业、职位与功名趋向。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "看事业这条线——适合走专业还是管理，是稳步上升还是波动前行。它是职业方向的线索，不是定死的职业。"
   },
   "positiveKeywords": [
    "事业",
    "职位",
    "功名"
   ],
   "cautionKeywords": [
    "功利"
   ],
   "negativeKeywords": [
    "一根筋"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.palace.jiaoyou",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "palace",
   "displayZh": "交友宫",
   "classicalTerm": "",
   "professionalDef": "主部属、同事与泛泛之交。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "看你和「手下、同事、圈子」的互动——是得人帮，还是被拖累。也管你在一个群体里的位置。"
   },
   "positiveKeywords": [
    "人际",
    "部属",
    "圈子"
   ],
   "cautionKeywords": [
    "轻信"
   ],
   "negativeKeywords": [
    "滥交"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.palace.jie",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "palace",
   "displayZh": "疾厄宫",
   "classicalTerm": "",
   "professionalDef": "主体质强弱、精力耗散与养生倾向。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "看你对身体的「使用习惯」和容易耗神的领域——是拼起来不要命，还是总在小事上费神。它是提醒你注意节奏，不是诊断，身体问题请看医生。"
   },
   "positiveKeywords": [
    "体质",
    "精力",
    "养生"
   ],
   "cautionKeywords": [
    "讳疾",
    "焦虑"
   ],
   "negativeKeywords": [
    "自我诊断"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.palace.mingong",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "palace",
   "displayZh": "命宫",
   "classicalTerm": "",
   "professionalDef": "立命之所，统摄一身之格局，为十二宫之纲领。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "这是你这人的「总开关」——性格底色、先天禀赋、给人第一眼的印象，都从这里看。读懂命宫，再看别的宫才有根。"
   },
   "positiveKeywords": [
    "根基",
    "本性",
    "格局"
   ],
   "cautionKeywords": [
    "固执于性"
   ],
   "negativeKeywords": [
    "以偏概全"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.palace.qianyi",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "palace",
   "displayZh": "迁移宫",
   "classicalTerm": "",
   "professionalDef": "主外出、远行与在外际遇。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "看离开熟悉环境后的你——出差、旅居、去陌生地方是不是如鱼得水。想往外走、做外地/海外业务，这宫是参考。"
   },
   "positiveKeywords": [
    "外出",
    "远行",
    "机遇"
   ],
   "cautionKeywords": [
    "漂泊"
   ],
   "negativeKeywords": [
    "盲动"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.palace.tianzhai",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "palace",
   "displayZh": "田宅宫",
   "classicalTerm": "",
   "professionalDef": "主房产、家运与安身之所。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "看你和「家、房子、根」的关系——是安稳恋家，还是总在搬。也管祖基和不动产缘。"
   },
   "positiveKeywords": [
    "家宅",
    "房产",
    "安顿"
   ],
   "cautionKeywords": [
    "执念于物"
   ],
   "negativeKeywords": [
    "漂泊无根"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.palace.xiongdi",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "palace",
   "displayZh": "兄弟宫",
   "classicalTerm": "",
   "professionalDef": "主兄弟姊妹、同辈朋友与早年助力。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "看你和兄弟姐妹、平辈伙伴的缘分与互动——是互相帮衬，还是各自闯荡。也折射你早期人脉的底色。"
   },
   "positiveKeywords": [
    "同辈",
    "助力",
    "手足"
   ],
   "cautionKeywords": [
    "疏离"
   ],
   "negativeKeywords": [
    "比较计较"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.palace.zinv",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "palace",
   "displayZh": "子女宫",
   "classicalTerm": "",
   "professionalDef": "主子女缘分、晚辈与创意产出。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "看你和孩子的缘分，也管你「生出来的东西」——作品、项目、创意。想搞创作，这宫有戏。"
   },
   "positiveKeywords": [
    "后代",
    "创意",
    "产出"
   ],
   "cautionKeywords": [
    "苛责"
   ],
   "negativeKeywords": [
    "强求"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.sihua.huaji",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "sihua",
   "displayZh": "化忌",
   "classicalTerm": "",
   "professionalDef": "四化之一，主阻滞、执念与亏欠。星曜化忌则其所司之事多纠结、宜谨慎。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "某个领域要「上心但别较劲」——容易卡、容易放不下、容易反复。不是坏事，是提醒你这里多花心思、别硬碰，绕一下更顺。"
   },
   "positiveKeywords": [
    "警醒",
    "深刻",
    "在意"
   ],
   "cautionKeywords": [
    "执念",
    "阻滞"
   ],
   "negativeKeywords": [
    "钻死胡同"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.sihua.huake",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "sihua",
   "displayZh": "化科",
   "classicalTerm": "",
   "professionalDef": "四化之一，主名声、清贵与化解。星曜化科则其所司之事有声望、得缓和。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "某个领域你容易「得名」——口碑、名声、被人夸，或者遇到尴尬能软着陆。适合把它用在需要露脸、建立信誉的事上。"
   },
   "positiveKeywords": [
    "名声",
    "清贵",
    "化解"
   ],
   "cautionKeywords": [
    "虚名"
   ],
   "negativeKeywords": [
    "沽名钓誉"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.sihua.hualu",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "sihua",
   "displayZh": "化禄",
   "classicalTerm": "",
   "professionalDef": "四化之一，主滋长、获得与顺遂。星曜化禄则其所司之事得助、有进益。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "某个领域被「加持」了——事情容易顺、资源容易来、付出有回响。把它当成你的加分项去用，别浪费在无关紧要的地方。"
   },
   "positiveKeywords": [
    "进益",
    "顺遂",
    "得助"
   ],
   "cautionKeywords": [
    "贪得"
   ],
   "negativeKeywords": [
    "坐享其成"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.sihua.huaquan",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "sihua",
   "displayZh": "化权",
   "classicalTerm": "",
   "professionalDef": "四化之一，主掌权、主导与掌控。星曜化权则其所司之事有力、能主事。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "某个领域你说话算数——有掌控感、能拍板、别人听你的。用它去牵头，但权柄越重越要听得进反对声。"
   },
   "positiveKeywords": [
    "掌权",
    "主导",
    "有力"
   ],
   "cautionKeywords": [
    "专断"
   ],
   "negativeKeywords": [
    "强压于人"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.star.jumen",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "star",
   "displayZh": "巨门",
   "classicalTerm": "",
   "professionalDef": "北斗第二星，化气为暗，主口舌、分析与疑惑。善辩说，亦主是非，宜以口才立业。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是爱钻研、嘴上也利索的人，钻牛角尖能钻出道理，辩论不输人。适合调研、法务、靠嘴吃饭的活；话说太快易惹误会，开口前过一遍脑子更稳。"
   },
   "positiveKeywords": [
    "善辩",
    "钻研",
    "洞察"
   ],
   "cautionKeywords": [
    "是非",
    "多疑"
   ],
   "negativeKeywords": [
    "口无遮拦"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.star.lianzhen",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "star",
   "displayZh": "廉贞",
   "classicalTerm": "",
   "professionalDef": "北斗第五星，化气为囚，为官禄主，主感情、才艺与波折。性烈而敏感，成败起伏较大。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你心思细、重感情、有点才气，但也容易一根筋钻进去，情绪起落比旁人大。适合艺术、人际、需要灵气的活；气头上的决定先放一晚，第二天多半不一样。"
   },
   "positiveKeywords": [
    "才情",
    "重情",
    "灵气"
   ],
   "cautionKeywords": [
    "情绪化",
    "纠结"
   ],
   "negativeKeywords": [
    "钻牛角尖"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.star.pojun",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "star",
   "displayZh": "破军",
   "classicalTerm": "",
   "professionalDef": "北斗第七星，化气为耗，主破旧立新、变动与消耗。性刚强，喜颠覆重整，成败起伏大。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是改革派，嫌旧、爱破、敢重来，别人不敢动的你敢掀桌子重搭。适合转型、创业、推倒重来的活；变太多容易根基虚，破完记得立新的。"
   },
   "positiveKeywords": [
    "革新",
    "敢破",
    "重建"
   ],
   "cautionKeywords": [
    "耗散",
    "动荡"
   ],
   "negativeKeywords": [
    "根基不稳"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.star.qisha",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "star",
   "displayZh": "七杀",
   "classicalTerm": "",
   "professionalDef": "南斗第六星，化气为将，主肃杀、果决与开拓。性刚烈，好胜，宜开创冒险之业。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是冲锋型，敢拼、不怕生、认准目标往前冲，越难的事越来劲。适合开拓、业务、需要狠劲的活；冲太猛易伤人伤己，留三分余地，胜算更久。"
   },
   "positiveKeywords": [
    "果敢",
    "开拓",
    "好胜"
   ],
   "cautionKeywords": [
    "冲动",
    "孤克"
   ],
   "negativeKeywords": [
    "不留余地"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.star.taiyang",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "star",
   "displayZh": "太阳",
   "classicalTerm": "",
   "professionalDef": "中天主星，化气为贵，为官禄主，主光明、显露与付出。庙旺则显达，陷地则辛劳。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你像个小太阳，做事爱摆在明面上，肯为大家忙、愿意扛事，也容易被人看见。适合抛头露面、带队、做让大家受益的事；别把付出都攒着等回报，累了要肯歇。"
   },
   "positiveKeywords": [
    "光明",
    "担责",
    "外显"
   ],
   "cautionKeywords": [
    "过劳",
    "张扬"
   ],
   "negativeKeywords": [
    "透支"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.star.taiyin",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "star",
   "displayZh": "太阴",
   "classicalTerm": "",
   "professionalDef": "中天主星，化气为富，为田宅主，主阴柔、内敛与积蓄。庙旺则富，陷地则劳心。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是内秀型，心思细、爱琢磨、不张扬，钱和家都默默经营得好。适合文案、设计、需要静气的活；别把情绪都闷着，该说就说，久了伤自己。"
   },
   "positiveKeywords": [
    "内秀",
    "细腻",
    "积蓄"
   ],
   "cautionKeywords": [
    "多思",
    "阴郁"
   ],
   "negativeKeywords": [
    "闷在心里"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.star.tanlang",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "star",
   "displayZh": "贪狼",
   "classicalTerm": "",
   "professionalDef": "北斗第一星，化气为桃花，主欲望、才艺与交际。多才多艺，善应酬，亦主波荡。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是气氛组兼多面手，会来事、学啥像啥、人多场合如鱼得水。适合销售、创意、靠人气的活；欲望一多容易散，挑一两样深耕，比样样浅尝强。"
   },
   "positiveKeywords": [
    "多才",
    "善交际",
    "灵活"
   ],
   "cautionKeywords": [
    "贪多",
    "浮华"
   ],
   "negativeKeywords": [
    "三心二意"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.star.tianfu",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "star",
   "displayZh": "天府",
   "classicalTerm": "",
   "professionalDef": "南斗主星，化气为令，为财帛库，主厚重、稳健与储蓄。善积聚，有包容，为禄库之象。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是稳妥的管家型，东西爱囤、事爱安排妥当，给人靠得住的感觉。适合财务、后勤、需要兜底的岗位；别因为怕乱而啥都自己扛，分出去也是本事。"
   },
   "positiveKeywords": [
    "稳健",
    "聚财",
    "可靠"
   ],
   "cautionKeywords": [
    "守成",
    "吝啬"
   ],
   "negativeKeywords": [
    "不敢放手"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.star.tianji",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "star",
   "displayZh": "天机",
   "classicalTerm": "",
   "professionalDef": "南斗第三星，化气为善，为兄弟主，主机智、谋略与变动。善筹划，多变通，宜动中建功。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是脑子转得最快的那类人，点子多、会盘算、临场应变强。适合做策划、参谋、需要灵活转弯的事；但想得太多容易犹豫，定好的事别反复推翻。"
   },
   "positiveKeywords": [
    "机敏",
    "谋划",
    "变通"
   ],
   "cautionKeywords": [
    "多虑",
    "善变"
   ],
   "negativeKeywords": [
    "优柔寡断"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.star.tianliang",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "star",
   "displayZh": "天梁",
   "classicalTerm": "",
   "professionalDef": "南斗第二星，化气为荫，主庇护、清贵与化解。性慈和，喜排难解纷，有逢凶化吉之象。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是身边人的依靠，心软、爱管闲事、谁有难你愿意搭把手，也常能帮人化解麻烦。适合咨询、公益、长辈缘的活；帮人也要有边界，别把自己的事耽误了。"
   },
   "positiveKeywords": [
    "慈和",
    "庇护",
    "化解"
   ],
   "cautionKeywords": [
    "操心",
    "说教"
   ],
   "negativeKeywords": [
    "越俎代庖"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.star.tiantong",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "star",
   "displayZh": "天同",
   "classicalTerm": "",
   "professionalDef": "南斗第四星，化气为福，为福德主，主安逸、温和与享受。性柔顺，喜悠闲，忌奔波劳碌。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是温和派，不爱争、图舒服、相处让人轻松，是朋友圈里的调和剂。适合服务、文娱、慢节奏的活；太安逸容易没劲，给自己找点小目标，福气才稳。"
   },
   "positiveKeywords": [
    "温和",
    "随和",
    "福气"
   ],
   "cautionKeywords": [
    "懒散",
    "逃避"
   ],
   "negativeKeywords": [
    "得过且过"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.star.tianxiang",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "star",
   "displayZh": "天相",
   "classicalTerm": "",
   "professionalDef": "南斗第五星，化气为印，为官禄主，主端庄、辅佐与诚信。有印绶之象，宜佐贵立功。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是可信的二把手，做事体面、靠谱、有分寸，领导把事交你放心。适合助理、行政、需要背书的位置；别总躲在别人后面，你的稳也是种实力。"
   },
   "positiveKeywords": [
    "稳重",
    "诚信",
    "辅佐"
   ],
   "cautionKeywords": [
    "依赖",
    "保守"
   ],
   "negativeKeywords": [
    "缺乏主见"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.star.wuqu",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "star",
   "displayZh": "武曲",
   "classicalTerm": "",
   "professionalDef": "北斗第六星，化气为财，为财帛主，主刚毅、果决与实务。善理财，性刚直，宜武职或技术。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你是实干派，认准了就下手快、不拖泥带水，对钱和资源也看得紧、会打理。适合技术、财务、需要硬功夫的活；刚起来别伤人不留余地，柔软一点关系更顺。"
   },
   "positiveKeywords": [
    "果断",
    "务实",
    "善理财"
   ],
   "cautionKeywords": [
    "固执",
    "刚硬"
   ],
   "negativeKeywords": [
    "不通情理"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  },
  {
   "archetypeKey": "ziwei.star.ziwei",
   "system": "ziwei",
   "systemCn": "紫微斗数",
   "category": "term",
   "termGroup": "star",
   "displayZh": "紫微",
   "classicalTerm": "",
   "professionalDef": "北斗主星，化气为尊，为帝座，司爵禄，主贵气与统御。喜会左辅右弼、文昌文曲等吉星，忌煞忌冲破。",
   "evidenceQuote": "",
   "semanticLibrary": "",
   "translations": {
    "zh": "你天生像团队里的主心骨，自带气场和决断力，遇到大事别人会下意识看你。适合往管理、统筹、拿主意的方向走；只是别太独断，多听身边人一句，路更宽。"
   },
   "positiveKeywords": [
    "领导力",
    "贵气",
    "统筹"
   ],
   "cautionKeywords": [
    "独断",
    "孤芳"
   ],
   "negativeKeywords": [
    "颐指气使"
   ],
   "licenseTier": "public_domain",
   "version": "1.0.0",
   "l1_status": "pending_manual"
  }
 ]
};
