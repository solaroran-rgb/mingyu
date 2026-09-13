/**
 * 红线 1.5-04 · 出生时间跨度（公元前 3000 至公元 5000）
 *
 * 红线要求：排盘支持公元前 3000 至公元 5000 年；无法可靠计算的范围应显式报错。
 *
 * 【2026-09-13 历法能力实测裁决：不放开输入口径，落边界】
 * 实测底层历法（tyme4ts 1.5.2）：
 *   - 中文命理链路 SolarTime/SolarYear/SolarMonth/SolarDay 硬下限 = 公元 1 年，
 *     公历入口 validateRange(year, 1, 9999)；year ≤ 0（含所有公元前）直接抛
 *     `illegal solar year`。-3000/-1000/-1/0 均不可计算，四柱/农历/节气/干支全失效。
 *   - 农历 LunarYear、六十甲子 SixtyCycleYear 直接构造下限仅到 -1（= 公元前 1 年），
 *     但四柱链路走公历入口，仍要求 ≥ 公元 1 年。
 *   - 上沿硬上限 = 公元 9999；5000/9999 可排干支四柱，10000 抛错。
 *   - 天文引擎 astronomy-engine 可算公元前（-3000 太阳黄经正常返回），但仅服务
 *     西方占星（七政/vedic），与中文四柱链路无关；自研 ΔT 证据层硬限 1900–2200。
 * 结论：红线 -3000 下沿在当前中文命理栈下根本算不出，放开只会让排盘抛错，
 * 故维持交互输入 1900–2100、zodiac 流年 1900–2200 的保守口径，越界一律显式报错。
 * 详见 docs/audit/2026-09-13-上线前加固/thread-04-基础设施加固与红线收口/
 *   evidence-p1/1.5-04-时间跨度-历法能力审计.md
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { daysInGregorianMonth, getBirthDateValidationMessage } from '@temposoul/core/calendar';

const solar = (year: number) => ({ year, month: 6, day: 15, dateType: 'solar' as const });

test('1.5-04 出生交互输入越界年份应显式报错（当前口径 1900–2100）', () => {
  assert.match(getBirthDateValidationMessage(solar(1899)) ?? '', /1900-2100/);
  assert.match(getBirthDateValidationMessage(solar(2101)) ?? '', /1900-2100/);
  assert.match(getBirthDateValidationMessage(solar(-100)) ?? '', /1900-2100/);
  // 红线下沿公元前 3000：底层 tyme4ts 无法计算，输入层必须显式拦截
  assert.match(getBirthDateValidationMessage(solar(-3000)) ?? '', /1900-2100/);
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
