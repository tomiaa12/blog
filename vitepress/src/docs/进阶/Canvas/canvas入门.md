# canvas 入门
```html
<canvas id="canvas" width="600" height="400">不支持canvas会显示这条内容 </canvas>
```

```js
/* * @type {HTMLCanvasElement} */
// vscode 添加这行注释可以开始代码提示

let canvas = document.getElementById('canvas');
// 检测是否支持
if(canvas.getContext){
  // 获取上下文
  var ctx=canvas.getContext("2d")
}
```

## 属性方法

- strokeStyle  设置或返回描边颜色
- fillStyle   设置或返回填充颜色
- stroke()    描边已定义绘图（路径）
- fill()     填充当前绘图（路径）
- moveTo(x,y)  把路径移动到画布中的指定点，不创建线条。
- lineTo(x,y)   添加一个新点,绘制一条从当前位置到指定新点(x,y)位置的直线。
- lineWidth   设置或返回当前的线条宽度
- lineJoin   设置或返回两条线相交时，所创建的拐角类型
- lineCap   设置或返回线条的结束端点样式
- beginPath() 新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。生成路径的第一步叫做beginPath()。
- closePath()  闭合路径之后图形绘制命令又重新指向到上下文中。不是必需的。

## 案例

划线

```js
ctx.strokeStyle="red"
ctx.moveTo(10,10)
ctx.lineTo(100,100)
ctx.lineTo(200,50)
ctx.lineTo(300,350)

ctx.lineWidth="5"
ctx.lineCap="round"
ctx.lineJoin="round"

ctx.closePath()
ctx.stroke()
```