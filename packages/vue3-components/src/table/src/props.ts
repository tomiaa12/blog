import { ExtractPropTypes, PropType, Ref } from "vue"
import axios, { AxiosRequestConfig } from "axios"

export interface ActionConfig {
  editText?: string // 编辑的文字
  deleteText?: string // 删除的文字
  showEdit?: boolean // 显示编辑
  showDelete?: boolean // 显示删除
  editRowEnterText?: string // 编辑行时确认文字
  editRowCloseText?: string // 编辑行是取消文字
  // 自定义控制栏
  custom?: (
    list: { [prop: string]: any }[],
    scope: any
  ) => { [prop: string]: any }[]
}

// column 配置
export type TableOptions = {
  [prop: string | number | symbol]: any

  // 插槽名
  slot?: string

  // 操作栏
  action?: boolean
  // 操作栏配置
  actionConfig?: ActionConfig

  // 单元格内编辑
  editable?: boolean
  // 单元格内编辑配置
  editableConfig?: {
    showEnter?: boolean // 隐藏确认
    showClose?: boolean // 隐藏取消
    // 自定义
    custom?: (
      list: { [prop: string]: any }[],
      scope: any,
      isEdit: Ref<boolean>
    ) => { [prop: string]: any }[]
  }

  /* el-table-column 原始属性 */
  type?: "selection" | "index" | "expand"
  index?: number | ((index: number) => void)
  label?: string | Ref<any>
  columnKey?: string
  prop?: string
  width?: string | number
  minWidth?: string | number
  fixed?: true | "left" | "right"
  renderHeader?(data: { column: any; $index: number }): void
  sortable?: true | false | "custom"
  sortMethod?(a: number, b: number): number
  sortBy?: (row: any, index: number) => void | string | any[]
  sortOrders?: any[]
  resizable?: boolean
  formatter?(row: any, column: any, cellValue: any, index: number): void
  showOverflowTooltip?: boolean
  align?: "left" | "center" | "right"
  headerAlign?: "left" | "center" | "right"
  className?: string
  labelClassName?: string
  selectable?(row: any, index: number): boolean
  reserveSelection?: boolean
  filters?: { text: any; value: any }[]
  filterPlacement?:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end"
    | "right"
    | "right-start"
    | "right-end"
  filterMultiple?: boolean
  filterMethod?(value: any, row: any, column: any): void
  filteredValue?: any[]
}

export const tableProps = {
  options: Array as PropType<TableOptions[]>, // 表格配置

  // 点击编辑时是否编辑行
  editRow: Boolean,

  // 分页配置，为 true 时自动调用分页接口
  showPagination: {
    type: Boolean, // 是否显示分页
  },

  // 发送请求的 axios 实例
  server: {
    type: Function as PropType<(...rest: any[]) => Promise<any>>,
    default: axios,
  },
  // 获取分页的请求地址
  getUrl: String,
  // 获取分页时传入分页对象（pageSize，currentPage）,与 withQuery 在 axios 中的哪个字段，默认 get 请求为 params，post 请求为 data。false 为不携带参数
  withDataPath: {
    type: [String, Boolean] as PropType<string | boolean>,
    default: null,
  },
  // 获取分页时加入的分页对象参数在 axios 的哪个对象路径下，false 不携带
  withPagePath: {
    type: [String, Boolean] as PropType<string | boolean>,
    default: null,
  },
  // 请求时的查询参数
  withQuery: Object,
  // 获取分页时查询参数在 axios 的哪个对象路径下
  withQueryPath: {
    type: [String, Boolean] as PropType<string | boolean>,
    default: null,
  },
  // 发送请求是携带的参数序列化，withPage 为 "data" 时生效
  stringify: Boolean,
  // 请求分页的配置
  getConfig: {
    type: Object as PropType<AxiosRequestConfig>,
    default: () => ({
      method: "get",
    }),
  },
  // 要替换请求时分页参数的字段
  replaceFields: {
    type: Object as PropType<{ pageSize?: string; currentPage?: string }>,
    default: () => ({ pageSize: "pageSize", currentPage: "currentPage" }),
  },

  // 获取数据之后 data 数据的路径
  dataPath: {
    type: String,
    default: "data.data",
  },
  // 获取数据之后 总条数的路径
  totalPath: {
    type: String,
    default: "data.total",
  },

  // 自动获取数据时，在表格上显示 element 的 v-loading
  showLoadInGet: {
    type: Boolean,
    default: true,
  },
  // 显示在 v-loading 加载图标下方的加载文案
  elementLoadingText: {
    type: String,
    default: "正在加载中...",
  },
  // 超过多少毫秒后更换 v-loading 的 提示文字
  elLoadingTextTimeout: {
    type: Number,
    default: 8000,
  },
  // 超过 EmptyTipTimeout 毫秒后更换 v-loading 的 提示文字
  elLoadingTextTimeoutText: {
    type: String,
    default: "数据加载较慢，请耐心等待...",
  },

  // 在自动获取数据时，table 中显示提示的文字，为假值时则不显示
  emptyTip: {
    type: String,
    default: "正在加载中...",
  },
  // 超过多少毫秒后更换提示文字
  emptyTipTimeout: {
    type: Number,
    default: 8000,
  },
  // 超过 EmptyTipTimeout 毫秒后更换的提示文字
  emptyTipTimeoutText: {
    type: String,
    default: "数据加载较慢，请耐心等待...",
  },
  // 当前页数的初始值
  defaultCurrentPage: Number,
  // 每页显示条目数的初始值
  defaultPageSize: Number,

  // 全局的控制栏配置
  actionConfig: {
    type: Object as PropType<ActionConfig>,
    default: () => ({}),
  },
} as const

export type TableProps = ExtractPropTypes<typeof tableProps>

export const tableEmits = {
  edit: null, // 操作栏编辑
  delete: null, // 操作栏删除
  confirmEditRow: null, // 确定编辑行
  cancelEditRow: null, // 取消编辑行
  confirmEditCell: null, // 单元格内确定编辑
  cancelEditCell: null, // 单元格内取消编辑
  beforeGetData: (val: any) => typeof val === "object", // 自动请求分页之前
  afterGetData: (val: any) => typeof val === "object", // 自动请求分页成功后
  failToGetData: (val: any) => typeof val === "object", // 自动请求分页失败
}

export type TableEmits = ExtractPropTypes<typeof tableEmits>
