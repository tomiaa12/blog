import { Plugin } from "vue"
import KSelectArea from "./selectArea"
import KSelectDate from "./selectDate"
import KSelectTime from "./selectTime"
import KTrend from "./trend"
import KProgress from "./progress"
import KNotification from "./notification"
import KTable from "./table"
import KCustomElement from "./customElement"
import KForm from "./form"

const components = [
  KSelectArea,
  KSelectDate,
  KSelectTime,
  KTrend,
  KProgress,
  KNotification,
  KTable,
  KCustomElement,
  KForm,
]
// 全局注册
export const plugin: Plugin = {
  install(app) {
    components.forEach(app.use)
  },
}
