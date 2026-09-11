/**
 * @file 萨摩亚 2011-12-30 跳日（skip day）专项分支
 * @description 萨摩亚（时区 Pacific/Apia）于 2011-12-30 24:00 本地时间把时钟从
 * UTC-10 直接拨到 UTC+14，本地日期 2011-12-30 整天不存在。
 * 通用 IANA 反向匹配只会报「当地时刻不存在」，本模块给出精确的历史跳日诊断，
 * 避免排盘把该日期静默错配到相邻 UTC 时刻。
 */

/** 参与此次跳日的 IANA 时区（萨摩亚时区名）。 */
export const SAMOA_SKIP_TIME_ZONE_IDS: readonly string[] = ['Pacific/Apia'] as const;

/** 萨摩亚跳日：本地「被跳过」的日期。 */
export const SAMOA_SKIP_DAY = {
  year: 2011,
  month: 12,
  day: 30,
  /** 跳变前偏移（UTC-10）。 */
  beforeOffsetHours: -10,
  /** 跳变后偏移（UTC+14）。 */
  afterOffsetHours: 14,
  /** 跳变发生的 UTC 时刻（本地 2011-12-30 24:00 = 2011-12-29 10:00 UTC）。 */
  jumpUtcIso: '2011-12-29T10:00:00Z',
} as const;

export interface SamoaSkipDayDiagnosis {
  /** 是否命中萨摩亚 2011-12-30 跳日。 */
  isSkipDay: boolean;
  timeZoneId: string;
  year: number;
  month: number;
  day: number;
  /** 命中时给出的面向调用方的解释。 */
  message?: string;
}

/** 判断给定 IANA 时区与本地公历日期是否落在萨摩亚 2011-12-30 跳日区间。 */
export function isSamoaSkipDay(
  timeZoneId: string | undefined,
  year: number,
  month: number,
  day: number,
): boolean {
  if (!timeZoneId) return false;
  const normalized = timeZoneId.trim();
  if (!SAMOA_SKIP_TIME_ZONE_IDS.includes(normalized as (typeof SAMOA_SKIP_TIME_ZONE_IDS)[number])) {
    return false;
  }
  return (
    year === SAMOA_SKIP_DAY.year && month === SAMOA_SKIP_DAY.month && day === SAMOA_SKIP_DAY.day
  );
}

/**
 * 给出萨摩亚跳日的诊断结果；未命中时 isSkipDay=false，调用方应回落到通用「当地时刻不存在」错误。
 */
export function diagnoseSamoaSkipDay(
  timeZoneId: string | undefined,
  year: number,
  month: number,
  day: number,
): SamoaSkipDayDiagnosis {
  const hit = isSamoaSkipDay(timeZoneId, year, month, day);
  const base: SamoaSkipDayDiagnosis = {
    isSkipDay: hit,
    timeZoneId: timeZoneId ?? '',
    year,
    month,
    day,
  };
  if (!hit) return base;
  return {
    ...base,
    message:
      `${timeZoneId} 的当地公历日期 ${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ` +
      '为萨摩亚 2011-12-30 跳日：萨摩亚于当地 2011-12-30 24:00 把法定时区从 UTC-10 直接拨到 UTC+14' +
      `（跳变发生于 ${SAMOA_SKIP_DAY.jumpUtcIso}），该本地日期全天不存在，排盘不得按相邻日期静默错位。` +
      '请改用真实存在的相邻本地日期 2011-12-29（跳变前，UTC-10）或 2011-12-31（跳变后，UTC+14）重新排盘。',
  };
}
