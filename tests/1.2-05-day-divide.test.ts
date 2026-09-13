/**
 * 红线 1.2-05 · 早夜子时换日开关
 *
 * 红线要求：dayDivide（'forward' 晚子时归次日 | 'current' 晚子时归当日）开关应真实驱动
 * 日柱与时柱切换，且两种口径结果可复现。
 * 实现入口：packages/core/src/bazi/baziCalculator.ts（§16 收敛）
 *           金标准来自 tests/day-divide.test.ts（tyme4ts / lunar-javascript 交叉验证）。
 *
 * 本测试固定 2024-03-15 23:30（晚子时，timeIndex=12）的金标准四柱：
 *   forward → 年甲辰 / 月丁卯 / 日己卯 / 时甲子（次日）
 *   current → 年甲辰 / 月丁卯 / 日戊寅 / 时壬子（当日）
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { baziCalculator } from '../packages/core/src/bazi/baziCalculator.ts';

const ganZhi = (p: { gan: string; zhi: string }) => `${p.gan}${p.zhi}`;

test('1.2-05 晚子时 2024-03-15 23:30：forward 口径日柱为己卯、时柱甲子', () => {
  const result = baziCalculator.calculateBazi({
    year: 2024, month: 3, day: 15, timeIndex: 12, gender: 'male', dayDivide: 'forward',
  });
  assert.equal(ganZhi(result.pillars.year), '甲辰');
  assert.equal(ganZhi(result.pillars.month), '丁卯');
  assert.equal(ganZhi(result.pillars.day), '己卯');
  assert.equal(ganZhi(result.pillars.hour), '甲子');
});

test('1.2-05 晚子时 2024-03-15 23:30：current 口径日柱为戊寅、时柱壬子', () => {
  const result = baziCalculator.calculateBazi({
    year: 2024, month: 3, day: 15, timeIndex: 12, gender: 'male', dayDivide: 'current',
  });
  assert.equal(ganZhi(result.pillars.year), '甲辰');
  assert.equal(ganZhi(result.pillars.month), '丁卯');
  assert.equal(ganZhi(result.pillars.day), '戊寅');
  assert.equal(ganZhi(result.pillars.hour), '壬子');
});

test('1.2-05 两种开关应给出不同日柱（开关确实生效）', () => {
  const forward = baziCalculator.calculateBazi({
    year: 2024, month: 3, day: 15, timeIndex: 12, gender: 'male', dayDivide: 'forward',
  });
  const current = baziCalculator.calculateBazi({
    year: 2024, month: 3, day: 15, timeIndex: 12, gender: 'male', dayDivide: 'current',
  });
  assert.notEqual(ganZhi(forward.pillars.day), ganZhi(current.pillars.day));
});
