// L4 分支选择引擎原型（T2-03，V4.0 域3/4）。
// 纯确定性函数，零 LLM：给定术语与盘面上下文，选择唯一分支（多命中取 priority 最小，
// 条件全不中走 fallback）。day_master_strength 七级口径来自 T1 审计的
// baziStrengthAnalyzer（三倾向多数表决：月令合看司令/地支通根/成局明透结构，非分数）。

import { findBranchGroup, type BranchCondition, type BranchDefinition } from '../../data/branch-definitions';

export interface BranchContext {
  /** 日主旺衰七级：极强/身强/偏强/中和/偏弱/身弱/极弱（或"未知"）。 */
  dayMasterStrength: string;
  /** 盘面/资料中出现的关联术语（十神名等中文显示名）。 */
  relatedTerms: string[];
}

export interface BranchMatch {
  archetypeKey: string;
  termKey: string;
  branchKey: string;
  branchName: string;
  vernacularZh: string;
  positiveKeywords: string[];
  cautionKeywords: string[];
  status: 'draft';
  /** condition=按条件命中；fallback=条件盲区兜底。 */
  matchedBy: 'condition' | 'fallback';
  priority: number;
}

function hasConditions(c: BranchCondition): boolean {
  return Boolean(
    (c.day_master_strength && c.day_master_strength.length > 0) ||
      (c.related_terms_present && c.related_terms_present.length > 0) ||
      (c.related_terms_absent && c.related_terms_absent.length > 0),
  );
}

function matchesConditions(c: BranchCondition, ctx: BranchContext): boolean {
  if (c.day_master_strength?.length && !c.day_master_strength.includes(ctx.dayMasterStrength)) {
    return false;
  }
  // present：出现其一即成立；absent：出现其一即不成立
  if (c.related_terms_present?.length && !c.related_terms_present.some((t) => ctx.relatedTerms.includes(t))) {
    return false;
  }
  if (c.related_terms_absent?.length && c.related_terms_absent.some((t) => ctx.relatedTerms.includes(t))) {
    return false;
  }
  return true;
}

function toMatch(def: BranchDefinition, matchedBy: BranchMatch['matchedBy']): BranchMatch {
  return {
    archetypeKey: def.archetypeKey,
    termKey: def.termKey,
    branchKey: def.branchKey,
    branchName: def.branchName,
    vernacularZh: def.vernacularZh,
    positiveKeywords: def.positiveKeywords,
    cautionKeywords: def.cautionKeywords,
    status: def.status,
    matchedBy,
    priority: def.priority,
  };
}

/**
 * 选择术语在给定上下文下的分支。返回 null 表示无该术语的分支组。
 * 规则：条件分支全不中 → fallback（无条件的 priority 99 分支）；条件命中取 priority 最小。
 */
export function selectBranch(termOrKey: string, ctx: BranchContext): BranchMatch | null {
  const group = findBranchGroup(termOrKey);
  if (!group) return null;
  const hits = group.branches
    .filter((b) => hasConditions(b.conditions) && matchesConditions(b.conditions, ctx))
    .sort((a, b) => a.priority - b.priority);
  if (hits.length > 0) return toMatch(hits[0], 'condition');
  const fallback = group.branches.find((b) => !hasConditions(b.conditions));
  return fallback ? toMatch(fallback, 'fallback') : null;
}

/**
 * 批量选择：对多个术语各选分支，命中 condition 的排前、fallback 排后，各保持传入顺序。
 */
export function selectBranches(termKeys: readonly string[], ctx: BranchContext, max = 4): BranchMatch[] {
  const matches: BranchMatch[] = [];
  for (const key of termKeys) {
    if (matches.length >= max) break;
    const m = selectBranch(key, ctx);
    if (m && !matches.some((x) => x.branchKey === m.branchKey)) matches.push(m);
  }
  return matches.sort((a, b) => {
    if (a.matchedBy !== b.matchedBy) return a.matchedBy === 'condition' ? -1 : 1;
    return a.priority - b.priority;
  });
}

/** 组装「分支白话」prompt 段；无命中返回空串（外层须判空再拼标题）。 */
export function buildBranchSection(matches: readonly BranchMatch[], max = 4): string {
  const picked = matches.slice(0, max);
  if (picked.length === 0) return '';
  const lines = picked.map(
    (m) => `· ${m.termKey}｜${m.branchName}：${m.vernacularZh}`,
  );
  return [
    '【分支白话】（以下白话为对应术语在本盘面条件下的解释口径，解释时优先采用，不得超出此范畴）：',
    ...lines,
  ].join('\n');
}
