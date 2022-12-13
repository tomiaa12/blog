# JQuery DOM 节点操作

## DOM 节点遍历

遍历节点
```js
$('ul').children()// ul 下的所有子节点
$('ul').children('p')// ul 下的 p 子节点
$('ul').find('p')// ul 下的所有后代 p
$('#box').next()// box 的下一个兄弟
$('#box').nextAll()// box 的下边的所有兄弟
$('#box').prev()// box 上一个
$('#box').prevAll()// 上边所有的兄弟
// box 的所有的兄弟节点（之前的和之后的全算）
$('#box').siblings()
$('#box').siblings('p')
```
遍历父节点
```js
$('#box').parent()// 真正的父节点
$('#box').parents()// 所有的祖先节点
$('#box').parents('div')// 所有祖先中的 div
```
遍历节点 - 过滤
```js
$('#box').find('li')// find 获取后代元素
$('li').filter('.aa')// filter 过滤找到满足条件的元素
$('li').not('.aa')// not 排除满足条件的元素 选择其他元素
```
## 属性操作
```js
$('#box').attr('title')// 获取
$('#box').attr('title','xixi');// 设置
// 批量设置
$('#box').attr({
  title: 'heihei',
  sex : 'female'
})
$('#box').removeAttr('sex');// 删除属性
```

属性值为 true 和 false 的属性操作
```js
$(':checkbox').attr('checked');// 获取 --> checked
$(':checkbox').prop('checked');// 获取 --> true
$(':checkbox').prop('checked', true);// 设置
```
## class操作
```js
$('#box').addClass('red');// 添加类 red
$('#box').removeClass('red');// 删除 red
```
判断该元素 box 上是否有 red
```js
$('#box').hasClass('red') // Boolean
$('#box').is('.red')// Boolean
```
切换类名 toggleClass
```js
$('#box').toggleClass('red');
```
## css操作
```js
// 获取样式
$('#box').css('width')
// 设置
$('#box').css('background','red');
// 批量设置
$('#div1').css({
  width:'200px',
  fontSize:'18px'// font-size 去-变驼峰
})
```
## html 文本与值的操作

innerHTML ---> html()

innerText ---> text()

表单value ---> val()
```js

$('#s1').html() // 获取 识别标签
$('#s1').text() // 获取 只识别文本

// 设置
$('#box').html('<i>过年好！</i>');// 会识别标签
$('#box').text('<i>过年好！</i>');// 不会识别

// 表单的value
$(':text').val()
$(':text').val('ddddd');
```
## Node 操作

- 创建元素
```js
 $('<li></li>')
```
- 添加节点
  - 在元素尾部添加
  - 新元素.appendTo(目标元素)
```js
  $('<li>国庆节</li>').appendTo($('#list'));
```
目标.append(新元素)

- 在元素头部添加
  - 新元素.prependTo(目标元素)
  - 目标.prepend(新元素)
```js
  $('#list').prepend($('<li>元旦节</li>'))
```
- 在目标元素之前插入
  - 新元素.insertBrfore(目标元素)
  - 目标元素.before(新元素)
```js
  $('<li>情人节</li>').insertBefore($('#list li').eq(2));
```

- 在目标元素之后插入
  - 新元素.insertAfter(目标元素)
  - 目标元素.after(新元素)
```js
  $('#list li').eq(3).after($('<li>妇女节</li>'));
```
- 删除节点
```js
remove():  将节点删除，返回被删除的节点，不会保留节点上的事件
detach():  将节点删除，返回被删除的节点，会保留节点上的事件
empty():  全部清空
```
- 克隆节点
```js
clone（）  复制节点及内容，但不保留节点上的事件
clone（true）复制节点及内容，保留节点上的事件
```
- 替换节点
  - 新节点.replaceAll(要被替换的节点)
  - 要被替换的节点.replaceWith(新节点)
```js
$('#list li').eq(2).replaceWith($('<li>女神节</li>'));
```
## 数据串联

### serialize()
```js
<input type="text" name = 'a' value = '1'/>
<input type="text" name = 'b' value = '2'/>
<input type="text" name = 'c' value = '3'/>
$("input").serialize()// a=1&b=2&c=3
$("input").serializeArray()// [{{name: "a", value: "1"}}, {…}, {…}]
```
### add 和 slice
```js
$("div").add("span").add("ul li").css("backgroundColor", 'red')
// 等同于
$("div,span,ul li").css("backgroundColor", 'red')// 与add一样
$("ul li").slice(1, 4).css("backgroundColor", 'red');// 获取从1到4的 li元素
```