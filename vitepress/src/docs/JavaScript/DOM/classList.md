# JavaScript classList 属性

```js
div.classList.remove("user"); // 删除 user 类
div.classList.add("current"); // 添加 current 类
div.classList.toggle("user");// 切换 user 类
div.classList.contains("d");// 判断是否有 d 类
btn.onfocus();// 获取焦点
btn.onblur(); // 取消焦点

// 兼容模式
document.compatMode;// 标准模式下 CSS1Compat 混杂模式下 BackCompat

// data- 属性
var name = div.dataset.name;// 123 取得自定义 data 属性的值
div.dataset.name = "222";// 设置 data 属性的值
```