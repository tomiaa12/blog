# Commit Message Generator

🤖 AI 驱动的 Git Commit Message 自动生成工具

![预览图](src/vscodeExtension/CommitMsgGenerator/resources/preview.gif)


## ✨ 特性

- 🎯 智能分析代码变更，生成规范的中文 commit message
- 🚀 基于 DeepSeek API，成本极低（每次约 ¥0.0001-0.001）
- 🎨 自动过滤压缩文件、二进制文件
- 📊 实时显示 Token 使用量和费用统计
- ⚡ 一键生成，自动填充到 commit 输入框
- 🔧 支持自定义 Commit Type 类型
- 🏷️ 自动从分支名提取 Issue ID（如 `#123`）

## 📦 安装配置

### 1. 安装插件

在 VSCode 扩展市场搜索 `Commit Message Generator` 并安装

### 2. 获取 DeepSeek API Key

1. 访问 [DeepSeek 平台](https://platform.deepseek.com/)
2. 注册并登录（支持国内手机号）
3. 充值（最低 ¥10 起，支持支付宝/微信）
4. 在 **API Keys** 页面创建新的 Key
5. 复制生成的 API Key

### 3. 配置 API Key

**方法一：通过设置界面**

1. 打开 VSCode 设置（`Ctrl + ,` 或 `Cmd + ,`）
2. 搜索 `commitMsgGenerator`
3. 将你的 API Key 粘贴到 `Deepseek Api Key` 字段

**方法二：通过 settings.json**

```json
{
  "commitMsgGenerator.deepseekApiKey": "sk-your-api-key-here"
}
```

### 4. 可选配置

#### 自定义 Commit Types

在设置中搜索 `commitMsgGenerator.commitTypes`，可以自定义类型列表：

```json
{
  "commitMsgGenerator.commitTypes": [
    { "type": "feat", "description": "新功能" },
    { "type": "fix", "description": "修复" },
    { "type": "docs", "description": "文档" },
    { "type": "style", "description": "格式调整" },
    { "type": "refactor", "description": "重构" },
    { "type": "perf", "description": "性能优化" },
    { "type": "test", "description": "测试" },
    { "type": "build", "description": "构建" },
    { "type": "ci", "description": "配置" },
    { "type": "chore", "description": "杂项" },
    { "type": "revert", "description": "回退" }
  ]
}
```

#### Issue ID 自动提取

默认启用。如果你的分支名包含数字（如 `feature/123-new-feature`），会自动生成格式：`feat: #123 描述`

关闭此功能：

```json
{
  "commitMsgGenerator.includeIssueId": false
}
```

支持的分支名格式：

- `feature/123-add-login` → `#123`
- `bugfix/456` → `#456`
- `123-new-feature` → `#123`
- `fix-789-bug` → `#789`

详细配置说明请查看 [CONFIGURATION.md](./CONFIGURATION.md)

## 🎮 使用方法

1. 修改代码
2. 打开源代码管理面板（`Ctrl + Shift + G`）
3. 点击顶部的 **✨ 生成 Commit Message** 按钮
4. 等待 AI 生成（1-3 秒）
5. 生成的 message 会自动填入输入框
6. 查看并确认，然后提交

## 💰 费用说明

使用 DeepSeek API，价格极其便宜：

- **输入**：¥0.07 / 百万 tokens
- **输出**：¥0.28 / 百万 tokens

**实际使用成本：**

- 小改动（10-50 行）：约 ¥0.00015
- 中等改动（50-200 行）：约 ¥0.00045
- 大改动（200-500 行）：约 ¥0.00090

即使每天提交 10 次代码，**月费用也不到 ¥1**！

## 🔒 安全说明

- ✅ API Key 仅存储在本地 VSCode 配置中
- ✅ 不会上传到任何服务器（除了直接调用 DeepSeek API）
- ✅ 代码变更也仅发送给 DeepSeek API
- ⚠️ 请勿将 API Key 提交到 Git 仓库

## 🎯 生成的 Commit Message 格式

### 基础格式

`<type>: <subject>`

### 带 Issue ID 格式

`<type>: #<id> <subject>`

**默认支持的 type：**

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `build`: 构建相关
- `ci`: CI 配置
- `chore`: 杂项维护
- `revert`: 回退提交

可以在设置中自定义更多类型！

**示例：**

不带 Issue ID：

```
feat: 添加用户登录功能
fix: 修复列表页面数据显示错误
docs: 更新 API 文档
```

带 Issue ID（分支名 `feature/123-login`）：

```
feat: #123 添加用户登录功能
fix: #456 修复列表页面数据显示错误
docs: #789 更新 API 文档
```

## 🚫 自动过滤的文件类型

插件会智能过滤以下文件，避免浪费 Token：

- 压缩文件：`.min.js`, `.min.css`, `.bundle.js` 等
- Source Maps：`.map`
- Lock 文件：`package-lock.json`, `pnpm-lock.yaml` 等
- 图片：`.jpg`, `.png`, `.gif`, `.svg` 等
- 字体文件：`.woff`, `.ttf` 等
- 二进制文件：`.exe`, `.dll`, `.pdf` 等
- Minified 内容（自动检测）

## ❓ 常见问题

**Q: 提示"未配置 DeepSeek API Key"怎么办？**

A: 点击提示中的"去配置"按钮，会自动打开设置页面，按照上面的步骤配置即可。

**Q: 显示"没有检测到代码变更"？**

A: 请确保你已经修改了文件。插件会优先使用暂存区（staged）的变更，如果暂存区为空则使用工作区的变更。

**Q: 生成的 message 不满意？**

A: 可以手动修改生成的 message，也可以再次点击按钮重新生成。

**Q: 费用会很贵吗？**

A: 完全不会！DeepSeek 的价格极低，正常使用情况下，每月费用不到 ¥1。

**Q: API Key 安全吗？**

A: API Key 仅存储在你本地的 VSCode 配置中，不会上传到任何地方（除了调用 DeepSeek API 时）。

**Q: 如何自定义 Commit Types？**

A: 在设置中搜索 `commitMsgGenerator.commitTypes`，可以添加、修改或删除类型。详见 [CONFIGURATION.md](./CONFIGURATION.md)

**Q: 分支名中没有 Issue ID 怎么办？**

A: 没关系，插件会自动检测。如果没有找到 Issue ID，就不会在 commit message 中添加。你也可以在设置中关闭此功能。

**Q: 如何分享团队配置？**

A: 可以将 `commitTypes` 和 `includeIssueId` 配置添加到项目的 `.vscode/settings.json` 中（不包含 API Key），团队成员各自配置自己的 API Key。

## 📝 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

- GitHub: [tomiaa12/blog](https://github.com/tomiaa12/blog)
- Website: [kuangyx.cn](https://kuangyx.cn)
