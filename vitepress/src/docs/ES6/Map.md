# JavaScript ES6 Map 对象

- 方法

set()、get()、delete()、has()、clear()、size

## set，get 键值对

key 是字符串

```js
var myMap = new Map();
myMap.set('键', "和键关联的值"); // 设置 键值对
myMap.get('键'); // "和键关联的值" 获取值
```

key是对象

```js
var myMap = new Map();
var keyObj = {}
myMap.set(keyObj, "和键 keyObj 关联的值");
myMap.get(keyObj); // "和键 keyObj 关联的值"
myMap.get({}); // undefined, 因为 keyObj !== {}
```

key 是函数时也与 key 是对象同理。

key 是 NaN ，NaN 作为 Map 的键没有区别。

```js
var myMap = new Map();
myMap.set(NaN, "not a number");
myMap.get(NaN); // "not a number"
myMap.get(Number("无法转换")); // "not a number"
```

## Map 的迭代 遍历

```js
var myMap = new Map();
myMap.set(0, "zero");
myMap.set(1, "one");
```
### for...of

```js
for (var [key, value] of myMap) {
 console.log(key + " = " + value);
}
/* 打印两次
  "0 = zero"
  "1 = one"
*/

myMap.entries() // MapIterator {0 => "zero", 1 => "one"}
for (var [key, value] of myMap.entries()) {
 console.log(key + " = " + value);
}
// entries() 方法返回 Iterator 对象，它按set插入键值对顺序包含 Map 对象中每个元素的 [key, value] 数组。

myMap.keys(); // MapIterator {0, 1} 返回键
for (var key of myMap.keys()) {
 console.log(key); // 打印 0 和 1
}
// keys()返回 Iterator 对象，按插入顺序包含 Map 对象每个元素的键

myMap.values(); // MapIterator {"zero", "one"}
for (var value of myMap.values()) {
 console.log(value); // 一个是 "zero" 另一个是 "one"
}
/* values() 返回 Iterator 对象，按插入顺序包含 Map 对象每个元素的值。 */
```

### forEach

```js
myMap.forEach(function(value, key) {
 console.log(key + " = " + value);
 // 一个是 "0 = zero" 另一个是 "1 = one"
}
```

## 对象操作

### 转换

```js
var kvArray = [["key1", "value1"], ["key2", "value2"]];
// 可以将 二维 键值对数组转换 Map 对象

var myMap = new Map(kvArray); // {"key1" => "value1", "key2" => "value2"}
// Array.from 函数将 Map 对象转回去

var outArray = Array.from(myMap); // [["key1", "value1"], ["key2", "value2"]]
```

### 克隆

```js
var myMap1 = new Map([["key1", "value1"], ["key2", "value2"]]);
var myMap2 = new Map(myMap1);
/* {"key1" => "value1", "key2" => "value2"} */

console.log(myMap1 === myMap2); // false 新地址
```

### 合并

```js
var first = new Map([[1, 'one'], [2, 'two'], [3, 'three'],]);
var second = new Map([[1, 'uno'], [2, 'dos']]);
// 合并两个 Map 对象时，有重复的键值，则后面的会覆盖前面的，对应值即 uno，dos， three

var merged = new Map([...first, ...second]); // 解构传参
console.log(merged); // {1 => "uno", 2 => "dos", 3 => "three"}
```