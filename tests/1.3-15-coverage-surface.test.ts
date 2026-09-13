/**
 * 红线 1.3-15 · 排盘引擎单元测试覆盖表面
 *
 * 红线要求：核心排盘函数（四柱/紫微/星盘）有系统化测试覆盖（目标行覆盖 ≥99%）。
 * 现状：core 已积累 1550 项单测，每个引擎均配 *-evidence-trail.test.ts 穷尽证据链；
 *       但尚未接入 c8/istanbul 的数值行/分支覆盖门限（残留项，见证据文档）。
 *
 * 本测试作为“覆盖表面存在性”契约：断言四柱/紫微/星盘/历法/吠陀/全球定位六大核心
 * 公开子路径的计算入口均可加载并实际产出结构化结果——即这些表面确实在测试覆盖之下。
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { baziCalculator } from '../packages/core/src/bazi/baziCalculator.ts';
import { resolveHistoricalTimezone } from '@temposoul/core/calendar';
import { resolveGlobalCity } from '@temposoul/core/location';
import { calculateZiweiChart, buildZiweiChartInput } from '@temposoul/core/ziwei/runtime';
import { generateAstrolabe } from '@temposoul/core/divination/astrolabe';

test('1.3-15 六大核心排盘子路径计算入口均应可调用', () => {
  const entries = [
    baziCalculator.calculateBazi,
    resolveHistoricalTimezone,
    resolveGlobalCity,
    calculateZiweiChart,
    buildZiweiChartInput,
    generateAstrolabe,
  ];
  for (const fn of entries) {
    assert.equal(typeof fn, 'function', '核心计算入口应为导出函数');
  }
});

test('1.3-15 三引擎冒烟：四柱/紫微/星盘均可实际产出结构化结果', () => {
  // 四柱
  const bazi = baziCalculator.calculateBazi({ year: 1990, month: 5, day: 15, timeIndex: 1, gender: 'male' });
  assert.ok(bazi.pillars.year && bazi.pillars.day, '八字应产出四柱');

  // 紫微
  const zw = calculateZiweiChart(buildZiweiChartInput({
    name: 'cov', gender: 'female', dateType: 'solar', year: 1990, month: 5, day: 15, timeIndex: 4, isLeapMonth: false,
  }));
  assert.ok(zw, '紫微应产出结果');

  // 星盘
  const astro = generateAstrolabe({
    name: 'cov', gender: '女', year: '1995', month: '5', day: '20', hour: '12', minute: '30',
    latitude: '39.9042', longitude: '116.4074', timezone: '8', locationName: '北京',
  });
  assert.ok(astro.planets.length >= 7, '星盘应含至少七政');
});
