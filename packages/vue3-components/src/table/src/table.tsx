import qs from "qs"
import { KCustomElement, FormOptions } from "../../"
import { tableProps, TableProps, tableEmits, TableOptions } from "./props"

import { defineComponent, toRef, ref, onMounted, nextTick, unref } from "vue"

import { Edit, Check, Close } from "@element-plus/icons-vue"
import { createNamespacs, getI18nKey, getValue } from "@tomiaa/utils"
import "@tomiaa/theme-chalk/lib/vue3-components/table.css"

import { useI18n } from "vue-i18n"

import {
  ElTable,
  ElTableColumn,
  ElPagination,
  vLoading,
  ElIcon,
} from "element-plus"
import "element-plus/theme-chalk/el-table.css"
import "element-plus/theme-chalk/el-pagination.css"

const bem = createNamespacs("table")

export default defineComponent({
  name: "KTable",
  directives: { loading: vLoading },
  props: tableProps,
  emits: tableEmits,
  setup(props, { attrs, slots, emit, expose }) {
    const { t } = useI18n()

    const emptyTip = ref("")
    const elLoadingText = ref("")
    const {
      append,
      // 自动获取数据时显示文字提示，而不是空状态
      empty = () => props.emptyTip && loading.value && emptyTip.value,
      page, // 分页插槽
      editControlIcon, // 编辑确认取消插槽
      editIcon, // 单元格编辑按钮插槽
    } = slots

    // 编辑行的index
    const isEditRowIndex = ref<any>({})
    // 编辑行绑定的model
    const editRowModel = ref<any>({})

    // 渲染 ElTableColumn 列
    const renderColumn = (options: TableProps["options"]) =>
      options?.map(item => {
        // 属性可以是 ref 同步
        const attr: TableOptions = {}
        for (const k in item) {
          attr[k] = unref(item[k])
        }

        // i18n 国际化支持
        for (const k in item) {
          const key = getI18nKey(item[k])
          if (key) attr[k] = t(key) // 重点，这里改变的是 attr 的值，并不会直接改变原始 item 的引用
        }

        const {
          // 取出自定义的属性
          slot, // 插槽名
          action, // 操作栏
          actionConfig, // 操作栏配置
          editable, // 单元格编辑
          editableConfig, // 单元格内编辑配置
          // 剩余的就是 element-column 的属性
          ...restItem
        } = attr

        // isEdit[单元格key]: boolean 确定哪个单元格被编辑
        const isEdit = ref<any>({})

        // model[单元格key]: string 当前编辑的 model-value
        const model = ref<any>({})

        const colSlots: any = {
          header: slots.header, // 表头
          default(scope: any) {
            // 自定义插槽
            if (slot) return slots[slot]?.(scope)

            // 操作栏
            if (action || actionConfig) {
              const { $index, row } = scope

              let defaultActions: FormOptions[] = [
                {
                  el: "el-button",
                  size: "small",
                  "v-if":
                    typeof actionConfig?.showEdit !== "undefined"
                      ? actionConfig?.showEdit
                      : props.actionConfig.showEdit,
                  onClick: () => {
                    if (props.editRow) {
                      if (isEditRowIndex.value[$index]) {
                        // 确认编辑行
                        Object.assign(scope.row, editRowModel.value[$index])
                        delete editRowModel.value[$index]
                        delete isEditRowIndex.value[$index]
                        emit("confirmEditRow", scope)
                        return
                      }
                      // 打开编辑行
                      editRowModel.value[$index] = JSON.parse(
                        JSON.stringify(row)
                      )
                      isEditRowIndex.value[$index] = true
                    }
                    emit("edit", scope)
                  },
                  children: isEditRowIndex.value[$index]
                    ? actionConfig?.editRowEnterText ||
                      props.actionConfig.editRowEnterText ||
                      "确定"
                    : actionConfig?.editText ||
                      props.actionConfig.editText ||
                      "编辑",
                },
                {
                  el: "el-button",
                  size: "small",
                  type: "danger",
                  "v-if":
                    typeof actionConfig?.showDelete !== "undefined"
                      ? actionConfig?.showDelete
                      : props.actionConfig.showDelete,
                  onClick: () => {
                    // 取消编辑行
                    if (props.editRow) {
                      delete editRowModel.value[$index]
                      delete isEditRowIndex.value[$index]
                      emit("cancelEditRow", scope)
                      return
                    }
                    emit("delete", scope)
                  },
                  children: isEditRowIndex.value[$index]
                    ? actionConfig?.editRowCloseText ||
                      props.actionConfig.editRowCloseText ||
                      "取消"
                    : actionConfig?.deleteText ||
                      props.actionConfig?.deleteText ||
                      "删除",
                },
              ]

              if (props.actionConfig.custom) {
                // 全局自定义方法
                defaultActions = props.actionConfig.custom(
                  defaultActions,
                  scope
                )
              }
              if (actionConfig?.custom) {
                // 自定义方法
                defaultActions = actionConfig.custom(defaultActions, scope)
              }
              return <KCustomElement list={defaultActions as any} />
            }

            // 单元格内编辑
            if (editable || editableConfig) {
              const { row, column, $index } = scope

              // isEdit 的唯一单元格 key
              const key: string = column.id + $index

              // 默认编辑单元格确认 取消
              const closeEdit = () => {
                delete model.value[key]
                delete isEdit.value[key]
              }

              let defaultEditables: FormOptions[] = [
                {
                  el: "el-icon",
                  color: "var(--el-color-success)",
                  size: "1.2em",
                  "v-if": editableConfig?.showEnter,
                  onClick() {
                    row[column.property] = model.value[key]
                    closeEdit()
                    emit("confirmEditCell", scope)
                  },
                  children: Check,
                },
                {
                  el: "el-icon",
                  size: "1.2em",
                  color: "var(--el-color-danger)",
                  "v-if": editableConfig?.showClose,
                  onClick() {
                    closeEdit()
                    emit("cancelEditCell", scope)
                  },
                  children: Close,
                },
              ]

              // 自定义编辑中按钮配置
              if (editableConfig?.custom) {
                defaultEditables = editableConfig.custom(
                  defaultEditables,
                  scope,
                  toRef(isEdit.value, key)
                )
              }
              return (
                <div
                  class={[
                    bem.e("editable"),
                    bem.is("editable", isEdit.value[key]),
                  ]}
                >
                  {isEdit.value[key] ? (
                    // 编辑单元格时-输入框
                    <el-input
                      size="small"
                      v-model={model.value[key]}
                    />
                  ) : (
                    // 没有编辑时
                    row[column.property]
                  )}

                  {isEdit.value[key] ? (
                    <>
                      {
                        // 编辑确认取消按钮
                        editControlIcon?.({
                          ...scope,
                          isEdit: toRef(isEdit.value, key),
                        }) || <KCustomElement list={defaultEditables as any} />
                      }
                    </>
                  ) : // 编辑图标
                  editIcon ? (
                    <span
                      onClick={() => {
                        model.value[key] = row[column.property]
                      }}
                    >
                      {editIcon({
                        ...scope,
                        isEdit: toRef(isEdit.value, key),
                      })}
                    </span>
                  ) : (
                    <ElIcon
                      size="1.2em"
                      onClick={() => {
                        model.value[key] = row[column.property]
                        isEdit.value[key] = !isEdit.value[key]
                      }}
                    >
                      <Edit />
                    </ElIcon>
                  )}
                </div>
              )
            }

            // 编辑行
            if (props.editRow) {
              const { row, column, $index } = scope
              return (
                <div
                  class={[
                    bem.e("editable"),
                    bem.is("editable", isEditRowIndex.value[$index]),
                  ]}
                >
                  {isEditRowIndex.value[$index] ? (
                    // 编辑单元格时-输入框
                    <el-input
                      size="small"
                      v-model={editRowModel.value[$index][column.property]}
                    />
                  ) : (
                    // 没有编辑时
                    row[column.property]
                  )}
                </div>
              )
            }
          },
        }

        return <ElTableColumn {...(restItem as any)}>{colSlots}</ElTableColumn>
      })

    // 渲染分页
    const renderPagination = () => {
      return (
        <ElPagination
          class={bem.b("pagination")}
          defaultCurrentPage={props.defaultCurrentPage}
          defaultPageSize={props.defaultPageSize}
          currentPage={currentPage.value}
          pageSize={pageSize.value}
          total={total.value}
          ref={paginationRef}
          layout="->,sizes,prev,pager,next,jumper,total"
          hide-on-single-page
          {...attrs}
          onUpdate:current-page={async (num: number) => {
            currentPage.value = num
            await nextTick()
            getData()
          }}
          onUpdate:page-size={async (num: number) => {
            pageSize.value = num
            await nextTick()
            getData()
          }}
          v-slots={{ default: page }}
        />
      )
    }
    // 自动请求数据
    const paginationRef = ref()
    const tableRef = ref()

    const data = ref(null)
    const total = ref(0)

    const currentPage = ref(props.defaultCurrentPage || 1)
    const pageSize = ref(props.defaultPageSize || 10)

    const loading = ref(false)
    const getData = () => {
      loading.value = true
      data.value = null

      // 空状态的提示
      let emptyTimer: undefined | any
      if (props.emptyTip) {
        emptyTip.value = props.emptyTip
        clearTimeout(emptyTimer)
        emptyTimer = setTimeout(() => {
          emptyTip.value = props.emptyTipTimeoutText
        }, props.emptyTipTimeout)
      }

      // v-loading 提示
      let loadingTimer: undefined | any
      if (props.elLoadingTextTimeoutText) {
        elLoadingText.value = props.elementLoadingText
        clearTimeout(loadingTimer)
        setTimeout(() => {
          const el = document.querySelector(".el-loading-text")
          el && (el.innerHTML = props.elLoadingTextTimeoutText)
        }, props.elLoadingTextTimeout)
      }

      const server = props.server // axios 实例
      // 分页参数
      const reqPage = {
        [props.replaceFields?.pageSize || "pageSize"]:
          paginationRef.value.pageSize,
        [props.replaceFields?.currentPage || "currentPage"]:
          paginationRef.value.currentPage,
      }

      const withConfig: any = {} // 携带参数

      if (props.withDataPath !== false) {
        // false 时不携带参数

        // get 与 post 携带的数据字段
        const key: any = { get: "params", post: "data" }
        const withDataPath =
          props.withDataPath ||
          key[(props.getConfig?.method || "get").toLocaleLowerCase()] // 不是 get 或 post 时为 undefined

        if (withDataPath) withConfig[withDataPath] = {}

        // 引用
        const target = withConfig[withDataPath] || withConfig
        // debugger
        // 合并分页
        Object.assign(
          target,
          props.withPagePath && typeof props.withPagePath === "string"
            ? { [props.withPagePath]: reqPage }
            : reqPage
        )

        // 合并 query
        Object.assign(
          target,
          props.withQueryPath && typeof props.withQueryPath === "string"
            ? { [props.withQueryPath]: props.withQuery }
            : props.withQuery
        )
      }

      const axiosConfig = {
        url: props.getUrl,
        ...withConfig,
        ...props.getConfig,
      }

      // 参数序列化
      if (props.stringify && axiosConfig.data)
        axiosConfig.data = qs.stringify(axiosConfig.data)

      emit("beforeGetData", axiosConfig)

      server(axiosConfig)
        .then(res => {
          emit("afterGetData", res)
          data.value = getValue(props.dataPath, res)
          total.value = getValue(props.totalPath, res)
        })
        .catch(res => {
          emit("failToGetData", res)
        })
        .finally(() => {
          clearTimeout(emptyTimer)
          clearTimeout(loadingTimer)
          loading.value = false
        })
    }
    props.showPagination && onMounted(getData)

    const exposeData: any = {
      getData,
    }
    onMounted(() => {
      exposeData.elPagination = paginationRef.value
      exposeData.elTable = tableRef.value
    })
    expose(exposeData)

    return () => (
      <div
        class={bem.b()}
        v-loading={props.showLoadInGet && loading.value}
        element-loading-text={elLoadingText.value}
        {...attrs}
      >
        <ElTable
          data={data.value as any}
          ref={tableRef}
          {...attrs}
          v-slots={{ append, empty }}
        >
          {renderColumn(props.options)}
        </ElTable>
        {props.showPagination && renderPagination()}
        {props.showLoadInGet && loading.value}
      </div>
    )
  },
})
