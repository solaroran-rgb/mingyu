import test from 'node:test';
import assert from 'node:assert/strict';

import { BRANCH_SEMANTIC_LIBRARY } from '../src/data/branch-semantic-library';
import { BRANCH_TERM_GROUPS } from '../src/data/branch-definitions';

const FORBID = /必死|注定|一定会|绝对|大凶|血光|夭折|活不过|必(然|定)(会|将)|百分之百|克夫|克妻|灾祸|稳赚|治好|痊愈/;

test('T2-02: 分支语义库全量覆盖 31 分支且全标 draft', () => {
  const expected = BRANCH_TERM_GROUPS.reduce((n, g) => n + g.branches.length, 0);
  assert.equal(BRANCH_SEMANTIC_LIBRARY.entries.length, expected, '语义库应覆盖全部分支');
  assert.ok(expected >= 30, `分支总数 ${expected} 应 ≥30`);
  for (const e of BRANCH_SEMANTIC_LIBRARY.entries) {
    assert.equal(e.status, 'draft', `${e.branchKey} 必须标 draft`);
  }
});

test('T2-02: branchKey 与 branch-definitions 一一对应', () => {
  const valid = new Set(
    BRANCH_TERM_GROUPS.flatMap((g) => g.branches.map((b) => b.branchKey)),
  );
  for (const e of BRANCH_SEMANTIC_LIBRARY.entries) {
    assert.ok(valid.has(e.branchKey), `未知 branchKey：${e.branchKey}`);
  }
  assert.equal(new Set(BRANCH_SEMANTIC_LIBRARY.entries.map((e) => e.branchKey)).size, valid.size, '不得重复');
});

test('T2-02: 语义文本过禁词门禁且长度合规', () => {
  for (const e of BRANCH_SEMANTIC_LIBRARY.entries) {
    assert.doesNotMatch(e.semanticZh, FORBID, `${e.branchKey} 含禁词`);
    assert.ok(e.semanticZh.length >= 15 && e.semanticZh.length <= 120, `${e.branchKey} 长度越界`);
  }
});
