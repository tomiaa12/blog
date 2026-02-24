# JavaScript Array 数组对象-数据类型

## 创建

```js
new Array(10);// 一个值是数组的长度，值为 empty（空
new Array('1','3');// 多个值与字面量一样
```

- 利用 length 可以在末尾添加一项

```js
as[as.length] = "red";

as[99] = "green"; // 下标 99 添加，3 到 98 都是undefined
```

- 转换方法

```js
var color = ['red','pink','green'];
color.toString() // red,pink,green
color.valueOf() // (3) ["red", "pink", "green"] 返回数组对象的原始值
```

## 改变原数组（7个方法）

```js
arr.push();// 末尾添加 一个/多个值, 返回新 length
arr.pop();// 删除末尾的值，返回删除的值
arr.unshift();// 前面添加 一个/多个值，返回新 length
arr.shift();// 删除第一个值，返回删除的值
arr.reverse();// 数组逆序，不是排序
arr.sort((a,b)=>a-b);// 升序，return 大于 0 的值，a b互换，小于 0 不换
arr.splice(startIndex,length,'替换或插入的值 ?可选');// 起始下标，截取的长度，返回剪切的 [数组]
```

## 不改变原数组

```js
arr.concat('12',[2]);// 拼接数字或字符，返回新数组
arr.slice(startIndex,endIndex);// 截取开始下标，结束下标 -1
arr.join("-");// 返回以标识符连接字符串
arr.toString();// 返回数组的字符串
arr.indexOf('2');// 查找数值在数组的位置，有返回下标，没有返回 -1
Array.isArray([]);// 传入的参数是否是数组，是返回 true
```

## 数组迭代

```js
arr.every((items,i,arr)=>{return 条件});// 条件每一项为 true，全部符合条件才为 true
arr.some((items,i,arr)=>{return 条件});// 条件有一项为 true，则为 true
arr.filter((items,i,arr)=>{return 条件});// 返回符合条件的值，组成数组返回，没有符合返回空[]
arr.forEach((items,i,arr)=>{});// 遍历
arr.map((items,i,arr)=>{return val*2});// 遍历每一项，组成新数组返回

// 归并 
arr.reduce(function(prev,cur,index,array){
  // prev 为此方法 return 的值，初始为数组的第一项
  // cur 为数组的下一项
  // index 下标
  // array 数组本身
  return prev + cur ; 
})
// arr.reduceRight 与 reduce 是一样的，从右边开始遍历
```

- reduce 计算数组总和
```js
[1,2,3].reduce(function(prev,next) {
  return prev + next
})
```
- 利用 reduce 第二个参数，计算对象下某个值的总和
```js
var arr = [{a: 1},{a: 2},{a: 3}];
arr.reduce(function(prev,next) {
  return prev + next.a
},0)
```
如果没有 reduce 第二个参数，prev 初始值会是数组的第一项，设置初始值为 0 与下一项累加即可

## 类数组

```js
var obj = {
  "0" : "12",
  "1" : 21,
  "2" : "122",
  length : 1,
  splice : Array.prototype.splice,
}
console.log(obj); // 控制台会输出数组形式的数据，js 中的数组也是重写了 Object 的原型
```

条件:
1. 键为 0 1 2 3 的数字字符串（数组 0 1 2 也会被默认调用 tostring 以字符串存储为键）
2. 有 length 属性
3. 绑定 splice 为 Array 原型上的方法
  此时输出的 obj 为数组