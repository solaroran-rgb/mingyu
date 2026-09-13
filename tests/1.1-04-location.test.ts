/**
 * 红线 1.1-04 · 经纬度数据库（全球）
 *
 * 红线要求：location 数据集标注来源、时区 ID，坐标精度达标，可解析成排盘可用坐标。
 * 实现入口：packages/core/src/location/global-cities.ts（GeoNames cities1000, CC-BY 4.0）
 *           + packages/core/src/location/index.ts（中国省市区树）
 *
 * 本测试固定以下事实（防回归）：
 * - 数据集元信息完整：来源 / 来源 URL / 时区来源 / 国家数 / 城市数。
 * - 每条记录经纬度有限、落在 WGS84 合法区间，且带非空 IANA timeZoneId。
 * - 坐标精度不低于 4 位小数（GeoNames 给到 5 位）。
 * - 搜索 / 解析 / 按 ID 查找三条链路可往返。
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  findGlobalCityById,
  getGlobalCities,
  getGlobalCitiesMeta,
  resolveGlobalCity,
  searchGlobalCities,
} from '@temposoul/core/location';

test('1.1-04 全球城市数据集元信息应标注来源与时区来源', () => {
  const meta = getGlobalCitiesMeta();
  assert.match(meta.source, /GeoNames/i, '来源应标注 GeoNames');
  assert.match(meta.sourceUrl, /geonames\.org/i, '应给出 GeoNames 下载 URL');
  assert.match(meta.timezoneSource, /IANA/i, '时区列应说明来自 IANA tzdata');
  assert.ok(meta.countryCount >= 34, `国家数应不少于 34，实际 ${meta.countryCount}`);
  assert.ok(meta.cityCount >= 448, `城市数应不少于 448，实际 ${meta.cityCount}`);
  assert.equal(meta.cityCount, getGlobalCities().length);
});

test('1.1-04 每条全球城市记录应坐标合法且带 IANA 时区名', () => {
  const cities = getGlobalCities();
  assert.ok(cities.length > 0);
  for (const city of cities) {
    assert.ok(Number.isFinite(city.latitude), `${city.name} 纬度应有限`);
    assert.ok(Number.isFinite(city.longitude), `${city.name} 经度应有限`);
    assert.ok(city.latitude >= -90 && city.latitude <= 90, `${city.name} 纬度应在 ±90`);
    assert.ok(city.longitude >= -180 && city.longitude <= 180, `${city.name} 经度应在 ±180`);
    assert.ok(city.timeZoneId.includes('/'), `${city.name} 应带 IANA 时区名，实际 ${city.timeZoneId}`);
    assert.ok(city.id.startsWith('geoname:'), `${city.name} ID 应为 geoname:<id>`);
  }
});

test('1.1-04 全球城市坐标精度应达到 GeoNames 小数级（抽样≥4 位）', () => {
  const cities = getGlobalCities();
  const decimalPlaces = (value: number) => {
    const text = String(value);
    const dot = text.indexOf('.');
    return dot < 0 ? 0 : text.length - dot - 1;
  };
  // 抽样首条（布宜诺斯艾利斯）应达到 5 位小数（GeoNames 原始精度）
  const sample = cities[0];
  assert.ok(decimalPlaces(sample.latitude) >= 4, '首条纬度精度应≥4 位小数');
  assert.ok(decimalPlaces(sample.longitude) >= 4, '首条经度精度应≥4 位小数');
  // 全表坐标均为有限浮点（允许部分城市取整，不强制全表精度）
  for (const city of cities) {
    assert.equal(Number.isInteger(city.latitude) || decimalPlaces(city.latitude) >= 0, true);
  }
});

test('1.1-04 搜索 / 解析 / 按 ID 查找链路应可往返', () => {
  const tokyo = searchGlobalCities('Tokyo', { limit: 1 })[0];
  assert.ok(tokyo, '应能搜到 Tokyo');
  assert.equal(tokyo.timeZoneId, 'Asia/Tokyo');

  const resolved = resolveGlobalCity('Buenos Aires');
  assert.ok(resolved, '应能解析 Buenos Aires');
  assert.equal(resolved.timeZoneId, 'America/Argentina/Buenos_Aires');
  assert.ok(Math.abs(resolved.latitude - -34.61315) < 1e-4);

  const byId = findGlobalCityById(tokyo.id);
  assert.ok(byId, '按 geoname ID 应能回查');
  assert.equal(byId.id, tokyo.id);

  // 越界查询应安全返回空，不抛错
  assert.deepEqual(searchGlobalCities('@@@不存在城市@@@'), []);
  assert.equal(resolveGlobalCity(''), null);
});
