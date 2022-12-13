import { ExtractPropTypes, PropType } from "vue"
export const trendProps = {
  type: {
    // up: 上升箭头，down: 下降箭头
    // 图标上下箭头
    type: String as PropType<"up" | "down">,
    default: "up",
  },
  text: {
    // 文字
    type: String,
    default: "上升",
  },
  upIconColor: {
    // 上升箭头颜色
    type: String,
    default: "#f5222d",
  },
  downIconColor: {
    // 下降箭头颜色
    type: String,
    default: "#52c41a",
  },
  reverseColor: Boolean, // 颜色反转
  upTextColor: {
    // 上升文字颜色
    type: String,
    default: "#f5222d",
  },
  downTextColor: {
    // 下降文字颜色
    type: String,
    default: "#52c41a",
  },
  upIcon: {
    // 上升图标组件名
    type: String,
    default: "ElIconArrowUp",
  },
  downIcon: {
    // 下降图标组件名
    type: String,
    default: "ElIconArrowDown",
  },
} as const

export type TrendProps = ExtractPropTypes<typeof trendProps>
