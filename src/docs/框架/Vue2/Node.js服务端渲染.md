# Vue Node.js 服务端渲染

依赖

```js
"dependencies": {
  "express": "^4.17.1",
  "vue": "^2.6.12",
  "vue-server-renderer": "^2.6.12"
}
```

html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
      
    <meta charset="UTF-8" />
    {{{meta}}}
    <title>{{title}}</title>
  </head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
```

app.js

```js
const Vue = require("vue")
const server = require("express")()
const fs = require("fs")

const renderer = require("vue-server-renderer").createRenderer({
  // 读文件，返回给浏览器去显示
  template: fs.readFileSync("./index.html", "utf-8"),
})

// 页面的 head 部分
const context = {
  title: "vue-ssr-demo-title",
  meta: `<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  `,
}

server.get("/huaweip40", (req, res) => {
  const vm = new Vue({
    data: {
      url: req.url,
      msg: "huaweip40",
      hobby: ["唱", "跳", "rap", "打篮球"],
    },
    template: `<div>
        <p>当前页面地址：{{url}}</p>
        <p>{{msg}}</p>
   </div>
   `,
  })
  renderer.renderToString(vm, context, (err, html) => {
    // 失败的回调
    if (err) {
      res.status(500).end("err", err)
      return
    }
    // 服务器给浏览器发送的数据
    res.end(html)
  })
})

server.get("/mi11", (req, res) => {
  const vm = new Vue({
    data: {
      url: req.url,
      msg: "mi11",
      hobby: ["唱", "跳", "rap", "打篮球"],
    },
    template: `<div>
        <p>当前页面地址：{{url}}</p>
        <p>{{msg}}</p>
   </div>
   `,
  })

  renderer.renderToString(vm, context, (err, html) => {
    // 失败的回调
    if (err) {
      res.status(500).end("err", err)
      return
    }
    // 服务器给浏览器发送的数据
    res.end(html)
  })
})
const port = 8082
server.listen(port, () => {
  console.log("ok!!!!!!", port)
})
```
