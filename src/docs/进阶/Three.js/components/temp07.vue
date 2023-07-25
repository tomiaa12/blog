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
import gsap from "gsap"

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
  // 使 position 对象的 x 值过渡到 5
  const animate = gsap.to(cube.position, {
    y: 5,
    duration: 5,
    ease: "elastic.out(1, 0.3)",
    repeat: -1, // 重复次数，无限次循环是 -1
    yoyo: true, // 往返运动
    delay: 1, // 延迟 1 秒后运动
    onComplete() {
      console.log("动画完成")
    },
  })
  // 旋转过渡
  gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5 })

  console.log(canvas.value)
  canvas.value.addEventListener("click", () => {
    // 是否在运动
    if (animate.isActive()) {
      // 当点击时停止动画
      animate.pause()
    } else {
      // 恢复
      animate.play()
    }
  })

  const render = () => {
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
