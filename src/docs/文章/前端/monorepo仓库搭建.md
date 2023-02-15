# monorepo 仓库搭建

## 什么是`monorepo`?

`monorepo`可以管理多个项目在一个工作区维护。

如：

```sh
-- 根目录
  |-- node_modules  // 所有的项目依赖可以都存放在这里，也可以单独存放在单独的项目文件下。
  |-- packages      // 组件库
    |-- components  // 所有的组件
      |- **/package.json 等，每个组合都是一个包
    |-- theme-chalk // 组件的样式
    |-- utils       // 所有的公共方法
  |-- play          // 测试 packages 的 vite 项目
```

## 初始化

1. 使用 pnpm 来创建项目 `npm i -g pnpm`
2. `pnpm init` 创建`package.json`
3. `"private": true` package 中设置为私有库
4. 根目录创建`.npmrc`文件，写入`shamefully-hoist = true`。关闭 pnpm 的幽灵依赖，在 package.json 没有安装也可以引入包。
5. 根目录创建`pnpm-workspace.yaml`文件:

```yaml
packages:
  - play # 组件开发测试
  - docs # 文档
  - "packages/**" # 组件库
```

6. 根目录创建`tsconfig.json`:

```ts
{
  "compilerOptions": {
    "target": "es6", // 遵循es6版本
    "useDefineForClassFields": true,
    "noImplicitAny": true, // 支持类型不标注可以默认any
    "module": "esnext", // 打包模块类型ESNext
    "moduleResolution": "node", // 按照node模块来解析
    "esModuleInterop": true, // 支持es6,commonjs模块
    "noLib": false, // 不处理类库
    "jsx": "preserve", // jsx 不转
    "sourceMap": true, // 映射
    "resolveJsonModule": true,
    "isolatedModules": true,
    "lib": [
      // 编译时用的库
      "esnext",
      "dom"
    ],
    "allowSyntheticDefaultImports": true, // 允许没有导出的模块中导入
    "experimentalDecorators": true, // 装饰器语法
    "forceConsistentCasingInFileNames": true, // 强制区分大小写
    "skipLibCheck": true, // 跳过类库检测
    "suppressImplicitAnyIndexErrors": true, // 跳过库检查
    "strict": true, // 是否启动严格模式
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["element-plus/global"] // Volar 支持
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "exclude": [
    // 排除掉哪些类库
    "node_modules",
    "**/__tests__",
    "dist/**"
  ],
}
```

## 工作区文件共享

1. `packages\components` 下执行`pnpm init`创建`package.json`
2. 修改 package 的 name`"name": "@项目名/components"`。
3. 在根目录执行 `npm i @项目名/components -w`，这样就可以在其他项目引入`packages\components`下的这个组件。其他文件也是同理。
4. 在`package.json`中修改`"@项目名/components": "workspace:*"`允许所有版本。
