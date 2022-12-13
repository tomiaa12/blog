import { ExtractPropTypes, PropType } from "vue"
// 列表的每一项
export interface NotificationListItem {
  // 头像
  avatar?: string
  // 标题
  title?: string
  // 描述
  desc?: string
  // 时间
  time?: string
  // 标签
  tag?: string
  // 标签类型
  tagType?: "" | "success" | "info" | "warning" | "danger"
}

// 列表
export interface NotificationListOptions {
  title: string
  content: NotificationListItem[]
}
// 底部操作栏
export interface NotificationActionOptions {
  text: string
  icon?: string
}
export const notificationProps = {
  // 图标组件
  icon: {
    type: String,
    default: "ElIconBell",
  },
  // 数量
  value: [String, Number] as PropType<string | number>,
  // 最大值
  max: Number,
  // 是否显示小圆点
  isDot: Boolean,

  // 列表内容
  list: {
    type: Array as PropType<NotificationListOptions[]>,
    required: true,
  },
  // 底部操作内容
  actions: Array as PropType<NotificationActionOptions[]>,
} as const

export type NotificationProps = ExtractPropTypes<typeof notificationProps>

export type NotificationEmits = {
  clickItem: (arg: { item: NotificationListItem; index: number }) => void
  clickAction: (arg: { item: NotificationActionOptions; index: number }) => void
}
