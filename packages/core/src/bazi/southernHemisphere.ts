/**
 * @file 南半球月令反转（独立层，468红线 1.3-10）
 * @description 把「已由排盘核心（tyme4ts 历表 + 节气求根）算出的北半球月柱干支」
 * 反转为南半球月柱干支。本层建立在「已得到的节气/月柱结果」之上，
 * 不触碰节气求根与太阳黄经核心（T-C 线程正在替换底层星历，本层与其解耦）。
 *
 * 规则（命理共识）：南半球太阳直射点季节相反，月支按对应节气反推——
 *   - 月支：北半球月支对冲（在十二支循环中 +6）。
 *   - 月干：按年干与新月支重新五虎遁，而不是把整柱在六十甲子上简单 +6。
 *     原因：十二支循环跨「丑→寅」周界时，六十甲子整柱 +6 会让月干错配，
 *     产生五虎遁不允许的月柱（例如庚年卯月被算成「辛卯」，五虎遁应为「己卯」）。
 *     重排月干后，南半球月柱始终与年干保持合法五虎遁关系。
 *
 * 范围边界：仅反转月柱干支；年柱、日柱、时柱、命宫/身宫/胎元/胎息不在本线程范围。
 */
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from '../ganzhi/data';
import type { Person } from './baziTypes';

const STEMS = HEAVENLY_STEMS as readonly string[];
const BRANCHES = EARTHLY_BRANCHES as readonly string[];

/** 月支对冲步长：子↔午、丑↔未、寅↔申、卯↔酉、辰↔戌、巳↔亥。 */
const BRANCH_OPPOSITE_SHIFT = 6;

/**
 * 是否按南半球口径排盘。
 * 约定：birthLatitude < 0 视为南半球；未提供 / 赤道(=0) / 北纬一律按北半球，
 * 以保证所有既有调用方（不传纬度）行为完全不变。
 */
export function isSouthernHemisphere(input: Pick<Person, 'birthLatitude'>): boolean {
  return (
    typeof input.birthLatitude === 'number' &&
    Number.isFinite(input.birthLatitude) &&
    input.birthLatitude < 0
  );
}

/**
 * 五虎遁：由年干与月支推出月干。
 * 口诀：甲己之年丙作首、乙庚之年戊为头、丙辛之年寻庚起、丁壬壬位顺行流、戊癸甲寅好追求。
 * 寅(十二支第3位)为正月起手。
 */
export function monthStemByYearStem(yearStem: string, monthBranch: string): string {
  const yearIdx = STEMS.indexOf(yearStem);
  const branchIdx = BRANCHES.indexOf(monthBranch);
  if (yearIdx === -1 || branchIdx === -1) {
    throw new Error(`五虎遁无法识别年干或月支：${yearStem}${monthBranch}`);
  }
  const yinMonthStem = (yearIdx * 2 + 2) % 10;
  const offsetFromYin = (branchIdx - BRANCHES.indexOf('寅') + 12) % 12;
  return STEMS[(yinMonthStem + offsetFromYin) % 10];
}

/**
 * 把北半球月柱干支反转为南半球月柱干支。
 * @param yearStem 年柱天干（年柱不随半球反转，仅作五虎遁基准）
 * @param northGanZhi 北半球月柱干支，例如「乙酉」
 * @returns 南半球月柱干支，例如「己卯」
 */
export function reverseMonthForSouthernHemisphere(
  yearStem: string,
  northGanZhi: string,
): string {
  if (
    typeof yearStem !== 'string' ||
    typeof northGanZhi !== 'string' ||
    northGanZhi.length !== 2
  ) {
    throw new Error(`南半球月柱反转入参无效：${yearStem}/${northGanZhi}`);
  }
  const northBranch = northGanZhi[1];
  const northBranchIdx = BRANCHES.indexOf(northBranch);
  if (northBranchIdx === -1) {
    throw new Error(`南半球月柱反转无法识别月支：${northBranch}`);
  }
  const southBranch = BRANCHES[(northBranchIdx + BRANCH_OPPOSITE_SHIFT) % 12];
  const southStem = monthStemByYearStem(yearStem, southBranch);
  return `${southStem}${southBranch}`;
}
