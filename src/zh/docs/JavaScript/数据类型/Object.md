# JavaScript Object 对象-数据类型

## Object.create()

```js
Object.create(prototype, [descriptors])
```

- 返回一个新对象
- 新对象的__proto__指向第一个参数。参数可以为null,即没有原型对象
- 要添加的属性以及配置

```js
var newObj=Object.create(obj,{
  sex:{// 键名
    value:"男",// 键值，默认 undefined
    writable:true,// 是否可以被修改。默认 false
    configurable:true,// 是否可以被删除。默认 false
    enumerable:true,// 是否支持可枚举(for in 访问)。默认值是 false
  }
});
```

## Object.defineProperty()

```js
Object.defineProperty(obj, [propName], descriptor) 
```

- 直接操作参数1 obj地址
- propName: 添加的键名[两个参数时 = 配置选项的 value 值]
- descriptor: 配置选项

```js
var obj = {sex1:''};

Object.defineProperties(obj,{
  sex:{
    // 也可以有 Object.create() 的配置
    set(value){// 赋值时调用
      this.sex1=value;
    },
    get(){// 获取值时调用
      return this.sex1;
    }
  }
})
```

1. 可以多次调用 Object.defineProperty() 方法修改同一个属性，但把 configurable 设置为 false 之后就会报错。
2. 当使用了 getter 或 setter 方法，不允许使用 writable 和 value 这两个属性。如果使用，会直接报错

## Object.defineProperties()
Object.defineProperties(obj, props)
- obj：要修改的对象
- props：属性值
```js
var obj = {};
Object.defineProperties(obj, {
  'property1': {
    value: true,
    writable: true
  },
  'property2': {
    value: 'Hello',
    writable: false
  }
});
```
## Object.assign()

```js
Object.assign(target, ...sources)
```

- 后面的 sources 源对象 拷贝到 target 目标对象上
- 返回 target 对象

```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };
const returned = Object.assign(target, source);

console.log(target); // Object { a: 1, b: 4, c: 5 }
console.log(returned); // Object { a: 1, b: 4, c: 5 }
```

- 会调用源对象的 [[Get]]
- 和目标对象的 [[Set]]

## Object.keys()

```js
var user ={
 name:"tom",
 age:25
}

var keys = Object.keys(user)// ['name','age'] 返回键的数组，参数可以是原型对象

// 只遍历键
for (let key of Object.keys(obj)){
  console.log(key);
}
```

## Object.values()

```js
var user ={
 name:"tom",
 age:25
}
var keys = Object.values(user) // ["tom", 25]

// 只遍历值

for(let item of Object.values(obj)){
  console.log(item);
}
```

## Object.entries()

- 遍历键和值

- 以二维数组的形式，将对象中的每个键名和键值，进行数组分解。

```js
for(let [key,item] of Object.entries(obj)){
  console.log(item,key);
}
```

## Object.getOwnPropertyNames()

```js
Object.getOwnPropertyNames(Person.prototype) // ["constructor", "name", "job", "sayName"] 返回键的数
```

包含constructor

不包含Symbol 属性

## Object.getOwnPropertySymbols()

```js
Object.getOwnPropertySymbols(obj)
// 参数：要返回 Symbol 属性的对象。
// 返回值：对象自身上找到的所有 Symbol 属性的数组。

var obj = {};
var a = Symbol("a");
var b = Symbol.for("b");

obj[a] = "localSymbol";
obj[b] = "globalSymbol";

var objectSymbols = Object.getOwnPropertySymbols(obj);
console.log(objectSymbols.length); // 2
console.log(objectSymbols)     // [Symbol(a), Symbol(b)]
console.log(objectSymbols[0])   // Symbol(a)
```

## Object.getOwnPropertyDescriptors()
返回同时包含常规和符号(symbol)属性描述符的对象，都没有则返回空对象
```js
Object.getOwnPropertyDescriptors({a:1})
/* {
  a:{
    configurable: true
    enumerable: true
    value: 1
    writable: true
  }
} */
```

## Object.is()

```js
Object.is(value1, value2);
// 比较两个值是否相等，与 == 和 === 不一样。返回 true/false

Object.is('foo', 'foo'); // true
Object.is(window, window); // true
Object.is([], []); // false

var foo = { a: 1 };
var bar = { a: 1 };
Object.is(foo, foo); // true
Object.is(foo, bar); // false
Object.is(null, null); // true

// 特例
Object.is(0, -0); // false
Object.is(0, +0); // true
Object.is(-0, -0); // true
Object.is(NaN, 0/0); // true
```

## Object.getPrototypeOf()

```js
Object.getPrototypeOf(object) // 返回参数的原型对象，没有继承属性则返回 null
Object.getPrototypeOf( Object ); // ƒ () { [native code] }
Object.getPrototypeOf( Function ); // ƒ () { [native code] }
Object.getPrototypeOf( Object ) === Function.prototype; // true

var obj = new Object();
Object.prototype === Object.getPrototypeOf( obj ); // true
Object.prototype === Object.getPrototypeOf( {} ); // true
```

## Object.freeze()

```js
Object.freeze(obj); // 返回被冻结的对象; 返回传递的对象，不是创建一个被冻结的副本
// 冻结一个对象，冻结后不能添加删除，包括配置，可枚举，可写性等;也包括原型上的属性
```

## Object.seal()

```js
Object.seal(obj); // 返回被封闭的对象的引用
// 阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要原来是可写的就可以改变。
// 不会影响从原型链上继承的属性。但 __proto__ 属性的值也会不能修改。
```

## Object.hasOwnProperty()
返回属性名是否在实例属性上
```js
const obj = {};
obj.prop = 42;
console.log(obj.hasOwnProperty('prop')); // true
console.log(obj.hasOwnProperty('toString')); // false
```

