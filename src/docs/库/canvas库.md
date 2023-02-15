# Canvas 常用库

## SVG

设置一个容器，svg的宽和高最好和容器的宽高一致，g元素用来包裹的，没有宽和高，不能设置，子元素有多宽g就有多宽

```html
<div id="container">
  <svg width="600" height="400">
	  <rect x="20" y="20" width="300" height="260" fill="red"> </rect>
  </svg>
</div>
```

### 绘制基本图形

rect矩形

​    x,y 绘制的坐标

​    width/hieght 矩形的宽高

​    fill 填充颜色

​    stroke 描边颜色

​    stroke-width 线宽 （canvas line-width）

​    rx ry 圆角的大小

  ```html
  <rect x="20" y="20" width="300" height="260" fill="none" stroke="blue" stroke-width="5"> </rect>
  ```

line直线

​    x1,y1 起始点 ，x2,y2  终点

​     <line x1="100" y1="100" x2="300" y2="200" stroke="blue"> </line>

polyline折线

​    points 集合

​    值的形式1："x1,y1 x2,y2 ..."

​    值的形式2："x1 y1,x2 y2,..."

    ````html
    <polyline points="20,20 40,25 60,40 80,120 120,140 200,180" stroke="blue" fill="none" />
    ````

circle圆形

​    cx,cy,r 圆心和半径

```html
<circle cx="300" cy="200" r="180" fill="red"> </circle>
```

path路径

```html
<path d="M20,30 L50 70 L80 100 L110 280 L150 20 Z" stroke="blue" fill="none"> </path>
```

### 线性渐变

linearGradient 线性渐变：

  id    唯一标识

  x1 , y1 渐变起始的位置  百分比 或者 0-1 小数

  x2,y2  渐变结束的位

```html
 <defs>
   <!-- id绑定到rect的fill上 -->
   <linearGradient id="aa" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:red" />
      <stop offset="30%" style="stop-color:blue" />
      <stop offset="70%" style="stop-color:yellow" />
      <stop offset="100%" style="stop-color:black" />         
   </linearGradient>
 </defs>
 <rect x="20" y="20" width="500" height="260" fill="url(#aa)"> </rect>
```

### 放射性渐变

radialGradient 放射性渐变：

  id   唯一标识

  cx,cy 外圆圆心位置

  r   外圆半径

  fx,fy 内圆圆心

```html
 <defs>
   <radialGradient id="aa" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
     <stop offset="0%" style="stop-color:red" />
     <stop offset="30%" style="stop-color:blue" />
     <stop offset="70%" style="stop-color:yellow" />
     <stop offset="100%" style="stop-color:black" />         
   </radialGradient>
 </defs>
 <rect x="20" y="20" width="500" height="260" fill="url(#aa)"> </rect>
```

## D3.js

安装 npm i d3

Selections(选择集)

  在d3中选择元素的函数有两个：

  d3.select()    是选择所有指定元素的第一个

  d3.selectAll()  是选择指定元素的全部



数据绑定data

  选择集和绑定数据通常是一起使用的。

  datum()  绑定一个数据到选择集上

  data()  绑定一个数组到选择集上，数组的各项值分别与选择集的各元素绑定

data() 选择的是绑定元素和绑定数据一致的部分

  enter()是用来在绑定数据之后，选择缺少的那部分DOM元素

  exit()是用来选择那些与数据相比多出来的DOM元素。



d3的操作

  selection.attr - 设置或获取指定属性。

  selection.classed - 添加或删除选定元素的 CSS 类（CSS class）。

  selection.style - 设置或删除 CSS 属性。style优先级高于attr。

  selection.text - 设置或获取选定元素的标签体文本内容。

  selection.html - 设置或获取选定元素的 HTML 内容（类似 innerHTML ）

  selection.append - 创建并添加新元素到选定元素后。

  selection.insert - 创建并添加新元素到选定元素前。

  selection.remove - 从当前文档对象中删除选定的元素。

### 案例


``` js
let svg_width = 600
let svg_height = 400
let margin = {left : 40,top:40}
let g_width = svg_width - margin.left * 2;
let g_height = svg_height - margin.top * 2;

let svg = d3.select("#box").append("svg").attr('width', svg_width).attr('height', svg_height)

// 在g元素里面画
let g = svg.append("g").attr('transform',`translate(${margin.left},${margin.top})`)

var dataset = [
  {month:'1月',j:60},
  {month:'2月',j:70},
  {month:'3月',j:73},
  {month:'4月',j:54},
  {month:'5月',j:69},
  {month:'6月',j:74}
]

let max = d3.max( dataset.map(item => item.j) ); // 最大值

// 设置y轴比例尺(线性比例尺)
var scaleY=d3.scaleLinear()
// 最小值,最大值
.domain([0,max])
// 映射到的区间
.range([0,g_height])

// 设置x轴序数比例尺
var scaleX=d3.scaleBand()
.domain(dataset.map(item=> item.month))
.rangeRound([0,g_width])
let barWidth = 50; // 柱宽

// 绑定数据,选择多余的数据追加rect
g.selectAll('rect').data(dataset).enter().append('rect')
.attr('x',(item,i) => scaleX(item.month) + scaleX.bandwidth() - barWidth / 2 )
.attr('y',(item,i) => scaleY(max - item.j) )
.attr('width',barWidth)
.attr('height',(item,index) => scaleY(item.j) 
```

## Echarts

title标题组件，包含主标题和副标题

xAxis 直角坐标系 grid 中的 x 轴

yAxis直角坐标系 grid 中的 y 轴

series 系列列表,每个系列通过 type 决定自己的图表类型

tooltip提示框组件

legend图例组件

grid直角坐标系内绘图网格

横向柱状图

color 调色盘

toolbox工具栏,可以导出图片

echarts事件