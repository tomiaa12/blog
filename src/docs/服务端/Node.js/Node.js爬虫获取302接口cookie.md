# Node.js 爬虫获取 302 重定向接口 set-cookie

```js
let Cookie = ""
try {
  console.log("action")
  const { data } = await axios({
    method: "post",
    url: "https://xxx/login",
    maxRedirects: 0, // 禁用重定向
  })
} catch (error) {
  console.log(error.response.headers["set-cookie"][2])
  Cookie = error.response.headers["set-cookie"][2]
}
```
