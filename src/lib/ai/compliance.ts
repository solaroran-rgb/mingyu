// M1 运行时约束（468 红线 2.1-03/05/06/15/16/18/19、2.2-01 的服务端落地）。
// 范围：temperature=0 由 proxy 调用侧锁定；本模块提供 system 合规铁律、敏感领域
// 约束注入、术语口径查表（零 LLM 生成）、输出流内熔断。全部为确定性代码。

import { LEXICON_TRANSLATOR_SEED } from '../../data/lexicon-translator-seed';

export const COMPLIANCE_VERSION = 'm1.0';
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
