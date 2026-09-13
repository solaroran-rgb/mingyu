import {
  formatBaziForPrompt,
  generateEnhancedAnalysisSection,
  analyzeBaziCompatibility,
  type BaziChartResult,
  type FortuneSelectionContext,
  type PromptChartScene,
} from '@temposoul/core/bazi';
import {
  getBaziCompatibilityDefaultQuestion,
  getBaziDefaultQuestion,
} from '../../lib/prompt-default-questions';
import {
  BAZI_COMPATIBILITY_PROMPT_PRESETS,
  BAZI_PROMPT_PRESETS,
  formatBaziFortuneSelection,
} from '@temposoul/core/prompt';
import { formatPromptCurrentTime } from '../../lib/prompt-time';
import { buildPromptGuidanceSections } from '../../lib/prompt-guidance';
import {
  buildArchetypeSection,
  extractGanZhiKeys,
  extractShenShaKeys,
  extractTenGodKeys,
} from '../../lib/ai/archetype-bridge';
import {
  buildBranchSection,
  selectBranches,
  type BranchMatch,
} from '../../lib/translation/branch-selector';

/**
 * M3：八字盘面 → archetype_key → 词库 L1/L3 查表锚定段（确定性查表，零 LLM 生成）。
 * 桥接层十神口径已按 T1 审计结论回填（见 archetype-bridge.ts 头注）。
 */
function buildBaziArchetypeSection(chartResult: BaziChartResult | null): string {
  if (!chartResult?.pillars || !chartResult.dayMaster) return '';
  const pillarKeys = (['year', 'month', 'day', 'hour'] as const).map((k) => chartResult.pillars[k]);
  const shenSha = chartResult.shensha;
  const keys = [
    ...extractGanZhiKeys(
      [chartResult.dayMaster.gan],
      pillarKeys.map((p) => p.zhi),
    ),
    ...extractTenGodKeys(
      chartResult.dayMaster.gan,
      pillarKeys.map((p) => p.gan),
    ),
    ...extractShenShaKeys(
      shenSha
        ? [...shenSha.year, ...shenSha.month, ...shenSha.day, ...shenSha.hour, ...(shenSha.global ?? [])]
        : [],
    ),
  ];
  return buildArchetypeSection(keys, 8);
}

/** 本地 buildPromptSection 无条件拼标题，锚定段空时须整段省略。 */
function anchorSection(chartResult: BaziChartResult | null): string {
  const anchor = buildBaziArchetypeSection(chartResult);
  return anchor ? `【原型法理锚定】\n${anchor}` : '';
}

/**
 * T2-04：盘面 → 分支上下文（旺衰七级 + 关联术语）→ 分支白话段（纯确定性，零 LLM）。
 * 旺衰七级来自 core 三倾向多数表决（T1 审计口径）；关联术语取四柱天干十神与藏干十神。
 */
function buildBranchMatches(chartResult: BaziChartResult | null): BranchMatch[] {
  if (!chartResult?.pillars || !chartResult.dayMaster) return [];
  const strength = chartResult.analysis?.dayMasterStrength?.status;
  if (!strength || strength === '未知') return [];
  const related = new Set<string>();
  const tenGodValues = Object.values(chartResult.tenGods ?? {});
  for (const god of tenGodValues) related.add(god);
  for (const list of Object.values(chartResult.hiddenTenGods ?? {})) {
    for (const god of list ?? []) related.add(god);
  }
  // 分支候选：四柱天干十神（按柱序），仅盘面出现的术语参与选择
  const termKeys = [...new Set(tenGodValues)];
  return selectBranches(termKeys, { dayMasterStrength: strength, relatedTerms: [...related] }, 4);
}

/** 分支白话段：无命中时返回空串（joinPromptSections 会过滤空段）。 */
function branchSection(chartResult: BaziChartResult | null): string {
  return buildBranchSection(buildBranchMatches(chartResult), 4);
}


export interface AIPromptOption {
  id: string;
  prompt: string;
  scopeLabel?: string;
}

export type BaziFortunePromptScope = 'natal' | 'full' | 'dayun' | 'year' | 'month' | 'day';

const SYSTEM_PROMPT = '';
const COMPATIBILITY_SYSTEM_PROMPT = '';

function buildPromptSection(title: string, content: string): string {
  return `【${title}】\n${content}`;
}

function demoteEmbeddedPromptSections(content: string): string {
  return content.replace(/^【([^】]+)】$/gm, '$1：');
}

function joinPromptSections(sections: Array<string | null | undefined>): string {
  return sections.filter(Boolean).join('\n\n');
}

function resolvePromptScene(promptId: string): PromptChartScene {
  if (
    promptId.startsWith('ai-fortune-') ||
    promptId === 'ai-current-luck' ||
    promptId === 'ai-this-year'
  ) {
    return 'fortune';
  }
  return 'general';
}

function formatFullFortuneOutputSection(result: BaziChartResult | null): string {
  if (!result?.luckInfo?.cycles?.length) return '';

  const lines = [
    '完整大运流年：',
    ...result.luckInfo.cycles.flatMap((cycle, cycleIndex) => {
      const cycleType = cycle.isXiaoyun ? '童运' : cycle.type;
      return [
        `${cycleIndex + 1}. ${cycle.ganZhi}${cycleType}：${cycle.year}年起，约${cycle.age}岁交运`,
        ...cycle.years.map((year) => `  - ${year.year}年（${year.age}岁）${year.ganZhi}`),
      ];
    }),
  ];

  return lines.join('\n');
}

function buildBaziNatalAnalysisObjectSection(): string {
  return '分析对象：本命盘';
}

function buildBaziFullAnalysisObjectSection(): string {
  return '分析对象：本命盘与完整大运流年';
}

function buildFortunePromptAddon(ctx: FortuneSelectionContext | null): string {
  if (!ctx) return '';
  return '';
}

function normalizeBaziScopeLabel(scopeLabel: string | undefined) {
  const normalized = scopeLabel?.trim();
  return normalized && normalized !== '综合' ? normalized : '通用';
}

function buildBaziTaskText(scopeLabel: string | undefined, fallbackTask: string) {
  const normalizedScopeLabel = normalizeBaziScopeLabel(scopeLabel);
  if (normalizedScopeLabel === '通用') {
    return fallbackTask;
  }

  return `请重点分析${normalizedScopeLabel}，并直接回答【问题】。`;
}

export const BAZI_AI_PROMPTS = {
  single: BAZI_PROMPT_PRESETS.map(({ id, prompt, scopeLabel }) => ({
    id,
    prompt,
    scopeLabel,
  })) as AIPromptOption[],
  combined: BAZI_COMPATIBILITY_PROMPT_PRESETS.map(({ id, prompt, scopeLabel }) => ({
    id,
    prompt,
    scopeLabel,
  })) as AIPromptOption[],
};

type SinglePromptConfig = (typeof BAZI_AI_PROMPTS.single)[number];

export function buildPromptFromConfig(
  questionText: string,
  selectedOption: AIPromptOption,
  chartResult: BaziChartResult | null,
  fortuneSelectionContext: FortuneSelectionContext | null = null,
  questionScopeLabel?: string,
  options: { isCustomQuestion?: boolean; fortuneScope?: BaziFortunePromptScope } = {},
): { system: string; user: string } {
  const isCustomQuestion = Boolean(options.isCustomQuestion);
  const fortuneScope = options.fortuneScope ?? fortuneSelectionContext?.scope ?? 'natal';
  const hasFullFortuneOutput = fortuneScope === 'full';
  const promptConfig: SinglePromptConfig | null = chartResult?.pillars
    ? (BAZI_AI_PROMPTS.single.find((c) => c.id === selectedOption.id) ?? null)
    : null;
  const scopeLabel =
    questionScopeLabel ?? selectedOption.scopeLabel ?? promptConfig?.scopeLabel ?? '通用';
  const normalizedQuestion =
    questionText.trim() || getBaziDefaultQuestion(undefined, { isCustomQuestion });

  if (promptConfig) {
    const chartData = chartResult
      ? formatBaziForPrompt(chartResult, selectedOption, resolvePromptScene(promptConfig.id))
      : '';
    const fortuneSection = formatBaziFortuneSelection(fortuneSelectionContext);
    const fullFortuneSection = hasFullFortuneOutput
      ? formatFullFortuneOutputSection(chartResult)
      : '';
    const fortuneAddon = buildFortunePromptAddon(fortuneSelectionContext);
    const task = [buildBaziTaskText(scopeLabel, promptConfig.prompt), fortuneAddon]
      .filter(Boolean)
      .join(' ');

    let enhancedSection = '';
    if (chartResult) {
      enhancedSection = generateEnhancedAnalysisSection(chartResult);
    }

    return {
      system: SYSTEM_PROMPT,
      user: joinPromptSections([
        buildPromptGuidanceSections('bazi'),
        buildPromptSection('当前时间', formatPromptCurrentTime()),
        buildPromptSection('排盘信息', [chartData, enhancedSection].filter(Boolean).join('\n')),
        anchorSection(chartResult),
        branchSection(chartResult),
        hasFullFortuneOutput
          ? buildPromptSection('分析对象', buildBaziFullAnalysisObjectSection())
          : '',
        !fortuneSection && !hasFullFortuneOutput
          ? buildPromptSection('分析对象', buildBaziNatalAnalysisObjectSection())
          : '',
        fortuneSection ? buildPromptSection('分析对象', fortuneSection.analysisObject) : '',
        fortuneSection ? buildPromptSection('岁运重点', fortuneSection.focus) : '',
        fullFortuneSection ? buildPromptSection('命限资料', fullFortuneSection) : '',
        normalizedQuestion ? buildPromptSection('问题', normalizedQuestion) : '',
        isCustomQuestion ? '' : buildPromptSection('任务', task || '请依据八字排盘资料完成解读。'),
      ]),
    };
  }

  const chartData = chartResult?.pillars
    ? formatBaziForPrompt(chartResult, selectedOption, 'general')
    : '';
  const fullFortuneSection = hasFullFortuneOutput
    ? formatFullFortuneOutputSection(chartResult)
    : '';

  return {
    system: SYSTEM_PROMPT,
    user: joinPromptSections([
      buildPromptGuidanceSections('bazi'),
      buildPromptSection('当前时间', formatPromptCurrentTime()),
      buildPromptSection('排盘信息', chartData),
      anchorSection(chartResult),
      branchSection(chartResult),
      hasFullFortuneOutput
        ? buildPromptSection('分析对象', buildBaziFullAnalysisObjectSection())
        : '',
      !hasFullFortuneOutput
        ? buildPromptSection('分析对象', buildBaziNatalAnalysisObjectSection())
        : '',
      fullFortuneSection ? buildPromptSection('命限资料', fullFortuneSection) : '',
      normalizedQuestion ? buildPromptSection('问题', normalizedQuestion) : '',
      isCustomQuestion ? '' : buildPromptSection('任务', '请依据八字排盘资料完成解读。'),
    ]),
  };
}

export type CompatType = 'marriage' | 'career' | 'friendship' | 'children' | 'parents' | 'siblings';

function getCompatibilityTask(compatType?: CompatType): string {
  const labelMap: Record<CompatType, string> = {
    marriage: '合婚',
    career: '合伙',
    friendship: '友情',
    children: '子女',
    parents: '父母',
    siblings: '兄弟',
  };
  const label = compatType ? labelMap[compatType] : '';
  const prefix = label ? `关系范围：${label}。` : '';
  return `${prefix}请依据双方盘面回答【问题】。`;
}

function formatCompatibilityFacts(result: ReturnType<typeof analyzeBaziCompatibility>): string {
  const relationLines = result.crossPillarRelations.map((item) => item.promptText);
  const combinationLines = result.crossBranchCombinations.map((item) => item.promptText);
  const tenGodLines = result.tenGodMappings.map((item) => item.promptText);
  const coverageLines = result.usefulGodCoverage
    .filter((item) => item.status === '已计算')
    .map((item) => item.promptText);

  return [
    `日主关系：${result.dayMasterRelation.promptText}。`,
    `四柱关系：${relationLines.length ? relationLines.join('；') : '双方四柱未见列出的合冲刑害破关系'}。`,
    combinationLines.length ? `跨盘组合：${combinationLines.join('；')}。` : '',
    `双向十神：${tenGodLines.join('；')}。`,
    coverageLines.length ? `喜忌五行对应：${coverageLines.join('；')}。` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export function getCompatibilityPrompt(
  questionText: string,
  baziResult1: BaziChartResult | null,
  baziResult2: BaziChartResult | null,
  compatType?: CompatType,
  options: { isCustomQuestion?: boolean; person1Name?: string; person2Name?: string } = {},
): { system: string; user: string } {
  const data1 = baziResult1
    ? demoteEmbeddedPromptSections(formatBaziForPrompt(baziResult1, null, 'compatibility'))
    : '';
  const data2 = baziResult2
    ? demoteEmbeddedPromptSections(formatBaziForPrompt(baziResult2, null, 'compatibility'))
    : '';
  const compatibilityEvidence =
    baziResult1 && baziResult2
      ? formatCompatibilityFacts(
          analyzeBaziCompatibility(baziResult1, baziResult2, {
            person1Name: options.person1Name,
            person2Name: options.person2Name,
          }),
        )
      : '';

  const taskSection = options.isCustomQuestion
    ? ''
    : buildPromptSection('任务', getCompatibilityTask(compatType));

  return {
    system: COMPATIBILITY_SYSTEM_PROMPT,
    user: joinPromptSections([
      buildPromptGuidanceSections('bazi-compatibility'),
      buildPromptSection('当前时间', formatPromptCurrentTime()),
      buildPromptSection('第一人排盘信息', data1),
      buildPromptSection('第二人排盘信息', data2),
      buildPromptSection('双盘关系资料', compatibilityEvidence),
      questionText.trim() || getBaziCompatibilityDefaultQuestion(compatType)
        ? buildPromptSection(
            '问题',
            questionText.trim() || getBaziCompatibilityDefaultQuestion(compatType),
          )
        : '',
      taskSection,
    ]),
  };
}
