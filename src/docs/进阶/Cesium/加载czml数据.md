# Cesium 加载czml数据


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


  // czml 标准 https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/CZML-Guide
  // const czml = [
  //   {
  //     id: "document",
  //     name: "box",
  //     version: "1.0",
  //   },
  //   {
  //     id: "shape1",
  //     name: "Blue box",
  //     position: {
  //       cartographicDegrees: [-114.0, 40.0, 300000.0],
  //     },
  //     box: {
  //       dimensions: {
  //         cartesian: [400000.0, 300000.0, 500000.0],
  //       },
  //       material: {
  //         solidColor: {
  //           color: {
  //             rgba: [0, 0, 255, 255],
  //           },
  //         },
  //       },
  //     },
  //   },
  // ];

  let czmlUrl = "./Assets/box.czml";

  // 加载czml数据
  let promiseData = Cesium.CzmlDataSource.load(czmlUrl);
  promiseData.then((dataSource) => {
    console.log(dataSource);
    viewer.dataSources.add(dataSource);
    viewer.flyTo(dataSource);
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

<iframe src="https://cesium.kuangyx.cn/app21?hiddenSidebar=true" ></iframe>
