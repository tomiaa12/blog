# Cesium entity线材质


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


  // 添加3D建筑 OSM自带建筑数据
  const tileset = await Cesium.createOsmBuildingsAsync();
  viewer.scene.primitives.add(tileset)


  // 设置发光飞线效果
  let material = new Cesium.PolylineGlowMaterialProperty({
    // 设置发光程度
    glowPower: 0.8,
    // 尾椎缩小程度
    taperPower: 0.7,
    color: Cesium.Color.RED,
  });

  const redLine = viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
      width: 20,
      material: material,
    },
  });


  const material1 = new Cesium.PolylineArrowMaterialProperty(
    Cesium.Color.ROSYBROWN
  )
  const redLine1 = viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([-75, 38, -125, 38]),
      width: 20,
      material: material1,
    },
  });

  viewer.zoomTo([redLine, redLine1])



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

<iframe src="https://cesium.kuangyx.cn/app14?hiddenSidebar=true" ></iframe>
