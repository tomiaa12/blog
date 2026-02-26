# Cesium 设置3DTiles样式


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
    // infoBox: false,
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

  // 广州塔的位置,113.3191, 23.109
  var position2 = Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 2000);

  // flyto,让相机飞往某个地方
  viewer.camera.flyTo({
    destination: position2,
    orientation: {
      heading: Cesium.Math.toRadians(-70),
      pitch: Cesium.Math.toRadians(-70),
      roll: 0,
    },
  });


  // 添加3D建筑 OSM自带建筑数据
  const tileset = await Cesium.createOsmBuildingsAsync();
  viewer.scene.primitives.add(tileset)

   // tileset.style = new Cesium.Cesium3DTileStyle({
  //   // 颜色设置，颜色名称/16进制颜色值/rgba颜色值
  //   // color: "color('yellow')",
  //   // color: "rgba(255, 255, 0, 0.5)",
  //   color: "color('#f00')",
  //   show: true,
  // });

  tileset.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        [
          "${feature['building']} === 'apartments'",
          "color('rgba(50, 255, 0, 0.5)')",
        ],
        [
          "${feature['building']} === 'office'",
          "color('rgba(255, 255, 0, 0.5)')",
        ],
        [
          "${feature['cesium#estimatedHeight']} > 300",
          "color('rgba(200, 200, 255, 0.7)')",
        ],
        [
          "${feature['cesium#estimatedHeight']} > 100",
          "color('rgba(100, 100, 255, 0.7)')",
        ],
        [
          "${feature['cesium#estimatedHeight']} > 50",
          "color('rgba(50, 50, 150, 0.7)')",
        ],
        ["true", "color('white')"],
      ],
    },
    show: true,
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

<iframe src="https://cesium.kuangyx.cn/app25?hiddenSidebar=true" ></iframe>
