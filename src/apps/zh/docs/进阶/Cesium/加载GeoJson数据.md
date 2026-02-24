# Cesium 加载GeoJson数据


::: details 示例代码

```vue
<script setup lang="ts">
import * as Cesium from 'cesium'
import "../styles/Widgets/widgets.css"
import { onMounted } from 'vue';

onMounted(async () => {
  // https://cesium.com/learn/cesiumjs/ref-doc/Viewer.html#.ConstructorOptions
  const viewer = new Cesium.Viewer('cesiumContainer', {
    // 隐藏 logo
    creditContainer: document.createElement('div'),
    // 隐藏右上角的帮助按钮
    navigationHelpButton: false,
    // 去除第一次加载后控制台报错
    infoBox: false,
    // 右上角搜索框
    geocoder: false,
    // 底部时间线
    timeline: false,
    // 左下角动画控件
    animation: false,
    // 右上角主页按钮
    homeButton: false,
    // 右上角显示模式
    sceneModePicker: false,
    // 右上角投影切换按钮
    baseLayerPicker: false,
  })


  // https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
  // 加载geojson数据
  let dataGeo = Cesium.GeoJsonDataSource.load(
    "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
    {
      stroke: Cesium.Color.RED,
      fill: Cesium.Color.SKYBLUE.withAlpha(0.5),
      strokeWidth: 4,
    }
  );

  
  dataGeo.then((dataSources) => {
    console.log(dataSources);
    viewer.dataSources.add(dataSources);
    let entities = dataSources.entities.values;
    entities.forEach((entity, i) => {
      if (entity.polygon) {
        entity.polygon.material = new Cesium.ColorMaterialProperty(
          Cesium.Color.fromRandom({
            alpha: 1,
          })
        );
        entity.polygon.outline = new Cesium.ConstantProperty(false);
        let randomNum = Math.floor(Math.random() * 5);
        entity.polygon.extrudedHeight = new Cesium.ConstantProperty(100000 * randomNum);
      }
    });
  });
})

</script>

<template>
  <div id="cesiumContainer" ref="cesiumContainer" />
</template>

<style scoped>
#cesiumContainer {
  height: 100%;
  width: 100%;
}
</style>

```

:::

<iframe src="https://cesium.kuangyx.cn/app18?hiddenSidebar=true" ></iframe>
