<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useData } from "vitepress"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { copyToClipboard } from "@/utils"
import { ensureObfuscator, type ObfuscatorOptions } from "./loadObfuscator"
import { ensureBeautify } from "./loadBeautify"
import { highlightCode } from "../../sql-format/components/loadHighlight"

const { t } = useI18n()
const { isDark } = useData()

type Mode = "obfuscate" | "deobfuscate"
type Preset = "low" | "medium" | "high"
type Encoding = "none" | "base64" | "rc4"
type Names = "hexadecimal" | "mangled"

const SAMPLE = `function greet(name) {
  const message = "Hello, " + name + "!"
  console.log(message)
  return message
}

greet("world")
`

const input = ref(SAMPLE)
const output = ref("")
const highlighted = ref("")
const mode = ref<Mode>("obfuscate")
const preset = ref<Preset>("low")
const indent = ref<"2" | "4">("2")
const running = ref(false)
const fileRef = ref<HTMLInputElement | null>(null)

const compact = ref(true)
const controlFlow = ref(false)
const deadCode = ref(false)
const stringArray = ref(true)
const encoding = ref<Encoding>("none")
const selfDefending = ref(false)
const disableConsole = ref(false)
const unicodeEscape = ref(false)
const splitStrings = ref(false)
const numbersToExpr = ref(false)
const names = ref<Names>("hexadecimal")

const options = computed<ObfuscatorOptions>(() => ({
  compact: compact.value,
  controlFlowFlattening: controlFlow.value,
  controlFlowFlatteningThreshold: preset.value === "high" ? 1 : 0.75,
  deadCodeInjection: deadCode.value,
  deadCodeInjectionThreshold: 0.4,
  disableConsoleOutput: disableConsole.value,
  identifierNamesGenerator: names.value,
  numbersToExpressions: numbersToExpr.value,
  selfDefending: selfDefending.value,
  simplify: true,
  splitStrings: splitStrings.value,
  splitStringsChunkLength: 10,
  stringArray: stringArray.value,
  stringArrayEncoding: encoding.value === "none" ? [] : [encoding.value],
  stringArrayThreshold: 0.75,
  target: "browser",
  unicodeEscapeSequence: unicodeEscape.value,
}))

function applyPreset(p: Preset) {
  compact.value = true
  stringArray.value = true
  names.value = "hexadecimal"
  if (p === "low") {
    controlFlow.value = false
    deadCode.value = false
    encoding.value = "none"
    selfDefending.value = false
    disableConsole.value = false
    unicodeEscape.value = false
    splitStrings.value = false
    numbersToExpr.value = false
  } else if (p === "medium") {
    controlFlow.value = true
    deadCode.value = true
    encoding.value = "base64"
    selfDefending.value = false
    disableConsole.value = false
    unicodeEscape.value = false
    splitStrings.value = true
    numbersToExpr.value = true
  } else {
    controlFlow.value = true
    deadCode.value = true
    encoding.value = "rc4"
    selfDefending.value = true
    disableConsole.value = true
    unicodeEscape.value = false
    splitStrings.value = true
    numbersToExpr.value = true
  }
}

watch(preset, applyPreset, { immediate: true })

watch([output, isDark], async () => {
  if (!output.value) {
    highlighted.value = ""
    return
  }
  try {
    highlighted.value = await highlightCode(output.value, "javascript", isDark.value)
  } catch {
    highlighted.value = ""
  }
})

function needText() {
  if (input.value.trim()) return true
  ElMessage({ message: t("msgEmpty"), type: "warning" })
  return false
}

function libError(err: unknown) {
  const msg = err instanceof Error ? err.message : ""
  return msg.includes("JavaScriptObfuscator") || msg.includes("js_beautify") || msg.includes("资源")
}

async function runObfuscate() {
  if (!needText()) return
  running.value = true
  try {
    const lib = await ensureObfuscator()
    output.value = lib.obfuscate(input.value, options.value).getObfuscatedCode()
  } catch (err) {
    ElMessage({ message: libError(err) ? t("msgLib") : t("msgFail"), type: "error" })
  } finally {
    running.value = false
  }
}

async function runDeobfuscate() {
  if (!needText()) return
  running.value = true
  try {
    const beautify = await ensureBeautify()
    output.value = beautify(input.value, {
      indent_size: Number(indent.value),
      unescape_strings: true,
      wrap_line_length: 0,
      preserve_newlines: false,
      end_with_newline: true,
    })
  } catch (err) {
    ElMessage({ message: libError(err) ? t("msgLib") : t("msgFail"), type: "error" })
  } finally {
    running.value = false
  }
}

function run() {
  if (mode.value === "obfuscate") void runObfuscate()
  else void runDeobfuscate()
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
  a.href = URL.createObjectURL(new Blob([output.value], { type: "text/javascript;charset=utf-8" }))
  a.download = mode.value === "obfuscate" ? "obfuscated.js" : "deobfuscated.js"
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
  input.value = SAMPLE
}

function clearAll() {
  input.value = ""
  output.value = ""
}

function openFile() {
  fileRef.value?.click()
}

async function onFile(ev: Event) {
  const el = ev.target as HTMLInputElement
  const file = el.files?.[0]
  el.value = ""
  if (!file) return
  input.value = await file.text()
}
</script>

<template>
  <div class="obf-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <el-radio-group v-model="mode">
        <el-radio-button value="obfuscate">{{ t("obfuscate") }}</el-radio-button>
        <el-radio-button value="deobfuscate">{{ t("deobfuscate") }}</el-radio-button>
      </el-radio-group>
      <template v-if="mode === 'obfuscate'">
        <el-radio-group v-model="preset">
          <el-radio-button value="low">{{ t("presetLow") }}</el-radio-button>
          <el-radio-button value="medium">{{ t("presetMid") }}</el-radio-button>
          <el-radio-button value="high">{{ t("presetHigh") }}</el-radio-button>
        </el-radio-group>
      </template>
      <el-radio-group
        v-else
        v-model="indent"
      >
        <el-radio-button value="2">{{ t("indent2") }}</el-radio-button>
        <el-radio-button value="4">{{ t("indent4") }}</el-radio-button>
      </el-radio-group>
    </div>

    <div
      v-if="mode === 'obfuscate'"
      class="opts"
    >
      <el-switch
        v-model="compact"
        :active-text="t('optCompact')"
      />
      <el-switch
        v-model="stringArray"
        :active-text="t('optStringArray')"
      />
      <el-switch
        v-model="controlFlow"
        :active-text="t('optControl')"
      />
      <el-switch
        v-model="deadCode"
        :active-text="t('optDead')"
      />
      <el-switch
        v-model="splitStrings"
        :active-text="t('optSplit')"
      />
      <el-switch
        v-model="numbersToExpr"
        :active-text="t('optNumbers')"
      />
      <el-switch
        v-model="selfDefending"
        :active-text="t('optSelf')"
      />
      <el-switch
        v-model="disableConsole"
        :active-text="t('optConsole')"
      />
      <el-switch
        v-model="unicodeEscape"
        :active-text="t('optUnicode')"
      />
      <el-select
        v-model="encoding"
        class="sel"
      >
        <el-option
          value="none"
          :label="t('encNone')"
        />
        <el-option
          value="base64"
          :label="t('encBase64')"
        />
        <el-option
          value="rc4"
          :label="t('encRc4')"
        />
      </el-select>
      <el-select
        v-model="names"
        class="sel"
      >
        <el-option
          value="hexadecimal"
          :label="t('nameHex')"
        />
        <el-option
          value="mangled"
          :label="t('nameMangle')"
        />
      </el-select>
    </div>

    <div class="actions">
      <el-button
        type="primary"
        :loading="running"
        @click="run"
      >
        {{ mode === "obfuscate" ? t("runObf") : t("runDeobf") }}
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
      accept=".js,.mjs,.cjs,.ts,text/javascript,text/plain"
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
.obf-page {
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
.opts,
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

.sel {
  width: 150px;
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
    "title_page": "代码混淆 / 反混淆",
    "desc": "在浏览器里混淆或还原 JavaScript。混淆使用 javascript-obfuscator，反混淆会美化代码并还原转义字符串。高强度混淆无法保证完全还原。库从 CDN 加载，数据不会上传。",
    "obfuscate": "混淆",
    "deobfuscate": "反混淆",
    "presetLow": "低",
    "presetMid": "中",
    "presetHigh": "高",
    "indent2": "2 空格",
    "indent4": "4 空格",
    "optCompact": "压缩",
    "optStringArray": "字符串数组",
    "optControl": "控制流平坦化",
    "optDead": "注入死代码",
    "optSplit": "拆分字符串",
    "optNumbers": "数字转表达式",
    "optSelf": "自我保护",
    "optConsole": "禁用 console",
    "optUnicode": "Unicode 转义",
    "encNone": "字符串不编码",
    "encBase64": "字符串 Base64",
    "encRc4": "字符串 RC4",
    "nameHex": "十六进制变量名",
    "nameMangle": "短变量名",
    "runObf": "开始混淆",
    "runDeobf": "开始反混淆",
    "copy": "复制结果",
    "download": "下载",
    "toInput": "结果回填",
    "open": "打开文件",
    "sample": "示例",
    "clear": "清空",
    "inputLabel": "输入",
    "outputLabel": "输出",
    "placeholder": "粘贴 JavaScript…",
    "outputHint": "点击上方按钮后显示结果",
    "copied": "已复制",
    "msgEmpty": "请先输入代码。",
    "msgNoOut": "还没有可复制或下载的结果。",
    "msgLib": "无法从 CDN 加载所需库，请检查网络后重试。",
    "msgFail": "处理失败，请检查代码是否为合法 JavaScript。"
  },
  "zh-CN": {
    "title_page": "代码混淆 / 反混淆",
    "desc": "在浏览器里混淆或还原 JavaScript。混淆使用 javascript-obfuscator，反混淆会美化代码并还原转义字符串。高强度混淆无法保证完全还原。库从 CDN 加载，数据不会上传。",
    "obfuscate": "混淆",
    "deobfuscate": "反混淆",
    "presetLow": "低",
    "presetMid": "中",
    "presetHigh": "高",
    "indent2": "2 空格",
    "indent4": "4 空格",
    "optCompact": "压缩",
    "optStringArray": "字符串数组",
    "optControl": "控制流平坦化",
    "optDead": "注入死代码",
    "optSplit": "拆分字符串",
    "optNumbers": "数字转表达式",
    "optSelf": "自我保护",
    "optConsole": "禁用 console",
    "optUnicode": "Unicode 转义",
    "encNone": "字符串不编码",
    "encBase64": "字符串 Base64",
    "encRc4": "字符串 RC4",
    "nameHex": "十六进制变量名",
    "nameMangle": "短变量名",
    "runObf": "开始混淆",
    "runDeobf": "开始反混淆",
    "copy": "复制结果",
    "download": "下载",
    "toInput": "结果回填",
    "open": "打开文件",
    "sample": "示例",
    "clear": "清空",
    "inputLabel": "输入",
    "outputLabel": "输出",
    "placeholder": "粘贴 JavaScript…",
    "outputHint": "点击上方按钮后显示结果",
    "copied": "已复制",
    "msgEmpty": "请先输入代码。",
    "msgNoOut": "还没有可复制或下载的结果。",
    "msgLib": "无法从 CDN 加载所需库，请检查网络后重试。",
    "msgFail": "处理失败，请检查代码是否为合法 JavaScript。"
  },
  "en": {
    "title_page": "Code Obfuscate / Deobfuscate",
    "desc": "Obfuscate or recover JavaScript in the browser. Obfuscation uses javascript-obfuscator. Deobfuscation beautifies code and unescapes strings. Strong obfuscation may not fully reverse. Libraries load from a CDN. Nothing is uploaded.",
    "obfuscate": "Obfuscate",
    "deobfuscate": "Deobfuscate",
    "presetLow": "Low",
    "presetMid": "Medium",
    "presetHigh": "High",
    "indent2": "2 spaces",
    "indent4": "4 spaces",
    "optCompact": "Compact",
    "optStringArray": "String array",
    "optControl": "Control-flow flattening",
    "optDead": "Dead-code injection",
    "optSplit": "Split strings",
    "optNumbers": "Numbers to expressions",
    "optSelf": "Self defending",
    "optConsole": "Disable console",
    "optUnicode": "Unicode escape",
    "encNone": "No string encoding",
    "encBase64": "String Base64",
    "encRc4": "String RC4",
    "nameHex": "Hex identifiers",
    "nameMangle": "Short identifiers",
    "runObf": "Obfuscate",
    "runDeobf": "Deobfuscate",
    "copy": "Copy result",
    "download": "Download",
    "toInput": "Send to input",
    "open": "Open file",
    "sample": "Sample",
    "clear": "Clear",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Paste JavaScript…",
    "outputHint": "Result appears after you run a command",
    "copied": "Copied",
    "msgEmpty": "Enter some code first.",
    "msgNoOut": "There is nothing to copy or download yet.",
    "msgLib": "Could not load libraries from the CDN. Check your network and retry.",
    "msgFail": "Failed. Make sure the input is valid JavaScript."
  },
  "ja": {
    "title_page": "コード難読化 / 復元",
    "desc": "ブラウザで JavaScript を難読化または復元します。難読化は javascript-obfuscator、復元は整形とエスケープ解除です。強い難読化は完全復元できない場合があります。CDN から読み込み、アップロードしません。",
    "obfuscate": "難読化",
    "deobfuscate": "復元",
    "presetLow": "低",
    "presetMid": "中",
    "presetHigh": "高",
    "indent2": "2 スペース",
    "indent4": "4 スペース",
    "optCompact": "圧縮",
    "optStringArray": "文字列配列",
    "optControl": "制御フロー平坦化",
    "optDead": "デッドコード注入",
    "optSplit": "文字列分割",
    "optNumbers": "数値を式に",
    "optSelf": "自己防御",
    "optConsole": "console 無効",
    "optUnicode": "Unicode エスケープ",
    "encNone": "文字列を符号化しない",
    "encBase64": "文字列 Base64",
    "encRc4": "文字列 RC4",
    "nameHex": "16進の識別子",
    "nameMangle": "短い識別子",
    "runObf": "難読化する",
    "runDeobf": "復元する",
    "copy": "結果をコピー",
    "download": "ダウンロード",
    "toInput": "結果を入力へ",
    "open": "ファイルを開く",
    "sample": "サンプル",
    "clear": "クリア",
    "inputLabel": "入力",
    "outputLabel": "出力",
    "placeholder": "JavaScript を貼り付け…",
    "outputHint": "上のボタンを押すと結果が表示されます",
    "copied": "コピーしました",
    "msgEmpty": "先にコードを入力してください。",
    "msgNoOut": "コピーまたは保存できる結果がありません。",
    "msgLib": "CDN からライブラリを読み込めません。通信を確認して再試行してください。",
    "msgFail": "失敗しました。正しい JavaScript か確認してください。"
  },
  "ko": {
    "title_page": "코드 난독화 / 복원",
    "desc": "브라우저에서 JavaScript를 난독화하거나 복원합니다. 난독화는 javascript-obfuscator, 복원은 포맷과 이스케이프 해제입니다. 강한 난독화는 완전히 되돌리지 못할 수 있습니다. CDN에서 불러오며 업로드하지 않습니다.",
    "obfuscate": "난독화",
    "deobfuscate": "복원",
    "presetLow": "낮음",
    "presetMid": "중간",
    "presetHigh": "높음",
    "indent2": "공백 2",
    "indent4": "공백 4",
    "optCompact": "압축",
    "optStringArray": "문자열 배열",
    "optControl": "제어 흐름 평탄화",
    "optDead": "죽은 코드 삽입",
    "optSplit": "문자열 분할",
    "optNumbers": "숫자를 식으로",
    "optSelf": "자기 보호",
    "optConsole": "console 끄기",
    "optUnicode": "유니코드 이스케이프",
    "encNone": "문자열 인코딩 없음",
    "encBase64": "문자열 Base64",
    "encRc4": "문자열 RC4",
    "nameHex": "16진 식별자",
    "nameMangle": "짧은 식별자",
    "runObf": "난독화 시작",
    "runDeobf": "복원 시작",
    "copy": "결과 복사",
    "download": "다운로드",
    "toInput": "결과를 입력으로",
    "open": "파일 열기",
    "sample": "예제",
    "clear": "지우기",
    "inputLabel": "입력",
    "outputLabel": "출력",
    "placeholder": "JavaScript 붙여넣기…",
    "outputHint": "위 버튼을 누르면 결과가 나타납니다",
    "copied": "복사됨",
    "msgEmpty": "먼저 코드를 입력하세요.",
    "msgNoOut": "복사하거나 받을 결과가 없습니다.",
    "msgLib": "CDN에서 라이브러리를 불러오지 못했습니다. 네트워크를 확인하세요.",
    "msgFail": "실패했습니다. 올바른 JavaScript인지 확인하세요."
  },
  "fr": {
    "title_page": "Obfusquer / désobfusquer",
    "desc": "Obfusquez ou rétablissez du JavaScript dans le navigateur. L’obfuscation utilise javascript-obfuscator. La désobfuscation reformate et décode les échappements. Une obfuscation forte peut être irréversible. Bibliothèques via CDN, rien n’est envoyé.",
    "obfuscate": "Obfusquer",
    "deobfuscate": "Désobfusquer",
    "presetLow": "Faible",
    "presetMid": "Moyen",
    "presetHigh": "Élevé",
    "indent2": "2 espaces",
    "indent4": "4 espaces",
    "optCompact": "Compact",
    "optStringArray": "Tableau de chaînes",
    "optControl": "Aplatissement du flux",
    "optDead": "Code mort",
    "optSplit": "Découper les chaînes",
    "optNumbers": "Nombres en expressions",
    "optSelf": "Auto-défense",
    "optConsole": "Désactiver console",
    "optUnicode": "Échappement Unicode",
    "encNone": "Sans encodage",
    "encBase64": "Chaînes Base64",
    "encRc4": "Chaînes RC4",
    "nameHex": "Identifiants hex",
    "nameMangle": "Identifiants courts",
    "runObf": "Obfusquer",
    "runDeobf": "Désobfusquer",
    "copy": "Copier le résultat",
    "download": "Télécharger",
    "toInput": "Renvoyer en entrée",
    "open": "Ouvrir",
    "sample": "Exemple",
    "clear": "Effacer",
    "inputLabel": "Entrée",
    "outputLabel": "Sortie",
    "placeholder": "Collez du JavaScript…",
    "outputHint": "Le résultat apparaît après une action",
    "copied": "Copié",
    "msgEmpty": "Saisissez d’abord du code.",
    "msgNoOut": "Rien à copier ou télécharger.",
    "msgLib": "Impossible de charger les bibliothèques CDN. Vérifiez le réseau.",
    "msgFail": "Échec. Vérifiez que le code est du JavaScript valide."
  },
  "de": {
    "title_page": "Code verschleiern / enttarnen",
    "desc": "JavaScript im Browser verschleiern oder wieder lesbar machen. Verschleierung mit javascript-obfuscator. Enttarnen formatiert und hebt Escapes auf. Starke Verschleierung ist oft nicht vollständig umkehrbar. Bibliotheken per CDN, nichts wird hochgeladen.",
    "obfuscate": "Verschleiern",
    "deobfuscate": "Enttarnen",
    "presetLow": "Niedrig",
    "presetMid": "Mittel",
    "presetHigh": "Hoch",
    "indent2": "2 Leerzeichen",
    "indent4": "4 Leerzeichen",
    "optCompact": "Kompakt",
    "optStringArray": "String-Array",
    "optControl": "Control-Flow glätten",
    "optDead": "Dead Code",
    "optSplit": "Strings teilen",
    "optNumbers": "Zahlen als Ausdrücke",
    "optSelf": "Selbstschutz",
    "optConsole": "console aus",
    "optUnicode": "Unicode-Escape",
    "encNone": "Keine String-Kodierung",
    "encBase64": "Strings Base64",
    "encRc4": "Strings RC4",
    "nameHex": "Hex-Bezeichner",
    "nameMangle": "Kurze Bezeichner",
    "runObf": "Verschleiern",
    "runDeobf": "Enttarnen",
    "copy": "Ergebnis kopieren",
    "download": "Download",
    "toInput": "Ins Eingabefeld",
    "open": "Öffnen",
    "sample": "Beispiel",
    "clear": "Leeren",
    "inputLabel": "Eingabe",
    "outputLabel": "Ausgabe",
    "placeholder": "JavaScript einfügen…",
    "outputHint": "Ergebnis erscheint nach einem Klick",
    "copied": "Kopiert",
    "msgEmpty": "Bitte zuerst Code eingeben.",
    "msgNoOut": "Noch nichts zum Kopieren oder Laden.",
    "msgLib": "CDN-Bibliotheken konnten nicht geladen werden. Netz prüfen.",
    "msgFail": "Fehlgeschlagen. Ist die Eingabe gültiges JavaScript?"
  },
  "es": {
    "title_page": "Ofuscar / desofuscar código",
    "desc": "Ofusca o recupera JavaScript en el navegador. La ofuscación usa javascript-obfuscator. La desofuscación formatea y quita escapes. Una ofuscación fuerte puede no revertirse del todo. Librerías por CDN, no se sube nada.",
    "obfuscate": "Ofuscar",
    "deobfuscate": "Desofuscar",
    "presetLow": "Bajo",
    "presetMid": "Medio",
    "presetHigh": "Alto",
    "indent2": "2 espacios",
    "indent4": "4 espacios",
    "optCompact": "Compacto",
    "optStringArray": "Array de cadenas",
    "optControl": "Aplanar el flujo",
    "optDead": "Código muerto",
    "optSplit": "Partir cadenas",
    "optNumbers": "Números a expresiones",
    "optSelf": "Autodefensa",
    "optConsole": "Desactivar console",
    "optUnicode": "Escape Unicode",
    "encNone": "Sin codificar cadenas",
    "encBase64": "Cadenas Base64",
    "encRc4": "Cadenas RC4",
    "nameHex": "Identificadores hex",
    "nameMangle": "Identificadores cortos",
    "runObf": "Ofuscar",
    "runDeobf": "Desofuscar",
    "copy": "Copiar resultado",
    "download": "Descargar",
    "toInput": "Enviar a entrada",
    "open": "Abrir",
    "sample": "Ejemplo",
    "clear": "Borrar",
    "inputLabel": "Entrada",
    "outputLabel": "Salida",
    "placeholder": "Pega JavaScript…",
    "outputHint": "El resultado aparece tras pulsar un botón",
    "copied": "Copiado",
    "msgEmpty": "Escribe código primero.",
    "msgNoOut": "Aún no hay nada que copiar o descargar.",
    "msgLib": "No se pudieron cargar las librerías del CDN. Revisa la red.",
    "msgFail": "Error. Comprueba que el código sea JavaScript válido."
  },
  "pt": {
    "title_page": "Ofuscar / desofuscar código",
    "desc": "Ofusque ou recupere JavaScript no navegador. A ofuscação usa javascript-obfuscator. A desofuscação formata e remove escapes. Ofuscação forte pode não reverter por completo. Bibliotecas via CDN, nada é enviado.",
    "obfuscate": "Ofuscar",
    "deobfuscate": "Desofuscar",
    "presetLow": "Baixo",
    "presetMid": "Médio",
    "presetHigh": "Alto",
    "indent2": "2 espaços",
    "indent4": "4 espaços",
    "optCompact": "Compacto",
    "optStringArray": "Array de strings",
    "optControl": "Achatar o fluxo",
    "optDead": "Código morto",
    "optSplit": "Dividir strings",
    "optNumbers": "Números em expressões",
    "optSelf": "Autodefesa",
    "optConsole": "Desativar console",
    "optUnicode": "Escape Unicode",
    "encNone": "Sem codificar strings",
    "encBase64": "Strings Base64",
    "encRc4": "Strings RC4",
    "nameHex": "Identificadores hex",
    "nameMangle": "Identificadores curtos",
    "runObf": "Ofuscar",
    "runDeobf": "Desofuscar",
    "copy": "Copiar resultado",
    "download": "Baixar",
    "toInput": "Enviar à entrada",
    "open": "Abrir",
    "sample": "Exemplo",
    "clear": "Limpar",
    "inputLabel": "Entrada",
    "outputLabel": "Saída",
    "placeholder": "Cole JavaScript…",
    "outputHint": "O resultado aparece após um comando",
    "copied": "Copiado",
    "msgEmpty": "Digite código primeiro.",
    "msgNoOut": "Ainda não há o que copiar ou baixar.",
    "msgLib": "Não foi possível carregar as bibliotecas do CDN. Verifique a rede.",
    "msgFail": "Falha. Confira se o código é JavaScript válido."
  },
  "ru": {
    "title_page": "Обфускация / деобфускация",
    "desc": "Обфусцируйте или восстановите JavaScript в браузере. Обфускация — javascript-obfuscator. Деобфускация форматирует код и снимает экранирование. Сильную обфускацию нельзя полностью обратить. Библиотеки с CDN, ничего не загружается.",
    "obfuscate": "Обфускация",
    "deobfuscate": "Деобфускация",
    "presetLow": "Низкая",
    "presetMid": "Средняя",
    "presetHigh": "Высокая",
    "indent2": "2 пробела",
    "indent4": "4 пробела",
    "optCompact": "Сжать",
    "optStringArray": "Массив строк",
    "optControl": "Выравнивание потока",
    "optDead": "Мёртвый код",
    "optSplit": "Дробить строки",
    "optNumbers": "Числа в выражения",
    "optSelf": "Самозащита",
    "optConsole": "Отключить console",
    "optUnicode": "Unicode-экранирование",
    "encNone": "Без кодирования строк",
    "encBase64": "Строки Base64",
    "encRc4": "Строки RC4",
    "nameHex": "Шестнадцатеричные имена",
    "nameMangle": "Короткие имена",
    "runObf": "Обфусцировать",
    "runDeobf": "Деобфусцировать",
    "copy": "Копировать результат",
    "download": "Скачать",
    "toInput": "В поле ввода",
    "open": "Открыть",
    "sample": "Пример",
    "clear": "Очистить",
    "inputLabel": "Ввод",
    "outputLabel": "Вывод",
    "placeholder": "Вставьте JavaScript…",
    "outputHint": "Результат появится после кнопки",
    "copied": "Скопировано",
    "msgEmpty": "Сначала введите код.",
    "msgNoOut": "Пока нечего копировать или скачивать.",
    "msgLib": "Не удалось загрузить библиотеки с CDN. Проверьте сеть.",
    "msgFail": "Ошибка. Проверьте, что это корректный JavaScript."
  },
  "ar": {
    "title_page": "تشويش / إلغاء تشويش الشفرة",
    "desc": "شوّه أو استعد JavaScript في المتصفح. التشويش عبر javascript-obfuscator. إلغاء التشويش ينسّق ويفك الهروب. التشويش القوي قد لا يُعكس بالكامل. المكتبات من CDN ولا يُرفع شيء.",
    "obfuscate": "تشويش",
    "deobfuscate": "إلغاء التشويش",
    "presetLow": "منخفض",
    "presetMid": "متوسط",
    "presetHigh": "مرتفع",
    "indent2": "مسافتان",
    "indent4": "4 مسافات",
    "optCompact": "ضغط",
    "optStringArray": "مصفوفة نصوص",
    "optControl": "تسطيح التدفق",
    "optDead": "حقن كود ميت",
    "optSplit": "تقسيم النصوص",
    "optNumbers": "أرقام إلى تعبيرات",
    "optSelf": "حماية ذاتية",
    "optConsole": "تعطيل console",
    "optUnicode": "هروب يونيكود",
    "encNone": "بدون ترميز النصوص",
    "encBase64": "نصوص Base64",
    "encRc4": "نصوص RC4",
    "nameHex": "أسماء سداسية",
    "nameMangle": "أسماء قصيرة",
    "runObf": "تشويش",
    "runDeobf": "إلغاء التشويش",
    "copy": "نسخ النتيجة",
    "download": "تنزيل",
    "toInput": "إلى الإدخال",
    "open": "فتح",
    "sample": "مثال",
    "clear": "مسح",
    "inputLabel": "إدخال",
    "outputLabel": "إخراج",
    "placeholder": "الصق JavaScript…",
    "outputHint": "تظهر النتيجة بعد الضغط على زر",
    "copied": "تم النسخ",
    "msgEmpty": "أدخل الشفرة أولاً.",
    "msgNoOut": "لا شيء للنسخ أو التنزيل بعد.",
    "msgLib": "تعذر تحميل مكتبات CDN. تحقق من الشبكة.",
    "msgFail": "فشل. تأكد أن الإدخال JavaScript صالح."
  },
  "hi": {
    "title_page": "कोड अस्पष्ट / स्पष्ट करें",
    "desc": "ब्राउज़र में JavaScript अस्पष्ट या स्पष्ट करें। अस्पष्टता javascript-obfuscator से है। स्पष्ट करना कोड सजाता और एस्केप हटाता है। तेज़ अस्पष्टता पूरी तरह उलटी नहीं हो सकती। लाइब्रेरी CDN से, कुछ अपलोड नहीं होता।",
    "obfuscate": "अस्पष्ट करें",
    "deobfuscate": "स्पष्ट करें",
    "presetLow": "कम",
    "presetMid": "मध्यम",
    "presetHigh": "उच्च",
    "indent2": "2 स्पेस",
    "indent4": "4 स्पेस",
    "optCompact": "संक्षिप्त",
    "optStringArray": "स्ट्रिंग ऐरे",
    "optControl": "कंट्रोल-फ्लो समतल",
    "optDead": "डेड कोड",
    "optSplit": "स्ट्रिंग बाँटें",
    "optNumbers": "संख्या को व्यंजक",
    "optSelf": "स्व-रक्षा",
    "optConsole": "console बंद",
    "optUnicode": "यूनिकोड एस्केप",
    "encNone": "स्ट्रिंग एन्कोड नहीं",
    "encBase64": "स्ट्रिंग Base64",
    "encRc4": "स्ट्रिंग RC4",
    "nameHex": "हेक्स नाम",
    "nameMangle": "छोटे नाम",
    "runObf": "अस्पष्ट करें",
    "runDeobf": "स्पष्ट करें",
    "copy": "परिणाम कॉपी",
    "download": "डाउनलोड",
    "toInput": "इनपुट में भेजें",
    "open": "खोलें",
    "sample": "उदाहरण",
    "clear": "साफ़",
    "inputLabel": "इनपुट",
    "outputLabel": "आउटपुट",
    "placeholder": "JavaScript चिपकाएँ…",
    "outputHint": "बटन दबाने पर परिणाम दिखेगा",
    "copied": "कॉपी हो गया",
    "msgEmpty": "पहले कोड लिखें।",
    "msgNoOut": "कॉपी या डाउनलोड करने को कुछ नहीं।",
    "msgLib": "CDN से लाइब्रेरी नहीं मिली। नेटवर्क जाँचें।",
    "msgFail": "असफल। जाँचें कि इनपुट वैध JavaScript है।"
  },
  "it": {
    "title_page": "Offusca / deoffusca codice",
    "desc": "Offusca o ripristina JavaScript nel browser. L’offuscamento usa javascript-obfuscator. La deoffuscazione formatta e toglie gli escape. Un offuscamento forte può non essere reversibile. Librerie da CDN, nulla viene caricato.",
    "obfuscate": "Offusca",
    "deobfuscate": "Deoffusca",
    "presetLow": "Basso",
    "presetMid": "Medio",
    "presetHigh": "Alto",
    "indent2": "2 spazi",
    "indent4": "4 spazi",
    "optCompact": "Compatto",
    "optStringArray": "Array di stringhe",
    "optControl": "Appiattisci il flusso",
    "optDead": "Codice morto",
    "optSplit": "Dividi stringhe",
    "optNumbers": "Numeri in espressioni",
    "optSelf": "Autodifesa",
    "optConsole": "Disattiva console",
    "optUnicode": "Escape Unicode",
    "encNone": "Nessuna codifica",
    "encBase64": "Stringhe Base64",
    "encRc4": "Stringhe RC4",
    "nameHex": "Identificatori hex",
    "nameMangle": "Identificatori corti",
    "runObf": "Offusca",
    "runDeobf": "Deoffusca",
    "copy": "Copia risultato",
    "download": "Scarica",
    "toInput": "Invia all’input",
    "open": "Apri",
    "sample": "Esempio",
    "clear": "Svuota",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Incolla JavaScript…",
    "outputHint": "Il risultato appare dopo un pulsante",
    "copied": "Copiato",
    "msgEmpty": "Inserisci prima del codice.",
    "msgNoOut": "Non c’è ancora nulla da copiare o scaricare.",
    "msgLib": "Impossibile caricare le librerie CDN. Controlla la rete.",
    "msgFail": "Errore. Verifica che l’input sia JavaScript valido."
  },
  "nl": {
    "title_page": "Code verdoezelen / herstellen",
    "desc": "Verdoezel of herstel JavaScript in de browser. Verdoezelen gebruikt javascript-obfuscator. Herstellen formatteert en haalt escapes weg. Sterke verdoezeling is vaak niet volledig omkeerbaar. Bibliotheken via CDN, niets wordt geüpload.",
    "obfuscate": "Verdoezelen",
    "deobfuscate": "Herstellen",
    "presetLow": "Laag",
    "presetMid": "Gemiddeld",
    "presetHigh": "Hoog",
    "indent2": "2 spaties",
    "indent4": "4 spaties",
    "optCompact": "Compact",
    "optStringArray": "String-array",
    "optControl": "Controlestroom vlakken",
    "optDead": "Dode code",
    "optSplit": "Strings splitsen",
    "optNumbers": "Getallen als expressies",
    "optSelf": "Zelfverdediging",
    "optConsole": "console uit",
    "optUnicode": "Unicode-escape",
    "encNone": "Geen stringcodering",
    "encBase64": "Strings Base64",
    "encRc4": "Strings RC4",
    "nameHex": "Hex-namen",
    "nameMangle": "Korte namen",
    "runObf": "Verdoezelen",
    "runDeobf": "Herstellen",
    "copy": "Resultaat kopiëren",
    "download": "Downloaden",
    "toInput": "Naar invoer",
    "open": "Openen",
    "sample": "Voorbeeld",
    "clear": "Wissen",
    "inputLabel": "Invoer",
    "outputLabel": "Uitvoer",
    "placeholder": "Plak JavaScript…",
    "outputHint": "Resultaat verschijnt na een knop",
    "copied": "Gekopieerd",
    "msgEmpty": "Voer eerst code in.",
    "msgNoOut": "Nog niets om te kopiëren of downloaden.",
    "msgLib": "CDN-bibliotheken konden niet worden geladen. Controleer het netwerk.",
    "msgFail": "Mislukt. Controleer of de invoer geldige JavaScript is."
  },
  "tr": {
    "title_page": "Kod karart / çöz",
    "desc": "Tarayıcıda JavaScript karartın veya okunur hale getirin. Karartma javascript-obfuscator kullanır. Çözme biçimlendirir ve kaçışları açar. Güçlü karartma tam geri alınamayabilir. Kitaplıklar CDN’den, hiçbir şey yüklenmez.",
    "obfuscate": "Karart",
    "deobfuscate": "Çöz",
    "presetLow": "Düşük",
    "presetMid": "Orta",
    "presetHigh": "Yüksek",
    "indent2": "2 boşluk",
    "indent4": "4 boşluk",
    "optCompact": "Sıkıştır",
    "optStringArray": "Dizi dizgesi",
    "optControl": "Akışı düzleştir",
    "optDead": "Ölü kod",
    "optSplit": "Dizgileri böl",
    "optNumbers": "Sayıları ifadeye",
    "optSelf": "Kendini koru",
    "optConsole": "console kapat",
    "optUnicode": "Unicode kaçış",
    "encNone": "Dizgi kodlama yok",
    "encBase64": "Dizgi Base64",
    "encRc4": "Dizgi RC4",
    "nameHex": "Onaltılık adlar",
    "nameMangle": "Kısa adlar",
    "runObf": "Karart",
    "runDeobf": "Çöz",
    "copy": "Sonucu kopyala",
    "download": "İndir",
    "toInput": "Girdiye gönder",
    "open": "Aç",
    "sample": "Örnek",
    "clear": "Temizle",
    "inputLabel": "Girdi",
    "outputLabel": "Çıktı",
    "placeholder": "JavaScript yapıştırın…",
    "outputHint": "Sonuç bir düğmeden sonra görünür",
    "copied": "Kopyalandı",
    "msgEmpty": "Önce kod girin.",
    "msgNoOut": "Kopyalanacak veya indirilecek bir şey yok.",
    "msgLib": "CDN kitaplıkları yüklenemedi. Ağı kontrol edin.",
    "msgFail": "Başarısız. Girdinin geçerli JavaScript olduğundan emin olun."
  },
  "vi": {
    "title_page": "Làm rối / gỡ rối mã",
    "desc": "Làm rối hoặc khôi phục JavaScript trong trình duyệt. Làm rối dùng javascript-obfuscator. Gỡ rối định dạng và bỏ escape. Làm rối mạnh có thể không hoàn nguyên hết. Thư viện từ CDN, không tải lên.",
    "obfuscate": "Làm rối",
    "deobfuscate": "Gỡ rối",
    "presetLow": "Thấp",
    "presetMid": "Vừa",
    "presetHigh": "Cao",
    "indent2": "2 khoảng trắng",
    "indent4": "4 khoảng trắng",
    "optCompact": "Nén",
    "optStringArray": "Mảng chuỗi",
    "optControl": "Làm phẳng luồng",
    "optDead": "Chèn mã chết",
    "optSplit": "Tách chuỗi",
    "optNumbers": "Số thành biểu thức",
    "optSelf": "Tự bảo vệ",
    "optConsole": "Tắt console",
    "optUnicode": "Thoát Unicode",
    "encNone": "Không mã hóa chuỗi",
    "encBase64": "Chuỗi Base64",
    "encRc4": "Chuỗi RC4",
    "nameHex": "Tên hex",
    "nameMangle": "Tên ngắn",
    "runObf": "Làm rối",
    "runDeobf": "Gỡ rối",
    "copy": "Sao chép kết quả",
    "download": "Tải xuống",
    "toInput": "Đưa về ô nhập",
    "open": "Mở tệp",
    "sample": "Mẫu",
    "clear": "Xóa",
    "inputLabel": "Nhập",
    "outputLabel": "Xuất",
    "placeholder": "Dán JavaScript…",
    "outputHint": "Kết quả hiện sau khi bấm nút",
    "copied": "Đã sao chép",
    "msgEmpty": "Hãy nhập mã trước.",
    "msgNoOut": "Chưa có gì để sao chép hoặc tải.",
    "msgLib": "Không tải được thư viện CDN. Kiểm tra mạng.",
    "msgFail": "Thất bại. Kiểm tra mã có phải JavaScript hợp lệ."
  },
  "th": {
    "title_page": "ทำให้โค้ดสับสน / ถอดรหัส",
    "desc": "ทำให้ JavaScript สับสนหรืออ่านง่ายในเบราว์เซอร์ ใช้ javascript-obfuscator ด้านสับสน ด้านถอดจะจัดรูปแบบและแก้ escape การสับสนสูงอาจถอดไม่ครบ ไลบรารีจาก CDN ไม่ได้อัปโหลด",
    "obfuscate": "ทำให้สับสน",
    "deobfuscate": "ถอดรหัส",
    "presetLow": "ต่ำ",
    "presetMid": "กลาง",
    "presetHigh": "สูง",
    "indent2": "เว้น 2",
    "indent4": "เว้น 4",
    "optCompact": "บีบอัด",
    "optStringArray": "อาร์เรย์สตริง",
    "optControl": "ทำให้กระแสเรียบ",
    "optDead": "แทรกโค้ดตาย",
    "optSplit": "แยกสตริง",
    "optNumbers": "ตัวเลขเป็นนิพจน์",
    "optSelf": "ป้องกันตนเอง",
    "optConsole": "ปิด console",
    "optUnicode": "หลีกยูนิโค้ด",
    "encNone": "ไม่เข้ารหัสสตริง",
    "encBase64": "สตริง Base64",
    "encRc4": "สตริง RC4",
    "nameHex": "ชื่อฐานสิบหก",
    "nameMangle": "ชื่อสั้น",
    "runObf": "ทำให้สับสน",
    "runDeobf": "ถอดรหัส",
    "copy": "คัดลอกผลลัพธ์",
    "download": "ดาวน์โหลด",
    "toInput": "ส่งกลับช่องใส่",
    "open": "เปิดไฟล์",
    "sample": "ตัวอย่าง",
    "clear": "ล้าง",
    "inputLabel": "อินพุต",
    "outputLabel": "เอาต์พุต",
    "placeholder": "วาง JavaScript…",
    "outputHint": "ผลลัพธ์จะโชว์หลังกดปุ่ม",
    "copied": "คัดลอกแล้ว",
    "msgEmpty": "ใส่โค้ดก่อน",
    "msgNoOut": "ยังไม่มีอะไรให้คัดลอกหรือดาวน์โหลด",
    "msgLib": "โหลดไลบรารี CDN ไม่ได้ ตรวจเครือข่าย",
    "msgFail": "ล้มเหลว ตรวจว่าเป็น JavaScript ที่ถูกต้อง"
  },
  "id": {
    "title_page": "Obfuskasi / deobfuskasi kode",
    "desc": "Obfuskasi atau pulihkan JavaScript di browser. Obfuskasi memakai javascript-obfuscator. Deobfuskasi merapikan dan membuka escape. Obfuskasi kuat mungkin tidak sepenuhnya balik. Pustaka dari CDN, tidak diunggah.",
    "obfuscate": "Obfuskasi",
    "deobfuscate": "Deobfuskasi",
    "presetLow": "Rendah",
    "presetMid": "Sedang",
    "presetHigh": "Tinggi",
    "indent2": "2 spasi",
    "indent4": "4 spasi",
    "optCompact": "Ringkas",
    "optStringArray": "Array string",
    "optControl": "Ratakan alur",
    "optDead": "Kode mati",
    "optSplit": "Pecah string",
    "optNumbers": "Angka jadi ekspresi",
    "optSelf": "Lindungi diri",
    "optConsole": "Matikan console",
    "optUnicode": "Escape Unicode",
    "encNone": "Tanpa encoding string",
    "encBase64": "String Base64",
    "encRc4": "String RC4",
    "nameHex": "Nama heksadesimal",
    "nameMangle": "Nama pendek",
    "runObf": "Obfuskasi",
    "runDeobf": "Deobfuskasi",
    "copy": "Salin hasil",
    "download": "Unduh",
    "toInput": "Kirim ke input",
    "open": "Buka",
    "sample": "Contoh",
    "clear": "Hapus",
    "inputLabel": "Masukan",
    "outputLabel": "Keluaran",
    "placeholder": "Tempel JavaScript…",
    "outputHint": "Hasil muncul setelah tombol",
    "copied": "Disalin",
    "msgEmpty": "Masukkan kode dulu.",
    "msgNoOut": "Belum ada yang bisa disalin atau diunduh.",
    "msgLib": "Gagal memuat pustaka CDN. Periksa jaringan.",
    "msgFail": "Gagal. Pastikan masukannya JavaScript valid."
  },
  "ms": {
    "title_page": "Kaburkan / nyahkabur kod",
    "desc": "Kaburkan atau pulihkan JavaScript dalam pelayar. Kabur menggunakan javascript-obfuscator. Nyahkabur merapikan dan membuka escape. Kabur kuat mungkin tidak sepenuhnya terbalik. Pustaka dari CDN, tiada dimuat naik.",
    "obfuscate": "Kaburkan",
    "deobfuscate": "Nyahkabur",
    "presetLow": "Rendah",
    "presetMid": "Sederhana",
    "presetHigh": "Tinggi",
    "indent2": "2 ruang",
    "indent4": "4 ruang",
    "optCompact": "Padat",
    "optStringArray": "Tatasusunan rentetan",
    "optControl": "Ratakan aliran",
    "optDead": "Kod mati",
    "optSplit": "Pisah rentetan",
    "optNumbers": "Nombor jadi ungkapan",
    "optSelf": "Lindung diri",
    "optConsole": "Tutup console",
    "optUnicode": "Escape Unicode",
    "encNone": "Tiada pengekodan rentetan",
    "encBase64": "Rentetan Base64",
    "encRc4": "Rentetan RC4",
    "nameHex": "Nama heks",
    "nameMangle": "Nama pendek",
    "runObf": "Kaburkan",
    "runDeobf": "Nyahkabur",
    "copy": "Salin hasil",
    "download": "Muat turun",
    "toInput": "Hantar ke input",
    "open": "Buka",
    "sample": "Contoh",
    "clear": "Kosongkan",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Tampal JavaScript…",
    "outputHint": "Hasil muncul selepas butang",
    "copied": "Disalin",
    "msgEmpty": "Masukkan kod dahulu.",
    "msgNoOut": "Belum ada yang boleh disalin atau dimuat turun.",
    "msgLib": "Tidak dapat memuatkan pustaka CDN. Semak rangkaian.",
    "msgFail": "Gagal. Pastikan input ialah JavaScript sah."
  },
  "pl": {
    "title_page": "Zaciemnianie / odzaciemnianie kodu",
    "desc": "Zaciemnij lub przywróć JavaScript w przeglądarce. Zaciemnianie używa javascript-obfuscator. Odzaciemnianie formatuje i zdejmuje escape. Silne zaciemnienie może być nieodwracalne. Biblioteki z CDN, nic nie jest wysyłane.",
    "obfuscate": "Zaciemnij",
    "deobfuscate": "Odzaciemnij",
    "presetLow": "Niski",
    "presetMid": "Średni",
    "presetHigh": "Wysoki",
    "indent2": "2 spacje",
    "indent4": "4 spacje",
    "optCompact": "Kompaktowy",
    "optStringArray": "Tablica napisów",
    "optControl": "Spłaszczanie przepływu",
    "optDead": "Martwy kod",
    "optSplit": "Dziel napisy",
    "optNumbers": "Liczby na wyrażenia",
    "optSelf": "Samoobrona",
    "optConsole": "Wyłącz console",
    "optUnicode": "Escape Unicode",
    "encNone": "Bez kodowania napisów",
    "encBase64": "Napisy Base64",
    "encRc4": "Napisy RC4",
    "nameHex": "Nazwy szesnastkowe",
    "nameMangle": "Krótkie nazwy",
    "runObf": "Zaciemnij",
    "runDeobf": "Odzaciemnij",
    "copy": "Kopiuj wynik",
    "download": "Pobierz",
    "toInput": "Wyślij do wejścia",
    "open": "Otwórz",
    "sample": "Przykład",
    "clear": "Wyczyść",
    "inputLabel": "Wejście",
    "outputLabel": "Wyjście",
    "placeholder": "Wklej JavaScript…",
    "outputHint": "Wynik pojawi się po przycisku",
    "copied": "Skopiowano",
    "msgEmpty": "Najpierw wpisz kod.",
    "msgNoOut": "Nie ma jeszcze nic do skopiowania ani pobrania.",
    "msgLib": "Nie udało się wczytać bibliotek CDN. Sprawdź sieć.",
    "msgFail": "Błąd. Sprawdź, czy to poprawny JavaScript."
  },
  "uk": {
    "title_page": "Обфускація / деобфускація",
    "desc": "Обфускуйте або відновіть JavaScript у браузері. Обфускація — javascript-obfuscator. Деобфускація форматує й знімає екранування. Сильну обфускацію не завжди можна повністю обернути. Бібліотеки з CDN, нічого не надсилається.",
    "obfuscate": "Обфускація",
    "deobfuscate": "Деобфускація",
    "presetLow": "Низька",
    "presetMid": "Середня",
    "presetHigh": "Висока",
    "indent2": "2 пробіли",
    "indent4": "4 пробіли",
    "optCompact": "Стиснути",
    "optStringArray": "Масив рядків",
    "optControl": "Вирівнювання потоку",
    "optDead": "Мертвий код",
    "optSplit": "Дробити рядки",
    "optNumbers": "Числа в вирази",
    "optSelf": "Самозахист",
    "optConsole": "Вимкнути console",
    "optUnicode": "Unicode-екранування",
    "encNone": "Без кодування рядків",
    "encBase64": "Рядки Base64",
    "encRc4": "Рядки RC4",
    "nameHex": "Шістнадцяткові імена",
    "nameMangle": "Короткі імена",
    "runObf": "Обфускувати",
    "runDeobf": "Деобфускувати",
    "copy": "Копіювати результат",
    "download": "Завантажити",
    "toInput": "У поле вводу",
    "open": "Відкрити",
    "sample": "Приклад",
    "clear": "Очистити",
    "inputLabel": "Ввід",
    "outputLabel": "Вивід",
    "placeholder": "Вставте JavaScript…",
    "outputHint": "Результат з’явиться після кнопки",
    "copied": "Скопійовано",
    "msgEmpty": "Спочатку введіть код.",
    "msgNoOut": "Поки немає що копіювати чи завантажити.",
    "msgLib": "Не вдалося завантажити бібліотеки з CDN. Перевірте мережу.",
    "msgFail": "Помилка. Перевірте, що це коректний JavaScript."
  },
  "sv": {
    "title_page": "Fördunkla / avfördunkla kod",
    "desc": "Fördunkla eller återställ JavaScript i webbläsaren. Fördunkling använder javascript-obfuscator. Avfördunkling formaterar och tar bort escape. Stark fördunkling går ofta inte att vända helt. Bibliotek via CDN, inget laddas upp.",
    "obfuscate": "Fördunkla",
    "deobfuscate": "Avfördunkla",
    "presetLow": "Låg",
    "presetMid": "Medel",
    "presetHigh": "Hög",
    "indent2": "2 mellanslag",
    "indent4": "4 mellanslag",
    "optCompact": "Kompakt",
    "optStringArray": "Strängarray",
    "optControl": "Platta ut flödet",
    "optDead": "Död kod",
    "optSplit": "Dela strängar",
    "optNumbers": "Tal till uttryck",
    "optSelf": "Självförsvar",
    "optConsole": "Stäng av console",
    "optUnicode": "Unicode-escape",
    "encNone": "Ingen strängkodning",
    "encBase64": "Strängar Base64",
    "encRc4": "Strängar RC4",
    "nameHex": "Hex-namn",
    "nameMangle": "Korta namn",
    "runObf": "Fördunkla",
    "runDeobf": "Avfördunkla",
    "copy": "Kopiera resultat",
    "download": "Ladda ner",
    "toInput": "Skicka till inmatning",
    "open": "Öppna",
    "sample": "Exempel",
    "clear": "Rensa",
    "inputLabel": "Inmatning",
    "outputLabel": "Utdata",
    "placeholder": "Klistra in JavaScript…",
    "outputHint": "Resultatet syns efter en knapp",
    "copied": "Kopierat",
    "msgEmpty": "Skriv kod först.",
    "msgNoOut": "Inget att kopiera eller ladda ner ännu.",
    "msgLib": "Kunde inte ladda CDN-bibliotek. Kontrollera nätverket.",
    "msgFail": "Misslyckades. Kontrollera att indata är giltig JavaScript."
  },
  "zh-TW": {
    "title_page": "程式碼混淆 / 反混淆",
    "desc": "在瀏覽器混淆或還原 JavaScript。混淆使用 javascript-obfuscator，反混淆會美化並還原跳脫字串。高強度混淆無法保證完全還原。庫從 CDN 載入，資料不會上傳。",
    "obfuscate": "混淆",
    "deobfuscate": "反混淆",
    "presetLow": "低",
    "presetMid": "中",
    "presetHigh": "高",
    "indent2": "2 空格",
    "indent4": "4 空格",
    "optCompact": "壓縮",
    "optStringArray": "字串陣列",
    "optControl": "控制流平坦化",
    "optDead": "注入死程式碼",
    "optSplit": "拆分字串",
    "optNumbers": "數字轉運算式",
    "optSelf": "自我保護",
    "optConsole": "停用 console",
    "optUnicode": "Unicode 跳脫",
    "encNone": "字串不編碼",
    "encBase64": "字串 Base64",
    "encRc4": "字串 RC4",
    "nameHex": "十六進位變數名",
    "nameMangle": "短變數名",
    "runObf": "開始混淆",
    "runDeobf": "開始反混淆",
    "copy": "複製結果",
    "download": "下載",
    "toInput": "結果回填",
    "open": "開啟檔案",
    "sample": "範例",
    "clear": "清空",
    "inputLabel": "輸入",
    "outputLabel": "輸出",
    "placeholder": "貼上 JavaScript…",
    "outputHint": "點上方按鈕後顯示結果",
    "copied": "已複製",
    "msgEmpty": "請先輸入程式碼。",
    "msgNoOut": "還沒有可複製或下載的結果。",
    "msgLib": "無法從 CDN 載入所需庫，請檢查網路後重試。",
    "msgFail": "處理失敗，請檢查是否為合法 JavaScript。"
  }
}
</i18n>
