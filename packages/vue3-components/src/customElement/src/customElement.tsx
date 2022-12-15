import {
  defineComponent,
  resolveComponent,
  unref,
  toRef,
  markRaw,
  getCurrentInstance,
  isVNode,
} from "vue"
import { customElementProps, CustomElementProps } from "./props"
import { getValue, setValue, getI18nKey } from "@tomiaa/utils"

import { useI18n } from "vue-i18n"

export default defineComponent({
  name: "KCustomElement",
  props: customElementProps,
  setup(props, { slots }) {
    let t = (str: string) => str
    if ((getCurrentInstance()?.appContext?.app as any)?.__VUE_I18N_SYMBOL__) {
      t = useI18n().t
    }

    // render 返回的数据是否为当前组件的插槽
    const isSlot = Symbol("isSlot")

    const render = (list: CustomElementProps["list"] = []): any => {
      list = unref(list)

      // 字符串
      if (typeof list === "string") {
        const str = getI18nKey(list)
        return str ? t(str) : list
      }

      // 列表渲染
      if (Array.isArray(list)) return list.map(render)

      // children 本身是组件
      if (list.setup || list.render || isVNode(list)) {
        list = markRaw(list)
        return <list />
      }

      // children 就是对象时

      // 属性可以是 ref 同步
      const attr: { [prop: string]: any } = {}
      for (const k in list) {
        attr[k] = unref(list[k])
      }

      // i18n 国际化支持
      for (const k in list) {
        const key = typeof list[k] === "string" && getI18nKey(list[k])
        if (key) attr[k] = t(key) // 重点，这里改变的是 attr 的值，并不会直接改变原始 list 的引用
      }

      const { el, children, vIf, slot, deepSlot = "default", ...rest } = attr
      // 当前组件是父组件的插槽
      if (slot) {
        return {
          // deepSlot 为传递给子组件的插槽名，默认使用父组件传递下来的插槽名
          [deepSlot]: slots[slot],
          // 用于判断父组件接受的是否为插槽
          [isSlot]: true,
        }
      }

      // 兼容 v-if/vIf
      if (vIf === false || attr["v-if"] === false) return

      let NodeName
      if (typeof el === "string") {
        /**
         * el 如果是不存于 vue 组件中，vue会抛出警告，修改 console.wran 屏蔽导入不是组件时的警告
         */
        const wran = console.warn
        console.warn = () => {} // eslint-disable-line
        NodeName = resolveComponent(el) as any
        console.warn = wran
      } else if (el?.setup || el?.render || isVNode(el)) {
        // el 本身是组件
        NodeName = markRaw(el)
      }

      if (
        attr.prop &&
        typeof attr.prop === "string" &&
        typeof props.model === "object"
      ) {
        rest.modelValue = getValue(list.prop || "", props.model)
        rest["onUpdate:modelValue"] = (value: any) => {
          setValue((list as any).prop, value, props.model)
        }
      }
      return (
        <NodeName
          {...rest}
          ref={el => {
            const temp = list as any
            if (typeof temp.ref === "function") temp.ref(el)
            else toRef(temp, "ref").value = el
          }}
        >
          {(() => {
            /* 对默认插槽与具名插槽处理 */
            let temp: { [prop: string | symbol]: any } = {}
            const child = render(children)
            if (!child) return
            if (Array.isArray(child)) {
              // 正常渲染
              temp.default = () => child.filter(i => !i[isSlot])
              // 插槽
              child.filter(i => i[isSlot]).forEach(i => Object.assign(temp, i))
            } else {
              // 为对象且是插槽
              if (child[isSlot]) temp = child
              // 正常渲染
              else temp.default = () => child
            }

            delete temp[isSlot]
            return temp
          })()}
        </NodeName>
      )
    }
    return () => render(props.list)
  },
})
