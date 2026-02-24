# JavaScript sessionStorage

- 常用于后台服务端控制前端存储数据
- 或用户登录信息，但与 localstore 主要不同的是只在会话期间有效

```js
// 设置键 值
sessionStorage.setItem("key","value");
sessionStorage.key="value";

// 获取对应键值
变量=sessionStorage.getItem("key");
变量=sessionStorage.key;

// 删除键值
sessionStorage.removeItem(name); // 删除对应键
sessionStorage.clear()
```