import { ElProgress } from "element-plus"
// 整合导出
import { withInstall } from "@tomiaa/utils"

import progress from "./src/progress.vue"

export const KProgress = withInstall(progress)
export default KProgress

export * from "./src/progress"

// 定义组件的 ts 类型，在全局引入时可以有 ts 类型提示。
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    KProgress: typeof KProgress & typeof ElProgress
  }
}
