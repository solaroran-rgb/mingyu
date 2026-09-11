/**
 * @file UTC → TT (Terrestrial Time) 换算
 * @description 按历书时定义 TT = TAI + 32.184s，TAI = UTC + ΔAT（IERS 闰秒累积），
 * 因此 TT - UTC = 32.184 + ΔAT。本模块提供纯函数与 IERS 闰秒表，
 * 供西洋/七政排盘入口在送入星历/行星位置计算前显式把 UTC 时刻折算到 TT 尺度。
 *
 * 注意：本模块给出的是「钟面时间尺度换算」（TT - UTC），
 * 与 astronomical-time.ts 中 estimateDeltaTSeconds 给出的「TT - UT1」
 * 物理多项式估计不是同一量；两者相差 DUT1（通常 < 0.9s）。
 */

/** 历书时定义常数：TT - TAI = 32.184s（1977-01-01 起严格成立）。 */
export const TT_TAI_OFFSET_SECONDS = 32.184;

/**
 * IERS 闰秒表：TAI - UTC（秒）自给定 UTC 时刻（UTC 当日 0 时）起生效。
 * 表项按时间升序，最后一项为当前最新值（截至 2017-01-01 起 ΔAT = 37s）。
 */
export interface LeapSecondEntry {
  /** 生效时刻（UNIX 秒，UTC 0h）。 */
  sinceUnixSeconds: number;
  /** 该时刻起的 TAI - UTC 累积秒数 ΔAT。 */
  deltaAt: number;
  /** 生效日期（UTC），仅用于可读性。 */
  sinceUtcDate: string;
}

function s(y: number, m: number, d: number): number {
  return Math.floor(Date.UTC(y, m - 1, d, 0, 0, 0) / 1000);
}

export const IERS_LEAP_SECONDS: readonly LeapSecondEntry[] = [
  { sinceUnixSeconds: s(1972, 1, 1), deltaAt: 10, sinceUtcDate: '1972-01-01' },
  { sinceUnixSeconds: s(1972, 7, 1), deltaAt: 11, sinceUtcDate: '1972-07-01' },
  { sinceUnixSeconds: s(1973, 1, 1), deltaAt: 12, sinceUtcDate: '1973-01-01' },
  { sinceUnixSeconds: s(1974, 1, 1), deltaAt: 13, sinceUtcDate: '1974-01-01' },
  { sinceUnixSeconds: s(1975, 1, 1), deltaAt: 14, sinceUtcDate: '1975-01-01' },
  { sinceUnixSeconds: s(1976, 1, 1), deltaAt: 15, sinceUtcDate: '1976-01-01' },
  { sinceUnixSeconds: s(1977, 1, 1), deltaAt: 16, sinceUtcDate: '1977-01-01' },
  { sinceUnixSeconds: s(1978, 1, 1), deltaAt: 17, sinceUtcDate: '1978-01-01' },
  { sinceUnixSeconds: s(1979, 1, 1), deltaAt: 18, sinceUtcDate: '1979-01-01' },
  { sinceUnixSeconds: s(1980, 1, 1), deltaAt: 19, sinceUtcDate: '1980-01-01' },
  { sinceUnixSeconds: s(1981, 7, 1), deltaAt: 20, sinceUtcDate: '1981-07-01' },
  { sinceUnixSeconds: s(1982, 7, 1), deltaAt: 21, sinceUtcDate: '1982-07-01' },
  { sinceUnixSeconds: s(1983, 7, 1), deltaAt: 22, sinceUtcDate: '1983-07-01' },
  { sinceUnixSeconds: s(1985, 7, 1), deltaAt: 23, sinceUtcDate: '1985-07-01' },
  { sinceUnixSeconds: s(1988, 1, 1), deltaAt: 24, sinceUtcDate: '1988-01-01' },
  { sinceUnixSeconds: s(1990, 1, 1), deltaAt: 25, sinceUtcDate: '1990-01-01' },
  { sinceUnixSeconds: s(1991, 1, 1), deltaAt: 26, sinceUtcDate: '1991-01-01' },
  { sinceUnixSeconds: s(1992, 7, 1), deltaAt: 27, sinceUtcDate: '1992-07-01' },
  { sinceUnixSeconds: s(1993, 7, 1), deltaAt: 28, sinceUtcDate: '1993-07-01' },
  { sinceUnixSeconds: s(1994, 7, 1), deltaAt: 29, sinceUtcDate: '1994-07-01' },
  { sinceUnixSeconds: s(1996, 1, 1), deltaAt: 30, sinceUtcDate: '1996-01-01' },
  { sinceUnixSeconds: s(1997, 7, 1), deltaAt: 31, sinceUtcDate: '1997-07-01' },
  { sinceUnixSeconds: s(1999, 1, 1), deltaAt: 32, sinceUtcDate: '1999-01-01' },
  { sinceUnixSeconds: s(2006, 1, 1), deltaAt: 33, sinceUtcDate: '2006-01-01' },
  { sinceUnixSeconds: s(2009, 1, 1), deltaAt: 34, sinceUtcDate: '2009-01-01' },
  { sinceUnixSeconds: s(2012, 7, 1), deltaAt: 35, sinceUtcDate: '2012-07-01' },
  { sinceUnixSeconds: s(2015, 7, 1), deltaAt: 36, sinceUtcDate: '2015-07-01' },
  { sinceUnixSeconds: s(2017, 1, 1), deltaAt: 37, sinceUtcDate: '2017-01-01' },
] as const;

/** 1972 年闰秒体系建立前采用的 ΔAT 近似值（1972-01-01 定义为 10s）。 */
export const PRE_1972_DELTA_AT = 10;

/**
 * 给定 UNIX UTC 秒，返回该时刻的 TAI - UTC（ΔAT，秒）。
 * 1972-01-01 之前的历史时刻统一按 10s 近似（1972 年闰秒体系建立时的定义值），
 * 调用方应把它当作历史近似而非观测值。
 */
export function deltaAtSeconds(unixSeconds: number): number {
  if (!Number.isFinite(unixSeconds)) {
    throw new Error('deltaAtSeconds 需要有限的 UNIX 秒。');
  }
  let result = PRE_1972_DELTA_AT;
  for (const entry of IERS_LEAP_SECONDS) {
    if (unixSeconds >= entry.sinceUnixSeconds) {
      result = entry.deltaAt;
    } else {
      break;
    }
  }
  return result;
}

/**
 * 给定 UNIX UTC 秒，返回该时刻的 TT - UTC 秒数。
 * 公式：TT - UTC = (TT - TAI) + (TAI - UTC) = 32.184 + ΔAT。
 */
export function utcToTtOffsetSeconds(unixSeconds: number): number {
  return TT_TAI_OFFSET_SECONDS + deltaAtSeconds(unixSeconds);
}

/**
 * 把 UTC UNIX 秒折算为 TT 秒（以 J1972 / 历书时秒连续计数）。
 * 注意：返回值是「TT 尺度下的连续秒数」，与 UTC 闰秒后的 UNIX 秒差为 (32.184 + ΔAT) 秒。
 */
export function utcToTtSeconds(unixSeconds: number): number {
  return unixSeconds + utcToTtOffsetSeconds(unixSeconds);
}

/**
 * 把 JD(UTC) 折算为 JD(TT)。
 * 用于在调用 astronomy-engine / Swiss Ephemeris 前显式完成时间尺度换算。
 */
export function utcJdToTtJd(jdUtc: number, unixSecondsAtJd: number): number {
  if (!Number.isFinite(jdUtc) || !Number.isFinite(unixSecondsAtJd)) {
    throw new Error('utcJdToTtJd 需要有限的 JD(UTC) 与对应 UNIX 秒。');
  }
  return jdUtc + utcToTtOffsetSeconds(unixSecondsAtJd) / 86400;
}
