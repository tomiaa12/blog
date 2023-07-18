<template>
  <canvas ref="canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
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

  // 使用渲染器，通过场景，相机来渲染
  // 这里只能渲染一次，后面相机在移动时每一帧都需要渲染一次
  // renderer.render(scene, camera)

  // 创建轨道控制器
  // 要控制的相机，canvas元素
  const controls = new OrbitControls(camera, renderer.domElement)

  // 添加坐标轴辅助器
  const axesHelper = new AxesHelper(5)
  // 在场景中添加辅助器
  scene.add(axesHelper)

  // #region snippet
  // 设置物体位置
  // cube.position.set(2, 2, 2)
  cube.position.x = 3

  // 设置物体缩放
  // cube.scale.set(3, 2, 1)
  cube.scale.x = 2

  // 设置物体旋转
  // Math.PI 是 180°，这里选择 45°
  // cube.rotation.set(Math.PI / 4, 0, 0)
  cube.rotation.x = Math.PI / 4

  const render = () => {
    // 每一帧位移 0.01
    cube.position.x += 0.01
    // 每一帧缩放 0.01
    cube.scale.x += 0.01
    // 每一帧旋转 0.1°
    cube.rotation.x += 0.01
    if (cube.position.x > 5) {
      cube.position.x = 0
      cube.scale.x = 1
      cube.rotation.x = 0
    }

    renderer.render(scene, camera)
    // 浏览器自带方法，请求下一帧调用 render 方法，渲染
    requestAnimationFrame(render)
  }
  // #endregion snippet

  // 开始时调用一次渲染，鼠标左键可以拖动查看立方体
  render()
})
</script>
<style lang="scss" scoped>
canvas {
  width: 100%;
}
</style>
