# JavaScript ES6 Iterator 迭代器

核心概念：

1. 迭代器是一个统一的接口，作用是使各种数据结构可被便捷的访问
2. 是 Symbol.iterator 下的方法实现。提供这种接口的有 Array、String、arguments、Map、Set、Dom 元素（正在进行中）。可以被 for...of 遍历
3. Array 下有 Symbol 属性，所以`arr[Symbol.iterator]()`调用，返回 Iterator 对象
4. iterator 对象下 next 方法单次调用方法`{value: '本次遍历的值', done: 是否遍历结束，返回 true/false }`

```js
const items = ["zero", "one", "two"];
const it = items[Symbol.iterator]();
it.next(); // {value: "zero", done: false}
it.next(); // {value: "one", done: false}
it.next(); // {value: "two", done: false}
it.next(); // {value: undefined, done: true}

// 正常运行
for (let item of Array.from({...})) {
 console.log(item);
}
// 部署一个Iterator接口
obj[Symbol.iterator] = function(){
  // ...
}
```
