<template>
  <FileUpload
    :accept="accept"
    @files-added="onFilesAdded"
  />

  <VirtualTable
    v-if="tableData.length"
    :columns="columns"
    :data="tableData"
    :height="400"
    style="margin-top: 16px"
    @action="onAction"
  />
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import FileUpload from "@/components/FileUpload.vue"
import VirtualTable from "@/components/VirtualTable.vue"
import type { ColumnConfig } from "@/components/VirtualTable.vue"
import { useData } from "vitepress"

const { params } = useData()

const accept = computed(() => {
  const label = params.value?.sourceLabel as string | undefined
  return label ? `.${label.toLowerCase()}` : undefined
})

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function onFilesAdded(files: File[]) {
  const ext = accept.value?.slice(1).toLowerCase()
  const filtered = ext
    ? files.filter(f => f.name.toLowerCase().endsWith(`.${ext}`))
    : files

  const rows = filtered.map(f => ({
    name: f.name,
    size: formatFileSize(f.size),
    format: f.name.split(".").pop()?.toLowerCase() ?? "",
    progress: 0,
    status: "等待中",
    _file: f,
  }))

  tableData.value.push(...rows)
}

function onAction({ key, row }: { key: string; row: Record<string, any> }) {
  if (key === "delete") {
    const idx = tableData.value.findIndex(item => item === row)
    if (idx !== -1) tableData.value.splice(idx, 1)
  } else if (key === "download") {
    console.log("下载：", row.name)
  } else if (key === "retry") {
    console.log("重试：", row.name)
  }
}

const columns: ColumnConfig[] = [
  {
    prop: "name",
    label: "文件名",
    width: 220,
  },
  {
    prop: "size",
    label: "大小",
    width: 100,
    align: "right",
  },
  {
    prop: "format",
    label: "格式",
    width: 80,
    align: "center",
    type: "tag",
    tagMap: {
      mp3: "success",
      wav: undefined,
      flac: "warning",
      aac: "info",
    },
  },
  {
    prop: "progress",
    label: "转换进度",
    width: 200,
    type: "progress",
    progressStrokeWidth: 10,
  },
  {
    prop: "status",
    label: "状态",
    width: 100,
    align: "center",
    type: "tag",
    tagMap: {
      等待中: undefined,
      转换中: "warning",
      已完成: "success",
      失败: "danger",
    },
  },
  {
    prop: "actions",
    label: "操作",
    width: 160,
    align: "left",
    fixed: "right",
    type: "action",
    actions: [
      {
        key: "delete",
        label: "删除",
        btnType: "danger",
      },
      {
        key: "download",
        label: "下载",
        btnType: "primary",
        showWhen: { field: "status", values: ["已完成"] },
      },
      {
        key: "retry",
        label: "重试",
        btnType: "warning",
        showWhen: { field: "status", values: ["失败"] },
      },
    ],
  },
]

const tableData = ref([
  {
    name: "podcast_ep01.mp3",
    size: "4.2 MB",
    format: "mp3",
    progress: 100,
    status: "已完成",
  },
  {
    name: "recording_2024.wav",
    size: "12.8 MB",
    format: "wav",
    progress: 65,
    status: "转换中",
  },
  {
    name: "album_track3.flac",
    size: "8.1 MB",
    format: "flac",
    progress: 0,
    status: "等待中",
  },
  {
    name: "voice_memo.aac",
    size: "3.5 MB",
    format: "aac",
    progress: 0,
    status: "失败",
  },
])
</script>

<style lang="scss" scoped></style>
