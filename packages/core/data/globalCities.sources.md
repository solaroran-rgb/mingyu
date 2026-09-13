# 全球城市经纬度与时区数据来源

## 数据源

- **城市坐标与名称**：[GeoNames](https://www.geonames.org/) 公开数据集
  `cities500.txt`（2026-09-13 下载自
  <https://download.geonames.org/export/dump/cities500.zip>），
  覆盖人口 ≥ 500 的居民点及各国行政中心。
  许可：[CC-BY 4.0](https://www.geonames.org/datasources/)。
- **IANA 时区**：取自 GeoNames 第 18 列（timezone），该列直接引用 IANA tzdata
  的区域名（如 `Asia/Tokyo`、`America/New_York`、`Europe/London`）。
  时区合法性由 Node.js 内置 ICU（`Intl.DateTimeFormat`）在校验脚本中逐条验证。

## 生成管线（可复跑）

```
packages/core/scripts/build-global-cities-from-geonames.mjs <cities500.txt> [out.json]
  → packages/core/data/globalCities.json
  → (pnpm build) generate-global-cities.mjs → src/location/global-cities-data.js（gitignore）
```

原始 dump 不入库（放 `.tmp-geonames/`，已 `.gitignore`）。

## 选取口径（2026-09-13 扩容，红线 1.1-04 ≥10 万）

- 收录 77 国：原 34 个目标市场 + 同语系英语官方国 + 法国（fr），共 **108,525 城**。
- 每个国家必选首都（GeoNames feature code `PPLC`），其余按人口降序全量保留（pop≥500）。
- 中国（CN）仍由 `chinaBirthPlaceTree` 覆盖，本文件不重复收录。

## 归一化

- 越南（VN）：`Asia/Bangkok` 统一归一为 `Asia/Ho_Chi_Minh`。

## 字段

```json
{
  "id": "geoname:<geonameid>",
  "name": "本地语言名（UTF-8）",
  "nameAscii": "ASCII 名",
  "country": "ISO 3166-1 alpha-2",
  "language": "该国主语言（ISO 639-1：en|es|fr|ja|ko|th|vi）",
  "admin1": "ISO 3166-2 一级区划代码（可空）",
  "latitude": 纬度（WGS84，5 位小数）,
  "longitude": 经度（WGS84，5 位小数）,
  "timeZoneId": "IANA 时区名",
  "population": 人口（整数，0 表示未知）,
  "isCapital": true
}
```

## 未覆盖（后续建议）

- 未收录 de/pt/ar/ru 等非目标语言市场；
- 未收录人口 < 500 的更小居民点（如需可换 allCountries 全量导入，体积显著增大）。
