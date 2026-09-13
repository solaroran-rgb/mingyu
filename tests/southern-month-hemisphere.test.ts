import assert from 'node:assert/strict';
import test from 'node:test';

import { baziCalculator, isSouthernHemisphere, monthStemByYearStem, reverseMonthForSouthernHemisphere } from '@temposoul/core/bazi';

// 468红线 1.3-10 南半球月令反转金标准用例。
// 规则：月支对冲（+6），月干按年干重排五虎遁（整柱在六十甲子简单+6 在地支跨周时会产生非法月柱，已用例2钉死）。

function chart(opts: {
  year: number;
  month: number;
  day: number;
  birthLatitude?: number;
}) {
  return baziCalculator.calculateBazi({
    year: opts.year,
    month: opts.month,
    day: opts.day,
    timeIndex: 6, // 午时（月柱不随时辰变化；取远离 23:00 换日边界）
    gender: 'male',
    useTrueSolarTime: true,
    birthHour: 12,
    birthMinute: 0,
    birthLongitude: 116.4,
    timezone: 8,
    ...(opts.birthLatitude === undefined ? {} : { birthLatitude: opts.birthLatitude }),
  });
}

test('南半球判定谓词：仅 birthLatitude<0 为南半球，缺省/赤道/北半球不变', () => {
  assert.equal(isSouthernHemisphere({ birthLatitude: -33 }), true);
  assert.equal(isSouthernHemisphere({ birthLatitude: -0.0001 }), true);
  assert.equal(isSouthernHemisphere({ birthLatitude: 0 }), false);
  assert.equal(isSouthernHemisphere({ birthLatitude: 39.9 }), false);
  assert.equal(isSouthernHemisphere({}), false);
});

test('五虎遁单元：年干→月干与 tyme4ts 北半球月柱自洽', () => {
  // 乙庚年戊为头：寅月戊寅、午月壬午、酉月乙酉
  assert.equal(monthStemByYearStem('庚', '寅'), '戊');
  assert.equal(monthStemByYearStem('庚', '午'), '壬');
  assert.equal(monthStemByYearStem('庚', '酉'), '乙');
  assert.equal(monthStemByYearStem('庚', '卯'), '己'); // 卯月己卯，非辛卯
});

test('反转纯函数：月支对冲 + 月干重排五虎遁', () => {
  // 庚年午月 壬午 → 子午对冲，子月子干按五虎遁=戊 → 戊子
  assert.equal(reverseMonthForSouthernHemisphere('庚', '壬午'), '戊子');
  // 庚年酉月 乙酉 → 卯酉对冲，卯月月干=己 → 己卯（钉死：不是整柱+6 的 辛卯）
  assert.equal(reverseMonthForSouthernHemisphere('庚', '乙酉'), '己卯');
  assert.notEqual(reverseMonthForSouthernHemisphere('庚', '乙酉'), '辛卯');
});

test('金标准1：2000-06-15 北半球壬午 → 南半球戊子，年日柱不变', () => {
  const north = chart({ year: 2000, month: 6, day: 15 });
  const south = chart({ year: 2000, month: 6, day: 15, birthLatitude: -33 });

  assert.equal(north.pillars.month.ganZhi, '壬午');
  assert.equal(south.pillars.month.ganZhi, '戊子');
  // 年柱/日柱不随半球反转
  assert.equal(north.pillars.year.ganZhi, south.pillars.year.ganZhi);
  assert.equal(north.pillars.day.ganZhi, south.pillars.day.ganZhi);
  assert.equal(north.pillars.year.ganZhi, '庚辰');
});

test('金标准2：1990-09-15 北半球乙酉 → 南半球己卯（非辛卯），年日柱不变', () => {
  const north = chart({ year: 1990, month: 9, day: 15 });
  const south = chart({ year: 1990, month: 9, day: 15, birthLatitude: -33.9 });

  assert.equal(north.pillars.month.ganZhi, '乙酉');
  assert.equal(south.pillars.month.ganZhi, '己卯');
  assert.notEqual(south.pillars.month.ganZhi, '辛卯');
  assert.equal(north.pillars.year.ganZhi, south.pillars.year.ganZhi);
  assert.equal(north.pillars.day.ganZhi, south.pillars.day.ganZhi);
  assert.equal(north.pillars.year.ganZhi, '庚午');
});

test('赤道(lat=0)与缺省纬度均保持北半球月柱，不触发反转', () => {
  const north = chart({ year: 2000, month: 6, day: 15 });
  const equator = chart({ year: 2000, month: 6, day: 15, birthLatitude: 0 });
  assert.equal(equator.pillars.month.ganZhi, north.pillars.month.ganZhi);
  assert.equal(north.pillars.month.ganZhi, '壬午');
});

test('月支随南半球反转：壬午(午)→戊子(子) 地支对冲', () => {
  const south = chart({ year: 2000, month: 6, day: 15, birthLatitude: -33 });
  assert.equal(south.pillars.month.zhi, '子');
  assert.equal(south.pillars.month.gan, '戊');
});
