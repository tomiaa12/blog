# JavaScript ES6 String 字符串新增方法

## 模板字面量

```js
console.log(`Hello, ${ `World` }!`); // Hello, World!
```
所有插入的值都会使用toString()强制转型为字符串：
```js
let foo = { toString: () => 'World' };
console.log(`Hello, ${ foo }!`); // Hello, World!
```
也可以插入自己之前的值：
```js
let value = '';
function append() {
  value = `${value}abc`
  console.log(value);
}
append(); // abc
append(); // abcabc
append(); // abcabcabc
```

## 标签函数
```js
let a = 6;
let b = 9;
function simpleTag(strings, ...expressions) {
  console.log(strings);
  for(const expression of expressions) {
    console.log(expression);
  }
  return 'foobar';
}
let taggedResult = simpleTag`${ a } + ${ b } = ${ a + b }`;
// ["", " + ", " = ", ""]
// 6
// 9
// 15
console.log(taggedResult); // "foobar"
```
标签函数的表达式参数的个数始终是n，传给标签函数的第一个参数所包含的字符串个数则始终是n+1。返回正常的字符串结果：
```js
let a = 6;
let b = 9;
function zipTag(strings, ...expressions) {
  return strings[0] +
  expressions.map((e, i) => `${e}${strings[i + 1]}`)
  .join('');
}
let untaggedResult = `${ a } + ${ b } = ${ a + b }`;
let taggedResult = zipTag`${ a } + ${ b } = ${ a + b }`;
console.log(untaggedResult); // "6 + 9 = 15"
console.log(taggedResult); // "6 + 9 = 15"
```
## 字符串原始值
```js
console.log(`\u00A9`); // © 是版权符号
console.log(String.raw`\u00A9`); // \u00A9

console.log(`first line\nsecond line`); // 换行符示例
// first line
// second line
console.log(String.raw`first line\nsecond line`); // "firstline\nsecond line"

// 实际的换行符不行
console.log(String.raw`first line
second line`);
// first line
// second line
```
通过标签函数的第一个参数取得原始值：
```js
function printRaw(strings) {
  console.log('字面量：');
  for (const string of strings) {
    console.log(string);
  }
  console.log('原始值：');
  for (const rawString of strings.raw) {
    console.log(rawString);
  }
}
printRaw`\u00A9${ 'and' }\n`;
// 字面量：
// ©
//（换行符）
// 原始值：
// \u00A9
// \n
```

## 识别查找

```js
// 传入正则会抛出错误

includes() // 返回布尔值，判断是否找到参数字符串。
startsWith() // 返回布尔值，判断参数字符串是否在原字符串的头部。
endsWith() // 返回布尔值，判断参数字符串是否在原字符串的尾部。

let string = "apple,banana,orange";
string.includes("banana");   // true
string.startsWith("apple");  // true
string.endsWith("apple");   // false
string.startsWith("banana",6) // true
```

## repeat()

repeat()：返回新字符串，将字符串重复指定次数返回。

```js
"Hello,".repeat(2); // "Hello,Hello,"
"Hello,".repeat(3.2); // "Hello,Hello,Hello," 向下取整
```

0 至 -1 之间的小数，取整得到 -0 ，等同于 repeat 零次

NaN，等同于 repeat 零次

负数或者 Infinity ，会报错:
```js
"Hello,".repeat(-0.5); // "" 
"Hello,".repeat(NaN); // "" 
```
传入字符串会隐式转换数字
```js
"Hello,".repeat("hh"); // ""
"Hello,".repeat("2"); // "Hello,Hello,"
```

## 字符串补全

padStart：返回新的字符串，从头部（左侧）补全。

padEnd：返回新的字符串，从尾部（右侧）补全。
```js
"123".padStart(10,"0"); // "0000000123" 常用于补全位数
"h".padStart(5,"o"); // "ooooh"
"h".padEnd(5,"o");  // "hoooo"
"h".padStart(5);   // "  h" 没有第二个参数默认空格
"hello".padStart(5,"A"); // "hello" 小于或等于返回原字符
"hello".padEnd(10,",world!"); // "hello,worl" 截去超出位数
```

## 去除空格

trimStart()：消除字符串头部的空格
trimEnd()：消除尾部的空格
```js
// 返回的都是新字符串，不会修改原始字符串
const s = ' abc ';
s.trim() // "abc"
s.trimStart() // "abc "
s.trimEnd() // " abc"
```
:::tip 提示
浏览器还部署了额外的两个方法，trimLeft() 是 trimStart() 的别名，trimRight() 是 trimEnd() 的别名。
:::

## 替换

matchAll()：方法返回一个正则表达式在当前字符串的所有匹配
```js
'aabbcc'.replaceAll('b', '_') // 'aa__cc'
// 返回一个新字符串，不会改变原字符串。 一次性替换所有匹配。
```
