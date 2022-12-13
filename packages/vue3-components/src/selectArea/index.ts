// 整合导出
import { withInstall } from "@tomiaa/utils"

import SelectArea from "./src/selectArea.vue"

export const KSelectArea = withInstall(SelectArea)
export default KSelectArea

export * from "./src/selectArea"

// 定义组件的 ts 类型，在全局引入时可以有 ts 类型提示。
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    KSelectArea: typeof KSelectArea
  }
}
