// 整合导出
import { withInstall } from "@tomiaa/utils"
import { ElForm, ElDialog, ElRow } from "element-plus"
import form from "./src/form"

export const KForm = withInstall(form)
export default KForm

export * from "./src/props"

// 定义组件的 ts 类型，在全局引入时可以有 ts 类型提示。
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    KForm: typeof KForm & typeof ElForm & typeof ElDialog & typeof ElRow
  }
}
