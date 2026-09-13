/**
 * 红线 1.1-06 · 国际夏令时（IANA tzdata）
 *
 * 红线要求：timeZoneId 按 IANA tzdata 历史规则解析夏令时跳变，而非固定偏移。
 * 实现入口：packages/core/src/calendar/historical-timezone.ts（resolveHistoricalTimezone）
 *           底层依赖运行时 ICU / IANA tzdata；中国境内另有 china-dst.ts 固定为不实行 DST。
 *
 * 本测试固定以下事实（防回归）：
 * - 纽约冬季 EST=UTC-5 / 夏季 EDT=UTC-4（夏令时跳变存在且方向正确）。
 * - 伦敦冬季 GMT=UTC+0 / 夏季 BST=UTC+1。
 * - 亚洲/上海 全年固定 UTC+8，无夏令时跳变（中国 1992 起停实行 DST）。
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveHistoricalTimezone } from '@temposoul/core/calendar';

const input = (timeZoneId: string, month: number) => ({
  year: 2024,
  month,
  day: 15,
  hour: 12,
  minute: 0,
  second: 0,
  timeZoneId,
});

test('1.1-06 纽约应在冬季 UTC-5、夏季 UTC-4（夏令时生效）', () => {
  const winter = resolveHistoricalTimezone(input('America/New_York', 1));
  const summer = resolveHistoricalTimezone(input('America/New_York', 7));
  assert.equal(winter.resolvedOffsetHours, -5);
  assert.equal(summer.resolvedOffsetHours, -4);
  assert.equal(summer.resolvedOffsetHours - winter.resolvedOffsetHours, 1);
});

test('1.1-06 伦敦应在冬季 UTC+0、夏季 UTC+1', () => {
  const winter = resolveHistoricalTimezone(input('Europe/London', 1));
  const summer = resolveHistoricalTimezone(input('Europe/London', 7));
  assert.equal(winter.resolvedOffsetHours, 0);
  assert.equal(summer.resolvedOffsetHours, 1);
});

test('1.1-06 亚洲/上海全年固定 UTC+8，无夏令时跳变', () => {
  const winter = resolveHistoricalTimezone(input('Asia/Shanghai', 1));
  const summer = resolveHistoricalTimezone(input('Asia/Shanghai', 7));
  assert.equal(winter.resolvedOffsetHours, 8);
  assert.equal(summer.resolvedOffsetHours, 8);
  assert.equal(winter.resolvedOffsetHours, summer.resolvedOffsetHours);
});

test('1.1-06 时区跳变日的 UTC 折算应一致（纽约夏令时起点 2024-03-10）', () => {
  // 2024-03-10 02:00 本地拨快到 03:00（EST→EDT）。取中午本地，UTC 折算应为 -4。
  const after = resolveHistoricalTimezone({
    year: 2024,
    month: 3,
    day: 10,
    hour: 12,
    minute: 0,
    second: 0,
    timeZoneId: 'America/New_York',
  });
  assert.equal(after.resolvedOffsetHours, -4);
  assert.equal(after.selectedUtcDateTime, '2024-03-10T16:00:00.000Z');
});
