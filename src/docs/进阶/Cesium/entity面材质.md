# Cesium entity面材质


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


  // 使用entity创建矩形
  var rectangle = viewer.entities.add({
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(
        // 西边的经度
        90,
        // 南边维度
        20,
        // 东边经度
        110,
        // 北边维度
        30
      ),
      // 设置为颜色材质
      // material: Cesium.Color.RED.withAlpha(0.5),

      // 颜色纹理
      // material: new Cesium.ColorMaterialProperty(
      //   new Cesium.Color(1,1,1,0.5)
      // ),

      // 棋盘纹理
      material: new Cesium.CheckerboardMaterialProperty({
        evenColor: Cesium.Color.WHITE,
        oddColor: Cesium.Color.BLACK,
        // 4 X 4 格
        repeat: new Cesium.Cartesian2(4, 4),
      })
    },
  });

  viewer.zoomTo(rectangle)


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

<iframe src="https://cesium.kuangyx.cn/app13?hiddenSidebar=true" ></iframe>
