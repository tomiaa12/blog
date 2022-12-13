// 整合导出
import { withInstall } from "@tomiaa/utils"

import selectTime from "./src/selectTime.vue"

export const KSelectTime = withInstall(selectTime)
export default KSelectTime

export * from "./src/selectTime"

// 定义组件的 ts 类型，在全局引入时可以有 ts 类型提示。
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    KSelectTime: typeof KSelectTime
  }
}
