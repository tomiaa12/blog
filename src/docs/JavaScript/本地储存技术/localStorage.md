# JavaScript localStorage

## 存储时间
- localStorage（IE8 以下不兼容）
  - 永久存储 
  - 最大存储 5M 客户端的微型数据库
  - 只能存储 string

- cookie
  - 可以设置过期时间
  - 最大存 4KB
  - 每一个域名下面最多可以存储 50 条数据
- sessionStorage（结合后台使用、关闭窗口存储的数据清空）

## localStorage 对象

```js
// 设置键 值
localStorage.setItem("key","value");// 设置键，值（必须 json 字符串）
localStorage.key="value";

// 获取对应键值
localStorage.getItem("key");
localStorage.key;

// 删除键值
localStorage.removeItem(name); // 删除对应键
localstorage.clear(); // 清除所有
```