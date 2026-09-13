// T1-S5 引擎侧执行器：读 golden-cases\<体系>\*.json → 调 @temposoul/core → 落 engine_results_raw\<体系>\<caseId>.json
// 用法：node "docs\audit\2026-09-13-上线前加固\thread-01-排盘规则审计与比对\output\tools\engine_runner.mjs"（仓库根执行）
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zodiac, taiyi, wuyunLiuqi, huangjiJingshi } from '@temposoul/core';
import { resolveSignByNumber } from '@temposoul/core/divination/ssgw';

const __dirname = dirname(fileURLToPath(import.meta.url));
const base = join(__dirname, '..', 'golden-cases');
const out = join(__dirname, '..', 'engine_results_raw');
mkdirSync(out, { recursive: true });

const FNS = {
  'zodiac': (input) => zodiac.calculateZodiacYearFortune(input),
  'ssgw': (input) => resolveSignByNumber(input.number),
  'taiyi': (input) => taiyi.generateTaiyi(input),
  'wuyun-liuqi': (input) => wuyunLiuqi.calculateWuyunLiuqi(input),
  'huangji-jingshi': (input) => huangjiJingshi.calculateHuangjiJingshi(input),
};

let ok = 0, fail = 0;
const missing = [];
for (const sys of Object.keys(FNS)) {
  if (!FNS[sys]) { missing.push(sys); continue; }
  const dir = join(base, sys);
  mkdirSync(join(out, sys), { recursive: true });
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const caseId = f.replace('.json', '');
    const rec = { caseId, system: sys, engine: '@temposoul/core dist（2026-09-13 本地构建）' };
    try {
      const input = JSON.parse(readFileSync(join(dir, f), 'utf8')).input;
      const result = FNS[sys](input);
      rec.ok = true;
      rec.result = result;
      ok++;
    } catch (e) {
      rec.ok = false;
      rec.error = String((e && e.message) || e);
      fail++;
    }
    writeFileSync(join(out, sys, caseId + '.json'), JSON.stringify(rec, null, 2));
  }
}
console.log('engine runner done. ok=' + ok + ' throw(fail)=' + fail + (missing.length ? ' MISSING_EXPORTS=' + missing.join(',') : ''));
