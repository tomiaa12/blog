<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useData } from "vitepress"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { copyToClipboard } from "@/utils"
import { ensurePrettier } from "./loadPrettier"
import { ensureCsso, ensureHtmlMinify, ensureTerser } from "./loadMinify"
import { highlightCode } from "../../sql-format/components/loadHighlight"

const { t } = useI18n()
const { isDark } = useData()

const LANGS = [
  "javascript",
  "typescript",
  "json",
  "html",
  "vue",
  "css",
  "scss",
  "less",
  "markdown",
  "yaml",
] as const

type Lang = (typeof LANGS)[number]

const PARSER: Record<Lang, string> = {
  javascript: "babel",
  typescript: "typescript",
  json: "json",
  html: "html",
  vue: "vue",
  css: "css",
  scss: "scss",
  less: "less",
  markdown: "markdown",
  yaml: "yaml",
}

const HL_LANG: Record<Lang, string> = {
  javascript: "javascript",
  typescript: "typescript",
  json: "json",
  html: "xml",
  vue: "xml",
  css: "css",
  scss: "scss",
  less: "less",
  markdown: "markdown",
  yaml: "yaml",
}

const EXT: Record<string, Lang> = {
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  json: "json",
  html: "html",
  htm: "html",
  vue: "vue",
  css: "css",
  scss: "scss",
  less: "less",
  md: "markdown",
  markdown: "markdown",
  yml: "yaml",
  yaml: "yaml",
}

const DOWNLOAD_EXT: Record<Lang, string> = {
  javascript: "js",
  typescript: "ts",
  json: "json",
  html: "html",
  vue: "vue",
  css: "css",
  scss: "scss",
  less: "less",
  markdown: "md",
  yaml: "yaml",
}

const SAMPLES: Record<Lang, string> = {
  javascript: `function greet(name){const msg="Hello, "+name+"!";console.log(msg);return msg}greet("world")`,
  typescript: `type User={id:number;name:string};function greet(user:User):string{return \`Hi, \${user.name}\`}greet({id:1,name:"Ada"})`,
  json: `{"name":"kyx","tools":["format","minify"],"ok":true}`,
  html: `<!DOCTYPE html><html><body><h1 class="title">Hello</h1><p>Format me</p></body></html>`,
  vue: `<template><div class="box"><h1>{{title}}</h1></div></template><script setup>const title="Hello"<\/script>`,
  css: `.hero{color:#3b82f6;font-size:24px;margin:0 auto} .hero h1{font-weight:700}`,
  scss: `$brand:#3b82f6;.hero{color:$brand;& h1{font-weight:700}}`,
  less: `@brand:#3b82f6;.hero{color:@brand;h1{font-weight:700}}`,
  markdown: `# Title\n\nSome **bold** and a list:\n- a\n- b`,
  yaml: `app:\n  name: kyx\n  port: 8080\n  features: [format, minify]`,
}

const input = ref(SAMPLES.javascript)
const output = ref("")
const highlighted = ref("")
const language = ref<Lang>("javascript")
const indent = ref<"2" | "4" | "tab">("2")
const printWidth = ref(80)
const singleQuote = ref(false)
const semi = ref(true)
const mangle = ref(true)
const running = ref(false)
const inBytes = ref(0)
const outBytes = ref(0)
const fileRef = ref<HTMLInputElement | null>(null)

const indentOpt = computed(() =>
  indent.value === "tab"
    ? { useTabs: true, tabWidth: 2 }
    : { useTabs: false, tabWidth: Number(indent.value) }
)

const ratio = computed(() => {
  if (!inBytes.value) return ""
  return `${Math.round((outBytes.value / inBytes.value) * 100)}%`
})

function byteLen(text: string) {
  return new TextEncoder().encode(text).length
}

function needText() {
  if (input.value.trim()) return true
  ElMessage({ message: t("msgEmpty"), type: "warning" })
  return false
}

function libError(err: unknown) {
  const msg = err instanceof Error ? err.message : ""
  return /prettier|Terser|csso|HTMLMinifier|hljs|资源/.test(msg)
}

async function paint(text: string) {
  output.value = text
  inBytes.value = byteLen(input.value)
  outBytes.value = byteLen(text)
  if (!text) {
    highlighted.value = ""
    return
  }
  try {
    highlighted.value = await highlightCode(text, HL_LANG[language.value], isDark.value)
  } catch {
    highlighted.value = ""
  }
}

watch(isDark, () => {
  if (output.value) void paint(output.value)
})

async function formatCode() {
  if (!needText()) return
  running.value = true
  try {
    const { prettier, plugins } = await ensurePrettier()
    const text = await prettier.format(input.value, {
      parser: PARSER[language.value],
      plugins,
      printWidth: printWidth.value,
      singleQuote: singleQuote.value,
      semi: semi.value,
      trailingComma: "es5",
      ...indentOpt.value,
    })
    await paint(text)
  } catch (err) {
    ElMessage({ message: libError(err) ? t("msgLib") : t("msgFail"), type: "error" })
  } finally {
    running.value = false
  }
}

async function minifyJs(code: string) {
  const terser = await ensureTerser()
  const result = await terser.minify(code, {
    compress: true,
    mangle: mangle.value,
    format: { comments: false },
  })
  if (result.error) throw result.error
  if (!result.code) throw new Error("empty")
  return result.code
}

async function minifyCss(code: string) {
  const csso = await ensureCsso()
  return csso.minify(code, { restructure: true }).css
}

async function minifyHtml(code: string) {
  const minify = await ensureHtmlMinify()
  return minify(code, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    removeRedundantAttributes: true,
  })
}

function minifyJson(code: string) {
  return JSON.stringify(JSON.parse(code))
}

function minifySoft(code: string) {
  return code.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim()
}

async function minifyCode() {
  if (!needText()) return
  running.value = true
  try {
    const lang = language.value
    const src = input.value
    let text = src
    if (lang === "javascript") text = await minifyJs(src)
    else if (lang === "typescript") {
      try {
        text = await minifyJs(src)
      } catch {
        throw new Error("ts-minify")
      }
    } else if (lang === "json") text = minifyJson(src)
    else if (lang === "css" || lang === "scss" || lang === "less") text = await minifyCss(src)
    else if (lang === "html" || lang === "vue") text = await minifyHtml(src)
    else text = minifySoft(src)
    await paint(text)
  } catch (err) {
    const msg = err instanceof Error ? err.message : ""
    ElMessage({
      message: msg === "ts-minify" ? t("msgTs") : libError(err) ? t("msgLib") : t("msgFail"),
      type: "error",
    })
  } finally {
    running.value = false
  }
}

async function copyOut() {
  if (!output.value) {
    ElMessage({ message: t("msgNoOut"), type: "warning" })
    return
  }
  await copyToClipboard(output.value)
  ElMessage({ message: t("copied"), type: "success", duration: 1500 })
}

function download() {
  if (!output.value) {
    ElMessage({ message: t("msgNoOut"), type: "warning" })
    return
  }
  const a = document.createElement("a")
  a.href = URL.createObjectURL(new Blob([output.value], { type: "text/plain;charset=utf-8" }))
  a.download = `code.${DOWNLOAD_EXT[language.value]}`
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(a.href)
}

function toInput() {
  if (!output.value) return
  input.value = output.value
}

function useSample() {
  input.value = SAMPLES[language.value]
}

function clearAll() {
  input.value = ""
  output.value = ""
  highlighted.value = ""
  inBytes.value = 0
  outBytes.value = 0
}

function openFile() {
  fileRef.value?.click()
}

async function onFile(ev: Event) {
  const el = ev.target as HTMLInputElement
  const file = el.files?.[0]
  el.value = ""
  if (!file) return
  const ext = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase()
    : ""
  if (ext && EXT[ext]) language.value = EXT[ext]
  input.value = await file.text()
}
</script>

<template>
  <div class="fmt-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <el-select
        v-model="language"
        class="lang"
        filterable
        @change="useSample"
      >
        <el-option
          v-for="lang in LANGS"
          :key="lang"
          :label="lang"
          :value="lang"
        />
      </el-select>
      <el-radio-group v-model="indent">
        <el-radio-button value="2">{{ t("indent2") }}</el-radio-button>
        <el-radio-button value="4">{{ t("indent4") }}</el-radio-button>
        <el-radio-button value="tab">{{ t("indentTab") }}</el-radio-button>
      </el-radio-group>
      <el-select
        v-model="printWidth"
        class="width"
      >
        <el-option
          :value="80"
          label="80"
        />
        <el-option
          :value="100"
          label="100"
        />
        <el-option
          :value="120"
          label="120"
        />
      </el-select>
      <el-switch
        v-model="singleQuote"
        :active-text="t('singleQuote')"
      />
      <el-switch
        v-model="semi"
        :active-text="t('semi')"
      />
      <el-switch
        v-model="mangle"
        :active-text="t('mangle')"
      />
      <span
        v-if="outBytes"
        class="status"
      >
        {{ t("stats", { a: inBytes, b: outBytes, r: ratio }) }}
      </span>
    </div>

    <div class="actions">
      <el-button
        type="primary"
        :loading="running"
        @click="formatCode"
      >
        {{ t("format") }}
      </el-button>
      <el-button
        :loading="running"
        @click="minifyCode"
      >
        {{ t("minify") }}
      </el-button>
      <el-button @click="copyOut">{{ t("copy") }}</el-button>
      <el-button @click="download">{{ t("download") }}</el-button>
      <el-button @click="toInput">{{ t("toInput") }}</el-button>
      <el-button @click="openFile">{{ t("open") }}</el-button>
      <el-button @click="useSample">{{ t("sample") }}</el-button>
      <el-button @click="clearAll">{{ t("clear") }}</el-button>
    </div>

    <input
      ref="fileRef"
      type="file"
      class="file-input"
      @change="onFile"
    >

    <div class="panes">
      <div class="pane">
        <div class="pane-label">{{ t("inputLabel") }}</div>
        <el-input
          v-model="input"
          type="textarea"
          :rows="16"
          :placeholder="t('placeholder')"
          resize="vertical"
          class="code-area"
        />
      </div>
      <div class="pane">
        <div class="pane-label">{{ t("outputLabel") }}</div>
        <pre
          v-if="highlighted"
          class="code-out hljs"
        ><code v-html="highlighted" /></pre>
        <div
          v-else
          class="code-out code-out-empty"
        >
          {{ t("outputHint") }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fmt-page {
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
  width: 150px;
}

.width {
  width: 90px;
}

.status {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.file-input {
  display: none;
}

.panes {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  min-width: 0;
}

@media (max-width: 800px) {
  .panes {
    grid-template-columns: minmax(0, 1fr);
  }
}

.pane {
  min-width: 0;
}

.pane-label {
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.code-area {
  :deep(textarea) {
    font-family: "Fira Code", "Cascadia Code", Consolas, monospace;
    font-size: 0.88rem;
    line-height: 1.55;
    min-height: 360px;
  }
}

.code-out {
  margin: 0;
  min-width: 0;
  max-width: 100%;
  min-height: 360px;
  max-height: 640px;
  overflow-x: auto;
  overflow-y: auto;
  padding: 11px 15px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  font-family: "Fira Code", "Cascadia Code", Consolas, monospace;
  font-size: 0.88rem;
  line-height: 1.55;
  white-space: pre;
  word-break: normal;

  code {
    display: block;
    width: max-content;
    min-width: 100%;
    font-family: inherit;
    font-size: inherit;
    background: transparent;
    padding: 0;
  }
}

.code-out-empty {
  color: var(--vp-c-text-3);
  white-space: normal;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "代码格式化 / 压缩",
    "desc": "用 Prettier 格式化 JavaScript、TypeScript、HTML、CSS、JSON、Vue、Markdown、YAML，也可用 Terser / CSSO 等压缩。库从 CDN 加载，数据不会上传。",
    "indent2": "2 空格",
    "indent4": "4 空格",
    "indentTab": "Tab",
    "singleQuote": "单引号",
    "semi": "分号",
    "mangle": "压缩时混淆变量名",
    "format": "格式化",
    "minify": "压缩",
    "copy": "复制结果",
    "download": "下载",
    "toInput": "结果回填",
    "open": "打开文件",
    "sample": "示例",
    "clear": "清空",
    "inputLabel": "输入",
    "outputLabel": "输出",
    "placeholder": "粘贴代码…",
    "outputHint": "点击上方按钮后显示结果",
    "copied": "已复制",
    "stats": "{a} → {b} 字节（{r}）",
    "msgEmpty": "请先输入代码。",
    "msgNoOut": "还没有可复制或下载的结果。",
    "msgLib": "无法从 CDN 加载所需库，请检查网络后重试。",
    "msgFail": "处理失败，请检查语法是否正确。",
    "msgTs": "Terser 无法压缩带类型的 TypeScript，请先编译成 JavaScript。"
  },
  "zh-CN": {
    "title_page": "代码格式化 / 压缩",
    "desc": "用 Prettier 格式化 JavaScript、TypeScript、HTML、CSS、JSON、Vue、Markdown、YAML，也可用 Terser / CSSO 等压缩。库从 CDN 加载，数据不会上传。",
    "indent2": "2 空格",
    "indent4": "4 空格",
    "indentTab": "Tab",
    "singleQuote": "单引号",
    "semi": "分号",
    "mangle": "压缩时混淆变量名",
    "format": "格式化",
    "minify": "压缩",
    "copy": "复制结果",
    "download": "下载",
    "toInput": "结果回填",
    "open": "打开文件",
    "sample": "示例",
    "clear": "清空",
    "inputLabel": "输入",
    "outputLabel": "输出",
    "placeholder": "粘贴代码…",
    "outputHint": "点击上方按钮后显示结果",
    "copied": "已复制",
    "stats": "{a} → {b} 字节（{r}）",
    "msgEmpty": "请先输入代码。",
    "msgNoOut": "还没有可复制或下载的结果。",
    "msgLib": "无法从 CDN 加载所需库，请检查网络后重试。",
    "msgFail": "处理失败，请检查语法是否正确。",
    "msgTs": "Terser 无法压缩带类型的 TypeScript，请先编译成 JavaScript。"
  },
  "en": {
    "title_page": "Format / Minify Code",
    "desc": "Format JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown, and YAML with Prettier, or minify with Terser / CSSO. Libraries load from a CDN. Nothing is uploaded.",
    "indent2": "2 spaces",
    "indent4": "4 spaces",
    "indentTab": "Tab",
    "singleQuote": "Single quotes",
    "semi": "Semicolons",
    "mangle": "Mangle names when minifying",
    "format": "Format",
    "minify": "Minify",
    "copy": "Copy result",
    "download": "Download",
    "toInput": "Send to input",
    "open": "Open file",
    "sample": "Sample",
    "clear": "Clear",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Paste code…",
    "outputHint": "Result appears after you run a command",
    "copied": "Copied",
    "stats": "{a} → {b} bytes ({r})",
    "msgEmpty": "Enter some code first.",
    "msgNoOut": "There is nothing to copy or download yet.",
    "msgLib": "Could not load libraries from the CDN. Check your network and retry.",
    "msgFail": "Failed. Check that the syntax is valid.",
    "msgTs": "Terser cannot minify typed TypeScript. Compile to JavaScript first."
  },
  "ja": {
    "title_page": "コード整形 / 圧縮",
    "desc": "Prettier で JavaScript、TypeScript、HTML、CSS、JSON、Vue、Markdown、YAML を整形し、Terser / CSSO で圧縮できます。CDN から読み込み、アップロードしません。",
    "indent2": "2 スペース",
    "indent4": "4 スペース",
    "indentTab": "Tab",
    "singleQuote": "単一引用符",
    "semi": "セミコロン",
    "mangle": "圧縮時に変数名を短縮",
    "format": "整形",
    "minify": "圧縮",
    "copy": "結果をコピー",
    "download": "ダウンロード",
    "toInput": "結果を入力へ",
    "open": "ファイルを開く",
    "sample": "サンプル",
    "clear": "クリア",
    "inputLabel": "入力",
    "outputLabel": "出力",
    "placeholder": "コードを貼り付け…",
    "outputHint": "上のボタンを押すと結果が表示されます",
    "copied": "コピーしました",
    "stats": "{a} → {b} バイト（{r}）",
    "msgEmpty": "先にコードを入力してください。",
    "msgNoOut": "コピーまたは保存できる結果がありません。",
    "msgLib": "CDN からライブラリを読み込めません。通信を確認して再試行してください。",
    "msgFail": "失敗しました。構文を確認してください。",
    "msgTs": "Terser は型付き TypeScript を圧縮できません。先に JavaScript へコンパイルしてください。"
  },
  "ko": {
    "title_page": "코드 포맷 / 압축",
    "desc": "Prettier로 JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown, YAML을 포맷하고 Terser / CSSO로 압축합니다. CDN에서 불러오며 업로드하지 않습니다.",
    "indent2": "공백 2",
    "indent4": "공백 4",
    "indentTab": "Tab",
    "singleQuote": "작은따옴표",
    "semi": "세미콜론",
    "mangle": "압축 시 이름 단축",
    "format": "포맷",
    "minify": "압축",
    "copy": "결과 복사",
    "download": "다운로드",
    "toInput": "결과를 입력으로",
    "open": "파일 열기",
    "sample": "예제",
    "clear": "지우기",
    "inputLabel": "입력",
    "outputLabel": "출력",
    "placeholder": "코드 붙여넣기…",
    "outputHint": "위 버튼을 누르면 결과가 나타납니다",
    "copied": "복사됨",
    "stats": "{a} → {b}바이트 ({r})",
    "msgEmpty": "먼저 코드를 입력하세요.",
    "msgNoOut": "복사하거나 받을 결과가 없습니다.",
    "msgLib": "CDN에서 라이브러리를 불러오지 못했습니다. 네트워크를 확인하세요.",
    "msgFail": "실패했습니다. 문법을 확인하세요.",
    "msgTs": "Terser는 타입이 있는 TypeScript를 압축하지 못합니다. 먼저 JavaScript로 컴파일하세요."
  },
  "fr": {
    "title_page": "Formater / minifier le code",
    "desc": "Formatez JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown et YAML avec Prettier, ou minifiez avec Terser / CSSO. Bibliothèques via CDN, rien n’est envoyé.",
    "indent2": "2 espaces",
    "indent4": "4 espaces",
    "indentTab": "Tab",
    "singleQuote": "Guillemets simples",
    "semi": "Points-virgules",
    "mangle": "Raccourcir les noms à la minification",
    "format": "Formater",
    "minify": "Minifier",
    "copy": "Copier le résultat",
    "download": "Télécharger",
    "toInput": "Renvoyer en entrée",
    "open": "Ouvrir",
    "sample": "Exemple",
    "clear": "Effacer",
    "inputLabel": "Entrée",
    "outputLabel": "Sortie",
    "placeholder": "Collez du code…",
    "outputHint": "Le résultat apparaît après une action",
    "copied": "Copié",
    "stats": "{a} → {b} octets ({r})",
    "msgEmpty": "Saisissez d’abord du code.",
    "msgNoOut": "Rien à copier ou télécharger.",
    "msgLib": "Impossible de charger les bibliothèques CDN. Vérifiez le réseau.",
    "msgFail": "Échec. Vérifiez la syntaxe.",
    "msgTs": "Terser ne minifie pas le TypeScript typé. Compilez d’abord en JavaScript."
  },
  "de": {
    "title_page": "Code formatieren / minifizieren",
    "desc": "JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown und YAML mit Prettier formatieren oder mit Terser / CSSO minifizieren. Bibliotheken per CDN, nichts wird hochgeladen.",
    "indent2": "2 Leerzeichen",
    "indent4": "4 Leerzeichen",
    "indentTab": "Tab",
    "singleQuote": "Einfache Anführungszeichen",
    "semi": "Semikolons",
    "mangle": "Namen beim Minifizieren kürzen",
    "format": "Formatieren",
    "minify": "Minifizieren",
    "copy": "Ergebnis kopieren",
    "download": "Download",
    "toInput": "Ins Eingabefeld",
    "open": "Öffnen",
    "sample": "Beispiel",
    "clear": "Leeren",
    "inputLabel": "Eingabe",
    "outputLabel": "Ausgabe",
    "placeholder": "Code einfügen…",
    "outputHint": "Ergebnis erscheint nach einem Klick",
    "copied": "Kopiert",
    "stats": "{a} → {b} Bytes ({r})",
    "msgEmpty": "Bitte zuerst Code eingeben.",
    "msgNoOut": "Noch nichts zum Kopieren oder Laden.",
    "msgLib": "CDN-Bibliotheken konnten nicht geladen werden. Netz prüfen.",
    "msgFail": "Fehlgeschlagen. Syntax prüfen.",
    "msgTs": "Terser kann getyptes TypeScript nicht minifizieren. Zuerst nach JavaScript kompilieren."
  },
  "es": {
    "title_page": "Formatear / minificar código",
    "desc": "Formatea JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown y YAML con Prettier, o minifica con Terser / CSSO. Librerías por CDN, no se sube nada.",
    "indent2": "2 espacios",
    "indent4": "4 espacios",
    "indentTab": "Tab",
    "singleQuote": "Comillas simples",
    "semi": "Punto y coma",
    "mangle": "Acortar nombres al minificar",
    "format": "Formatear",
    "minify": "Minificar",
    "copy": "Copiar resultado",
    "download": "Descargar",
    "toInput": "Enviar a entrada",
    "open": "Abrir",
    "sample": "Ejemplo",
    "clear": "Borrar",
    "inputLabel": "Entrada",
    "outputLabel": "Salida",
    "placeholder": "Pega código…",
    "outputHint": "El resultado aparece tras pulsar un botón",
    "copied": "Copiado",
    "stats": "{a} → {b} bytes ({r})",
    "msgEmpty": "Escribe código primero.",
    "msgNoOut": "Aún no hay nada que copiar o descargar.",
    "msgLib": "No se pudieron cargar las librerías del CDN. Revisa la red.",
    "msgFail": "Error. Comprueba la sintaxis.",
    "msgTs": "Terser no minifica TypeScript con tipos. Compílalo primero a JavaScript."
  },
  "pt": {
    "title_page": "Formatar / minificar código",
    "desc": "Formate JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown e YAML com Prettier, ou minifique com Terser / CSSO. Bibliotecas via CDN, nada é enviado.",
    "indent2": "2 espaços",
    "indent4": "4 espaços",
    "indentTab": "Tab",
    "singleQuote": "Aspas simples",
    "semi": "Ponto e vírgula",
    "mangle": "Encurtar nomes ao minificar",
    "format": "Formatar",
    "minify": "Minificar",
    "copy": "Copiar resultado",
    "download": "Baixar",
    "toInput": "Enviar à entrada",
    "open": "Abrir",
    "sample": "Exemplo",
    "clear": "Limpar",
    "inputLabel": "Entrada",
    "outputLabel": "Saída",
    "placeholder": "Cole código…",
    "outputHint": "O resultado aparece após um comando",
    "copied": "Copiado",
    "stats": "{a} → {b} bytes ({r})",
    "msgEmpty": "Digite código primeiro.",
    "msgNoOut": "Ainda não há o que copiar ou baixar.",
    "msgLib": "Não foi possível carregar as bibliotecas do CDN. Verifique a rede.",
    "msgFail": "Falha. Confira a sintaxe.",
    "msgTs": "O Terser não minifica TypeScript com tipos. Compile para JavaScript primeiro."
  },
  "ru": {
    "title_page": "Форматирование / сжатие кода",
    "desc": "Форматируйте JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown и YAML через Prettier или сжимайте Terser / CSSO. Библиотеки с CDN, ничего не загружается.",
    "indent2": "2 пробела",
    "indent4": "4 пробела",
    "indentTab": "Tab",
    "singleQuote": "Одинарные кавычки",
    "semi": "Точки с запятой",
    "mangle": "Короткие имена при сжатии",
    "format": "Форматировать",
    "minify": "Сжать",
    "copy": "Копировать результат",
    "download": "Скачать",
    "toInput": "В поле ввода",
    "open": "Открыть",
    "sample": "Пример",
    "clear": "Очистить",
    "inputLabel": "Ввод",
    "outputLabel": "Вывод",
    "placeholder": "Вставьте код…",
    "outputHint": "Результат появится после кнопки",
    "copied": "Скопировано",
    "stats": "{a} → {b} байт ({r})",
    "msgEmpty": "Сначала введите код.",
    "msgNoOut": "Пока нечего копировать или скачивать.",
    "msgLib": "Не удалось загрузить библиотеки с CDN. Проверьте сеть.",
    "msgFail": "Ошибка. Проверьте синтаксис.",
    "msgTs": "Terser не сжимает TypeScript с типами. Сначала скомпилируйте в JavaScript."
  },
  "ar": {
    "title_page": "تنسيق / ضغط الشفرة",
    "desc": "نسّق JavaScript وTypeScript وHTML وCSS وJSON وVue وMarkdown وYAML عبر Prettier، أو اضغط بـ Terser / CSSO. المكتبات من CDN ولا يُرفع شيء.",
    "indent2": "مسافتان",
    "indent4": "4 مسافات",
    "indentTab": "Tab",
    "singleQuote": "علامات مفردة",
    "semi": "فواصل منقوطة",
    "mangle": "اختصار الأسماء عند الضغط",
    "format": "تنسيق",
    "minify": "ضغط",
    "copy": "نسخ النتيجة",
    "download": "تنزيل",
    "toInput": "إلى الإدخال",
    "open": "فتح",
    "sample": "مثال",
    "clear": "مسح",
    "inputLabel": "إدخال",
    "outputLabel": "إخراج",
    "placeholder": "الصق الشفرة…",
    "outputHint": "تظهر النتيجة بعد الضغط على زر",
    "copied": "تم النسخ",
    "stats": "{a} → {b} بايت ({r})",
    "msgEmpty": "أدخل الشفرة أولاً.",
    "msgNoOut": "لا شيء للنسخ أو التنزيل بعد.",
    "msgLib": "تعذر تحميل مكتبات CDN. تحقق من الشبكة.",
    "msgFail": "فشل. تحقق من الصيغة.",
    "msgTs": "Terser لا يضغط TypeScript ذا الأنواع. ترجم إلى JavaScript أولاً."
  },
  "hi": {
    "title_page": "कोड फ़ॉर्मेट / संक्षिप्त करें",
    "desc": "Prettier से JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown, YAML फ़ॉर्मेट करें, या Terser / CSSO से छोटा करें। लाइब्रेरी CDN से, कुछ अपलोड नहीं होता।",
    "indent2": "2 स्पेस",
    "indent4": "4 स्पेस",
    "indentTab": "Tab",
    "singleQuote": "एकल उद्धरण",
    "semi": "अर्धविराम",
    "mangle": "संक्षिप्त करते समय नाम छोटा करें",
    "format": "फ़ॉर्मेट",
    "minify": "संक्षिप्त",
    "copy": "परिणाम कॉपी",
    "download": "डाउनलोड",
    "toInput": "इनपुट में भेजें",
    "open": "खोलें",
    "sample": "उदाहरण",
    "clear": "साफ़",
    "inputLabel": "इनपुट",
    "outputLabel": "आउटपुट",
    "placeholder": "कोड चिपकाएँ…",
    "outputHint": "बटन दबाने पर परिणाम दिखेगा",
    "copied": "कॉपी हो गया",
    "stats": "{a} → {b} बाइट ({r})",
    "msgEmpty": "पहले कोड लिखें।",
    "msgNoOut": "कॉपी या डाउनलोड करने को कुछ नहीं।",
    "msgLib": "CDN से लाइब्रेरी नहीं मिली। नेटवर्क जाँचें।",
    "msgFail": "असफल। वाक्य रचना जाँचें।",
    "msgTs": "Terser टाइप वाले TypeScript को छोटा नहीं कर सकता। पहले JavaScript में कंपाइल करें।"
  },
  "it": {
    "title_page": "Formatta / minimizza codice",
    "desc": "Formatta JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown e YAML con Prettier, o minimizza con Terser / CSSO. Librerie da CDN, nulla viene caricato.",
    "indent2": "2 spazi",
    "indent4": "4 spazi",
    "indentTab": "Tab",
    "singleQuote": "Apici singoli",
    "semi": "Punto e virgola",
    "mangle": "Accorcia i nomi in minimizzazione",
    "format": "Formatta",
    "minify": "Minimizza",
    "copy": "Copia risultato",
    "download": "Scarica",
    "toInput": "Invia all’input",
    "open": "Apri",
    "sample": "Esempio",
    "clear": "Svuota",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Incolla codice…",
    "outputHint": "Il risultato appare dopo un pulsante",
    "copied": "Copiato",
    "stats": "{a} → {b} byte ({r})",
    "msgEmpty": "Inserisci prima del codice.",
    "msgNoOut": "Non c’è ancora nulla da copiare o scaricare.",
    "msgLib": "Impossibile caricare le librerie CDN. Controlla la rete.",
    "msgFail": "Errore. Controlla la sintassi.",
    "msgTs": "Terser non minimizza TypeScript con i tipi. Compila prima in JavaScript."
  },
  "nl": {
    "title_page": "Code opmaken / verkleinen",
    "desc": "Maak JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown en YAML op met Prettier, of verklein met Terser / CSSO. Bibliotheken via CDN, niets wordt geüpload.",
    "indent2": "2 spaties",
    "indent4": "4 spaties",
    "indentTab": "Tab",
    "singleQuote": "Enkele aanhalingstekens",
    "semi": "Puntkomma’s",
    "mangle": "Namen inkorten bij verkleinen",
    "format": "Opmaak",
    "minify": "Verkleinen",
    "copy": "Resultaat kopiëren",
    "download": "Downloaden",
    "toInput": "Naar invoer",
    "open": "Openen",
    "sample": "Voorbeeld",
    "clear": "Wissen",
    "inputLabel": "Invoer",
    "outputLabel": "Uitvoer",
    "placeholder": "Plak code…",
    "outputHint": "Resultaat verschijnt na een knop",
    "copied": "Gekopieerd",
    "stats": "{a} → {b} bytes ({r})",
    "msgEmpty": "Voer eerst code in.",
    "msgNoOut": "Nog niets om te kopiëren of downloaden.",
    "msgLib": "CDN-bibliotheken konden niet worden geladen. Controleer het netwerk.",
    "msgFail": "Mislukt. Controleer de syntaxis.",
    "msgTs": "Terser kan getypeerde TypeScript niet verkleinen. Compileer eerst naar JavaScript."
  },
  "tr": {
    "title_page": "Kod biçimlendir / küçült",
    "desc": "Prettier ile JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown ve YAML biçimlendirin; Terser / CSSO ile küçültün. Kitaplıklar CDN’den, hiçbir şey yüklenmez.",
    "indent2": "2 boşluk",
    "indent4": "4 boşluk",
    "indentTab": "Tab",
    "singleQuote": "Tek tırnak",
    "semi": "Noktalı virgül",
    "mangle": "Küçültürken adları kısalt",
    "format": "Biçimlendir",
    "minify": "Küçült",
    "copy": "Sonucu kopyala",
    "download": "İndir",
    "toInput": "Girdiye gönder",
    "open": "Aç",
    "sample": "Örnek",
    "clear": "Temizle",
    "inputLabel": "Girdi",
    "outputLabel": "Çıktı",
    "placeholder": "Kod yapıştırın…",
    "outputHint": "Sonuç bir düğmeden sonra görünür",
    "copied": "Kopyalandı",
    "stats": "{a} → {b} bayt ({r})",
    "msgEmpty": "Önce kod girin.",
    "msgNoOut": "Kopyalanacak veya indirilecek bir şey yok.",
    "msgLib": "CDN kitaplıkları yüklenemedi. Ağı kontrol edin.",
    "msgFail": "Başarısız. Sözdizimini kontrol edin.",
    "msgTs": "Terser tipli TypeScript’i küçültmez. Önce JavaScript’e derleyin."
  },
  "vi": {
    "title_page": "Định dạng / nén mã",
    "desc": "Định dạng JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown, YAML bằng Prettier, hoặc nén bằng Terser / CSSO. Thư viện từ CDN, không tải lên.",
    "indent2": "2 khoảng trắng",
    "indent4": "4 khoảng trắng",
    "indentTab": "Tab",
    "singleQuote": "Dấu nháy đơn",
    "semi": "Dấu chấm phẩy",
    "mangle": "Rút gọn tên khi nén",
    "format": "Định dạng",
    "minify": "Nén",
    "copy": "Sao chép kết quả",
    "download": "Tải xuống",
    "toInput": "Đưa về ô nhập",
    "open": "Mở tệp",
    "sample": "Mẫu",
    "clear": "Xóa",
    "inputLabel": "Nhập",
    "outputLabel": "Xuất",
    "placeholder": "Dán mã…",
    "outputHint": "Kết quả hiện sau khi bấm nút",
    "copied": "Đã sao chép",
    "stats": "{a} → {b} byte ({r})",
    "msgEmpty": "Hãy nhập mã trước.",
    "msgNoOut": "Chưa có gì để sao chép hoặc tải.",
    "msgLib": "Không tải được thư viện CDN. Kiểm tra mạng.",
    "msgFail": "Thất bại. Kiểm tra cú pháp.",
    "msgTs": "Terser không nén được TypeScript có kiểu. Hãy biên dịch sang JavaScript trước."
  },
  "th": {
    "title_page": "จัดรูปแบบ / บีบอัดโค้ด",
    "desc": "จัดรูปแบบ JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown, YAML ด้วย Prettier หรือบีบด้วย Terser / CSSO ไลบรารีจาก CDN ไม่ได้อัปโหลด",
    "indent2": "เว้น 2",
    "indent4": "เว้น 4",
    "indentTab": "Tab",
    "singleQuote": "อัญประกาศเดี่ยว",
    "semi": "อัฒภาค",
    "mangle": "ย่อชื่อตอนบีบอัด",
    "format": "จัดรูปแบบ",
    "minify": "บีบอัด",
    "copy": "คัดลอกผลลัพธ์",
    "download": "ดาวน์โหลด",
    "toInput": "ส่งกลับช่องใส่",
    "open": "เปิดไฟล์",
    "sample": "ตัวอย่าง",
    "clear": "ล้าง",
    "inputLabel": "อินพุต",
    "outputLabel": "เอาต์พุต",
    "placeholder": "วางโค้ด…",
    "outputHint": "ผลลัพธ์จะโชว์หลังกดปุ่ม",
    "copied": "คัดลอกแล้ว",
    "stats": "{a} → {b} ไบต์ ({r})",
    "msgEmpty": "ใส่โค้ดก่อน",
    "msgNoOut": "ยังไม่มีอะไรให้คัดลอกหรือดาวน์โหลด",
    "msgLib": "โหลดไลบรารี CDN ไม่ได้ ตรวจเครือข่าย",
    "msgFail": "ล้มเหลว ตรวจไวยากรณ์",
    "msgTs": "Terser บีบ TypeScript ที่มีชนิดไม่ได้ โปรดคอมไพล์เป็น JavaScript ก่อน"
  },
  "id": {
    "title_page": "Format / minifikasi kode",
    "desc": "Format JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown, YAML dengan Prettier, atau minifikasi dengan Terser / CSSO. Pustaka dari CDN, tidak diunggah.",
    "indent2": "2 spasi",
    "indent4": "4 spasi",
    "indentTab": "Tab",
    "singleQuote": "Tanda kutip tunggal",
    "semi": "Titik koma",
    "mangle": "Persingkat nama saat minifikasi",
    "format": "Format",
    "minify": "Minifikasi",
    "copy": "Salin hasil",
    "download": "Unduh",
    "toInput": "Kirim ke input",
    "open": "Buka",
    "sample": "Contoh",
    "clear": "Hapus",
    "inputLabel": "Masukan",
    "outputLabel": "Keluaran",
    "placeholder": "Tempel kode…",
    "outputHint": "Hasil muncul setelah tombol",
    "copied": "Disalin",
    "stats": "{a} → {b} bita ({r})",
    "msgEmpty": "Masukkan kode dulu.",
    "msgNoOut": "Belum ada yang bisa disalin atau diunduh.",
    "msgLib": "Gagal memuat pustaka CDN. Periksa jaringan.",
    "msgFail": "Gagal. Periksa sintaks.",
    "msgTs": "Terser tidak dapat meminifikasi TypeScript bertipe. Kompilasi ke JavaScript dulu."
  },
  "ms": {
    "title_page": "Format / kecilkan kod",
    "desc": "Format JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown, YAML dengan Prettier, atau kecilkan dengan Terser / CSSO. Pustaka dari CDN, tiada dimuat naik.",
    "indent2": "2 ruang",
    "indent4": "4 ruang",
    "indentTab": "Tab",
    "singleQuote": "Tanda petik tunggal",
    "semi": "Koma bernoktah",
    "mangle": "Pendekkan nama semasa mengecil",
    "format": "Format",
    "minify": "Kecilkan",
    "copy": "Salin hasil",
    "download": "Muat turun",
    "toInput": "Hantar ke input",
    "open": "Buka",
    "sample": "Contoh",
    "clear": "Kosongkan",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Tampal kod…",
    "outputHint": "Hasil muncul selepas butang",
    "copied": "Disalin",
    "stats": "{a} → {b} bait ({r})",
    "msgEmpty": "Masukkan kod dahulu.",
    "msgNoOut": "Belum ada yang boleh disalin atau dimuat turun.",
    "msgLib": "Tidak dapat memuatkan pustaka CDN. Semak rangkaian.",
    "msgFail": "Gagal. Semak sintaks.",
    "msgTs": "Terser tidak dapat mengecilkan TypeScript berjenis. Kompil ke JavaScript dahulu."
  },
  "pl": {
    "title_page": "Formatowanie / minifikacja kodu",
    "desc": "Formatuj JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown i YAML przez Prettier albo minifikuj Terser / CSSO. Biblioteki z CDN, nic nie jest wysyłane.",
    "indent2": "2 spacje",
    "indent4": "4 spacje",
    "indentTab": "Tab",
    "singleQuote": "Cudzysłowy pojedyncze",
    "semi": "Średniki",
    "mangle": "Skracaj nazwy przy minifikacji",
    "format": "Formatuj",
    "minify": "Minifikuj",
    "copy": "Kopiuj wynik",
    "download": "Pobierz",
    "toInput": "Wyślij do wejścia",
    "open": "Otwórz",
    "sample": "Przykład",
    "clear": "Wyczyść",
    "inputLabel": "Wejście",
    "outputLabel": "Wyjście",
    "placeholder": "Wklej kod…",
    "outputHint": "Wynik pojawi się po przycisku",
    "copied": "Skopiowano",
    "stats": "{a} → {b} B ({r})",
    "msgEmpty": "Najpierw wpisz kod.",
    "msgNoOut": "Nie ma jeszcze nic do skopiowania ani pobrania.",
    "msgLib": "Nie udało się wczytać bibliotek CDN. Sprawdź sieć.",
    "msgFail": "Błąd. Sprawdź składnię.",
    "msgTs": "Terser nie minifikuje TypeScriptu z typami. Najpierw skompiluj do JavaScriptu."
  },
  "uk": {
    "title_page": "Форматування / стиснення коду",
    "desc": "Форматуйте JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown і YAML через Prettier або стискайте Terser / CSSO. Бібліотеки з CDN, нічого не надсилається.",
    "indent2": "2 пробіли",
    "indent4": "4 пробіли",
    "indentTab": "Tab",
    "singleQuote": "Одинарні лапки",
    "semi": "Крапки з комою",
    "mangle": "Скорочувати імена під час стиснення",
    "format": "Форматувати",
    "minify": "Стиснути",
    "copy": "Копіювати результат",
    "download": "Завантажити",
    "toInput": "У поле вводу",
    "open": "Відкрити",
    "sample": "Приклад",
    "clear": "Очистити",
    "inputLabel": "Ввід",
    "outputLabel": "Вивід",
    "placeholder": "Вставте код…",
    "outputHint": "Результат з’явиться після кнопки",
    "copied": "Скопійовано",
    "stats": "{a} → {b} байт ({r})",
    "msgEmpty": "Спочатку введіть код.",
    "msgNoOut": "Поки немає що копіювати чи завантажити.",
    "msgLib": "Не вдалося завантажити бібліотеки з CDN. Перевірте мережу.",
    "msgFail": "Помилка. Перевірте синтаксис.",
    "msgTs": "Terser не стискає TypeScript із типами. Спочатку скомпілюйте в JavaScript."
  },
  "sv": {
    "title_page": "Formatera / minimera kod",
    "desc": "Formatera JavaScript, TypeScript, HTML, CSS, JSON, Vue, Markdown och YAML med Prettier, eller minimera med Terser / CSSO. Bibliotek via CDN, inget laddas upp.",
    "indent2": "2 mellanslag",
    "indent4": "4 mellanslag",
    "indentTab": "Tab",
    "singleQuote": "Enkla citattecken",
    "semi": "Semikolon",
    "mangle": "Korta namn vid minimering",
    "format": "Formatera",
    "minify": "Minimera",
    "copy": "Kopiera resultat",
    "download": "Ladda ner",
    "toInput": "Skicka till inmatning",
    "open": "Öppna",
    "sample": "Exempel",
    "clear": "Rensa",
    "inputLabel": "Inmatning",
    "outputLabel": "Utdata",
    "placeholder": "Klistra in kod…",
    "outputHint": "Resultatet syns efter en knapp",
    "copied": "Kopierat",
    "stats": "{a} → {b} byte ({r})",
    "msgEmpty": "Skriv kod först.",
    "msgNoOut": "Inget att kopiera eller ladda ner ännu.",
    "msgLib": "Kunde inte ladda CDN-bibliotek. Kontrollera nätverket.",
    "msgFail": "Misslyckades. Kontrollera syntaxen.",
    "msgTs": "Terser kan inte minimera typad TypeScript. Kompilera till JavaScript först."
  },
  "zh-TW": {
    "title_page": "程式碼格式化 / 壓縮",
    "desc": "用 Prettier 格式化 JavaScript、TypeScript、HTML、CSS、JSON、Vue、Markdown、YAML，也可用 Terser / CSSO 等壓縮。庫從 CDN 載入，資料不會上傳。",
    "indent2": "2 空格",
    "indent4": "4 空格",
    "indentTab": "Tab",
    "singleQuote": "單引號",
    "semi": "分號",
    "mangle": "壓縮時混淆變數名",
    "format": "格式化",
    "minify": "壓縮",
    "copy": "複製結果",
    "download": "下載",
    "toInput": "結果回填",
    "open": "開啟檔案",
    "sample": "範例",
    "clear": "清空",
    "inputLabel": "輸入",
    "outputLabel": "輸出",
    "placeholder": "貼上程式碼…",
    "outputHint": "點上方按鈕後顯示結果",
    "copied": "已複製",
    "stats": "{a} → {b} 位元組（{r}）",
    "msgEmpty": "請先輸入程式碼。",
    "msgNoOut": "還沒有可複製或下載的結果。",
    "msgLib": "無法從 CDN 載入所需庫，請檢查網路後重試。",
    "msgFail": "處理失敗，請檢查語法是否正確。",
    "msgTs": "Terser 無法壓縮帶型別的 TypeScript，請先編譯成 JavaScript。"
  }
}
</i18n>
