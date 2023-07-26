<template>
  <div id="canvas-gui-container">
    <canvas ref="canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import {
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  WebGLRenderer,
  AxesHelper,
} from "three"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"

const canvas = ref()

onMounted(() => {
  // 创建一个场景
  const scene = new Scene()

  // 创建一个相机(透视相机)
  // 角度，宽高比, 进端， 远端
  const camera = new PerspectiveCamera(
    75,
    parseInt(getComputedStyle(canvas.value).width) / window.innerHeight,
    0.1,
    1000
  )

  // 设置相机位置
  camera.position.set(0, 0, 10)

  // 添加到场景中
  scene.add(camera)

  // 创建几何体
  const cubeGeometry = new BoxGeometry(1, 1, 1)
  // 创建材质
  const cubeMaterial = new MeshBasicMaterial({ color: 0xffc0cb })
  // 根据几何体和材质创建物体
  const cube = new Mesh(cubeGeometry, cubeMaterial)

  // 将几何体添加到场景中
  scene.add(cube)

  // 初始化渲染器
  const renderer = new WebGLRenderer({
    // 将webGL渲染的canvas添加到dom上
    canvas: canvas.value,
    // 允许透明
    alpha: true,
  })

  // 设置背景色
  renderer.setClearColor(0x10b981, 0.1)

  // 设置画布的宽高
  renderer.setSize(
    parseInt(getComputedStyle(canvas.value).width),
    window.innerHeight
  )

  // 创建轨道控制器
  // 要控制的相机，canvas元素
  const controls = new OrbitControls(camera, renderer.domElement)

  // 添加坐标轴辅助器
  const axesHelper = new AxesHelper(5)
  // 在场景中添加辅助器
  scene.add(axesHelper)

  // 开启控制器的阻尼效果，在拖动的画面时有阻尼感
  controls.enableDamping = true
  // #region snippet
  // 创建 GUI
  const gui = new dat.GUI({
    autoPlace: false, // 是否自动添加到界面上
  })

  // 添加一个修改，修改物体坐标
  gui
    .add(cube.position, "x")
    .min(0)
    .max(5)
    .step(0.01)
    .name("X 轴")
    .onChange(console.log)
    .onFinishChange(() => console.log("完全停下来了，当鼠标抬起时触发"))

  gui.add(cube.position, "y").min(0).max(5).step(0.01)

  // autoPlace: false 手动添加到界面
  document.getElementById("canvas-gui-container")?.appendChild(gui.domElement)

  // #endregion snippet

  const render = () => {
    renderer.render(scene, camera)

    // 开启阻尼后必须在渲染方法里面调用update
    controls.update()

    // 浏览器自带方法，请求下一帧调用 render 方法，渲染
    requestAnimationFrame(render)
  }

  // 开始时调用一次渲染，鼠标左键可以拖动查看立方体
  render()
})
</script>
<style lang="scss" scoped>
canvas {
  width: 100%;
}

#canvas-gui-container {
  position: relative;
}

:deep().dg.main {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
