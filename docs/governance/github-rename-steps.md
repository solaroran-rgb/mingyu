# GitHub 仓库改名操作步骤（mingyu → temposoul）

> 线程：h6 · git 仓改名
> 状态：**待用户登录 GitHub 授权执行**（当前环境未安装 gh CLI，无法自动化）
> 基线：`codex/website-basic-settings @ 07fb977`
> 创建时间：2026-09-12

---

## 0. 背景

| 项 | 旧值 | 新值 |
| --- | --- | --- |
| 仓库全名 | `solaroran-rgb/mingyu` | `solaroran-rgb/temposoul` |
| Git URL | `https://github.com/solaroran-rgb/mingyu.git` | `https://github.com/solaroran-rgb/temposoul.git` |
| 主仓 solaroran-rgb remote | `https://github.com/solaroran-rgb/mingyu.git` | 待改名后同步为 `https://github.com/solaroran-rgb/temposoul.git` |

`origin = Brhiza/mingyu` 为上游 fork，**禁止推送**，本次改名仅作用于 `solaroran-rgb` 名下的仓库。

---

## 1. 网页端改名（必须由用户在浏览器操作）

1. 浏览器登录 GitHub 账号 `solaroran-rgb`。
2. 打开仓库设置页：
   <https://github.com/solaroran-rgb/mingyu/settings>
3. **General** → 顶部 **Repository name** 输入框，将 `mingyu` 改为 `temposoul`。
4. 点击 **Rename** 按钮确认。
5. 改名完成后访问 <https://github.com/solaroran-rgb/temposoul> 确认仓库存在且内容完整。

> GitHub 行为说明：改名后旧 URL `https://github.com/solaroran-rgb/mingyu` 会自动 **301 重定向**到新 URL，原有 issues / PR / wiki / stars / forks 全部保留；Git 客户端拉取推送短期内仍可用旧 URL 透明重定向，但**应尽快更新本地 remote**。

---

## 2. 本地各 clone 同步 remote URL

改名完成后，在**每一个**本地 clone（含主仓与所有 worktree）执行：

```bash
git -C "<主仓路径>" remote set-url solaroran-rgb https://github.com/solaroran-rgb/temposoul.git
```

主仓路径：`E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统`

验证：

```bash
git -C "<主仓路径>" remote -v
# 期望输出：
# solaroran-rgb  https://github.com/solaroran-rgb/temposoul.git (fetch)
# solaroran-rgb  https://github.com/solaroran-rgb/temposoul.git (push)
```

> 说明：worktree 与主仓共享同一个 `.git/config`，`git remote set-url` 只需在主仓执行一次，所有 worktree 自动生效。

若日后重新 clone，统一使用新 URL：

```bash
git clone https://github.com/solaroran-rgb/temposoul.git
```

---

## 3. 仓库内旧 URL 引用检查（本线程已完成扫描）

| 位置 | 结果 |
| --- | --- |
| `README.md` | 已使用新 URL `https://github.com/solaroran-rgb/temposoul.git`（第 125、148 行），**无需修改** |
| `.github/workflows/ci.yml` | 无硬编码仓库 URL，**无需修改** |
| `package.json` | 无 `repository` / `homepage` / `bugs` 字段，**无需修改** |

> 改名上线后，建议再全局检索一次 `mingyu`（排除 `node_modules`、`.git`、`dist`），确认无遗漏。

---

## 4. 后续注意事项

1. **CI/CD**：GitHub Actions 使用 `${{ github.repository }}` 等上下文变量时会自动跟随新名；若有外部 CI（Cloudflare Pages、Vercel、第三方 runner）webhook 或 deploy 配置中硬编码了 `solaroran-rgb/mingyu`，需手动更新为 `solaroran-rgb/temposoul`。
2. **Cloudflare Pages**：本项目禁用 `wrangler pages deploy`；若 Pages 项目绑定了仓库 webhook，需在 Cloudflare 控制台重新授权新仓库名。
3. **fork 关系**：`origin = Brhiza/mingyu` 不受本次改名影响；`solaroran-rgb/mingyu` 改名后，GitHub fork 网络中会自动更新指向。
4. **本地缓存**：改名后若出现 `Repository not found`，先 `git remote -v` 确认 URL，再 `git fetch solaroran-rgb`。
5. **gh CLI**：当前环境未安装 gh CLI，故未执行 `gh repo rename`；用户如需后续自动化，可安装 <https://cli.github.com/> 并 `gh auth login`。

---

## 5. 验收清单（用户执行后逐项确认）

- [ ] 浏览器访问 `https://github.com/solaroran-rgb/temposoul` 可正常打开
- [ ] `git -C "<主仓>" remote -v` 显示 solaroran-rgb 指向新 URL
- [ ] `git -C "<主仓>" fetch solaroran-rgb` 成功
- [ ] README / CI / 外部 CI 无旧名残留
