/**
 * 红线 1.1-11 · 高纬度地区校验
 *
 * 红线要求：高纬度（近极圈）真太阳时换算应稳定给出有限结果，均时差/经度时差分支不崩溃。
 * 实现入口：packages/core/src/calendar/true-solar-time.ts
 *           （Meeus 均时差 + 经度每度 4 分钟校正）。
 *
 * 本测试固定以下事实（防回归）：
 * - 特罗姆瑟（Tromsø, 69.6°N，已近北极圈）在二分二至四个代表日均能给出有限真太阳时。
 * - 均时差全年落在合理区间 [-20, +20] 分钟（Meeus 量级）。
 * - 经度 1 度 = 4 分钟的经度时差符号正确（东经为正校正）。
 *
 * 残留说明：极昼/极夜下“时辰显示”是否需额外文案分支，见证据文档；本测试只证计算层有限稳定。
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateEquationOfTimeMinutes,
  resolveTrueSolarBirthTime,
} from '@temposoul/core/calendar';

const TROMSO = { longitude: 18.9, timezone: 1 }; // 挪威特罗姆瑟 69.6N / 18.9E

test('1.1-11 高纬度特罗姆瑟在二分二至均能给出有限真太阳时', () => {
  const cases: Array<[number, number, number]> = [
    [2024, 3, 20], // 春分
    [2024, 6, 21], // 夏至（极昼）
    [2024, 9, 22], // 秋分
    [2024, 12, 21], // 冬至（极夜）
  ];
  for (const [year, month, day] of cases) {
    const result = resolveTrueSolarBirthTime({
      dateType: 'solar',
      year,
      month,
      day,
      hour: 12,
      minute: 0,
      ...TROMSO,
    });
    assert.ok(result.timeIndex >= 0 && result.timeIndex <= 12, `${year}-${month} 时辰索引应在 0-12`);
    assert.match(result.solarClockDateTime, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
  }
});

test('1.1-11 均时差值应落在 Meeus 合理量级 [-20, +20] 分钟', () => {
  for (let month = 1; month <= 12; month += 1) {
    const eot = calculateEquationOfTimeMinutes(2024, month, 15);
    assert.ok(Number.isFinite(eot), `${month} 月均时差应有限`);
    assert.ok(Math.abs(eot) <= 20, `${month} 月均时差 ${eot} 应在 ±20 分钟内`);
  }
});

test('1.1-11 经度时差应为东经正校正（每度 4 分钟）', () => {
  // timezone=1 标准经线 15°E：东经 18.9° → (18.9-15)*4 = +15.6 分；西经 -18.9° → (-18.9-15)*4 = -135.6 分
  const east = resolveTrueSolarBirthTime({
    dateType: 'solar', year: 2024, month: 7, day: 15, hour: 12, minute: 0,
    longitude: 18.9, timezone: 1,
  });
  const west = resolveTrueSolarBirthTime({
    dateType: 'solar', year: 2024, month: 7, day: 15, hour: 12, minute: 0,
    longitude: -18.9, timezone: 1,
  });
  assert.ok(Math.abs(east.longitudeCorrectionMinutes - 15.6) < 0.01, '东经应约 +15.6 分');
  assert.ok(west.longitudeCorrectionMinutes < 0, '西经经度校正应为负');
  assert.ok(east.longitudeCorrectionMinutes > west.longitudeCorrectionMinutes, '东经校正应大于西经');
});
