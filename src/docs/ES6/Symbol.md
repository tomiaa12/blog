# JavaScript ES6 Symbol 对象

符号本身是原始类型，所以typeof 操作符对符号返回symbol。

```js
let sym = Symbol();
console.log(typeof sym); // symbol
```

## 声明

1. 原始数据类型，不能使用new
2. 括号内是备注的意思，独一无二的值，两个 Symbol 不相等
3. typeof 检测为 Symbol
4. 作为对象的键名独一无二、使用 [] 设置/获取，不能用.运算符获取设置
5. 作为对象属性名是，是共有属性，不是私有属性，可以在类的外部访问
6. 不能被枚举 for in、for of、Object.keys()、Object.getOwnPropertyNames() 返回
7. 可以被 Object.getOwnPropertySymbols() 和 Reflect.ownKeys() 取到

```js
let sy = Symbol('name');// 不能用 new 命令,参数是备注
Symbol("KK") == Symbol("KK") // false
typeof Symbol("KK"); // 'symbol'
```

作为属性名

```js
let sy = Symbol('name');
var obj = {}; // 设置symbol属性
obj[sy] = 'kk'; 

// 获取
obj.sy // undefined 不能使用.运算符获取
obj[sy] // kk
```

为了避免创建符号包装对象，Symbol()函数不能与new 关键字一起作为构造函数使用。
```js
let myBoolean = new Boolean();
console.log(typeof myBoolean); // "object"

let myString = new String();
console.log(typeof myString); // "object"

let myNumber = new Number();
console.log(typeof myNumber); // "object"

let mySymbol = new Symbol(); // TypeError: Symbol is not a constructor
```

如果要包装对象
```js
let mySymbol = Symbol();
let myWrappedSymbol = Object(mySymbol);
console.log(typeof myWrappedSymbol); // "object"
```

- 全局符号注册表
第一次调用会检查全局的注册表，不存在则生成新的符号添加到注册表，存在则会直接返回对于的。
```js
let fooGlobalSymbol = Symbol.for('foo'); // 创建新符号
let otherFooGlobalSymbol = Symbol.for('foo'); // 重用已有符号
```
与Symbol()定义的符号也并不等同
```js
let localSymbol = Symbol('foo');
let globalSymbol = Symbol.for('foo');
console.log(localSymbol === globalSymbol); // false
```
Symbol.for()的任何值都会被转换为字符串
```js
let emptyGlobalSymbol = Symbol.for();
console.log(emptyGlobalSymbol); // Symbol(undefined)
```
Symbol.keyFor()来查询全局注册表
```js
// 创建全局符号
let s = Symbol.for('foo');
console.log(Symbol.keyFor(s)); // foo
// 创建普通符号
let s2 = Symbol('bar');
console.log(Symbol.keyFor(s2)); // undefined
// 如果传给Symbol.keyFor()的不是符号，则该方法抛出TypeError：
Symbol.keyFor(123); // TypeError: 123 is not a symbol
```

计算属性语法中使用符号作为属性：
```js
let s1 = Symbol('foo'),
  s2 = Symbol('bar'),
  s3 = Symbol('baz'),
  s4 = Symbol('qux');
Object.defineProperties({
  [s1]: 'foo val',
  
}, {
[s3]: {value: 'baz val'},
[s4]: {value: 'qux val'}
});
console.log(o);
// {Symbol(foo): foo val, Symbol(bar): bar val,
// Symbol(baz): baz val, Symbol(qux): qux val}
```

如果没有保存Symbol的引用，需要遍历才能找到：
```js{2,3}
let o = {
  [Symbol('foo')]: 'foo val',
  [Symbol('bar')]: 'bar val'
};
console.log(o);
// {Symbol(foo): "foo val", Symbol(bar): "bar val"}
let barSymbol = Object.getOwnPropertySymbols(o)
.find((symbol) => symbol.toString().match(/bar/));
console.log(barSymbol);
// Symbol(bar)
```

## Symbol.for()

```js
var sy = Symbol('a');
console.log(Symbol.for('a'));; // Symbol(a)
```

1. 全局搜索是否存在该名称
2. 有：返回本身，没有：新建一个返回
3. 使两个 Symbol 类型的变量相等，生成同一个 Hash 值

```js
Symbol("Yellow") === Symbol.for("Yellow");   // false
Symbol.for("Yellow") === Symbol.for("Yellow");   // true
```

## Symbol.keyFor(sym)

1. 查找键值的某个 Symbol
2. 找到返回该 Symbol 的 key 值，字符串类型。否则 undefined

```js
var globalSym = Symbol.for("foo");// 创建一个全局 Symbol
Symbol.keyFor(globalSym); // "foo"

var localSym = Symbol();
Symbol.keyFor(localSym); // undefined，

// 以下Symbol不是保存在全局Symbol注册表中
Symbol.keyFor(Symbol.iterator) // undefined
```

### Symbol.asyncIterator

该方法返回对象默认的 AsyncIterator 由 for-await-of 语句使用。

```js
class Foo {
  async *[Symbol.asyncIterator]() {}
}
let f = new Foo();
console.log(f[Symbol.asyncIterator]());
// AsyncGenerator {<suspended>}
```

技术上来说，由Symbol.asyncIterator 函数生成的对象应该通过next()方法陆续返回
Promise 实例。

也可以隐式通过异步生成器函数返回：

```js
class Emitter {
  constructor(max) {
    this.max = max;
    this.asyncIdx = 0;
  }
  async *[Symbol.asyncIterator]() {
    while(this.asyncIdx < this.max) {
      yield new Promise((resolve) => resolve(this.asyncIdx++));
    }
  }
}
async function asyncCount() {
  let emitter = new Emitter(5);
  for await(const x of emitter) { // next 调用后的 value
    console.log(x);
  }
}
asyncCount();
// 0
// 1
// 2
// 3
// 4
```

### Symbol.hasInstance

ECMAScript 规范，这个符号作为一个属性表示“一个方法，传入对象返回该对象是否是它的实例。

instanceof 操作符可以用来确定一个对象实例的原型链上是否有原型。
```js
class Bar {}
let b = new Bar();
console.log(b instanceof Bar); // true
```

ES6 中，instanceof 操作符会使用Symbol.hasInstance 函数来确定关系
```js
class Bar {}
let b = new Bar();
console.log(Bar[Symbol.hasInstance](b)); // true
```

Baz 继承了 Bar 并覆写了 Symbol.hasInstance，instanceof 操作符也会在原型链上寻找这个属性，所以说就就跟在原型链上寻找其他属性一样，这里重新定义了这个函数

```js{3-5,10-11}
class Bar {}
class Baz extends Bar {
  static [Symbol.hasInstance]() {
    return false;
  }
}
let b = new Baz();
console.log(Bar[Symbol.hasInstance](b)); // true
console.log(b instanceof Bar); // true
console.log(Baz[Symbol.hasInstance](b)); // false 调用 Baz 覆写后的 Symbol.hasInstance
console.log(b instanceof Baz); // false 同上，返回的值是转换为 Boolean
```

### Symbol.isConcatSpreadable

- ECMAScript 规范，这个符号作为一个属性表示“一个布尔值”
- 默认情况下则对象应该用Array.prototype.concat()展开数组元素
- 如果是true，则被忽略

```js
let initial = ['foo'];
let array = ['bar'];
console.log(array[Symbol.isConcatSpreadable]); // undefined
console.log(initial.concat(array)); // ['foo', 'bar']
array[Symbol.isConcatSpreadable] = false;
console.log(initial.concat(array)); // ['foo', Array(1)]

let arrayLikeObject = { length: 1, 0: 'baz' };
console.log(arrayLikeObject[Symbol.isConcatSpreadable]); // undefined
console.log(initial.concat(arrayLikeObject)); // ['foo', {...}]
arrayLikeObject[Symbol.isConcatSpreadable] = true;
console.log(initial.concat(arrayLikeObject)); // ['foo', 'baz']

let otherObject = new Set().add('qux');
console.log(otherObject[Symbol.isConcatSpreadable]); // undefined
console.log(initial.concat(otherObject)); // ['foo', Set(1)]
otherObject[Symbol.isConcatSpreadable] = true;
console.log(initial.concat(otherObject)); // ['foo']
```

### Symbol.iterator

- ECMAScript 规范，这个符号作为一个属性表示“一个方法，该方法返回对象默认的迭代器，由 for-of 语句使用”
- for-of 循环时，会调用以 Symbol.iterator 为键的函数，并默认这个函数会返回一个实现迭代器API 的对象。
- 很多时候，返回的对象是实现该 API 的 Generator：

```js
class Foo {
  *[Symbol.iterator]() {}
}
let f = new Foo();
console.log(f[Symbol.iterator]());
// Generator {<suspended>}
```

Symbol.iterator 返回的对象可以通过next()方法陆续返回值。也可以隐式地通过生成器函数返回：
```js{6}
class Emitter {
  constructor(max) {
    this.max = max;
    this.idx = 0;
  }
  *[Symbol.iterator]() {
    while(this.idx < this.max) {
      yield this.idx++;
    }
  }
}
function count() {
  let emitter = new Emitter(5);
  for (const x of emitter) {
    console.log(x);
  }
}
count();
// 0
// 1
// 2
// 3
// 4
```

### Symbol.match

- ECMAScript 规范，这个符号作为一个属性表示“一个正则表达式方法，该方法用正则表达式去匹配字符串。由String.prototype.match()方法使用”
- String.prototype.match() 会调用以 Symbol.match 为键的函数来正则求值
- 正则表达式的原型上就有 Symbol.match 这个函数

```js
console.log(RegExp.prototype[Symbol.match]);
// ƒ [Symbol.match]() { [native code] }
console.log('foobar'.match(/bar/));
// ["bar", index: 3, input: "foobar", groups: undefined]
```

match 方法传入非正则表达式会被转为 RegExp 对象，如果要改变默认行为，需要重新定义 Symbol.match 函数。

Symbol.match接收一个参数，就是调用 match() 方法之前的字符串实例。

```js{2-4,12-14}
class FooMatcher {
  static [Symbol.match](target) {
    return target.includes('foo');
  }
}
console.log('foobar'.match(FooMatcher)); // true
console.log('barbaz'.match(FooMatcher)); // false
class StringMatcher {
  constructor(str) {
    this.str = str;
  }
  [Symbol.match](target) {
    return target.includes(this.str);
  }
}
console.log('foobar'.match(new StringMatcher('foo'))); // true
console.log('barbaz'.match(new StringMatcher('qux'))); // false
```


### Symbol.replace

- 这个符号作为一个属性表示“一个正则表达式方法，该方法替换一个字符串中匹配的子串。由String.prototype.replace()方法使用”
- String.prototype.replace() 会调用 Symbol.replace 为键的方法来正则求值
- 正则表达式原型上也有 Symbol.replace

```js
console.log(RegExp.prototype[Symbol.replace]);
// ƒ [Symbol.replace]() { [native code] }
console.log('foobarbaz'.replace(/bar/, 'qux'));
// 'fooquxbaz'
```

这个方法传入非正则表达式值会导致该值被转换为RegExp 对象，可以重新定义Symbol.replace 函数取代默认对正则表达式求值的行为。

Symbol.replace 函数接收两个参数，即调用replace()方法的字符串实例和替换字符串
```js{2-4,11-13}
class FooReplacer {
  static [Symbol.replace](target, replacement) {
    return target.split('foo').join(replacement);
  }
}
console.log('barfoobaz'.replace(FooReplacer, 'qux')); // "barquxbaz"
class StringReplacer {
  constructor(str) {
    this.str = str;
  }
  [Symbol.replace](target, replacement) {
    return target.split(this.str).join(replacement);
  }
}
console.log('barfoobaz'.replace(new StringReplacer('foo'), 'qux')); // "barquxbaz"
```
### Symbol.search

- ECMAScript 规范，这个符号作为一个属性表示“一个正则表达式方法，该方法返回字符串中匹配正则表达式的索引。由String.prototype.search()方法使用”
- String.prototype.search() 会调用 Symbol.search 为键的方法来正则求值
- 正则表达式原型上也有 Symbol.search

```js
console.log(RegExp.prototype[Symbol.search]);
// ƒ [Symbol.search]() { [native code] }
console.log('foobar'.search(/bar/)); // 3
```
search 方法传入非正则表达式值会被转换为 RegExp 对象，重新定义Symbol.search 函数以取代默认对正则表达式求值的行为

Symbol.search 函数接收一个参数，就是调用search()方法

```js{2-4,13-15}
class FooSearcher {
  static [Symbol.search](target) {
    return target.indexOf('foo');
  }
}
console.log('foobar'.search(FooSearcher)); // 0
console.log('barfoo'.search(FooSearcher)); // 3
console.log('barbaz'.search(FooSearcher)); // -1
class StringSearcher {
  constructor(str) {
    this.str = str;
  }
  [Symbol.search](target) {
    return target.indexOf(this.str);
  }
}
console.log('foobar'.search(new StringSearcher('foo'))); // 0
console.log('barfoo'.search(new StringSearcher('foo'))); // 3
console.log('barbaz'.search(new StringSearcher('qux'))); // -1
```
### Symbol.species

- ECMAScript 规范，这个符号作为一个属性表示“一个函数值，该函数作为创建派生对象的构造函数”。

```js{3-5,19}
class Bar extends Array {}
class Baz extends Array {
  static get [Symbol.species]() {
    return Array;
  }
}
let bar = new Bar();
console.log(bar instanceof Array); // true
console.log(bar instanceof Bar); // true
bar = bar.concat('bar');
console.log(bar instanceof Array); // true
console.log(bar instanceof Bar); // true

let baz = new Baz();
console.log(baz instanceof Array); // true
console.log(baz instanceof Baz); // true
baz = baz.concat('baz');
console.log(baz instanceof Array); // true
console.log(baz instanceof Baz); // false
```

刚看到这有点懵，看下面例子：
```js
class MyArr extends Array{}
const a = new MyArr(1,2,3)
const b = a.map(item => item+1)
b instanceof MyArr // true
```
1. MyArr 继承 Array，a 是 MyArr 构造的实例，b 又是 a 实例衍生的对象。
2. 按道理说 b 应该是 Array 构造出来的实例，但实际上 MyArr 构造的实例（instanceof 返回 true 说明 b 原型链上存在 MyArr）
3. 而 Symbol.species 属性就是为了解决这个问题而提供的：
```js
class MyArray extends Array {
  static get [Symbol.species]() { return Array; }
}
const a = new MyArray(1, 2, 3);
const b = a.filter(x => x < 5);
b instanceof Array // true
b instanceof MyArray // false
```
这样，衍生出来的 b 则不是 MyArray 构造出来的了，而是 return 返回 Array 的实例

### Symbol.split

- ECMAScript 规范，这个符号作为一个属性表示“一个正则表达式方法，方法匹配正则的索引位置拆分字符串。由String.prototype.split()方法使用”。
- String.prototype.split()方法会使用以Symbol.split 为键的函数来对正则表达式求值
- 正则表达式原型上也有 Symbol.split

```js
console.log(RegExp.prototype[Symbol.split]);
// ƒ [Symbol.split]() { [native code] }
console.log('foobarbaz'.split(/bar/));
// ['foo', 'baz']
```

Symbol.split 第一个参数就是调用match()方法的字符串实例。

```js{2-4,11-13}
class FooSplitter {
  static [Symbol.split](target) {
    return target.split('foo');
  }
}
console.log('barfoobaz'.split(FooSplitter)); // ["bar", "baz"]
class StringSplitter {
  constructor(str) {
    this.str = str;
  }
  [Symbol.split](target) {
    return target.split(this.str);
  }
}
console.log('barfoobaz'.split(new StringSplitter('foo'))); // ["bar", "baz"]
```

### Symbol.toPrimitive

- ECMAScript 规范，这个符号作为一个属性表示“一个方法，该方法将对象转换为相应的原始值。由ToPrimitive 抽象操作使用”
- 很多内置操作都会尝试强制将对象转换为原始值，包括字符串、数值和未指定的原始类型
- 重写 Symbol.toPrimitive 属性上的方法可以改变默认行为：
```js{8-18}
class Foo {}
let foo = new Foo();
console.log(3 + foo); // "3[object Object]"
console.log(3 - foo); // NaN
console.log(String(foo)); // "[object Object]"
class Bar {
  constructor() {
    this[Symbol.toPrimitive] = function(hint) {
      switch (hint) {
        case 'number':
          return 3;
        case 'string':
          return 'string bar';
        case 'default':
        default:
          return 'default bar';
      }
    }
  }
}
let bar = new Bar();
console.log(3 + bar); // "3default bar"
console.log(3 - bar); // 0
console.log(String(bar)); // "string bar"
```

### Symbol.toStringTag

- ECMAScript 规范，这个符号作为一个属性表示“一个字符串，该字符串用于创建对象的默认字符串描述。由内置方法Object.prototype.toString()使用”。
- toString()获取对象标识时，会查找 Symbol.toStringTag 指定的实例标识符，默认为"Object"。
```js
let s = new Set();
console.log(s); // Set(0) {}
console.log(s.toString()); // [object Set]
console.log(s[Symbol.toStringTag]); // Set
```
内置类型已经定义了 Symbol.toStringTag 属性，但自定义类需要自己定义：
```js{8,13-14}
class Foo {}
let foo = new Foo();
console.log(foo); // Foo {}
console.log(foo.toString()); // [object Object]
console.log(foo[Symbol.toStringTag]); // undefined
class Bar {
  constructor() {
    this[Symbol.toStringTag] = 'Bar';
  }
}
let bar = new Bar();
console.log(bar); // Bar {}
console.log(bar.toString()); // [object Bar]
console.log(bar[Symbol.toStringTag]); // Bar
```

### Symbol.unscopables
- ECMAScript 规范，这个符号作为一个属性表示“一个对象，该对象所有的以及继承的属性，都会从关联对象的with 环境绑定中排除”
- 让对应的属性值的键为 true，就可以阻止改属性出现在 with 中
```js{5-7}
let o = { foo: 'bar' };
with (o) {
  console.log(foo); // bar
}
o[Symbol.unscopables] = {
  foo: true
};
with (o) {
  console.log(foo); // ReferenceError
}
```