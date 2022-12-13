import { ExtractPropTypes, PropType, DefineComponent, Ref } from "vue"
import { CSSProperties } from "vue"

export interface Component {
  name?: string
  render?(): void
  __file?: string
}

// 自定义渲染组件-无限级
export interface CustomElement {
  // 标签名/组件
  el: string | { [props: string | number | symbol]: any }
  // v-if
  vIf?: boolean
  "v-if"?: boolean

  // 属性
  style?: CSSProperties
  // 插槽
  slot?: string
  // 传递给深层次的插槽名称
  deepSlot?: string
  // 子项
  children?:
    | (CustomElement | DefineComponent)[]
    | string
    | DefineComponent
    | CustomElement
    | Ref<any>

  [prop: string | number | symbol]: any
}
// props
export const customElementProps = {
  list: {
    type: [Array, Object] as PropType<
      CustomElement | DefineComponent | (CustomElement | DefineComponent)[]
    >,
    default: () => [],
  },

  // 表单同步
  model: {
    type: Object,
  },
} as const

export type CustomElementProps = ExtractPropTypes<typeof customElementProps>
