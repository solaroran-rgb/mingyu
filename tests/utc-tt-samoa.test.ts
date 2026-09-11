import assert from 'node:assert/strict';
import test from 'node:test';

import {
  IERS_LEAP_SECONDS,
  SAMOA_SKIP_DAY,
  TT_TAI_OFFSET_SECONDS,
  deltaAtSeconds,
  diagnoseSamoaSkipDay,
  isSamoaSkipDay,
  resolveCivilTime,
  resolveHistoricalTimezone,
  utcJdToTtJd,
  utcToTtOffsetSeconds,
} from '@temposoul/core/calendar';

function unixUtc(y: number, mo: number, d: number, h = 0, mi = 0, s = 0): number {
  return Math.floor(Date.UTC(y, mo - 1, d, h, mi, s) / 1000);
}

test('UTC→TT 应按 32.184s 基准加 IERS 闰秒 ΔAT 给出秒级换算', () => {
  // 2024-01-01 UTC：当前 ΔAT=37s，TT-UTC = 32.184 + 37 = 69.184s
  const t2024 = unixUtc(2024, 1, 1);
  assert.equal(deltaAtSeconds(t2024), 37);
  assert.equal(utcToTtOffsetSeconds(t2024), TT_TAI_OFFSET_SECONDS + 37);
  assert.ok(
    Math.abs(utcToTtOffsetSeconds(t2024) - 69.184) < 1e-9,
    `2024-01-01 TT-UTC 应为 69.184s，实际 ${utcToTtOffsetSeconds(t2024)}`,
  );

  // 1972-01-01 闰秒体系建立：ΔAT=10s，TT-UTC = 42.184s
  const t1972 = unixUtc(1972, 1, 1);
  assert.equal(deltaAtSeconds(t1972), 10);
  assert.ok(Math.abs(utcToTtOffsetSeconds(t1972) - 42.184) < 1e-9);

  // 2016-12-31 23:59:59 UTC（闰秒插入前一刻）仍为 ΔAT=36
  const tLeapBefore = unixUtc(2016, 12, 31, 23, 59, 59);
  assert.equal(deltaAtSeconds(tLeapBefore), 36);
  assert.ok(Math.abs(utcToTtOffsetSeconds(tLeapBefore) - 68.184) < 1e-9);

  // 2017-01-01 00:00:00 UTC 起 ΔAT 跳为 37
  const t2017 = unixUtc(2017, 1, 1);
  assert.equal(deltaAtSeconds(t2017), 37);
  assert.ok(Math.abs(utcToTtOffsetSeconds(t2017) - 69.184) < 1e-9);

  // 1972 年之前按 10s 历史近似
  const t1960 = unixUtc(1960, 1, 1);
  assert.equal(deltaAtSeconds(t1960), 10);
  assert.ok(Math.abs(utcToTtOffsetSeconds(t1960) - 42.184) < 1e-9);
});

test('UTC→TT 应正确完成 JD(UTC) 到 JD(TT) 的儒略日折算', () => {
  // J2000.0: 2000-01-01 12:00 UTC，JD(UTC)=2451545.0；当时 ΔAT=32s
  const j2000 = unixUtc(2000, 1, 1, 12);
  assert.equal(deltaAtSeconds(j2000), 32);
  const jdTt = utcJdToTtJd(2451545.0, j2000);
  // TT-UTC = 64.184s = 64.184/86400 日
  const expected = 2451545.0 + 64.184 / 86400;
  assert.ok(Math.abs(jdTt - expected) < 1e-9, `JD(TT) 应为 ${expected}，实际 ${jdTt}`);
  assert.ok(jdTt > 2451545.0);
  assert.throws(() => utcJdToTtJd(Number.NaN, j2000), /有限/);
});

test('UTC→TT 闰秒表应覆盖 1972 至今全部 28 次闰秒插入且单调递增', () => {
  assert.equal(IERS_LEAP_SECONDS.length, 28);
  for (let i = 1; i < IERS_LEAP_SECONDS.length; i += 1) {
    assert.ok(
      IERS_LEAP_SECONDS[i].sinceUnixSeconds > IERS_LEAP_SECONDS[i - 1].sinceUnixSeconds,
      '闰秒表时间应严格升序',
    );
    assert.ok(
      IERS_LEAP_SECONDS[i].deltaAt > IERS_LEAP_SECONDS[i - 1].deltaAt,
      'ΔAT 应严格递增',
    );
  }
  assert.equal(IERS_LEAP_SECONDS[0].deltaAt, 10);
  assert.equal(IERS_LEAP_SECONDS[IERS_LEAP_SECONDS.length - 1].deltaAt, 37);
});

test('萨摩亚跳日谓词应只命中 Pacific/Apia 的 2011-12-30', () => {
  assert.equal(isSamoaSkipDay('Pacific/Apia', 2011, 12, 30), true);
  assert.equal(isSamoaSkipDay('Pacific/Apia', 2011, 12, 29), false);
  assert.equal(isSamoaSkipDay('Pacific/Apia', 2011, 12, 31), false);
  assert.equal(isSamoaSkipDay('Pacific/Apia', 2012, 12, 30), false);
  assert.equal(isSamoaSkipDay('Asia/Shanghai', 2011, 12, 30), false);
  assert.equal(isSamoaSkipDay(undefined, 2011, 12, 30), false);

  const diag = diagnoseSamoaSkipDay('Pacific/Apia', 2011, 12, 30);
  assert.equal(diag.isSkipDay, true);
  assert.match(diag.message ?? '', /萨摩亚 2011-12-30 跳日/);
  assert.match(diag.message ?? '', /UTC-10.*UTC\+14/);
  assert.equal(SAMOA_SKIP_DAY.jumpUtcIso, '2011-12-29T10:00:00Z');
});

test('萨摩亚 2011-12-30 排盘应抛专用错误而非通用夏令时提示', () => {
  // 被跳过的本地日期：必须抛萨摩亚专用分支错误
  assert.throws(
    () =>
      resolveHistoricalTimezone({
        year: 2011,
        month: 12,
        day: 30,
        hour: 12,
        minute: 0,
        second: 0,
        timeZoneId: 'Pacific/Apia',
      }),
    /萨摩亚 2011-12-30 跳日.*2011-12-29.*2011-12-31/,
  );

  // 走民用时间统一入口也应冒泡到专用错误
  assert.throws(
    () =>
      resolveCivilTime({
        year: 2011,
        month: 12,
        day: 30,
        hour: 12,
        minute: 0,
        second: 0,
        timeZoneId: 'Pacific/Apia',
      }),
    /萨摩亚 2011-12-30 跳日/,
  );
});

test('萨摩亚跳日相邻日期应正确解析为跳变前 UTC-10 与跳变后 UTC+14', () => {
  // 2011-12-29 12:00 本地（UTC-10）→ UTC 2011-12-29 22:00
  const before = resolveHistoricalTimezone({
    year: 2011,
    month: 12,
    day: 29,
    hour: 12,
    minute: 0,
    second: 0,
    timeZoneId: 'Pacific/Apia',
  });
  assert.equal(before.resolvedOffsetHours, -10);
  assert.equal(before.selectedUtcDateTime, '2011-12-29T22:00:00.000Z');

  // 2011-12-31 12:00 本地（UTC+14）→ UTC 2011-12-30 22:00
  const after = resolveHistoricalTimezone({
    year: 2011,
    month: 12,
    day: 31,
    hour: 12,
    minute: 0,
    second: 0,
    timeZoneId: 'Pacific/Apia',
  });
  assert.equal(after.resolvedOffsetHours, 14);
  assert.equal(after.selectedUtcDateTime, '2011-12-30T22:00:00.000Z');
});
