# JavaScript ajax 状态码、json 对象、http 状态码

## readyState

- open：之前是 0
- send：发送请求之后是 1
- send：方法完成，已经接受到所有的响应内容 2
- 正在解析下载到的数据 3
- 解析完成 4

## State HTTP 常见状态码

- 200：交易成功
- 301：永久重定向
- 302：临时重定向
- 304：使用缓存文件
- 400：错误请求，如语法错误
- 404：没有发现文件、查询或 URl
- 405：请求方式错误
- 500：后端错误
- 1**：请求收到，继续处理
- 2**：操作成功收到，分析、接受
- 3**：完成此请求必须进一步处理
- 4**：请求包含一个错误语法或不能完成
- 5**：服务器执行一个完全有效请求失败

## json 对象

```js
JSON.parse()   // josn字符串转为数据结构
JSON.stringify() // 数据结构转为字符串
eval()// 将具有 js 格式的字符串转换为 js 执行，可以转换除了 json 以外的任意 js 字符串
```

### 数组深拷贝

```js
var obj={name:"rypy",age:20};
var obj1=JSON.parse(JSON.stringify(obj));
obj1.name="rypy1";
console.log(obj); // {name: "rypy", age: 20}
console.log(obj1); // {name: "rypy1", age: 20}

php 实现
echo json_decode($arr);// josn字符串 => 数据结构
echo json_encode($arr);// 数据结构  => 字符串
```