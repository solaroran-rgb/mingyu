import test from 'node:test';
import assert from 'node:assert/strict';

import {
  BRANCH_TERM_GROUPS,
} from '../src/data/branch-definitions';
import {
  buildBranchSection,
  selectBranch,
  selectBranches,
  type BranchContext,
} from '../src/lib/translation/branch-selector';

const TEN_GODS = [
  '七杀',
  '正官',
  '正财',
  '偏财',
  '食神',
  '伤官',
  '正印',
  '偏印',
  '比肩',
  '劫财',
];

function ctx(strength: string, related: string[] = []): BranchContext {
  return { dayMasterStrength: strength, relatedTerms: related };
}

test('T2-03: 十神全覆盖——每个十神至少 2 条条件分支 + 1 条 fallback', () => {
  for (const term of TEN_GODS) {
    const group = BRANCH_TERM_GROUPS.find((g) => g.termKey === term);
    assert.ok(group, `${term} 缺少分支组`);
    assert.ok(group.branches.length >= 3, `${term} 分支数 ${group.branches.length} 不足`);
    const conditional = group.branches.filter(
      (b) => Object.keys(b.conditions).length > 0,
    );
    const fallback = group.branches.filter(
      (b) => Object.keys(b.conditions).length === 0 && b.priority === 99,
    );
    assert.ok(conditional.length >= 2, `${term} 条件分支不足 2`);
    assert.equal(fallback.length, 1, `${term} 应恰有 1 条无条件 fallback`);
    for (const b of group.branches) {
      assert.equal(b.status, 'draft', `${term} 分支须标 draft`);
      assert.match(b.archetypeKey, /^bazi:shishen:/, `${term} archetypeKey 须为三段式`);
      assert.ok(b.vernacularZh.length >= 20, `${term} 分支白话过短`);
    }
  }
});

test('T2-03: 白话文案无吉凶词、无绝对化断言', () => {
  const banned = /大凶|大吉|必(然|定|死)|注定|血光|克夫|克妻|凶兆|灾祸(必)/;
  for (const group of BRANCH_TERM_GROUPS) {
    for (const b of group.branches) {
      assert.doesNotMatch(b.vernacularZh, banned, `${b.branchKey} 含禁用词`);
    }
  }
});

test('T2-03: 七杀四分支逐一命中正确（标杆）', () => {
  // A 有制：食伤任一 present
  const a = selectBranch('七杀', ctx('中和', ['食神']));
  assert.equal(a?.branchName, '七杀有制·食伤制杀');
  assert.equal(a?.matchedBy, 'condition');
  // B 无制：身弱 + 食伤缺席
  const b = selectBranch('七杀', ctx('身弱', ['正财']));
  assert.equal(b?.branchName, '七杀无制·杀重身轻');
  // C 佩印：印 present 且食伤缺席
  const c = selectBranch('七杀', ctx('中和', ['正印']));
  assert.equal(c?.branchName, '七杀佩印·杀印相生');
  // D fallback：条件盲区
  const d = selectBranch('七杀', ctx('中和'));
  assert.equal(d?.branchName, '七杀·驱动与压力通用');
  assert.equal(d?.matchedBy, 'fallback');
});

test('T2-03: 各十神条件命中抽测（身强/身弱两向）', () => {
  assert.equal(selectBranch('正官', ctx('身强'))?.branchName, '正官得用·身强任官');
  assert.equal(selectBranch('正官', ctx('极弱'))?.branchName, '正官重·身弱承压');
  assert.equal(selectBranch('正财', ctx('偏强'))?.branchName, '身强担财·财库可守');
  assert.equal(selectBranch('正财', ctx('身弱'))?.branchName, '财多身弱·量入为出');
  assert.equal(selectBranch('食神', ctx('身强'))?.branchName, '食神吐秀·身强创作');
  assert.equal(selectBranch('食神', ctx('极弱'))?.branchName, '食神泄气·节能充电');
  assert.equal(selectBranch('伤官', ctx('身弱', ['正印']))?.branchName, '伤官配印·才华落地');
  assert.equal(selectBranch('正印', ctx('身弱'))?.branchName, '身弱逢印·印星护身');
  assert.equal(selectBranch('偏印', ctx('中和', ['食神']))?.branchName, '枭神夺食·守护表达');
  assert.equal(selectBranch('劫财', ctx('偏强', ['偏财']))?.branchName, '比劫争财·守护成果');
});

test('T2-03: 条件盲区（中和/未知/无关联词）走 fallback', () => {
  for (const strength of ['中和', '未知', '偏弱']) {
    const m = selectBranch('比肩', ctx(strength));
    assert.equal(m?.branchName, '比肩·并肩与自主通用', `strength=${strength} 应走 fallback`);
    assert.equal(m?.matchedBy, 'fallback');
  }
});

test('T2-03: 多命中取 priority 最小（条件 ANY 语义）', () => {
  // 食神+正印同现：A(p1, 食神 ANY) 与 C(p3, 正印 ANY) 同时命中 → 取 A
  const m = selectBranch('七杀', ctx('身弱', ['食神', '正印']));
  assert.equal(m?.branchName, '七杀有制·食伤制杀');
  assert.equal(m?.priority, 1);
  // present 为 ANY：仅伤官也命中 A
  const m2 = selectBranch('七杀', ctx('中和', ['伤官']));
  assert.equal(m2?.branchName, '七杀有制·食伤制杀');
});

test('T2-03: absent 仅阻止被列术语（其他术语不受影响）', () => {
  // 身弱 + 正财（不在 absent 列表）→ B 仍命中
  const m = selectBranch('七杀', ctx('极弱', ['正财']));
  assert.equal(m?.branchName, '七杀无制·杀重身轻');
  // 身弱 + 伤官（在 absent 列表）→ B 被排除 → A 命中（伤官 present）
  const m2 = selectBranch('七杀', ctx('极弱', ['伤官']));
  assert.equal(m2?.branchName, '七杀有制·食伤制杀');
});

test('T2-03: 未知术语返回 null；archetypeKey 归一化可查（点/冒号/连字符）', () => {
  assert.equal(selectBranch('紫微', ctx('身强')), null);
  for (const key of ['bazi:shishen:qisha', 'bazi.shishen.qisha', 'bazi-shishen-qisha']) {
    assert.equal(selectBranch(key, ctx('中和'))?.branchName, '七杀·驱动与压力通用');
  }
});

test('T2-03: selectBranches 批量选择——condition 优先排序 + 去重 + max', () => {
  const matches = selectBranches(
    ['七杀', '正财', '食神', '不存在', '七杀'],
    ctx('身弱', ['食神']),
    4,
  );
  assert.equal(matches.length, 3);
  assert.equal(matches[0].matchedBy, 'condition'); // 七杀有制（食神 present）
  assert.ok(matches.every((m, i) => matches.findIndex((x) => x.branchKey === m.branchKey) === i));
});

test('T2-03: buildBranchSection 组装与空值安全', () => {
  assert.equal(buildBranchSection([]), '');
  const section = buildBranchSection([selectBranch('七杀', ctx('中和'))!]);
  assert.match(section, /【分支白话】/);
  assert.match(section, /· 七杀｜七杀·驱动与压力通用：/);
});
