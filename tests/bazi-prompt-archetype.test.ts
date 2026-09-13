import test from 'node:test';
import assert from 'node:assert/strict';

import { buildPromptFromConfig } from '../src/utils/ai/aiPrompts';
import { baziCalculator } from '@core/bazi/baziCalculator';
import type { BaziChartResult } from '@core/bazi/index';

function createBaziResult(overrides: Partial<Parameters<typeof baziCalculator.calculateBazi>[0]> = {}): BaziChartResult {
  return baziCalculator.calculateBazi({
    year: 1990,
    month: 5,
    day: 15,
    timeIndex: 1,
    gender: 'male',
    isLunar: false,
    isLeapMonth: false,
    useTrueSolarTime: false,
    ...overrides,
  } as never);
}

function buildPrompt(result: BaziChartResult | null, question = '请分析事业方向。') {
  return buildPromptFromConfig(question, { id: 'ai-career', prompt: '测试', scopeLabel: '事业' }, result);
}

test('T2-04: 真实 prompt 含【原型法理锚定】段', () => {
  const { user } = buildPrompt(createBaziResult());
  assert.match(user, /【原型法理锚定】/);
  assert.match(user, /白话口径：/);
});

test('T2-04: 真实 prompt 含【分支白话】段且带十神分支条目', () => {
  const result = createBaziResult();
  const { user } = buildPrompt(result);
  assert.match(user, /【分支白话】/);
  assert.match(user, /· [^｜]+｜[^：]+：/, '分支条目应为「· 术语｜分支名：白话」形态');
});

test('T2-04: 分支段位于锚定段之后、问题段之前', () => {
  const { user } = buildPrompt(createBaziResult());
  const idxAnchor = user.indexOf('【原型法理锚定】');
  const idxBranch = user.indexOf('【分支白话】');
  const idxQuestion = user.indexOf('【问题】');
  assert.ok(idxAnchor >= 0);
  assert.ok(idxBranch > idxAnchor, '分支段应在锚定段之后');
  assert.ok(idxQuestion < 0 || idxBranch < idxQuestion, '分支段应在问题之前');
});

test('T2-04: 分支条目不超过 4 条', () => {
  const { user } = buildPrompt(createBaziResult());
  const section = user.split('【分支白话】')[1]?.split('\n\n')[0] ?? '';
  const entries = section.split('\n').filter((l) => l.startsWith('· '));
  assert.ok(entries.length >= 1 && entries.length <= 4, `分支条目 ${entries.length} 越界`);
});

test('T2-04: 无盘面时不注入锚定/分支空段', () => {
  const { user } = buildPrompt(null);
  assert.doesNotMatch(user, /【原型法理锚定】/);
  assert.doesNotMatch(user, /【分支白话】/);
  assert.ok(!user.includes('【分支白话】\n'), '不得出现空分支段标题');
});

test('T2-04: 分支段引用盘面真实十神与旺衰（确定性）', () => {
  const result = createBaziResult();
  const strength = result.analysis.dayMasterStrength.status;
  const { user } = buildPrompt(result);
  if (strength !== '未知') {
    assert.match(user, /【分支白话】/, `旺衰=${strength} 时应能选出分支`);
  }
  // 多次构建幂等（temperature 0 语义下确定性）
  const a = buildPrompt(result).user;
  const b = buildPrompt(result).user;
  assert.equal(a, b);
});

test('T2-04: 分支段不泄漏工程术语', () => {
  const { user } = buildPrompt(createBaziResult());
  const section = user.split('【分支白话】')[1]?.split('\n\n')[0] ?? '';
  assert.doesNotMatch(section, /archetype|branchKey|API|接口|undefined|draft/);
});
