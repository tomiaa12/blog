<script setup lang="ts">
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { copyToClipboard } from "@/utils"
import {
  EXT,
  FORMATS,
  MIME,
  SAMPLES,
  detectFormat,
  formatFromName,
  isLibError,
  parseAuto,
  parseConfig,
  stringifyConfig,
  type Format,
  type SourceFormat,
} from "./convert"

const { t } = useI18n()

const from = ref<SourceFormat>("auto")
const to = ref<Format>("json")
const indent = ref<"2" | "4" | "tab">("2")
const input = ref(SAMPLES.yaml)
const output = ref("")
const status = ref("")
const statusOk = ref<boolean | null>(null)
const running = ref(false)
const fileRef = ref<HTMLInputElement | null>(null)

const indentArg = computed(() => (indent.value === "tab" ? "\t" : Number(indent.value)))
const sources: SourceFormat[] = ["auto", ...FORMATS]

function setOk(msg: string) {
  statusOk.value = true
  status.value = msg
}

function setErr(msg: string) {
  statusOk.value = false
  status.value = msg
  ElMessage({ message: msg, type: "error" })
}

function failMsg(err: unknown) {
  if (isLibError(err)) return t("msgLib")
  return err instanceof Error && err.message ? err.message : t("msgFail")
}

async function convert() {
  const text = input.value.trim()
  if (!text) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  running.value = true
  try {
    let format: Format
    let value: unknown
    if (from.value === "auto") {
      const parsed = await parseAuto(input.value)
      format = parsed.format
      value = parsed.value
    } else {
      format = from.value
      value = await parseConfig(input.value, format)
    }
    output.value = await stringifyConfig(value, to.value, indentArg.value)
    setOk(t("ok", { from: format.toUpperCase(), to: to.value.toUpperCase() }))
  } catch (err) {
    output.value = ""
    setErr(failMsg(err))
  } finally {
    running.value = false
  }
}

function swap() {
  const nextFrom = to.value
  const nextTo = from.value === "auto" ? detectFormat(input.value) : from.value
  const nextInput = output.value || input.value
  from.value = nextFrom
  to.value = nextTo
  if (output.value) {
    input.value = nextInput
    output.value = ""
    status.value = ""
    statusOk.value = null
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
  saveBlob(output.value, `config.${EXT[to.value]}`, MIME[to.value])
}

function toInput() {
  if (!output.value) return
  input.value = output.value
  from.value = to.value
}

function useSample() {
  const fmt = from.value === "auto" ? "yaml" : from.value
  input.value = SAMPLES[fmt]
  status.value = ""
  statusOk.value = null
}

function clearAll() {
  input.value = ""
  output.value = ""
  status.value = ""
  statusOk.value = null
}

function pickFile() {
  fileRef.value?.click()
}

async function onFile(ev: Event) {
  const file = (ev.target as HTMLInputElement).files?.[0]
  ;(ev.target as HTMLInputElement).value = ""
  if (!file) return
  input.value = await file.text()
  const guessed = formatFromName(file.name)
  if (guessed) from.value = guessed
  status.value = ""
  statusOk.value = null
}
</script>

<template>
  <div class="cfg-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <label class="field">
        <span>{{ t("from") }}</span>
        <el-select
          v-model="from"
          class="fmt"
        >
          <el-option
            v-for="item in sources"
            :key="item"
            :label="t(`fmt_${item}`)"
            :value="item"
          />
        </el-select>
      </label>
      <label class="field">
        <span>{{ t("to") }}</span>
        <el-select
          v-model="to"
          class="fmt"
        >
          <el-option
            v-for="item in FORMATS"
            :key="item"
            :label="t(`fmt_${item}`)"
            :value="item"
          />
        </el-select>
      </label>
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
        :loading="running"
        @click="convert"
      >
        {{ t("convert") }}
      </el-button>
      <el-button @click="swap">{{ t("swap") }}</el-button>
      <el-button @click="copyOut">{{ t("copy") }}</el-button>
      <el-button @click="download">{{ t("download") }}</el-button>
      <el-button @click="toInput">{{ t("toInput") }}</el-button>
      <el-button @click="useSample">{{ t("sample") }}</el-button>
      <el-button @click="pickFile">{{ t("upload") }}</el-button>
      <el-button @click="clearAll">{{ t("clear") }}</el-button>
      <input
        ref="fileRef"
        type="file"
        class="hidden-file"
        accept=".json,.yaml,.yml,.toml,.xml,.ini,.cfg,.conf,.properties,.txt,application/json,text/xml,text/plain"
        @change="onFile"
      >
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
.cfg-page {
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

  :deep(.el-button) {
    margin-left: 0;
  }
}

.field {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.fmt {
  width: 140px;
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

.hidden-file {
  display: none;
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
    "title_page": "配置文件转换",
    "desc": "在浏览器里把 YAML、JSON、XML、TOML、INI 互相转换，可自动识别源格式。数据不会上传。",
    "inputLabel": "输入",
    "outputLabel": "输出",
    "placeholder": "粘贴配置文本，或上传文件…",
    "outputHint": "点击转换后显示结果",
    "from": "源格式",
    "to": "目标格式",
    "fmt_auto": "自动识别",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "转换",
    "swap": "交换",
    "copy": "复制结果",
    "download": "下载",
    "toInput": "结果回填",
    "sample": "示例",
    "upload": "上传文件",
    "clear": "清空",
    "indent2": "2 空格",
    "indent4": "4 空格",
    "indentTab": "Tab",
    "copied": "已复制",
    "ok": "已从 {from} 转为 {to}",
    "msgEmpty": "请先输入配置内容。",
    "msgNoOut": "还没有可复制或下载的结果。",
    "msgLib": "转换库加载失败，请检查网络后重试。",
    "msgFail": "转换失败，请确认源格式和内容是否正确。"
  },
  "zh-CN": {
    "title_page": "配置文件转换",
    "desc": "在浏览器里把 YAML、JSON、XML、TOML、INI 互相转换，可自动识别源格式。数据不会上传。",
    "inputLabel": "输入",
    "outputLabel": "输出",
    "placeholder": "粘贴配置文本，或上传文件…",
    "outputHint": "点击转换后显示结果",
    "from": "源格式",
    "to": "目标格式",
    "fmt_auto": "自动识别",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "转换",
    "swap": "交换",
    "copy": "复制结果",
    "download": "下载",
    "toInput": "结果回填",
    "sample": "示例",
    "upload": "上传文件",
    "clear": "清空",
    "indent2": "2 空格",
    "indent4": "4 空格",
    "indentTab": "Tab",
    "copied": "已复制",
    "ok": "已从 {from} 转为 {to}",
    "msgEmpty": "请先输入配置内容。",
    "msgNoOut": "还没有可复制或下载的结果。",
    "msgLib": "转换库加载失败，请检查网络后重试。",
    "msgFail": "转换失败，请确认源格式和内容是否正确。"
  },
  "en": {
    "title_page": "Config File Converter",
    "desc": "Convert YAML, JSON, XML, TOML, and INI in your browser. Source format can be detected automatically. Nothing is uploaded.",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Paste config text or upload a file…",
    "outputHint": "Result appears after Convert",
    "from": "From",
    "to": "To",
    "fmt_auto": "Auto detect",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "Convert",
    "swap": "Swap",
    "copy": "Copy",
    "download": "Download",
    "toInput": "Use as input",
    "sample": "Sample",
    "upload": "Upload",
    "clear": "Clear",
    "indent2": "2 spaces",
    "indent4": "4 spaces",
    "indentTab": "Tab",
    "copied": "Copied",
    "ok": "Converted {from} to {to}",
    "msgEmpty": "Enter config text first.",
    "msgNoOut": "Nothing to copy or download yet.",
    "msgLib": "Failed to load a converter library. Check your network and retry.",
    "msgFail": "Conversion failed. Check the source format and content."
  },
  "ja": {
    "title_page": "設定ファイル変換",
    "desc": "ブラウザで YAML、JSON、XML、TOML、INI を相互変換します。元の形式は自動判定できます。データは送信されません。",
    "inputLabel": "入力",
    "outputLabel": "出力",
    "placeholder": "設定テキストを貼り付けるか、ファイルをアップロード…",
    "outputHint": "変換後に結果が表示されます",
    "from": "変換元",
    "to": "変換先",
    "fmt_auto": "自動判定",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "変換",
    "swap": "入れ替え",
    "copy": "コピー",
    "download": "ダウンロード",
    "toInput": "結果を入力へ",
    "sample": "サンプル",
    "upload": "アップロード",
    "clear": "クリア",
    "indent2": "2 スペース",
    "indent4": "4 スペース",
    "indentTab": "Tab",
    "copied": "コピーしました",
    "ok": "{from} から {to} に変換しました",
    "msgEmpty": "先に設定内容を入力してください。",
    "msgNoOut": "コピーまたはダウンロードできる結果がありません。",
    "msgLib": "変換ライブラリの読み込みに失敗しました。ネットワークを確認して再試行してください。",
    "msgFail": "変換に失敗しました。元の形式と内容を確認してください。"
  },
  "ko": {
    "title_page": "설정 파일 변환",
    "desc": "브라우저에서 YAML, JSON, XML, TOML, INI를 서로 변환합니다. 원본 형식을 자동 감지할 수 있습니다. 데이터는 업로드되지 않습니다.",
    "inputLabel": "입력",
    "outputLabel": "출력",
    "placeholder": "설정 텍스트를 붙여넣거나 파일을 업로드…",
    "outputHint": "변환 후 결과가 표시됩니다",
    "from": "원본",
    "to": "대상",
    "fmt_auto": "자동 감지",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "변환",
    "swap": "바꾸기",
    "copy": "복사",
    "download": "다운로드",
    "toInput": "결과를 입력으로",
    "sample": "예시",
    "upload": "업로드",
    "clear": "지우기",
    "indent2": "공백 2",
    "indent4": "공백 4",
    "indentTab": "Tab",
    "copied": "복사됨",
    "ok": "{from}에서 {to}(으)로 변환됨",
    "msgEmpty": "먼저 설정 내용을 입력하세요.",
    "msgNoOut": "복사하거나 다운로드할 결과가 없습니다.",
    "msgLib": "변환 라이브러리를 불러오지 못했습니다. 네트워크를 확인한 뒤 다시 시도하세요.",
    "msgFail": "변환에 실패했습니다. 원본 형식과 내용을 확인하세요."
  },
  "fr": {
    "title_page": "Convertisseur de configuration",
    "desc": "Convertissez YAML, JSON, XML, TOML et INI dans le navigateur. Le format source peut être détecté automatiquement. Rien n’est envoyé.",
    "inputLabel": "Entrée",
    "outputLabel": "Sortie",
    "placeholder": "Collez le texte ou importez un fichier…",
    "outputHint": "Le résultat apparaît après Convertir",
    "from": "Source",
    "to": "Cible",
    "fmt_auto": "Détection auto",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "Convertir",
    "swap": "Inverser",
    "copy": "Copier",
    "download": "Télécharger",
    "toInput": "Utiliser en entrée",
    "sample": "Exemple",
    "upload": "Importer",
    "clear": "Effacer",
    "indent2": "2 espaces",
    "indent4": "4 espaces",
    "indentTab": "Tab",
    "copied": "Copié",
    "ok": "Converti de {from} vers {to}",
    "msgEmpty": "Saisissez d’abord le contenu.",
    "msgNoOut": "Rien à copier ou télécharger pour l’instant.",
    "msgLib": "Échec du chargement d’une bibliothèque. Vérifiez le réseau puis réessayez.",
    "msgFail": "Échec de la conversion. Vérifiez le format et le contenu source."
  },
  "de": {
    "title_page": "Konfigurationsdatei-Konverter",
    "desc": "Wandeln Sie YAML, JSON, XML, TOML und INI im Browser um. Das Quellformat kann automatisch erkannt werden. Es wird nichts hochgeladen.",
    "inputLabel": "Eingabe",
    "outputLabel": "Ausgabe",
    "placeholder": "Konfigurationstext einfügen oder Datei hochladen…",
    "outputHint": "Ergebnis nach dem Konvertieren",
    "from": "Von",
    "to": "Nach",
    "fmt_auto": "Automatisch",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "Konvertieren",
    "swap": "Tauschen",
    "copy": "Kopieren",
    "download": "Download",
    "toInput": "Als Eingabe",
    "sample": "Beispiel",
    "upload": "Hochladen",
    "clear": "Leeren",
    "indent2": "2 Leerzeichen",
    "indent4": "4 Leerzeichen",
    "indentTab": "Tab",
    "copied": "Kopiert",
    "ok": "Von {from} nach {to} konvertiert",
    "msgEmpty": "Bitte zuerst den Inhalt eingeben.",
    "msgNoOut": "Noch nichts zum Kopieren oder Herunterladen.",
    "msgLib": "Bibliothek konnte nicht geladen werden. Netzwerk prüfen und erneut versuchen.",
    "msgFail": "Konvertierung fehlgeschlagen. Quellformat und Inhalt prüfen."
  },
  "es": {
    "title_page": "Conversor de configuración",
    "desc": "Convierte YAML, JSON, XML, TOML e INI en el navegador. El formato de origen se puede detectar automáticamente. No se sube nada.",
    "inputLabel": "Entrada",
    "outputLabel": "Salida",
    "placeholder": "Pega el texto o sube un archivo…",
    "outputHint": "El resultado aparece tras Convertir",
    "from": "Origen",
    "to": "Destino",
    "fmt_auto": "Auto",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "Convertir",
    "swap": "Intercambiar",
    "copy": "Copiar",
    "download": "Descargar",
    "toInput": "Usar como entrada",
    "sample": "Ejemplo",
    "upload": "Subir",
    "clear": "Borrar",
    "indent2": "2 espacios",
    "indent4": "4 espacios",
    "indentTab": "Tab",
    "copied": "Copiado",
    "ok": "Convertido de {from} a {to}",
    "msgEmpty": "Introduce primero el contenido.",
    "msgNoOut": "Aún no hay nada que copiar o descargar.",
    "msgLib": "No se pudo cargar una biblioteca. Revisa la red e inténtalo de nuevo.",
    "msgFail": "La conversión falló. Revisa el formato y el contenido de origen."
  },
  "pt": {
    "title_page": "Conversor de configuração",
    "desc": "Converta YAML, JSON, XML, TOML e INI no navegador. O formato de origem pode ser detectado automaticamente. Nada é enviado.",
    "inputLabel": "Entrada",
    "outputLabel": "Saída",
    "placeholder": "Cole o texto ou envie um arquivo…",
    "outputHint": "O resultado aparece após Converter",
    "from": "De",
    "to": "Para",
    "fmt_auto": "Auto",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "Converter",
    "swap": "Trocar",
    "copy": "Copiar",
    "download": "Baixar",
    "toInput": "Usar como entrada",
    "sample": "Exemplo",
    "upload": "Enviar",
    "clear": "Limpar",
    "indent2": "2 espaços",
    "indent4": "4 espaços",
    "indentTab": "Tab",
    "copied": "Copiado",
    "ok": "Convertido de {from} para {to}",
    "msgEmpty": "Insira o conteúdo primeiro.",
    "msgNoOut": "Ainda não há nada para copiar ou baixar.",
    "msgLib": "Falha ao carregar uma biblioteca. Verifique a rede e tente de novo.",
    "msgFail": "A conversão falhou. Verifique o formato e o conteúdo de origem."
  },
  "ru": {
    "title_page": "Конвертер конфигурации",
    "desc": "Конвертируйте YAML, JSON, XML, TOML и INI в браузере. Исходный формат можно определить автоматически. Ничего не загружается на сервер.",
    "inputLabel": "Ввод",
    "outputLabel": "Вывод",
    "placeholder": "Вставьте текст или загрузите файл…",
    "outputHint": "Результат появится после конвертации",
    "from": "Из",
    "to": "В",
    "fmt_auto": "Авто",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "Конвертировать",
    "swap": "Поменять",
    "copy": "Копировать",
    "download": "Скачать",
    "toInput": "В исходные",
    "sample": "Пример",
    "upload": "Загрузить",
    "clear": "Очистить",
    "indent2": "2 пробела",
    "indent4": "4 пробела",
    "indentTab": "Tab",
    "copied": "Скопировано",
    "ok": "Преобразовано из {from} в {to}",
    "msgEmpty": "Сначала введите содержимое.",
    "msgNoOut": "Пока нечего копировать или скачивать.",
    "msgLib": "Не удалось загрузить библиотеку. Проверьте сеть и повторите.",
    "msgFail": "Ошибка преобразования. Проверьте исходный формат и содержимое."
  },
  "ar": {
    "title_page": "محول ملفات الإعدادات",
    "desc": "حوّل YAML وJSON وXML وTOML وINI في المتصفح. يمكن اكتشاف التنسيق المصدر تلقائيًا. لا يُرفع أي شيء.",
    "inputLabel": "الإدخال",
    "outputLabel": "الإخراج",
    "placeholder": "الصق النص أو ارفع ملفًا…",
    "outputHint": "تظهر النتيجة بعد التحويل",
    "from": "من",
    "to": "إلى",
    "fmt_auto": "كشف تلقائي",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "تحويل",
    "swap": "تبديل",
    "copy": "نسخ",
    "download": "تنزيل",
    "toInput": "استخدم كنص إدخال",
    "sample": "مثال",
    "upload": "رفع",
    "clear": "مسح",
    "indent2": "مسافتان",
    "indent4": "4 مسافات",
    "indentTab": "Tab",
    "copied": "تم النسخ",
    "ok": "تم التحويل من {from} إلى {to}",
    "msgEmpty": "أدخل المحتوى أولاً.",
    "msgNoOut": "لا يوجد شيء للنسخ أو التنزيل بعد.",
    "msgLib": "فشل تحميل المكتبة. تحقق من الشبكة ثم أعد المحاولة.",
    "msgFail": "فشل التحويل. تحقق من التنسيق والمحتوى المصدر."
  },
  "hi": {
    "title_page": "कॉन्फ़िग फ़ाइल कनवर्टर",
    "desc": "ब्राउज़र में YAML, JSON, XML, TOML और INI बदलें। स्रोत प्रारूप अपने आप पहचाना जा सकता है। कुछ अपलोड नहीं होता।",
    "inputLabel": "इनपुट",
    "outputLabel": "आउटपुट",
    "placeholder": "टेक्स्ट चिपकाएँ या फ़ाइल अपलोड करें…",
    "outputHint": "कनवर्ट के बाद परिणाम दिखेगा",
    "from": "से",
    "to": "में",
    "fmt_auto": "स्वतः पहचान",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "कनवर्ट",
    "swap": "अदला-बदली",
    "copy": "कॉपी",
    "download": "डाउनलोड",
    "toInput": "इनपुट बनाएँ",
    "sample": "उदाहरण",
    "upload": "अपलोड",
    "clear": "साफ़",
    "indent2": "2 स्पेस",
    "indent4": "4 स्पेस",
    "indentTab": "Tab",
    "copied": "कॉपी हो गया",
    "ok": "{from} से {to} में बदला गया",
    "msgEmpty": "पहले सामग्री दर्ज करें।",
    "msgNoOut": "अभी कॉपी या डाउनलोड करने को कुछ नहीं है।",
    "msgLib": "लाइब्रेरी लोड नहीं हुई। नेटवर्क जाँचकर फिर कोशिश करें।",
    "msgFail": "कनवर्ज़न असफल। स्रोत प्रारूप और सामग्री जाँचें।"
  },
  "it": {
    "title_page": "Convertitore di configurazione",
    "desc": "Converti YAML, JSON, XML, TOML e INI nel browser. Il formato di origine può essere rilevato automaticamente. Nulla viene caricato.",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Incolla il testo o carica un file…",
    "outputHint": "Il risultato appare dopo Converti",
    "from": "Da",
    "to": "A",
    "fmt_auto": "Auto",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "Converti",
    "swap": "Inverti",
    "copy": "Copia",
    "download": "Scarica",
    "toInput": "Usa come input",
    "sample": "Esempio",
    "upload": "Carica",
    "clear": "Svuota",
    "indent2": "2 spazi",
    "indent4": "4 spazi",
    "indentTab": "Tab",
    "copied": "Copiato",
    "ok": "Convertito da {from} a {to}",
    "msgEmpty": "Inserisci prima il contenuto.",
    "msgNoOut": "Non c’è ancora nulla da copiare o scaricare.",
    "msgLib": "Caricamento della libreria non riuscito. Controlla la rete e riprova.",
    "msgFail": "Conversione non riuscita. Controlla formato e contenuto di origine."
  },
  "nl": {
    "title_page": "Configuratieconverter",
    "desc": "Zet YAML, JSON, XML, TOML en INI om in de browser. Het bronformaat kan automatisch worden herkend. Er wordt niets geüpload.",
    "inputLabel": "Invoer",
    "outputLabel": "Uitvoer",
    "placeholder": "Plak tekst of upload een bestand…",
    "outputHint": "Resultaat na Converteren",
    "from": "Van",
    "to": "Naar",
    "fmt_auto": "Auto",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "Converteren",
    "swap": "Wisselen",
    "copy": "Kopiëren",
    "download": "Downloaden",
    "toInput": "Als invoer",
    "sample": "Voorbeeld",
    "upload": "Uploaden",
    "clear": "Wissen",
    "indent2": "2 spaties",
    "indent4": "4 spaties",
    "indentTab": "Tab",
    "copied": "Gekopieerd",
    "ok": "Omgezet van {from} naar {to}",
    "msgEmpty": "Voer eerst de inhoud in.",
    "msgNoOut": "Nog niets om te kopiëren of downloaden.",
    "msgLib": "Bibliotheek laden mislukt. Controleer het netwerk en probeer opnieuw.",
    "msgFail": "Conversie mislukt. Controleer bronformaat en inhoud."
  },
  "tr": {
    "title_page": "Yapılandırma dönüştürücü",
    "desc": "Tarayıcıda YAML, JSON, XML, TOML ve INI dönüştürün. Kaynak biçim otomatik algılanabilir. Hiçbir şey yüklenmez.",
    "inputLabel": "Girdi",
    "outputLabel": "Çıktı",
    "placeholder": "Metni yapıştırın veya dosya yükleyin…",
    "outputHint": "Sonuç Dönüştür’den sonra görünür",
    "from": "Kaynak",
    "to": "Hedef",
    "fmt_auto": "Otomatik",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "Dönüştür",
    "swap": "Değiştir",
    "copy": "Kopyala",
    "download": "İndir",
    "toInput": "Girdi yap",
    "sample": "Örnek",
    "upload": "Yükle",
    "clear": "Temizle",
    "indent2": "2 boşluk",
    "indent4": "4 boşluk",
    "indentTab": "Tab",
    "copied": "Kopyalandı",
    "ok": "{from} biçiminden {to} biçimine dönüştürüldü",
    "msgEmpty": "Önce içeriği girin.",
    "msgNoOut": "Henüz kopyalanacak veya indirilecek bir şey yok.",
    "msgLib": "Kütüphane yüklenemedi. Ağı kontrol edip yeniden deneyin.",
    "msgFail": "Dönüştürme başarısız. Kaynak biçimi ve içeriği kontrol edin."
  },
  "vi": {
    "title_page": "Chuyển đổi tệp cấu hình",
    "desc": "Chuyển YAML, JSON, XML, TOML và INI trong trình duyệt. Có thể tự nhận dạng định dạng nguồn. Không tải dữ liệu lên.",
    "inputLabel": "Đầu vào",
    "outputLabel": "Đầu ra",
    "placeholder": "Dán văn bản hoặc tải tệp lên…",
    "outputHint": "Kết quả hiện sau khi chuyển đổi",
    "from": "Từ",
    "to": "Sang",
    "fmt_auto": "Tự nhận",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "Chuyển đổi",
    "swap": "Đổi chỗ",
    "copy": "Sao chép",
    "download": "Tải xuống",
    "toInput": "Dùng làm đầu vào",
    "sample": "Mẫu",
    "upload": "Tải lên",
    "clear": "Xóa",
    "indent2": "2 khoảng trắng",
    "indent4": "4 khoảng trắng",
    "indentTab": "Tab",
    "copied": "Đã sao chép",
    "ok": "Đã chuyển {from} sang {to}",
    "msgEmpty": "Hãy nhập nội dung trước.",
    "msgNoOut": "Chưa có kết quả để sao chép hoặc tải xuống.",
    "msgLib": "Không tải được thư viện. Kiểm tra mạng rồi thử lại.",
    "msgFail": "Chuyển đổi thất bại. Kiểm tra định dạng và nội dung nguồn."
  },
  "th": {
    "title_page": "แปลงไฟล์คอนฟิก",
    "desc": "แปลง YAML, JSON, XML, TOML และ INI ในเบราว์เซอร์ ตรวจจับรูปแบบต้นทางได้อัตโนมัติ ไม่มีการอัปโหลดข้อมูล",
    "inputLabel": "อินพุต",
    "outputLabel": "เอาต์พุต",
    "placeholder": "วางข้อความหรืออัปโหลดไฟล์…",
    "outputHint": "ผลลัพธ์จะแสดงหลังแปลง",
    "from": "จาก",
    "to": "เป็น",
    "fmt_auto": "ตรวจจับอัตโนมัติ",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "แปลง",
    "swap": "สลับ",
    "copy": "คัดลอก",
    "download": "ดาวน์โหลด",
    "toInput": "ใช้เป็นอินพุต",
    "sample": "ตัวอย่าง",
    "upload": "อัปโหลด",
    "clear": "ล้าง",
    "indent2": "2 ช่องว่าง",
    "indent4": "4 ช่องว่าง",
    "indentTab": "Tab",
    "copied": "คัดลอกแล้ว",
    "ok": "แปลงจาก {from} เป็น {to} แล้ว",
    "msgEmpty": "กรอกเนื้อหาก่อน",
    "msgNoOut": "ยังไม่มีผลลัพธ์ให้คัดลอกหรือดาวน์โหลด",
    "msgLib": "โหลดไลบรารีไม่สำเร็จ ตรวจเครือข่ายแล้วลองใหม่",
    "msgFail": "แปลงไม่สำเร็จ ตรวจรูปแบบและเนื้อหาต้นทาง"
  },
  "id": {
    "title_page": "Konverter file konfigurasi",
    "desc": "Ubah YAML, JSON, XML, TOML, dan INI di browser. Format sumber dapat dideteksi otomatis. Tidak ada data yang diunggah.",
    "inputLabel": "Masukan",
    "outputLabel": "Keluaran",
    "placeholder": "Tempel teks atau unggah berkas…",
    "outputHint": "Hasil muncul setelah Konversi",
    "from": "Dari",
    "to": "Ke",
    "fmt_auto": "Otomatis",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "Konversi",
    "swap": "Tukar",
    "copy": "Salin",
    "download": "Unduh",
    "toInput": "Jadikan masukan",
    "sample": "Contoh",
    "upload": "Unggah",
    "clear": "Kosongkan",
    "indent2": "2 spasi",
    "indent4": "4 spasi",
    "indentTab": "Tab",
    "copied": "Tersalin",
    "ok": "Dikonversi dari {from} ke {to}",
    "msgEmpty": "Masukkan konten terlebih dahulu.",
    "msgNoOut": "Belum ada hasil untuk disalin atau diunduh.",
    "msgLib": "Gagal memuat pustaka. Periksa jaringan lalu coba lagi.",
    "msgFail": "Konversi gagal. Periksa format dan konten sumber."
  },
  "ms": {
    "title_page": "Penukar fail konfigurasi",
    "desc": "Tukar YAML, JSON, XML, TOML dan INI dalam pelayar. Format sumber boleh dikesan secara automatik. Tiada data dimuat naik.",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Tampal teks atau muat naik fail…",
    "outputHint": "Hasil muncul selepas Tukar",
    "from": "Dari",
    "to": "Ke",
    "fmt_auto": "Auto",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "Tukar",
    "swap": "Tukar sisi",
    "copy": "Salin",
    "download": "Muat turun",
    "toInput": "Guna sebagai input",
    "sample": "Contoh",
    "upload": "Muat naik",
    "clear": "Kosongkan",
    "indent2": "2 ruang",
    "indent4": "4 ruang",
    "indentTab": "Tab",
    "copied": "Disalin",
    "ok": "Ditukar dari {from} ke {to}",
    "msgEmpty": "Masukkan kandungan dahulu.",
    "msgNoOut": "Belum ada hasil untuk disalin atau dimuat turun.",
    "msgLib": "Gagal memuatkan pustaka. Semak rangkaian lalu cuba lagi.",
    "msgFail": "Penukaran gagal. Semak format dan kandungan sumber."
  },
  "pl": {
    "title_page": "Konwerter plików konfiguracji",
    "desc": "Konwertuj YAML, JSON, XML, TOML i INI w przeglądarce. Format źródłowy można wykryć automatycznie. Nic nie jest wysyłane.",
    "inputLabel": "Wejście",
    "outputLabel": "Wyjście",
    "placeholder": "Wklej tekst lub wgraj plik…",
    "outputHint": "Wynik pojawi się po konwersji",
    "from": "Z",
    "to": "Na",
    "fmt_auto": "Auto",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "Konwertuj",
    "swap": "Zamień",
    "copy": "Kopiuj",
    "download": "Pobierz",
    "toInput": "Użyj jako wejście",
    "sample": "Przykład",
    "upload": "Wgraj",
    "clear": "Wyczyść",
    "indent2": "2 spacje",
    "indent4": "4 spacje",
    "indentTab": "Tab",
    "copied": "Skopiowano",
    "ok": "Przekonwertowano z {from} na {to}",
    "msgEmpty": "Najpierw wprowadź treść.",
    "msgNoOut": "Nie ma jeszcze nic do skopiowania ani pobrania.",
    "msgLib": "Nie udało się wczytać biblioteki. Sprawdź sieć i spróbuj ponownie.",
    "msgFail": "Konwersja nie powiodła się. Sprawdź format i treść źródła."
  },
  "uk": {
    "title_page": "Конвертер конфігурації",
    "desc": "Конвертуйте YAML, JSON, XML, TOML і INI в браузері. Формат джерела можна визначити автоматично. Нічого не завантажується на сервер.",
    "inputLabel": "Вхід",
    "outputLabel": "Вихід",
    "placeholder": "Вставте текст або завантажте файл…",
    "outputHint": "Результат з’явиться після конвертації",
    "from": "З",
    "to": "В",
    "fmt_auto": "Авто",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "Конвертувати",
    "swap": "Поміняти",
    "copy": "Копіювати",
    "download": "Завантажити",
    "toInput": "Як вхідні дані",
    "sample": "Приклад",
    "upload": "Вибрати файл",
    "clear": "Очистити",
    "indent2": "2 пробіли",
    "indent4": "4 пробіли",
    "indentTab": "Tab",
    "copied": "Скопійовано",
    "ok": "Перетворено з {from} на {to}",
    "msgEmpty": "Спочатку введіть вміст.",
    "msgNoOut": "Ще немає що копіювати чи завантажувати.",
    "msgLib": "Не вдалося завантажити бібліотеку. Перевірте мережу й повторіть.",
    "msgFail": "Помилка перетворення. Перевірте формат і вміст джерела."
  },
  "sv": {
    "title_page": "Konfigurationskonverterare",
    "desc": "Konvertera YAML, JSON, XML, TOML och INI i webbläsaren. Källformatet kan upptäckas automatiskt. Inget laddas upp.",
    "inputLabel": "Indata",
    "outputLabel": "Utdata",
    "placeholder": "Klistra in text eller ladda upp en fil…",
    "outputHint": "Resultat efter Konvertera",
    "from": "Från",
    "to": "Till",
    "fmt_auto": "Auto",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "Konvertera",
    "swap": "Byt",
    "copy": "Kopiera",
    "download": "Ladda ner",
    "toInput": "Använd som indata",
    "sample": "Exempel",
    "upload": "Ladda upp",
    "clear": "Rensa",
    "indent2": "2 mellanslag",
    "indent4": "4 mellanslag",
    "indentTab": "Tab",
    "copied": "Kopierat",
    "ok": "Konverterat från {from} till {to}",
    "msgEmpty": "Ange innehållet först.",
    "msgNoOut": "Inget att kopiera eller ladda ner ännu.",
    "msgLib": "Kunde inte läsa in biblioteket. Kontrollera nätverket och försök igen.",
    "msgFail": "Konverteringen misslyckades. Kontrollera källformat och innehåll."
  },
  "zh-TW": {
    "title_page": "設定檔轉換",
    "desc": "在瀏覽器裡把 YAML、JSON、XML、TOML、INI 互相轉換，可自動辨識來源格式。資料不會上傳。",
    "inputLabel": "輸入",
    "outputLabel": "輸出",
    "placeholder": "貼上設定文字，或上傳檔案…",
    "outputHint": "點轉換後顯示結果",
    "from": "來源格式",
    "to": "目標格式",
    "fmt_auto": "自動辨識",
    "fmt_json": "JSON",
    "fmt_yaml": "YAML",
    "fmt_toml": "TOML",
    "fmt_xml": "XML",
    "fmt_ini": "INI",
    "convert": "轉換",
    "swap": "交換",
    "copy": "複製結果",
    "download": "下載",
    "toInput": "結果回填",
    "sample": "範例",
    "upload": "上傳檔案",
    "clear": "清空",
    "indent2": "2 空格",
    "indent4": "4 空格",
    "indentTab": "Tab",
    "copied": "已複製",
    "ok": "已從 {from} 轉為 {to}",
    "msgEmpty": "請先輸入設定內容。",
    "msgNoOut": "還沒有可複製或下載的結果。",
    "msgLib": "轉換庫載入失敗，請檢查網路後重試。",
    "msgFail": "轉換失敗，請確認來源格式與內容是否正確。"
  }
}
</i18n>
