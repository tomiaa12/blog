# Google OAuth 配置详细指南

## 🎯 目标

获取以下环境变量的值：
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_GOOGLE_CLIENT_SECRET`

## 📋 详细步骤

### 步骤 1：进入 Google Cloud Console

1. 访问：[https://console.cloud.google.com/](https://console.cloud.google.com/)
2. 使用你的 Google 账号登录

### 步骤 2：选择项目

**重要**：必须选择与 Firebase 相同的项目！

1. 点击顶部的项目选择器（左上角 Google Cloud 标志旁边）
2. 在弹出窗口中找到你的 Firebase 项目
   - 项目名称通常与 Firebase 项目一致
   - 项目 ID 在 Firebase Console 可以看到
3. 点击选择该项目

> 💡 **提示**：如果找不到项目，可能是：
> - 使用了不同的 Google 账号登录
> - Firebase 项目在不同的账号下
> - 需要先在 Firebase Console 查看项目 ID

### 步骤 3：启用必要的 API

1. 在左侧菜单中，找到 **"API 和服务"** → **"库"**
2. 搜索并启用以下 API：
   - **Google+ API**（已弃用但可能需要）
   - 或 **Google Identity Toolkit API**（推荐）
3. 点击 **"启用"** 按钮

### 步骤 4：创建 OAuth 2.0 客户端 ID

#### 4.1 配置 OAuth 同意屏幕（如果还没配置）

1. 左侧菜单：**"API 和服务"** → **"OAuth 同意屏幕"**
2. 选择用户类型：
   - **外部**（推荐）：任何 Google 账号都能登录
   - **内部**：仅组织内部用户（需要 Google Workspace）
3. 点击 **"创建"**
4. 填写应用信息：
   - **应用名称**：`Word Dict Practice`（或你的应用名）
   - **用户支持电子邮件**：你的邮箱
   - **开发者联系信息**：你的邮箱
5. 点击 **"保存并继续"**
6. **作用域**页面：点击 **"保存并继续"**（使用默认作用域）
7. **测试用户**页面：
   - 如果选择了"外部"，可以添加测试用户邮箱
   - 或直接点击 **"保存并继续"**
8. 检查摘要，点击 **"返回信息中心"**

#### 4.2 创建凭据

1. 左侧菜单：**"API 和服务"** → **"凭据"**
2. 点击顶部的 **"+ 创建凭据"** 按钮
3. 选择 **"OAuth 2.0 客户端 ID"**
4. 选择应用类型：**"Web 应用"**
5. 填写信息：
   - **名称**：`Word Dict VSCode Extension`（随意命名）
   - **已获授权的 JavaScript 来源**：（可以留空）
   - **已获授权的重定向 URI**：点击 **"+ 添加 URI"**
     ```
     http://localhost:5589/callback
     ```
     > 如果要使用其他端口，改成对应的端口号，如 `http://localhost:5590/callback`
6. 点击 **"创建"**

### 步骤 5：获取凭据

创建成功后，会弹出一个对话框显示：

```
您的客户端 ID
xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com

您的客户端密钥
GOCSPX-xxxxxxxxxxxxxxxxxxxxx
```

**重要**：
- ✅ **立即复制保存**这两个值！
- ❌ 客户端密钥只显示一次，关闭后需要重新生成
- 💾 可以随时在凭据页面查看客户端 ID
- 🔒 客户端密钥如果丢失，需要点击凭据名称 → "重置密钥"

### 步骤 6：创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# 如果你已经有 Firebase 配置，保持不变
VITE_FIREBASE_API_KEY=你的-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=你的项目.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=你的项目-id

# 新增：Google OAuth 配置（复制粘贴上一步获取的值）
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx

# 可选：自定义端口（默认 5589）
VITE_GOOGLE_OAUTH_PORT=5589
```

### 步骤 7：重启开发服务器

环境变量修改后需要重启：

```bash
# 按 Ctrl+C 停止当前服务器
# 然后重新运行
pnpm dev
```

## 🎯 快速获取 Firebase 配置

如果你还不确定 Firebase 的环境变量值：

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 选择你的项目
3. 点击齿轮图标 ⚙️ → **"项目设置"**
4. 向下滚动到 **"您的应用"** 部分
5. 如果还没有 Web 应用，点击 **"添加应用"** → 选择 **"Web"** (</>图标)
6. 会看到类似这样的配置：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  // ... 其他配置
};
```

复制这些值到 `.env.local`：

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
```

## ✅ 验证配置

### 检查环境变量是否加载

在代码中添加临时日志：

```typescript
console.log('Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID)
console.log('有 Secret:', !!import.meta.env.VITE_GOOGLE_CLIENT_SECRET)
```

### 测试登录流程

1. 在 VSCode 扩展中点击登录
2. 应该会：
   - 在外部浏览器打开 Google 授权页
   - 显示你的应用名称
   - 授权后跳转到 `http://localhost:5589/callback`
   - 显示"登录成功"并自动关闭

## 🔧 常见问题

### Q1：找不到我的 Firebase 项目？

**解决方案**：
1. 确认使用相同的 Google 账号
2. 在 Firebase Console 查看项目 ID
3. 在 Google Cloud Console 搜索该项目 ID

### Q2：重定向 URI 不匹配错误？

**错误信息**：
```
Error: redirect_uri_mismatch
```

**解决方案**：
1. 检查端口号是否一致（默认 5589）
2. 确保在 Google Cloud Console 添加了正确的 URI
3. URI 必须完全匹配，包括协议、端口、路径：
   - ✅ `http://localhost:5589/callback`
   - ❌ `http://localhost:5589`
   - ❌ `https://localhost:5589/callback`
   - ❌ `http://127.0.0.1:5589/callback`

### Q3：环境变量未定义？

**解决方案**：
1. 确保文件名是 `.env.local` 或 `.env`
2. 环境变量名以 `VITE_` 开头
3. 重启开发服务器（必须！）
4. 检查文件位置（必须在项目根目录）

### Q4：客户端密钥丢失了？

**解决方案**：
1. 进入 Google Cloud Console → API 和服务 → 凭据
2. 找到你创建的 OAuth 客户端 ID
3. 点击编辑（铅笔图标）
4. 向下滚动，点击 **"重置密钥"**
5. 复制新的密钥并更新 `.env.local`

### Q5：端口被占用？

**错误信息**：
```
Error: listen EADDRINUSE: address already in use :::5589
```

**解决方案**：

方案 1：换个端口
```env
VITE_GOOGLE_OAUTH_PORT=5590
```

并在 Google Cloud Console 添加新的重定向 URI：
```
http://localhost:5590/callback
```

方案 2：释放端口
```bash
# macOS/Linux
lsof -ti:5589 | xargs kill -9

# Windows
netstat -ano | findstr :5589
taskkill /PID <进程ID> /F
```

## 📚 相关资源

- [Google Cloud Console](https://console.cloud.google.com/)
- [Firebase Console](https://console.firebase.google.com/)
- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
- [Firebase Auth 文档](https://firebase.google.com/docs/auth)

## 🔒 安全提醒

1. ⚠️ **不要将 `.env.local` 提交到 Git**
   - 确保 `.gitignore` 包含 `.env.local`
   
2. ⚠️ **不要分享客户端密钥**
   - 这是敏感信息，不要公开
   
3. ⚠️ **生产环境使用服务端代理**
   - 避免在客户端暴露密钥
   - 考虑使用 Firebase Cloud Functions

4. ✅ **定期轮换密钥**
   - 如果怀疑泄露，立即重置密钥

## 🎉 完成

配置完成后，你的 VSCode 扩展就可以使用 Google 登录了！

如有问题，请检查浏览器控制台和 VSCode 开发者工具的错误信息。

