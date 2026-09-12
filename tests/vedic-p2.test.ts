/**
 * 吠陀占星 Phase2 测试 — D9 Navamsa 分盘 + Vimshottari Dasha 起算
 *
 * 期望值来源（每个断言都标注手算/规则出处）：
 *  - D9：Parashari Chara Navamsa（BPHS）起始规则——移动宫自本宫、固定宫 +8、双元宫 +4；
 *        下列落点均按该规则逐一手算，非外部库输出。
 *  - Vimshottari：BPHS 标准年限 7/20/6/10/7/18/16/19/17（合计 120，Budha=17 经多源核对）；
 *        Antardasha 段长 = 大运年限 × 段主星年限 / 120；日历年 365.25 日。
 *  - 全量排盘集成：仅做结构与自洽性断言（与 Phase1 同一 astronomy-engine 星历）。
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  generateVedicChart,
  longitudeToNavamsa,
  navamsaStartSign,
  computeVimshottari,
  locateVimshottariAt,
  VIMSHOTTARI_YEARS,
  VIMSHOTTARI_ORDER,
} from '../packages/core/src/vedic/index.ts';

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

// ---- 1. D9 Navamsa：起始规则手算 -------------------------------------------

test('D9：navamsaStartSign 起始星座表（Parashari Chara）', () => {
  // 移动宫自本宫：Mesha/Karka/Tula/Makara
  assert.equal(navamsaStartSign(0), 0);
  assert.equal(navamsaStartSign(3), 3);
  assert.equal(navamsaStartSign(6), 6);
  assert.equal(navamsaStartSign(9), 9);
  // 固定宫 +8：Vrishabha→Makara(9)、Simha→Mesha(0)、Vrishchika→Karka(3)、Kumbha→Tula(6)
  assert.equal(navamsaStartSign(1), 9);
  assert.equal(navamsaStartSign(4), 0);
  assert.equal(navamsaStartSign(7), 3);
  assert.equal(navamsaStartSign(10), 6);
  // 双元宫 +4：Mithuna→Tula(6)、Kanya→Makara(9)、Dhanu→Mesha(0)、Meena→Karka(3)
  assert.equal(navamsaStartSign(2), 6);
  assert.equal(navamsaStartSign(5), 9);
  assert.equal(navamsaStartSign(8), 0);
  assert.equal(navamsaStartSign(11), 3);
});

test('D9：恒星黄经逐点落位（手算期望值）', () => {
  // 0° = Mesha 第 0 个 Navamsa → Mesha
  assert.equal(longitudeToNavamsa(0).rashiIndex, 0);
  // 3.333° = Mesha 第 1 个 Navamsa → Vrishabha
  assert.equal(longitudeToNavamsa(3.34).rashiIndex, 1);
  // 30° = Vrishabha 首（固定宫起 Makara=9）→ Makara
  assert.equal(longitudeToNavamsa(30).rashiIndex, 9);
  // 33.333° = Vrishabha 第 1 个 → Kumbha(10)
  assert.equal(longitudeToNavamsa(33.34).rashiIndex, 10);
  // 60° = Mithuna 首（双元起 Tula=6）→ Tula
  assert.equal(longitudeToNavamsa(60).rashiIndex, 6);
  // 90° = Karka 首（移动自宫）→ Karka
  assert.equal(longitudeToNavamsa(90).rashiIndex, 3);
  // 120° = Simha 首（固定 +8 → Mesha）
  assert.equal(longitudeToNavamsa(120).rashiIndex, 0);
  // 150° = Kanya 首（双元 +4 → Makara）
  assert.equal(longitudeToNavamsa(150).rashiIndex, 9);
  // 180° = Tula 首（移动自宫）→ Tula
  assert.equal(longitudeToNavamsa(180).rashiIndex, 6);
  // 270° = Makara 首（移动自宫）→ Makara
  assert.equal(longitudeToNavamsa(270).rashiIndex, 9);
  // 359.999° 仍在 Meena 第 9 个 Navamsa（双元起 Karka=3，+8 → Meena=11）；恰 0° 才回绕 Mesha
  assert.equal(longitudeToNavamsa(359.999).rashiIndex, 11);
  assert.equal(longitudeToNavamsa(0).rashiIndex, 0);
});

test('D9：全黄道 108 Navamsa 落位连续无空洞', () => {
  for (let i = 0; i < 108; i++) {
    const lon = i * (360 / 108) + 1e-6;
    const pos = longitudeToNavamsa(lon);
    assert.equal(pos.navamsaIndex, i, `navamsaIndex @ ${i}`);
    assert.ok(pos.rashiIndex >= 0 && pos.rashiIndex <= 11);
  }
});

// ---- 2. Vimshottari：年限与序列 -------------------------------------------

test('Vimshottari：九曜年限合计 = 120（Budha=17 为标准值）', () => {
  const sum = VIMSHOTTARI_ORDER.reduce((acc, lord) => acc + VIMSHOTTARI_YEARS[lord], 0);
  assert.equal(sum, 120);
  assert.equal(VIMSHOTTARI_YEARS.Budha, 17);
  assert.deepEqual(VIMSHOTTARI_ORDER, ['Ketu', 'Shukra', 'Surya', 'Chandra', 'Mangala', 'Rahu', 'Guru', 'Shani', 'Budha']);
});

test('Vimshottari：balance=0 且出生 Ashwini（Ketu）起运，首段满 7 年', () => {
  const birthMs = Date.UTC(2000, 0, 1);
  const dasha = computeVimshottari({ birthMs, birthLord: 'Ketu', balance: 0 });
  assert.equal(dasha.mahadashas.length, 9);
  assert.equal(dasha.birthLord, 'Ketu');
  assert.equal(dasha.mahadashas[0].lord, 'Ketu');
  assert.equal(dasha.mahadashas[0].durationYears, 7);
  // balance=0 → 首大运恰从出生时刻开始
  assert.equal(dasha.mahadashas[0].startMs, birthMs);
  // 序列
  assert.deepEqual(
    dasha.mahadashas.map((m) => m.lord),
    ['Ketu', 'Shukra', 'Surya', 'Chandra', 'Mangala', 'Rahu', 'Guru', 'Shani', 'Budha'],
  );
  // 总长 = 120 年（365.25 日/年）
  const spanYears = (dasha.mahadashas[8].endMs - dasha.mahadashas[0].startMs) / (365.25 * 86400000);
  assert.ok(Math.abs(spanYears - 120) < 1e-9, `span=${spanYears}`);
});

test('Vimshottari：Antardasha 段长按比例切分（手算期望值）', () => {
  const birthMs = Date.UTC(2000, 0, 1);
  const dasha = computeVimshottari({ birthMs, birthLord: 'Ketu', balance: 0 });
  const ketuMaha = dasha.mahadashas[0];
  assert.equal(ketuMaha.antardashas.length, 9);
  // 起于 Ketu 自身
  assert.equal(ketuMaha.antardashas[0].lord, 'Ketu');
  // Ketu-Ketu = 7*7/120 = 0.408333…
  assert.ok(Math.abs(ketuMaha.antardashas[0].durationYears - 49 / 120) < 1e-6);
  // Ketu-Shukra = 7*20/120 = 1.166667…
  assert.ok(Math.abs(ketuMaha.antardashas[1].durationYears - 140 / 120) < 1e-6);
  // Ketu-Surya = 7*6/120 = 0.35
  assert.ok(Math.abs(ketuMaha.antardashas[2].durationYears - 0.35) < 1e-6);
  // 段长之和 = 大运年限 7 年
  const antarSum = ketuMaha.antardashas.reduce((a, x) => a + x.durationYears, 0);
  assert.ok(Math.abs(antarSum - 7) < 1e-6, `antarSum=${antarSum}`);
});

test('Vimshottari：balance=0.5 时首大运提前起运、出生点落在其中', () => {
  const birthMs = Date.UTC(2000, 0, 1);
  const dasha = computeVimshottari({ birthMs, birthLord: 'Ketu', balance: 0.5 });
  const first = dasha.mahadashas[0];
  // 已过 0.5*7=3.5 年 → 大运起点早于出生
  const startToBirthYears = (birthMs - first.startMs) / (365.25 * 86400000);
  assert.ok(Math.abs(startToBirthYears - 3.5) < 1e-9, `elapsed=${startToBirthYears}`);
  // 剩余 3.5 年
  const birthToEndYears = (first.endMs - birthMs) / (365.25 * 86400000);
  assert.ok(Math.abs(birthToEndYears - 3.5) < 1e-9);
  // 定位：出生时刻在 Ketu 大运内
  const at = locateVimshottariAt(dasha, birthMs);
  assert.ok(at && at.maha.lord === 'Ketu');
});

test('Vimshottari：balance 非法值抛错', () => {
  assert.throws(() => computeVimshottari({ birthMs: Date.now(), birthLord: 'Ketu', balance: 1 }), /balance/);
});

// ---- 3. 全量排盘集成（结构/自洽） -------------------------------------------

test('generateVedicChart：产出 D1 + D9 分盘落位', () => {
  const chart = generateVedicChart(baseInput);
  assert.ok(chart.vargas);
  assert.ok(chart.vargas!.D1);
  assert.ok(chart.vargas!.D9);
  // Lagna + 9 Graha = 10 个落位
  assert.equal(chart.vargas!.D1.placements.length, 10);
  assert.equal(chart.vargas!.D9.placements.length, 10);
  for (const p of chart.vargas!.D9.placements) {
    assert.ok(p.rashiIndex >= 0 && p.rashiIndex <= 11);
    assert.ok(p.navamsaInSign >= 0 && p.navamsaInSign <= 8);
  }
});

test('generateVedicChart：Vimshottari 起运星 = 出生月亮宿主星', () => {
  const chart = generateVedicChart(baseInput);
  assert.ok(chart.vimshottari);
  assert.equal(chart.vimshottari!.mahadashas.length, 9);
  assert.equal(chart.vimshottari!.birthLord, chart.nakshatra.birthMoon.lord);
  // 九段主星年限合计 120
  const sum = chart.vimshottari!.mahadashas.reduce((a, m) => a + m.durationYears, 0);
  assert.ok(Math.abs(sum - 120) < 1e-9, `sum=${sum}`);
  // 每段 Antardasha 段长之和等于该大运年限
  for (const m of chart.vimshottari!.mahadashas) {
    const antarSum = m.antardashas.reduce((a, x) => a + x.durationYears, 0);
    assert.ok(Math.abs(antarSum - m.durationYears) < 1e-4, `${m.lord} antarSum=${antarSum}`);
  }
});

test('generateVedicChart：evidenceTrail 覆盖 Dasha 与 D9 两新环节', () => {
  const chart = generateVedicChart(baseInput);
  const titles = chart.evidenceTrail!.items.map((i) => i.title);
  assert.ok(titles.some((t) => t.includes('Vimshottari')), titles.join('|'));
  assert.ok(titles.some((t) => t.includes('D9')), titles.join('|'));
});
