# 初识

```js
console.log($ == jQuery);// true jQuery 就是 $ 等价的
```

## 页面加载
```js
$(document).ready(function(){});// 相当于原生 window.onload（DOMContentLoaded）
```
比 onload 先执行
```js
$(function(){})// 简写
```
只需要文档结构加载完毕后执行，onload 是文档和资源媒体加载完成。

## DOM节点对象转换

jq 的 DOM 节点与原生 DOM 节点互转
```js
// jq 转原生
console.log($(this));// 返回 jq 对象

// init 数组对象 通过下标获取到的就是原生的 DOM
console.log($('#box')[0]);
console.log($('#box').get(0));
$('#box').get(0).innerHTML = '哈哈';

## 让出 $ 的使用权限

jQuery.noConflict();
console.log($); // undefind
// 闭包 将 jQuery 传到闭包中的 $ 在闭包函数中又可以使用 $ 来进行 jq 的操作

;(function($){
  $(function(){
​    console.log($('#box'));
  })
})(jQuery)

// 给 $ 起个名字
var jq = jQuery.noConflict(true);
console.log(jq('#box'));
```

## $ 下常用的方法
```js
// 可以遍历数组，对象，jq元素
$.each(obj, function(key, value){
  console.log(key + ':' + value);
})
```
还可以 $('选择器').each() // 遍历元素 工具级别
```js
var newArr = $.map(arr,function(item){
  return item  item  item; 
})有返回值
$.type()  输出当前数据类型  typeof
$.trim()  删除字符串前后的空格
$.inArray()  indexOf()
$.proxy()  功能类似于bind $.proxy()
$.noConflict() 给$起个别名
$.parseJSON()  JSON.parse()
$.makeArray()  将伪数组转成数组。 Array.from()
```