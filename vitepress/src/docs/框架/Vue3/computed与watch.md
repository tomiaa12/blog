# vue computed 计算属性与 watch 监听

## computed
- 只有 get，使用回调 

```js
const name = computed(() => obj.name + obj.age)
```

- get，set方法 name1 执行 set 时调用

```js
const name1 = computed({
 get: () => obj.name + obj.age,
 set: val => {obj.name = val}
})
```
## watch 监听对象
```js
watch(obj,newVal => {
 console.log(newVal);
}, {
 immediate: true, // 是否在初始化的时候就执行一次，默认 false
 deep: true,    // 深监听，默认 false
})
const one = ref('')
/* 监听一个数据 */
watch(one, value => {
 console.log(value)
})
```

- watch多个数据:

 使用数组来指定

 ref 对象, 直接指定

 reactive 对象必须通过函数返回

```js
watch([() => obj.name, () => obj.age, one], (values) => {
 console.log('监视多个数据', values)
})
```

 回调中使用到的数据会自动监视

 默认初始化执行一次，不需要设置 immediate

```js
watchEffect(() => {
 let a = obj.name + obj.age;
})
```