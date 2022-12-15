import {
  defineComponent,
  ref,
  computed,
  toRef,
  unref,
  shallowRef,
  onMounted,
  watch,
  nextTick,
  ShallowRef,
} from "vue"
import { FormOptions, formProps, formEmits } from "./props"
import {
  dialogProps,
  dialogEmits,
  FormInstance,
  ElCol,
  ElFormItem,
} from "element-plus"
import {
  firstUppercase,
  pickObjByKeys,
  deepClone,
  omitObjByKeys,
} from "@tomiaa/utils"
import KCustomElement from "../../customElement"

// import * as wangeditor from "@wangeditor/editor-for-vue"
import "@wangeditor/editor/dist/css/style.css" // 引入 css
// const { Editor, Toolbar } = wangeditor

export default defineComponent({
  name: "KForm",
  props: formProps,
  emits: formEmits,
  setup(props, { attrs, slots, emit, expose }) {
    const isDialog = props.modelValue !== undefined

    // 行内表单
    const isInline = ["", false].includes(attrs.inline as any)

    // 提取 dialog 的属性
    const dialogAttrs = computed(() =>
      pickObjByKeys(props, Object.keys(dialogProps))
    )
    // 提取 dialog 的事件
    const dialogEmit: any = {}
    for (const k in dialogEmits) {
      dialogEmit["on" + firstUppercase(k)] = (...rest: any[]) =>
        emit(k as any, ...rest)
    }

    const dialogRef = ref()
    // 弹窗
    const renderDialog = () => {
      return (
        <el-dialog
          ref={dialogRef}
          {...dialogEmit}
          onClosed={() => {
            if (!props.destroyOnClose) return
            initFormModel()
            formRef.value?.resetFields()
          }}
          {...dialogAttrs.value}
        >
          {{
            footer: props.showActions ? renderActions : undefined,
            ...slots,
            default: renderForm,
          }}
        </el-dialog>
      )
    }

    // 操作栏
    const renderActions = () => {
      let defaultActions: FormOptions[] = [
        {
          el: "el-button",
          type: "primary",
          "v-if": props.actionsConfig.showSubmit,
          onClick() {
            const paylod = {
              formRef,
              dialogRef,
              formModel,
              validate: formRef.value?.validate,
              rawFormModel: getRawFormModel(),
            }

            // 点击提交时自动校验 form 表单
            if (props.autoValidateOnSubmit) {
              formRef.value?.validate((isPass: boolean) => {
                if (isPass) emit("submit", paylod)
                else emit("submitCheckFail", paylod)
              })
              return
            }

            emit("submit", paylod)
          },
          children: props.actionsConfig.submitText ?? "提交",
        },
        {
          el: "el-button",
          "v-if": props.actionsConfig.showReset,
          onClick() {
            formRef.value!.resetFields()
            emit("reset", {
              formRef,
              dialogRef,
              formModel,
              validate: formRef.value?.validate,
              rawFormModel: getRawFormModel(),
            })
          },
          children: props.actionsConfig.resetText ?? "重置",
        },
        {
          el: "el-button",
          "v-if": props.actionsConfig.showCancel,
          onClick() {
            emit("update:modelValue", false)
            emit("cancel")
          },
          children: props.actionsConfig.cancelText ?? "取消",
        },
      ]
      if (props.actionsConfig?.custom)
        // 自定义方法
        defaultActions = props.actionsConfig.custom(defaultActions)

      return isDialog ? (
        <KCustomElement list={defaultActions as any} />
      ) : isInline ? (
        <ElFormItem>
          <KCustomElement list={defaultActions as any} />
        </ElFormItem>
      ) : (
        <ElCol {...props.actionsConfig}>
          <ElFormItem>
            <KCustomElement list={defaultActions as any} />
          </ElFormItem>
        </ElCol>
      )
    }

    // form 表单
    const formRef = ref<FormInstance | null>()
    const formModel = ref(props.model)

    watch(formModel, value => {
      emit("update:model", value)
    })

    // 初始化 form 表单数据
    const initFormModel = () => {
      formModel.value = props.model
      props.options.forEach(i => {
        if (i.prop && typeof i.prop === "string") {
          const key = i.el === "el-upload" ? "fileList" : "modelValue"
          formModel.value[i.prop] = toRef(i, key)
        }
      })
    }
    initFormModel()

    // 获取解绑后的 form 表单数据
    const getRawFormModel = () => {
      const temp: { [prop: string]: any } = {}
      for (const k in formModel.value) {
        temp[k] = unref(formModel.value[k])
      }
      return temp
    }

    // 渲染 form
    const renderForm = () => {
      return (
        <el-form
          {...attrs}
          ref={formRef}
          model={formModel.value}
        >
          <el-row {...attrs}>
            {renderOptions(props.options)}
            {props.showActions && !isDialog && renderActions()}
          </el-row>
        </el-form>
      )
    }

    // 渲染表单配置
    const renderOptions = (list: FormOptions[]): any =>
      list.map((item: FormOptions) => {
        item = unref(item)

        // 二维数组时，用于动态表单，递归调用为了外层添加 el-col el-form-item
        if (Array.isArray(item)) return renderOptions(item)

        // v-model:modelValue 已经在 KCustomElement 绑定
        // 只需要处理 el-upload 的双向绑定
        if (item.el === "el-upload") {
          ;(item as any).fileList = formModel.value[item.prop as string]
          item["onUpdate:fileList"] = (value: any) => {
            if (
              Object.prototype.hasOwnProperty.call(formModel.value, item.prop)
            )
              formModel.value[item.prop as string] = value
          }
        }

        /* 当前项与 el-col, el-form-item 平级 */
        let temp = {
          ...pickObjByKeys(
            item,
            Object.keys(ElCol.props).concat("vIf", "v-if")
          ),
          class: item.class ? `${item.class}__el-col` : "",
          el: "el-col",
          children: {
            ...pickObjByKeys(item, Object.keys(ElFormItem.props)),
            class: item.class ? `${item.class}__el-form-item` : "",
            el: "el-form-item",
            children: item,
          },
        } as FormOptions

        // form 是行内表单时去除外层添加的 el-col
        if (isInline) {
          temp = temp.children
        }

        /* 富文本 */
        if (item.el === "editor") temp.children.children = renderEditor(item)

        return (
          <KCustomElement
            model={formModel.value}
            list={temp as any}
          >
            {slots}
          </KCustomElement>
        )
      })

    /* 渲染富文本 */
    const editorRef = shallowRef<{ [prop: string]: ShallowRef }>({})
    const renderEditor = async (item: FormOptions) => {
      if (item.prop && !editorRef.value[item.prop])
        editorRef.value[item.prop] = shallowRef()
      if (typeof window === "undefined") {
        return <></>
      }
      const { Toolbar, Editor } = await import("@wangeditor/editor-for-vue")
      return (
        <>
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            mode="default"
            editor={item.prop && editorRef.value[item.prop].value}
            {...item.editorAttrs}
          />
          <Editor
            style="height: 300px; width: 100%; overflow-y: hidden"
            mode="default"
            modelValue={formModel.value[item.prop as string]}
            onUpdate:model-value={(value: any) => {
              if (
                Object.prototype.hasOwnProperty.call(formModel.value, item.prop)
              )
                formModel.value[item.prop as string] = value
            }}
            onOnCreated={(editor: any) => {
              if (!item.prop) return
              editorRef.value[item.prop].value = editor

              if (typeof item.ref === "function") item.ref(editor)
              else toRef(item, "ref").value = editor
            }}
            {...item.toolbarAttrs}
          />
        </>
      )
    }

    /* 设置 form 表单 */
    const setFormModel = async (
      data: { [prop: string]: any },
      {
        includes = [...props.options.map(i => i.prop).filter(i => i), "id"],
        exclude = [],
      }: { includes?: string[]; exclude?: string[] } = {}
    ) => {
      data = deepClone(data)
      let temp = includes?.length ? pickObjByKeys(data, includes) : data
      exclude?.length && (temp = omitObjByKeys(temp, exclude))
      await nextTick()
      Object.assign(formModel.value, temp)
    }

    /* 对外暴露 */
    const exposeData: { [prop: string]: any } = {
      initFormModel,
      getRawFormModel,
      setFormModel,
      getFormRef: () => formRef,
      getDialogRef: () => dialogRef,
      formModel,
    }

    const assignRef = async () => {
      await nextTick()
      // 合并 el-form, el-dialog 抛出的方法再向上抛出
      Object.assign(exposeData, formRef.value)
      Object.assign(exposeData, dialogRef.value)
    }
    onMounted(assignRef)
    watch(() => props.modelValue, assignRef)

    expose(exposeData)

    return () => <div>{isDialog ? renderDialog() : renderForm()}</div>
  },
})
