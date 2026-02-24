# Cesium 设置3DTiles样式高级设置


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



  tileset.style = new Cesium.Cesium3DTileStyle({
    defines: {
      // 以一个经纬度为中间的半径范围
      distance:
        "distance(vec2(${feature['cesium#longitude']},${feature['cesium#latitude']}),vec2(113.3191,23.109))",
    },
    color: {
      // 根据距离设置颜色
      conditions: [
        ["${distance} < 0.01", "color('rgba(0,0,50, 0.7)')"],
        ["${distance} < 0.02", "color('rgba(0,0,50, 0.5)')"],
        ["${distance} < 0.04", "color('rgba(0,0,50, 0.2)')"],
        ["true", "color('white')"],
      ],
    },
    // 只显示  0.04范围以内 && 建筑类型为 apartments 的建筑物
    show: "${distance} < 0.04 && ${feature['building']} === 'apartments'",
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

<iframe src="https://cesium.kuangyx.cn/app26?hiddenSidebar=true" ></iframe>
