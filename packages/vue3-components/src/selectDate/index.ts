// 整合导出
import { withInstall } from "@tomiaa/utils"

import selectDate from "./src/selectDate.vue"

export const KSelectDate = withInstall(selectDate)
export default KSelectDate

export * from "./src/selectDate"

// 定义组件的 ts 类型，在全局引入时可以有 ts 类型提示。
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    KSelectDate: typeof KSelectDate
  }
}
