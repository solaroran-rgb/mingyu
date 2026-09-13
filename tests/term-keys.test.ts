import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BRANCH_KEY_MAP,
  STEM_KEY_MAP,
  SIXTY_JIAZI_KEYS,
  ZODIAC_KEY_MAP,
  getJiaziKey,
} from '../packages/core/src/ganzhi/term-keys.ts';
import { SHISHEN_KEY_MAP, getShiShenKey } from '../packages/core/src/bazi/shishen-keys.ts';

const KEY_PATTERN = /^bazi:(stem|branch|zodiac|wuxing|jiazi|shishen):[a-z]+$/;

function collectAllKeys(): string[] {
  return [
    ...Object.values(STEM_KEY_MAP),
    ...Object.values(BRANCH_KEY_MAP),
    ...Object.values(ZODIAC_KEY_MAP),
    ...SIXTY_JIAZI_KEYS,
    ...Object.values(SHISHEN_KEY_MAP),
  ];
}

test('BP1 键表：全部键符合三段式格式', () => {
  for (const key of collectAllKeys()) {
    assert.match(key, KEY_PATTERN, `键格式违规: ${key}`);
  }
});

test('BP1 键表：数量与全局唯一性', () => {
  assert.equal(Object.keys(STEM_KEY_MAP).length, 10);
  assert.equal(Object.keys(BRANCH_KEY_MAP).length, 12);
  assert.equal(Object.keys(ZODIAC_KEY_MAP).length, 12);
  assert.equal(SIXTY_JIAZI_KEYS.length, 60);
  assert.equal(Object.keys(SHISHEN_KEY_MAP).length, 10);
  const all = collectAllKeys();
  assert.equal(new Set(all).size, all.length, '键必须全局唯一');
});

test('BP1 键表：命名基准抽查锚点（已与 terms/7lang-terms.csv 逐键核对）', () => {
  assert.equal(STEM_KEY_MAP['甲'], 'bazi:stem:jia');
  assert.equal(STEM_KEY_MAP['癸'], 'bazi:stem:gui');
  assert.equal(BRANCH_KEY_MAP['巳'], 'bazi:branch:si');
  assert.equal(BRANCH_KEY_MAP['午'], 'bazi:branch:wu');
  assert.equal(ZODIAC_KEY_MAP['鼠'], 'bazi:zodiac:shu');
  assert.equal(SHISHEN_KEY_MAP['七杀'], 'bazi:shishen:qisha');
  assert.equal(SHISHEN_KEY_MAP['比肩'], 'bazi:shishen:bijian');
  assert.equal(SIXTY_JIAZI_KEYS[0], 'bazi:jiazi:jiazi');
  assert.equal(getJiaziKey('己巳'), 'bazi:jiazi:jisi');
  assert.equal(getJiaziKey('癸亥'), 'bazi:jiazi:guihai');
});

test('BP1 键表：未知输入返回 null 不猜键', () => {
  assert.equal(getJiaziKey('甲丑'), null, '非六十甲子组合不得给键');
  assert.equal(getJiaziKey(''), null);
  assert.equal(getShiShenKey('偏官'), null, '别名不进键表，归一由调用方处理');
  assert.equal(getShiShenKey('未知神'), null);
});

test('BP1 键表：戊(wu 干)与午(wu 支)同 slug 不同段不冲突', () => {
  assert.notEqual(STEM_KEY_MAP['戊'], BRANCH_KEY_MAP['午']);
  assert.equal(STEM_KEY_MAP['戊'], 'bazi:stem:wu');
});
