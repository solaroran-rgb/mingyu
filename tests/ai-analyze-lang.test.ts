import test from 'node:test';
import assert from 'node:assert/strict';
import { handleAiAnalyze } from '../src/lib/ai/proxy';
import { createTranslatedTagFilter } from '../src/lib/ai/translate-templates';

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

test('translate 模式：输入中的 tier1 术语自动注入对照表', async () => {
  const capture: { current: Captured | null } = { current: null };
  const restore = stubUpstream(capture);
  try {
    const response = await handleAiAnalyze(
      makeRequest({
        prompt: '命盘中比肩林立，日柱甲子，请翻译本段',
        lang: 'en',
        mode: 'translate',
        aiConfig: AI_CONFIG,
      }),
    );
    assert.equal(response.status, 200);
    await response.text();
    assert.ok(capture.current);
    const system = capture.current.body.messages?.[0]?.content ?? '';
    assert.ok(system.includes('术语对照表'), '应注入术语对照表');
    assert.ok(system.includes('Friend'), '比肩应注入英译');
    assert.ok(system.includes('Jia Zi'), '甲子应注入英译');
    assert.ok(system.includes('"key":"bazi:shishen:bijian"'), '应带 archetype_key');
  } finally {
    restore();
  }
});

test('env 限定启用语言：未启用 lang 显式 400 LANG_NOT_ENABLED', async () => {
  const env = { I18N_ENABLED_LOCALES: 'zh-CN,en' };
  const capture: { current: Captured | null } = { current: null };
  const restore = stubUpstream(capture);
  try {
    const response = await handleAiAnalyze(
      makeRequest({ prompt: '解读', lang: 'ja', aiConfig: AI_CONFIG }),
      env,
    );
    assert.equal(response.status, 400);
    const data = await response.json();
    assert.equal(data.error.code, 'LANG_NOT_ENABLED');
    assert.equal(capture.current, null, '不应有上游请求');

    const ok = await handleAiAnalyze(
      makeRequest({ prompt: '解读', lang: 'en', aiConfig: AI_CONFIG }),
      env,
    );
    assert.equal(ok.status, 200, '启用语言应放行');
    await ok.text();
  } finally {
    restore();
  }
});

test('layer=L1：system prompt 载入古籍层约束与 ja 输出标记', async () => {
  const capture: { current: Captured | null } = { current: null };
  const restore = stubUpstream(capture);
  try {
    const response = await handleAiAnalyze(
      makeRequest({
        prompt: '翻译这段古籍解读',
        lang: 'ja',
        mode: 'translate',
        layer: 'L1',
        aiConfig: AI_CONFIG,
      }),
    );
    assert.equal(response.status, 200);
    await response.text();
    assert.ok(capture.current);
    const system = capture.current.body.messages?.[0]?.content ?? '';
    assert.ok(system.includes('L1'), '应载入古籍层指令');
    assert.ok(system.includes('日本語'));
    assert.ok(system.includes('<translated lang="ja">'), '应要求输出标记');
    assert.ok(system.includes('不得改变'), '数值/方向禁改约束');
  } finally {
    restore();
  }
});

test('非法 layer 显式 400 INVALID_LAYER；translate+zh-CN 显式 400', async () => {
  const restore = stubUpstream({ current: null });
  try {
    const badLayer = await handleAiAnalyze(
      makeRequest({
        prompt: '翻译',
        lang: 'en',
        mode: 'translate',
        layer: 'L9',
        aiConfig: AI_CONFIG,
      }),
    );
    assert.equal(badLayer.status, 400);
    assert.equal((await badLayer.json()).error.code, 'INVALID_LAYER');

    const zhTarget = await handleAiAnalyze(
      makeRequest({ prompt: '翻译', lang: 'zh-CN', mode: 'translate', aiConfig: AI_CONFIG }),
    );
    assert.equal(zhTarget.status, 400);
    assert.equal((await zhTarget.json()).error.code, 'INVALID_LANG');
  } finally {
    restore();
  }
});

test('<translated> 标记剥离器：跨 delta 分裂可剥，非本管线标记透传', () => {
  const filter = createTranslatedTagFilter();
  assert.equal(filter.push('<tran'), '');
  assert.equal(filter.push('slated lang="vi">Xin chào'), 'Xin chào');
  assert.equal(filter.push(' thế</tran'), ' thế');
  assert.equal(filter.push('slated>') + filter.flush(), '');

  const passthrough = createTranslatedTagFilter();
  assert.equal(passthrough.push('数值 <b>甲子</b> 保持'), '数值 <b>甲子</b> 保持');
  assert.equal(passthrough.push('半个尖括号 < 5'), '半个尖括号 < 5');
  assert.equal(passthrough.flush(), '');
});
