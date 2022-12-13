import { ExtractPropTypes } from "vue"
interface DataType {
  code: string
  name: string
}

// 省市区数据结构
export interface SelectAreaItem extends DataType {
  children?: SelectAreaItem[]
}

/**
 * change 事件: 省 市 区
 */
interface SelectAreaChange {
  provinceData: DataType // 省
  cityData: DataType // 市
  areaData: DataType // 区
}

/**
 * 事件
 */
export type SelectAreaEmits = {
  change(data: SelectAreaChange): void
}

/**
 * 属性
 */
export const selectAreaProps = {
  provinceAttrs: Object,
  cityAttrs: Object,
  areaAttrs: Object,
} as const

/**
 * 属性
 */
export type SelectAreaProps = ExtractPropTypes<typeof selectAreaProps>
