// 整合导出
import { withInstall } from "@tomiaa/utils"

import trend from "./src/trend.vue"

export const KTrend = withInstall(trend)
export default KTrend

export * from "./src/trend"

// 定义组件的 ts 类型，在全局引入时可以有 ts 类型提示。
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    KTrend: typeof KTrend
  }
}
