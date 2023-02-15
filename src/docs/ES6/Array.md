# JavaScript ES6 Array 数组新增方法

## Array.of()

将参数中所有值作为元素形成数组。

没有参数则返回空数组
```js
Array.of(1, '2', true); // [1, '2', true]
```

## Array.from()

将类数组对象或可迭代对象转化为数组。

```js
Array.from([1, 2]); // [1, 2]
Array.from([1, , 3]); // [1, undefined, 3]
```

### 转换类数组

```js
let arr = Array.from({
 0: '1',
 1: '2',
 2: 3,
 length: 3 // 必须有length属性，没有则返回空数组
});
// ['1', '2', 3]

// 属性名无法转换为数值，返回长度为 length 元素值为 undefined 的数组 
let array1 = Array.from({
 a: 1, // 下标 a,b 不能转换为 0 1 
 b: 2,
 length: 2
});// [undefined, undefined]
```

### 转换 map

```js
let map = new Map();
map.set('key0', 'value0');
map.set('key1', 'value1');
Array.from(map); // [['key0', 'value0'],['key1','value1']]
```

### 转换set

```js
let set = new Set([1, 2, 3]);
Array.from(set); // [1, 2, 3]
```

### 转换字符串

```js
Array.from('abc'); // ["a", "b", "c"]
```

## 方法

### find()查找

则返回符合条件的第一个元素。

```js
let arr = Array.of(1, 2, 3, 4);
arr.find(item => item > 2); // 3
```

### findIndex() 查找索引

则返回符合条件的第一个元素的索引。

```js
let arr = Array.of(1, 2, 1, 3);
// 参数1：回调函数
// 参数2(可选)：指定回调函数中的 this 值
arr.findIndex(item => item = 1); // 0
```

### fill()填充

```js
let arr = Array.of(1, 2, 3, 4);
// 参数1：用来填充的值
// 参数2：被填充的起始索引
// 参数3(可选)：被填充的结束索引，默认为数组末尾
console.log(arr.fill('填充',1,2)); // [1, '填充', 3, 4]
```

### copyWithin() 覆盖

1. 开始覆盖的位置索引
2. 复制起始位置
3. （可选）复制结束位置，默认为结尾
```js
var arr = ["a","b","c","d","e","f","g"]
arr.copyWithin(2,4,6)// ["a", "b", "e", "f", "g", "f", "g"]
```

### entries() 遍历

```js
// 遍历键值对。
for(let [key, value] of ['a', 'b'].entries()){
  console.log(key, value);
}
// 0 "a"
// 1 "b"
```

不使用 for... of 循环

```js
let entries = ['a', 'b'].entries();
console.log(entries.next().value); // [0, "a"]
console.log(entries.next().value); // [1, "b"]
```

### keys()遍历键名

```js
for(let key of ['a', 'b'].keys()){
  console.log(key);
}
// 0
// 1
```

### values()遍历键值

```js
for(let value of ['a', 'b'].values()){
  console.log(value);
}
// "a"
// "b"
```

### includes()查找

数组是否包含指定值

Set 的 has 方法用于查找值，Map 的 has 方法用于查找键名。

```js
// 参数1：包含的指定值
[1, 2, 3].includes(1);  // true
// 参数2：可选，搜索的起始索引，默认为0
[1, 2, 3].includes(1, 2); // false
```

### flat()嵌套数组转一维数

```js
console.log([1 ,[2, 3]].flat()); // [1, 2, 3]

// 指定转换的嵌套层数
console.log([1, [2, [3, [4, 5]]]].flat(2)); // [1, 2, 3, [4, 5]]

// 不管嵌套多少层
console.log([1, [2, [3, [4, 5]]]].flat(Infinity)); // [1, 2, 3, 4, 5]

// 自动跳过空位
console.log([1, [2, , 3]].flat());// [1, 2, 3]
```

### flatMap()

先遍历元素，再对数组执行 flat() 方法。

```js
// 参数1：遍历函数，遍历函数可接受3个参数：当前元素、当前元素索引、原数组
// 参数2：指定遍历函数中 this 的指向
console.log([1, 2, 3].flatMap(n => [n * 2])); // [2, 4, 6]
```