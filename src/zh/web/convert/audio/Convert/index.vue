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
import { computed, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import FileUpload from "@/components/FileUpload.vue"
import VirtualTable from "@/components/VirtualTable.vue"
import type { ColumnConfig } from "@/components/VirtualTable.vue"
import { useData } from "vitepress"
import { convertFile } from "./hooks/index"

const { t } = useI18n({ useScope: "local" })
const { params } = useData()

const targetFormat = computed(
  () => (params.value?.targetLabel as string | undefined)?.toLowerCase() ?? ""
)

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
  const rows = files.map(f => ({
    name: f.name,
    size: formatFileSize(f.size),
    format: f.name.split(".").pop()?.toLowerCase() ?? "",
    progress: 0,
    status: "waiting",
    _file: f,
  }))

  tableData.value.push(...rows)
}

function onAction({ key, row }: { key: string; row: Record<string, any> }) {
  if (key === "delete") {
    const idx = tableData.value.findIndex(item => item === row)
    if (idx !== -1) {
      if (row._previewUrl) URL.revokeObjectURL(row._previewUrl)
      tableData.value.splice(idx, 1)
    }
  } else if (key === "download") {
    if (!row._blob) return
    const url = URL.createObjectURL(row._blob)
    const a = document.createElement("a")
    a.href = url
    a.download = row.name.replace(/\.[^.]+$/, `.${targetFormat.value}`)
    a.click()
    URL.revokeObjectURL(url)
  } else if (key === "retry") {
    if (!row._file) return
    row.status = "converting"
    row.progress = 0
    convertFile({
      file: row._file,
      sourceFormat: row.format,
      targetFormat: targetFormat.value,
      onProgress: p => {
        row.progress = p
      },
    })
      .then(blob => {
        row.status = "done"
        row.progress = 100
        row._blob = blob
        row._previewUrl = URL.createObjectURL(blob)
      })
      .catch(() => {
        row.status = "failed"
      })
  }
}

const columns = computed<ColumnConfig[]>(() => [
  {
    prop: "name",
    label: t("colFileName"),
    minWidth: 220,
  },
  {
    prop: "size",
    label: t("colSize"),
    minWidth: 100,
    align: "right",
  },
  {
    prop: "format",
    label: t("colFormat"),
    minWidth: 130,
    align: "center",
    formatter: (val: string) => `${val} → ${targetFormat.value}`,
  },
  {
    prop: "progress",
    label: t("colProgress"),
    minWidth: 170,
    type: "progress",
    progressStrokeWidth: 10,
  },
  {
    prop: "status",
    label: t("colStatus"),
    minWidth: 100,
    align: "center",
    type: "tag",
    formatter: (val: string) => t(val),
    tagMap: {
      waiting: undefined,
      converting: "warning",
      done: "success",
      failed: "danger",
    },
  },
  {
    prop: "_previewUrl",
    label: t("colPreview"),
    minWidth: 300,
    type: "preview",
    previewKind: "audio",
  },
  {
    prop: "actions",
    label: t("colActions"),
    align: "left",
    fixed: "right",
    minWidth: 300,
    type: "action",
    actions: [
      {
        key: "delete",
        label: t("btnDelete"),
        btnType: "danger",
      },
      {
        key: "download",
        label: t("btnDownload"),
        btnType: "primary",
        showWhen: { field: "status", values: ["done"] },
      },
      {
        key: "retry",
        label: t("btnRetry"),
        btnType: "warning",
        showWhen: { field: "status", values: ["failed"] },
      },
    ],
  },
])

const tableData = ref<
  {
    name: string
    size: string
    format: string
    progress: number
    status: string
    _file?: File
    _blob?: Blob
    _previewUrl?: string
  }[]
>([])

const MAX_CONCURRENT = 2

function runQueue() {
  const converting = tableData.value.filter(
    r => r.status === "converting"
  ).length
  const slots = MAX_CONCURRENT - converting
  if (slots <= 0) return

  const pending = tableData.value.filter(r => r.status === "waiting" && r._file)
  pending.slice(0, slots).forEach(row => {
    row.status = "converting"
    row.progress = 0

    convertFile({
      file: row._file!,
      sourceFormat: row.format,
      targetFormat: targetFormat.value,
      onProgress: p => {
        row.progress = p
      },
    })
      .then(blob => {
        row.status = "done"
        row.progress = 100
        row._blob = blob
        row._previewUrl = URL.createObjectURL(blob)
        runQueue()
      })
      .catch(() => {
        row.status = "failed"
        runQueue()
      })
  })
}

watch(
  () => tableData.value.length,
  (newLen, oldLen) => {
    if (newLen > oldLen) runQueue()
  }
)
</script>

<style lang="scss" scoped></style>

<i18n lang="json">
{
  "zh-CN": {
    "colFileName": "文件名",
    "colSize": "大小",
    "colFormat": "格式",
    "colProgress": "转换进度",
    "colStatus": "状态",
    "colPreview": "预览",
    "colActions": "操作",
    "btnDelete": "删除",
    "btnDownload": "下载",
    "btnRetry": "重试",
    "waiting": "等待中",
    "converting": "转换中",
    "done": "已完成",
    "failed": "失败"
  },
  "en": {
    "colFileName": "File Name",
    "colSize": "Size",
    "colFormat": "Format",
    "colProgress": "Progress",
    "colStatus": "Status",
    "colPreview": "Preview",
    "colActions": "Actions",
    "btnDelete": "Delete",
    "btnDownload": "Download",
    "btnRetry": "Retry",
    "waiting": "Waiting",
    "converting": "Converting",
    "done": "Done",
    "failed": "Failed"
  },
  "zh-TW": {
    "colFileName": "檔案名稱",
    "colSize": "大小",
    "colFormat": "格式",
    "colProgress": "轉換進度",
    "colStatus": "狀態",
    "colPreview": "預覽",
    "colActions": "操作",
    "btnDelete": "刪除",
    "btnDownload": "下載",
    "btnRetry": "重試",
    "waiting": "等待中",
    "converting": "轉換中",
    "done": "已完成",
    "failed": "失敗"
  },
  "ja": {
    "colFileName": "ファイル名",
    "colSize": "サイズ",
    "colFormat": "形式",
    "colProgress": "変換進行状況",
    "colStatus": "状態",
    "colPreview": "プレビュー",
    "colActions": "操作",
    "btnDelete": "削除",
    "btnDownload": "ダウンロード",
    "btnRetry": "再試行",
    "waiting": "待機中",
    "converting": "変換中",
    "done": "完了",
    "failed": "失敗"
  },
  "ko": {
    "colFileName": "파일명",
    "colSize": "크기",
    "colFormat": "형식",
    "colProgress": "변환 진행률",
    "colStatus": "상태",
    "colPreview": "미리보기",
    "colActions": "작업",
    "btnDelete": "삭제",
    "btnDownload": "다운로드",
    "btnRetry": "재시도",
    "waiting": "대기 중",
    "converting": "변환 중",
    "done": "완료",
    "failed": "실패"
  },
  "fr": {
    "colFileName": "Nom du fichier",
    "colSize": "Taille",
    "colFormat": "Format",
    "colProgress": "Progression",
    "colStatus": "Statut",
    "colPreview": "Aperçu",
    "colActions": "Actions",
    "btnDelete": "Supprimer",
    "btnDownload": "Télécharger",
    "btnRetry": "Réessayer",
    "waiting": "En attente",
    "converting": "En cours",
    "done": "Terminé",
    "failed": "Échec"
  },
  "de": {
    "colFileName": "Dateiname",
    "colSize": "Größe",
    "colFormat": "Format",
    "colProgress": "Fortschritt",
    "colStatus": "Status",
    "colPreview": "Vorschau",
    "colActions": "Aktionen",
    "btnDelete": "Löschen",
    "btnDownload": "Herunterladen",
    "btnRetry": "Wiederholen",
    "waiting": "Wartend",
    "converting": "Konvertierung",
    "done": "Abgeschlossen",
    "failed": "Fehlgeschlagen"
  },
  "es": {
    "colFileName": "Nombre de archivo",
    "colSize": "Tamaño",
    "colFormat": "Formato",
    "colProgress": "Progreso",
    "colStatus": "Estado",
    "colPreview": "Vista previa",
    "colActions": "Acciones",
    "btnDelete": "Eliminar",
    "btnDownload": "Descargar",
    "btnRetry": "Reintentar",
    "waiting": "En espera",
    "converting": "Convirtiendo",
    "done": "Completado",
    "failed": "Fallido"
  },
  "pt": {
    "colFileName": "Nome do arquivo",
    "colSize": "Tamanho",
    "colFormat": "Formato",
    "colProgress": "Progresso",
    "colStatus": "Estado",
    "colPreview": "Pré-visualização",
    "colActions": "Ações",
    "btnDelete": "Excluir",
    "btnDownload": "Baixar",
    "btnRetry": "Tentar novamente",
    "waiting": "Aguardando",
    "converting": "Convertendo",
    "done": "Concluído",
    "failed": "Falhou"
  },
  "ru": {
    "colFileName": "Имя файла",
    "colSize": "Размер",
    "colFormat": "Формат",
    "colProgress": "Прогресс",
    "colStatus": "Статус",
    "colPreview": "Предпросмотр",
    "colActions": "Действия",
    "btnDelete": "Удалить",
    "btnDownload": "Скачать",
    "btnRetry": "Повторить",
    "waiting": "Ожидание",
    "converting": "Конвертация",
    "done": "Завершено",
    "failed": "Ошибка"
  },
  "ar": {
    "colFileName": "اسم الملف",
    "colSize": "الحجم",
    "colFormat": "الصيغة",
    "colProgress": "تقدم التحويل",
    "colStatus": "الحالة",
    "colPreview": "معاينة",
    "colActions": "الإجراءات",
    "btnDelete": "حذف",
    "btnDownload": "تنزيل",
    "btnRetry": "إعادة المحاولة",
    "waiting": "في الانتظار",
    "converting": "جارٍ التحويل",
    "done": "مكتمل",
    "failed": "فشل"
  },
  "hi": {
    "colFileName": "फ़ाइल नाम",
    "colSize": "आकार",
    "colFormat": "प्रारूप",
    "colProgress": "रूपांतरण प्रगति",
    "colStatus": "स्थिति",
    "colActions": "क्रियाएं",
    "btnDelete": "हटाएं",
    "btnDownload": "डाउनलोड",
    "btnRetry": "पुनः प्रयास",
    "waiting": "प्रतीक्षारत",
    "converting": "रूपांतरण हो रहा है",
    "done": "पूर्ण",
    "failed": "विफल"
  },
  "it": {
    "colFileName": "Nome file",
    "colSize": "Dimensione",
    "colFormat": "Formato",
    "colProgress": "Progresso",
    "colStatus": "Stato",
    "colActions": "Azioni",
    "btnDelete": "Elimina",
    "btnDownload": "Scarica",
    "btnRetry": "Riprova",
    "waiting": "In attesa",
    "converting": "In conversione",
    "done": "Completato",
    "failed": "Fallito"
  },
  "nl": {
    "colFileName": "Bestandsnaam",
    "colSize": "Grootte",
    "colFormat": "Indeling",
    "colProgress": "Voortgang",
    "colStatus": "Status",
    "colActions": "Acties",
    "btnDelete": "Verwijderen",
    "btnDownload": "Downloaden",
    "btnRetry": "Opnieuw proberen",
    "waiting": "Wachten",
    "converting": "Converteren",
    "done": "Voltooid",
    "failed": "Mislukt"
  },
  "tr": {
    "colFileName": "Dosya Adı",
    "colSize": "Boyut",
    "colFormat": "Format",
    "colProgress": "Dönüştürme İlerlemesi",
    "colStatus": "Durum",
    "colActions": "İşlemler",
    "btnDelete": "Sil",
    "btnDownload": "İndir",
    "btnRetry": "Yeniden Dene",
    "waiting": "Bekliyor",
    "converting": "Dönüştürülüyor",
    "done": "Tamamlandı",
    "failed": "Başarısız"
  },
  "vi": {
    "colFileName": "Tên tệp",
    "colSize": "Kích thước",
    "colFormat": "Định dạng",
    "colProgress": "Tiến trình",
    "colStatus": "Trạng thái",
    "colActions": "Hành động",
    "btnDelete": "Xóa",
    "btnDownload": "Tải xuống",
    "btnRetry": "Thử lại",
    "waiting": "Đang chờ",
    "converting": "Đang chuyển đổi",
    "done": "Hoàn thành",
    "failed": "Thất bại"
  },
  "th": {
    "colFileName": "ชื่อไฟล์",
    "colSize": "ขนาด",
    "colFormat": "รูปแบบ",
    "colProgress": "ความคืบหน้า",
    "colStatus": "สถานะ",
    "colActions": "การดำเนินการ",
    "btnDelete": "ลบ",
    "btnDownload": "ดาวน์โหลด",
    "btnRetry": "ลองใหม่",
    "waiting": "รอดำเนินการ",
    "converting": "กำลังแปลง",
    "done": "เสร็จสิ้น",
    "failed": "ล้มเหลว"
  },
  "id": {
    "colFileName": "Nama File",
    "colSize": "Ukuran",
    "colFormat": "Format",
    "colProgress": "Kemajuan",
    "colStatus": "Status",
    "colActions": "Tindakan",
    "btnDelete": "Hapus",
    "btnDownload": "Unduh",
    "btnRetry": "Coba Lagi",
    "waiting": "Menunggu",
    "converting": "Mengonversi",
    "done": "Selesai",
    "failed": "Gagal"
  },
  "pl": {
    "colFileName": "Nazwa pliku",
    "colSize": "Rozmiar",
    "colFormat": "Format",
    "colProgress": "Postęp",
    "colStatus": "Status",
    "colActions": "Akcje",
    "btnDelete": "Usuń",
    "btnDownload": "Pobierz",
    "btnRetry": "Spróbuj ponownie",
    "waiting": "Oczekiwanie",
    "converting": "Konwertowanie",
    "done": "Ukończono",
    "failed": "Niepowodzenie"
  },
  "sv": {
    "colFileName": "Filnamn",
    "colSize": "Storlek",
    "colFormat": "Format",
    "colProgress": "Framsteg",
    "colStatus": "Status",
    "colActions": "Åtgärder",
    "btnDelete": "Ta bort",
    "btnDownload": "Ladda ner",
    "btnRetry": "Försök igen",
    "waiting": "Väntar",
    "converting": "Konverterar",
    "done": "Klar",
    "failed": "Misslyckades"
  }
}
</i18n>
