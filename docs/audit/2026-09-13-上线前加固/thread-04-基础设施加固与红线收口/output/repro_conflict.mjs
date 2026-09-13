// T4-S2 复现：timezone 与 timeZoneId 冲突 → 线上 500 INTERNAL_ERROR
// 用法：node docs/audit/2026-09-13-上线前加固/thread-04-基础设施加固与红线收口/output/repro_conflict.mjs
import { bazi } from '@temposoul/core';

const base = {
  gender: 'male', year: 1991, month: 7, day: 4,
  isLunar: false, timeIndex: 4, dayDivide: 'forward',
  useTrueSolarTime: true, birthHour: 9, birthMinute: 15,
  birthLongitude: -74.006, birthPlace: 'New York',
};

const scenarios = [
  ['纯 timeZoneId', { ...base, timeZoneId: 'America/New_York' }],
  ['纯 timezone=-4', { ...base, timezone: -4 }],
  ['冲突 timezone=8 + NY', { ...base, timezone: 8, timeZoneId: 'America/New_York' }],
  ['一致 timezone=-4 + NY(7月DST)', { ...base, timezone: -4, timeZoneId: 'America/New_York' }],
];

for (const [name, person] of scenarios) {
  try {
    const r = bazi.baziCalculator.calculateBazi(person);
    console.log(`OK   ${name}: 四柱 ${r.pillars?.year?.ganZhi ?? '?'} ${r.pillars?.month?.ganZhi ?? '?'} ${r.pillars?.day?.ganZhi ?? '?'} ${r.pillars?.hour?.ganZhi ?? '?'}`);
  } catch (e) {
    console.log(`FAIL ${name}: ${e.constructor.name}: ${e.message}`);
    if (e.stack) console.log(e.stack.split('\n').slice(0, 6).join('\n'));
  }
}
