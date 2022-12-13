# JavaScript function 函数对象-数据类型

- 函数分类
  - 普通命名函数
  - 通过名字调用执行

```js
function fn(){}
```

- 事件处理函数
  - 可以是匿名函数也可以是匿名函数，通过元素对象的事件触发来执行

```js
  btn.onclick = function(){}
```

- 构造函数
  - 通过new运算符来执行

```js
  function Person(){}
  new Person();
```

- 回调函数
  - 在主函数中满足一定条件调用执行 匿名函数也可以是命名函数
- 表达式函数：将一个函数 赋值给一个变量 通过函数名的调用执行


```js
var a = function(){}
```

- 匿名函数：闭包

```js
;(function(name){
  console.log(name);
  return 'aaa';
})('mark');
// 或者
+function(name){
  console.log(name);
}('mark');
// 或者
!function(name){
  console.log(name);
}('mark');
```

## callee 与 caller

```js
function a(){
  console.log(arguments.callee);// 当前函数
  console.log(a.caller); // 真正调用此函数的函数
}
```

## 改变this指向

```js
fn.call(obj,a,b,c...);// 多个参数
fn.apply(obj,[a,b,c...]);// 两个参数，第二个为数组
fn.bind(obj,a,b,c...);// 与 call 一样，返回的是函数本身
```
:::tip 注意
第一个参数传null为不改变this指向
:::

## 函数的 length 属性

```js
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2 有一个默认值， 3-1 = 2

// 数值为参数的长度，但指定了默认值 length 属性将失真
(function(...args) {}).length // 0 

// 如果设置了默认值的参数不是尾参数，那么 length 属性也不再计入后面的参数了。
(function (a = 0, b, c) {}).length // 0
(function (a, b = 1, c) {}).length // 1
```

## name属性

```js
function foo() {}
foo.name // "foo"
// 构造函数 name 为构造出来对象下的值
(new Function)
```