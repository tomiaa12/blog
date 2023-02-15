# JavaScript Math 数学对象-数据类型

## 最大最小值

```js
Math.max(1,3,4,5,9) // 最大值
Math.min(1,3,4,5,9) // 最小值
Math.max.apply(Math,[2,3,6]) // 最大值
Math.min.apply(Math,[2,3,6]) // 最小值
```

## 舍入

```js
Math.ceil(1.3) // 向上舍入
Math.floor(1.9) // 向下舍入
Math.round(1.49) // 1 四舍五入（只看小数点后一位数）
Math.floor(Math.random() * 10 + 1)  
// 随机一个 [A - B] 之间的随机数
function selectFrom(A,B){
  return Math.floor(Math.random() * (B - A + 1) + A)
}
selectFrom(2,9);// 生成 2-9（包括 2 和 9）的随机数
```

## 其他方法

```js
var num = -2.4;
Math.abs(num);// 绝对值
Math.exp(num);// 返回 Math.E 的 num 次幂
Math.log(num);// 自然对数
Math.pow(num,p);// num 的 p次幂
Math.sqrt(num);// num的平方根
Math.PI();// 表示数学中的 π 代表的是 180 的弧度
1弧度 = Math.PI() / 180；
----下面的方法传入的值要是弧度，不能传数字----
Math.acos(x);// x 的反余弦值
Math.asin(x);// x 的反正弦值
Math.atan(x);// 反正切值
Math.atan2(x,y)// y/x 的反正切值
Math.cos(x)// x 的余弦值
Math.sin(x)// x 的正弦值
Math.tan(x)// x 的正切值
-------------------------
Math.cbrt(1); // 1  计算一个数的立方根
Math.cbrt('1'); // 1 会对非数值进行转换
Math.imul(1, 2);  // 2 大多数情况下，与 a*b 相同
```

## ES6 扩展方法

```js
// Math.trunc 方法用于去除一个数的小数部分，返回整数部分。
// 隐式调用 Number 方法
Math.trunc(4.1) // 4
Math.trunc(-4.9) // -4
Math.trunc('123.456') // 123
Math.trunc(false) // 0
Math.trunc(null) // 0
// Math.sign 方法用来判断一个数到底是正数、负数、还是零。
/* 参数为正数，返回 +1；
 * 参数为负数，返回 -1；
 * 参数为 0，返回 0；
 * 参数为 -0，返回 -0;
 * 其他值，返回 NaN。 
 */
Math.sign(5) // +1
Math.sign(0) // +0
Math.sign(-0) // -0
Math.sign(NaN) // NaN
```