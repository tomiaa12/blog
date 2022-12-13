// 整合导出
import { withInstall } from "@tomiaa/utils"

import customElement from "./src/customElement"

export const KCustomElement = withInstall(customElement)
export default KCustomElement

export * from "./src/props"

// 定义组件的 ts 类型，在全局引入时可以有 ts 类型提示。
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    KCustomElement: typeof KCustomElement
  }
}
