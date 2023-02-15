# vue cli 设置默认 document.title 替换 package.json 的 name

未配置时，在加载页面时网页标题会默认显示项目名`package.json`的 name 值。我们需要 `vue.config.js`中配置`webpack`默认标题。

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    //设置标题  默认不设置的话是项目名字（ package.json 的 name 值）
    config.plugin('html').tap(args => (args[0].title = "乐教坊", args))
  }
}
```