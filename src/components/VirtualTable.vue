<template>
  <div
    class="virtual-table"
    :style="{ height: containerHeight }"
  >
    <el-auto-resizer>
      <template #default="{ height: h, width: w }">
        <el-table-v2
          :columns="internalColumns"
          :data="data"
          :width="w"
          :height="h"
          :row-height="rowHeight"
          :header-height="headerHeight"
        />
      </template>
    </el-auto-resizer>
  </div>
</template>

<!-- 导出类型供父组件使用：import type { ColumnConfig } from '@/components/VirtualTable.vue' -->
<script lang="ts">
export type TagType =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "primary"
  | undefined
export type ProgressStatus = "" | "success" | "exception" | "warning"

/** 操作列中单个按钮的配置 */
export interface ActionItem {
  /** 操作标识，点击时作为 action 事件的 key 传出 */
  key: string
  /** 按钮文字 */
  label: string
  /** 按钮类型，默认 default */
  btnType?: "primary" | "success" | "warning" | "danger" | "info" | "default"
  /** 按钮尺寸，默认 small */
  btnSize?: "large" | "default" | "small"
  /**
   * 按条件显示按钮：当行数据中 field 字段的值包含在 values 数组中时才显示。
   * 不配置则始终显示。
   */
  showWhen?: {
    field: string
    values: (string | number | boolean)[]
  }
}

export interface ColumnConfig {
  /** 对应 data 中的字段名 */
  prop: string
  /** 列标题 */
  label: string
  /** 列宽，默认取 minWidth，否则 150 */
  width?: number
  /** 最小列宽 */
  minWidth?: number
  /** 最大列宽 */
  maxWidth?: number
  /** 对齐方式 */
  align?: "left" | "center" | "right"
  /** 固定列，true 等同于 left */
  fixed?: "left" | "right" | true
  /**
   * 单元格渲染类型
   * - `default`：纯文本（默认）
   * - `progress`：el-progress 进度条，读取 prop 值作为百分比
   * - `tag`：el-tag 标签
   * - `action`：操作列，渲染若干操作按钮
   * - `preview`：媒体预览，根据文件类型渲染 audio 或 img
   */
  type?: "default" | "progress" | "tag" | "action" | "preview"

  // ── progress 专属 ──────────────────────────────────────
  /** 进度条状态 */
  progressStatus?: ProgressStatus
  /** 是否显示百分比文字，默认 true */
  progressShowText?: boolean
  /** 进度条线宽，默认 8 */
  progressStrokeWidth?: number
  /** 自定义进度条颜色，支持字符串或分段色值 */
  progressColor?: string | { color: string; percentage: number }[]

  // ── tag 专属 ──────────────────────────────────────────
  /** 将单元格原始值转为显示文字，不传则直接显示原始值 */
  formatter?: (value: any) => string
  /** 默认 tag 类型 */
  tagType?: TagType
  /** 根据单元格值映射不同 tag 类型 */
  tagMap?: Record<string | number, TagType>
  /** tag 主题，默认 light */
  tagEffect?: "dark" | "light" | "plain"
  /** 是否圆角，默认 false */
  tagRound?: boolean

  // ── action 专属 ──────────────────────────────────────
  /** 操作列按钮配置列表 */
  actions?: ActionItem[]

  // ── preview 专属 ─────────────────────────────────────
  /**
   * 媒体类型，决定渲染 audio 还是 img。
   * 可传固定字符串，也可传函数按行动态判断。
   * 不传时根据常见扩展名自动推断（从 rowData.name 取后缀）。
   */
  previewKind?:
    | "audio"
    | "image"
    | ((rowData: Record<string, any>) => "audio" | "image")
}
</script>

<script setup lang="ts">
import { computed, h } from "vue"
import { ElButton, ElProgress, ElTag, TableV2FixedDir } from "element-plus"
import type { Column } from "element-plus"

const props = withDefaults(
  defineProps<{
    columns: ColumnConfig[]
    data: Record<string, any>[]
    /** 容器高度，数字单位 px，默认 400 */
    height?: number | string
    /** 行高，默认 48 */
    rowHeight?: number
    /** 表头高度，默认 48 */
    headerHeight?: number
  }>(),
  {
    height: 400,
    rowHeight: 48,
    headerHeight: 48,
  }
)

const emit = defineEmits<{
  /** 点击操作列按钮时触发，携带操作标识和当前行数据 */
  (e: "action", payload: { key: string; row: Record<string, any> }): void
}>()

const containerHeight = computed(() =>
  typeof props.height === "number" ? `${props.height}px` : props.height
)

const internalColumns = computed<Column<any>[]>(() =>
  props.columns.map(col => {
    const fixedMap = {
      left: TableV2FixedDir.LEFT,
      right: TableV2FixedDir.RIGHT,
    } as const
    const base = {
      ...col,
      key: col.prop,
      dataKey: col.prop,
      title: col.label,
      width: col.width ?? col.minWidth ?? 150,
      align: col.align ?? "left",
      fixed:
        col.fixed === true ? true : col.fixed ? fixedMap[col.fixed] : undefined,
    } as Column<any>

    if (col.type === "progress") {
      base.cellRenderer = ({ cellData }: { cellData: any }) =>
        h(ElProgress, {
          percentage: Math.min(100, Math.max(0, Number(cellData) || 0)),
          status: col.progressStatus || undefined,
          showText: col.progressShowText ?? true,
          strokeWidth: col.progressStrokeWidth ?? 8,
          color: col.progressColor,
          style: {
            width: "100%",
            paddingRight: "8px",
            boxSizing: "border-box",
          },
        })
    } else if (col.type === "tag") {
      base.cellRenderer = ({ cellData }: { cellData: any }) => {
        const type = col.tagMap?.[cellData] ?? col.tagType ?? undefined
        const label = col.formatter
          ? col.formatter(cellData)
          : String(cellData ?? "")
        return h(
          ElTag,
          {
            type: type || undefined,
            effect: col.tagEffect ?? "light",
            round: col.tagRound ?? false,
          },
          { default: () => label }
        )
      }
    } else if (col.type === "preview") {
      base.cellRenderer = ({
        cellData,
        rowData,
      }: {
        cellData: any
        rowData: Record<string, any>
      }) => {
        if (!cellData) return h("span", { style: "color:#aaa" }, "—")

        let kind: "audio" | "image"
        if (typeof col.previewKind === "function") {
          kind = col.previewKind(rowData)
        } else if (col.previewKind) {
          kind = col.previewKind
        } else {
          const ext =
            String(rowData.name ?? "")
              .split(".")
              .pop()
              ?.toLowerCase() ?? ""
          const imageExts = [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp",
            "bmp",
            "svg",
            "avif",
          ]
          kind = imageExts.includes(ext) ? "image" : "audio"
        }

        if (kind === "image") {
          return h("img", {
            src: cellData,
            style:
              "max-height:40px;max-width:100%;object-fit:contain;border-radius:4px",
          })
        }
        return h("audio", {
          src: cellData,
          controls: true,
          preload: "none",
          style: "height:32px;max-width:100%;vertical-align:middle",
        })
      }
    } else if (col.formatter) {
      base.cellRenderer = ({ cellData }: { cellData: any }) =>
        h("span", {}, col.formatter!(cellData))
    } else if (col.type === "action" && col.actions?.length) {
      base.cellRenderer = ({ rowData }: { rowData: Record<string, any> }) => {
        const buttons = col
          .actions!.filter(action => {
            if (!action.showWhen) return true
            return action.showWhen.values.includes(
              rowData[action.showWhen.field]
            )
          })
          .map(action =>
            h(
              ElButton,
              {
                type: action.btnType ?? "default",
                size: action.btnSize ?? "small",
                onClick: () =>
                  emit("action", { key: action.key, row: rowData }),
              },
              { default: () => action.label }
            )
          )
        return h(
          "div",
          { style: "display:flex;gap:4px;align-items:center" },
          buttons
        )
      }
    }

    return base
  })
)
</script>

<style scoped>
.virtual-table {
  width: 100%;
}
</style>
