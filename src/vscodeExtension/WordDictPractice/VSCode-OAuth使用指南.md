# VSCode 扩展中使用 Firebase Google OAuth 登录指南

## 概述

已在 `useFirebaseAuth.ts` 中添加了 `signInWithGoogleInVSCode` 方法，支持在 VSCode 扩展环境下使用 Google OAuth 登录。

## 工作原理

1. **打开授权页**：通过 VSCode 的外部浏览器打开 Google OAuth 授权页面
2. **本地回调服务器**：启动本地 HTTP 服务器（默认端口 5589）接收授权回调
3. **交换 Token**：用授权码换取 access_token 和 id_token
4. **Firebase 登录**：使用 token 完成 Firebase 身份验证

## 配置步骤

### 1. 配置 Google OAuth

前往 [Google Cloud Console](https://console.cloud.google.com/):

1. 创建或选择项目
2. 启用 Google+ API
3. 创建 OAuth 2.0 客户端 ID（类型：Web 应用）
4. 添加授权重定向 URI：`http://localhost:5589/callback`（或自定义端口）
5. 记录 **客户端 ID** 和 **客户端密钥**

### 2. 配置环境变量

在项目中添加环境变量（建议使用 VSCode Secret Storage）：

```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=your-client-secret
VITE_GOOGLE_OAUTH_PORT=5589  # 可选，默认 5589
```

### 3. 在应用中使用

```typescript
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import { isVSCode } from '@/utils/isVSCode'

const { signInWithGoogle, signInWithGoogleInVSCode, user } = useFirebaseAuth()

async function handleLogin() {
  try {
    if (isVSCode()) {
      // VSCode 环境下使用 OAuth 流程
      await signInWithGoogleInVSCode({
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
        redirectPort: 5589 // 可选，默认 5589
      })
    } else {
      // 浏览器环境下使用弹窗登录
      await signInWithGoogle()
    }
    
    console.log('登录成功:', user.value)
  } catch (error) {
    console.error('登录失败:', error)
  }
}
```

## 消息通信机制

### Webview -> VSCode 扩展

当需要打开外部浏览器时，应用会发送消息：

```typescript
window.parent.postMessage({
  type: 'vscode-open-external',
  url: 'https://accounts.google.com/o/oauth2/v2/auth?...'
}, '*')
```

### VSCode 扩展处理

扩展已配置好消息监听，会自动调用：

```javascript
vscode.env.openExternal(vscode.Uri.parse(url))
```

## 安全注意事项

1. **客户端密钥保护**：
   - 不要将 `clientSecret` 硬编码在代码中
   - 使用环境变量或 VSCode Secret Storage
   - 在生产环境考虑使用后端代理

2. **重定向 URI 限制**：
   - 只使用 `localhost` 和指定端口
   - 在 Google Console 中严格限制允许的重定向 URI

3. **超时处理**：
   - 本地服务器会在 5 分钟后自动关闭
   - 用户取消授权会收到错误回调

## 故障排查

### 端口被占用

如果 5589 端口被占用，可以：

```typescript
await signInWithGoogleInVSCode({
  clientId: '...',
  clientSecret: '...',
  redirectPort: 5590 // 使用其他端口
})
```

记得在 Google Console 中添加新的重定向 URI。

### 授权失败

检查：
1. Google Console 中的重定向 URI 是否正确
2. Client ID 和 Secret 是否正确
3. 浏览器是否阻止了弹窗
4. 防火墙是否阻止了本地服务器

### VSCode 环境检测

确保正确检测 VSCode 环境：

```typescript
// src/utils/isVSCode.ts
export function isVSCode() {
  return new URLSearchParams(window.location.search).get('vscode') === 'true'
}
```

## API 文档

### signInWithGoogleInVSCode(config)

**参数：**

- `config.clientId` (string, 必需)：Google OAuth 客户端 ID
- `config.clientSecret` (string, 必需)：Google OAuth 客户端密钥
- `config.redirectPort` (number, 可选)：本地服务器端口，默认 5589

**返回：**

- Promise<UserCredential>：Firebase 用户凭证

**抛出异常：**

- 授权失败、Token 交换失败、网络错误等

## 示例：完整登录组件

```vue
<template>
  <div>
    <button v-if="!user" @click="handleLogin" :disabled="loading">
      {{ loading ? '登录中...' : '登录' }}
    </button>
    <div v-else>
      <p>欢迎，{{ user.displayName }}</p>
      <button @click="handleLogout">退出</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import { isVSCode } from '@/utils/isVSCode'

const { user, signInWithGoogle, signInWithGoogleInVSCode, signOutUser } = useFirebaseAuth()
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  try {
    if (isVSCode()) {
      await signInWithGoogleInVSCode({
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
      })
    } else {
      await signInWithGoogle()
    }
  } catch (error) {
    alert('登录失败：' + error.message)
  } finally {
    loading.value = false
  }
}

async function handleLogout() {
  await signOutUser()
}
</script>
```

## 更新日志

- 2024-12-09：添加 VSCode OAuth 登录支持
- 支持自定义重定向端口
- 添加超时和错误处理
- 完善消息通信机制

