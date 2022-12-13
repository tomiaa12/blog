# jQuery ajax 接口请求
```js
$.ajax({
  url,
  cache,// 在 get 下是否启用缓存
  type,// get/post
  data,// 上传数据
  timeout,// 相应超时时间
  datatype,// 预期返回的数据类型默认 text
  success, // 成功回调
  error,
  conplate
})
```
跨域

dataType 设置为 jsonp
```js
$.ajax({
  url:'https://www.baidu.com/sugrec',// ?prod=pc&wd=aa&cb=fn
  type:'get',
  data:{prod:'pc',wd:'cc'},
  dataType:'jsonp',
  success:function(res){
​    console.log(res);
  }
})
```
### load 方法

将 url 传入以后，将下载到数据直接填充到被选中元素的 innerHTML 中
```js
$("div").load("2.txt #p1", function(data, statusText, xhr){
  data    下载到的数据
  statusText 下载的状态 success
  xhr     ajax对象
})
```