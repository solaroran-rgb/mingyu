import test from 'node:test';
import assert from 'node:assert/strict';
import { handleAiAnalyze } from '../src/lib/ai/proxy';

// T3 多语言（M1）：/api/v1/ai/analyze 的 lang 白名单与受限翻译档行为。

const AI_CONFIG = {
  mode: 'custom',
  apiKey: 'test-key',
  baseUrl: 'https://stub.local/v1',
  model: 'stub-model',
};

function makeRequest(body: unknown): Request {
  return new Request('https://site.local/api/v1/ai/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

interface Captured {
  url: string;
  body: {
    temperature?: number;
    messages?: Array<{ role: string; content: string }>;
  };
}

/** 拦截上游 chat/completions，捕获请求体并返回最小 SSE 流。 */
function stubUpstream(capture: { current: Captured | null }): () => void {
  const original = globalThis.fetch;
  globalThis.fetch = (async (url: unknown, init?: { body?: string }) => {
    capture.current = {
      url: String(url),
      body: JSON.parse(String(init?.body ?? '{}')),
    };
    const sse =
      'data: {"choices":[{"delta":{"content":"ok"}}]}\n\ndata: [DONE]\n\n';
    return new Response(sse, {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }) as typeof fetch;
  return () => {
    globalThis.fetch = original;
  };
}

test('非法 lang 返回结构化 400 INVALID_LANG，且不触达上游', async () => {
  const capture: { current: Captured | null } = { current: null };
  const restore = stubUpstream(capture);
  try {
    const response = await handleAiAnalyze(
      makeRequest({ prompt: '解读', lang: 'fr', aiConfig: AI_CONFIG }),
    );
    assert.equal(response.status, 400);
    const data = await response.json();
    assert.equal(data.error.code, 'INVALID_LANG');
    assert.equal(capture.current, null, '不应有上游请求');
  } finally {
    restore();
  }
});

test('mode=translate：temperature 固定 0，system prompt 指定目标语言与禁改约束', async () => {
  const capture: { current: Captured | null } = { current: null };
  const restore = stubUpstream(capture);
  try {
    const response = await handleAiAnalyze(
      makeRequest({
        prompt: '翻译这段解读',
        lang: 'vi-VN',
        mode: 'translate',
        aiConfig: AI_CONFIG,
      }),
    );
    assert.equal(response.status, 200);
    await response.text();
    assert.ok(capture.current);
    assert.equal(capture.current.body.temperature, 0);
    const system = capture.current.body.messages?.[0];
    assert.equal(system?.role, 'system');
    assert.ok(system?.content.includes('Tiếng Việt'));
    assert.ok(system?.content.includes('不得改变'));
  } finally {
    restore();
  }
});

test('普通解读 + lang=en：保持 temperature 0.7，system prompt 注入英文指令', async () => {
  const capture: { current: Captured | null } = { current: null };
  const restore = stubUpstream(capture);
  try {
    const response = await handleAiAnalyze(
      makeRequest({ prompt: '解读', lang: 'en', aiConfig: AI_CONFIG }),
    );
    assert.equal(response.status, 200);
    await response.text();
    assert.ok(capture.current);
    assert.equal(capture.current.body.temperature, 0.7);
    const system = capture.current.body.messages?.[0];
    assert.ok(system?.content.includes('English'));
  } finally {
    restore();
  }
});

test('未传 lang：默认 zh-CN，system prompt 保持原样', async () => {
  const capture: { current: Captured | null } = { current: null };
  const restore = stubUpstream(capture);
  try {
    const response = await handleAiAnalyze(
      makeRequest({ prompt: '解读', aiConfig: AI_CONFIG }),
    );
    assert.equal(response.status, 200);
    await response.text();
    assert.ok(capture.current);
    assert.equal(capture.current.body.temperature, 0.7);
    const system = capture.current.body.messages?.[0];
    assert.equal(
      system?.content,
      '请根据用户提供的排盘资料和问题直接解读。',
    );
  } finally {
    restore();
  }
});
