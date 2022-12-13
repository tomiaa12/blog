import {
  ExtractPropTypes,
  PropType,
  DefineComponent,
  CSSProperties,
  Ref,
} from "vue"
import { dialogProps, dialogEmits, ElCol } from "element-plus"
import {
  HTMLElementDeprecatedTagNameMap,
  HTMLElementTagNameMap,
  SVGElementTagNameMap,
  ElNodeName,
  ElementProps,
} from "@tomiaa/utils"
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
import KForm from ".."

export const formProps = {
  // 合并 dialog 的属性
  ...dialogProps,

  // 在弹窗中显示，modelValue 存在也会视为弹窗
  modelValue: {
    type: Boolean,
    default: undefined,
    required: false,
  },

  // 显示操作栏，为 true 时且弹窗时存在 footer 插槽时不会生效
  showActions: {
    type: Boolean,
    default: true,
  },
  // 操作栏配置
  actionsConfig: {
    type: Object as PropType<ActionsConfig>,
    default: () => ({}),
  },

  // 表单配置
  options: {
    type: Array as PropType<FormOptions[]>,
    default: () => [],
  },

  // el-form 的 model，接收用于双向绑定
  model: {
    type: Object,
    default: () => ({}),
  },

  // submit 时自动校验，校验通过后触发 @submit 事件
  autoValidateOnSubmit: {
    type: Boolean,
    default: true,
  },
} as const

// 操作栏配置
type ActionsConfig = {
  showCancel?: boolean
  cancelText?: string
  showReset?: boolean
  resetText?: string
  showSubmit?: boolean
  submitText?: string
  // 自定义控制栏
  custom?: (list: { [prop: string]: any }[]) => { [prop: string]: any }[]
} & Pick<InstanceType<typeof ElCol>["$props"]>

// 去除 DefineComponent 不需要的属性
type OmitBaseProps<T> = Omit<T, keyof InstanceType<DefineComponent>["$props"]>

// 继承并设为可选值
type Pick<T> = {
  [P in keyof OmitBaseProps<T>]?: any
}

// 表单配置
export type FormOptions =
  // KCustomElement 属性
  | DefineComponent
  // element 表单组件，事件属性合并
  | (ElementProps & {
      [prop: string | number | symbol]: any
      el?:
        | ElNodeName
        | "editor"
        | keyof HTMLElementDeprecatedTagNameMap
        | keyof HTMLElementTagNameMap
        | keyof SVGElementTagNameMap
        // eslint-disable-next-line
        | (string & {}) // 有字面量提示的同时还能是 string
        | { [prop: string | number | symbol]: any }

      // 富文本框
      editorAttrs?: Pick<InstanceType<typeof Editor>["$props"]>

      // 富文本工具栏
      toolbarAttrs?: Pick<InstanceType<typeof Toolbar>["$props"]>

      style?: CSSProperties

      /* 插槽 */
      // 表单项的子元素
      children?:
        | FormOptions
        | FormOptions[]
        | DefineComponent
        | DefineComponent[]
        | string
        | Ref<any>
      // 插槽名称(存在则视为插槽)
      slot?: string
      // 传递给深层次的插槽名称
      deepSlot?: string
      // 外层的插槽是否在 el-form-item 组件内
      // slotToFormItem?: boolean
    })

export type FormProps = ExtractPropTypes<typeof formProps>

export const formEmits = {
  ...dialogEmits,

  submit: null, // 提交
  reset: null, // 重置
  cancel: null, // 取消
  submitCheckFail: null, // autoValidateOnSubmit 为 true 时，submit 校验 form 失败
  "update:model": null, // 同步model
}

export type FormEmits = ExtractPropTypes<typeof formEmits>

export type FormInstance = InstanceType<typeof KForm>
