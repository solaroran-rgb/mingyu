import test from 'node:test';
import assert from 'node:assert/strict';

import { handleAiAnalyze } from '../src/lib/ai/proxy';
import { COMPLIANCE_VERSION, DICT_VERSION, FUSED_NOTICE } from '../src/lib/ai/compliance';

type UpstreamBody = {
  temperature: number;
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

function analyzeRequest(prompt: string) {
  return new Request('https://example.com/api/v1/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({ prompt, aiConfig: { mode: 'builtin' } }),
  });
}

test('M1: 上游请求 temperature 必须为 0，system 携带解读铁律', async (t) => {
  const readBody = mockUpstream(t, sseChunks(['ok']));
  const response = await handleAiAnalyze(
    analyzeRequest('请围绕财运解读这份八字资料。'),
    ENV,
  );
  assert.equal(response.status, 200);

  const body = readBody();
  assert.equal(body.temperature, 0);
  const system = body.messages.find((m) => m.role === 'system')?.content ?? '';
  assert.match(system, /解读铁律/);
  assert.match(system, /趋势化、概率化表达/);
  assert.match(system, /不提供医疗诊断、法律行动或具体金融操作建议/);
});

test('M1: user 内容保持原样转发（约束只进 system，不改写用户问题）', async (t) => {
  const readBody = mockUpstream(t, sseChunks(['ok']));
  const question = '这笔投资能不能回本？';
  await handleAiAnalyze(analyzeRequest(question), ENV);

  const body = readBody();
  const userMessage = body.messages.find((m) => m.role === 'user')?.content ?? '';
  assert.equal(userMessage, question);

  const system = body.messages.find((m) => m.role === 'system')?.content ?? '';
  assert.match(system, /财务投资/);
  assert.match(system, /严禁给出买卖标的/);
});

test('M1: 敏感领域按命中注入，普通问题不注入', async (t) => {
  const readBody = mockUpstream(t, sseChunks(['ok']));
  await handleAiAnalyze(analyzeRequest('请分析我近期的整体运势。'), ENV);
  const system = readBody().messages.find((m) => m.role === 'system')?.content ?? '';
  assert.doesNotMatch(system, /敏感领域约束/);
});

test('M1: 术语口径查表注入（盘面出现词库术语时）', async (t) => {
  const readBody = mockUpstream(t, sseChunks(['ok']));
  await handleAiAnalyze(
    analyzeRequest('四柱：年柱庚午、月柱辛巳、日柱庚辰、时柱丁丑；格局比肩格。请解读。'),
    ENV,
  );
  const system = readBody().messages.find((m) => m.role === 'system')?.content ?? '';
  assert.match(system, /术语口径参考/);
  assert.match(system, /· 比肩：/);
});

test('M1: 流首携带 meta 事件（版本三元组）', async (t) => {
  mockUpstream(t, sseChunks(['ok']));
  const response = await handleAiAnalyze(analyzeRequest('整体运势如何？'), ENV);
  const events = parseSse(await response.text());
  const meta = events[0]?.meta as Record<string, unknown> | undefined;
  assert.ok(meta, '首个事件应为 meta');
  assert.equal(meta.compliance, COMPLIANCE_VERSION);
  assert.equal(meta.dict_version, DICT_VERSION);
  assert.equal(meta.model_version, 'free/cc');
});

test('M1: 输出命中高危表述时熔断——截断后续内容并追加安全收尾', async (t) => {
  mockUpstream(
    t,
    sseChunks(['今年运势平稳。', '但你要注意，你必死无疑。', '后面这句话不应出现。']),
  );
  const response = await handleAiAnalyze(analyzeRequest('看看我的寿命。'), ENV);
  const text = await response.text();
  const events = parseSse(text);

  const fusedMeta = events.find((e) => (e.meta as { fused?: boolean } | undefined)?.fused === true);
  assert.ok(fusedMeta, '应有 fused meta 事件');
  const contents = events
    .filter((e) => typeof e.content === 'string')
    .map((e) => e.content as string)
    .join('');
  assert.match(contents, /命理解读仅供趋势参考/);
  assert.ok(contents.includes(FUSED_NOTICE));
  assert.doesNotMatch(contents, /不应出现/);
});

test('M1: 无违禁内容时全量转发不受影响（回归）', async (t) => {
  mockUpstream(t, sseChunks(['倾向于', '稳步推进', '，建议保持节奏。']));
  const response = await handleAiAnalyze(analyzeRequest('事业运势如何？'), ENV);
  const events = parseSse(await response.text());
  const contents = events
    .filter((e) => typeof e.content === 'string')
    .map((e) => e.content as string)
    .join('');
  assert.equal(contents, '倾向于稳步推进，建议保持节奏。');
  assert.ok(!events.some((e) => (e.meta as { fused?: boolean } | undefined)?.fused));
});
