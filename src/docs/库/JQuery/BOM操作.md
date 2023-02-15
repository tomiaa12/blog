# JQuery BOM 操作

## 元素的宽高

- 原生的元素的宽高分别那几种如何获取
  - 内容宽高----width height
  - 可视宽高--- clientWidth/clientHeight
  - 占位宽高---offsetWidth/offsetHeight
```js
$("#div1").css("width")// "100px" 字符串
```
- jq 的元素宽高操作
  - 内容宽高 width() height() 方法
  - 可视宽高 innerWidth（） innerHeight（）
  - 占位宽高 outerWidth() outerHeight()
  - 整个宽高 outerWidth（true） outerHeight（true）
- jq 获取可视区及文档的宽高
  - 可视区宽高 $(window).width()/.height()
- 文档的宽高 $(document).width()/height()

## 元素的位置
```js
$('#sub').offset() 返回一个对象  到文档的 left和top值
$('#sub').position() 返回一个对象 到有定位属性的父级元素的 left和top值
```
## 滚动条卷走的宽高操作
```js
$(document).scrollTop() // 不传参获取，传参设置
```