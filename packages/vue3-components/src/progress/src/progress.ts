import { ExtractPropTypes } from "vue"
export const progressProps = {
  percentage: {
    // 进度
    type: Number,
    required: true,
  },
  duration: {
    // 动画时长
    type: Number,
    default: 3000,
  },
} as const

export type ProgressProps = ExtractPropTypes<typeof progressProps>
