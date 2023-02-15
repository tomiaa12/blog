# openlayers ol/Map 地图对象

```vue{20-32}
<template>
  <div class="home">
    <div ref="map" id="map"></div>
  </div>
</template>

<script>
import Map from "ol/Map"; // 地图构造函数
import View from "ol/View"; // 视图层
import TileLayer from "ol/layer/Tile"; // 瓦片层
import OSM from "ol/source/OSM"; // ol自带的地图数据

export default {
  data() {
    return {
      map: null,
    };
  },
  mounted() {
    this.map = new Map({
      view: new View({ // 视图
        center: [11806543, 4445354], // 视图的初始坐标
        zoom: 4, // 放大倍数
      }),
      layers: [ // 图层
        new TileLayer({
          // 图层
          source: new OSM(), // 资源
        }),
      ],
      target: this.$refs.map, // 绑定元素或id
    });
  },
};
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  border: 1px solid #000;
  box-sizing: border-box;
  > #map {
    width: 100%;
    height: 100%;
  }
}
</style>
```

### 点击事件

```js
this.map.on("click", evt => {
    this.map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        // 鼠标点击某一个要素后，获取这个要素，执行业务逻辑
        console.log(feature);
    });
});
```

另一种

```js
this.map.dispatchEvent({type: "click", event: cb => {
    console.log('回调函数');
}})
```