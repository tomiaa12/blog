# Node.js webpack 打包工具

安装 webpack@4 版本与 webpack-cli 客户端

npm install webpack@4  webpack-cli  -g

1. npm init -y 创建 package.json文件
2. 根目录新建 webpack.config.js 文件

配置信息

```js
module.exports = {
  entry : '',       // 入口文件
  output: '',       // 输出文件
  module : {},      // 处理对应模块
  plugins: [],      // 对应的插件
  devServer : {},     // 开发服务器配置
  mode : 'development',  // 模式配置
}
```

## 实例

webpack 命令打包文件，只能打包 js 文件
```js
const path = require('path');
module.exports = {
  entry: path.resolve(__dirname, './src/app.js'), // 入口文件
  output: {
​    path: path.resolve(__dirname, './dest'), // 打包后的目录
​    filename: 'dabao.js' // 打包后的文件名
  },
}
```

## 插件

### 打包 html 文件

npm i html-webpack-plugin@4 -D 安装到开发依赖
```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 设置插件配置项
module.exports = {
  plugins: [
​    new HtmlWebpackPlugin({
​      // 在 src 目录 [项目目录] 下创建一个 index.html 页面当作模板来使用
​      template: './src/index.html'
​    })
  ]
}
```
而 index.html 文件内容会增加一行内容：
```html
<script type="text/javascript" src="打包后的.js"></script>
```

如果在打包过程中报如下的错误：

  Error: Cannot find module 'webpack/lib/node/NodeTemplatePlugin

安装

```js
npm i webpack@4 -D
```

### 打包 css 到 js 文件内

```js
npm i style-loader css-loader@3.6.0 -D
```

css-loader 是负责解析 css 的[当使用插件拆分 css 时就不再需要 style-loader]

style-loader 将 css 以内部样式表的形式嵌入到 html 中

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  module: {
​    rules: [{
​      test: /\.css$/,
​      use: ['style-loader', 'css-loader'] // loader 就是要处理对应 test 规则的文件 loader 的 use 规则，是从右向左处理
​    }]
  }
}
```

### 打包外链 css

```js
npm i style-loader extract-text-webpack-plugin@next  -D
```

目前版本不支持 webpack4
```js
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
module.exports = {
  plugins: [
​    // css 拆分后会把 css 文件放到 dest 目录下的 css/styles.css 中
​    new ExtractTextWebpackPlugin('css/style.css')
  ],
  module: {
​    rules: [{
​      test: /\.css$/,
​      use: ExtractTextWebpackPlugin.extract({ use: 'css-loader' }) // 将 css 用 link 方式引入就不需要 style-loader 了
​    }]
  }
}
```

### 打包 CSS 中的图片
```sh
npm i url-loader file-loader -D
```
```js
module: {    
  rules: [{
​    test: /\.(png|jpg|gif)$/,
​    use: [{
​      loader: 'url-loader',
​      options: {
​        limit: 8192 // 字节在 8192 以下会被转码为 base64 格式
​      }
​    }]
  }] 
}
```

### 使用 jQuery 功能

```sh
npm i jquery
```
```js
import $ from 'jquery'; // 引入 jquery 库
```

### 压缩JS代码

```js
module.exports = {
  mode: 'production' // 默认是production表示压缩js代码
  // 'development' // development表示不压缩代码
}
```

### 压缩 css 代码
```sh
npm i optimize-css-assets-webpack-plugin --save-dev
```
```js
const OptimizeCssAssetsPlugin= require('optimize-css-assets-webpack-plugin');
module.exports = {
  plugins: [
​    new OptimizeCssAssetsPlugin({
​      assetNameRegExp: /\.css$/g,
​      cssProcessor:require('cssnano'),
​      cssProcessorOptions:{safe:true,discardComments:{removeAll:true}},
​      canPrint:true
​    })
  ],
}
```

### 压缩 HTML 代码

不需要安装插件

```js
module.exports = {
  plugins: [
​    new HtmlWebpackPlugin({
​      // 在 src 目录下创建一个 index.html 页面当作模板来使用
​      template: './src/index.html',
​       minify:{
​         removeAttributeQuotes:true,
​         removeComments:true,
​         collapseWhitespace:true,
​         removeScriptTypeAttributes:true,
​         removeStyleLinkTypeAttributes:true
  ​    }
​    }),
  ],
}
```

### webpack 热更新
```sh
npm i webpack-dev-server@next -D
```
```js
const Webpack = require('webpack');
module.exports = {
  plugins: [
    new Webpack.HotModuleReplacementPlugin(), // webpack 热更新插件
  ],
  // 新增热更新配置：
  devServer:{
​    // 设置服务器访问的基本目录
​    // contentBase:path.resolve(__dirname,'dest'),
​    // 设置服务器 ip 地址，可以是 localhost
​    host:'localhost',
​    port:8090,// 设置端口
​    open:true,// 设置自动打开浏览器
​    hot:true// 设置热更新
  }
}
```