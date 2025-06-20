# Cesium Appearance


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



  // primivite创建矩形
  // 01-创建几何体
  let rectGeometry = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(
      // 西边的经度
      115,
      // 南边维度
      20,
      // 东边经度
      135,
      // 北边维度
      30
    ),
    // 距离表面高度
    height: 0,
    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
  });
  // 02-创建几何体实例
  let instance = new Cesium.GeometryInstance({
    id: "myRect",
    geometry: rectGeometry,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.BURLYWOOD.withAlpha(0.5)
      ),
    },
  });

  // 03-设置外观
  // 使用instance的颜色去着色
  // let appearance = new Cesium.PerInstanceColorAppearance({
  //   flat: true,
  // });

  // material 设置材质
  let material1 = Cesium.Material.fromType("Color", {
    color: Cesium.Color.AQUA.withAlpha(0.5),
  });

  // 设定几何体都是与地球的椭球体平行
  // 假定几何体与地球椭球体平行，就可以在计算大量顶点属性的时候节省内存
  let appearance = new Cesium.EllipsoidSurfaceAppearance({
    material: material1,
    aboveGround: true,
  });
  // 基类
  // let appearance = new Cesium.MaterialAppearance({
  //   material: material1,
  // });


  // 04-图元
  let primitive = new Cesium.Primitive({
    geometryInstances: instance,
    appearance: appearance,
  });
  // 05-添加到viewer
  viewer.scene.primitives.add(primitive);
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

<iframe src="https://cesium.kuangyx.cn/app15?hiddenSidebar=true" ></iframe>
