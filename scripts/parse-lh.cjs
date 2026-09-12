const fs = require('fs');
const file = process.argv[2];
const r = JSON.parse(fs.readFileSync(file, 'utf8'));
const a = r.audits;
const c = r.categories;
console.log('URL:', r.finalDisplayedUrl);
console.log('SCORES: Perf', c.performance.score, '| A11y', c.accessibility.score, '| BP', c['best-practices'].score, '| SEO', c.seo.score);
console.log('--- core vitals ---');
for (const m of ['first-contentful-paint','largest-contentful-paint','total-blocking-time','speed-index','cumulative-layout-shift','interactive','max-potential-fid']) {
  const x = a[m]; if (!x) continue;
  console.log(m, '|', x.displayValue, '| score=' + x.score, '| val=' + Math.round(x.numericValue||0));
}
console.log('--- LCP element ---');
const l = a['largest-contentful-paint-element'];
try { console.log(l.details.items[0].items[0].node.snippet); } catch(e) { console.log('n/a'); }
console.log('--- opportunities (score<1) ---');
for (const [id,x] of Object.entries(a)) {
  if (x.score===null || x.score>=1) continue;
  if (x.details && x.details.type==='opportunity') {
    console.log(id, '|', x.title, '| savMs='+Math.round(x.numericValue||0), '|', x.displayValue||'');
  }
}
console.log('--- all failing audits (<1) grouped by group ---');
for (const [id,x] of Object.entries(a)) {
  if (x.score===null || x.score>=1) continue;
  if (['first-contentful-paint','largest-contentful-paint','total-blocking-time','speed-index','cumulative-layout-shift','interactive','max-potential-fid','largest-contentful-paint-element'].includes(id)) continue;
  console.log(id, '|', x.title, '| score='+x.score, '|', x.displayValue||'');
}
