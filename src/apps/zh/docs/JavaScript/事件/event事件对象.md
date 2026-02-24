# JavaScript event 事件对象

早期火狐不兼容 event 需要传参 ev
```js
var ev = ev || event;
```

- 鼠标按下/单击：mousedown，支持
  - e.button：0 左键 1 滚轮 2 右键
- 鼠标位置：鼠标事件支持
  - e.offsetX/Y：距离当前触发元素的 left/top 值
  - e.clientX/Y：可视区 left/top 值
  - e.pageX/Y：页面文档的 top/left 值
  - e.screenX/Y：屏幕左上角 left/top 值
- 热键：keydown 支持，按下为 true
  - e.shiftkey：Boolean
  - e.altKey：Boolean
  - e.ctrlKey：Boolean
  - e.metakey：windows ---> windows键，macos  ---> command键
- 键盘按下：keydown/keyup 支持
  - e.which/e.keycode：返回按下的ascll码值，不区分大小写
  - enter：13
  - shift：16
  - ctrl：17
  - alt：18
  - a：65  
  - 上下左右：37 38 39 40
- 键盘按下：keypress 仅支持字符键（DOM3 被弃用）
  - e.which/e.charCode：返回按下的 ascll 码值，区分大小写
- 滚动
  - e.wheelDelta：chrome IE 向下 -120 向上 120
  - e.datail：firefox 向下 3 向上 -3

兼容:
```js
e.wheelDalta ? e.wheelDalta < 0 : e.datail > 0 ;
// chrome是否存在 ? chrome < 0 是否向下为true : firefox < 0 是否向下
```