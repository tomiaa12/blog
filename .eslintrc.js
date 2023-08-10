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
    "vue/require-v-for-key": "off", // 禁用 v-for 语法校验， vue3 v-for 不需要绑定 :key，不禁用会报没有绑定 key 的警告
    "@typescript-eslint/no-explicit-any": "off", // 允许使用 any
    "vue/no-mutating-props": "off", // 允许子组件直接修改父组件的值
  },
}
