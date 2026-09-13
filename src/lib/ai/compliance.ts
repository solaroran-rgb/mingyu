// M1 运行时约束（468 红线 2.1-03/05/06/15/16/18/19、2.2-01 的服务端落地）。
// 范围：temperature=0 由 proxy 调用侧锁定；本模块提供 system 合规铁律、敏感领域
// 约束注入、术语口径查表（零 LLM 生成）、输出流内熔断。全部为确定性代码。

import { LEXICON_TRANSLATOR_SEED } from '../../data/lexicon-translator-seed';

export const COMPLIANCE_VERSION = 'm1.1'; // m1.1: 新增 T2-01 心理危机干预层
export const DICT_VERSION = LEXICON_TRANSLATOR_SEED.meta.dict_version;

/** 解读铁律：拼入 system message，对单轮与多轮共用。 */
export const COMPLIANCE_RULES = [
  '解读铁律（必须逐条遵守）：',
  '1. 只基于资料中的盘面证据推论，不得虚构资料之外的命理事实，不得自相矛盾。',
  '2. 一律使用趋势化、概率化表达（倾向于／可能／建议关注），严禁绝对化断言（必、一定、注定、绝对、必死、大凶、血光之灾等）。',
  '3. 不提供医疗诊断、法律行动或具体金融操作建议；涉及健康、法律、财务话题时只描述趋势，并建议咨询持证专业人士。',
  '4. 不推算、不暗示任何与死亡时间或寿数相关的结论。',
  '5. 命理术语首次出现时用一句白话解释，保持中性、不恐吓、不评判。',
].join('\n');

/** 敏感领域：命中后在 system 追加领域级约束（不改写用户问题，避免语义漂移与误杀）。 */
const SENSITIVE_DOMAINS: Array<{ label: string; pattern: RegExp; guidance: string }> = [
  {
    label: '健康医疗',
    pattern: /疾病|病症|癌症|肿瘤|手术|住院|吃药|服药|抑郁|健康|疾厄|病能不能好|体检/,
    guidance:
      '- 本问题涉及健康医疗：只描述命盘呈现的趋势倾向，严禁出现任何具体疾病名称、诊断结论、治疗、手术或用药建议，并明确建议用户咨询专业医师。',
  },
  {
    label: '法律纠纷',
    pattern: /官司|诉讼|起诉|上诉|律师|报警|牢狱|监狱|离婚/,
    guidance:
      '- 本问题涉及法律纠纷：只描述趋势与注意事项，严禁给出是否起诉、离婚、报警等具体法律行动指令，并建议用户咨询执业律师。',
  },
  {
    label: '财务投资',
    pattern: /投资|股票|基金|期货|抄底|满仓|清仓|回本|炒|买房|破财|负债|破产|贷款|赌/,
    guidance:
      '- 本问题涉及财务投资：只描述财务趋势与风险倾向，严禁给出买卖标的、具体金额、仓位等任何操作指令，并提示投资有风险、决策需谨慎。',
  },
  {
    label: '生死寿数',
    pattern: /死|寿|夭折|阳寿|丧事|去世|能活/,
    guidance:
      '- 本问题可能涉及生死寿数：严禁推算、暗示或回应任何与死亡时间、寿数相关的结论，应温和引导至健康生活方式的正向建议。',
  },
];

export function detectSensitiveGuidance(userText: string): string {
  const hits = SENSITIVE_DOMAINS.filter((d) => d.pattern.test(userText));
  if (hits.length === 0) return '';
  return ['敏感领域约束（本次问题命中，优先级高于一般表达偏好）：', ...hits.map((d) => d.guidance)].join(
    '\n',
  );
}

/**
 * 术语口径查表：扫描盘面/问题中出现的词库术语（仅 ≥2 字，避免单字干支误命中），
 * 以专业释义+白话注入 system，统一术语解释口径（2.1-15 第一步；零生成、纯查表）。
 */
const GLOSSARY_HINTS = LEXICON_TRANSLATOR_SEED.entries
  .filter((e) => e.displayZh.length >= 2)
  .map((e) => ({
    term: e.displayZh,
    text: `· ${e.displayZh}：${e.professionalDef}${
      e.translations?.zh ? `（白话：${e.translations.zh}）` : ''
    }`,
  }));

export function buildTermHints(userText: string, max = 12): string {
  const hits = GLOSSARY_HINTS.filter((h) => userText.includes(h.term)).slice(0, max);
  if (hits.length === 0) return '';
  return ['术语口径参考（解释下列术语时以本口径为准）：', ...hits.map((h) => h.text)].join('\n');
}

/**
 * 输出流内熔断（2.1-06 服务端形态）：对累积输出做高危表述检测。
 * SSE 已转发内容无法撤回，熔断即停止转发后续内容并追加安全收尾。
 */
const FUSE_PATTERNS: Array<RegExp> = [
  /必死|活不过\s*\d*\s*岁?|阳寿已尽|寿数将尽|血光之灾|夭折|死于[^，。]{0,6}之?命|丧命/,
  /(确诊|患有)[^，。！？]{0,10}(癌|肿瘤)|需要?(接受)?(手术|化疗|放疗)|服用[^，。]{0,6}药(物)?治疗/,
  /(卖出?|抛售?|清仓|满仓|抄底|加仓)(你)?(手[上中]?的?)?(全部|所有)?(股票|基金|期货|房产)|立即(买入|买进|抛售)|把(你)?(所有|全部)?(钱|资金)(全部)?(投入|转到)/,
  /(建议|应该|应当|必须|不妨|赶紧|立即)(你)?(去)?(离婚|起诉|报警|上诉)/,
  /注定(会)?(离婚|破产|失败|坐牢|分手)|命里注定/,
];

export type FuseResult = { fused: boolean; reason?: string };

export class OutputFuse {
  private buffered = '';
  private fused = false;
  private fuseReason: string | undefined;

  /** 检查新增增量；返回是否触发熔断。熔断后持续返回 true。 */
  check(delta: string): FuseResult {
    if (this.fused) return { fused: true, reason: this.fuseReason };
    this.buffered += delta;
    for (const pattern of FUSE_PATTERNS) {
      const m = pattern.exec(this.buffered);
      if (m) {
        this.fused = true;
        this.fuseReason = `输出命中高危表述（${m[0].slice(0, 24)}…）`;
        return { fused: true, reason: this.fuseReason };
      }
    }
    if (!this.warned) {
      for (const pattern of WARN_PATTERNS) {
        const m = pattern.exec(this.buffered);
        if (m) {
          this.warned = true;
          this.warnReason = `输出含断言式表述（${m[0].slice(0, 24)}…），建议复核`;
          break;
        }
      }
    }
    return { fused: false };
  }

  get isFused(): boolean {
    return this.fused;
  }

  get reason(): string | undefined {
    return this.fuseReason;
  }

  get isWarned(): boolean {
    return this.warned;
  }

  get warning(): string | undefined {
    return this.warnReason;
  }
}

/**
 * 第二层·语义盲区警示（M4）：宽阈值断言句式检测——命中不熔断（避免误杀），
 * 由 proxy 在流尾发 meta.warning 事件供前端/埋点消费。
 * 来源：本地 8080 实测发现「牌面整体指向是」类表述可绕过第一层「建议+离婚」结构。
 */
const WARN_PATTERNS: Array<RegExp> = [
  /指向\s*[「"']?是[」"']?|答案是|结论是(肯定|明确)|明确表示(应该|可以|会)/,
  /(你|您)(会|将|终将|终究)(离婚|破产|坐牢|失败|发大财)/,
  /切勿?(离婚|分手|辞职|投资)|必须马上去/,
  /逃不掉|躲不过|在劫难逃|命中注定/,
];

/** 熔断后的安全收尾文案（2.1-16 形态之一）。 */
export const FUSED_NOTICE =
  '\n\n——\n⚠️ 系统提示：以上解读包含超出命理咨询边界的表述，已在生成过程中截断。命理解读仅供趋势参考，健康、法律、财务等重大事项请咨询持证专业人士。';

// ---------- 心理危机干预层（T2-01，纲要 10.1 铁律） ----------
// 优先级高于一切合规/熔断规则：命中即注入危机干预指令；热线信息由 proxy 在流尾
// 以确定性文案直接输出（不经过 OutputFuse，保证不被熔断截断吞掉）。

export const CRISIS_VERSION = 'crisis.1';

/** AI 链路支持的语言档（与 proxy SUPPORTED_AI_LOCALES 对齐，避免循环依赖在此内联）。 */
export type CrisisLocale = 'zh-CN' | 'en' | 'es-ES' | 'ja' | 'ko-KN' | 'th-TH' | 'vi-VN';

/**
 * 危机检测词表（中英双语，取词组降低误杀）：自残/抑郁/轻生倾向。
 * 命中后宁可信其有——误报代价只是一条温和的热线提示，漏报代价不可接受。
 */
const CRISIS_PATTERNS: Array<RegExp> = [
  /自杀|轻生|想死|想去死|寻死|了结(自己|一切|生命)?|结束(自己|一切|生命|这条命)/,
  /不想活|活不下去|活着没(意思|意义)|活着有什么(意思|意义)|撑不下去|万念俱灰|没有希望了/,
  /自残|自伤|自虐|割腕|吞药|上吊|跳楼|跳桥|烧炭|想解脱/,
  /抑郁|极度绝望|重度忧郁/,
  /suicid\w*|kill\s+(myself|me)\b|end(?:ing)?\s+(my\s+)?life\b|want\s+to\s+die|better\s+off\s+dead/i,
  /self[-\s]?harm|hurt(ing)?\s+myself|cut(ting)?\s+myself|don'?t\s+want\s+to\s+live|no\s+reason\s+to\s+live/i,
  /depress(?:ed|ion|ive)/i,
];

/** 检测用户输入中的心理危机倾向信号。 */
export function detectCrisis(userText: string): boolean {
  return CRISIS_PATTERNS.some((p) => p.test(userText));
}

/**
 * 各语言心理援助热线资源（7 语言齐备）。
 * zh-CN/en 给具体热线；es/ja/ko/th/vi 给国际通用资源指引，均标注「待母语复核」。
 */
export const CRISIS_HOTLINES: Record<CrisisLocale, string> = {
  'zh-CN': '全国心理援助热线 12356（24 小时）｜北京心理危机研究与干预中心热线 010-82951332',
  en: '988 Suicide & Crisis Lifeline (US) — call or text 988 | Samaritans (UK & Ireland) — call 116 123',
  'es-ES':
    'Directorio internacional de líneas de ayuda emocional: https://findahelpline.com（待母语复核）',
  ja: '国際的な心理支援ホットライン一覧：https://findahelpline.com（待母语复核）',
  'ko-KN': '국제 심리 지원 핫라인 안내: https://findahelpline.com（待母语复核）',
  'th-TH': 'รายชื่อสายด่วนช่วยเหลือด้านจิตใจระดับนานาชาติ: https://findahelpline.com（待母语复核）',
  'vi-VN': 'Danh mục đường dây nóng hỗ trợ tâm lý quốc tế: https://findahelpline.com（待母语复核）',
};

/** 危机命中时注入 system 的危机干预指令（拼在一切合规规则之前，优先级最高）。 */
export function buildCrisisSystemSection(locale: CrisisLocale = 'zh-CN'): string {
  const hotline = CRISIS_HOTLINES[locale] ?? CRISIS_HOTLINES['zh-CN'];
  return [
    '【危机干预指令（最高优先级，先于本提示中其他一切规则执行）】',
    '用户的输入显示其可能正处于情绪危机（自伤/轻生倾向）。请立即切换为危机回应模式：',
    `1. 放下命理推演框架，先温和回应用户本人：肯定其感受被听见、肯定生命价值与求助的勇气，用${locale === 'zh-CN' ? '中文' : '用户的语言'}回应。`,
    '2. 在回复中必须原样、完整地包含以下心理援助热线信息（不得省略、不得改写号码或网址）：',
    `   · ${hotline}`,
    '3. 建议用户联系信任的人陪伴；如用户处于紧急危险中，请提示拨打当地紧急电话（如 110/120/911/119）。',
    '4. 全程温和、不评判、不说教，不把话题引回运势或命理解读，不做任何与寿数、吉凶相关的推演。',
  ].join('\n');
}

/**
 * 危机确定性收尾文案：由 proxy 在流尾直接写出（不经过 OutputFuse 与模型），
 * 无论上游输出如何（包括熔断）都保证热线触达用户。
 */
export function buildCrisisNotice(locale: CrisisLocale = 'zh-CN'): string {
  const hotline = CRISIS_HOTLINES[locale] ?? CRISIS_HOTLINES['zh-CN'];
  if (locale === 'zh-CN') {
    return `\n\n——\n💙 此刻你可能正承受着很大的压力，这些感受值得被认真对待。心理援助热线：${hotline}。如遇紧急情况请拨打 110 / 120。愿意求助，已经是勇敢的一步。`;
  }
  if (locale === 'en') {
    return `\n\n——\n💙 You are not alone, and support is available right now. ${hotline}. If you are in immediate danger, call your local emergency number. Reaching out is a brave first step.`;
  }
  return `\n\n——\n💙 ${hotline}（待母语复核）`;
}
