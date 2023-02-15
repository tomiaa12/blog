# JavaScript ES6 Generator 函数

- 执行机制
1. function 后加 *，函数执行后返回 Iterator 对象
2. 返回的对象调用 next 方法开始执行，遇到 yield 关键字会停止。
3. 再次调用 next 方法会从上一次的结束的地方继续执行，直到 yield
4. yield 后面的值会在 next 执行停止时返回
5. next 传的参数会在函数内传给 yield

```js
function* fnc(){
 console.log("开始");
 let a = yield '返回给next'; // next 没有传参 a 默认 undefined
 console.log(a,"结束");// next传入 '结束'
 return '2';
}
let f = fnc();
f.next('next传入');// {value: "返回给 next", done: false}
f.next();// {value: undefined, done: true}
```
