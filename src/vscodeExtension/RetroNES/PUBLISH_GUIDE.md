# 小霸王插件发布指南

## 发布前准备

### 1. 安装 vsce 工具

```bash
npm install -g @vscode/vsce
```

### 2. 创建图标

确保 `resources/icon.png` 存在（128x128 PNG 格式）。

参考 `resources/README.md` 生成图标。

### 3. 更新版本信息

在 `package.json` 中更新：
- `version`: 版本号
- `description`: 插件描述
- 其他需要修改的字段

## 打包插件

### 本地打包

```bash
# 在插件目录下执行
vsce package
```

这会生成一个 `.vsix` 文件，可用于本地安装测试。

### 本地安装测试

```bash
code --install-extension nes-games-0.0.1.vsix
```

## 发布到市场

### 1. 创建发布者账号

参考 WordDictPractice 插件的 `创建发布者步骤.md`。

### 2. 登录

```bash
vsce login <publisher-name>
```

需要输入 Personal Access Token (PAT)。

### 3. 发布

```bash
vsce publish
```

或发布特定版本：

```bash
vsce publish 0.0.2
```

### 4. 增量更新版本号

```bash
# 发布 patch 版本（0.0.1 -> 0.0.2）
vsce publish patch

# 发布 minor 版本（0.0.1 -> 0.1.0）
vsce publish minor

# 发布 major 版本（0.0.1 -> 1.0.0）
vsce publish major
```

## 发布到 Open VSX

Cursor 使用 Open VSX Registry，需要单独发布：

### 1. 安装 ovsx 工具

```bash
npm install -g ovsx
```

### 2. 创建账号并获取 token

访问 https://open-vsx.org/

### 3. 发布

```bash
ovsx publish nes-games-0.0.1.vsix -p <your-token>
```

## 注意事项

1. **图标文件**：必须有 `icon.png`（128x128）
2. **README.md**：应包含清晰的使用说明
3. **许可证**：确认 LICENSE 字段正确
4. **版本号**：遵循语义化版本 (semver)
5. **测试**：发布前充分测试所有功能

## 常见问题

### Q: 打包时提示缺少文件？
A: 检查 `.vscodeignore`，确保必要文件没有被忽略。

### Q: 发布失败？
A: 检查：
- Personal Access Token 是否有效
- 版本号是否已存在
- package.json 配置是否正确

### Q: 如何更新已发布的插件？
A: 修改代码后，更新版本号，然后重新发布即可。

## 参考资料

- [VSCode 插件发布文档](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Open VSX 发布指南](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)
- WordDictPractice 插件的发布文档

