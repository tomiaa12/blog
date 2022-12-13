# Vuex 状态管理

- state：储存状态
- getters：获取状态
  - 两个参数: state 状态，getter 本身 调用方法传入参数可以使用闭包
- mutation：修改状态 -- 方法名应单独使用文件定义为产量
  - 两个参数: state 状态, commit 提交的参数
  - 通过 commit 提交修改 commit('修改状态的方法',参数)
    必须为同步操作，异步需要在 action 中进行后 context.commit 提交
  - commit：参数为对象时提交 payload 为 commit 的对象
  - `store.commit({ type: 'increment', amount: 10 })`
    ​ - `increment (state, payload) { state.count += payload.amount }`
- action：异步操作
  - `$store.dispatch('调用action方法',参数)`
  - 一个参数：context 指向 $store ---> 使用 context.commit 提交修改
  - 使用`{commit}`接参就是 context 内的提交方法
- modules：模块
  - 模块定义 state 状态 获取属性 $store.state.模块名.属性
  - getters 三个参数: state 状态，getter 本身，rootState 根的状态
  - action 内 context 对应的是当前模块的上下文，包含 context.rootGetter 为根的方法，rootState 根的状态

## 辅助函数

1、 mapState, mapGetters 写在 computed 里面, mapMutations，mapActions 则是在 methods 方法内

2、 [函数名/属性名] 映射相同名字或方法 修改名字需要{}形式 ,key 为键,值为对应的方法

3、 调用辅助函数返回对象，...展开后可以添加其他方法

4、 返回的数据只是作为映射，方法/计算属性需要传参需要调用（传参）

引入

```js
import { mapState,mapGetters,mapMutations,mapActions } from 'vuex';
computed : {
  ...mapGetters(['ride']),
  ...mapState({
​    arrNum : 'num',
  })
},
methods: {
  ...mapMutations({ square:SQUARE}),// 修改名字为square映射
  ...mapActions( {addnum:ADDNUM}),
}
```

传参

```html
{{ ride(3) }}

<button @click="addnum(3)">mapAction</button>
```

## 命名空间

模块 namespaced 开启

```js
modules: {
  aa : {
​    namespaced : true // 开启命名空间
  }
}
```

第一种

```js
import {createNamespacedHelpers} from 'vuex'; // 引入
const {mapState} = createNamespacedHelpers('命名空间名') // 创建
computed : {
  ...mapState['状态名']
}
```

第二种

```js
import {mapState} from 'vuex';
computed : {
  ...mapState['命名空间名',['状态名']]
}
```
