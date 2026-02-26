# 小霸王插件发布指南

## 发布前准备

### 1. 安装 vsce 工具

```bash
npm i -g @vscode/vsce
npm i -g ovsx
```

### 增量更新版本号

```bash
# 发布 patch 版本（0.0.1 -> 0.0.2）
vsce publich patch

# 发布 minor 版本（0.0.1 -> 0.1.0）
vsce publich minor

# 发布 major 版本（0.0.1 -> 1.0.0）
vsce publich major
```

### 登录

- https://open-vsx.org/user-settings/tokens  cursor 发布 token

```bash
vsce login <publisher-name>
```

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

## 发布到 Open VSX

### 2. 创建账号并获取 token

访问 https://open-vsx.org/

### 3. 发布

```bash
ovsx publish nes-games-0.0.1.vsix -p <your-token>
```

## 参考资料

- [VSCode 插件发布文档](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Open VSX 发布指南](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)

