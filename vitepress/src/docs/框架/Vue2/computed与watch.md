# Vue computed 计算属性与 watch 监听
## computed 计算属性

依赖 data 的数据改变，computed 就会刷新
```js
{{调用不需要加()}}
data : {
  a : 1 // a 改变，fn 会刷新
},
computed: {
  fn(){
    return this.a + 10;
  }
}
```
### getter，setter

计算属性默认只有 getter
```js
computed: {
  name: {
​    // getter
​    get: function () {},
​    // setter
​    set: function (newValue) {}
  }
}
// name = 'a' getter会被调用
```
## watch 侦听属性
```js
data:{name:'name',obj:{...}},
watch:{
  name (新值,旧值){},// 浅监听
  // 深监听
  obj:{
    deep:true, // deep 打开深监听
    immediate:true, // immediate 立即执行
    handler(新值){} // handler 只有新值
  }
}
```
name 发生改变时 watch 发生回调
