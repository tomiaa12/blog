import { createApp } from "vue"
import App from "./App.vue"
import element from "element-plus"
import "element-plus/dist/index.css"
// import { createRouter, createWebHistory } from "vue-router"
// import KComponents from "@tomiaa/vue3-components/src"
import * as icons from "@element-plus/icons-vue"
import zhCn from "element-plus/es/locale/lang/zh-cn"
// import A from "./A.vue"
// import B from "./B.vue"
// import C from "./C.vue"
import { createI18n } from "vue-i18n"
import LottieAnimation from "lottie-web-vue"
import "./index.css"
// const router = createRouter({
//   history: createWebHistory(),
//   routes: [
//     {
//       name: "12312",
//       path: "/aa",
//       component: A,
//       children: [
//         {
//           name: "12312",
//           path: "/aa/b",
//           component: B,
//           children: [
//             {
//               name: "12312",
//               path: "/aa/b/c",
//               component: C,
//             },
//           ],
//         },
//       ],
//     },
//   ],
// })
// router.beforeEach(() => {
//   console.log(1)
// })
export const i18n = createI18n({
  messages: {
    zhCN: {
      名称: "名称",
      顺序: "顺序",
      文件: "文件",
      状态: "状态",
      操作: "操作",
    },
    zhTW: {
      名称: "1名称",
      顺序: "1顺序",
      文件: "1文件",
      状态: "1状态",
      操作: "1操作",
    },
  },
  legacy: false,
})
i18n.global.locale.value = "zhCN"

const app = createApp(App)

// app.use(router)

Object.keys(icons).forEach(key => {
  app.component("ElIcon" + key, (icons as any)[key])
})
app.use(element, {
  locale: zhCn,
})
app.use(LottieAnimation as any)
// app.use(i18n as any)

// app.use(KComponents)
app.mount("#app")
