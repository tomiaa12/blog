# openlayers ol/proj--坐标系

```js
import * as olProj from 'ol/proj';
// or 或者
import { xx } from 'ol/proj';
```

EPSG:4326 为经纬度坐标,GPS系统,世界大地测量系统

EPSG:3857 为平面坐标,谷歌,微软都是用的这个

坐标查询网址: http:// epsg.io/

## transform--坐标转换

transform(coordinate,source,destination)

```js
proj.transform([112.993592,28.200256],'EPSG:4326','EPSG:3857')
//  [12578389.124342911, 3274245.030348462]
```

- coordinate: 当前坐标
- source: 源投影坐标系(当前坐标的坐标系)
- destination: 目标投影坐标系

## fromLonLat--经纬度转目标投影

fromLonLat(coordinate,destination)

```js
import {fromLonLat} from 'ol/proj';
fromLonLat([112.993592,28.200256])
//  [12578389.124342911, 3274245.030348462]
```

- coordinate: 当前坐标,
- destination: 目标投影坐标系

## proj/Projection--定义投影坐标系

- 定义一个投影坐标系对象,储存在proj的命名空间中
- 如果使用 proj4js，则可以使用 proj4.defs() 添加别名。添加所有必需的投影定义后，调用 ol/proj/proj4.register 函数。
- 可以使用ol/proj.get 来获取特定投影的对象。

```js
new Projection(options)
```

### 可选项

- code: string，投影的标识符代码,如: EPSG:4326
- units: ol/proj/Units| string , 单位 ,如: 'm' (米)
- extent: ol/extent~Extent, 坐标系的边界范围
- axisOrientation: string , 轴方向,默认'enu'
- global: boolean , 投影是否对整个地球有效,默认false
- metersPerUnit: 米单位
- worldExtent:  ol/extent~Extent,,世界坐标系的边界范围
- getPointResolution: function,获取点分辨率,传入分辨率和坐标

### 方法

- getAxisOrientation: 获取轴方向
  - enu - 默认东距、北距、高程。 
  - neu - 北向、东向、向上 - 适用于“纬度/经度”地理坐标或南向横向墨卡托。
  - wnu - 向西、向北、向上 - 一些行星坐标系具有“西正”坐标系
- getCode: 获取投影的代码,如'EPSG:4326'
- get/setExtent(ol/extent): 获取/设置投影的范围
- getMetersPerUnit: 获取每单位米数。如未配置为metersPerUnit 或单位标识符，则返回未定义。
- getUnits: 获取此投影的单位
- get/setWorldExtent: 获取/设置此投影的世界范围。
- isGlobal: 是否是全球范围的投影

## 例子：自定义坐标系

1. 创建一个投影坐标系

```js
let epsg4490 = new proj.Projection({
    code: 'EPSG:4490', // 命名投影的编号
    extent:[73.62, 16.7, 134.77, 53.56], // 投影的边界范围
    units: 'm',
    axisOrientation: 'neu',
});
```

投影的边界范围http:// epsg.io/ 上搜索，这里用的中国2000大地坐标系

2. 使用proj4定义4490坐标与openlayers自带的3857，4326互相转换

```
npm i proj4
```

```js
import proj4 from "proj4";

// 定义4490坐标系，且与其他4326,3857的互相转换
proj4.defs("EPSG:4490","+proj=longlat +ellps=GRS80 +no_defs");
```

defs的值在epsg.io网站上复制

3. 在ol中添加投影与转换坐标

```js
proj.addProjection(epsg4490);
proj.addCoordinateTransforms("EPSG:4326", "EPSG:3395",
    coordinate => proj4("EPSG:4326","EPSG:3395",coordinate),
    coordinate => proj4("EPSG:3395","EPSG:4326",coordinate),
)
proj.addCoordinateTransforms("EPSG:3857", "EPSG:3395",
     coordinate => proj4("EPSG:3857","EPSG:3395",coordinate),
     coordinate => proj4("EPSG:3395","EPSG:3857",coordinate),
)
```

addProjection添加定义的投影，addCoordinateTransforms添加坐标的互相转换

4. 测试

```js
console.log(proj.transform([118,32],'EPSG:4326','EPSG:3395')); 
// 测试没问题就定义成功了
```

## addCoordinateTransforms--注册投影坐标转换

```js
import {addCoordinateTransforms} from 'ol/proj';
```

### 可选性

- source：源投影的编号，如"EPSG:3857"

- destination： 目标投影的编号

- forward： function 回调，传入坐标，需要返回源投影转换为目标投影后的坐标。

- inverse： function逆向转换函数，需要返回目标转源投影的坐标。

## addEquivalentProjections--注册不改变坐标转换的投影

```js
import {addEquivalentProjections} from 'ol/proj';
```

### 可选项

- projections：Array[Projection对象]

## addProjection--添加投影

```js
import {addProjection} from 'ol/proj';
```

添加到投影列表，并可以在投影列表中通过code代码查找

- projection: projection对象，查找的代码为projection.code值

## equivalent--检查两个投影是否相等

```js
import {equivalent} from 'ol/proj';
```

检查两个投影每个坐标都是相同的地理点

### 可选项

- projection1: projection 对象
- projection2: projection对象

## get--编号获取projection投影对象

```js
import {get} from 'ol/proj';
console.log(get('EPSG:4490'));
```

## getPointResolution--获取投影点分辨率

```js
import {getPointResolution} from 'ol/proj';
```

- 以经纬度或距离单位获取点的分辨率。以度为单位的投影，这将简单地返回提供的分辨率。
- 其他投影，默认情况下通过将“点”像素转换为 EPSG:4326，测量在法线球体上的宽度和高度，并取宽度和高度的平均值来估计点分辨率。
- 可以通过在Projection 构造函数中设置 getPointResolution 选项或使用setGetPointResolution()方法更改现有投影对象来为特定投影提供自定义函数

### 可选项

- projection：投影
- resolution：number 投影单位表示的分辨率
- point：Coordinate 点坐标，指向找到调整后的分辨率。
- untis：获得点分辨率的单位。默认是投影的单位。

```js
console.log(proj.getPointResolution("EPSG:4490",1920,[118,32]));
```

## getTransform--获取转换方法

返回源转目标的转换方法

```js
proj.getTransform("EPSG:4490","EPSG:3857")
```

toLonLat--转换为经纬度

```js
import {toLonLat} from 'ol/proj';
```

- coordinate： 坐标
- projection：投影编号，默认为'EPSG:3857'

## transformExtent--转换范围

```js
import {transformExtent} from 'ol/proj';
```

将范围从源投影范围转换为目标投影范围，返回一个新的范围，不会改变原始范围

- extent：投影范围，[minx,miny,maxx,maxy]
- source：投影对象
- destination：目标投影对象
- stops：转换的停止点数

```js
console.log(proj.transformExtent([76,18,140,56],"EPSG:4326","EPSG:3857"));
```

