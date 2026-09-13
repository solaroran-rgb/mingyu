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

test('M3 集成: 有盘面时 user 含【原型法理锚定】段', () => {
  const { user } = buildPrompt(createBaziResult());
  assert.match(user, /【原型法理锚定】/);
});

test('M3 集成: 段内含日主天干词条与引文', () => {
  const { user } = buildPrompt(createBaziResult()); // 庚金日主
  assert.match(user, /· 庚｜/);
  assert.match(user, /《[^》]+》/);
});

test('M3 集成: 白话口径行存在', () => {
  const { user } = buildPrompt(createBaziResult());
  assert.match(user, /白话口径：/);
});

test('M3 集成: 注入指引约束（不得超出锚定范畴）', () => {
  const { user } = buildPrompt(createBaziResult());
  assert.match(user, /不得超出此范畴/);
});

test('M3 集成: 无盘面时无该段', () => {
  const { user } = buildPrompt(null);
  assert.doesNotMatch(user, /【原型法理锚定】/);
});

test('M3 集成: 段位于排盘信息之后、问题之前', () => {
  const { user } = buildPrompt(createBaziResult());
  const idxChart = user.indexOf('【排盘信息】');
  const idxAnchor = user.indexOf('【原型法理锚定】');
  const idxQuestion = user.indexOf('【问题】');
  assert.ok(idxChart >= 0 && idxAnchor > idxChart && (idxQuestion < 0 || idxAnchor < idxQuestion));
});

test('M3 集成: 锚定段不超过 max 条（默认 8）', () => {
  const { user } = buildPrompt(createBaziResult());
  const section = user.split('【原型法理锚定】')[1]?.split('【')[0] ?? '';
  const entries = section.split('\n').filter((l) => l.startsWith('· '));
  assert.ok(entries.length <= 8, `锚定条目 ${entries.length} 超限`);
});

test('M3 集成: 女盘不同日主注入对应词条', () => {
  const { user } = buildPrompt(createBaziResult({ gender: 'female', year: 1988, month: 1, day: 1 }));
  assert.match(user, /· 乙｜/); // 乙木日主
});

test('M3 集成: 段不泄漏工程术语（对齐既有文风断言）', () => {
  const { user } = buildPrompt(createBaziResult());
  const section = user.split('【原型法理锚定】')[1]?.split('【')[0] ?? '';
  assert.doesNotMatch(section, /archetype|API|接口|算法|本项目|undefined/);
});

test('M3 集成: 多次构建幂等（temperature 0 语义下确定性）', () => {
  const r = createBaziResult();
  const a = buildPrompt(r).user;
  const b = buildPrompt(r).user;
  assert.equal(a, b);
});
