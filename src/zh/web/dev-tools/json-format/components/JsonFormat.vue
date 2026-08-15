<script setup lang="ts">
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { copyToClipboard } from "@/utils"

const { t } = useI18n()

const SAMPLE = `[
  { "id": 1, "name": "Ada", "city": "London", "score": 98.5 },
  { "id": 2, "name": "Linus", "city": "Helsinki", "score": 91 },
  { "id": 3, "name": "Grace", "city": "New York", "score": 95 }
]`

const input = ref(SAMPLE)
const output = ref("")
const indent = ref<"2" | "4" | "tab">("2")
const status = ref("")
const statusOk = ref<boolean | null>(null)

const indentArg = computed(() => (indent.value === "tab" ? "\t" : Number(indent.value)))

function parseJson(text: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(text) }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

function typeOf(value: unknown) {
  if (value === null) return "null"
  if (Array.isArray(value)) return `array[${value.length}]`
  return typeof value
}

function setOk(value: unknown) {
  statusOk.value = true
  status.value = t("valid", { type: typeOf(value) })
}

function setErr(msg: string) {
  statusOk.value = false
  status.value = msg
  ElMessage({ message: msg, type: "error" })
}

function needText() {
  if (input.value.trim()) return true
  ElMessage({ message: t("msgEmpty"), type: "warning" })
  return false
}

function stringify(value: unknown, pretty: boolean) {
  return pretty ? JSON.stringify(value, null, indentArg.value) : JSON.stringify(value)
}

function beautify() {
  if (!needText()) return
  const parsed = parseJson(input.value)
  if (!parsed.ok) {
    setErr(parsed.error)
    return
  }
  output.value = stringify(parsed.value, true)
  setOk(parsed.value)
}

function minify() {
  if (!needText()) return
  const parsed = parseJson(input.value)
  if (!parsed.ok) {
    setErr(parsed.error)
    return
  }
  output.value = stringify(parsed.value, false)
  setOk(parsed.value)
}

function validate() {
  if (!needText()) return
  const parsed = parseJson(input.value)
  if (!parsed.ok) {
    setErr(parsed.error)
    output.value = ""
    return
  }
  setOk(parsed.value)
  ElMessage({ message: t("valid", { type: typeOf(parsed.value) }), type: "success" })
}

function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep)
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as object)
        .sort((a, b) => a.localeCompare(b))
        .map(k => [k, sortDeep((value as Record<string, unknown>)[k])])
    )
  }
  return value
}

function sortKeys() {
  if (!needText()) return
  const parsed = parseJson(input.value)
  if (!parsed.ok) {
    setErr(parsed.error)
    return
  }
  output.value = stringify(sortDeep(parsed.value), true)
  setOk(parsed.value)
}

function escapeJson() {
  if (!needText()) return
  output.value = JSON.stringify(input.value)
  statusOk.value = true
  status.value = t("escaped")
}

function unescapeJson() {
  if (!needText()) return
  const parsed = parseJson(input.value)
  if (!parsed.ok) {
    setErr(parsed.error)
    return
  }
  if (typeof parsed.value !== "string") {
    setErr(t("msgNotString"))
    return
  }
  output.value = parsed.value
  statusOk.value = true
  status.value = t("unescaped")
}

function flatten(obj: unknown, prefix = "", out: Record<string, string> = {}) {
  if (obj === null || obj === undefined) {
    if (prefix) out[prefix] = ""
    return out
  }
  if (typeof obj !== "object") {
    out[prefix] = String(obj)
    return out
  }
  if (Array.isArray(obj)) {
    out[prefix] = JSON.stringify(obj)
    return out
  }
  const keys = Object.keys(obj as object)
  if (!keys.length && prefix) out[prefix] = ""
  for (const key of keys) {
    flatten(
      (obj as Record<string, unknown>)[key],
      prefix ? `${prefix}.${key}` : key,
      out
    )
  }
  return out
}

function csvCell(value: string) {
  if (/[",\r\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

function rowsToCsv(rows: Record<string, string>[]) {
  const keys: string[] = []
  const seen = new Set<string>()
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (seen.has(key)) continue
      seen.add(key)
      keys.push(key)
    }
  }
  const head = keys.map(csvCell).join(",")
  const body = rows.map(row => keys.map(k => csvCell(row[k] ?? "")).join(","))
  return [head, ...body].join("\n")
}

function toCsv() {
  if (!needText()) return
  const parsed = parseJson(input.value)
  if (!parsed.ok) {
    setErr(parsed.error)
    return
  }
  let list: unknown[]
  if (Array.isArray(parsed.value)) {
    list = parsed.value
  } else if (parsed.value && typeof parsed.value === "object") {
    list = [parsed.value]
  } else {
    setErr(t("msgCsv"))
    return
  }
  if (!list.length) {
    output.value = ""
    statusOk.value = true
    status.value = t("csvEmpty")
    return
  }
  const rows = list.map(item => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      return flatten(item)
    }
    return { value: item === null || item === undefined ? "" : String(item) }
  })
  output.value = rowsToCsv(rows)
  statusOk.value = true
  status.value = t("csvOk", { n: rows.length })
}

function saveBlob(text: string, name: string, mime: string) {
  const a = document.createElement("a")
  a.href = URL.createObjectURL(new Blob([text], { type: mime }))
  a.download = name
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(a.href)
}

function download() {
  if (!output.value) {
    ElMessage({ message: t("msgNoOut"), type: "warning" })
    return
  }
  const csv = output.value.includes(",") && !output.value.trim().startsWith("{") && !output.value.trim().startsWith("[")
  saveBlob(
    output.value,
    csv ? "data.csv" : "data.json",
    csv ? "text/csv;charset=utf-8" : "application/json;charset=utf-8"
  )
}

async function copyOut() {
  if (!output.value) {
    ElMessage({ message: t("msgNoOut"), type: "warning" })
    return
  }
  await copyToClipboard(output.value)
  ElMessage({ message: t("copied"), type: "success", duration: 1500 })
}

function useSample() {
  input.value = SAMPLE
  status.value = ""
  statusOk.value = null
}

function clearAll() {
  input.value = ""
  output.value = ""
  status.value = ""
  statusOk.value = null
}

function toInput() {
  if (!output.value) return
  input.value = output.value
}
</script>

<template>
  <div class="json-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <el-radio-group v-model="indent">
        <el-radio-button value="2">{{ t("indent2") }}</el-radio-button>
        <el-radio-button value="4">{{ t("indent4") }}</el-radio-button>
        <el-radio-button value="tab">{{ t("indentTab") }}</el-radio-button>
      </el-radio-group>
      <span
        v-if="status"
        class="status"
        :class="{ ok: statusOk === true, err: statusOk === false }"
      >
        {{ status }}
      </span>
    </div>

    <div class="actions">
      <el-button
        type="primary"
        @click="beautify"
      >
        {{ t("beautify") }}
      </el-button>
      <el-button @click="minify">{{ t("minify") }}</el-button>
      <el-button @click="validate">{{ t("validate") }}</el-button>
      <el-button @click="sortKeys">{{ t("sort") }}</el-button>
      <el-button @click="toCsv">{{ t("toCsv") }}</el-button>
      <el-button @click="escapeJson">{{ t("escape") }}</el-button>
      <el-button @click="unescapeJson">{{ t("unescape") }}</el-button>
      <el-button @click="copyOut">{{ t("copy") }}</el-button>
      <el-button @click="download">{{ t("download") }}</el-button>
      <el-button @click="toInput">{{ t("toInput") }}</el-button>
      <el-button @click="useSample">{{ t("sample") }}</el-button>
      <el-button @click="clearAll">{{ t("clear") }}</el-button>
    </div>

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
        <el-input
          v-model="output"
          type="textarea"
          :rows="16"
          :placeholder="t('outputHint')"
          resize="vertical"
          class="code-area"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.json-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 48px;
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
}

.status {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);

  &.ok {
    color: var(--vp-c-brand-1);
  }

  &.err {
    color: var(--vp-c-danger-1, #c45656);
  }
}

.panes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 800px) {
  .panes {
    grid-template-columns: 1fr;
  }
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
  }
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "JSON 美化",
    "desc": "在浏览器里美化、压缩、校验 JSON，也可排序键名、转义字符串，或把对象数组转成 CSV。数据不会上传。",
    "inputLabel": "输入",
    "outputLabel": "输出",
    "placeholder": "粘贴 JSON…",
    "outputHint": "点击上方按钮后显示结果",
    "beautify": "美化",
    "minify": "压缩",
    "validate": "验证",
    "sort": "键名排序",
    "toCsv": "转 CSV",
    "escape": "转义",
    "unescape": "反转义",
    "copy": "复制结果",
    "download": "下载",
    "toInput": "结果回填",
    "sample": "示例",
    "clear": "清空",
    "indent2": "2 空格",
    "indent4": "4 空格",
    "indentTab": "Tab",
    "copied": "已复制",
    "valid": "合法 JSON · {type}",
    "escaped": "已转义为 JSON 字符串",
    "unescaped": "已反转义",
    "csvOk": "已转为 CSV，共 {n} 行",
    "csvEmpty": "数组为空。",
    "msgEmpty": "请先输入 JSON。",
    "msgNoOut": "还没有可复制或下载的结果。",
    "msgNotString": "反转义需要一段 JSON 字符串，例如 \"hello\\nworld\"。",
    "msgCsv": "转 CSV 需要对象、对象数组，或基本类型数组。"
  },
  "zh-CN": {
    "title_page": "JSON 美化",
    "desc": "在浏览器里美化、压缩、校验 JSON，也可排序键名、转义字符串，或把对象数组转成 CSV。数据不会上传。",
    "inputLabel": "输入",
    "outputLabel": "输出",
    "placeholder": "粘贴 JSON…",
    "outputHint": "点击上方按钮后显示结果",
    "beautify": "美化",
    "minify": "压缩",
    "validate": "验证",
    "sort": "键名排序",
    "toCsv": "转 CSV",
    "escape": "转义",
    "unescape": "反转义",
    "copy": "复制结果",
    "download": "下载",
    "toInput": "结果回填",
    "sample": "示例",
    "clear": "清空",
    "indent2": "2 空格",
    "indent4": "4 空格",
    "indentTab": "Tab",
    "copied": "已复制",
    "valid": "合法 JSON · {type}",
    "escaped": "已转义为 JSON 字符串",
    "unescaped": "已反转义",
    "csvOk": "已转为 CSV，共 {n} 行",
    "csvEmpty": "数组为空。",
    "msgEmpty": "请先输入 JSON。",
    "msgNoOut": "还没有可复制或下载的结果。",
    "msgNotString": "反转义需要一段 JSON 字符串，例如 \"hello\\nworld\"。",
    "msgCsv": "转 CSV 需要对象、对象数组，或基本类型数组。"
  },
  "en": {
    "title_page": "JSON formatter",
    "desc": "Pretty-print, minify, and validate JSON in your browser. Sort keys, escape strings, or turn an object array into CSV. Nothing is uploaded.",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Paste JSON…",
    "outputHint": "Result appears after you click a button",
    "beautify": "Beautify",
    "minify": "Minify",
    "validate": "Validate",
    "sort": "Sort keys",
    "toCsv": "To CSV",
    "escape": "Escape",
    "unescape": "Unescape",
    "copy": "Copy result",
    "download": "Download",
    "toInput": "Use as input",
    "sample": "Sample",
    "clear": "Clear",
    "indent2": "2 spaces",
    "indent4": "4 spaces",
    "indentTab": "Tab",
    "copied": "Copied",
    "valid": "Valid JSON · {type}",
    "escaped": "Escaped as a JSON string",
    "unescaped": "Unescaped",
    "csvOk": "Converted to CSV, {n} rows",
    "csvEmpty": "The array is empty.",
    "msgEmpty": "Enter some JSON first.",
    "msgNoOut": "Nothing to copy or download yet.",
    "msgNotString": "Unescape needs a JSON string, such as \"hello\\nworld\".",
    "msgCsv": "CSV needs an object, an array of objects, or an array of primitives."
  },
  "ja": {
    "title_page": "JSON 整形",
    "desc": "ブラウザ内で JSON の整形・圧縮・検証。キー並べ替え、エスケープ、オブジェクト配列の CSV 化もできます。送信しません。",
    "inputLabel": "入力",
    "outputLabel": "出力",
    "placeholder": "JSON を貼り付け…",
    "outputHint": "上のボタンを押すと結果が出ます",
    "beautify": "整形",
    "minify": "圧縮",
    "validate": "検証",
    "sort": "キー順",
    "toCsv": "CSV へ",
    "escape": "エスケープ",
    "unescape": "解除",
    "copy": "結果をコピー",
    "download": "保存",
    "toInput": "入力へ戻す",
    "sample": "サンプル",
    "clear": "クリア",
    "indent2": "2 スペース",
    "indent4": "4 スペース",
    "indentTab": "Tab",
    "copied": "コピーしました",
    "valid": "正しい JSON · {type}",
    "escaped": "JSON 文字列にエスケープしました",
    "unescaped": "エスケープを解除しました",
    "csvOk": "CSV に変換、{n} 行",
    "csvEmpty": "配列が空です。",
    "msgEmpty": "先に JSON を入力してください。",
    "msgNoOut": "コピーまたは保存できる結果がありません。",
    "msgNotString": "解除には JSON 文字列が必要です。例: \"hello\\nworld\"。",
    "msgCsv": "CSV 化にはオブジェクト、オブジェクト配列、またはプリミティブ配列が必要です。"
  },
  "ko": {
    "title_page": "JSON 정리",
    "desc": "브라우저에서 JSON을 정리·압축·검증합니다. 키 정렬, 이스케이프, 객체 배열을 CSV로 변환할 수 있습니다. 업로드하지 않습니다.",
    "inputLabel": "입력",
    "outputLabel": "출력",
    "placeholder": "JSON을 붙여넣기…",
    "outputHint": "위 버튼을 누르면 결과가 나타납니다",
    "beautify": "정리",
    "minify": "압축",
    "validate": "검증",
    "sort": "키 정렬",
    "toCsv": "CSV로",
    "escape": "이스케이프",
    "unescape": "해제",
    "copy": "결과 복사",
    "download": "다운로드",
    "toInput": "입력으로",
    "sample": "예시",
    "clear": "지우기",
    "indent2": "공백 2",
    "indent4": "공백 4",
    "indentTab": "Tab",
    "copied": "복사됨",
    "valid": "올바른 JSON · {type}",
    "escaped": "JSON 문자열로 이스케이프됨",
    "unescaped": "이스케이프 해제됨",
    "csvOk": "CSV로 변환, {n}행",
    "csvEmpty": "배열이 비어 있습니다.",
    "msgEmpty": "먼저 JSON을 입력하세요.",
    "msgNoOut": "복사하거나 받을 결과가 없습니다.",
    "msgNotString": "해제에는 JSON 문자열이 필요합니다. 예: \"hello\\nworld\".",
    "msgCsv": "CSV는 객체, 객체 배열 또는 기본값 배열이 필요합니다."
  },
  "fr": {
    "title_page": "Formateur JSON",
    "desc": "Embellez, minifiez et validez du JSON dans le navigateur. Triez les clés, échappez, ou convertissez un tableau d’objets en CSV. Rien n’est envoyé.",
    "inputLabel": "Entrée",
    "outputLabel": "Sortie",
    "placeholder": "Collez du JSON…",
    "outputHint": "Le résultat apparaît après un clic",
    "beautify": "Beautifier",
    "minify": "Minifier",
    "validate": "Valider",
    "sort": "Trier les clés",
    "toCsv": "Vers CSV",
    "escape": "Échapper",
    "unescape": "Déséchapper",
    "copy": "Copier",
    "download": "Télécharger",
    "toInput": "Remettre en entrée",
    "sample": "Exemple",
    "clear": "Effacer",
    "indent2": "2 espaces",
    "indent4": "4 espaces",
    "indentTab": "Tab",
    "copied": "Copié",
    "valid": "JSON valide · {type}",
    "escaped": "Échappé en chaîne JSON",
    "unescaped": "Déséchappé",
    "csvOk": "Converti en CSV, {n} lignes",
    "csvEmpty": "Le tableau est vide.",
    "msgEmpty": "Saisissez d’abord du JSON.",
    "msgNoOut": "Rien à copier ou télécharger.",
    "msgNotString": "Le déséchappement attend une chaîne JSON, ex. \"hello\\nworld\".",
    "msgCsv": "Le CSV attend un objet, un tableau d’objets ou de primitives."
  },
  "de": {
    "title_page": "JSON formatieren",
    "desc": "JSON im Browser schön formatieren, verdichten und prüfen. Schlüssel sortieren, escapen oder ein Objekt-Array nach CSV wandeln. Nichts wird hochgeladen.",
    "inputLabel": "Eingabe",
    "outputLabel": "Ausgabe",
    "placeholder": "JSON einfügen…",
    "outputHint": "Ergebnis nach einem Klick oben",
    "beautify": "Formatieren",
    "minify": "Verdichten",
    "validate": "Prüfen",
    "sort": "Schlüssel sortieren",
    "toCsv": "Nach CSV",
    "escape": "Escapen",
    "unescape": "Unescapen",
    "copy": "Kopieren",
    "download": "Download",
    "toInput": "Als Eingabe",
    "sample": "Beispiel",
    "clear": "Leeren",
    "indent2": "2 Leerzeichen",
    "indent4": "4 Leerzeichen",
    "indentTab": "Tab",
    "copied": "Kopiert",
    "valid": "Gültiges JSON · {type}",
    "escaped": "Als JSON-String escaped",
    "unescaped": "Unescaped",
    "csvOk": "Nach CSV, {n} Zeilen",
    "csvEmpty": "Das Array ist leer.",
    "msgEmpty": "Bitte zuerst JSON eingeben.",
    "msgNoOut": "Noch nichts zum Kopieren oder Laden.",
    "msgNotString": "Unescape braucht einen JSON-String, z. B. \"hello\\nworld\".",
    "msgCsv": "CSV braucht ein Objekt, ein Objekt-Array oder primitive Werte."
  },
  "es": {
    "title_page": "Formatear JSON",
    "desc": "Embellece, comprime y valida JSON en el navegador. Ordena claves, escapa o convierte un array de objetos a CSV. No se sube nada.",
    "inputLabel": "Entrada",
    "outputLabel": "Salida",
    "placeholder": "Pega JSON…",
    "outputHint": "El resultado aparece al pulsar un botón",
    "beautify": "Embellecer",
    "minify": "Comprimir",
    "validate": "Validar",
    "sort": "Ordenar claves",
    "toCsv": "A CSV",
    "escape": "Escapar",
    "unescape": "Desescapar",
    "copy": "Copiar",
    "download": "Descargar",
    "toInput": "Usar como entrada",
    "sample": "Ejemplo",
    "clear": "Vaciar",
    "indent2": "2 espacios",
    "indent4": "4 espacios",
    "indentTab": "Tab",
    "copied": "Copiado",
    "valid": "JSON válido · {type}",
    "escaped": "Escapado como cadena JSON",
    "unescaped": "Desescapado",
    "csvOk": "Convertido a CSV, {n} filas",
    "csvEmpty": "La matriz está vacía.",
    "msgEmpty": "Introduce JSON primero.",
    "msgNoOut": "Aún no hay nada que copiar o descargar.",
    "msgNotString": "Desescapar necesita una cadena JSON, p. ej. \"hello\\nworld\".",
    "msgCsv": "CSV necesita un objeto, un array de objetos o de primitivos."
  },
  "pt": {
    "title_page": "Formatar JSON",
    "desc": "Formate, minifique e valide JSON no navegador. Ordene chaves, escape ou converta um array de objetos em CSV. Nada é enviado.",
    "inputLabel": "Entrada",
    "outputLabel": "Saída",
    "placeholder": "Cole o JSON…",
    "outputHint": "O resultado aparece após clicar num botão",
    "beautify": "Formatar",
    "minify": "Minificar",
    "validate": "Validar",
    "sort": "Ordenar chaves",
    "toCsv": "Para CSV",
    "escape": "Escapar",
    "unescape": "Desescapar",
    "copy": "Copiar",
    "download": "Baixar",
    "toInput": "Usar como entrada",
    "sample": "Exemplo",
    "clear": "Limpar",
    "indent2": "2 espaços",
    "indent4": "4 espaços",
    "indentTab": "Tab",
    "copied": "Copiado",
    "valid": "JSON válido · {type}",
    "escaped": "Escapado como string JSON",
    "unescaped": "Desescapado",
    "csvOk": "Convertido para CSV, {n} linhas",
    "csvEmpty": "A matriz está vazia.",
    "msgEmpty": "Digite o JSON primeiro.",
    "msgNoOut": "Ainda não há o que copiar ou baixar.",
    "msgNotString": "Desescapar precisa de uma string JSON, ex. \"hello\\nworld\".",
    "msgCsv": "CSV precisa de um objeto, um array de objetos ou de primitivos."
  },
  "ru": {
    "title_page": "Форматирование JSON",
    "desc": "Оформите, сожмите и проверьте JSON в браузере. Сортировка ключей, экранирование и CSV из массива объектов. Ничего не отправляется.",
    "inputLabel": "Ввод",
    "outputLabel": "Вывод",
    "placeholder": "Вставьте JSON…",
    "outputHint": "Результат появится после кнопки сверху",
    "beautify": "Оформить",
    "minify": "Сжать",
    "validate": "Проверить",
    "sort": "Сортировать ключи",
    "toCsv": "В CSV",
    "escape": "Экранировать",
    "unescape": "Снять экранирование",
    "copy": "Копировать",
    "download": "Скачать",
    "toInput": "Во ввод",
    "sample": "Пример",
    "clear": "Очистить",
    "indent2": "2 пробела",
    "indent4": "4 пробела",
    "indentTab": "Tab",
    "copied": "Скопировано",
    "valid": "Корректный JSON · {type}",
    "escaped": "Экранировано как JSON-строка",
    "unescaped": "Экранирование снято",
    "csvOk": "В CSV, {n} строк",
    "csvEmpty": "Массив пуст.",
    "msgEmpty": "Сначала введите JSON.",
    "msgNoOut": "Пока нечего копировать или скачивать.",
    "msgNotString": "Снятие экранирования ждёт JSON-строку, например \"hello\\nworld\".",
    "msgCsv": "Для CSV нужен объект, массив объектов или примитивов."
  },
  "ar": {
    "title_page": "تنسيق JSON",
    "desc": "جمّل واضغط وتحقق من JSON في المتصفح. رتّب المفاتيح أو اهرب النصوص أو حوّل مصفوفة كائنات إلى CSV. لا يُرفع شيء.",
    "inputLabel": "الإدخال",
    "outputLabel": "الإخراج",
    "placeholder": "الصق JSON…",
    "outputHint": "تظهر النتيجة بعد الضغط على زر",
    "beautify": "تجميل",
    "minify": "ضغط",
    "validate": "تحقق",
    "sort": "ترتيب المفاتيح",
    "toCsv": "إلى CSV",
    "escape": "تهريب",
    "unescape": "إلغاء التهريب",
    "copy": "نسخ",
    "download": "تنزيل",
    "toInput": "إرجاع للإدخال",
    "sample": "مثال",
    "clear": "مسح",
    "indent2": "مسافتان",
    "indent4": "4 مسافات",
    "indentTab": "Tab",
    "copied": "تم النسخ",
    "valid": "JSON صالح · {type}",
    "escaped": "هُرِّب كنص JSON",
    "unescaped": "أُلغي التهريب",
    "csvOk": "حُوِّل إلى CSV، {n} صفوف",
    "csvEmpty": "المصفوفة فارغة.",
    "msgEmpty": "أدخل JSON أولاً.",
    "msgNoOut": "لا يوجد ما يُنسخ أو يُنزَّل بعد.",
    "msgNotString": "إلغاء التهريب يحتاج نص JSON مثل \"hello\\nworld\".",
    "msgCsv": "CSV يحتاج كائنًا أو مصفوفة كائنات أو قيمًا بسيطة."
  },
  "hi": {
    "title_page": "JSON सुंदर करें",
    "desc": "ब्राउज़र में JSON सुंदर करें, संपीड़ित करें और जाँचें। कुंजी छाँटें, एस्केप करें, या ऑब्जेक्ट सरणी को CSV बनाएँ। कुछ अपलोड नहीं होता।",
    "inputLabel": "इनपुट",
    "outputLabel": "आउटपुट",
    "placeholder": "JSON चिपकाएँ…",
    "outputHint": "ऊपर बटन दबाने पर परिणाम दिखेगा",
    "beautify": "सुंदर करें",
    "minify": "संपीड़ित करें",
    "validate": "जाँचें",
    "sort": "कुंजी छाँटें",
    "toCsv": "CSV में",
    "escape": "एस्केप",
    "unescape": "अनएस्केप",
    "copy": "कॉपी",
    "download": "डाउनलोड",
    "toInput": "इनपुट में डालें",
    "sample": "उदाहरण",
    "clear": "साफ़",
    "indent2": "2 स्पेस",
    "indent4": "4 स्पेस",
    "indentTab": "Tab",
    "copied": "कॉपी हो गया",
    "valid": "मान्य JSON · {type}",
    "escaped": "JSON स्ट्रिंग के रूप में एस्केप",
    "unescaped": "अनएस्केप हो गया",
    "csvOk": "CSV बना, {n} पंक्तियाँ",
    "csvEmpty": "सरणी खाली है।",
    "msgEmpty": "पहले JSON दर्ज करें।",
    "msgNoOut": "अभी कॉपी या डाउनलोड करने को कुछ नहीं।",
    "msgNotString": "अनएस्केप के लिए JSON स्ट्रिंग चाहिए, जैसे \"hello\\nworld\"।",
    "msgCsv": "CSV के लिए ऑब्जेक्ट, ऑब्जेक्ट सरणी या मूल मान चाहिए।"
  },
  "it": {
    "title_page": "Formatta JSON",
    "desc": "Formatta, comprimi e valida JSON nel browser. Ordina le chiavi, esegui escape o converti un array di oggetti in CSV. Nulla viene inviato.",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Incolla JSON…",
    "outputHint": "Il risultato appare dopo un pulsante in alto",
    "beautify": "Formatta",
    "minify": "Comprimi",
    "validate": "Valida",
    "sort": "Ordina chiavi",
    "toCsv": "In CSV",
    "escape": "Escape",
    "unescape": "Unescape",
    "copy": "Copia",
    "download": "Scarica",
    "toInput": "Usa come input",
    "sample": "Esempio",
    "clear": "Svuota",
    "indent2": "2 spazi",
    "indent4": "4 spazi",
    "indentTab": "Tab",
    "copied": "Copiato",
    "valid": "JSON valido · {type}",
    "escaped": "Eseguito escape come stringa JSON",
    "unescaped": "Escape rimosso",
    "csvOk": "Convertito in CSV, {n} righe",
    "csvEmpty": "L’array è vuoto.",
    "msgEmpty": "Inserisci prima il JSON.",
    "msgNoOut": "Non c’è ancora nulla da copiare o scaricare.",
    "msgNotString": "Unescape richiede una stringa JSON, es. \"hello\\nworld\".",
    "msgCsv": "Il CSV richiede un oggetto, un array di oggetti o di primitivi."
  },
  "nl": {
    "title_page": "JSON opmaken",
    "desc": "Maak JSON mooi, compact en geldig in de browser. Sorteer sleutels, escape, of zet een objectarray om naar CSV. Niets wordt geüpload.",
    "inputLabel": "Invoer",
    "outputLabel": "Uitvoer",
    "placeholder": "Plak JSON…",
    "outputHint": "Resultaat na een knop hierboven",
    "beautify": "Opmaken",
    "minify": "Comprimeren",
    "validate": "Valideren",
    "sort": "Sleutels sorteren",
    "toCsv": "Naar CSV",
    "escape": "Escapen",
    "unescape": "Unescapen",
    "copy": "Kopiëren",
    "download": "Downloaden",
    "toInput": "Als invoer",
    "sample": "Voorbeeld",
    "clear": "Wissen",
    "indent2": "2 spaties",
    "indent4": "4 spaties",
    "indentTab": "Tab",
    "copied": "Gekopieerd",
    "valid": "Geldige JSON · {type}",
    "escaped": "Ge-escaped als JSON-string",
    "unescaped": "Un-escaped",
    "csvOk": "Omgezet naar CSV, {n} rijen",
    "csvEmpty": "De array is leeg.",
    "msgEmpty": "Voer eerst JSON in.",
    "msgNoOut": "Nog niets om te kopiëren of te downloaden.",
    "msgNotString": "Unescape heeft een JSON-string nodig, bijv. \"hello\\nworld\".",
    "msgCsv": "CSV heeft een object, objectarray of primitieve array nodig."
  },
  "tr": {
    "title_page": "JSON güzelleştir",
    "desc": "Tarayıcıda JSON biçimlendirin, sıkıştırın ve doğrulayın. Anahtarları sıralayın, kaçış uygulayın veya nesne dizisini CSV yapın. Hiçbir şey yüklenmez.",
    "inputLabel": "Girdi",
    "outputLabel": "Çıktı",
    "placeholder": "JSON yapıştırın…",
    "outputHint": "Sonuç üstteki bir düğmeden sonra görünür",
    "beautify": "Güzelleştir",
    "minify": "Sıkıştır",
    "validate": "Doğrula",
    "sort": "Anahtarları sırala",
    "toCsv": "CSV’ye",
    "escape": "Kaçış",
    "unescape": "Kaçışı kaldır",
    "copy": "Kopyala",
    "download": "İndir",
    "toInput": "Girdiye al",
    "sample": "Örnek",
    "clear": "Temizle",
    "indent2": "2 boşluk",
    "indent4": "4 boşluk",
    "indentTab": "Tab",
    "copied": "Kopyalandı",
    "valid": "Geçerli JSON · {type}",
    "escaped": "JSON dizesi olarak kaçırıldı",
    "unescaped": "Kaçış kaldırıldı",
    "csvOk": "CSV’ye dönüştürüldü, {n} satır",
    "csvEmpty": "Dizi boş.",
    "msgEmpty": "Önce JSON girin.",
    "msgNoOut": "Kopyalanacak veya indirilecek bir şey yok.",
    "msgNotString": "Kaçışı kaldırmak için JSON dizesi gerekir, örn. \"hello\\nworld\".",
    "msgCsv": "CSV için nesne, nesne dizisi veya ilkel dizi gerekir."
  },
  "vi": {
    "title_page": "Làm đẹp JSON",
    "desc": "Làm đẹp, nén và kiểm tra JSON trong trình duyệt. Sắp xếp khóa, escape, hoặc chuyển mảng đối tượng thành CSV. Không tải lên.",
    "inputLabel": "Đầu vào",
    "outputLabel": "Đầu ra",
    "placeholder": "Dán JSON…",
    "outputHint": "Kết quả hiện sau khi bấm nút phía trên",
    "beautify": "Làm đẹp",
    "minify": "Nén",
    "validate": "Kiểm tra",
    "sort": "Sắp xếp khóa",
    "toCsv": "Sang CSV",
    "escape": "Escape",
    "unescape": "Unescape",
    "copy": "Sao chép",
    "download": "Tải xuống",
    "toInput": "Đưa lại đầu vào",
    "sample": "Mẫu",
    "clear": "Xóa",
    "indent2": "2 khoảng",
    "indent4": "4 khoảng",
    "indentTab": "Tab",
    "copied": "Đã sao chép",
    "valid": "JSON hợp lệ · {type}",
    "escaped": "Đã escape thành chuỗi JSON",
    "unescaped": "Đã unescape",
    "csvOk": "Đã chuyển CSV, {n} dòng",
    "csvEmpty": "Mảng trống.",
    "msgEmpty": "Hãy nhập JSON trước.",
    "msgNoOut": "Chưa có gì để sao chép hoặc tải.",
    "msgNotString": "Unescape cần một chuỗi JSON, ví dụ \"hello\\nworld\".",
    "msgCsv": "CSV cần đối tượng, mảng đối tượng hoặc mảng giá trị cơ bản."
  },
  "th": {
    "title_page": "จัดรูปแบบ JSON",
    "desc": "จัดรูปแบบ ย่อ และตรวจ JSON ในเบราว์เซอร์ เรียงคีย์ เอสเคป หรือแปลงอาร์เรย์ออบเจ็กต์เป็น CSV ไม่ได้อัปโหลด",
    "inputLabel": "อินพุต",
    "outputLabel": "เอาต์พุต",
    "placeholder": "วาง JSON…",
    "outputHint": "ผลลัพธ์หลังกดปุ่มด้านบน",
    "beautify": "จัดรูปแบบ",
    "minify": "ย่อ",
    "validate": "ตรวจ",
    "sort": "เรียงคีย์",
    "toCsv": "เป็น CSV",
    "escape": "เอสเคป",
    "unescape": "ยกเลิกเอสเคป",
    "copy": "คัดลอก",
    "download": "ดาวน์โหลด",
    "toInput": "ใส่กลับอินพุต",
    "sample": "ตัวอย่าง",
    "clear": "ล้าง",
    "indent2": "2 ช่องว่าง",
    "indent4": "4 ช่องว่าง",
    "indentTab": "Tab",
    "copied": "คัดลอกแล้ว",
    "valid": "JSON ถูกต้อง · {type}",
    "escaped": "เอสเคปเป็นสตริง JSON แล้ว",
    "unescaped": "ยกเลิกเอสเคปแล้ว",
    "csvOk": "แปลงเป็น CSV แล้ว {n} แถว",
    "csvEmpty": "อาร์เรย์ว่าง",
    "msgEmpty": "กรอก JSON ก่อน",
    "msgNoOut": "ยังไม่มีผลลัพธ์ให้คัดลอกหรือดาวน์โหลด",
    "msgNotString": "ยกเลิกเอสเคปต้องเป็นสตริง JSON เช่น \"hello\\nworld\"",
    "msgCsv": "CSV ต้องเป็นออบเจ็กต์ อาร์เรย์ออบเจ็กต์ หรือค่าพื้นฐาน"
  },
  "id": {
    "title_page": "Rapikan JSON",
    "desc": "Rapikan, minifikasi, dan validasi JSON di browser. Urutkan kunci, escape, atau ubah array objek jadi CSV. Tidak diunggah.",
    "inputLabel": "Masukan",
    "outputLabel": "Keluaran",
    "placeholder": "Tempel JSON…",
    "outputHint": "Hasil muncul setelah tombol di atas",
    "beautify": "Rapikan",
    "minify": "Minifikasi",
    "validate": "Validasi",
    "sort": "Urutkan kunci",
    "toCsv": "Ke CSV",
    "escape": "Escape",
    "unescape": "Unescape",
    "copy": "Salin",
    "download": "Unduh",
    "toInput": "Jadikan masukan",
    "sample": "Contoh",
    "clear": "Hapus",
    "indent2": "2 spasi",
    "indent4": "4 spasi",
    "indentTab": "Tab",
    "copied": "Tersalin",
    "valid": "JSON valid · {type}",
    "escaped": "Di-escape sebagai string JSON",
    "unescaped": "Un-escape selesai",
    "csvOk": "Dikonversi ke CSV, {n} baris",
    "csvEmpty": "Array kosong.",
    "msgEmpty": "Masukkan JSON dulu.",
    "msgNoOut": "Belum ada yang bisa disalin atau diunduh.",
    "msgNotString": "Unescape butuh string JSON, mis. \"hello\\nworld\".",
    "msgCsv": "CSV butuh objek, array objek, atau array primitif."
  },
  "ms": {
    "title_page": "Cantikkan JSON",
    "desc": "Cantikkan, mampatkan dan sahkan JSON dalam pelayar. Isih kunci, escape, atau tukar tatasusunan objek kepada CSV. Tiada yang dimuat naik.",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Tampal JSON…",
    "outputHint": "Hasil muncul selepas butang di atas",
    "beautify": "Cantikkan",
    "minify": "Mampatkan",
    "validate": "Sahkan",
    "sort": "Isih kunci",
    "toCsv": "Ke CSV",
    "escape": "Escape",
    "unescape": "Unescape",
    "copy": "Salin",
    "download": "Muat turun",
    "toInput": "Guna sebagai input",
    "sample": "Contoh",
    "clear": "Kosongkan",
    "indent2": "2 ruang",
    "indent4": "4 ruang",
    "indentTab": "Tab",
    "copied": "Disalin",
    "valid": "JSON sah · {type}",
    "escaped": "Di-escape sebagai rentetan JSON",
    "unescaped": "Un-escape selesai",
    "csvOk": "Ditukar ke CSV, {n} baris",
    "csvEmpty": "Tatasusunan kosong.",
    "msgEmpty": "Masukkan JSON dahulu.",
    "msgNoOut": "Belum ada yang boleh disalin atau dimuat turun.",
    "msgNotString": "Unescape perlukan rentetan JSON, cth. \"hello\\nworld\".",
    "msgCsv": "CSV perlukan objek, tatasusunan objek atau nilai asas."
  },
  "pl": {
    "title_page": "Formatowanie JSON",
    "desc": "Sformatuj, zminimalizuj i sprawdź JSON w przeglądarce. Sortuj klucze, escapuj lub zamień tablicę obiektów na CSV. Nic nie jest wysyłane.",
    "inputLabel": "Wejście",
    "outputLabel": "Wyjście",
    "placeholder": "Wklej JSON…",
    "outputHint": "Wynik po kliknięciu przycisku u góry",
    "beautify": "Formatuj",
    "minify": "Zminimalizuj",
    "validate": "Sprawdź",
    "sort": "Sortuj klucze",
    "toCsv": "Do CSV",
    "escape": "Escape",
    "unescape": "Unescape",
    "copy": "Kopiuj",
    "download": "Pobierz",
    "toInput": "Użyj jako wejście",
    "sample": "Przykład",
    "clear": "Wyczyść",
    "indent2": "2 spacje",
    "indent4": "4 spacje",
    "indentTab": "Tab",
    "copied": "Skopiowano",
    "valid": "Poprawny JSON · {type}",
    "escaped": "Escapowano jako łańcuch JSON",
    "unescaped": "Usunięto escape",
    "csvOk": "Zamieniono na CSV, {n} wierszy",
    "csvEmpty": "Tablica jest pusta.",
    "msgEmpty": "Najpierw wpisz JSON.",
    "msgNoOut": "Nie ma jeszcze nic do skopiowania ani pobrania.",
    "msgNotString": "Unescape wymaga łańcucha JSON, np. \"hello\\nworld\".",
    "msgCsv": "CSV wymaga obiektu, tablicy obiektów lub wartości prostych."
  },
  "uk": {
    "title_page": "Форматування JSON",
    "desc": "Оформіть, стисніть і перевірте JSON у браузері. Сортування ключів, екранування та CSV з масиву об’єктів. Нічого не надсилається.",
    "inputLabel": "Ввід",
    "outputLabel": "Вивід",
    "placeholder": "Вставте JSON…",
    "outputHint": "Результат з’явиться після кнопки зверху",
    "beautify": "Оформити",
    "minify": "Стиснути",
    "validate": "Перевірити",
    "sort": "Сортувати ключі",
    "toCsv": "У CSV",
    "escape": "Екранувати",
    "unescape": "Зняти екранування",
    "copy": "Копіювати",
    "download": "Завантажити",
    "toInput": "У ввід",
    "sample": "Приклад",
    "clear": "Очистити",
    "indent2": "2 пробіли",
    "indent4": "4 пробіли",
    "indentTab": "Tab",
    "copied": "Скопійовано",
    "valid": "Коректний JSON · {type}",
    "escaped": "Екрановано як JSON-рядок",
    "unescaped": "Екранування знято",
    "csvOk": "У CSV, {n} рядків",
    "csvEmpty": "Масив порожній.",
    "msgEmpty": "Спочатку введіть JSON.",
    "msgNoOut": "Поки нічого копіювати чи завантажувати.",
    "msgNotString": "Зняття екранування чекає JSON-рядок, напр. \"hello\\nworld\".",
    "msgCsv": "Для CSV потрібен об’єкт, масив об’єктів або примітивів."
  },
  "sv": {
    "title_page": "Formatera JSON",
    "desc": "Gör JSON snygg, kompakt och giltig i webbläsaren. Sortera nycklar, escape:a eller gör en objektarray till CSV. Inget laddas upp.",
    "inputLabel": "Indata",
    "outputLabel": "Utdata",
    "placeholder": "Klistra in JSON…",
    "outputHint": "Resultat efter en knapp ovan",
    "beautify": "Formatera",
    "minify": "Komprimera",
    "validate": "Validera",
    "sort": "Sortera nycklar",
    "toCsv": "Till CSV",
    "escape": "Escape",
    "unescape": "Unescape",
    "copy": "Kopiera",
    "download": "Ladda ner",
    "toInput": "Använd som indata",
    "sample": "Exempel",
    "clear": "Rensa",
    "indent2": "2 mellanslag",
    "indent4": "4 mellanslag",
    "indentTab": "Tab",
    "copied": "Kopierat",
    "valid": "Giltig JSON · {type}",
    "escaped": "Escapad som JSON-sträng",
    "unescaped": "Unescapad",
    "csvOk": "Konverterad till CSV, {n} rader",
    "csvEmpty": "Arrayen är tom.",
    "msgEmpty": "Ange JSON först.",
    "msgNoOut": "Inget att kopiera eller ladda ner ännu.",
    "msgNotString": "Unescape kräver en JSON-sträng, t.ex. \"hello\\nworld\".",
    "msgCsv": "CSV kräver ett objekt, en objektarray eller primitiva värden."
  },
  "zh-TW": {
    "title_page": "JSON 美化",
    "desc": "在瀏覽器裡美化、壓縮、校驗 JSON，也可排序鍵名、跳脫字串，或把物件陣列轉成 CSV。資料不會上傳。",
    "inputLabel": "輸入",
    "outputLabel": "輸出",
    "placeholder": "貼上 JSON…",
    "outputHint": "點上方按鈕後顯示結果",
    "beautify": "美化",
    "minify": "壓縮",
    "validate": "驗證",
    "sort": "鍵名排序",
    "toCsv": "轉 CSV",
    "escape": "跳脫",
    "unescape": "反跳脫",
    "copy": "複製結果",
    "download": "下載",
    "toInput": "結果回填",
    "sample": "範例",
    "clear": "清空",
    "indent2": "2 空格",
    "indent4": "4 空格",
    "indentTab": "Tab",
    "copied": "已複製",
    "valid": "合法 JSON · {type}",
    "escaped": "已跳脫為 JSON 字串",
    "unescaped": "已反跳脫",
    "csvOk": "已轉為 CSV，共 {n} 列",
    "csvEmpty": "陣列為空。",
    "msgEmpty": "請先輸入 JSON。",
    "msgNoOut": "還沒有可複製或下載的結果。",
    "msgNotString": "反跳脫需要一段 JSON 字串，例如 \"hello\\nworld\"。",
    "msgCsv": "轉 CSV 需要物件、物件陣列，或基本型別陣列。"
  }
}
</i18n>
