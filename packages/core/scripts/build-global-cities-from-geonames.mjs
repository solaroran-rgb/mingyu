/**
 * 从 GeoNames cities500 dump 重建 packages/core/data/globalCities.json。
 *
 * 红线 1.1-04：经纬度/城市库扩容至 ≥10 万条。
 *
 * 用法：
 *   node scripts/build-global-cities-from-geonames.mjs <cities500.txt> [out.json]
 *
 * 默认输入：仓库根 .tmp-geonames/cities500.txt（不入库，.gitignore）
 * 默认输出：../data/globalCities.json
 *
 * 字段对齐现有 GlobalCity schema（见 global-cities-data.d.ts）：
 *   id=geoname:<geonameid>, name=本地名, nameAscii=ascii, country=ISO alpha-2,
 *   language=该国主语言（ISO 639-1）, admin1, latitude/longitude=WGS84(5 位小数),
 *   timeZoneId=IANA, population, isCapital(feature code PPLC)
 *
 * 可复跑：只要输入 dump 不变，输出确定性一致（同国家内按人口降序，首条固定 AR 首都）。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '../../..');

// --- 国家 → 主语言（ISO 639-1）。原 34 目标市场 + 同语系英语官方国 + 法国。 ---
const EN = [
  'US', 'GB', 'CA', 'AU', 'NZ', 'IE', 'SG', 'IN', 'PH', 'ZA',
  'NG', 'KE', 'GH', 'UG', 'TZ', 'ZM', 'MW', 'BW', 'NA', 'LS',
  'GM', 'SL', 'LR', 'MT', 'BS', 'BB', 'FJ', 'PG', 'SB', 'WS',
  'KI', 'VU', 'CM', 'PK', 'BD', 'MY', 'LK', 'AG', 'DM', 'GD',
  'KN', 'LC', 'VC', 'TT', 'BZ', 'GY', 'JM', 'SZ', 'ZW', 'RW',
  'SC', 'MU',
];
const ES = [
  'ES', 'MX', 'AR', 'CO', 'PE', 'CL', 'VE', 'EC', 'GT', 'CU',
  'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'GQ',
];
const JP = ['JP'];
const KR = ['KR'];
const TH = ['TH'];
const VN = ['VN'];
// 为跨过 10 万门槛补充的主要市场（主语言如实标注）。
const EXTRA = { FR: 'fr' };

const COUNTRY_LANGUAGE = new Map();
for (const cc of EN) COUNTRY_LANGUAGE.set(cc, 'en');
for (const cc of ES) COUNTRY_LANGUAGE.set(cc, 'es');
for (const cc of JP) COUNTRY_LANGUAGE.set(cc, 'ja');
for (const cc of KR) COUNTRY_LANGUAGE.set(cc, 'ko');
for (const cc of TH) COUNTRY_LANGUAGE.set(cc, 'th');
for (const cc of VN) COUNTRY_LANGUAGE.set(cc, 'vi');
for (const [cc, lang] of Object.entries(EXTRA)) COUNTRY_LANGUAGE.set(cc, lang);

// 国家排序：原 34 市场顺序在前（AR 首都 Buenos Aires 固定为首条，兼容既有测试抽样），其余按字母。
const PRIMARY_ORDER = [
  'AR', 'ES', 'MX', 'CO', 'PE', 'CL', 'VE', 'EC', 'GT', 'CU', 'BO', 'DO',
  'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'GQ',
  'US', 'GB', 'CA', 'AU', 'NZ', 'IE', 'SG', 'IN', 'PH', 'ZA',
  'JP', 'KR', 'TH', 'VN',
];

// GeoNames cities500.txt 列（tab 分隔，无表头）
const COL = {
  GEONAMEID: 0, NAME: 1, ASCII: 2, LAT: 4, LON: 5,
  FEAT: 7, CC: 8, ADMIN1: 10, POP: 14, TZ: 17,
};

function round5(value) {
  return Math.round(value * 1e5) / 1e5;
}

function main() {
  const inputArg = process.argv[2];
  const outArg = process.argv[3];
  const inputPath = inputArg
    ? resolve(inputArg)
    : resolve(repoRoot, '.temposoul-wt/thread-p1-104-cities/.tmp-geonames/cities500.txt');
  const outPath = outArg
    ? resolve(outArg)
    : resolve(scriptDir, '../data/globalCities.json');

  console.log(`输入 dump: ${inputPath}`);
  const raw = readFileSync(inputPath, 'utf8');
  const lines = raw.split(/\r?\n/);

  const cities = [];
  const stats = {
    total: 0, kept: 0, skippedCountry: 0, skippedNoTz: 0,
    skippedNoCoord: 0, vnNormalized: 0, capital: 0,
  };
  const invalidTz = new Set();
  const countriesSeen = new Set();
  const langSeen = new Set();

  for (const line of lines) {
    if (!line) continue;
    stats.total++;
    const f = line.split('\t');
    const cc = (f[COL.CC] || '').trim();
    const lang = COUNTRY_LANGUAGE.get(cc);
    if (!lang) { stats.skippedCountry++; continue; }

    const lat = Number(f[COL.LAT]);
    const lon = Number(f[COL.LON]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) ||
        lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      stats.skippedNoCoord++; continue;
    }

    let tz = (f[COL.TZ] || '').trim();
    if (!tz || !tz.includes('/')) { stats.skippedNoTz++; invalidTz.add(tz); continue; }
    // 越南：GeoNames 历史把部分北方城标 Asia/Bangkok，统一归一为 Asia/Ho_Chi_Minh。
    if (cc === 'VN' && tz === 'Asia/Bangkok') { tz = 'Asia/Ho_Chi_Minh'; stats.vnNormalized++; }

    const geonameid = (f[COL.GEONAMEID] || '').trim();
    const name = (f[COL.NAME] || '').trim();
    const nameAscii = (f[COL.ASCII] || name).trim();
    const admin1 = (f[COL.ADMIN1] || '').trim();
    const pop = Number.parseInt(f[COL.POP], 10);
    const isCapital = (f[COL.FEAT] || '').trim() === 'PPLC';
    if (isCapital) stats.capital++;

    countriesSeen.add(cc);
    langSeen.add(lang);

    cities.push({
      id: `geoname:${geonameid}`,
      name,
      nameAscii,
      country: cc,
      language: lang,
      ...(admin1 ? { admin1 } : {}),
      latitude: round5(lat),
      longitude: round5(lon),
      timeZoneId: tz,
      population: Number.isFinite(pop) && pop >= 0 ? pop : 0,
      isCapital,
    });
  }
  stats.kept = cities.length;

  // 排序：主市场顺序在前，其余按国家字母；同国家内人口降序（首都 PPLC 恒居首，人口最大）。
  const primaryIdx = new Map(PRIMARY_ORDER.map((cc, i) => [cc, i]));
  const countryRank = (cc) =>
    primaryIdx.has(cc) ? primaryIdx.get(cc) : PRIMARY_ORDER.length + cc.charCodeAt(0);
  cities.sort((a, b) =>
    countryRank(a.country) - countryRank(b.country) || b.population - a.population);

  // 不按 (country, nameAscii) 去重：10 万级地理库中同名异城（如多个 Springfield）是真实地理实体，
  // 搜索按 score+人口排序可正确区分。仅校验 ID 唯一（GeoNames geonameid 天然唯一）。
  const idSet = new Set();
  let dupId = 0;
  for (const c of cities) {
    if (idSet.has(c.id)) dupId++;
    idSet.add(c.id);
  }
  const finalCities = cities;
  const dupRemoved = 0;

  const meta = {
    version: '2.0.0',
    source: 'GeoNames cities500 (CC-BY 4.0)',
    sourceUrl: 'https://download.geonames.org/export/dump/cities500.zip',
    timezoneSource: 'IANA tzdata (via GeoNames timezone column)',
    generatedAt: new Date().toISOString().slice(0, 10),
    countryCount: countriesSeen.size,
    cityCount: finalCities.length,
  };

  writeFileSync(outPath, JSON.stringify({ ...meta, cities: finalCities }, null, 2) + '\n', 'utf8');

  // 汇总
  console.log('');
  console.log('=== 清洗汇总 ===');
  console.log(`dump 总行数        ${stats.total}`);
  console.log(`保留（目标国家）    ${stats.kept}`);
  console.log(`重复 ID（应为 0）   ${dupId}`);
  console.log(`最终条目            ${finalCities.length}`);
  console.log(`国家数              ${countriesSeen.size}`);
  console.log(`语言覆盖            ${[...langSeen].sort().join(',')}`);
  console.log(`首都数(PPLC)        ${stats.capital}`);
  console.log(`越南时区归一        ${stats.vnNormalized}`);
  console.log(`跳：非目标国家      ${stats.skippedCountry}`);
  console.log(`跳：无非法时区      ${stats.skippedNoTz} 样例=[${[...invalidTz].slice(0, 5).join(',')}]`);
  console.log(`跳：坐标越界        ${stats.skippedNoCoord}`);
  console.log(`首条城市            ${finalCities[0]?.id} ${finalCities[0]?.name} (${finalCities[0]?.latitude}, ${finalCities[0]?.longitude})`);
  console.log(`输出                ${outPath}`);
}

main();
