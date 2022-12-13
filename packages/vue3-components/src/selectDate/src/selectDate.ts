import { PropType, ExtractPropTypes } from "vue"
export const selectDateProps = {
  startDate: {
    type: [Date, String, Number] as PropType<Date | string | number>,
    required: true,
  },
  endDate: {
    type: [Date, String, Number] as PropType<Date | string | number>,
    required: true,
  },
  startDatePlaceholder: {
    // 开始日期占位符
    type: String,
    default: "请选择开始日期",
  },
  endDatePlaceholder: {
    // 结束日期占位符
    type: String,
    default: "请选择结束日期",
  },
  enTimeDisabled: Boolean, // 未选择开始日期时是否禁用结束日期
  valueFormat: String, // 绑定时间格式
  format: String, // 界面显示时间格式
  // 显示类型
  type: String as PropType<
    | "year"
    | "month"
    | "date"
    | "dates"
    | "datetime"
    | "week"
    | "datetimerange"
    | "daterange"
    | "monthrange"
  >,
  startDateAttrs: Object, // 绑定在开始日期（el-date-picker）的属性
  endDateAttrs: Object, // 绑定在结束日期（el-date-picker）的属性
} as const

export type SelectDateProps = ExtractPropTypes<typeof selectDateProps>
