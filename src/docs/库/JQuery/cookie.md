# jQuery cookie 操作

获取
```js
$.cookie(name) 
```
设置
```js
$.cookie(name, value) 设置name和value
$.cookie(name, value {
  raw: true // value不进行编码
​        // 默认false value要进行编码的
})
```
删除
```js
$.cookie(name, null); 删除cookie
``` 

实例
```js
$.cookie("变种人", "X教授", {
  expires: 7,
  raw: true
})
```