# WORKLOG · 线程2 转译·内容·获客线

> 分支 thread/next2-content（worktree .temposoul-wt\next-thread2，基线 723010f）｜ 远程 solaroran-rgb

## 2026-09-13 · T2-01 心理危机热线预设 ✅

- **做了什么**：`src/lib/ai/compliance.ts` 新增危机干预层——中英双语危机倾向词表（轻生/自残/抑郁/英文 suicid*、self-harm 等 7 组正则）、`detectCrisis()`、7 语言热线表 `CRISIS_HOTLINES`（zh-CN: 12356+北京 010-82951332；en: 988+Samaritans 116 123；es/ja/ko/th/vi: findahelpline.com 指引，均标「待母语复核」）、system 危机干预指令 `buildCrisisSystemSection()`（最高优先级、放下命理框架、肯定生命价值、热线必须原样完整输出）、确定性收尾 `buildCrisisNotice()`。`proxy.ts` 接线：危机指令拼在 COMPLIANCE_RULES 之前；流尾热线由 proxy 直接写出（不经 OutputFuse/tagFilter，熔断/异常路径均兜底送达）。`COMPLIANCE_VERSION` m1.0→m1.1。
- **产物**：`src/lib/ai/compliance.ts`、`src/lib/ai/proxy.ts`、`tests/crisis-hotline.test.ts`
- **关键数据**：新增测试 10 项全过（命中/不误报/7 语言齐/指令优先级/热线文案过熔断安全/proxy 注入次序/流尾触达/危机+熔断共存/en 档 988/普通问题零影响）；回归 `test:api` 108/108 全绿；compliance+warning 既有 10 测全绿。
- **commit/push**：45b9317 → solaroran-rgb/thread/next2-content
- **下一步**：T2-03 分支选择引擎原型
- **阻塞**：无
