# Vue setup 组合式 API
## 组合式 API

```js
import {ref,onMounted,watch,toRefs,computed} from 'vue'
setup(props) {

 console.log(props); // 父传子接收的参数

 let { user } = toRefs(props); // 创建对 user 的响应式引用
 let arr = ref([]); // 创建响应式引
 let getArr = async () => {  // 异步调用 api
  arr.value = await Promise.resolve([user.value.name,Math.random() + '','asdf','qwesax','ervhf','dfdaw']);
 }

 onMounted(getArr); // 在mounted时期调用此方
 watch(user,getArr); // 当user变化调用方法
 let search = ref(''); // 创建响应式引用
 let arrSearch = computed(() =>// 计算属性 过滤
  arr.value.filter(item => item.includes(search.value))
 ); 

 return { // 返回的对象可以在模板当中直接使用
  arr:arrSearch, // 只需要搜索过滤的结果
  getArr,
  search,
 }
}
```

## setup 细节

- 执行的时机
  - 在 beforeCreate 之前执行（一次）此时组件对象还没有创建
  - this 是 undefined，不能通过 this 来访问 data/computed/methods / props
  - 所有的 composition API 相关回调函数中也都不可以
- 返回值
  - 返回一个对象：属性会与 data 合并，方法会与 methods 合并
  - 如果有重名，setup 优先
- 注意：
  - methods 中可以访问 setup 提供的属性和方法，但在 setup 方法中不能访问 data 和 methods
  - setup 不能是一个 async 函数：因为返回值不再是 return 的对象，而是 promise
- 参数
  - setup(props, {attrs, slots, emit})
  - props：接收的传值
  - attrs：相当于 this.$attrs，包含 props没有接的参数
  - slots：所有传入的插槽内容的对象，相当于 this.$slots
  - emit：用来分发自定义事件的函数，相当于 this.$emit