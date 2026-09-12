/**
 * PayPal Webhook 接收端点（Cloudflare Pages Functions，边缘运行）
 * 路由：POST /api/v1/paypal-webhook
 *
 * 作用：PayPal 直连收款的支付成功闭环（LS 中国区激活受限时的 live 兜底）。
 *   验签通过后，把 checkout 时写入的 custom_id（= userId）置 premium（写 AUTH_KV），
 *   与 Lemon Squeezy 分支共用同一 activatePremium 落库逻辑。
 *
 * 验签：按 PayPal 官方推荐的服务端 verify 方式——把请求头
 *   PAYPAL-AUTH-ALGO / PAYPAL-CERT-URL / PAYPAL-TRANSMISSION-ID /
 *   PAYPAL-TRANSMISSION-SIG / PAYPAL-TRANSMISSION-TIME 连同 rawBody 与
 *   PAYPAL_WEBHOOK_ID 一起 POST 到 PayPal /v1/notifications/verify-webhook-signature，
 *   verification_status === 'SUCCESS' 才采信（不本地验 cert）。
 *
 * 关心事件：
 *   - BILLING.SUBSCRIPTION.ACTIVATED / BILLING.SUBSCRIPTION.RENEWED → 订阅激活/续费，置 premium
 *   - PAYMENT.SALE.COMPLETED → 付款完成，置 premium
 *   - 其它事件 200 确认收到（PayPal 不重试）
 *
 * 环境变量（占位，sandbox 为默认安全值）：
 *   PAYPAL_MODE            sandbox | live（默认 sandbox）
 *   PAYPAL_CLIENT_ID       PayPal REST app client id
 *   PAYPAL_CLIENT_SECRET   机密
 *   PAYPAL_WEBHOOK_ID      Dashboard → Developer → Webhooks 对应 webhook 注册 ID
 *   PAYPAL_PLAN_ID         billing plan id（月/年计划，checkout 用）
 *   AUTH_KV                KV 绑定（与 /api/v1/subscription 同库）
 *
 * 配置：PayPal Developer Dashboard → Apps & Credentials → 建 REST app →
 *   Webhook 端点 https://<域名>/api/v1/paypal-webhook，订阅上述事件。
 */

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface WebhookEnv {
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
  PAYPAL_WEBHOOK_ID?: string;
  PAYPAL_MODE?: string;
  AUTH_KV?: KVNamespace;
}

type PagesContext = {
  request: Request;
  env?: WebhookEnv;
};

import { activatePremium, verifyPaypalWebhook, type PaymentEnv } from '../../../src/lib/server/payment';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

const SUCCESS_EVENTS = new Set([
  'BILLING.SUBSCRIPTION.ACTIVATED',
  'BILLING.SUBSCRIPTION.RENEWED',
  'PAYMENT.SALE.COMPLETED',
]);

/** 从事件 resource 里取我们写入的 custom_id（subscription 与 sale 字段名不同，都试） */
function extractUserId(event: {
  resource?: { custom_id?: string; custom?: string };
}): string {
  const c = event.resource?.custom_id || event.resource?.custom || '';
  return typeof c === 'string' ? c : '';
}

export async function onRequest(ctx: PagesContext): Promise<Response> {
  if (ctx.request.method.toUpperCase() !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const env = (ctx.env ?? {}) as PaymentEnv;
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET || !env.PAYPAL_WEBHOOK_ID || !env.AUTH_KV) {
    return json({ error: 'webhook_unavailable' }, 503);
  }

  const rawBody = await ctx.request.text();
  const ok = await verifyPaypalWebhook(env, {
    authAlgo: ctx.request.headers.get('paypal-auth-algo') ?? undefined,
    certUrl: ctx.request.headers.get('paypal-cert-url') ?? undefined,
    transmissionId: ctx.request.headers.get('paypal-transmission-id') ?? undefined,
    transmissionSig: ctx.request.headers.get('paypal-transmission-sig') ?? undefined,
    transmissionTime: ctx.request.headers.get('paypal-transmission-time') ?? undefined,
  }, rawBody);
  if (!ok) return json({ error: 'invalid_signature' }, 400);

  let event: { event_type?: string; resource?: { custom_id?: string; custom?: string } };
  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return json({ error: 'invalid_payload' }, 400);
  }

  const type = event.event_type ?? '';
  if (!SUCCESS_EVENTS.has(type)) return json({ received: true, event: type });

  const userId = extractUserId(event);
  if (!userId || userId === 'anonymous') return json({ received: true, event: type, note: 'no_user_link' });

  await activatePremium(env.AUTH_KV, userId, 'paypal');
  return json({ received: true, event: type, tier: 'premium', userId });
}
