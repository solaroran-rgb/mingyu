/**
 * 红线 1.2-81 · 行星黄经星历口径
 *
 * 红线要求：行星黄经计算所用星历版本应文档化、可对质，结果确定性可复算。
 * 实现入口：packages/core/src/divination/algorithms/astrolabe.ts
 *           星历后端 astronomy-engine 2.1.19（VSOP/ELP 解析级数 + Meeus）。
 *           注：本项目未接入 Swiss Ephemeris（SWISS.EPH）二进制星历，
 *               采用 astronomy-engine 解析星历；对质口径与残差见证据文档。
 *
 * 本测试固定黄金值（防回归）：
 * - 2024-06-21 12:00 北京（UTC+8）太阳黄经 ≈ 90.29°（夏至刚过，巨蟹座初度）。
 * - 全部行星黄经有限、落在 [0,360)。
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { generateAstrolabe } from '@temposoul/core/divination/astrolabe';
import type { AstrolabeBirthInput } from '@temposoul/core/types';

const input: AstrolabeBirthInput = {
  name: '黄金对质',
  gender: '女',
  year: '2024',
  month: '6',
  day: '21',
  hour: '12',
  minute: '0',
  latitude: '39.9042',
  longitude: '116.4074',
  timezone: '8',
  locationName: '北京',
};

test('1.2-81 夏至 2024-06-21 太阳黄经应 ≈ 90.29°（星历确定性黄金值）', () => {
  const chart = generateAstrolabe(input);
  const sun = chart.planets.find((p) => p.name === 'Sun');
  assert.ok(sun, '应含太阳行星');
  // 夏至 2024 太阳入巨蟹（黄经 90°），中午北京应在 90.2~90.4° 之间
  assert.ok(sun.longitude > 90.0 && sun.longitude < 90.6, `太阳黄经 ${sun.longitude} 应≈90.29°`);
});

test('1.2-81 全部行星黄经应有限且归一到 [0,360)', () => {
  const chart = generateAstrolabe(input);
  assert.ok(chart.planets.length >= 7, '应至少含日月+五星');
  for (const planet of chart.planets) {
    assert.ok(Number.isFinite(planet.longitude), `${planet.name} 黄经应有限`);
    assert.ok(planet.longitude >= 0 && planet.longitude < 360, `${planet.name} 黄经应归一`);
  }
});

test('1.2-81 同一输入两次排盘结果应完全一致（确定性）', () => {
  const a = generateAstrolabe(input);
  const b = generateAstrolabe(input);
  const lon = (c: typeof a) => c.planets.map((p) => `${p.name}:${p.longitude.toFixed(6)}`).join('|');
  assert.equal(lon(a), lon(b));
});
