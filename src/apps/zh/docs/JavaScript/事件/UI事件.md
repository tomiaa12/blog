# JavaScript UI 事件

| 属性/方法         | 类型     | 说明                                              |
| ----------------- | -------- | ------------------------------------------------- |
| bubbles           | Boolean  | 事件是否冒泡                                      |
| stopPropagation() | Function | Firefox chrome 取消捕捉/冒泡，bubbles为true       |
| cancelable        | Boolean  | IE8 chrome 取消默认行为                           |
| preventDefault()  | Function | Firefox chrome 取消默认行为。cancelable 为 true， |
|currentTarget|Element|全等 === this|
|defaultPrevented|Boolean|是否调用 preventDefalt()|
|detail|integer|Firefox 滚动滚轮相关信息 |
|eventPhase|integer|调用事件处理程序阶段：1 表示捕捉阶段 2 表示处于目标 3 表示冒泡阶段|
|stopImmediatePropagation()|Function|取消捕捉/冒泡，同时阻止任何事件处理程序被调用|
|target|Element|当前触发的元素|
|trusted|Boolean|为 true 表示事件是浏览器生成的，false 表示 js 生成写的|
|type|String|被触发事件的类型|
|view|AbstractView|与事件关联的抽象视图。等同于发生事件的 window 对象|