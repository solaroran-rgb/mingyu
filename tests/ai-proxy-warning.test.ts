import test from 'node:test';
import assert from 'node:assert/strict';

import { handleAiAnalyze } from '../src/lib/ai/proxy';

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
  globalThis.fetch = (async () =>
    new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream; charset=utf-8' },
    })) as typeof fetch;
}

test('M4 第二层: 语义盲区表述触发 meta.warning 但不熔断', async (t) => {
  mockUpstream(t, sseChunks(['牌面整体指向"是"，趋势偏向新方向。', '建议保持沟通。']));
  const response = await handleAiAnalyze(
    new Request('https://example.com/api/v1/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ prompt: '我要不要离婚？', aiConfig: { mode: 'builtin' } }),
    }),
    ENV,
  );
  const events = parseSse(await response.text());
  assert.ok(
    events.some((e) => (e.meta as { warning?: boolean } | undefined)?.warning === true),
    '应发 meta.warning 事件',
  );
  const contents = events
    .filter((e) => typeof e.content === 'string')
    .map((e) => e.content as string)
    .join('');
  assert.match(contents, /建议保持沟通/); // 未被截断
  assert.ok(!events.some((e) => (e.meta as { fused?: boolean } | undefined)?.fused));
});

test('M4 第二层: 正常趋势化输出不触发 warning', async (t) => {
  mockUpstream(t, sseChunks(['倾向于稳步推进，可能需要更多耐心。']));
  const response = await handleAiAnalyze(
    new Request('https://example.com/api/v1/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ prompt: '婚姻运势如何？', aiConfig: { mode: 'builtin' } }),
    }),
    ENV,
  );
  const events = parseSse(await response.text());
  assert.ok(!events.some((e) => (e.meta as { warning?: boolean } | undefined)?.warning === true));
});

test('M4 第二层: 警告只发一次（warned 单次标记）', async (t) => {
  mockUpstream(t, sseChunks(['指向"是"。', '再次指向"是"。', '结束。']));
  const response = await handleAiAnalyze(
    new Request('https://example.com/api/v1/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ prompt: '该不该跳槽？', aiConfig: { mode: 'builtin' } }),
    }),
    ENV,
  );
  const events = parseSse(await response.text());
  const warns = events.filter((e) => (e.meta as { warning?: boolean } | undefined)?.warning === true);
  assert.equal(warns.length, 1, 'meta.warning 只应出现一次');
});
