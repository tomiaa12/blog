<template>
  <div id="canvas-gui-container">
    <canvas ref="canvas" />
  </div>
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
  BufferGeometry,
  BufferAttribute,
} from "three"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const canvas = ref()

onMounted(async () => {
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

  // #region snippet
  // 创建几何体
  const cubeGeometry = new BoxGeometry(1, 1, 1)
  // 创建材质
  const cubeMaterial = new MeshBasicMaterial({ color: 0x963143 })
  // 根据几何体和材质创建物体
  const cube = new Mesh(cubeGeometry, cubeMaterial)

  console.log(cubeGeometry)
  console.log(cubeMaterial)
  console.log(cube)
  console.log(cube.material === cubeMaterial, cube.geometry === cubeGeometry)

  // 一个立方体由 6 个面组成，每个面是 4 个点，共 4*6 = 24 个点
  console.log(cubeGeometry.attributes.position.count, "立方体的点数")
  // 每个点又有 3 个坐标，分别代表 xyz，共 3*24 = 72 个数值
  console.log(cubeGeometry.attributes.position.array)

  // 将几何体添加到场景中
  scene.add(cube)

  // 通过上面的解释，使用 Buffer 来创建几何体
  const geometry = new BufferGeometry()

  // 使用一维数组来创建顶点，每 3 个数表示 x,y,z 表示一个顶点，以此类推
  // 一个面由两个三角形组成，以两个三角形的6个顶点组成一个正方形面
  // 三个点是一定在一个面，而四个点有一个点可以不在一个平面上，就可能出现一些奇怪的问题
  // clang-format off
  const vertices = new Float32Array([
    // eslint-disable-next-line prettier/prettier
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0,1.0, 1.0,
    1.0,1.0, 1.0,
    -1.0,1.0, 1.0,
    // eslint-disable-next-line prettier/prettier
    -1.0, -1.0, 1.0,
  ])

  // 设置几何体的顶点属性
  geometry.setAttribute("position", new BufferAttribute(vertices, 3)) // 3 表示每 3 个值作为一个坐标

  // 创建材质
  const material = new MeshBasicMaterial({ color: 0xffff00 })

  // 创建物体
  const cube1 = new Mesh(geometry, material)

  // 添加到场景中
  scene.add(cube1)
  // #endregion snippet

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

  li {
    margin-top: 0;
  }

  .c input[type="text"] {
    margin: 0;
    padding: 0;
  }
}
</style>
