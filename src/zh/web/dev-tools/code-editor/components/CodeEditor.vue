<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useData } from "vitepress"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { copyToClipboard } from "@/utils"
import { ensureMonaco, type MonacoApi, type MonacoEditor } from "./loadMonaco"

const { t } = useI18n()
const { isDark } = useData()

type ThemeMode = "auto" | "light" | "dark"

const LANGS = [
  "javascript",
  "typescript",
  "json",
  "html",
  "css",
  "scss",
  "python",
  "java",
  "go",
  "rust",
  "php",
  "ruby",
  "csharp",
  "cpp",
  "c",
  "sql",
  "yaml",
  "xml",
  "markdown",
  "shell",
  "dockerfile",
  "ini",
  "lua",
  "powershell",
  "plaintext",
] as const

type Lang = (typeof LANGS)[number]

const EXT: Record<string, Lang> = {
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  json: "json",
  html: "html",
  htm: "html",
  css: "css",
  scss: "scss",
  py: "python",
  java: "java",
  go: "go",
  rs: "rust",
  php: "php",
  rb: "ruby",
  cs: "csharp",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  h: "c",
  c: "c",
  sql: "sql",
  yml: "yaml",
  yaml: "yaml",
  xml: "xml",
  md: "markdown",
  sh: "shell",
  bash: "shell",
  dockerfile: "dockerfile",
  ini: "ini",
  toml: "ini",
  lua: "lua",
  ps1: "powershell",
  txt: "plaintext",
}

const DOWNLOAD_EXT: Record<Lang, string> = {
  javascript: "js",
  typescript: "ts",
  json: "json",
  html: "html",
  css: "css",
  scss: "scss",
  python: "py",
  java: "java",
  go: "go",
  rust: "rs",
  php: "php",
  ruby: "rb",
  csharp: "cs",
  cpp: "cpp",
  c: "c",
  sql: "sql",
  yaml: "yaml",
  xml: "xml",
  markdown: "md",
  shell: "sh",
  dockerfile: "Dockerfile",
  ini: "ini",
  lua: "lua",
  powershell: "ps1",
  plaintext: "txt",
}

const SAMPLES: Partial<Record<Lang, string>> = {
  javascript: `function greet(name) {
  console.log(\`Hello, \${name}!\`)
}

greet("VS Code")
`,
  typescript: `type User = { id: number; name: string }

function greet(user: User): string {
  return \`Hello, \${user.name}!\`
}

console.log(greet({ id: 1, name: "VS Code" }))
`,
  json: `{
  "name": "kyx",
  "editor": "monaco",
  "languages": ["json", "yaml", "xml"]
}
`,
  html: `<!DOCTYPE html>
<html lang="zh-CN">
  <body>
    <h1>Hello VS Code</h1>
  </body>
</html>
`,
  css: `.hero {
  color: #3b82f6;
  font-size: 24px;
}
`,
  python: `def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("VS Code"))
`,
  sql: `SELECT id, name
FROM users
WHERE active = 1
ORDER BY name;
`,
  yaml: `app:
  name: kyx
  editor: monaco
`,
  markdown: `# Hello

Edit **Markdown** in the VS Code editor.
`,
}

const host = ref<HTMLElement | null>(null)
const fileRef = ref<HTMLInputElement | null>(null)
const language = ref<Lang>("javascript")
const themeMode = ref<ThemeMode>("auto")
const fontSize = ref(14)
const wordWrap = ref(true)
const minimap = ref(true)
const loading = ref(true)
const running = ref(false)
const lineCount = ref(1)
const charCount = ref(0)

let api: MonacoApi | null = null
let editor: MonacoEditor | null = null
let contentSub: { dispose: () => void } | null = null

const monacoTheme = computed(() => {
  if (themeMode.value === "light") return "vs"
  if (themeMode.value === "dark") return "vs-dark"
  return isDark.value ? "vs-dark" : "vs"
})

function sampleOf(lang: Lang) {
  return SAMPLES[lang] ?? `// ${lang}\n`
}

function refreshStats() {
  if (!editor) return
  const text = editor.getValue()
  charCount.value = text.length
  lineCount.value = editor.getModel()?.getLineCount() ?? text.split("\n").length
}

function applyOptions() {
  editor?.updateOptions({
    fontSize: fontSize.value,
    wordWrap: wordWrap.value ? "on" : "off",
    minimap: { enabled: minimap.value },
  })
}

function applyTheme() {
  api?.editor.setTheme(monacoTheme.value)
}

async function boot() {
  if (!host.value) return
  loading.value = true
  try {
    api = await ensureMonaco()
    editor = api.editor.create(host.value, {
      value: sampleOf(language.value),
      language: language.value,
      theme: monacoTheme.value,
      fontSize: fontSize.value,
      tabSize: 2,
      wordWrap: wordWrap.value ? "on" : "off",
      minimap: { enabled: minimap.value },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      padding: { top: 8, bottom: 8 },
    })
    contentSub = editor.onDidChangeModelContent(refreshStats)
    refreshStats()
  } catch {
    ElMessage({ message: t("msgLib"), type: "error" })
  } finally {
    loading.value = false
  }
}

function useSample() {
  editor?.setValue(sampleOf(language.value))
  refreshStats()
}

function clearAll() {
  editor?.setValue("")
  refreshStats()
}

async function copyOut() {
  const text = editor?.getValue() ?? ""
  if (!text) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  await copyToClipboard(text)
  ElMessage({ message: t("copied"), type: "success", duration: 1500 })
}

function download() {
  const text = editor?.getValue() ?? ""
  if (!text) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  const ext = DOWNLOAD_EXT[language.value]
  const name = ext === "Dockerfile" ? "Dockerfile" : `code.${ext}`
  const a = document.createElement("a")
  a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }))
  a.download = name
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(a.href)
}

function openFile() {
  fileRef.value?.click()
}

async function onFile(ev: Event) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (!file) return
  const text = await file.text()
  const ext = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase()
    : file.name.toLowerCase()
  const lang = EXT[ext] ?? "plaintext"
  language.value = lang
  await nextTick()
  editor?.setValue(text)
  refreshStats()
}

async function formatDoc() {
  if (!editor) return
  const action = editor.getAction("editor.action.formatDocument")
  if (!action) {
    ElMessage({ message: t("msgNoFormat"), type: "warning" })
    return
  }
  running.value = true
  try {
    await action.run()
    ElMessage({ message: t("formatted"), type: "success", duration: 1200 })
  } catch {
    ElMessage({ message: t("msgFail"), type: "error" })
  } finally {
    running.value = false
  }
}

watch(language, lang => {
  if (!api || !editor) return
  const model = editor.getModel()
  if (model) api.editor.setModelLanguage(model, lang)
})

watch([fontSize, wordWrap, minimap], applyOptions)
watch(monacoTheme, applyTheme)

onMounted(() => {
  void boot()
})

onBeforeUnmount(() => {
  contentSub?.dispose()
  editor?.dispose()
  editor = null
})
</script>

<template>
  <div class="code-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <el-select
        v-model="language"
        class="lang"
        filterable
      >
        <el-option
          v-for="lang in LANGS"
          :key="lang"
          :label="lang"
          :value="lang"
        />
      </el-select>
      <el-radio-group v-model="themeMode">
        <el-radio-button value="auto">{{ t("themeAuto") }}</el-radio-button>
        <el-radio-button value="light">{{ t("themeLight") }}</el-radio-button>
        <el-radio-button value="dark">{{ t("themeDark") }}</el-radio-button>
      </el-radio-group>
      <el-input-number
        v-model="fontSize"
        :min="12"
        :max="24"
        :step="1"
        controls-position="right"
        class="font-size"
      />
      <el-switch
        v-model="wordWrap"
        :active-text="t('wordWrap')"
      />
      <el-switch
        v-model="minimap"
        :active-text="t('minimap')"
      />
      <span class="status">{{ t("stats", { n: lineCount, c: charCount }) }}</span>
    </div>

    <div class="actions">
      <el-button
        type="primary"
        :loading="running"
        :disabled="loading"
        @click="formatDoc"
      >
        {{ t("format") }}
      </el-button>
      <el-button
        :disabled="loading"
        @click="copyOut"
      >
        {{ t("copy") }}
      </el-button>
      <el-button
        :disabled="loading"
        @click="download"
      >
        {{ t("download") }}
      </el-button>
      <el-button
        :disabled="loading"
        @click="openFile"
      >
        {{ t("open") }}
      </el-button>
      <el-button
        :disabled="loading"
        @click="useSample"
      >
        {{ t("sample") }}
      </el-button>
      <el-button
        :disabled="loading"
        @click="clearAll"
      >
        {{ t("clear") }}
      </el-button>
    </div>

    <input
      ref="fileRef"
      type="file"
      class="file-input"
      @change="onFile"
    >

    <div
      class="editor-wrap"
      :class="{ loading }"
    >
      <div
        v-if="loading"
        class="editor-mask"
      >
        {{ t("loading") }}
      </div>
      <div
        ref="host"
        class="editor-host"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.code-page {
  max-width: 1100px;
  width: 100%;
  min-width: 0;
  margin: 0 auto;
  padding: 24px 16px 48px;
  box-sizing: border-box;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
}

.page-desc {
  margin: 0 0 20px;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

.toolbar,
.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;

  :deep(.el-button) {
    margin-left: 0;
  }
}

.lang {
  width: 170px;
}

.font-size {
  width: 110px;
}

.status {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.file-input {
  display: none;
}

.editor-wrap {
  position: relative;
  width: 100%;
  min-width: 0;
  height: 560px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.editor-host {
  width: 100%;
  height: 100%;
}

.editor-mask {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "在线代码编辑",
    "desc": "CDN 加载 VS Code 同款 Monaco 编辑器，可高亮、格式化、打开和下载多种语言代码。数据不会上传。",
    "themeAuto": "跟随站点",
    "themeLight": "浅色",
    "themeDark": "深色",
    "wordWrap": "自动换行",
    "minimap": "小地图",
    "format": "格式化",
    "copy": "复制",
    "download": "下载",
    "open": "打开文件",
    "sample": "示例",
    "clear": "清空",
    "loading": "正在从 CDN 加载 VS Code 编辑器…",
    "copied": "已复制",
    "formatted": "已格式化",
    "stats": "{n} 行 · {c} 字符",
    "msgEmpty": "编辑器里还没有内容。",
    "msgLib": "无法加载 VS Code 编辑器，请检查网络后重试。",
    "msgFail": "格式化失败。",
    "msgNoFormat": "当前语言没有内置格式化。"
  },
  "zh-CN": {
    "title_page": "在线代码编辑",
    "desc": "CDN 加载 VS Code 同款 Monaco 编辑器，可高亮、格式化、打开和下载多种语言代码。数据不会上传。",
    "themeAuto": "跟随站点",
    "themeLight": "浅色",
    "themeDark": "深色",
    "wordWrap": "自动换行",
    "minimap": "小地图",
    "format": "格式化",
    "copy": "复制",
    "download": "下载",
    "open": "打开文件",
    "sample": "示例",
    "clear": "清空",
    "loading": "正在从 CDN 加载 VS Code 编辑器…",
    "copied": "已复制",
    "formatted": "已格式化",
    "stats": "{n} 行 · {c} 字符",
    "msgEmpty": "编辑器里还没有内容。",
    "msgLib": "无法加载 VS Code 编辑器，请检查网络后重试。",
    "msgFail": "格式化失败。",
    "msgNoFormat": "当前语言没有内置格式化。"
  },
  "en": {
    "title_page": "Online Code Editor",
    "desc": "A VS Code Monaco editor loaded from CDN. Highlight, format, open, and download code locally in your browser.",
    "themeAuto": "Auto",
    "themeLight": "Light",
    "themeDark": "Dark",
    "wordWrap": "Word wrap",
    "minimap": "Minimap",
    "format": "Format",
    "copy": "Copy",
    "download": "Download",
    "open": "Open file",
    "sample": "Sample",
    "clear": "Clear",
    "loading": "Loading the VS Code editor from CDN…",
    "copied": "Copied",
    "formatted": "Formatted",
    "stats": "{n} lines · {c} chars",
    "msgEmpty": "The editor is empty.",
    "msgLib": "Could not load the VS Code editor. Check your network and retry.",
    "msgFail": "Format failed.",
    "msgNoFormat": "This language has no built-in formatter."
  },
  "ja": {
    "title_page": "オンラインコード編集",
    "desc": "CDN から VS Code と同じ Monaco エディタを読み込み、強調表示・整形・開く・保存がブラウザ内で完結します。",
    "themeAuto": "サイトに合わせる",
    "themeLight": "ライト",
    "themeDark": "ダーク",
    "wordWrap": "折り返し",
    "minimap": "ミニマップ",
    "format": "整形",
    "copy": "コピー",
    "download": "ダウンロード",
    "open": "ファイルを開く",
    "sample": "サンプル",
    "clear": "クリア",
    "loading": "CDN から VS Code エディタを読み込み中…",
    "copied": "コピーしました",
    "formatted": "整形しました",
    "stats": "{n} 行 · {c} 文字",
    "msgEmpty": "エディタが空です。",
    "msgLib": "VS Code エディタを読み込めません。通信を確認して再試行してください。",
    "msgFail": "整形に失敗しました。",
    "msgNoFormat": "この言語には組み込み整形がありません。"
  },
  "ko": {
    "title_page": "온라인 코드 편집",
    "desc": "CDN에서 VS Code와 같은 Monaco 편집기를 불러와 강조, 포맷, 열기, 저장을 브라우저에서 처리합니다.",
    "themeAuto": "사이트 따름",
    "themeLight": "밝게",
    "themeDark": "어둡게",
    "wordWrap": "줄 바꿈",
    "minimap": "미니맵",
    "format": "포맷",
    "copy": "복사",
    "download": "다운로드",
    "open": "파일 열기",
    "sample": "예제",
    "clear": "지우기",
    "loading": "CDN에서 VS Code 편집기를 불러오는 중…",
    "copied": "복사됨",
    "formatted": "포맷됨",
    "stats": "{n}줄 · {c}자",
    "msgEmpty": "편집기가 비어 있습니다.",
    "msgLib": "VS Code 편집기를 불러오지 못했습니다. 네트워크를 확인한 뒤 다시 시도하세요.",
    "msgFail": "포맷에 실패했습니다.",
    "msgNoFormat": "이 언어에는 내장 포맷터가 없습니다."
  },
  "fr": {
    "title_page": "Éditeur de code en ligne",
    "desc": "Éditeur Monaco de VS Code chargé depuis un CDN. Coloration, formatage, ouverture et téléchargement restent locaux.",
    "themeAuto": "Auto",
    "themeLight": "Clair",
    "themeDark": "Sombre",
    "wordWrap": "Retour à la ligne",
    "minimap": "Minimap",
    "format": "Formater",
    "copy": "Copier",
    "download": "Télécharger",
    "open": "Ouvrir",
    "sample": "Exemple",
    "clear": "Effacer",
    "loading": "Chargement de l’éditeur VS Code depuis le CDN…",
    "copied": "Copié",
    "formatted": "Formaté",
    "stats": "{n} lignes · {c} car.",
    "msgEmpty": "L’éditeur est vide.",
    "msgLib": "Impossible de charger l’éditeur VS Code. Vérifiez le réseau.",
    "msgFail": "Échec du formatage.",
    "msgNoFormat": "Ce langage n’a pas de formateur intégré."
  },
  "de": {
    "title_page": "Online-Code-Editor",
    "desc": "VS-Code-Monaco-Editor per CDN. Hervorhebung, Formatierung, Öffnen und Download bleiben im Browser.",
    "themeAuto": "Auto",
    "themeLight": "Hell",
    "themeDark": "Dunkel",
    "wordWrap": "Umbruch",
    "minimap": "Minimap",
    "format": "Formatieren",
    "copy": "Kopieren",
    "download": "Download",
    "open": "Öffnen",
    "sample": "Beispiel",
    "clear": "Leeren",
    "loading": "VS-Code-Editor wird vom CDN geladen…",
    "copied": "Kopiert",
    "formatted": "Formatiert",
    "stats": "{n} Zeilen · {c} Zeichen",
    "msgEmpty": "Der Editor ist leer.",
    "msgLib": "VS-Code-Editor konnte nicht geladen werden. Netz prüfen und erneut versuchen.",
    "msgFail": "Formatierung fehlgeschlagen.",
    "msgNoFormat": "Diese Sprache hat keinen eingebauten Formatter."
  },
  "es": {
    "title_page": "Editor de código en línea",
    "desc": "Editor Monaco de VS Code desde CDN. Resaltado, formato, apertura y descarga se hacen en el navegador.",
    "themeAuto": "Auto",
    "themeLight": "Claro",
    "themeDark": "Oscuro",
    "wordWrap": "Ajuste de línea",
    "minimap": "Minimapa",
    "format": "Formatear",
    "copy": "Copiar",
    "download": "Descargar",
    "open": "Abrir",
    "sample": "Ejemplo",
    "clear": "Borrar",
    "loading": "Cargando el editor VS Code desde el CDN…",
    "copied": "Copiado",
    "formatted": "Formateado",
    "stats": "{n} líneas · {c} car.",
    "msgEmpty": "El editor está vacío.",
    "msgLib": "No se pudo cargar el editor VS Code. Revisa la red e inténtalo de nuevo.",
    "msgFail": "Error al formatear.",
    "msgNoFormat": "Este lenguaje no tiene formateador integrado."
  },
  "pt": {
    "title_page": "Editor de código online",
    "desc": "Editor Monaco do VS Code via CDN. Destaque, formatação, abrir e baixar ficam no navegador.",
    "themeAuto": "Auto",
    "themeLight": "Claro",
    "themeDark": "Escuro",
    "wordWrap": "Quebra de linha",
    "minimap": "Minimapa",
    "format": "Formatar",
    "copy": "Copiar",
    "download": "Baixar",
    "open": "Abrir",
    "sample": "Exemplo",
    "clear": "Limpar",
    "loading": "Carregando o editor VS Code do CDN…",
    "copied": "Copiado",
    "formatted": "Formatado",
    "stats": "{n} linhas · {c} car.",
    "msgEmpty": "O editor está vazio.",
    "msgLib": "Não foi possível carregar o editor VS Code. Verifique a rede e tente de novo.",
    "msgFail": "Falha ao formatar.",
    "msgNoFormat": "Esta linguagem não tem formatador embutido."
  },
  "ru": {
    "title_page": "Онлайн-редактор кода",
    "desc": "Редактор Monaco из VS Code с CDN. Подсветка, форматирование, открытие и скачивание — в браузере.",
    "themeAuto": "Авто",
    "themeLight": "Светлая",
    "themeDark": "Тёмная",
    "wordWrap": "Перенос",
    "minimap": "Миникарта",
    "format": "Форматировать",
    "copy": "Копировать",
    "download": "Скачать",
    "open": "Открыть",
    "sample": "Пример",
    "clear": "Очистить",
    "loading": "Загрузка редактора VS Code с CDN…",
    "copied": "Скопировано",
    "formatted": "Отформатировано",
    "stats": "{n} строк · {c} симв.",
    "msgEmpty": "Редактор пуст.",
    "msgLib": "Не удалось загрузить редактор VS Code. Проверьте сеть и повторите.",
    "msgFail": "Ошибка форматирования.",
    "msgNoFormat": "Для этого языка нет встроенного форматтера."
  },
  "ar": {
    "title_page": "محرر أكواد عبر الإنترنت",
    "desc": "محرر Monaco من VS Code عبر CDN. التمييز والتنسيق والفتح والتنزيل تتم محلياً في المتصفح.",
    "themeAuto": "تلقائي",
    "themeLight": "فاتح",
    "themeDark": "داكن",
    "wordWrap": "التفاف السطر",
    "minimap": "الخريطة المصغرة",
    "format": "تنسيق",
    "copy": "نسخ",
    "download": "تنزيل",
    "open": "فتح ملف",
    "sample": "مثال",
    "clear": "مسح",
    "loading": "جارٍ تحميل محرر VS Code من CDN…",
    "copied": "تم النسخ",
    "formatted": "تم التنسيق",
    "stats": "{n} أسطر · {c} حرفاً",
    "msgEmpty": "المحرر فارغ.",
    "msgLib": "تعذر تحميل محرر VS Code. تحقق من الشبكة ثم أعد المحاولة.",
    "msgFail": "فشل التنسيق.",
    "msgNoFormat": "لا يوجد منسق مدمج لهذه اللغة."
  },
  "hi": {
    "title_page": "ऑनलाइन कोड संपादक",
    "desc": "CDN से VS Code जैसा Monaco संपादक। हाइलाइट, फ़ॉर्मेट, खोलना और डाउनलोड ब्राउज़र में ही होता है।",
    "themeAuto": "ऑटो",
    "themeLight": "हल्का",
    "themeDark": "गहरा",
    "wordWrap": "लाइन रैप",
    "minimap": "मिनिमैप",
    "format": "फ़ॉर्मेट",
    "copy": "कॉपी",
    "download": "डाउनलोड",
    "open": "फ़ाइल खोलें",
    "sample": "उदाहरण",
    "clear": "साफ़",
    "loading": "CDN से VS Code संपादक लोड हो रहा है…",
    "copied": "कॉपी हो गया",
    "formatted": "फ़ॉर्मेट हो गया",
    "stats": "{n} पंक्तियाँ · {c} अक्षर",
    "msgEmpty": "संपादक खाली है।",
    "msgLib": "VS Code संपादक लोड नहीं हुआ। नेटवर्क जाँचकर फिर कोशिश करें।",
    "msgFail": "फ़ॉर्मेट असफल।",
    "msgNoFormat": "इस भाषा में बिल्ट-इन फ़ॉर्मेटर नहीं है।"
  },
  "it": {
    "title_page": "Editor di codice online",
    "desc": "Editor Monaco di VS Code da CDN. Evidenziazione, formato, apertura e download restano nel browser.",
    "themeAuto": "Auto",
    "themeLight": "Chiaro",
    "themeDark": "Scuro",
    "wordWrap": "A capo",
    "minimap": "Minimap",
    "format": "Formatta",
    "copy": "Copia",
    "download": "Scarica",
    "open": "Apri",
    "sample": "Esempio",
    "clear": "Svuota",
    "loading": "Caricamento dell’editor VS Code dal CDN…",
    "copied": "Copiato",
    "formatted": "Formattato",
    "stats": "{n} righe · {c} car.",
    "msgEmpty": "L’editor è vuoto.",
    "msgLib": "Impossibile caricare l’editor VS Code. Controlla la rete e riprova.",
    "msgFail": "Formattazione non riuscita.",
    "msgNoFormat": "Questo linguaggio non ha un formattatore integrato."
  },
  "nl": {
    "title_page": "Online code-editor",
    "desc": "VS Code Monaco-editor via CDN. Markering, opmaak, openen en downloaden blijven in de browser.",
    "themeAuto": "Auto",
    "themeLight": "Licht",
    "themeDark": "Donker",
    "wordWrap": "Regelafbreking",
    "minimap": "Minimap",
    "format": "Opmaken",
    "copy": "Kopiëren",
    "download": "Downloaden",
    "open": "Openen",
    "sample": "Voorbeeld",
    "clear": "Wissen",
    "loading": "VS Code-editor laden vanaf CDN…",
    "copied": "Gekopieerd",
    "formatted": "Opgemaakt",
    "stats": "{n} regels · {c} tekens",
    "msgEmpty": "De editor is leeg.",
    "msgLib": "VS Code-editor kon niet worden geladen. Controleer het netwerk.",
    "msgFail": "Opmaak mislukt.",
    "msgNoFormat": "Deze taal heeft geen ingebouwde formatter."
  },
  "tr": {
    "title_page": "Çevrimiçi kod düzenleyici",
    "desc": "CDN’den VS Code Monaco düzenleyicisi. Vurgulama, biçimlendirme, açma ve indirme tarayıcıda kalır.",
    "themeAuto": "Otomatik",
    "themeLight": "Açık",
    "themeDark": "Koyu",
    "wordWrap": "Satır kaydır",
    "minimap": "Minimap",
    "format": "Biçimlendir",
    "copy": "Kopyala",
    "download": "İndir",
    "open": "Aç",
    "sample": "Örnek",
    "clear": "Temizle",
    "loading": "VS Code düzenleyicisi CDN’den yükleniyor…",
    "copied": "Kopyalandı",
    "formatted": "Biçimlendirildi",
    "stats": "{n} satır · {c} karakter",
    "msgEmpty": "Düzenleyici boş.",
    "msgLib": "VS Code düzenleyicisi yüklenemedi. Ağı kontrol edip tekrar deneyin.",
    "msgFail": "Biçimlendirme başarısız.",
    "msgNoFormat": "Bu dilin yerleşik biçimlendiricisi yok."
  },
  "vi": {
    "title_page": "Soạn thảo mã trực tuyến",
    "desc": "Tải Monaco của VS Code từ CDN. Tô sáng, định dạng, mở và tải xuống đều trong trình duyệt.",
    "themeAuto": "Tự động",
    "themeLight": "Sáng",
    "themeDark": "Tối",
    "wordWrap": "Xuống dòng",
    "minimap": "Minimap",
    "format": "Định dạng",
    "copy": "Sao chép",
    "download": "Tải xuống",
    "open": "Mở tệp",
    "sample": "Mẫu",
    "clear": "Xóa",
    "loading": "Đang tải trình soạn VS Code từ CDN…",
    "copied": "Đã sao chép",
    "formatted": "Đã định dạng",
    "stats": "{n} dòng · {c} ký tự",
    "msgEmpty": "Trình soạn đang trống.",
    "msgLib": "Không tải được trình soạn VS Code. Kiểm tra mạng rồi thử lại.",
    "msgFail": "Định dạng thất bại.",
    "msgNoFormat": "Ngôn ngữ này không có bộ định dạng sẵn."
  },
  "th": {
    "title_page": "แก้ไขโค้ดออนไลน์",
    "desc": "โหลดตัวแก้ไข Monaco ของ VS Code จาก CDN ไฮไลต์ จัดรูปแบบ เปิดและดาวน์โหลดในเบราว์เซอร์",
    "themeAuto": "อัตโนมัติ",
    "themeLight": "สว่าง",
    "themeDark": "มืด",
    "wordWrap": "ขึ้นบรรทัดใหม่",
    "minimap": "มินิแมป",
    "format": "จัดรูปแบบ",
    "copy": "คัดลอก",
    "download": "ดาวน์โหลด",
    "open": "เปิดไฟล์",
    "sample": "ตัวอย่าง",
    "clear": "ล้าง",
    "loading": "กำลังโหลดตัวแก้ไข VS Code จาก CDN…",
    "copied": "คัดลอกแล้ว",
    "formatted": "จัดรูปแบบแล้ว",
    "stats": "{n} บรรทัด · {c} ตัวอักษร",
    "msgEmpty": "ตัวแก้ไขว่างเปล่า",
    "msgLib": "โหลดตัวแก้ไข VS Code ไม่ได้ ตรวจเครือข่ายแล้วลองใหม่",
    "msgFail": "จัดรูปแบบไม่สำเร็จ",
    "msgNoFormat": "ภาษานี้ไม่มีตัวจัดรูปแบบในตัว"
  },
  "id": {
    "title_page": "Editor kode daring",
    "desc": "Editor Monaco VS Code dari CDN. Sorotan, format, buka, dan unduh tetap di browser.",
    "themeAuto": "Otomatis",
    "themeLight": "Terang",
    "themeDark": "Gelap",
    "wordWrap": "Lipat baris",
    "minimap": "Minimap",
    "format": "Format",
    "copy": "Salin",
    "download": "Unduh",
    "open": "Buka berkas",
    "sample": "Contoh",
    "clear": "Hapus",
    "loading": "Memuat editor VS Code dari CDN…",
    "copied": "Disalin",
    "formatted": "Diformat",
    "stats": "{n} baris · {c} karakter",
    "msgEmpty": "Editor masih kosong.",
    "msgLib": "Gagal memuat editor VS Code. Periksa jaringan lalu coba lagi.",
    "msgFail": "Format gagal.",
    "msgNoFormat": "Bahasa ini tidak punya pemformat bawaan."
  },
  "ms": {
    "title_page": "Editor kod dalam talian",
    "desc": "Editor Monaco VS Code dari CDN. Serlahan, format, buka dan muat turun kekal dalam pelayar.",
    "themeAuto": "Auto",
    "themeLight": "Cerah",
    "themeDark": "Gelap",
    "wordWrap": "Balut baris",
    "minimap": "Minimap",
    "format": "Format",
    "copy": "Salin",
    "download": "Muat turun",
    "open": "Buka fail",
    "sample": "Contoh",
    "clear": "Kosongkan",
    "loading": "Memuatkan editor VS Code dari CDN…",
    "copied": "Disalin",
    "formatted": "Diformat",
    "stats": "{n} baris · {c} aksara",
    "msgEmpty": "Editor masih kosong.",
    "msgLib": "Tidak dapat memuatkan editor VS Code. Semak rangkaian dan cuba lagi.",
    "msgFail": "Format gagal.",
    "msgNoFormat": "Bahasa ini tiada pemformat terbina dalam."
  },
  "pl": {
    "title_page": "Edytor kodu online",
    "desc": "Edytor Monaco z VS Code z CDN. Podświetlanie, formatowanie, otwieranie i pobieranie w przeglądarce.",
    "themeAuto": "Auto",
    "themeLight": "Jasny",
    "themeDark": "Ciemny",
    "wordWrap": "Zawijanie",
    "minimap": "Minimapa",
    "format": "Formatuj",
    "copy": "Kopiuj",
    "download": "Pobierz",
    "open": "Otwórz",
    "sample": "Przykład",
    "clear": "Wyczyść",
    "loading": "Ładowanie edytora VS Code z CDN…",
    "copied": "Skopiowano",
    "formatted": "Sformatowano",
    "stats": "{n} wierszy · {c} znaków",
    "msgEmpty": "Edytor jest pusty.",
    "msgLib": "Nie udało się wczytać edytora VS Code. Sprawdź sieć i spróbuj ponownie.",
    "msgFail": "Formatowanie nie powiodło się.",
    "msgNoFormat": "Ten język nie ma wbudowanego formatera."
  },
  "uk": {
    "title_page": "Онлайн-редактор коду",
    "desc": "Редактор Monaco з VS Code через CDN. Підсвітка, форматування, відкриття й завантаження — у браузері.",
    "themeAuto": "Авто",
    "themeLight": "Світла",
    "themeDark": "Темна",
    "wordWrap": "Перенесення",
    "minimap": "Мінікарта",
    "format": "Форматувати",
    "copy": "Копіювати",
    "download": "Завантажити",
    "open": "Відкрити",
    "sample": "Приклад",
    "clear": "Очистити",
    "loading": "Завантаження редактора VS Code з CDN…",
    "copied": "Скопійовано",
    "formatted": "Відформатовано",
    "stats": "{n} рядків · {c} символів",
    "msgEmpty": "Редактор порожній.",
    "msgLib": "Не вдалося завантажити редактор VS Code. Перевірте мережу й повторіть.",
    "msgFail": "Помилка форматування.",
    "msgNoFormat": "Для цієї мови немає вбудованого форматера."
  },
  "sv": {
    "title_page": "Kodredigerare online",
    "desc": "VS Codes Monaco-redigerare via CDN. Markering, formatering, öppna och ladda ner stannar i webbläsaren.",
    "themeAuto": "Auto",
    "themeLight": "Ljust",
    "themeDark": "Mörkt",
    "wordWrap": "Radbrytning",
    "minimap": "Minikarta",
    "format": "Formatera",
    "copy": "Kopiera",
    "download": "Ladda ner",
    "open": "Öppna",
    "sample": "Exempel",
    "clear": "Rensa",
    "loading": "Laddar VS Code-redigeraren från CDN…",
    "copied": "Kopierat",
    "formatted": "Formaterat",
    "stats": "{n} rader · {c} tecken",
    "msgEmpty": "Redigeraren är tom.",
    "msgLib": "Kunde inte ladda VS Code-redigeraren. Kontrollera nätverket och försök igen.",
    "msgFail": "Formatering misslyckades.",
    "msgNoFormat": "Det här språket har ingen inbyggd formaterare."
  },
  "zh-TW": {
    "title_page": "線上程式碼編輯",
    "desc": "以 CDN 載入 VS Code 同款 Monaco 編輯器，可高亮、格式化、開啟與下載多種語言程式碼。資料不會上傳。",
    "themeAuto": "跟隨網站",
    "themeLight": "淺色",
    "themeDark": "深色",
    "wordWrap": "自動換行",
    "minimap": "小地圖",
    "format": "格式化",
    "copy": "複製",
    "download": "下載",
    "open": "開啟檔案",
    "sample": "範例",
    "clear": "清空",
    "loading": "正在從 CDN 載入 VS Code 編輯器…",
    "copied": "已複製",
    "formatted": "已格式化",
    "stats": "{n} 行 · {c} 字元",
    "msgEmpty": "編輯器裡還沒有內容。",
    "msgLib": "無法載入 VS Code 編輯器，請檢查網路後重試。",
    "msgFail": "格式化失敗。",
    "msgNoFormat": "目前語言沒有內建格式化。"
  }
}
</i18n>
