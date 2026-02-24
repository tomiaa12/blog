
<script setup lang="ts">
import SvgFlowChart from "./components/SvgFlowChart.vue"
</script>


# SVG 绘制流程图

一个基于原生 SVG 实现的流程图绘制方案，支持自动布局、拖拽、缩放等功能，无需依赖任何第三方库。

## 特性

- ✅ **自动布局**：基于拓扑排序自动计算节点位置
- ✅ **贝塞尔曲线连接**：优雅的曲线连线效果
- ✅ **横向/纵向切换**：支持两种布局方向
- ✅ **拖拽和缩放**：流畅的交互体验
- ✅ **纯原生实现**：零依赖，代码简洁

## 在线演示

<ClientOnly>
  <SvgFlowChart />
</ClientOnly>

## 核心实现

### 1. 数据结构

流程图的数据采用节点和连接的方式组织：

```javascript
const nodesData = [
  { id: "1", text: "开始", target: ["2-1", "2-2"] },
  { id: "2-1", text: "分支 A", target: ["3-1"] },
  { id: "2-2", text: "分支 B", target: ["3-3"] },
  { id: "3-1", text: "处理 A", target: ["4"] },
  { id: "3-3", text: "处理 B", target: ["4"] },
  { id: "4", text: "结束", target: [] }
];
```

### 2. 自动布局算法

使用拓扑排序算法自动计算节点的列（层级）和行（位置）：

```javascript
function autoLayout(nodesData) {
  const nodeMap = {};
  const inDegree = {};
  const edges = [];

  // 初始化节点
  nodesData.forEach(node => {
    nodeMap[node.id] = { ...node, col: 0, row: 0 };
    inDegree[node.id] = 0;
  });

  // 构建边和入度
  nodesData.forEach(node => {
    (node.target || []).forEach(targetId => {
      edges.push([node.id, targetId]);
      inDegree[targetId]++;
    });
  });

  // 拓扑排序计算列（层级）
  const queue = [];
  nodesData.forEach(node => {
    if (inDegree[node.id] === 0) {
      queue.push(node.id);
      nodeMap[node.id].col = 0;
    }
  });

  while (queue.length > 0) {
    const current = queue.shift();
    const currentNode = nodeMap[current];

    (nodesData.find(n => n.id === current).target || []).forEach(targetId => {
      nodeMap[targetId].col = Math.max(nodeMap[targetId].col, currentNode.col + 1);
      inDegree[targetId]--;
      if (inDegree[targetId] === 0) {
        queue.push(targetId);
      }
    });
  }

  // 按列分组并计算行（居中对齐）
  const columns = {};
  Object.values(nodeMap).forEach(node => {
    if (!columns[node.col]) columns[node.col] = [];
    columns[node.col].push(node);
  });

  const maxNodesInColumn = Math.max(...Object.values(columns).map(col => col.length));
  Object.values(columns).forEach(colNodes => {
    const offset = (maxNodesInColumn - colNodes.length) / 2;
    colNodes.forEach((node, index) => {
      node.row = offset + index;
    });
  });

  return {
    nodes: Object.values(nodeMap),
    edges: edges
  };
}
```

### 3. 绘制节点

使用 SVG rect 和 text 元素绘制节点：

```javascript
function createSVG(tag) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

nodes.forEach(node => {
  const { x, y } = getPos(node);

  // 绘制矩形
  const rect = createSVG("rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", nodeWidth);
  rect.setAttribute("height", nodeHeight);
  rect.setAttribute("rx", 6);
  rect.setAttribute("fill", "#fff");
  rect.setAttribute("stroke", "#333");
  rect.style.cursor = "pointer";

  // 添加点击事件
  rect.addEventListener("click", () => {
    alert("点击节点：" + node.id);
  });

  // 绘制文字
  const text = createSVG("text");
  text.setAttribute("x", x + nodeWidth / 2);
  text.setAttribute("y", y + nodeHeight / 2);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.textContent = node.text;

  viewport.appendChild(rect);
  viewport.appendChild(text);
});
```

### 4. 贝塞尔曲线连接

使用三次贝塞尔曲线绘制节点之间的连接：

```javascript
function drawCurve(from, to) {
  const path = createSVG("path");
  
  if (direction === 'horizontal') {
    // 横向布局
    const startX = from.x + nodeWidth;
    const startY = from.y + nodeHeight / 2;
    const endX = to.x;
    const endY = to.y + nodeHeight / 2;
    const offset = (endX - startX) * 0.5;

    path.setAttribute(
      "d",
      `M ${startX} ${startY}
       C ${startX + offset} ${startY},
         ${endX - offset} ${endY},
         ${endX} ${endY}`
    );
  } else {
    // 纵向布局
    const startX = from.x + nodeWidth / 2;
    const startY = from.y + nodeHeight;
    const endX = to.x + nodeWidth / 2;
    const endY = to.y;
    const offset = (endY - startY) * 0.5;

    path.setAttribute(
      "d",
      `M ${startX} ${startY}
       C ${startX} ${startY + offset},
         ${endX} ${endY - offset},
         ${endX} ${endY}`
    );
  }

  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#999");
  path.setAttribute("stroke-width", "1.5");

  viewport.insertBefore(path, viewport.firstChild);
}
```

### 5. 交互功能

实现拖拽和缩放功能：

```javascript
let isDragging = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;
let scale = 1;

// 拖拽
svg.addEventListener("mousedown", e => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
});

window.addEventListener("mousemove", e => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  viewport.setAttribute(
    "transform",
    `translate(${translateX + dx}, ${translateY + dy}) scale(${scale})`
  );
});

window.addEventListener("mouseup", e => {
  if (!isDragging) return;
  translateX += e.clientX - startX;
  translateY += e.clientY - startY;
  isDragging = false;
});

// 缩放
svg.addEventListener("wheel", e => {
  e.preventDefault();
  const zoom = e.deltaY > 0 ? 0.9 : 1.1;
  scale *= zoom;
  viewport.setAttribute(
    "transform",
    `translate(${translateX}, ${translateY}) scale(${scale})`
  );
});
```

## 完整代码

### HTML 完整代码

<details>
<summary>点击查看完整 HTML 代码</summary>

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>SVG 流程图</title>
  <style>
    html, body {
      margin: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #f5f6f7;
    }

    svg {
      width: 100%;
      height: 100%;
      cursor: grab;
      user-select: none;
    }

    svg:active {
      cursor: grabbing;
    }
  </style>
</head>
<body>

<svg id="graph">
  <g id="viewport"></g>
</svg>

<script>
  /***********************
   * 基础配置
   ***********************/
  const direction = 'horizontal'; // 'horizontal' 横向 或 'vertical' 纵向
  const nodeWidth = 90;
  const nodeHeight = 44;
  const colGap = 120;
  const rowGap = 90;

  /***********************
   * 数据（示例）
   ***********************/
  const nodesData = [
    { id: "1", text: "1", target: ["2-1", "2-2"] },
    { id: "2-1", text: "2-1", target: ["3-1"] },
    { id: "2-2", text: "2-2", target: ["3-3"] },
    { id: "3-1", text: "3-1", target: ["4"] },
    { id: "3-3", text: "3-3", target: ["4"] },
    { id: "4", text: "4", target: [] }
  ];

  /***********************
   * 自动计算布局
   ***********************/
  function autoLayout(nodesData) {
    const nodeMap = {};
    const inDegree = {};
    const edges = [];

    // 初始化
    nodesData.forEach(node => {
      nodeMap[node.id] = { ...node, col: 0, row: 0 };
      inDegree[node.id] = 0;
    });

    // 构建边和入度
    nodesData.forEach(node => {
      (node.target || []).forEach(targetId => {
        edges.push([node.id, targetId]);
        inDegree[targetId]++;
      });
    });

    // 拓扑排序计算 col
    const queue = [];
    nodesData.forEach(node => {
      if (inDegree[node.id] === 0) {
        queue.push(node.id);
        nodeMap[node.id].col = 0;
      }
    });

    while (queue.length > 0) {
      const current = queue.shift();
      const currentNode = nodeMap[current];

      (nodesData.find(n => n.id === current).target || []).forEach(targetId => {
        nodeMap[targetId].col = Math.max(nodeMap[targetId].col, currentNode.col + 1);
        inDegree[targetId]--;
        if (inDegree[targetId] === 0) {
          queue.push(targetId);
        }
      });
    }

    // 按列分组
    const columns = {};
    Object.values(nodeMap).forEach(node => {
      if (!columns[node.col]) columns[node.col] = [];
      columns[node.col].push(node);
    });

    // 计算 row（居中对齐）
    const maxNodesInColumn = Math.max(...Object.values(columns).map(col => col.length));
    Object.values(columns).forEach(colNodes => {
      const offset = (maxNodesInColumn - colNodes.length) / 2;
      colNodes.forEach((node, index) => {
        node.row = offset + index;
      });
    });

    return {
      nodes: Object.values(nodeMap),
      edges: edges
    };
  }

  const { nodes, edges } = autoLayout(nodesData);

  /***********************
   * SVG 引用
   ***********************/
  const svg = document.getElementById("graph");
  const viewport = document.getElementById("viewport");
  const nodeMap = {};

  /***********************
   * 工具函数
   ***********************/
  function getPos(node) {
    if (direction === 'horizontal') {
      // 横向：col 控制 x，row 控制 y
      return {
        x: node.col * colGap + 60,
        y: node.row * rowGap + 40
      };
    } else {
      // 纵向：col 控制 y，row 控制 x
      return {
        x: node.row * colGap + 60,
        y: node.col * rowGap + 40
      };
    }
  }

  function createSVG(tag) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
  }

  /***********************
   * 画节点
   ***********************/
  nodes.forEach(node => {
    const { x, y } = getPos(node);

    const rect = createSVG("rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", nodeWidth);
    rect.setAttribute("height", nodeHeight);
    rect.setAttribute("rx", 6);
    rect.setAttribute("fill", "#fff");
    rect.setAttribute("stroke", "#333");
    rect.style.cursor = "pointer";

    rect.addEventListener("mousedown", e => e.stopPropagation());
    rect.addEventListener("click", () => {
      alert("点击节点：" + node.id);
    });

    const text = createSVG("text");
    text.setAttribute("x", x + nodeWidth / 2);
    text.setAttribute("y", y + nodeHeight / 2);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "#333");
    text.style.pointerEvents = "none";
    text.textContent = node.text;

    viewport.appendChild(rect);
    viewport.appendChild(text);

    nodeMap[node.id] = { x, y };
  });

  /***********************
   * 画贝塞尔曲线
   ***********************/
  function drawCurve(from, to) {
    let startX, startY, endX, endY, offset;
    const path = createSVG("path");

    if (direction === 'horizontal') {
      // 横向：从右边连到左边
      startX = from.x + nodeWidth;
      startY = from.y + nodeHeight / 2;
      endX = to.x;
      endY = to.y + nodeHeight / 2;
      offset = (endX - startX) * 0.5;

      path.setAttribute(
        "d",
        `M ${startX} ${startY}
         C ${startX + offset} ${startY},
           ${endX - offset} ${endY},
           ${endX} ${endY}`
      );
    } else {
      // 纵向：从下边连到上边
      startX = from.x + nodeWidth / 2;
      startY = from.y + nodeHeight;
      endX = to.x + nodeWidth / 2;
      endY = to.y;
      offset = (endY - startY) * 0.5;

      path.setAttribute(
        "d",
        `M ${startX} ${startY}
         C ${startX} ${startY + offset},
           ${endX} ${endY - offset},
           ${endX} ${endY}`
      );
    }

    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#999");
    path.setAttribute("stroke-width", "1.5");

    viewport.insertBefore(path, viewport.firstChild);
  }

  edges.forEach(([from, to]) => {
    drawCurve(nodeMap[from], nodeMap[to]);
  });

  /***********************
   * 拖动 & 缩放
   ***********************/
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;

  svg.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  window.addEventListener("mousemove", e => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    viewport.setAttribute(
      "transform",
      `translate(${translateX + dx}, ${translateY + dy}) scale(${scale})`
    );
  });

  window.addEventListener("mouseup", e => {
    if (!isDragging) return;

    translateX += e.clientX - startX;
    translateY += e.clientY - startY;
    isDragging = false;
  });

  svg.addEventListener("wheel", e => {
    e.preventDefault();

    const zoom = e.deltaY > 0 ? 0.9 : 1.1;
    scale *= zoom;

    viewport.setAttribute(
      "transform",
      `translate(${translateX}, ${translateY}) scale(${scale})`
    );
  });
</script>

</body>
</html>
```

</details>

### Vue 示例代码

<details>
<summary>点击查看完整 Vue 代码</summary>

<<< ./components/SvgFlowChart.vue
</details>

## 使用方法

1. **修改数据**：修改 `nodesData` 数组来定义你的流程图结构
2. **切换方向**：修改 `direction` 变量为 `'horizontal'` 或 `'vertical'`
3. **调整样式**：修改 `nodeWidth`、`nodeHeight`、`colGap`、`rowGap` 等参数

## 优势与应用场景

### 优势

- 🚀 **性能优秀**：原生 SVG 渲染，性能卓越
- 📦 **体积小巧**：无第三方依赖，代码量少
- 🎨 **易于定制**：直接操作 SVG 元素，样式自由
- 🔧 **灵活扩展**：可轻松添加更多交互功能

### 应用场景

- 工作流程图展示
- 组织架构图
- 数据流向图
- 状态机可视化
- 决策树展示

## 扩展功能

可以进一步扩展的功能：

- 添加箭头指示方向
- 支持不同形状的节点（圆形、菱形等）
- 节点拖拽编辑
- 连接线标签
- 导出为图片
- 节点折叠/展开
- 小地图导航

## 总结

这是一个轻量级的 SVG 流程图解决方案，适合对性能和体积有要求的场景。通过原生 SVG API 实现，代码简洁易懂，方便学习和定制。
