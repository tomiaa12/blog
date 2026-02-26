# JavaScript location URL 地址对象

完整的 URL 地址：

协议：// 主机名：端口号 /路径/ ？查询字符串 #锚点

如：https://127.0.0.1:5500/javascript.html/?a=ssa&bd=asd#aaa

```js
location.hash // #aaa      哈希值
location.host // 127.0.0.1:5500 域名+端口
location.hostname // 127.0.0.1  域名
location.href // https:127.0.0.1:5500/?a=ssa&bd=asd#aaa url 地址 toString() 也能返回这个值
location.origin // https:127.0.0.1:5500 文件来源地址
location.pathname // /JavaScript.html 文件路径
location.port // 5500 端口
location.protocol // https: 协议
location.search // ?a=ssa&bd=asd 表单提交的数据
location.port = 8080; // 可以用这样的方法修改上面的值，除了 hash 值外，页面都会以新的 URL 重新加载

location = 'http:// www.163.com';
location.assign(url)// 在当前窗口跳转到这个URL
location.replace("http:// baidu.com"); *// 在当前窗口替换成新的 URL 用户将不能回到前一个页面*
location.reload();// 重新加载（可能从缓存中加载）
location.reload(true);// 重新加载（从服务器重新加载）
```