<template>
  <div class="svg-flow-chart-demo">
    <div class="controls">
      <button 
        @click="direction = 'horizontal'" 
        :class="{ active: direction === 'horizontal' }"
      >
        横向布局
      </button>
      <button 
        @click="direction = 'vertical'" 
        :class="{ active: direction === 'vertical' }"
      >
        纵向布局
      </button>
      <button @click="resetView">重置视图</button>
    </div>

    <div class="chart-container">
      <svg 
        ref="svgRef" 
        class="flow-chart"
        @mousedown="handleMouseDown"
        @wheel="handleWheel"
      >
        <g ref="viewportRef"></g>
      </svg>
    </div>

    <div class="tips">
      <p>💡 <strong>提示：</strong>拖拽画布移动视图，滚动鼠标滚轮缩放</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

// 配置
const nodeWidth = 90
const nodeHeight = 44
const colGap = 120
const rowGap = 90

// 响应式数据
const direction = ref<'horizontal' | 'vertical'>('horizontal')
const svgRef = ref<SVGSVGElement>()
const viewportRef = ref<SVGGElement>()

// 拖拽和缩放状态
let isDragging = false
let startX = 0
let startY = 0
let translateX = 0
let translateY = 0
let scale = 1

// 示例数据
const nodesData = [
  { id: "1", text: "开始", target: ["2-1", "2-2"] },
  { id: "2-1", text: "分支 A", target: ["3-1"] },
  { id: "2-2", text: "分支 B", target: ["3-3"] },
  { id: "3-1", text: "处理 A", target: ["4"] },
  { id: "3-3", text: "处理 B", target: ["4"] },
  { id: "4", text: "结束", target: [] }
]

// 自动布局算法
function autoLayout(nodesData: any[]) {
  const nodeMap: any = {}
  const inDegree: any = {}
  const edges: any[] = []

  // 初始化
  nodesData.forEach(node => {
    nodeMap[node.id] = { ...node, col: 0, row: 0 }
    inDegree[node.id] = 0
  })

  // 构建边和入度
  nodesData.forEach(node => {
    (node.target || []).forEach((targetId: string) => {
      edges.push([node.id, targetId])
      inDegree[targetId]++
    })
  })

  // 拓扑排序计算 col
  const queue: string[] = []
  nodesData.forEach(node => {
    if (inDegree[node.id] === 0) {
      queue.push(node.id)
      nodeMap[node.id].col = 0
    }
  })

  while (queue.length > 0) {
    const current = queue.shift()!
    const currentNode = nodeMap[current]

    const node = nodesData.find(n => n.id === current)
    ;(node?.target || []).forEach((targetId: string) => {
      nodeMap[targetId].col = Math.max(nodeMap[targetId].col, currentNode.col + 1)
      inDegree[targetId]--
      if (inDegree[targetId] === 0) {
        queue.push(targetId)
      }
    })
  }

  // 按列分组
  const columns: any = {}
  Object.values(nodeMap).forEach((node: any) => {
    if (!columns[node.col]) columns[node.col] = []
    columns[node.col].push(node)
  })

  // 计算 row（居中对齐）
  const maxNodesInColumn = Math.max(...Object.values(columns).map((col: any) => col.length))
  Object.values(columns).forEach((colNodes: any) => {
    const offset = (maxNodesInColumn - colNodes.length) / 2
    colNodes.forEach((node: any, index: number) => {
      node.row = offset + index
    })
  })

  return {
    nodes: Object.values(nodeMap),
    edges: edges
  }
}

// 获取节点位置
function getPos(node: any) {
  if (direction.value === 'horizontal') {
    return {
      x: node.col * colGap + 60,
      y: node.row * rowGap + 40
    }
  } else {
    return {
      x: node.row * colGap + 60,
      y: node.col * rowGap + 40
    }
  }
}

// 创建 SVG 元素
function createSVG(tag: string) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag)
}

// 绘制曲线
function drawCurve(from: any, to: any, viewport: SVGGElement) {
  let startX, startY, endX, endY, offset
  const path = createSVG("path") as SVGPathElement

  if (direction.value === 'horizontal') {
    startX = from.x + nodeWidth
    startY = from.y + nodeHeight / 2
    endX = to.x
    endY = to.y + nodeHeight / 2
    offset = (endX - startX) * 0.5

    path.setAttribute(
      "d",
      `M ${startX} ${startY}
       C ${startX + offset} ${startY},
         ${endX - offset} ${endY},
         ${endX} ${endY}`
    )
  } else {
    startX = from.x + nodeWidth / 2
    startY = from.y + nodeHeight
    endX = to.x + nodeWidth / 2
    endY = to.y
    offset = (endY - startY) * 0.5

    path.setAttribute(
      "d",
      `M ${startX} ${startY}
       C ${startX} ${startY + offset},
         ${endX} ${endY - offset},
         ${endX} ${endY}`
    )
  }

  path.setAttribute("fill", "none")
  path.setAttribute("stroke", "#999")
  path.setAttribute("stroke-width", "1.5")

  viewport.insertBefore(path, viewport.firstChild)
}

// 渲染流程图
function renderChart() {
  if (!viewportRef.value) return

  // 清空
  viewportRef.value.innerHTML = ''

  const { nodes, edges } = autoLayout(nodesData)
  const nodeMap: any = {}

  // 绘制节点
  nodes.forEach((node: any) => {
    const { x, y } = getPos(node)

    // 矩形
    const rect = createSVG("rect") as SVGRectElement
    rect.setAttribute("x", String(x))
    rect.setAttribute("y", String(y))
    rect.setAttribute("width", String(nodeWidth))
    rect.setAttribute("height", String(nodeHeight))
    rect.setAttribute("rx", "6")
    rect.setAttribute("fill", "#fff")
    rect.setAttribute("stroke", "#409eff")
    rect.setAttribute("stroke-width", "2")
    rect.style.cursor = "pointer"
    rect.style.transition = "all 0.3s"

    rect.addEventListener("mousedown", e => e.stopPropagation())
    rect.addEventListener("mouseenter", () => {
      rect.setAttribute("fill", "#ecf5ff")
    })
    rect.addEventListener("mouseleave", () => {
      rect.setAttribute("fill", "#fff")
    })
    rect.addEventListener("click", () => {
      alert(`点击节点：${node.text}`)
    })

    // 文字
    const text = createSVG("text") as SVGTextElement
    text.setAttribute("x", String(x + nodeWidth / 2))
    text.setAttribute("y", String(y + nodeHeight / 2))
    text.setAttribute("text-anchor", "middle")
    text.setAttribute("dominant-baseline", "middle")
    text.setAttribute("fill", "#333")
    text.setAttribute("font-size", "14")
    text.style.pointerEvents = "none"
    text.style.userSelect = "none"
    text.textContent = node.text

    viewportRef.value!.appendChild(rect)
    viewportRef.value!.appendChild(text)

    nodeMap[node.id] = { x, y }
  })

  // 绘制连线
  edges.forEach(([from, to]: [string, string]) => {
    drawCurve(nodeMap[from], nodeMap[to], viewportRef.value!)
  })
}

// 更新视图变换
function updateTransform() {
  if (!viewportRef.value) return
  viewportRef.value.setAttribute(
    "transform",
    `translate(${translateX}, ${translateY}) scale(${scale})`
  )
}

// 鼠标按下
function handleMouseDown(e: MouseEvent) {
  isDragging = true
  startX = e.clientX
  startY = e.clientY
  if (svgRef.value) {
    svgRef.value.style.cursor = 'grabbing'
  }
}

// 鼠标移动
function handleMouseMove(e: MouseEvent) {
  if (!isDragging) return

  const dx = e.clientX - startX
  const dy = e.clientY - startY

  if (viewportRef.value) {
    viewportRef.value.setAttribute(
      "transform",
      `translate(${translateX + dx}, ${translateY + dy}) scale(${scale})`
    )
  }
}

// 鼠标释放
function handleMouseUp(e: MouseEvent) {
  if (!isDragging) return

  translateX += e.clientX - startX
  translateY += e.clientY - startY
  isDragging = false
  
  if (svgRef.value) {
    svgRef.value.style.cursor = 'grab'
  }
}

// 鼠标滚轮
function handleWheel(e: WheelEvent) {
  e.preventDefault()

  const zoom = e.deltaY > 0 ? 0.9 : 1.1
  scale *= zoom
  scale = Math.max(0.1, Math.min(5, scale)) // 限制缩放范围

  updateTransform()
}

// 重置视图
function resetView() {
  translateX = 0
  translateY = 0
  scale = 1
  updateTransform()
}

// 监听方向变化
watch(direction, () => {
  renderChart()
})

onMounted(() => {
  renderChart()
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped lang="scss">
.svg-flow-chart-demo {
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .controls {
    display: flex;
    gap: 10px;
    padding: 15px;
    background: #f5f6f7;
    border-bottom: 1px solid #e4e7ed;

    button {
      padding: 8px 16px;
      border: 1px solid #dcdfe6;
      background: #fff;
      color: #606266;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;

      &:hover {
        color: #409eff;
        border-color: #c6e2ff;
        background: #ecf5ff;
      }

      &.active {
        color: #fff;
        background: #409eff;
        border-color: #409eff;
      }
    }
  }

  .chart-container {
    background: #fafafa;
    position: relative;
    height: 500px;
    overflow: hidden;

    .flow-chart {
      width: 100%;
      height: 100%;
      cursor: grab;
      user-select: none;

      &:active {
        cursor: grabbing;
      }
    }
  }

  .tips {
    padding: 12px 15px;
    background: #f0f9ff;
    border-top: 1px solid #e4e7ed;

    p {
      margin: 0;
      font-size: 14px;
      color: #606266;
    }
  }
}
</style>

