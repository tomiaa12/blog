# Firebase Firestore 权限配置说明

## 问题描述

当您看到 "Missing or insufficient permissions" 错误时,这表示 Firebase Firestore 的安全规则配置不正确或缺失。

## 解决方案

### 方法一: 使用 Firebase CLI 部署规则(推荐)

1. **安装 Firebase CLI** (如果尚未安装):
   ```bash
   npm install -g firebase-tools
   ```

2. **登录 Firebase**:
   ```bash
   firebase login
   ```

3. **初始化 Firebase 项目** (如果尚未初始化):
   ```bash
   firebase init firestore
   ```
   
   在初始化过程中:
   - 选择您的 Firebase 项目
   - 使用项目根目录的 `firestore.rules` 文件
   - 使用项目根目录的 `firestore.indexes.json` 文件

4. **部署 Firestore 规则**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 方法二: 在 Firebase Console 中手动配置

1. **访问 Firebase Console**:
   - 打开 [Firebase Console](https://console.firebase.google.com/)
   - 选择您的项目

2. **进入 Firestore Database**:
   - 在左侧菜单中点击 "Firestore Database"
   - 点击顶部的 "规则" 标签页

3. **复制并粘贴以下规则**:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // 辅助函数：检查是否为认证用户
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // 辅助函数：检查是否为文档所有者
    function isOwner(uid) {
      return isAuthenticated() && request.auth.uid == uid;
    }
    
    // blog 集合规则
    match /blog/{uid} {
      // 用户只能读写自己的文档
      allow read, write: if isOwner(uid);
      
      // pages 子集合规则
      match /pages/{pageKey} {
        // 用户只能读写自己的页面数据
        allow read, write: if isOwner(uid);
        
        // records 子集合规则
        match /records/{recordId} {
          // 用户只能读写自己的记录数据
          allow read, write: if isOwner(uid);
        }
      }
    }
  }
}
```

4. **发布规则**:
   - 点击 "发布" 按钮

## 规则说明

### 数据结构

应用使用以下 Firestore 数据结构:

```
blog/{uid}/                              # 用户根文档
  ├── pages/{pageKey}/                   # 页面数据 (如: "在线记单词")
  │   └── records/{recordId}/            # 记录数据 (如: "simpleWords", "rareWords")
```

### 权限说明

- ✅ **允许**: 已认证用户可以读写自己的所有数据
- ❌ **禁止**: 用户无法访问其他用户的数据
- ❌ **禁止**: 未认证用户无法访问任何数据

### 具体权限

1. **用户文档** (`blog/{uid}`):
   - 用户只能读写自己 uid 对应的文档

2. **页面数据** (`blog/{uid}/pages/{pageKey}`):
   - 用户只能读写自己的页面数据
   - 例如: "在线记单词" 页面的配置

3. **记录数据** (`blog/{uid}/pages/{pageKey}/records/{recordId}`):
   - 用户只能读写自己的记录数据
   - 例如: 熟悉单词列表 (simpleWords)、生僻词列表 (rareWords)

## 验证配置

配置完成后,请执行以下步骤验证:

1. **刷新应用页面**
2. **确保已登录** Firebase 账户
3. **尝试添加熟悉单词或生僻词**
4. **检查是否还有权限错误**

## 开发环境配置

如果您在本地开发,确保已设置正确的环境变量:

在项目根目录创建 `.env` 文件(如果还没有):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## 测试模式(不推荐用于生产环境)

如果您只是想快速测试,可以临时使用以下规则(允许所有认证用户访问):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **警告**: 此规则仅供测试使用,不要在生产环境中使用!

## 常见问题

### Q: 为什么我需要配置这些规则?

A: Firebase Firestore 默认拒绝所有访问。您必须明确配置规则来允许用户访问数据。

### Q: 这些规则安全吗?

A: 是的。这些规则确保:
- 只有已认证的用户才能访问数据
- 用户只能访问自己的数据
- 其他用户无法读取或修改您的数据

### Q: 我可以让数据公开访问吗?

A: 可以,但不推荐。如果您确实需要公开某些数据,可以修改规则。但对于个人单词学习数据,应该保持私密。

### Q: 规则更新后多久生效?

A: 通常在几秒钟内生效。如果没有立即生效,请等待最多 1 分钟。

## 额外资源

- [Firebase Firestore 安全规则文档](https://firebase.google.com/docs/firestore/security/get-started)
- [规则测试工具](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [常见安全模式](https://firebase.google.com/docs/firestore/security/rules-structure)

## 需要帮助?

如果您在配置过程中遇到问题:

1. 检查 Firebase Console 中的"规则"标签页是否有错误提示
2. 确认您已登录正确的 Firebase 账户
3. 检查浏览器控制台的详细错误信息
4. 验证环境变量配置是否正确

