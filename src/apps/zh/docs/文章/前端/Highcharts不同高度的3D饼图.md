# Highcharts 不同高度的 3D 饼图

```vue
<template>
  <div
    ref="highchartcontainer"
    class="highchartcontainer"
  ></div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from "vue"
import Highcharts from "highcharts"
import "highcharts/highcharts-3d"

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  data: {
    type: Array,
    default: () => [],
  },
})
const emits = defineEmits([])

// 重写 pie 系列的 translate 方法，在标准转换后修改每个点的 depth
// Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, "translate", function (proceed) {
//   // 执行原有的 translate 方法
//   proceed.apply(this, Array.prototype.slice.call(arguments, 1));
//   // 使用 forEach 遍历每个数据点
//   this.points.forEach(function (point) {
//     if (point.options.customDepth) {
//       // 修改 shapeArgs.depth 来使用自定义的深度值
//       point.shapeArgs.depth = point.options.customDepth;
//     }
//   });
// });

// 修改3d饼图绘制过程
console.log(Highcharts, "Highcharts")
var each = Highcharts.each,
  round = Math.round,
  cos = Math.cos,
  sin = Math.sin,
  deg2rad = Math.deg2rad
Highcharts.wrap(
  Highcharts.seriesTypes.pie.prototype,
  "translate",
  function (proceed) {
    proceed.apply(this, [].slice.call(arguments, 1))
    // Do not do this if the chart is not 3D
    if (!this.chart.is3d()) {
      return
    }
    var series = this,
      chart = series.chart,
      options = chart.options,
      seriesOptions = series.options,
      depth = seriesOptions.depth || 0,
      options3d = options.chart.options3d,
      alpha = options3d.alpha,
      beta = options3d.beta,
      z = seriesOptions.stacking
        ? (seriesOptions.stack || 0) * depth
        : series._i * depth
    z += depth / 2
    if (seriesOptions.grouping !== false) {
      z = 0
    }
    series.data.forEach(point => {
      var shapeArgs = point.shapeArgs,
        angle
      point.shapeType = "arc3d"
      var ran = point.options.h
      shapeArgs.z = z
      shapeArgs.depth = depth * 0.75 + ran
      shapeArgs.alpha = alpha
      shapeArgs.beta = beta
      shapeArgs.center = series.center
      shapeArgs.ran = ran
      angle = (shapeArgs.end + shapeArgs.start) / 2
      point.slicedTranslation = {
        translateX: round(
          cos(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad)
        ),
        translateY: round(
          sin(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad)
        ),
      }
    })
    // each(series.data, function(point) {
    // });
  }
)
;(function (H) {
  H.wrap(Highcharts.SVGRenderer.prototype, "arc3dPath", function (proceed) {
    // Run original proceed method
    var ret = proceed.apply(this, [].slice.call(arguments, 1))
    ret.zTop = (ret.zOut + 0.5) / 100
    return ret
  })
})(Highcharts)

const highchartcontainer = ref(null)

const renderChart = () => {
  let data = JSON.parse(JSON.stringify(props.data))
  data.forEach(i => (i.y ??= 0))

  data = data.sort((a, b) => b.y - a.y)
  data = data.map(i => ({
    ...i,
    h: (i.y / data[0].y) * 20 || 1,
  }))

  const chart = Highcharts.chart(highchartcontainer.value, {
    chart: {
      type: "pie",
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
      events: {
        load: function () {
          var points = this.series[0].points
          points.forEach((p, i) => {
            p.graphic?.attr({
              translateY: -p.shapeArgs.ran,
            })
            p.graphic?.side1?.attr({
              translateY: -p.shapeArgs.ran,
            })
            p.graphic?.side2?.attr({
              translateY: -p.shapeArgs.ran,
            })
          })
        },
      },
      style: {
        fontSize: "12px", // 设置图表整体字体大小
      },
      backgroundColor: "transparent",
    },
    // 添加自定义调色盘
    colors: [
      "#00DAFF",
      "#E9E6CF",
      "#EF264D",
      "#ED7600",
      "#1BE237",
      "#f15c80",
      "#e4d354",
      "#2b908f",
      "#f45b5b",
      "#91e8e1",
    ],
    title: {
      text: props.title,
      verticalAlign: "bottom",
      y: 20,
      style: {
        color: "#9DD6FF",
        fontWeight: "bold",
      },
    },
    subtitle: {
      text: null,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        innerSize: "76%",
        depth: 40,
        opacity: 1,
        states: {
          hover: {
            opacity: 1,
            brightness: 0.1,
          },
        },
        dataLabels: {
          style: {
            color: "#fff",
            fontSize: "12px",
          },
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: "Medals",
        // data: props.data,
        states: {
          hover: {
            opacity: 1,
            brightness: 0.1,
          },
        },
        data,
        // data: [
        //   { name: "切片5", y: 144.0, h: 20, selected: true },
        //   { name: "切片4", y: 129.2, h: (129.2 / 144.0) * 20, selected: true },
        //   { name: "切片3", y: 106.4, h: (106.4 / 144.0) * 20, selected: true },
        //   { name: "切片2", y: 71.5, h: (71.5 / 144.0) * 20, selected: true },
        //   { name: "切片1", y: 29.9, h: (29.9 / 144.0) * 20, selected: true },
        // ],

        // ["Norway", 16],
        // ["Germany", 12],
        // ["USA", 8],
        // ["Sweden", 8],
        // ["Netherlands", 8],
        // ["ROC", 6],
        // ["Austria", 7],
        // ["Canada", 4],
        // ["Japan", 3],
      },
    ],

    credits: {
      enabled: false, //不显示LOGO
    },
  })
}

watch(() => props.data.length, renderChart, {
  immediate: true,
})

onMounted(renderChart)
</script>

<style lang="scss" scoped>
#highchartcontainer {
  font-size: 12px;
}
</style>
```
