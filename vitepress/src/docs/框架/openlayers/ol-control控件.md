# openlayers ol/control--控件

## FullScreen--全屏显示

```js{5-15}
import FullScreen from "ol/control/FullScreen";

data() {
    return {
      full: new FullScreen({
        className: "btn-class", // 按钮的外层(父元素)class
        label: "点击全屏", // 点击全屏 文字或html标签
        labelActive: "点击退出全屏", // 退出全屏文字或html标签
        activeClassName: "is-full-class", // 处于全屏时按钮的class
        inactiveClassName: "no-full-class", // 处于非全屏时按钮的class
        tipLabel: "点击", // 鼠标悬停文字
        keys: true, // 是否键盘访问(不知道怎么用)
        // target: this.$refs.full, // 放大按钮显示在哪个元素上
        // source: this.$refs.view, // 放大在哪个元素上
      }),
    };
  },
  mounted() {
  	this.map = new Map({
      view: new View({
        center: [11806543, 4445354], // 视图的初始坐标
        zoom: 4, // 放大倍数
      }),
      layers: [
        new TileLayer({
          source: new OSM(), // 资源
        }),
      ],
      target: this.$refs.map, // 绑定元素或id
      controls: [
        this.full
      ],
    }));
  }
```

### 事件


| 事件名          | 触发条件                  |
| --------------- | ------------------------- |
| enterfullscreen | 进入全屏时触发            |
| leavefullscreen | 离开全屏时触发            |
| error           | 发送错误的通用事件        |
| propertychange  | 属性发生了变化            |
| change          | 调用changed方法触发该事件 |

::: details 展开示例
```js
this.full.on('enterfullscreen',e => {
    console.log('进入全屏时触发');
})
this.full.on('leavefullscreen',e => {
    console.log('离开全屏时触发');
})
this.full.on('error',e => {
    console.log('发送错误的通用事件');
})
this.full.on('propertychange',e => {
    console.log('属性发生了变化');
})
this.full.on('change',e => {
    console.log('调用changed方法触发该事件');
})
```
:::

### 方法

```js
this.full.changed(); // 触发change事件
this.full.dispatchEvent('enterfullscreen'); // 调用change的监听事件

this.full.set('name','值'); // 设置值并触发propertychange事件
this.full.set('name','值',true) // 设置不触发事件
/* 若设置的值与当前name的值相同,则不会触发事件 */
this.full.setMap(); // 不传参则删除这个控件,传入html标签或id,则删除当前的控件移动到新的传入的地图上


this.full.setProperties({'newKey':'value'}); // 设置键值,会与现有的合并(不会替换)
this.full.setProperties({'newKey':'value'},true); // 不触发change事件
this.full.setTarget(this.$refs.map); // setmap之后调用无效,设置目标元素

console.log(this.full.get('name')); // 获取值
console.log(this.full.getKeys()); // 获取当前设置的所有的键名,返回数组
console.log(this.full.getProperties()); // 获取所有的键值

console.log(this.full.getRevision()); // 获取full对象版本号,每次修改都会增加
console.log(this.full.getMap()); // 获取与当前control-full管理的map对象

this.full.unset('name'); // 删除属性
this.full.un('change',this.change) // 不监听某个事件
```

::: details 展开示例

```vue
<script>
import 'ol/ol.css';
import Map from "ol/Map"; // 地图构造函数
import View from "ol/View"; // 视图层
import TileLayer from "ol/layer/Tile"; // 瓦片层
import OSM from "ol/source/OSM"; // ol自带的地图数据

import FullScreen from "ol/control/FullScreen";

export default {
  data() {
    return {
      full: new FullScreen(),
    };
  },
  mounted() {
    this.map = new Map({
      view: new View({
        center: [11806543, 4445354], // 视图的初始坐标
        zoom: 4, // 放大倍数
      }),
      layers: [
        new TileLayer({
          source: new OSM(), // 资源
        }),
      ],
      target: this.$refs.map, // 绑定元素或id
      controls: [this.full],
    });
    this.full.on("change",this.change);
  },
  methods: {
    change(){
      console.log("调用changed方法触发该事件");
    },
    handlerClick(){

      this.full.changed(); // 触发change事件
      this.full.dispatchEvent('enterfullscreen'); // 调用change的监听事件

      this.full.set('name','值'); // 设置值并触发propertychange事件
      this.full.set('name','值',true) // 设置不触发事件
      /* 若设置的值与当前name的值相同,则不会触发事件 */
      this.full.setMap(); // 不传参则删除这个控件,传入html标签或id,则删除当前的控件移动到新的传入的地图上


      this.full.setProperties({'newKey':'value'}); // 设置键值,会与现有的合并(不会替换)
      this.full.setProperties({'newKey':'value'},true); // 不触发change事件
      this.full.setTarget(this.$refs.map); // setmap之后调用无效,设置目标元素

      console.log(this.full.get('name')); // 获取值
      console.log(this.full.getKeys()); // 获取当前设置的所有的键名,返回数组
      console.log(this.full.getProperties()); // 获取所有的键值

      console.log(this.full.getRevision()); // 获取full对象版本号,每次修改都会增加
      console.log(this.full.getMap()); // 获取与当前control-full管理的map对象

      this.full.unset('name'); // 删除属性
      this.full.un('change',this.change) // 不监听某个事件

    }
  },
};
</script>
```

:::

## Zoom--缩放

```js
import Zoom from 'ol/control/Zoom';
```

### 选项

| 键名             | 类型                 | 默认值             | 描述                         |
| ---------------- | -------------------- | ------------------ | ---------------------------- |
| duration         | number(毫秒)         | 250                | 动画持续时间                 |
| className        | string               | ol-zoom            | 类名                         |
| zoomInClassName  | string               | className + '-in'  | 放大的类名                   |
| zoomOutClassName | string               | className + '-out' | 缩小的类名                   |
| zoomInLabel      | string \|HTMLElement | +                  | 放大的innerHtml,也可以是标签 |
| zoomOutLabel     | string \|HTMLElement | -                  | 缩小的innerHtml,也可以是标签 |
| zoomInTipLabel   | string               | Zoom in            | 放大的title提示              |
| zoomOutTipLabel  | string               | Zoom out           | 缩小的title提示              |
| delta            | number               | 1                  | 每次单击放大缩小的步长       |
| target           | HTMLElement \|string |                    | 按钮放置在什么位置           |

### 事件

- change: 通用更改事件
- error: 通用错误
- propertychange: 属性变化

### 方法

- changed: 触发change事件
- dispatchEvent(event|string) ->Boolean|undefined : 触发指定的事件
- get(string)-> value: 获取key
- getKeys()->Array: 所有的键
- getMap()->Map: 获取当前关联的Map对象
- getProperties()->Object:获取所有键值对
- getRevision()->number: 获取版本号,每次修改对象都会增加,执行changed方法会增加
- on(string|Array,function)->string|Array:监听某个事件
- once():监听一次事件
- render(mapEvent): 渲染控件
- set(key,value,boolean是否触发propertychange事件):设置值
- setMap(map): 从当前的地图删除,添加到新的地图对象上
- setProperties(Object,boolean是否propertychange触发事件):设置键值对,与现有的合并
- setTarget( HTMLElement | string):设置目标元素,调用了setMap或

## Rotate--旋转

```js
import Rotate from 'ol/control/Rotate';
```

### 选项

- className: 类名 ol-rotate
- label: 文本内容 ⇧
- tipLabel: 提示标签 Reset rotation
- compassClassName: 指南针类名
- duration:持续时间 250
- autoHide: 为0时自动隐藏
- render:参数function, 呈现时调用此方法
- resetNorth: 参数function,单击时调用此方法,会覆盖默认的
- target: 渲染目标

## ScaleLine--比例尺

```js
import ScaleLine from 'ol/control/ScaleLine';
```

### 选项

- className:类名
- minWidth:最小dpi 默认64
- render: 重新渲染会执行此函数
- target: 渲染位置
- Units: 单位,默认metric 公里km(degrees度数,imperial英里,nautical海里?,us)
- bar:默认false,比例尺是一条线与数字,而不是数字
- steps: 默认2,比例尺缩放的步长,建议偶数
- text: 默认false,比例尺上显示 1: xxx,只有bar为true时生效
- dpi:输出设备的dpi,只有bar为true时生效

### 事件

- change
- change:units : 单位发生变化时
- error
- propertychange:属性变化

### 可观察/设置属性

- units

### 方法

- changed
- dispatchEvent
- get/set
- getKeys
- getMap
- getProperties
- getRevision
- getUnits:获取比例尺单位
- on/once 
- render
- set/setDpi/setMap/setProperties/setTarget
- setUnties: 设置单位,触发change:units 事件
- un/unset

## ZoomSlider--缩放拖动条

```js
import 'ol/ol.css';
import ZoomSlider from 'ol/control/ZoomSlider';
```

```js
controls: [
    new ZoomSlider()
]
// or
this.map.addControl(new ZoomSlider());
```

### 选项

- className: 类名,默认ol-zoomslider
- duration: 持续时间,默认200
- render: 呈现时的回调函数

### 事件

- change
- error
- propertychange

### 方法

- changed,dispatchEvent
- get获取键,getKeys获取所有键,getMap获取关联map,getProperties获取键值对,getRevision版本号,
- on,once,render,un,unset
- set,setMap,setProperties,setTarget

## Attribution--详细信息

```js
import Attribution from 'ol/control/Attribution';
controls: [
    new Attribution()
]
```

默认显示在地图右下角的详细信息

### 选项

- className:默认ol-attribution
- target
- collapsible:true/false,是否折叠,点击展开详情
- collapsed: 是否在初始化显示时折叠,默认true
- tipLabel: 提示title信息
- label: 按钮内容,默认i
- expandClassName: 展开后的类名
- collapseLabel: 折叠的内容,默认'»'
- collapseClassName: 折叠的类名
- render:呈现的回调

### 事件

- change,error,propertychange

### 方法

- 与其他控件有同样的方法,get,set,等等
- getCollapsed:折叠返回true,没有折叠返回false
- getCollapsible: 详情可以折叠返回true,不能返回fasle
- setCollapsed(boolean): 设置展开或折叠,如果属性不能折叠则不做任何操作
- setCollapsible: 设置是否可以折叠

## OverviewMap--概览图

左下角显示概览,类似LOL中的小地图,方框显示当前在地图的哪个区域,可以拖动

```js
import OverviewMap from 'ol/control/OverviewMap';

control: [new OverviewMap()]
```

### 选项

- className: 默认ol-overviewmap
- collapsed: 初始化时是否折叠,默认true
- collapseLabel: 收起的图标,默认 '«'
- collapsible: 是否可以折叠,默认true
- label: 展开的图标,默认»
- layers: 显示哪个图层的概览
- render
- rotateWithView: 是否跟着主视图一起旋转,默认false
- target
- tipLabel
- view: 概览小地图的自定义视图,默认与主视图相同的投影

### 事件

- 3个通用事件

### 方法

- 包含其他通用方法

- getCollapsed: 是否折叠状态
- getCollapsible: 是否可以折叠
- getOverviewMap: 返回概览图
- getRotateWithView: 概览图是否可以旋转
- setCollapsed: 设置折叠展开
- setCollapsible: 设置是否能折叠,能折叠为true

## ZoomToExtent--缩放至指定位置

点击按钮后缩放到指定区域

```js
import ZoomToExtent from 'ol/control/ZoomToExtent';
new ZoomToExtent({
    extent: [12667718, 2562800, 12718359, 2597725],
})
```

### 选项

- className: 默认ol-zoom-extent
- target: 目标位置
- label: 按钮文本
- tipLabel: 悬停提示title
- extent: 缩放的位置,未设置则缩放到最小显示全部地图

### 事件

- 3个通用事件

### 方法

- 通用方法

## MousePosition--鼠标坐标

- 在左上角显示鼠标悬停的坐标
- 没有鼠标的设备则显示点击的时候的坐标

```js
import MousePosition from 'ol/control/MousePosition';
new MousePosition()
```

### 选项

- className:默认ol-mouse-position
- coordinateFormat: 显示的坐标格式,参考'ol/coordinate'
- projection: 默认是视图view的投影坐标,参考'ol/ProjectionLike'
- render
- target
- placeholder: 鼠标移出地图后显示的文字,默认显示移出前最后的坐标
- undefinedHTML: 占位符,不推荐使用

### 事件

- 3个通用事件
- change:coordinateFormat: 坐标格式变化时
- change:projection: 投影视图变化时

### 方法

- 通用方法
- getCoordinateFormat: 获取当前坐标格式,没有返回undefined
- setCoordinateFormat: 设置坐标格式
- getProjection: 获取坐标投影视图
- setProjection: 设置坐标投影视图