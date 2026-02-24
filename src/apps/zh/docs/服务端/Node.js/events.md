# Node.js events 事件监听

```js
const events = require('events');
// 需要先new构造函数
const eventsEmiter = new events();

eventsEmiter.on('aa',() => {
  console.log('自定义事件');
})

eventsEmiter.emit('aa');// 调用
eventsEmiter.once('cc',() => {
  console.log('自能调用一次后失效');
})

eventsEmiter.emit('cc');// 只能调用一次
```