# JavaScript Number 数字对象-数据类型

```js
let intNum = 55; // 整数

// 八进制字面量，第一个数字必须是零（0），然后是相应的八进制数字（数值0~7）
let octalNum1 = 070; // 八进制的56
let octalNum2 = 079; // 无效的八进制值，当成79 处理
let octalNum3 = 08; // 无效的八进制值，当成8 处理

// 十六进制字面量，必须让真正的数值前缀0x（区分大小写），然后是十六进制数字（0~9 以及A~F）
let hexNum1 = 0xA; // 十六进制10
let hexNum2 = 0x1f; // 十六进制31
```

- 浮点值

科学记数法的格式跟一个大写或小写的字母e，再加上一个要乘的10 的多少次幂，浮点值的精确度最高可达17 位小数

```js
let floatNum1 = 1.1;
let floatNum2 = 0.1;
let floatNum3 = .1; // 有效，但不推荐
let floatNum1 = 1.; // 小数点后面没有数字，当成整数1 处理
let floatNum2 = 10.0; // 小数点后面是零，当成整数10 处理
let floatNum = 3.125e7; // 等于31250000
```

- 方法

```js
var num = 10;
num.toString() // '10'
num.toString(2) // 2 进制转换

num.toFixed(2) // 保留几位小数，最大 20 位小数
num.toExponential(1) // 1.0e+1 科学计数法
var num1 = 99;
num1.toPrecision(1)// 1e+2 向上舍入为 100
num1.toPrecision(2)// 99
num1.toPrecision(3)// 99.0
```

- NaN

分子是非0 值，分母是有符号0 或无符号0，则会返回Infinity 或-Infinity

```js
console.log(0/0); // NaN
console.log(-0/+0); // NaN
console.log(5/0); // Infinity
console.log(5/-0); // -Infinity
```
isNaN 首先会调用对象的 valueOf() 方法，然后再确定返回的值是否可以转换为数值。如果不能，再调用 toString() 方法，并测试其返回值


## Number.isFinite()

- 没有隐式的 Number() 类型转换，所有非数值都返回 false
- 检查一个数值是否为有限的（ finite ），即不是 Infinity

```js
Number.isFinite(1);  // true
Number.isFinite(0.1); // true
Number.isFinite(NaN); // false 不是有限的
```

## Number.isInteger()

- 判断一个数是不是整数

```js
Number.isInteger(0); // true
// JavaScript 内部，整数和浮点数采用的是同样的储存方法,因此 1 与 1.0 被视为相同的值
Number.isInteger(1);  // true
Number.isInteger(1.0); // true
```

## 数值转换
- null，返回0。
- undefined，返回NaN。
- 字符串：
  - Number("1")返回1，Number("123")返回123，Number("011")返回11
  - 浮点数同样忽略前面的 0
  - 16 进制转换为对应的 10 进制整数值
- 对象，调用valueOf()方法，再执行上面的规则。如果是NaN，则调用toString()方法，再按照字符串的规则转换。
```js
  let num1 = Number("Hello world!"); // NaN
  let num2 = Number(""); // 0
  let num3 = Number("000011"); // 11
  let num4 = Number(true); // 1
```

- parseInt()
  - 字符串最前面的空格会被忽略
  - 第一个字符不是数值、加号或减号，立即返回 NaN
```js
let num1 = parseInt("1234blue"); // 1234
let num2 = parseInt(""); // NaN
let num3 = parseInt("0xA"); // 10，解释为十六进制整数
let num4 = parseInt(22.5); // 22
let num5 = parseInt("70"); // 70，解释为十进制值
let num6 = parseInt("0xf"); // 15，解释为十六进制整数
```
- parseInt()也接收第二个参数，指定进制数
```js
let num = parseInt("0xAF", 16); // 175
// 提供了十六进制参数，那么字符串前面的"0x"可以省掉：
let num1 = parseInt("AF", 16); // 175
let num1 = parseInt("10", 2); // 2，按二进制解析
let num2 = parseInt("10", 8); // 8，按八进制解析
let num3 = parseInt("10", 10); // 10，按十进制解析
```

- parseFloat 解析到一个无效的浮点数值字符为止
  - 始终忽略字符串开头的零
  - 十六进制数值始终会返回 0，因为 parseFloat() 只解析十进制值
```js
let num1 = parseFloat("1234blue"); // 1234，按整数解析
let num2 = parseFloat("0xA"); // 0
let num3 = parseFloat("22.5"); // 22.5
let num4 = parseFloat("22.34.5"); // 22.34
let num5 = parseFloat("0908.5"); // 908.5
let num6 = parseFloat("3.125e7"); // 31250000