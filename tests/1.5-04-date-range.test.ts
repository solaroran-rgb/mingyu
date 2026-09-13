/**
 * 红线 1.5-04 · 出生时间跨度（公元前 3000 至公元 5000）
 *
 * 红线要求：排盘支持公元前 3000 至公元 5000 年；无法可靠计算的范围应显式报错。
 * 实现现状：
 *   - 天文原语层（utc-tt ΔT、true-solar-time、星历）按儒略日支持极宽跨度；
 *   - 出生交互输入层 getBirthDateValidationMessage 现行口径为 1900–2100，
 *     越界显式返回“年份需在 1900-2100 之间”（显式报错，非静默错算）。
 *   - daysInGregorianMonth 为历法原语，支持 1–9999 年。
 *
 * 本测试固定当前契约：越界年份显式报错；历法原语支持宽年范围。
 * 是否把交互输入口径放开到 -3000~5000（涉农历/BC 历）为残留裁决项，见证据文档。
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { daysInGregorianMonth, getBirthDateValidationMessage } from '@temposoul/core/calendar';

const solar = (year: number) => ({ year, month: 6, day: 15, dateType: 'solar' as const });

test('1.5-04 出生交互输入越界年份应显式报错（当前口径 1900–2100）', () => {
  assert.match(getBirthDateValidationMessage(solar(1899)) ?? '', /1900-2100/);
  assert.match(getBirthDateValidationMessage(solar(2101)) ?? '', /1900-2100/);
  assert.match(getBirthDateValidationMessage(solar(-100)) ?? '', /1900-2100/);
  // 合法年份不报错
  assert.equal(getBirthDateValidationMessage(solar(2024)), undefined);
  assert.equal(getBirthDateValidationMessage(solar(1900)), undefined);
  assert.equal(getBirthDateValidationMessage(solar(2100)), undefined);
});

test('1.5-04 历法原语 daysInGregorianMonth 支持宽年范围并正确判闰', () => {
  assert.equal(daysInGregorianMonth(2000, 2), 29); // 千年闰
  assert.equal(daysInGregorianMonth(1900, 2), 28); // 非四百年闰
  assert.equal(daysInGregorianMonth(2024, 2), 29);
  assert.equal(daysInGregorianMonth(9999, 2), 28); // 上沿可用
  // 超出公历合理区间显式报错
  assert.throws(() => daysInGregorianMonth(0, 2), /1-9999/);
  assert.throws(() => daysInGregorianMonth(10000, 2), /1-9999/);
});
