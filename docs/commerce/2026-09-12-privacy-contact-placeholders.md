# 隐私政策联系邮箱 / 占位符待填清单

> 线程 thread/commerce · 2026-09-12
> 范围：全站源码与文案中与「隐私政策联系渠道」相关的占位 / 缺失项。
> 方法：对 `src/`、`functions/` 全量 grep `support@`、`hello@`、`contact@`、`admin@`、`noreply@`、
>   `TODO`、`FIXME`、`待填`、`待补`、`联系邮箱`、`mailto:`、`@example.com` 等模式，剔除命理术语
>   「待填实（空亡）」与规划白皮书噪声后，实际需人工补齐项如下。

## 结论

源码原无任何真实联系邮箱字面量（`support@` / `hello@` / `contact@` 均为 0 命中），
隐私页联系方式一节原本只指向「站点设置中的反馈入口」。本线程已拍板对外联系邮箱
**`ferryoran@outlook.com`** 并写入 7 个语种 `privacy.s5B1`，合规缺口已闭环
（GDPR Art.13、韩国 PIPA、中国《个人信息保护法》第 17 条要求的可核验联系渠道已具备）。

## 待填清单（更新后 2 条未决 + 1 条已替换）

> 2026-09-12 更新：对外联系邮箱已拍板为 **ferryoran@outlook.com**，并已写入全站隐私政策联系文案（#1 已闭环）。

| # | 位置 | 现状 | 待填内容 | 优先级 | 状态 |
| --- | --- | --- | --- | --- | --- |
| 1 | `src/i18n/locales/*.ts` 键 `privacy.s5B1`（**7 个语种文件**） | 原仅指向「反馈入口」无邮箱；**已在 7 个语种文案中写入 `ferryoran@outlook.com`** | 已完成。如需 `mailto:` 可点击链接，后续可在 `PrivacyPage.tsx` 第 5 段追加 | 高（合规） | ✅ **已替换** |
| 2 | 环境变量 `MAIL_FROM`（`.dev.vars.example` / `wrangler.toml` 注释） | 代码示例为 `noreply@temposoul.com`（仅注释示例） | 选定正式发信域名后，在 Resend 验证并填 `MAIL_FROM="TempoSoul <noreply@<正式域名>>"`、`MAIL_FROM_NAME` | 中 | ⬜ 待域名 |
| 3 | 全站页脚 / 联系组件（无 `Footer`/`Contact`/`About` 组件） | 无全站页脚、无统一联系入口 | 若需页脚集中放邮箱 / 社媒，需新建组件；本线程未做 | 低（增量） | ⬜ 待规划 |

### #1 已替换内容（7 处 `privacy.s5B1`，均已含 ferryoran@outlook.com）
- `zh-CN.ts`：`…请通过站点设置中的反馈入口联系我们，或发送邮件至 ferryoran@outlook.com。`
- `en.ts`：`…please contact us through the feedback entry in the site settings, or email ferryoran@outlook.com.`
- `es-ES.ts`：`…contáctanos a través del canal de comentarios…, o escríbenos a ferryoran@outlook.com.`
- `ja.ts`：`…サイト設定内のフィードバック窓口よりご連絡いただくか、ferryoran@outlook.com までメールをお送りください。`
- `ko-KN.ts`：`…사이트 설정의 피드백 창구로 문의해 주세요. 또는 ferryoran@outlook.com 으로 이메일을 보내 주세요.`
- `th-TH.ts`：`…โปรดติดต่อเราผ่านช่องติชม… หรือส่งอีเมลมาที่ ferryoran@outlook.com`
- `vi-VN.ts`：`…vui lòng liên hệ qua kênh phản hồi… hoặc gửi email đến ferryoran@outlook.com.`

> 渲染入口：`src/pages/PrivacyPage.tsx` `sections[4]`（`privacy.s5Title` / `privacy.s5B1`）。

## 已排除的「假阳性」（不计入待填）

- `packages/core/src/**` 中大量「待填实 / 待补」是六爻 / 奇门 / 大六壬的**空亡填实**命理术语，非占位。
- `tests/newsletter-confirm.test.ts` 的 `lover@example.com` / `ghost@example.com` 是测试夹具。
- `src/lib/server/mailer.ts` 中 `noreply@temposoul.com` 是代码注释里的示例（对应 #2）。
- `网站搭建方案代码部分0830.md` 中的「待填」为规划白皮书叙述，非源码待填项。
- `MetaphysicsPanel/index.tsx` 的「待补充资料 / 待补出生」是缺出生信息时的 UI 兜底文案，非联系占位。

## 后续动作

1. ✅ 对外联系邮箱已定为 `ferryoran@outlook.com`，已写入 7 个 `privacy.s5B1`。
2. （可选增强）在 `PrivacyPage.tsx` 第 5 段把邮箱做成可点 `mailto:` 链接。
3. 待正式发信域名确定后，Resend 验证域名并填 `MAIL_FROM` / `MAIL_FROM_NAME`（见 `2026-09-12-commerce-setup.md`）。
