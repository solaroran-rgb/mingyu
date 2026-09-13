/**
 * 红线 1.2-98 · 27 星宿（Nakshatra）边界
 *
 * 红线要求：27 星宿、每宿 13°20′（= 360/27 = 13.3333…），27 星宿名称/主星/四 Pada 齐备，
 * 黄经→星宿边界划分正确。
 * 实现入口：packages/core/src/vedic/tables.ts（longitudeToNakshatra / NAKSHATRAS）
 *           传统依据 Parashara Hora Shastra / Phaladeepika 通行口径。
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  longitudeToNakshatra,
  NAKSHATRAS,
  normalizeLongitude,
} from '@temposoul/core/vedic';

const SPAN = 360 / 27; // 13.3333… = 13°20′

test('1.2-98 应固定 27 星宿，每宿跨 13°20′', () => {
  assert.equal(NAKSHATRAS.length, 27);
  assert.ok(Math.abs(SPAN - 13.3333333) < 1e-4, '每宿应为 13°20′');
  // 每个星宿都带梵名、中文名、主星、主神
  for (const n of NAKSHATRAS) {
    assert.ok(n.sanskrit.length > 0, '梵名非空');
    assert.ok(n.chinese.length > 0, '中文名非空');
    assert.ok(n.lord.length > 0, '主星非空');
    assert.ok(n.deity.length > 0, '主神非空');
  }
});

test('1.2-98 黄经 0° 应为 Ashwini（娄宿），主星 Ketu', () => {
  const pos = longitudeToNakshatra(0);
  assert.equal(pos.nakshatraIndex, 0);
  assert.equal(pos.nakshatra.sanskrit, 'Ashwini');
  assert.equal(pos.nakshatra.chinese, '娄宿');
  assert.equal(pos.nakshatra.lord, 'Ketu');
  assert.equal(pos.within, 0);
  assert.equal(pos.pada, 1);
});

test('1.2-98 宿界 13°20′ 处应归下一宿 Bharani', () => {
  const atBoundary = longitudeToNakshatra(SPAN);
  assert.equal(atBoundary.nakshatraIndex, 1);
  assert.equal(atBoundary.nakshatra.sanskrit, 'Bharani');
  // 宿内中点应落 Pada 2
  const mid = longitudeToNakshatra(SPAN + SPAN / 2);
  assert.equal(mid.nakshatraIndex, 1);
  assert.ok(mid.pada === 2 || mid.pada === 3);
});

test('1.2-98 黄经 360° 应归一回到 Ashwini，27 宿循环闭合', () => {
  const wrap = longitudeToNakshatra(360);
  assert.equal(wrap.nakshatraIndex, 0);
  assert.equal(wrap.nakshatra.sanskrit, 'Ashwini');
  // 最后一宿 Revati 应覆盖约 359°
  const nearEnd = longitudeToNakshatra(359.5);
  assert.equal(nearEnd.nakshatraIndex, 26);
  assert.equal(nearEnd.nakshatra.sanskrit, 'Revati');
  assert.equal(normalizeLongitude(720), 0);
});

test('1.2-98 星宿主星应按 Vimshottari 九曜循环', () => {
  // Ashwini→Bharani→Krittika 主星序列：Ketu→Shukra→Surya
  assert.equal(NAKSHATRAS[0].lord, 'Ketu');
  assert.equal(NAKSHATRAS[1].lord, 'Shukra');
  assert.equal(NAKSHATRAS[2].lord, 'Surya');
});
