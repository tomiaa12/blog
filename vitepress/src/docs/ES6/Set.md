# JavaScript ES6 Set 对象

- 原型方法
  - add()、delete()、has()、clear()、 size
- Set 对象允许存储任何类型的唯一值，原始值或引用值都可。
- 特殊值
  - +0 与 -0 在存储判断唯一性的时候是恒等的，所以不重复。
  - undefined 与 undefined 是恒等的，所以不重复。
  - NaN 与 NaN 是不恒等的，但是在 Set 中只能存一个，不重复。

## 创建

```js
let mySet = new Set();
mySet.add(5); // Set(1) {5}
mySet.add(5); // Set(1) {5} 值的唯一性

mySet.add({a: 1, b: 2});
mySet.add({a: 1, b: 2}); 
// Set(5) {1, {…}, {…}} 
// 对象之间引用不同不恒等，即使值相同，Set 也能存储
```
## 转换
```js
// Array 转 Set
var mySet = new Set(["value1", "value2", "value3"]);// {"value1", "value2", "value3"}

// 用...操作符，将 Set 转 Array
var myArray = [...mySet];// ["value1", "value2", "value3"]

// String
// String 转 Set
var mySet = new Set('hello'); // Set(4) {"h", "e", "l", "o"}
// 注：Set 中 toString 方法是不能将 Set 转换成 String
```



## 数组去重

```js
var mySet = new Set([1, 2, 3, 4, 4]);
[...mySet]; // [1, 2, 3, 4]
```

## 并集

```js
var a = new Set([1, 2, 3]);
var b = new Set([4, 3, 2]);
var union = new Set([...a, ...b]); // {1, 2, 3, 4}
/* 解构传入，唯一值，相当于去重 */
```



## 交集

```js
var a = new Set([1, 2, 3]);
var b = new Set([4, 3, 2]);
```

Set.has(x) 是 set 中的一个方法。

判断当前 set 对象 中是否含有 x，返回 true/false。
```js
var intersect = new Set([...a].filter(x => b.has(x))); // {2, 3}
```

[...a] 解构成数组。filter 过滤

传入 x，返回 set 对象 b 中是否存在 x

存在返回 true，不存在返回 false 被过滤掉

## 差集

与交集同理

```js
var a = new Set([1, 2, 3]);
var b = new Set([4, 3, 2]);
var difference = new Set([...a].filter(x => !b.has(x))); // {1}
```
