// T2-02 分支语义库（由 scripts/t2-branch-semantic.py 生成，勿手改；重跑脚本再生）。
// 全部 draft：本地模型起草、禁词门禁通过、未经命理顾问终审。

export interface BranchSemanticEntry {
  branchKey: string;
  archetypeKey: string;
  termKey: string;
  branchName: string;
  semanticZh: string;
  status: 'draft';
}

export const BRANCH_SEMANTIC_LIBRARY: { meta: { version: string; source: string; generated: string; model: string; count: number; status_note: string }; entries: BranchSemanticEntry[] } = {
 "meta": {
  "version": "branch-semantic.1",
  "source": "T2-02 本地 Qwen3.8-27B@8080 起草（禁词门禁+断点续传），待命理顾问终审",
  "generated": "2026-09-13",
  "model": "Qwen3.8-27B-UD-VLM",
  "count": 31,
  "status_note": "全部 draft；不注入 AI prompt（M3 段保持零 LLM 生成），仅作终审内容资产"
 },
 "entries": [
  {
   "branchKey": "bazi:shishen:qisha:七杀有制",
   "archetypeKey": "bazi:shishen:qisha",
   "termKey": "七杀",
   "branchName": "七杀有制·食伤制杀",
   "semanticZh": "你的能量倾向于通过创造性输出实现顺畅流转，建议保持表达与行动的连贯性，往往能避免压力淤积，维持身心状态的轻盈与平衡。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:qisha:七杀无制",
   "archetypeKey": "bazi:shishen:qisha",
   "termKey": "七杀",
   "branchName": "七杀无制·杀重身轻",
   "semanticZh": "你的能量倾向于向外快速耗散，可能因过度承担而陷入紧绷状态，往往需要刻意放缓节奏，通过规律休息来稳固内在根基，避免在高压下透支。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:qisha:七杀佩印",
   "archetypeKey": "bazi:shishen:qisha",
   "termKey": "七杀",
   "branchName": "七杀佩印·杀印相生",
   "semanticZh": "你的能量倾向于在高压下向内收敛并转化为深层定力，建议将外部冲击视为滋养根基的养分，往往能借此沉淀出更稳固的内在秩序与专业厚度。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:qisha:七杀",
   "archetypeKey": "bazi:shishen:qisha",
   "termKey": "七杀",
   "branchName": "七杀·驱动与压力通用",
   "semanticZh": "这股能量往往如急流般迅猛，倾向于在高压下激发潜能，建议你顺势而为，将压力转化为行动力，避免在紧绷状态下强行对抗，以免内耗加剧。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:zhengguan:正官得用",
   "archetypeKey": "bazi:shishen:zhengguan",
   "termKey": "正官",
   "branchName": "正官得用·身强任官",
   "semanticZh": "你的能量倾向于在稳定的框架内有序释放，建议将精力聚焦于构建可预期的职业路径，往往能借助外部规则的支撑实现状态的平稳进阶。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:zhengguan:正官重",
   "archetypeKey": "bazi:shishen:zhengguan",
   "termKey": "正官",
   "branchName": "正官重·身弱承压",
   "semanticZh": "你的能量流动倾向于内敛与承接，建议将外部压力转化为内在秩序，往往能避免耗散，在稳态中积蓄势能。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:zhengguan:正官",
   "archetypeKey": "bazi:shishen:zhengguan",
   "termKey": "正官",
   "branchName": "正官·规范与责任通用",
   "semanticZh": "你的能量倾向于在秩序中寻求稳定，建议将这股力量用于构建可持续的框架，往往能避免过度紧绷，从而在责任与自我关怀间找到平衡。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:zhengcai:身强担财",
   "archetypeKey": "bazi:shishen:zhengcai",
   "termKey": "正财",
   "branchName": "身强担财·财库可守",
   "semanticZh": "你的能量流动倾向于内敛与蓄积，建议将精力聚焦于夯实根基与优化流程，往往能避免过度扩张带来的耗散，保持稳健的守成状态。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:zhengcai:财多身弱",
   "archetypeKey": "bazi:shishen:zhengcai",
   "termKey": "正财",
   "branchName": "财多身弱·量入为出",
   "semanticZh": "你的能量流动倾向于向外发散，建议将重心从追逐增量转向稳固存量，往往通过降低消耗速率来维持内在平衡，需留意因过度付出导致的精力透支状态。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:zhengcai:正财",
   "archetypeKey": "bazi:shishen:zhengcai",
   "termKey": "正财",
   "branchName": "正财·稳定经营通用",
   "semanticZh": "你的能量倾向于平稳流动，适合将精力聚焦于核心业务的精细化打磨，在保持节奏感的同时，留意避免因过度求稳而错失微调的时机。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:piancai:身强驭偏财",
   "archetypeKey": "bazi:shishen:piancai",
   "termKey": "偏财",
   "branchName": "身强驭偏财·活水开源",
   "semanticZh": "你的能量流动倾向于向外舒展，建议保持开放心态以接纳多元机会，往往能在动态平衡中实现资源的高效转化与增值。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:piancai:偏财身弱",
   "archetypeKey": "bazi:shishen:piancai",
   "termKey": "偏财",
   "branchName": "偏财身弱·过手流水",
   "semanticZh": "你的能量场倾向于快速吞吐而非深层蓄积，建议将流动的资源导向长期沉淀，避免在状态波动时强行截留，让财富如水流般自然循环。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:piancai:偏财",
   "archetypeKey": "bazi:shishen:piancai",
   "termKey": "偏财",
   "branchName": "偏财·机会与资源通用",
   "semanticZh": "你的能量倾向于向外发散以捕捉机遇，建议保持敏锐并快速响应，但需注意避免因过度追逐流动资源而消耗内在定力，让机会在有序中落地。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:shishen:食神吐秀",
   "archetypeKey": "bazi:shishen:shishen",
   "termKey": "食神",
   "branchName": "食神吐秀·身强创作",
   "semanticZh": "你倾向于将充沛的内在能量转化为温和且具象的滋养，建议顺势将精力投入作品打磨，往往能形成稳定且自洽的创作节奏。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:shishen:食神泄气",
   "archetypeKey": "bazi:shishen:shishen",
   "termKey": "食神",
   "branchName": "食神泄气·节能充电",
   "semanticZh": "你的能量流动倾向于内敛蓄积，可能更利于深度思考而非即时表达，往往适合将注意力从外部反馈转向内在滋养，以维持长期的稳定输出。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:shishen:食神",
   "archetypeKey": "bazi:shishen:shishen",
   "termKey": "食神",
   "branchName": "食神·表达与滋养通用",
   "semanticZh": "你的能量倾向于温和外溢，适合将内在感受转化为具体的生活质感，建议保持节奏的松弛感，避免过度消耗心力。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:shangguan:伤官配印",
   "archetypeKey": "bazi:shishen:shangguan",
   "termKey": "伤官",
   "branchName": "伤官配印·才华落地",
   "semanticZh": "你的能量倾向于在深度思考中沉淀，建议将表达欲转化为专业积累，往往能避免锋芒外露带来的消耗，保持内在的从容与稳定。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:shangguan:伤官泄秀",
   "archetypeKey": "bazi:shishen:shangguan",
   "termKey": "伤官",
   "branchName": "伤官泄秀·身强展才",
   "semanticZh": "你的能量倾向于向外顺畅流动，建议将充沛的精力转化为持续创作的动力，往往能形成良性循环；需注意避免过度消耗导致的状态透支，保持节奏的张弛有度。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:shangguan:伤官",
   "archetypeKey": "bazi:shishen:shangguan",
   "termKey": "伤官",
   "branchName": "伤官·才华表达通用",
   "semanticZh": "你的能量倾向于向外喷涌，建议将其导向创作或专业深耕，往往能转化为独特价值，需留意情绪波动对人际关系的潜在影响。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:zhengyin:身弱逢印",
   "archetypeKey": "bazi:shishen:zhengyin",
   "termKey": "正印",
   "branchName": "身弱逢印·印星护身",
   "semanticZh": "你的能量倾向于由外向内缓慢渗透，建议保持开放心态接纳滋养，往往能缓解紧绷状态，注意避免过度依赖而削弱自主节奏。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:zhengyin:身强印重",
   "archetypeKey": "bazi:shishen:zhengyin",
   "termKey": "正印",
   "branchName": "身强印重·能量内滞",
   "semanticZh": "你倾向于将过剩的内在资源转化为温和的滋养力，建议通过分享或创作让能量自然外溢，往往能缓解因过度内守带来的停滞感，使状态更趋轻盈。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:zhengyin:正印",
   "archetypeKey": "bazi:shishen:zhengyin",
   "termKey": "正印",
   "branchName": "正印·滋养与信用通用",
   "semanticZh": "你的能量倾向于平稳内收，适合在信任关系中缓慢蓄力，往往能借由口碑积累获得支持，需注意避免过度依赖外部认可而忽视自身节奏。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:pianyin:偏印护身",
   "archetypeKey": "bazi:shishen:pianyin",
   "termKey": "偏印",
   "branchName": "偏印护身·独特补给",
   "semanticZh": "你的能量倾向于在静默中完成内化与转化，建议保持适度的独处以滋养内在，往往能避免外界干扰导致的能量耗散，从而维持独特的创造力。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:pianyin:枭神夺食",
   "archetypeKey": "bazi:shishen:pianyin",
   "termKey": "偏印",
   "branchName": "枭神夺食·守护表达",
   "semanticZh": "你的能量倾向于在自我审视中形成内循环，建议允许表达以粗糙形态先落地，往往能打破过度防御带来的停滞感。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:pianyin:偏印",
   "archetypeKey": "bazi:shishen:pianyin",
   "termKey": "偏印",
   "branchName": "偏印·直觉与专精通用",
   "semanticZh": "你的能量倾向于向内收敛并聚焦于特定领域，往往在深度钻研中积蓄势能，建议顺应这种非线性的节奏，在独处中保持敏锐，避免被外界喧嚣打乱内在秩序。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:bijian:身弱逢比",
   "archetypeKey": "bazi:shishen:bijian",
   "termKey": "比肩",
   "branchName": "身弱逢比·同侪得助",
   "semanticZh": "你的能量流动倾向于向外寻求共振，往往在群体互动中恢复元气，建议保持开放心态接纳外界支持，注意避免过度依赖他人节奏而模糊自我边界。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:bijian:比肩竞旺",
   "archetypeKey": "bazi:shishen:bijian",
   "termKey": "比肩",
   "branchName": "比肩竞旺·自主与竞合",
   "semanticZh": "你的能量倾向于向外扩张以寻求独立空间，建议将这股张力转化为对外部环境的探索动力，往往能避免内部消耗，保持状态舒展。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:bijian:比肩",
   "archetypeKey": "bazi:shishen:bijian",
   "termKey": "比肩",
   "branchName": "比肩·并肩与自主通用",
   "semanticZh": "你的能量倾向于向外流动以寻求共鸣，建议保持自主节奏，往往能在同频互动中实现自我确认，需注意避免过度比较带来的内耗。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:jiecai:身弱逢劫",
   "archetypeKey": "bazi:shishen:jiecai",
   "termKey": "劫财",
   "branchName": "身弱逢劫·患难帮扶",
   "semanticZh": "你的能量倾向于向外流动以换取支持，往往通过适度示弱来激活周围人的善意，建议保持开放心态，避免过度消耗自身心力。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:jiecai:比劫争财",
   "archetypeKey": "bazi:shishen:jiecai",
   "termKey": "劫财",
   "branchName": "比劫争财·守护成果",
   "semanticZh": "你的能量倾向于在协作中寻求平衡，往往通过明确边界来稳固成果，建议保持清醒的分配意识，以维护关系的长久和谐。",
   "status": "draft"
  },
  {
   "branchKey": "bazi:shishen:jiecai:劫财",
   "archetypeKey": "bazi:shishen:jiecai",
   "termKey": "劫财",
   "branchName": "劫财·行动与共同体通用",
   "semanticZh": "你的能量倾向于向外流动以换取联结，建议将冲劲转化为协作动力，留意因过度投入而导致的资源快速消耗状态。",
   "status": "draft"
  }
 ]
};
