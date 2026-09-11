# 全球主要城市经纬度与时区数据来源

## 数据源

- **城市坐标与名称**：[GeoNames](https://www.geonames.org/) 公开数据集
  `cities1000.txt`（2026-09-11 下载自
  <https://download.geonames.org/export/dump/cities1000.zip>），
  覆盖人口 ≥ 1000 的居民点及各国行政中心。
  许可：[CC-BY 4.0](https://www.geonames.org/datasources/)。
- **IANA 时区**：取自 GeoNames 第 18 列（timezone），该列直接引用 IANA tzdata
  的区域名（如 `Asia/Tokyo`、`America/New_York`、`Europe/London`）。
  时区合法性由 Node.js 内置 ICU（`Intl.DateTimeFormat`）在校验脚本中逐一枚举验证。

## 选取口径

- 覆盖网站 7 语言目标市场对应的 34 个国家：
  en（US/GB/CA/AU/NZ/IE/SG/IN/PH/ZA）、
  es（ES/MX/AR/CO/PE/CL/VE/EC/GT/CU/BO/DO/HN/PY/SV/NI/CR/PA/UY/GQ）、
  ja（JP）、ko（KR）、th（TH）、vi（VN）。
- 每个国家必选首都（GeoNames feature code `PPLC` 优先），其余按人口降序取
  前 N（大国 30–40，中 15–20，小 5–10），共 448 个城市。
- 中国（CN）由既有 `chinaBirthPlaceTree.json` 覆盖（34 省 / 392 市 / 3210 区），
  本文件不重复收录。

## 归一化

- 越南（VN）：GeoNames 历史上把河内、海防等北方城市标为 `Asia/Bangkok`，
  但 IANA tzdata 中越南的规范区名是 `Asia/Ho_Chi_Minh`（两者规则完全一致，
  UTC+7 无 DST）。本数据集统一归一化为 `Asia/Ho_Chi_Minh`。

## 字段

```json
{
  "id": "geoname:<geonameid>",
  "name": "本地语言名（UTF-8）",
  "nameAscii": "ASCII 名",
  "country": "ISO 3166-1 alpha-2",
  "language": "目标语言代码 en|es|ja|ko|th|vi",
  "admin1": "ISO 3166-2 一级区划代码（可空）",
  "latitude": 纬度（WGS84，5 位小数）,
  "longitude": 经度（WGS84，5 位小数）,
  "timeZoneId": "IANA 时区名",
  "population": 人口（整数，0 表示未知）,
  "isCapital": true
}
```

## 未覆盖（后续建议）

- 未收录人口 < 1000 的小城镇与农村地区；
- 未收录港澳台以外的海外华人城市细分；
- 未收录非洲法语/葡语市场（fr/pt 不在本期 7 语言目标内）；
- 未收录中东（ar）市场。
如需更大覆盖，建议购买 GeoNames Premium 或自建 cities5000/cities50000 全量导入。
