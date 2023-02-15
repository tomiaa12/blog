# Node.js express 框架

```js
const express = require('express');
const app = express();
app.listen('3000'); // 监听端口
```
独立功能和功能数组的组合
```js
var cb0 = function (req, res, next) {
 console.log('CB0')
 next()
}
var cb1 = function (req, res, next) {
 console.log('CB1')
 next()
}
```
多个函数 next()
```js
app.get('/example/d', [cb0, cb1], function (req, res, next) {
 console.log('the response will be sent by the next function ...')
 next()
}, function (req, res) {
 res.send('Hello from D!')
})
```
## Router()

```js
const express = require('express');
const route = express.Router();
route.get('/',(req,res) => {})
exports = route; // 对外暴露
// 引入上面模块中间件调用
app.use(route);
```
## use 中间件

```js
// 中间件 在请求之后，响应之前触发 
// 一般写在路由之前
app.use((req,res,next) => {
  // 代码块
  next();// next 是一个函数 查找后面匹配的路由，执行
})
``` 

错误处理中间件
```js
app.use(req, res, () => {
  if (0) {
​    next();
  } else { // 错误
    // 当给 next() 方法传参数会自动执行含有 err、req、res、next 四个参数的中间件(错误处理中间件)
​    next('error message');
  }
})
// 错误处理中间件
app.use((err, req, res, next) => {
  res.end(err);
});
```
## static 静态资源托管

```js
// app.use([path],callback)
app.use(express.static(path.resolve(__dirname,'demo')));// 静态资源托管
// 访问的第二个参数为 images 下的文件，html 文件请求会是 images 下的 /images。所以第一个参数 path 加上 images
app.use('/images',express.static(path.resolve(__dirname,'demo','images')));
app.use('/css',express.static(path.resolve(__dirname,'demo','css')))
```
## get 接参 query、params

```js
// get 请求 path路径支持正则
app.get('/api/:a/:b',(req,res) => {});
/* 
接参
1. 查询字符串格式: res.query
2. path路径格式：路径改为 /:变量名/:变量名 , 回调函数获取 : req.params 得到对象 
*/
res.send(data);// 发送数据
res.sendFile(path);// 发送文件
// all 方法后面的路由不会再执行,一般写在最后匹配所有
app.all('*',(req,res) => {res.end('404 页面找不到')});
```

## post 接参 urlencoded

```js
// POST 调用中间件接参
app.use(express.urlencoded({extended : true}))
app.post('/app', (req, res) => {
  console.log(req.body);
})
```

## 第三方中间件

### cookie-parser

设置 cookie
```js
res.cookie('key', 'value');
```
获取 cookie
```js
const cookieParser = require('cookie-parser');
app.use(cookieParser());// 中间件调用
app.get('/get',(req,res) => {
  req.cookies; // 获取
  // res.cookie(key,value,[option]);// 设置
  res.cookie('键','值',{
​    maxAge : '多少毫秒后过期',
​    expires : '过期的时间戳',
​    httpOnly : true, // 是否只能服务端访问,默认false
​    path : '固定路径才能访问',
​    domain : '固定域名才能访问'
  })
})
```

### cookie-session

```js
const cookieSeesion = require('cookie-session');
app.use(cookieSeesion({
  name:'key',// 储存在cookie的键名
  keys : ['12331a&&%#',"#&!^sa"]// 加密
}));

app.get('/get',(req,res){
  req.session.name = '设置';
  req.session;// 获取
})
```

## 第三方库

### ejs模板

npm i ejs 不需要 require 引入 直接用
```js
app.set('view engine','ejs');// 固定两个参数语法，设置模板引擎为 ejs
app.set('views',[path.resolve(__dirname,'lib')])// 设置路径位置，数组可以多个路径
app.engine('html',require('ejs').__express);// 告诉 ejs 用 html 文件解析

app.get('/',(req,res) => {
  let name = '参数';
  res.render('index.ejs',{name})// 调用 传参
})
```
<%   '脚本标签',流程开始

<%=   要输出的数据

<%#   注释

<%%   输出字符串%

%>   结束标签

<%- include('相对路径'); %>

### express-generator 项目生成器
```sh
npm i express-generator
express --view=ejs  mydemo 
​        ejs模板  文件夹名称
在当前目录下创建 
```

进入这个文件夹  npm i 安装依赖

目录列表

app.js 入口文件

bin/www 启动文件

views 模板文件

public 静态资源

routes router 级别路由文件

配置以热更新方式启动项目

修改项目根下的 package.json 文件中的 "scripts" 配置项
```js
"scripts": {
​  "start": "node ./bin/www",
​  "dev": "nodemon ./bin/www"
}
```
npm run dev运行 dev后面的代码

## express操作MySQL

```js
npm i mysql
```

```js
const mysql = require('mysql');

// 创建连接
let dbObj = mysql.createConnection({
 port: 3306,// 端口号
 host : localhost,// 地址
 user : root, // 用户名
 password : 'root',// 密码 [注意]密码是数字也要双引号变成字符串,数字可能连接不上
 database : mydemo,// 操作的数据库
 charset : 'utf8',// 链接的编码
 connectTimeout : 1000// 超时毫秒
});

// 发送连接
dbObj.connect();

// 执行语句
// sqly 语句中 ? 为占位符，替换对应的参数 1，参数 2 的变量 等
// let sql = `insert into classes(zhuanye,teacher)values(?,?)`; // [参数1,参数2]
dbObj.query(sql语句,[参数1,参数2...],(err,d) => {d/* d查询到的数据 */})
// 字符串拼接 sql 可以能会被 sql 注入,可以正则检验，或使用第二个参数
```

## es6模块化

单个暴露：

```js
export let/var 属性名=属性值
export function 方法名(){ }
```

批量暴露：

```js
let/var 属性名=值
function 方法名(){}
export {属性名，属性名 as 别名，方法名}
```

使用模块：

```js
import {属性名，方法名，属性名 as 别名} from '模块文件名'
```

## koa框架

npm i koa-generator -g 安装

koa2 -e（表示 ejs 模板） 项目文件夹名 新建项目

安装依赖

cd 项目文件夹名

npm i

启动热更新

npm run dev

koa与express的区别：

1. ctx 对象中封装的 nodejs 的 request 对象、response 对象。
2. koa 中使用级联操作替代 express 中的回调函数。
3. koa 中没有中间件，express 有中间件。

想使用这些中间件及包的话就选择 express，而 koa 追求的是性能及可定制性，如果项目中的功能都想自己来开发则选择 koa