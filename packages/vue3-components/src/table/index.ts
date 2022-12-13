import { ElTable, ElPagination } from "element-plus"
// 整合导出
import { withInstall } from "@tomiaa/utils"

import table from "./src/table"

export const KTable = withInstall(table)
export default KTable

export * from "./src/props"

// 定义组件的 ts 类型，在全局引入时可以有 ts 类型提示。
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    KTable: typeof KTable & typeof ElTable & typeof ElPagination
  }
}
