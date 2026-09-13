import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildArchetypeSection,
  extractGanZhiKeys,
  extractShenShaKeys,
  extractTenGodKeys,
  lookupArchetype,
  toHyphenKey,
} from '../src/lib/ai/archetype-bridge';

test('M3: 十神提取——日主庚金对四柱天干', () => {
  // 庚金日主：庚=比肩(跳过自身)、辛=劫财、丁=正官、乙=正财
  const keys = extractTenGodKeys('庚', ['庚', '辛', '丁', '乙']);
  assert.deepEqual(keys, ['bazi.shishen.jiecai', 'bazi.shishen.zhengguan', 'bazi.shishen.zhengcai']);
  assert.ok(keys.every((k) => lookupArchetype(k)), '每个 key 都应能查到词条');
});

test('M3: 十神极性——阳日主见阳我为比肩，见阴我为劫财', () => {
  assert.deepEqual(extractTenGodKeys('甲', ['甲', '乙']), ['bazi.shishen.jiecai']);
  assert.deepEqual(extractTenGodKeys('甲', ['丙']), ['bazi.shishen.shishen']);
  assert.deepEqual(extractTenGodKeys('甲', ['壬']), ['bazi.shishen.pianyin']);
});

test('M3: 神煞名直查——词库未收录的优雅跳过', () => {
  const keys = extractShenShaKeys(['天乙贵人', '桃花', '不存在的神煞']);
  assert.deepEqual(keys, ['bazi.shensha.tianyi_guiren', 'bazi.shensha.taohua']);
});

test('M3: 干支单字词条', () => {
  const keys = extractGanZhiKeys(['庚', '辛'], ['午', '巳']);
  assert.deepEqual(keys, ['bazi.tiangan.geng', 'bazi.tiangan.xin', 'bazi.dizhi.wu', 'bazi.dizhi.si']);
});

test('M3: L1/L3 段构建——含古籍引文与白话口径', () => {
  const section = buildArchetypeSection(['bazi.shishen.bijian', 'bazi.shensha.taohua']);
  assert.match(section, /【原型法理锚定与白话口径】/);
  assert.match(section, /· 比肩｜《渊海子平》：比肩者，兄弟也，同我者也。/);
  assert.match(section, /白话口径：同辈、朋友、伙伴/);
  assert.match(section, /· 桃花｜/);
});

test('M3: 未收录 key 查表返回 undefined，段构建优雅跳过', () => {
  assert.equal(lookupArchetype('bazi.notexist.key'), undefined);
  assert.equal(buildArchetypeSection(['bazi.notexist.key']), '');
});

test('M3: key 规范互转——点分↔白皮书连字符', () => {
  assert.equal(toHyphenKey('bazi.shishen.qisha'), 'bazi-shishen-qisha');
});
