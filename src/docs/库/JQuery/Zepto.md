# Zepto.js 基本使用

基本和 jq 完全一样但是用到的模块要单独引入
```js
$(function(){
  $('#box').on('tap', function(){
​    console.log('手指点击');
  })
})
```
zepto 和 jq 的区别

隐藏的元素的获取宽高

jq 可以获取隐藏元素的 width（）/height（）

zepto 中获取隐藏元素的 width（）/height（）都为 0
```js
$('#box').width();// 隐藏的元素在 zepto 中获取宽高为 0
offset()的区别
```
jq 中返回一个对象 包含 元素到文档上左边的距离

```js
zepto 中返回一个对象，包含元素到文档上左边的距离和元素的宽高
$('#sub').offset();// 元素到文档的上左边的距离
$('#sub').offset();// zepto中元素到文档的上左边的距离 和 元素的宽高
```
元素的宽高的获取区别

jq 获取元素的宽有 4 种方法

zepto 中只有一个 width（）和height（）方法 获取的是占位宽
```js
$('#box').width();// 占位宽 内容宽 + padding + border
innerWidth();// 没有
outerWidth();// 没有
outerWidth(true);// 没有
```
## touch 模块
tap 所有的触碰

singleTap 手指单击

doubleTap 手指双击

swipe swipeLeft swipeDown  swipeRight swipeUp 手指滑动

longTap 手指长按