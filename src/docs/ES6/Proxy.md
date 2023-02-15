# JavaScript ES6 Proxy

- target：即目标对象
- handler：是一个对象，代理 target 的指定行为

```js
let proxy = new Proxy(target, handler)
let target = {
  name: 'Tom',
  age: 24
}

let handler = { 
  get: function(target, key) { // 获取target的值会触发次函数
    console.log('getting '+ key);
    return target[key]; // 不是target.key
  },
  set: function(target, key, value) {// 设置target的值会触发次函数
    console.log('setting '+ key);
    target[key] = value;
  }
}
```
