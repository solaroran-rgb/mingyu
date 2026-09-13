import test from 'node:test';
import assert from 'node:assert/strict';

import { handleAiAnalyze } from '../src/lib/ai/proxy';
import {
  buildCrisisNotice,
  buildCrisisSystemSection,
  CRISIS_HOTLINES,
  CRISIS_VERSION,
  detectCrisis,
  OutputFuse,
} from '../src/lib/ai/compliance';

type UpstreamBody = {
  messages: Array<{ role: string; content: string }>;
};

const ENV = {
  AI_API_KEY: 'test-key',
  AI_BASE_URL: 'https://example.com/v1',
  AI_MODEL: 'free/cc',
  AI_BUILTIN_ENABLED: 'true',
};

function sseChunks(deltas: string[]): string {
  return (
    deltas.map((d) => `data: ${JSON.stringify({ choices: [{ delta: { content: d } }] })}`).join('\n\n') +
    '\n\ndata: [DONE]\n\n'
  );
}

function parseSse(text: string): Array<Record<string, unknown>> {
  return text
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trim())
    .filter((data) => data && data !== '[DONE]')
    .map((data) => JSON.parse(data) as Record<string, unknown>);
}

function mockUpstream(t: { after: (fn: () => void) => void }, body: string) {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  let upstreamBody = '';
  globalThis.fetch = (async (_input, init) => {
    upstreamBody = typeof init?.body === 'string' ? init.body : '';
    return new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream; charset=utf-8' },
    });
  }) as typeof fetch;
  return () => JSON.parse(upstreamBody) as UpstreamBody;
}

function analyzeRequest(prompt: string, lang?: string) {
  return new Request('https://example.com/api/v1/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({ prompt, aiConfig: { mode: 'builtin' }, ...(lang ? { lang } : {}) }),
  });
}

// ---------- T2-01 单元：检测与文案 ----------

test('T2-01: 危机倾向词命中（轻生/自残/抑郁/英文）', () => {
  for (const text of [
    '我最近总是想死，觉得活着没意思。',
    '占卜一下我什么时候能解脱，不想活了。',
    '算算我的运势吧，我确诊了抑郁症。',
    'I have been thinking about suicide lately.',
    'I want to hurt myself.',
    "Sometimes I feel like ending my life.",
  ]) {
    assert.ok(detectCrisis(text), `应命中危机信号：${text}`);
  }
});

test('T2-01: 普通命理问题不误报', () => {
  for (const text of [
    '请分析我今年的事业运势。',
    '这笔投资能不能回本？',
    '我要不要离婚？',
    '看看我的寿命如何。', // 生死寿数属敏感域但非危机倾向
    'What about my career luck this year?',
  ]) {
    assert.equal(detectCrisis(text), false, `不应命中危机信号：${text}`);
  }
});

test('T2-01: 热线资源 7 语言齐备且格式合规', () => {
  const locales = ['zh-CN', 'en', 'es-ES', 'ja', 'ko-KN', 'th-TH', 'vi-VN'] as const;
  for (const locale of locales) {
    const line = CRISIS_HOTLINES[locale];
    assert.ok(line && line.length > 10, `${locale} 缺少热线文案`);
  }
  assert.match(CRISIS_HOTLINES['zh-CN'], /12356/);
  assert.match(CRISIS_HOTLINES['zh-CN'], /010-82951332/);
  assert.match(CRISIS_HOTLINES.en, /988/);
  assert.match(CRISIS_HOTLINES.en, /116 123/);
  for (const locale of ['es-ES', 'ja', 'ko-KN', 'th-TH', 'vi-VN'] as const) {
    assert.match(CRISIS_HOTLINES[locale], /findahelpline\.com/, `${locale} 应指向国际资源`);
    assert.match(CRISIS_HOTLINES[locale], /待母语复核/, `${locale} 应标注待复核`);
  }
});

test('T2-01: 危机指令含热线且声明最高优先级', () => {
  const zh = buildCrisisSystemSection('zh-CN');
  assert.match(zh, /最高优先级/);
  assert.match(zh, /12356/);
  assert.match(zh, /010-82951332/);
  assert.match(zh, /肯定生命价值/);
  const en = buildCrisisSystemSection('en');
  assert.match(en, /988/);
});

test('T2-01: 危机收尾文案本身可安全通过 OutputFuse（不被熔断）', () => {
  const locales = ['zh-CN', 'en', 'es-ES', 'ja', 'ko-KN', 'th-TH', 'vi-VN'] as const;
  for (const locale of locales) {
    const fuse = new OutputFuse();
    const notice = buildCrisisNotice(locale);
    // 按 8 字符分片模拟流式检查
    for (let i = 0; i < notice.length; i += 8) {
      const verdict = fuse.check(notice.slice(i, i + 8));
      assert.equal(verdict.fused, false, `${locale} 热线文案不应触发熔断`);
    }
  }
  assert.equal(CRISIS_VERSION, 'crisis.1');
});

// ---------- T2-01 集成：proxy 接线 ----------

test('T2-01 集成: 危机输入注入危机指令且位于铁律之前', async (t) => {
  const readBody = mockUpstream(t, sseChunks(['好的，我们一起面对。']));
  await handleAiAnalyze(analyzeRequest('我最近不想活了，帮我算算命。'), ENV);
  const system = readBody().messages.find((m) => m.role === 'system')?.content ?? '';
  const crisisIdx = system.indexOf('危机干预指令');
  const rulesIdx = system.indexOf('解读铁律');
  assert.ok(crisisIdx >= 0, 'system 应包含危机干预指令');
  assert.ok(crisisIdx < rulesIdx, '危机指令应先于解读铁律');
  assert.match(system, /12356/);
  assert.match(system, /010-82951332/);
});

test('T2-01 集成: 危机输入流尾确定性输出热线（AI 输出未提热线也触达）', async (t) => {
  mockUpstream(t, sseChunks(['我听到你的感受了。']));
  const response = await handleAiAnalyze(analyzeRequest('我不想活了。'), ENV);
  const events = parseSse(await response.text());
  const contents = events
    .filter((e) => typeof e.content === 'string')
    .map((e) => e.content as string)
    .join('');
  assert.match(contents, /12356/);
  assert.match(contents, /愿意求助，已经是勇敢的一步/);
});

test('T2-01 集成: 危机 + 熔断共存——热线不被熔断吞掉', async (t) => {
  mockUpstream(
    t,
    sseChunks(['我听到你了。', '但你是命中注定活不过30岁。', '这段不应出现。']),
  );
  const response = await handleAiAnalyze(analyzeRequest('算算我的寿数，我活着没意思了。'), ENV);
  const text = await response.text();
  const events = parseSse(text);
  assert.ok(
    events.some((e) => (e.meta as { fused?: boolean } | undefined)?.fused === true),
    '高危输出应触发熔断',
  );
  const contents = events
    .filter((e) => typeof e.content === 'string')
    .map((e) => e.content as string)
    .join('');
  assert.match(contents, /命理解读仅供趋势参考/); // FUSED_NOTICE 在
  assert.ok(!contents.includes('不应出现'));
  assert.match(contents, /12356/, '熔断后热线仍触达');
  assert.match(contents, /110 \/ 120/);
});

test('T2-01 集成: 非 zh 语言危机输入按语言档输出热线（en→988）', async (t) => {
  mockUpstream(t, sseChunks(['I hear you.']));
  const response = await handleAiAnalyze(
    analyzeRequest("I don't want to live anymore, please read my chart.", 'en'),
    ENV,
  );
  const events = parseSse(await response.text());
  const contents = events
    .filter((e) => typeof e.content === 'string')
    .map((e) => e.content as string)
    .join('');
  assert.match(contents, /988/);
});

test('T2-01 集成: 普通问题不受影响（无危机注入、无热线收尾）', async (t) => {
  mockUpstream(t, sseChunks(['倾向于稳步推进，建议保持节奏。']));
  const response = await handleAiAnalyze(analyzeRequest('事业运势如何？'), ENV);
  const events = parseSse(await response.text());
  const contents = events
    .filter((e) => typeof e.content === 'string')
    .map((e) => e.content as string)
    .join('');
  assert.equal(contents, '倾向于稳步推进，建议保持节奏。');
  assert.ok(!events.some((e) => (e.meta as { fused?: boolean } | undefined)?.fused));
});
