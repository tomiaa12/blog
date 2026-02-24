# JavaScript ES6 Object 对象

## 简写

### 对象简写

```js
const age = 12;
const name = "Amy";
const person = {age, name}; // {age: 12, name: "Amy"}
// 等同于 person = {age: age, name: name}
```

### 方法简写

```js
const person = {
 sayHi(){
  console.log("Hi");
 }
}
```

::: tip Generator 函数，要在前面加星号
```js
const obj = {
 * myGenerator() {
  yield 'hello world';
 }
};
```
:::

### 属性名表达式

-  [变量]

```js
let a="aaa";
let obj={
  [a]: "bbb"
}

const obj = {
 ["he"+"llo"](){
  return "Hi";
 }
}
obj.hello(); // "Hi"
```

## 合并对象

```js
let age = {age: 15};
let name = {name: "Amy"};
let person = {...age, ...name}; // {age: 15, name: "Amy"}
```
:::tip 注意
如果两个对象有同名的属性会被覆盖（数组也是同理）
:::

### Object.assign()

```js
Object.assign(target, source_1, ···) 
```

将后面所有可枚举的属性赋值到target对象中。重复的值会覆盖

```js
let target = {a: 1};
let object2 = {b: 2};
let object3 = {c: 3};
Object.assign(target,object2,object3); // {a: 1, b: 2, c: 3}
// 第一个参数是目标对象，后面的参数是源对象
```

只有一个参数不是对象，也会转换为对象返回

```js
Object.assign(3); // Number {3}
```

第一个参数时 null 或 undefined 会报错

```js
Object.assign(null); // TypeError: Cannot ...
```

null 和 undefined 放第二个之后会跳过

```js
Object.assign(1,undefined); // Number {1}
// 注意： assign 的属性拷贝是浅拷贝
let sourceObj = { a: { b: 1}};
let targetObj = {c: 3};
Object.assign(targetObj, sourceObj);
targetObj.a.b = 2; // 原始值修改
sourceObj.a.b; // 2 已经拷贝的值也会跟着变
```

同名属性会被替换

```js
targetObj = { a: { b: 1, c:2}};
sourceObj = { a: { b: "hh"}};
Object.assign(targetObj, sourceObj);// {a: {b: "hh"}}
```

数组的处理

```js
Object.assign([2,3], [5]); // [5,3] 下标0被覆盖
```

## 链判断运算符

```js
const firstName = message?.body?.user?.firstName || 'default';
const fooValue = myForm.querySelector('input[name=foo]')?.value
// 如果左侧的值为 null或undefined 则不再往下运算
iterator.return?.() // 判断方法是否存在
```

### 三种用法

```js
a?.b
// 等同于
a == null ? undefined : a.b

a?.[x]
// 等同于
a == null ? undefined : a[x]

a?.b()
// 等同于
a == null ? undefined : a.b()

a?.()
// 等同于
a == null ? undefined : a()
```
