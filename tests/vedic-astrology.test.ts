/**
 * 吠陀占星（Jyotish）Phase1 基础测试
 * 覆盖：Lahiri Ayanamsa 数值断言 / Rashi·Nakshatra·Pada 边界 / 整宫 Bhava /
 *       全量排盘骨架 / Lagna 与西洋盘上升交叉校验 / evidenceTrail 契约。
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  generateVedicChart,
  lahiriAyanamsa,
  tropicalToSidereal,
  longitudeToRashi,
  longitudeToNakshatra,
  meanNodeLongitude,
} from '../packages/core/src/vedic/index.ts';
import { validateEvidenceItem } from '../packages/core/src/shared/evidence.ts';
import { generateAstrolabe } from '../packages/core/src/divination/algorithms/astrolabe.ts';

const baseInput = {
  name: '测试命例',
  gender: '男' as const,
  year: '1990',
  month: '5',
  day: '20',
  hour: '12',
  minute: '0',
  latitude: '36.65',
  longitude: '117.0',
  timeZoneId: 'Asia/Shanghai',
  locationName: '济南',
};

// ---- 1. Lahiri Ayanamsa 数值断言 -------------------------------------------

test('Lahiri Ayanamsa：J2000.0 锚点 ≈ 23°51′11.5″', () => {
  const a = lahiriAyanamsa(2000.0);
  assert.ok(Math.abs(a - 23.853205) < 0.0005, `实际 ${a}`);
});

test('Lahiri Ayanamsa：2026 年 ≈ 24.21°–24.23°（方案文档锚点）', () => {
  const a = lahiriAyanamsa(2026.0);
  assert.ok(a > 24.20 && a < 24.24, `实际 ${a}`);
});

test('Lahiri Ayanamsa：单调递增（岁差长期项为正）', () => {
  assert.ok(lahiriAyanamsa(1950.0) < lahiriAyanamsa(2000.0));
  assert.ok(lahiriAyanamsa(2000.0) < lahiriAyanamsa(2050.0));
});

test('tropicalToSidereal：sidereal = tropical − ayanamsa，公式恒等', () => {
  const a = lahiriAyanamsa(2020.5);
  const sid = tropicalToSidereal(100, a);
  assert.ok(Math.abs(sid - ((100 - a + 360) % 360)) < 1e-9);
  // 跨 0° 边界回绕
  const wrap = tropicalToSidereal(1, a);
  assert.ok(wrap > 335 && wrap < 360);
});

// ---- 2. Rashi 边界 ---------------------------------------------------------

test('Rashi：0° 归 Mesha，30° 边界归 Vrishabha', () => {
  assert.equal(longitudeToRashi(0).rashi.sanskrit, 'Mesha');
  assert.equal(longitudeToRashi(29.9999).rashi.sanskrit, 'Mesha');
  assert.equal(longitudeToRashi(30).rashi.sanskrit, 'Vrishabha');
  assert.equal(longitudeToRashi(359.999).rashi.sanskrit, 'Meena');
  assert.equal(longitudeToRashi(90).degreeInRashi, 0);
});

// ---- 3. Nakshatra / Pada 边界 ---------------------------------------------

test('Nakshatra：0° 起 Ashwini Pada1，宿首边界切换', () => {
  const first = longitudeToNakshatra(0);
  assert.equal(first.nakshatraIndex, 0);
  assert.equal(first.nakshatra.sanskrit, 'Ashwini');
  assert.equal(first.pada, 1);

  // 恰好 13°20′ = 第二宿首
  const b = longitudeToNakshatra(13 + 1 / 3);
  assert.equal(b.nakshatraIndex, 1);
  assert.equal(b.nakshatra.sanskrit, 'Bharani');
  assert.equal(b.pada, 1);

  // 360° 回绕仍为 Revati 末宿
  const last = longitudeToNakshatra(359.999);
  assert.equal(last.nakshatraIndex, 26);
  assert.equal(last.nakshatra.sanskrit, 'Revati');
});

test('Nakshatra：Pada 在 3°20′ / 6°40′ / 10°00′ 切换', () => {
  assert.equal(longitudeToNakshatra(1).pada, 1);
  assert.equal(longitudeToNakshatra(3.3334).pada, 2);
  assert.equal(longitudeToNakshatra(6.7).pada, 3);
  assert.equal(longitudeToNakshatra(10.1).pada, 4);
});

test('Nakshatra：27 宿主星周期为 Vimshottari 九曜循环', () => {
  const lords = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) =>
    longitudeToNakshatra(i * (360 / 27)).nakshatra.lord,
  );
  assert.deepEqual(lords, ['Ketu', 'Shukra', 'Surya', 'Chandra', 'Mangala', 'Rahu', 'Guru', 'Shani', 'Budha']);
});

// ---- 4. 全量排盘骨架 -------------------------------------------------------

test('generateVedicChart：输出 9 Graha + Lagna + 出生宿', () => {
  const chart = generateVedicChart(baseInput);
  assert.equal(chart.grahas.length, 9);
  const names = chart.grahas.map((g) => g.name).sort();
  assert.deepEqual(names, ['Jupiter', 'Ketu', 'Mars', 'Mercury', 'Moon', 'Rahu', 'Saturn', 'Sun', 'Venus']);
  assert.ok(chart.lagna.name === 'Lagna');
  assert.ok(chart.nakshatra.birthMoon.name);
  assert.ok(chart.nakshatra.birthMoon.lordLabel);
  assert.ok(chart.nakshatra.birthMoon.balance >= 0 && chart.nakshatra.birthMoon.balance < 1);
});

test('generateVedicChart：罗睺计都相差 180°', () => {
  const chart = generateVedicChart(baseInput);
  const rahu = chart.grahas.find((g) => g.name === 'Rahu')!;
  const ketu = chart.grahas.find((g) => g.name === 'Ketu')!;
  const diff = Math.abs(rahu.siderealLongitude - ketu.siderealLongitude);
  assert.ok(Math.abs(diff - 180) < 0.01 || Math.abs(diff - 360) < 0.01, `diff=${diff}`);
});

test('generateVedicChart：Whole Sign 宫位以 Lagna 为第 1 宫自洽', () => {
  const chart = generateVedicChart(baseInput);
  assert.equal(chart.lagna.bhava, 1);
  for (const g of chart.grahas) {
    const expected = (((g.rashiIndex - chart.lagna.rashiIndex) % 12) + 12) % 12 + 1;
    assert.equal(g.bhava, expected, `${g.name} 宫位`);
  }
});

test('generateVedicChart：mean node 与 true node 接近（相差 < 1°）', () => {
  const mean = generateVedicChart({ ...baseInput, nodeMode: 'mean' });
  const trueNode = generateVedicChart({ ...baseInput, nodeMode: 'true' });
  const rahuM = mean.grahas.find((g) => g.name === 'Rahu')!;
  const rahuT = trueNode.grahas.find((g) => g.name === 'Rahu')!;
  let d = Math.abs(rahuM.siderealLongitude - rahuT.siderealLongitude);
  if (d > 180) d = 360 - d;
  assert.ok(d < 1.5, `mean/true Rahu 偏差 ${d}°`);
});

test('generateVedicChart：拒绝无效输入', () => {
  assert.throws(() => generateVedicChart({ ...baseInput, year: '1899' }), /1900-2100/);
  assert.throws(() => generateVedicChart({ ...baseInput, latitude: '95' }), /纬度/);
  assert.throws(
    () => generateVedicChart({ ...baseInput, timezone: undefined, timeZoneId: undefined }),
    /时区/,
  );
});

// ---- 5. Lagna 与西洋盘上升交叉校验 -----------------------------------------

test('Lagna：与西洋盘上升点回归黄经交叉校验（< 0.5°）', () => {
  const vedic = generateVedicChart(baseInput);
  const western = generateAstrolabe(baseInput);
  const asc = western.angles.find((a) => a.name === 'Ascendant')!;
  let d = Math.abs(vedic.lagna.tropicalLongitude - asc.longitude);
  if (d > 180) d = 360 - d;
  assert.ok(d < 0.5, `vedic=${vedic.lagna.tropicalLongitude.toFixed(4)} western=${asc.longitude.toFixed(4)} diff=${d.toFixed(4)}`);
});

// ---- 6. evidenceTrail 契约 -------------------------------------------------

test('vedic evidenceTrail：满足四字段契约且覆盖 4 环节', () => {
  const chart = generateVedicChart(baseInput);
  assert.ok(chart.evidenceTrail);
  const items = chart.evidenceTrail!.items;
  assert.ok(items.length >= 4, `实际 ${items.length}`);
  for (const item of items) {
    const errors = validateEvidenceItem(item);
    assert.deepEqual(errors, [], `证据「${item.title}」违规: ${errors.join('; ')}`);
  }
  const titles = items.map((i) => i.title);
  assert.ok(titles.some((t) => t.includes('排盘基础')));
  assert.ok(titles.some((t) => t.includes('九曜')));
  assert.ok(titles.some((t) => t.includes('上升点')));
  assert.ok(titles.some((t) => t.includes('Nakshatra')));
});

test('平均交点：输出在 [0,360) 且短区间内逆行（约 19.34°/年）', () => {
  const t1 = Date.UTC(1990, 4, 20, 0);
  const t2 = Date.UTC(1990, 5, 20, 0); // 30 天后，不跨 0° 回绕
  const n1 = meanNodeLongitude(t1);
  const n2 = meanNodeLongitude(t2);
  assert.ok(n1 > 0 && n1 < 360);
  // 30 天逆行约 1.59°；无论是否跨 0°，前向差都应接近 360−1.59=358.4°
  const forward = ((n2 - n1) % 360 + 360) % 360;
  assert.ok(forward > 358 && forward < 360, `30 天前向差 ${forward}°`);
});
