# JavaScript 原生 touch

## 事件

- touchstart：手指按下
- touchmove：手指移动
- touchend：手指抬起

PC 端事件，比移动端事件略慢，大概慢 300ms

- 点透问题：

  - 在 300ms 之内，如果上层元素消失或隐藏，目标就会漂移到下层元素身上，就会触发点击行为。

- 解决办法：

  - 下层元素不要使用有点击特性的元素

## 事件对象

ev 不需要兼容

ev 主要使用的3个属性：

- touches: 所有在屏幕上的手指的一个列表
- targetTouches: 当前在目标元素上的手指的列表
- changedTouches: 当前在目标元素上发生变化（触发当前事件）的手指的列表 最常用
  - clientX: 事件触发到可视区左边的距离
  - clientY:事件触发到可视区上边的距离
  - identifier: 标识符 第几个手指 0-n
  - pageX: 事件触发到页面的左边的距离
  - pageY: 事件触发到页面的上边的距离
  - radiusX: x 轴的旋转半径
  - radiusY: y 轴的旋转半径
  - rotationAngle: 旋转角度 deg
  - screenX: 事件触发到屏幕的左边距离
  - screenY: 事件触发到屏幕的上边距离