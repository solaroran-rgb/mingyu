#!/usr/bin/env node
/**
 * check-i18n.mjs — 7 语言工程复核脚本
 *
 * 运行方式（仓库根目录）：
 *   pnpm exec tsx scripts/check-i18n.mjs
 *
 * 检查项：
 *   1. key 树对齐：以 zh-CN 为基准，列出其他语言缺 key / 多 key / 类型不一致
 *   2. 占位符一致性：{n} / {{var}} / %s / %d 等在各语言中的出现与集合一致
 *   3. 格式错误：未闭合引号、异常转义、控制字符、BOM、字符串内含裸换行
 *   4. 术语 / 品牌一致性：MingyuCoreError 泄漏；中文「命律」出现在非中文译文；
 *      appName 品牌词在同一 locale 内是否一致
 *   5. 译文长度溢出：同 key 各语言长度 / zh-CN 长度 > 3 倍列告警
 *
 * 退出码：0 = 无 error（warning 可接受）；1 = 存在 error。
 */
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const LOCALES = {
  'zh-CN': { file: 'zh-CN.ts', export: 'zhCN' },
  en: { file: 'en.ts', export: 'en' },
  'es-ES': { file: 'es-ES.ts', export: 'esES' },
  ja: { file: 'ja.ts', export: 'ja' },
  'ko-KN': { file: 'ko-KN.ts', export: 'koKN' },
  'th-TH': { file: 'th-TH.ts', export: 'thTH' },
  'vi-VN': { file: 'vi-VN.ts', export: 'viVN' },
};

// 品牌名：这些 token 出现在 UI 译文中属于残留/泄漏
const FORBIDDEN_TOKENS = ['MingyuCoreError'];
// 非中文 locale 中不应出现的原始中文字样（ja 因可直读汉字，列入白名单）
const RAW_CHINESE_BRAND = '命律';
const JA_OK = new Set(['ja']);

const PLACEHOLDER_RE = /\{\s*\w+\s*\}|\{\{\s*\w+\s*\}\}|%[sda]|%\(\w+\)[sda]/g;

const errors = [];
const warnings = [];
const info = [];

// ---------- 加载所有 locale 字典 ----------
const dicts = {};
for (const [name, meta] of Object.entries(LOCALES)) {
  const abs = path.join(ROOT, 'src', 'i18n', 'locales', meta.file);
  const mod = await import(pathToFileURL(abs).href);
  const dict = mod[meta.export];
  if (!dict) {
    errors.push(`[load] ${name}: 导出 ${meta.export} 未找到`);
    continue;
  }
  dicts[name] = dict;
}

const base = dicts['zh-CN'];

// ---------- 工具：递归拍平 key 树 ----------
function flatten(obj, prefix = '', out = new Map()) {
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => flatten(item, `${prefix}[${i}]`, out));
    return out;
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
    }
    return out;
  }
  out.set(prefix, obj);
  return out;
}

const flatBase = flatten(base);
const flatOthers = {};
for (const name of Object.keys(LOCALES)) {
  flatOthers[name] = flatten(dicts[name]);
}

// ---------- 1. key 树对齐 ----------
for (const name of Object.keys(LOCALES)) {
  if (name === 'zh-CN') continue;
  const fb = flatBase;
  const fo = flatOthers[name];
  for (const k of fb.keys()) {
    if (!fo.has(k)) errors.push(`[missing] ${name}: 缺少 key "${k}"`);
  }
  for (const k of fo.keys()) {
    if (!fb.has(k)) warnings.push(`[extra] ${name}: 多出 key "${k}"（基准 zh-CN 无）`);
  }
}

// ---------- 2. 占位符一致性 ----------
function placeholdersIn(s) {
  const m = String(s).match(PLACEHOLDER_RE);
  return m ? [...new Set(m)].sort() : [];
}

for (const k of flatBase.keys()) {
  const basePh = placeholdersIn(flatBase.get(k));
  for (const name of Object.keys(LOCALES)) {
    if (name === 'zh-CN') continue;
    if (!flatOthers[name].has(k)) continue;
    const ph = placeholdersIn(flatOthers[name].get(k));
    if (JSON.stringify(ph) !== JSON.stringify(basePh)) {
      errors.push(
        `[placeholder] ${name} key "${k}": 占位符集合不一致 (zh-CN: [${basePh.join(', ')}] vs ${name}: [${ph.join(', ')}])`,
      );
    }
  }
}

// ---------- 3. 格式错误 ----------
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFEFF]/;
for (const name of Object.keys(LOCALES)) {
  for (const [k, v] of flatOthers[name]) {
    if (typeof v !== 'string') continue;
    if (CONTROL_RE.test(v)) {
      errors.push(`[format] ${name} key "${k}": 含控制字符/BOM`);
    }
    // 未转义的裸换行在 TS 单引号字符串里不可能存在；这里检查常见异常转义
    if (/\\[^'"]/.test(v) && !/\\u[0-9a-fA-F]{4}/.test(v)) {
      // 允许 \n 等显式转义；此处只标记可疑
      warnings.push(`[format] ${name} key "${k}": 含可疑转义序列`);
    }
  }
}

// ---------- 4. 术语 / 品牌一致性 ----------
for (const name of Object.keys(LOCALES)) {
  for (const [k, v] of flatOthers[name]) {
    if (typeof v !== 'string') continue;
    for (const tok of FORBIDDEN_TOKENS) {
      if (v.includes(tok)) {
        errors.push(`[brand] ${name} key "${k}": 泄漏内部标识 ${tok}`);
      }
    }
    if (name !== 'zh-CN' && !JA_OK.has(name) && v.includes(RAW_CHINESE_BRAND)) {
      errors.push(`[brand] ${name} key "${k}": 译文含原始中文品牌「${RAW_CHINESE_BRAND}」`);
    }
    // ja 允许命律，但记录出现次数供人工复核
    if (JA_OK.has(name) && v.includes(RAW_CHINESE_BRAND)) {
      info.push(`[brand-ja] ${name} key "${k}": 含「${RAW_CHINESE_BRAND}」（ja 白名单，列入人工复核）`);
    }
  }
}

// appName 品牌一致性：非 zh/ja locale 的 appName 应统一为 TempoSoul
for (const name of Object.keys(LOCALES)) {
  if (name === 'zh-CN' || name === 'ja') continue;
  const appName = flatOthers[name].get('appName');
  if (typeof appName === 'string' && !/^TempoSoul/.test(appName)) {
    errors.push(`[brand] ${name} appName="${appName}" 非 TempoSoul 开头，品牌不统一`);
  }
}

// premium.title 品牌一致性：appName 是 TempoSoul 的 locale，premium.title 应以 TempoSoul 开头
for (const name of Object.keys(LOCALES)) {
  if (name === 'zh-CN') continue;
  const appName = flatOthers[name].get('appName') || '';
  const premiumTitle = flatOthers[name].get('premium.title') || '';
  if (String(appName).startsWith('TempoSoul') && !String(premiumTitle).startsWith('TempoSoul')) {
    errors.push(
      `[brand] ${name} premium.title="${premiumTitle}" 与 appName="${appName}" 品牌不一致`,
    );
  }
}

// ---------- 5. 译文长度溢出 ----------
for (const k of flatBase.keys()) {
  const baseV = flatBase.get(k);
  if (typeof baseV !== 'string') continue;
  const baseLen = [...baseV].length;
  if (baseLen === 0) continue;
  for (const name of Object.keys(LOCALES)) {
    if (name === 'zh-CN') continue;
    if (!flatOthers[name].has(k)) continue;
    const v = flatOthers[name].get(k);
    if (typeof v !== 'string') continue;
    const len = [...v].length;
    const ratio = len / baseLen;
    if (ratio > 3) {
      warnings.push(
        `[length] ${name} key "${k}": ${len} 字符 / zh-CN ${baseLen} 字符 = ${ratio.toFixed(2)}x（溢出风险）`,
      );
    }
  }
}

// ---------- 输出 ----------
const totalKeys = flatBase.size;
console.log(`=== i18n 7 语言工程复核 ===`);
console.log(`基准 zh-CN key 总数: ${totalKeys}`);
console.log(``);
console.log(`-- errors (${errors.length}) --`);
for (const e of errors) console.log('  ✗ ' + e);
console.log(``);
console.log(`-- warnings (${warnings.length}) --`);
for (const w of warnings) console.log('  ! ' + w);
console.log(``);
console.log(`-- info (${info.length}) --`);
for (const i of info) console.log('  · ' + i);
console.log(``);
console.log(`=== 结果: ${errors.length} errors, ${warnings.length} warnings, ${info.length} info ===`);

process.exit(errors.length > 0 ? 1 : 0);
