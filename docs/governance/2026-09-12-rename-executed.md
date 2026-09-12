# GitHub 仓库改名执行记录（mingyu → temposoul）

> 执行线程：h6 · git 仓改名
> 执行时间：2026-09-12
> 执行方式：浏览器手动登录 + 自动化点击（本机无 gh CLI）
> 基线分支：`codex/website-basic-settings`

---

## 1. 结论

**改名成功。** 已将 GitHub 上 `solaroran-rgb/mingyu` 改名为 `solaroran-rgb/temposoul`，本地 `solaroran-rgb` remote 已同步指向新 URL，`fetch --all` 与 `ls-remote` 验证通过。

## 2. 变更明细

| 项 | 旧值 | 新值 |
| --- | --- | --- |
| 线上仓库全名 | `solaroran-rgb/mingyu` | `solaroran-rgb/temposoul` |
| Git URL | `https://github.com/solaroran-rgb/mingyu.git` | `https://github.com/solaroran-rgb/temposoul.git` |
| 本地 remote `solaroran-rgb`（fetch/push） | `https://github.com/solaroran-rgb/mingyu.git` | `https://github.com/solaroran-rgb/temposoul.git` |

## 3. origin（上游 fork）处理

- `origin = https://github.com/Brhiza/mingyu.git` **未改动**。
- 依据 `docs/governance/github-rename-steps.md` 第 18 行：`Brhiza/mingyu` 为上游 fork，**禁止推送**，本次改名仅作用于 `solaroran-rgb` 名下仓库。
- 浏览器仓库页仍显示 "Forked from Brhiza/mingyu"，fork 网络由 GitHub 自动维护，符合预期。

## 4. 线上验证

- 改名后自动跳转 `https://github.com/solaroran-rgb/temposoul`。
- 页面面包屑为 `solaroran-rgb / temposoul`，仓库描述、分支（main 等 6 个分支）、提交历史、文件列表均完整。
- 截图证据：`docs/governance/2026-09-12-rename-evidence.png`。
- 旧 URL `https://github.com/solaroran-rgb/mingyu` 由 GitHub 自动 301 重定向到新 URL。

## 5. 本地验证

```text
$ git remote -v
origin          https://github.com/Brhiza/mingyu.git (fetch)
origin          https://github.com/Brhiza/mingyu.git (push)
solaroran-rgb   https://github.com/solaroran-rgb/temposoul.git (fetch)
solaroran-rgb   https://github.com/solaroran-rgb/temposoul.git (push)

$ git fetch --all            # exit 0，无报错
$ git ls-remote --heads solaroran-rgb
# refs/heads/main, codex/website-basic-settings, thread-h1-gov 等均正常返回
```

worktree 与主仓共享 `.git/config`，`set-url` 仅在主仓执行一次，所有 worktree 自动生效。

## 6. 未做事项（遵守铁律）

- 未部署任何服务。
- 未触碰 `.temposoul-wt/` 下其他线程的 worktree。
- 未触碰 `_audit_20260912/`。
- 未对 `origin`（Brhiza/mingyu）做任何推送或改名。
- 除仓库改名与本地 remote 更新外，未执行其他 GitHub 线上操作。

## 7. 后续提示

- 外部 CI / Cloudflare Pages webhook 若硬编码 `solaroran-rgb/mingyu`，需手动更新为 `solaroran-rgb/temposoul`（本项目禁用 `wrangler pages deploy`）。
- 后续重新 clone 一律使用 `https://github.com/solaroran-rgb/temposoul.git`。
