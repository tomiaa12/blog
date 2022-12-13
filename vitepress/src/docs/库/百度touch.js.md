# JavaScript 百度 touch.js（事件、event）

## 事件

touch.on(元素，'事件(多个事件空格隔开，支持原生事件)'，'回调函数') 

- 缩放类
  - pinch：缩放手势
  - pinchstart：缩放手势起点
  - pinchend：缩放手势终点
  - pinchin：收缩
  - pinchout：放大
- 旋转类
  - rotate：旋转
  - rotateleft：向左旋转
  - rotateright：向右旋转
- 滑动类
  - swipe：滑动
  - swipestart：滑动手势起点
  - swiping：滑动中
  - swipeend：滑动手势终点
  - swipeleft：向左滑动
  - swiperight：向右滑动
  - swipeup：向上滑动
  - swipedown：向下滑动
- 拖动类
  - drag：拖动
  - dragstart：拖动开始
  - dragend：拖动结束
- 长按
  - hold
  - Tap：单击
  - doubletap：双击

## 事件委托

touch.on(父元素，'事件(多个事件空格隔开，支持原生事件)'，'子元素 css 选择器'，'回调函数')

this 指向当前触发的节点

## 事件对象
``` js
touch.on(div,'doubletap',function(e){
  e.originEvent;// 返回触发某事件的原生对象
  e.type; // 事件的名称
  e.rotation; // 旋转角度（旋转事件下）
  e.scale; // 缩放比例（缩放事件、0.5 缩小一半 2 放大 2 倍）
  e.direction; // 操作方向属性、滑动的方向
  e.fingersCount; // 操作手势的数量
  e.position; // 相关位置信息，不同操作产生不同的位置信息
  e.distance; // swipe 类两点之间的位移
  e.distanceX; // 滑动 x 轴的距离，向左移动时为负数
  e.distanceY; // 滑动 y 轴的距离，向上移动时为负数
  e.angle; // rotate 事件触发是旋转的角度
  e.duration; // touchstart 与 touchend 值的时间戳
  e.startRotate()// 方法  旋转的方法
  /* 不同的事件事件对象的信息不同，点击事件没有旋转角度等 */
})
```