// L4 分支白话定义（T2-03，V4.0 词库域3/4 原型数据）。
// 形制对齐国学资产线 lexicon branch schema：branchName/priority/selectionConditions/vernacularZh。
// ⚠️ 全部为 draft 起草稿：白话文案由本线程按 V4.0 示例风格（能量语言、禁吉凶词、趋势表达）
// 起草，未经命理顾问终审，不标注任何出处（不伪造 source）。
// strength 七级口径来自 T1 审计 baziStrengthAnalyzer（三倾向多数表决，非分数）。

export interface BranchCondition {
  /** 日主旺衰七级（极强/身强/偏强/中和/偏弱/身弱/极弱）；命中其一即成立。 */
  day_master_strength?: string[];
  /** 相关术语：出现其一即成立（ANY）。 */
  related_terms_present?: string[];
  /** 排除术语：出现其一即不成立（须全部缺席）。 */
  related_terms_absent?: string[];
}

export interface BranchDefinition {
  /** 分支唯一键（三段式 archetype_key + 分支段）。 */
  branchKey: string;
  archetypeKey: string;
  /** 所属术语（十神名）。 */
  termKey: string;
  branchName: string;
  /** 多命中取 priority 最小（fallback 不设条件，priority 99）。 */
  priority: number;
  conditions: BranchCondition;
  vernacularZh: string;
  positiveKeywords: string[];
  cautionKeywords: string[];
  status: 'draft';
}

export interface BranchTermGroup {
  archetypeKey: string;
  termKey: string;
  branches: BranchDefinition[];
}

const STRENGTH_STRONG = ['极强', '身强', '偏强'] as const;
const STRENGTH_WEAK = ['身弱', '极弱'] as const;

function branch(
  archetypeKey: string,
  termKey: string,
  branchName: string,
  priority: number,
  conditions: BranchCondition,
  vernacularZh: string,
  positiveKeywords: string[],
  cautionKeywords: string[],
): BranchDefinition {
  return {
    branchKey: `${archetypeKey}:${branchName.split('·')[0]}`,
    archetypeKey,
    termKey,
    branchName,
    priority,
    conditions,
    vernacularZh,
    positiveKeywords,
    cautionKeywords,
    status: 'draft',
  };
}

export const BRANCH_TERM_GROUPS: BranchTermGroup[] = [
  {
    archetypeKey: 'bazi:shishen:qisha',
    termKey: '七杀',
    branches: [
      branch(
        'bazi:shishen:qisha',
        '七杀',
        '七杀有制·食伤制杀',
        1,
        { related_terms_present: ['食神', '伤官'] },
        '你的盘里带着一股很强的外部驱动力，而它同时拥有泄导的出口（食伤）。这意味着高压不会被憋在心里，而是倾向于转化为执行力与成果——像把湍急的水流接上了水轮机。适合设定有挑战性的目标，用节奏化的产出把压力变成作品。',
        ['转化', '执行力', '挑战性目标'],
        ['节奏管理', '避免过度消耗'],
      ),
      branch(
        'bazi:shishen:qisha',
        '七杀',
        '七杀无制·杀重身轻',
        2,
        { day_master_strength: [...STRENGTH_WEAK], related_terms_absent: ['食神', '伤官'] },
        '你目前感受到的外部压力可能较大，或许来自工作、人际关系或对自己的高要求。这不是"命不好"，而是你的能量正处于蓄力期——像弹簧被压到最低点，反弹的力量也最大。当下最重要的课题是建立支持系统：信任的朋友、导师、让你放松的爱好，以及规律的休息。',
        ['韧性', '蓄力', '反弹'],
        ['压力管理', '边界感', '自我消耗'],
      ),
      branch(
        'bazi:shishen:qisha',
        '七杀',
        '七杀佩印·杀印相生',
        3,
        { related_terms_present: ['正印', '偏印'] },
        '压力与资源在你的盘里形成了转化通道（印星化杀）：外部的强驱动倾向于沉淀为资历、专业认可与内在定力。适合把挑战放进"学习—认证—带人"这类有复利的轨道里，压力会逐步变成你的权威感。',
        ['沉淀', '资历', '权威感'],
        ['避免硬扛', '循序渐进'],
      ),
      branch(
        'bazi:shishen:qisha',
        '七杀',
        '七杀·驱动与压力通用',
        99,
        {},
        '七杀代表一股强驱动的外部能量：它可能以高强度任务、重要责任或竞争环境的形式出现在你的生活里。它倾向于带来快速成长，也需要你主动搭建泄压通道（运动、输出、倾诉），让这股力量为你所用而不是压垮你。',
        ['驱动力', '成长', '抗压'],
        ['泄压通道', '休息节律'],
      ),
    ],
  },
  {
    archetypeKey: 'bazi:shishen:zhengguan',
    termKey: '正官',
    branches: [
      branch(
        'bazi:shishen:zhengguan',
        '正官',
        '正官得用·身强任官',
        1,
        { day_master_strength: [...STRENGTH_STRONG] },
        '你自身的能量储备足以承接规则与责任（身强任官）：体制、职级、口碑这类"正式认可"的通道对你倾向友好。适合在清晰的规则体系里争取位置——晋升、职称、公开的 reputational 资产，你的稳态输出会被看见。',
        ['规则', '认可', '稳态输出'],
        ['避免僵化', '保持弹性'],
      ),
      branch(
        'bazi:shishen:zhengguan',
        '正官',
        '正官重·身弱承压',
        2,
        { day_master_strength: [...STRENGTH_WEAK] },
        '责任与规范对你来说目前可能偏重：规则、期待、考核像一层层叠上来的托盘。你的能量更适合"借力"而不是"硬撑"——找互补的搭档、把职权范围内的事做扎实、学会向上要资源，压力会转化为可累积的信用。',
        ['信用', '借力', '扎实'],
        ['过度承诺', '自我加压'],
      ),
      branch(
        'bazi:shishen:zhengguan',
        '正官',
        '正官·规范与责任通用',
        99,
        {},
        '正官代表规则、责任与正式认可的能量：它倾向于让你在意"做对的事"和"被体系认可"。这股能量适合投向职业晋升、公共信用与长期声誉，同时提醒你区分"自律"与"自我苛责"。',
        ['自律', '正式认可'],
        ['自我苛责'],
      ),
    ],
  },
  {
    archetypeKey: 'bazi:shishen:zhengcai',
    termKey: '正财',
    branches: [
      branch(
        'bazi:shishen:zhengcai',
        '正财',
        '身强担财·财库可守',
        1,
        { day_master_strength: [...STRENGTH_STRONG] },
        '你的能量状态倾向于"担得住财"：通过稳定经营、专业技能与长期主义积累的资产，倾向于留在你手里并持续复利。适合把主业的确定性做厚——现金流、技能溢价、可积累的资产。',
        ['复利', '长期主义', '现金流'],
        ['过度保守'],
      ),
      branch(
        'bazi:shishen:zhengcai',
        '正财',
        '财多身弱·量入为出',
        2,
        { day_master_strength: [...STRENGTH_WEAK] },
        '眼前的财务与机会可能不少，但你的能量更倾向于"过手"而非"留住"——像捧水，捧得越紧漏得越快。当下更适合做减法：锁定一两个确定性收入来源、建立自动储蓄机制，把"守住"排在"拿到"前面。',
        ['守住', '确定性', '减法'],
        ['摊子过大', '过手流水'],
      ),
      branch(
        'bazi:shishen:zhengcai',
        '正财',
        '正财·稳定经营通用',
        99,
        {},
        '正财代表通过劳动与经营稳定获得的能量：它倾向于奖励耐心、专业与持续性。这股能量适合投向主业深耕与稳健积累，提醒你在"赚"与"守"之间保持平衡。',
        ['耐心', '持续性'],
        ['守成过度'],
      ),
    ],
  },
  {
    archetypeKey: 'bazi:shishen:piancai',
    termKey: '偏财',
    branches: [
      branch(
        'bazi:shishen:piancai',
        '偏财',
        '身强驭偏财·活水开源',
        1,
        { day_master_strength: [...STRENGTH_STRONG] },
        '你的能量足以同时驾驭多条水源：副业、投资视野、人脉资源这类"活水"倾向于被你有效调度。适合在主业稳定的前提下小步试错、拓宽收入结构，让灵活性与确定性互为backup。',
        ['开源', '灵活调度', '多元'],
        ['分散过度'],
      ),
      branch(
        'bazi:shishen:piancai',
        '偏财',
        '偏财身弱·过手流水',
        2,
        { day_master_strength: [...STRENGTH_WEAK] },
        '机会型的收益对你来说可能来得快也去得快，像潮水一样有节奏。与其追浪，不如修堤：把意外收入自动转入储蓄或资产，控制杠杆与投机仓位，你的财务节奏会稳很多。',
        ['修堤', '自动储蓄'],
        ['追涨', '杠杆', '投机'],
      ),
      branch(
        'bazi:shishen:piancai',
        '偏财',
        '偏财·机会与资源通用',
        99,
        {},
        '偏财代表流动性强、机会型的能量：它可能以副业、投资、人脉馈赠或跨界机会的形式出现。它倾向于奖励敏感度与行动力，同时提醒你给"随机的好运"配上纪律的容器。',
        ['敏感度', '行动力'],
        ['投机心态'],
      ),
    ],
  },
  {
    archetypeKey: 'bazi:shishen:shishen',
    termKey: '食神',
    branches: [
      branch(
        'bazi:shishen:shishen',
        '食神',
        '食神吐秀·身强创作',
        1,
        { day_master_strength: [...STRENGTH_STRONG] },
        '你的内在能量充沛且有表达出口：创作、教学、美食、生活美学这类"滋养型输出"倾向于自然流淌。这是适合打磨作品、建立个人风格的阶段——把喜欢的事做成可持续的输出，会同时滋养你自己和他人。',
        ['创作', '个人风格', '滋养'],
        ['贪多求全'],
      ),
      branch(
        'bazi:shishen:shishen',
        '食神',
        '食神泄气·节能充电',
        2,
        { day_master_strength: [...STRENGTH_WEAK] },
        '你的表达与付出可能正在持续消耗内在能量——输出很多，充电很少。当下更适合把节奏放慢：减少不必要的承诺，把输出聚焦在最高价值的一两件事上，给自己留出恢复期。',
        ['聚焦', '恢复期'],
        ['过度输出', '能量透支'],
      ),
      branch(
        'bazi:shishen:shishen',
        '食神',
        '食神·表达与滋养通用',
        99,
        {},
        '食神代表表达、品味与滋养的能量：它倾向于让你从创作与生活中获得真实快乐。这股能量适合投向作品、生活方式与人际温度，也提醒你照顾好自己的节奏。',
        ['表达', '品味'],
        ['节奏失控'],
      ),
    ],
  },
  {
    archetypeKey: 'bazi:shishen:shangguan',
    termKey: '伤官',
    branches: [
      branch(
        'bazi:shishen:shangguan',
        '伤官',
        '伤官配印·才华落地',
        1,
        { related_terms_present: ['正印', '偏印'] },
        '你的锋芒与你的定力形成了一对好搭档（印制伤）：才华倾向于被学习和思考"接住"，转化为专业深度而非单纯的表达欲。适合做需要原创性+专业性的事——研究、写作、内容、产品创新。',
        ['原创', '专业深度'],
        ['表达越界'],
      ),
      branch(
        'bazi:shishen:shangguan',
        '伤官',
        '伤官泄秀·身强展才',
        2,
        { day_master_strength: [...STRENGTH_STRONG] },
        '你的能量足以支撑高强度的自我表达：舞台、作品、观点输出倾向于放大你的影响力。适合主动争取展示位，让才华被看见；同时留意表达的分寸感，把"真话"包装成"有效的话"。',
        ['影响力', '展示位'],
        ['言辞锋利', '分寸感'],
      ),
      branch(
        'bazi:shishen:shangguan',
        '伤官',
        '伤官·才华表达通用',
        99,
        {},
        '伤官代表突破常规的才华与表达能量：它倾向于带来创造力与批判性思维，也容易在人际里留下棱角。把它投向作品与专业，比投向争论更能积累你的价值。',
        ['创造力', '批判性思维'],
        ['棱角', '争论'],
      ),
    ],
  },
  {
    archetypeKey: 'bazi:shishen:zhengyin',
    termKey: '正印',
    branches: [
      branch(
        'bazi:shishen:zhengyin',
        '正印',
        '身弱逢印·印星护身',
        1,
        { day_master_strength: [...STRENGTH_WEAK] },
        '你的盘里有明显的"被托底"能量：长辈缘、学习运、贵人资源倾向于在你低电量时补给你。这是适合学习、考证、借助平台与导师势能的阶段——善用"被支持"也是一种能力。',
        ['托底', '贵人', '学习运'],
        ['依赖心'],
      ),
      branch(
        'bazi:shishen:zhengyin',
        '正印',
        '身强印重·能量内滞',
        2,
        { day_master_strength: ['极强', '身强'] },
        '你的内在资源已经比较充裕，想法、知识与安全感都不少——当下的课题是"流动"：把积累的东西输出出来（教学、写作、带人），能量会从内滞转向循环，反而更有活力。',
        ['流动', '输出', '循环'],
        ['思想内耗', '行动迟缓'],
      ),
      branch(
        'bazi:shishen:zhengyin',
        '正印',
        '正印·滋养与信用通用',
        99,
        {},
        '正印代表被滋养、被认可与信用的能量：它倾向于带来学习力、平台资源与口碑。适合把能量投入在"积累确定性"的事上——学历、资质、信任关系。',
        ['学习力', '口碑'],
        ['路径依赖'],
      ),
    ],
  },
  {
    archetypeKey: 'bazi:shishen:pianyin',
    termKey: '偏印',
    branches: [
      branch(
        'bazi:shishen:pianyin',
        '偏印',
        '偏印护身·独特补给',
        1,
        { day_master_strength: [...STRENGTH_WEAK] },
        '你的能量倾向于从"非主流通道"获得补给：小众领域、独处时光、跨界知识都可能成为你的充电桩。这是适合深耕一门独特技艺的阶段——你的差异化，正是你的能量来源。',
        ['差异化', '独处充电'],
        ['自我封闭'],
      ),
      branch(
        'bazi:shishen:pianyin',
        '偏印',
        '枭神夺食·守护表达',
        2,
        { related_terms_present: ['食神'] },
        '你的盘里同时有表达欲和一股"质疑自己表达"的能量（枭夺食）：容易在输出前反复自我审查。建议给创作设"先完成再完美"的流程，先让作品存在，再让评判上场。',
        ['先完成', '自我接纳'],
        ['自我审查', '内耗'],
      ),
      branch(
        'bazi:shishen:pianyin',
        '偏印',
        '偏印·直觉与专精通用',
        99,
        {},
        '偏印代表直觉、钻研与差异化的能量：它倾向于让你在小众领域有超常的学习力，也容易感到与主流节奏不同步。找到属于你的"赛道"，这种不同步就会变成稀缺性。',
        ['直觉', '钻研', '稀缺性'],
        ['孤岛感'],
      ),
    ],
  },
  {
    archetypeKey: 'bazi:shishen:bijian',
    termKey: '比肩',
    branches: [
      branch(
        'bazi:shishen:bijian',
        '比肩',
        '身弱逢比·同侪得助',
        1,
        { day_master_strength: [...STRENGTH_WEAK] },
        '同侪力量对你当前倾向于"补"而不是"耗"：合作伙伴、同行社群、朋友合伙都可能成为你的能量外挂。适合用"搭伙"的方式做事情，让并肩者分担重量。',
        ['同侪', '搭伙', '社群'],
        ['边界模糊'],
      ),
      branch(
        'bazi:shishen:bijian',
        '比肩',
        '比肩竞旺·自主与竞合',
        2,
        { day_master_strength: [...STRENGTH_STRONG] },
        '你的自我能量已经很强，再叠加同侪能量时容易出现"谁说了算"的张力。把竞争意识投向外部市场而非内部伙伴，用分工与规则锁定合作框架，竞合关系会顺畅很多。',
        ['竞合', '分工', '自主性'],
        ['内部竞争', '固执'],
      ),
      branch(
        'bazi:shishen:bijian',
        '比肩',
        '比肩·并肩与自主通用',
        99,
        {},
        '比肩代表与自己同频的能量：朋友、同行、另一个"自己"。它倾向于带来支持与共鸣，也带来比较与竞争。健康的状态是"同行不内耗"——把别人当镜子，而不是对手。',
        ['共鸣', '支持'],
        ['比较心'],
      ),
    ],
  },
  {
    archetypeKey: 'bazi:shishen:jiecai',
    termKey: '劫财',
    branches: [
      branch(
        'bazi:shishen:jiecai',
        '劫财',
        '身弱逢劫·患难帮扶',
        1,
        { day_master_strength: [...STRENGTH_WEAK] },
        '劫财的能量对你当前倾向于"救急帮扶"：在你资源不足时，朋友、兄弟、共同体可能成为你的缓冲垫。敢于求助、善于借力，是你这个阶段的智慧。',
        ['帮扶', '共同体'],
        ['人情债', '边界'],
      ),
      branch(
        'bazi:shishen:jiecai',
        '劫财',
        '比劫争财·守护成果',
        2,
        { related_terms_present: ['正财', '偏财'] },
        '你的盘里"求财能量"与"分财能量"并存：合作中容易出现成果分配的话题。提前把账目、股权、分成规则白纸黑字写清楚，是对关系最好的保护——亲兄弟明算账，反而更亲。',
        ['规则前置', '透明分配'],
        ['财务模糊', '口头条款'],
      ),
      branch(
        'bazi:shishen:jiecai',
        '劫财',
        '劫财·行动与共同体通用',
        99,
        {},
        '劫财代表行动力与共同体的能量：它倾向于带来冲劲、侠气与人际联结，也自带"散财"倾向。适合投向团队作战与共同目标，同时给自己的钱包设一道从容的闸门。',
        ['冲劲', '侠气'],
        ['冲动消费', '散财'],
      ),
    ],
  },
];

/** 按术语名或 archetypeKey（冒号/点号/连字符均可）查找分支组。 */
export function findBranchGroup(termOrKey: string): BranchTermGroup | undefined {
  const norm = normalizeKey(termOrKey);
  return BRANCH_TERM_GROUPS.find(
    (g) => normalizeKey(g.termKey) === norm || normalizeKey(g.archetypeKey) === norm,
  );
}

function normalizeKey(key: string): string {
  return key.replace(/[:.\-]/g, '').trim().toLowerCase();
}
