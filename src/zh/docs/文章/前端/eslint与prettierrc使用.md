# eslint 与 prettierrc 使用

## 安装

1. `vscode`搜索插件`eslint`安装
2. 控制台运行`npx i eslint --init`安装并执行`eslint`初始化

```sh
√ How would you like to use ESLint? · problems # 是否安装
√ What type of modules does your project use? · esm # es 模块
√ Which framework does your project use? · vue # vue 框架
√ Does your project use TypeScript? · Yes # 使用 ts 语法
√ Where does your code run? · browser, node # 浏览器与 node 环境
√ What format do you want your config file to be in? · JavaScript # js 文件来配置
√ Would you like to install them now? · Yes # 安装需要的插件
```

## 配置

- 依赖：`npm i @vue/eslint-config-typescript -D`.vue 文件的 ts 校验

```js
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended", // eslint 推荐规范
    "@vue/typescript/recommended", // 校验 .vue 文件的 ts，需要安装 npm i @vue/eslint-config-typescript -D
    "plugin:@typescript-eslint/recommended", // ts 语法插件
    "plugin:vue/vue3-recommended", // vue3解析 https://eslint.vuejs.org/
    "plugin:prettier/recommended", // 使 eslint 使用 prettierrc 的规则来校验，避免两者之间的格式冲突，添加到数组的最后一个元素覆盖来去除不必要的规则冲突。
  ],
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    "vue/html-self-closing": "off", // 禁用强制将 <MyComponent></MyComponent> 必须使用 <MyComponent/> 的校验
    "vue/singleline-html-element-content-newline": "off",
    "vue/multi-word-component-names": "off", // 禁用注册组件 name 不能使用 大写 的报错
    "vue/prefer-import-from-vue": "off", // 禁用 import x from '@vue/runtime-dom' 包以 @/ 开头的报错
    "@typescript-eslint/no-non-null-assertion": "off", // 允许使用 ts 语法 obj!.a
    "vue/valid-v-for": "off", // 禁用 v-for 语法校验， vue3 v-for 不需要绑定 :key，不禁用会报没有绑定 key 的警告
  },
};
```

## 配置不要做格式校验的文件

根目录`.eslintignore`

```sh
# 配置不需要做代码格式校验的文件
node_modules
dist
*.css
*.jpg
*.jpeg
*.png
*.gif
*.d.ts
```

## 代码格式化

- `vscode`安装插件`Prettier - Code formatter`

- 配置格式化规则

```yaml
// .prettierrc.yaml
singleQuote: false # false 不使用单引号
semi: false # false 不使用分号
trailingComma: "es5" # 在多行数组、对象的最后一项添加逗号，单行数组不会添加。
arrowParens: "avoid" # 箭头函数只有一个参数时省略括号
endOfLine: "auto" # 结尾自动换行
singleAttributePerLine: true # true 标签属性使用单行
```

- 配置不需要格式化的文件

根目录`.prettierignore`

```sh
# 配置不需要格式化的文件
node_modules
dist
```

## 配置`prettier`格式化与`eslint`一致

1. vscode 快捷键 `ctrl + ,` 打开设置
2. 搜索`formatter`
3. `Editor:Default Formatter`设置为`Prettier - Code formatter`
4. 搜索`formatter on save`打钩，在报存是自动格式化
