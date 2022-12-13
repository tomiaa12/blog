// 整合导出
import { withInstall } from "@tomiaa/utils"

import notification from "./src/notification.vue"

export const KNotification = withInstall(notification)
export default KNotification

export * from "./src/notification"

// 定义组件的 ts 类型，在全局引入时可以有 ts 类型提示。
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    KNotification: typeof KNotification
  }
}
