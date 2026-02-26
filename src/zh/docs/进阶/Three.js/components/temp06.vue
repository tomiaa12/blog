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
  Clock,
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

  // 创建轨道控制器
  // 要控制的相机，canvas元素
  const controls = new OrbitControls(camera, renderer.domElement)

  // 添加坐标轴辅助器
  const axesHelper = new AxesHelper(5)
  // 在场景中添加辅助器
  scene.add(axesHelper)

  // #region snippet
  const clock = new Clock()

  const render = () => {
    // 获取自 .oldTime 设置后到当前的秒数。 同时将 .oldTime 设置为当前时间。
    const deltaTime = clock.getDelta()
    // console.log("deltaTime " + deltaTime)

    // 获取自时钟启动后的秒数，同时将 .oldTime 设置为当前时间。
    const time = clock.getElapsedTime()
    // console.log("time " + time)

    const t = time % 5 // 在余数中循环步长，只会在1 - 5秒循环

    // 当前帧所耗时的秒数 * 速度
    cube.position.x = t * 1

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
