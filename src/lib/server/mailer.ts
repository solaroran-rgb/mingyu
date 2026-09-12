/**
 * 邮件发送通道封装（Resend · 边缘运行 · 零依赖 fetch）
 *
 * 选型结论（Resend vs Mailchimp）与理由见
 *   docs/commerce/2026-09-12-commerce-setup.md
 * 一句话：确认邮件是事务邮件，Resend 为其而生——免费额度大、原生 Webhook、
 *   fetch 即调、Workers 边缘零 Node 兼容问题；Mailchimp 偏营销 CRM，
 *   事务能力（Mandrill）为付费附加，对本场景过重。
 *
 * 为什么不用官方 Node SDK：官方 `resend` SDK 虽可用，但会引入 npm 依赖与
 *   Node 运行时假设；这里直接用原生 fetch 打 Resend REST
 *   （POST https://api.resend.com/emails），语义等价、零依赖、边缘即可跑。
 *   账号到位后如需 SDK 可无缝替换本文件内部实现。
 *
 * 环境变量（一律 wrangler vars / Pages 环境变量 / secret 占位，严禁硬编码）：
 *   RESEND_API_KEY   机密（sk_...）。本地：.dev.vars；生产：wrangler secret put RESEND_API_KEY
 *   MAIL_FROM        发件地址，如 "TempoSoul <noreply@temposoul.com>"（须已在 Resend 验证域名）
 *   MAIL_FROM_NAME   发件人展示名，如 "TempoSoul 命律"
 *
 * 降级：未配置 RESEND_API_KEY / MAIL_FROM 时静默 no-op（不发信、不抛错），
 *   与现有「只收集不发送」优雅降级一致；账号填 env 后立即生效。
 */

export interface MailerEnv {
  /** 机密：Resend API Key（sk_...） */
  RESEND_API_KEY?: string;
  /** 发件地址，如 "TempoSoul <noreply@temposoul.com>" */
  MAIL_FROM?: string;
  /** 发件人展示名，如 "TempoSoul 命律" */
  MAIL_FROM_NAME?: string;
}

export interface OutboundMail {
  to: string;
  subject: string;
  /** HTML 正文（内联样式，无外链 CSS/图片） */
  html: string;
  /** 纯文本正文（兜底/无障碍） */
  text: string;
}

export const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/** 是否已配置可发信：API Key 与发件地址缺一不可 */
export function isMailConfigured(env: MailerEnv): boolean {
  return Boolean(env.RESEND_API_KEY && env.MAIL_FROM);
}

export type SendResult = { ok: true } | { ok: false; error: string };

/**
 * 发送一封事务邮件（best-effort：未配置或网络/接口失败都不抛错，
 * 绝不影响订阅主流程；失败原因仅返回给调用方记录，不暴露给终端用户）。
 */
export async function sendMail(env: MailerEnv, mail: OutboundMail): Promise<SendResult> {
  if (!isMailConfigured(env)) {
    return { ok: false, error: 'mail_not_configured' };
  }
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [mail.to],
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return { ok: false, error: `resend_${res.status}:${detail.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'network_error' };
  }
}
