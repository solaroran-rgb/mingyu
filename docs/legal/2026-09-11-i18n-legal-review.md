# 多语言与法务页复核记录（Privacy / Tutorial）

- 线程：thread-d-legal（法务与多语言页复核）
- 基线：`codex/website-basic-settings` @ 52d9f24
- 日期：2026-09-11
- 范围：`src/pages/PrivacyPage.tsx`、`src/pages/TutorialPage.tsx`、`src/i18n/locales/`（en / es-ES / ja / ko-KN / th-TH / vi-VN / zh-CN 共 7 语言）、`src/components/PageTopbar.tsx`（最小修复）

---

## 一、本次完成项（缺口补齐）

### 1. Privacy / Tutorial 两页原本 100% 硬编码中文

基线状态下两页未接入 `useI18n`，所有文案写死在 `.tsx` 数组常量里，切换语言不会翻译。已重构为 `t('...')` 驱动，并在 7 个语言字典新增两个命名空间：

- `privacy.*`（21 个 key：标题 / 更新时间 / 核心原则 2 条 / 5 个章节标题 + 正文 / 免责声明标题与正文）
- `tutorial.*`（41 个 key：标题 / 导语 / 3 步流程 / 4 种模式标题·描述·要点 / 3 条提示词发送建议 / 3 组 FAQ / 4 个小节标题）

### 2. PageTopbar「返回」硬编码

`src/components/PageTopbar.tsx` 原第 13 行写死 `返回`，改为 `t('common.back')`（7 语言字典已有该 key）。该组件被所有二级页复用，改动最小、props 契约不变，不影响其他线程对各页 title 的传值。

### 3. 品牌名残留修正

原 PrivacyPage 正文两处写作「**命语**」，与当前品牌 `zhCN.appName = 命律`（en = TempoSoul）不一致，属旧名残留。本次统一改为「命律 / TempoSoul」。**请主控确认是否为预期更名**（见第四节）。

### 4. key 完整性

- 7 语言字典 key 树完全对齐：**134 keys × 7 语言，无缺失、无多余**（脚本递归比对，以 zh-CN 为基准）。
- 新增 key 全部为字符串叶子，与现有 `t()` 实现（只返回字符串、非字符串回退为 key）兼容，运行时不会回退中文。

---

## 二、构建验证

- `pnpm build`（`pnpm --filter @temposoul/core build && vite build`）：**通过**，exit 0，12.83s。
- `PrivacyPage-*.js` / `TutorialPage-*.js` / `PageTopbar-*.js` 均正常产出。
- `prettier --write` 已对本次改动文件归一（singleQuote / LF / trailingComma all / printWidth 100，与仓库既有约定一致）。
- 说明：仓库实际换行符为 **LF + UTF-8 无 BOM**（非任务书所写 CRLF），本次改动遵循仓库既有约定；`tsc --noEmit` 在未先构建 core 时有大量基线既有类型报错（`@temposoul/core/*` 子路径类型、AstrolabeChart 等），**均与本线程改动无关，无一条命中本次改动文件**。

---

## 三、中文残留清单（本线程范围外，移交主控分派）

以下为全仓扫描 `[\u4e00-\u9fff]` 的结果中，**不在本线程授权改动范围**的残留，供主控分派给对应线程或后续排期。本线程仅最小修复了我两页实际渲染的 PageTopbar。

| 文件 | 残留性质 | 建议责任 |
| --- | --- | --- |
| `src/components/AiChatPanel.tsx` | 大量 UI 文案硬编码中文（标题、占位符、历史会话、删除/重生成等） | 对话/AI 面板线程 |
| `src/components/AiSettingsModal.tsx` | 设置弹窗全部文案硬编码中文 | AI 设置线程 |
| `src/components/PrivacyHint.tsx` | 隐私提示条 +「查看隐私政策」链接（与法务相关，挂在 InputPage/RecordsPage） | 建议主控指定；文案口径可与本隐私政策对齐 |
| `src/components/ErrorBoundary.tsx` | 错误页文案硬编码中文 | 通用兜底线程 |
| `src/components/QuestionInspirationModal.tsx` | 弹窗标题/占位/关闭 | 占卜/提问线程 |
| `src/components/AstrolabeChart.tsx` | 12 星座中文短名 + aria-label | 星盘线程 |
| `src/components/TrustEngineT0~T6.tsx` | 疑似未挂路由（App.tsx 仅挂 `TrustBanner`），且使用 `t(key, fallback)` 双参签名，与现 `useI18n().t(key)` 单参实现不兼容 | 建议主控确认是否死代码；若是死代码建议后续删除而非翻译 |
| `src/pages/InputPage.tsx`、`InputPage.PersonForm.tsx`、`InputPage.BirthPlaceModal.tsx` | 输入表单/出生地级联大量中文 | 输入页线程 |
| `src/pages/RecordsPage.tsx` | 记录页分类/搜索/删除/统计文案中文 | 记录页线程 |
| `src/pages/LexiconPage.tsx` | 分类筛选项 `['全部','天干',...]` 中文 | 词库线程 |
| `src/components/PremiumGate.tsx`、`StarfieldBackground.tsx` 等 | 仅注释含中文，无运行时残留 | 可不处理 |

> 品牌名「命律」与专有名词（八字、紫微、六爻、梅花、太乙、塔罗等）按验收规则视为可接受，不列入缺陷。

---

## 四、法务合规「建议核实点」（非法律意见）

以下仅为技术侧复核发现的**待核实事项**，不构成法律意见，最终口径请由具备资质的法务/合规负责人确认。

### A. 隐私政策要点覆盖

1. **本地存储声明**：已说明常规排盘数据存于 `localStorage / IndexedDB`、默认不上传。✅ 但「最后更新：2026-08-08」为硬编码日期，请确认与实际政策版本一致；建议未来把日期做成可维护字段。
2. **第三方服务 / 服务端 AI**：政策已披露「启用内置 AI 解读时出生信息按设置发送到所配置服务端」。⚠️ **建议核实**：用户自填的 OpenAI 兼容接口地址意味着数据会流向**用户自选的第三方境外服务**，当前政策未点名具体接收方，也未说明数据在第三方侧的留存/删除责任——建议法务确认披露粒度是否足够（尤其面向欧盟/韩国/越南/泰国/西班牙语地区用户时）。
3. **联系方式**：当前只说「通过站点设置中的反馈入口联系」，**未提供任何具体邮箱/地址**。⚠️ GDPR（Art.13）、韩国 PIPA、中国《个人信息保护法》第 17 条均要求可核验的联系渠道——**强烈建议补充一个真实联系邮箱**。
4. **Cookie 声明**：已声明不用第三方 Cookie 跨站追踪。✅ 但站点有 analytics（`analytics.notice` 自述「默认关闭、部署时可开」）与 newsletter KV、Premium 订阅判定——建议确认部署后若开启分析/订阅，是否需要在政策里补充对应处理目的。

### B. 免责声明（Disclaimer）

5. 页内免责声明 + 全站页脚 `disclaimer` key 均已声明「娱乐/自我反思用途、非专业建议」，并明确不构成医疗/法律/财务建议。✅
6. ⚠️ **建议核实**：面向欧盟/拉美用户时，命理/占卜类内容可能被当地消费者法或广告法要求额外标注；韩国、泰国对 fortune-telling 类服务亦有特别规制，请法务确认目标市场的强制披露文案。

### C. 7 语言合规落地

7. 本次已把免责声明与隐私政策正文全部翻译到 7 语言（en / es-ES / ja / ko-KN / th-TH / vi-VN / zh-CN）。⚠️ **注意**：翻译为技术团队自译，**未经母语法务/合规复核**，尤其是 GDPR/PIPA/PIPL 相关措辞——**强烈建议各目标市场的法务母语人士过一遍译稿**，避免翻译偏差导致承诺与实际不符。
8. `disclaimerNote` 短免责句 7 语言目前统一保留英文原文（与原站一致），其余正文均已本地化。如法务要求各语言也本地化该短句，可在后续迭代替换。

---

## 五、本线程未做的事（边界声明）

- 未改动其他线程范围的页面/组件（见第三节清单）。
- 未运行 `wrangler pages deploy`，未 push `origin`（旧仓 Brhiza/mingyu）。
- 未编造任何法律结论；第四节全部为「待核实」，需法务确认。
