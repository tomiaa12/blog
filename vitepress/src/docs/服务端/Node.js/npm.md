# node.js npm

## npm 指令

- `npm -v`查看版本
- `npm -version`查看 npm 模块所有版本
- `npm`帮助说明
- `npm search 包名`搜索模块
- `npm install 包名`在当前目录安装模块，简写`npm i`包名
- `npm install 包名 -g`在全局模式安装包
- `npm install 包名 --save`安装包并添加到依赖中`cnpm`必须要加`—save`
- `npm install 包名 -S`安装包并添加到依赖中
- `npm install`下载 package 依赖的包
- `npm remove 包名`删除一个模块，简写`npm r`包名
- `npm uninstall 包名`删除
- `npm install 文件路径`本地安装一个路径
- `npm install 包名 --registry=地址`从镜像源安装
- `npm update 包名`更新某个包的版本
- `npm config set registry 地址`设置镜像源

- `npm init --yes`当前目录强制生成`package.json`
- `npm init [-y]`自动生成
- `packge.json`:

```json
"scripts": {
  "start": "node ./bin/www", // 用 npm start 启动 www.js 只有键为 start 可以省略 run
  "dev":"nodemon ./bin/www" // 用 npm run dev 启动 www.js
}
```

## npm 镜像源

为什么慢？因为`npm`默认源在国外

- `npm get registry` 查看当前镜像源

### 临时安装修改

```sh
npm install 包名 --registry https://registry.npm.taobao.org/
```

### 全局修改

- 将`npm`服务器切到国内淘宝服务器(镜像服务器)，分别执行下面的命令：
  `npm config set registry https://registry.npm.taobao.org`

- `npm config set registry https://www.npmjs.org` 将当前源设置为官方镜像源

### 使用第三方包切换源

- 安装`npm install -g nrm`
- 列出当前可用的镜像源`nrm ls`

```sh
  npm ---------- https://registry.npmjs.org/
  yarn --------- https://registry.yarnpkg.com/
  tencent ------ https://mirrors.cloud.tencent.com/npm/
  cnpm --------- https://r.cnpmjs.org/
  taobao ------- https://registry.npmmirror.com/
  npmMirror ---- https://skimdb.npmjs.com/registry/
```

- 使用淘宝源`nrm use taobao`
- 测试访问源延迟`nrm test taobao`

## npm 包

### svg-captcha 生成验证码

```js
const svgCaptcha = require("svg-captcha")
let captcha = svgCaptcha.create({
  ignoreChars: "ilo0",
  color: true,
  width: 100,
  noise: 3,
})
```

### uuid 生成唯一 uid

```js
const { v4: uuidv4 } = require("uuid")
uuidv4()
```

### browserify 后台代码编译成前端

安装`npm i -g browserify`

```sh
browserify 源文件[入口文件.js] -o 目标文件(编译之后的文件)
```

### babel 将 es6 语法转换成 es5

还可以操作 jsx 语法 [react]。

```sh
npm i -g babel-cli 安装全局工具包
npm install babel-preset-es2015 --save-dev 开发目录下安装开发依赖
```

--save-dev：开发依赖（主要在开发阶段使用）

在根目录下创建 .babelrc 文件

`{"presets": ["es2015"]}`

babel ./src[src 为 es6 语法的目录] -d ./dest[转换成 es5 的目录]

::: tip 注意
转换前源代码需要放在一个目录下，根目录创建 .babelrc 文件
:::

### socket.io 协议 /websocket

```js
socket.emit('自定义事件名','消息内容');   // 发送消息给某个客户端
socket.broadcast.emit('自定义事件名',‘消息内容’);  // 发送消息给除当前客户端外的其他客户端

io.emit('自定义事件名','消息内容'); // 给所有客户端发送消息
socket.on('自定义事件名',回调函数); // 接收消息
socket.handshake.query.房间号参数名 // 接收房间号
socket.join(房间号,回调函数) // 加入不同的房间
socket.to(房间号).emit('自定义事件名',‘消息内容’); // 给指定房间号的所有客户端发送消息
```

### 服务端

```js
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
server.listen(3000);
app.use(express.static(path.resolve(__dirname,'www')));
// 监听,但客服端发送请求触发
io.on('connection', (socket) => {
  // 一建立连接就发给所有客户端
  io.emit('back','所有的客户端都搜到消息')

  // 接到消息后
  socket.on('msg',(m) => {
​    console.log(m); // 客户端发来的消息
​    socket.emit('back','返回给客户端的消息')
​    socket.broadcast.emit('back','广播消息,除了请求的客户端以外其他都能接搜到')
​    io.emit('back','所有的客户端都搜到消息')
  })
});
```

### 客户端

启动服务后，服务端会在根目录创建 socket.io.js，需要在客户端引入

```html
<script src="/socket.io/socket.io.js"></script>
<script>
    let socket = io(); // 执行 io 的构造函数
    socket.emit('msg','发给服务端的消息');
    socket.on('back',(m) => {
  ​    console.log(m);
  })
</script>
```
