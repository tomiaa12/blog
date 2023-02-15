# Node.js http 服务器

## 创建服务器

```js
const http = require('http');
const server = http.createServer();// 创建服务器
// [参数1:配置信息][参数2:fun(request请求,response相应)]
// 返回 hppt.server对象

// 返回的对象,监听 req请求
server.on('request',(req,res) => {
  // request:浏览器请求信息 response:返回响应信息
  // 设置头文件 防止乱码
  res.writeHead(200,'ok',{'content-type' : 'text/html;charset=utf-8;'});

  // 参数1:200 [参数2:备注信息][参数3:配置信息,设置 utf-8 返回 ServerResponse 可用链式调用
  res.setHeader('content-type','text/html;charset=utf-8;');
  // 设置单个响应头的值 同上

  res.write('返回1'); // 返回响应的信息，可调用多次
  res.end('结束'); // 结束响应,必须、且只能调用一次；后续的代码不会执行
});

// 参数1:设置端口号 [参数2:回调]
server.listen(8888,() =>{
  console.log('server at 8888');
})
```

## 设置允许跨域

```js
app.all('*', function(req, res, next) {
　// 设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
　// 允许的header类型
  res.header('Access-Control-Allow-Headers', 'Content-type');
　// 跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
  next();
});
```
