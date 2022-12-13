import { ExtractPropTypes } from "vue"
export const selectTimeProps = {
  startTime: {
    // 开始时间
    type: String,
    required: true,
  },
  endTime: {
    // 结束时间
    type: String,
    required: true,
  },
  startTimeStart: String, // 开始时间能选择的最早时间 默认 09:00
  startTimeEnd: String, // 开始时间能选择的最晚时间 默认 18:00
  endTimeStart: String, // 结束时间能选择的最早时间 默认 09:00
  endTimeEnd: String, // 结束时间能选择的最晚时间 默认 18:00
  startTimeStep: String, // 开始时间间隔 默认 	00:30
  endTimeStep: String, // 结束时间间隔 默认 	00:30
  startTimePlaceholder: {
    // 开始时间占位符
    type: String,
    default: "请选择开始时间",
  },
  endTimePlaceholder: {
    // 结束时间占位符
    type: String,
    default: "请选择结束时间",
  },
  enTimeDisabled: Boolean, // 未选择开始时间时是否禁用结束时间
  startTimeAttrs: Object, // 开始时间选择器（el-time-select）属性
  endTimeAttrs: Object, // 结束时间选择器（el-time-select）属性
} as const

export type SelectTimeProps = ExtractPropTypes<typeof selectTimeProps>
