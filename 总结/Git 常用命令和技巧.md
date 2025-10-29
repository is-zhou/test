下面是一份高质量、实战导向的 Git 常用命令与技巧清单，分为基础、分支协作、版本管理、回滚修复、远程操作、配置与进阶技巧几大类。
这些命令和技巧是前端开发中最常用、最能体现熟练度的内容（不仅适合日常，也适合在面试时展示“熟练使用 Git 进行多人协作和版本管理”）。

🧩 一、基础操作
| 场景 | 命令 | 说明 |
| ------ | -------------------------------------- | -------------- |
| 初始化仓库 | `git init` | 创建一个新的 Git 仓库 |
| 克隆项目 | `git clone <url>` | 克隆远程仓库到本地 |
| 查看状态 | `git status` | 查看当前变更文件、暂存区状态 |
| 添加到暂存区 | `git add .` | 将所有修改添加到暂存区 |
| 提交更改 | `git commit -m "feat: add xxx"` | 提交代码并添加描述信息 |
| 查看提交日志 | `git log --oneline --graph --decorate` | 以图形化方式查看提交记录 |
| 查看文件变更 | `git diff` | 查看未暂存的代码差异 |

🌿 二、分支操作（Branch Workflow）
| 场景 | 命令 | 说明 |
| ----- | ------------------------------------------------------------ | ------------------- |
| 创建分支 | `git branch feature/login` | 创建新分支 |
| 切换分支 | `git checkout feature/login`<br>或 `git switch feature/login` | 切换到该分支 |
| 创建并切换 | `git checkout -b feature/login` | 一步创建并切换 |
| 查看分支 | `git branch` | 查看本地分支 |
| 删除分支 | `git branch -d feature/login` | 删除本地分支 |
| 合并分支 | `git merge feature/login` | 将 feature 分支合并到当前分支 |
| 变基操作 | `git rebase main` | 让当前分支基于最新主干重新构建提交历史 |
| 解决冲突 | 编辑冲突文件 → `git add .` → `git rebase --continue` | 手动处理冲突后继续 |

🧭 三、版本管理与回滚（Reset / Revert）
| 场景 | 命令 | 说明 |
| ---------- | ------------------------------ | ------------------------------ |
| 撤销工作区修改 | `git checkout -- <file>` | 恢复到上一次提交状态 |
| 撤销暂存区修改 | `git reset HEAD <file>` | 从暂存区移除但保留文件修改 |
| 回退到某个提交 | `git reset --hard <commit-id>` | 彻底回退（本地文件也恢复） |
| 保留修改的回退 | `git reset --soft <commit-id>` | 回退提交但保留修改 |
| 撤销某次提交（安全） | `git revert <commit-id>` | 新建一次反向提交，不影响历史 |
| 查看历史记录 | `git log` / `git reflog` | `reflog` 可看到所有操作历史，包括被 reset 的 |

🔹 小技巧：

当你执行错 git reset --hard 时，可以用 git reflog 找回被删提交的 ID。

```bash
git reflog
git reset --hard <old-commit-id>
```

🌐 四、远程仓库操作（Remote）
| 场景 | 命令 | 说明 |
| ---------- | ----------------------------- | --------------- |
| 添加远程仓库 | `git remote add origin <url>` | 绑定远程仓库 |
| 查看远程仓库 | `git remote -v` | 查看所有远程地址 |
| 推送代码 | `git push origin main` | 推送本地代码到远程分支 |
| 拉取更新 | `git pull origin main` | 拉取并合并远程代码 |
| 同步远程更新（安全） | `git fetch origin main` | 仅拉取但不合并，可安全查看差异 |
| 推送所有标签 | `git push origin --tags` | 推送本地所有标签到远程 |

🧱 五、标签与版本管理（Tags）
| 场景 | 命令 | 说明 |
| -------- | --------------------------------------- | --------- |
| 创建标签 | `git tag v1.0.0` | 创建轻量标签 |
| 创建带信息的标签 | `git tag -a v1.0.0 -m "release v1.0.0"` | 创建带说明的标签 |
| 查看标签 | `git tag` | 查看标签列表 |
| 推送标签 | `git push origin v1.0.0` | 推送某个标签到远程 |
| 删除标签 | `git tag -d v1.0.0` | 删除本地标签 |

⚙️ 六、配置与常用技巧
| 技巧 | 命令 / 思路 | 说明 |
| ------------- | ----------------------------------------------------- | --------------- |
| 设置全局用户名 | `git config --global user.name "Leisurely Zhou"` | 全局配置用户信息 |
| 设置邮箱 | `git config --global user.email "xxx@gmail.com"` | 邮箱配置 |
| 为不同盘符设置不同用户 | 使用 `.gitconfig` includeIf 分区配置 | （你之前的方案 👍） |
| 查看全局配置 | `git config --list --global` | 检查当前 Git 全局配置 |
| 快速查看最近 5 次提交 | `git log -5 --oneline` | 简洁输出 |
| 撤销最后一次提交但保留修改 | `git reset --soft HEAD~1` | 常用于修改 commit 信息 |
| 修改最近一次提交信息 | `git commit --amend -m "fix: correct commit message"` | 不改变内容只更新说明 |
| 忽略未追踪文件 | `git clean -fd` | 清理未跟踪文件（慎用！） |

🧠 七、进阶协作技巧

1. 交互式 rebase（整理提交历史）

```bash
   git rebase -i HEAD~5
```

可合并多条 commit（squash）、修改说明或删除无效提交。

面试亮点点：用于“优化提交历史、保证主干清晰”。

2. Cherry-pick（挑选特定提交）

```bash
   git cherry-pick <commit-id>
```

把指定提交应用到当前分支。

常用于 hotfix：从主分支挑选修复代码到生产分支。

3. Stash 暂存改动

```bash
   git stash save "临时修改"
   git stash list
   git stash pop
```

临时保存未提交的工作进度，适合切分支前使用。

🧾 八、可写入简历的技巧描述（工程化层面）

熟练使用 Git 进行团队协作与版本管理，掌握分支管理、rebase、cherry-pick、stash 等进阶命令；
能够独立解决代码冲突、回滚错误提交，并通过 Git Hooks + Husky 实现提交规范化（如自动 lint 与格式化）。
