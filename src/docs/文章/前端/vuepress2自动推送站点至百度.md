# vuepress2 自动推送站点至百度

## 安装

```sh
npm i -D vuepress2-plugin-baidu-autopush
```

## 使用

```js
// vuepress.config.ts   or   .vuepress/config.ts
import { baiduAutopush } from 'vuepress2-plugin-baidu-autopush'

export default defineUserConfig({
  plugins:[ baiduAutopush() ]
})
```