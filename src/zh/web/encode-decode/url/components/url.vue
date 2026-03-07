<template>
  <div class="url-wrap">
    <div class="url-notice">
      <div class="url-notice-title">{{ noticeTitle }}</div>
      <div class="url-notice-desc">{{ noticeDesc }}</div>
    </div>

    <template v-if="inputType === 'query' && operation === 'build'">
      <div class="url-builder">
        <div
          v-for="(row, index) in queryRows"
          :key="index"
          class="url-builder-row"
        >
          <el-input
            v-model="row.key"
            class="url-builder-input"
            :placeholder="t('keyPlaceholder')"
          />
          <el-input
            v-model="row.value"
            class="url-builder-input"
            :placeholder="t('valuePlaceholder')"
          />
          <el-button
            bg
            text
            size="large"
            @click="removeRow(index)"
          >
            {{ t("remove") }}
          </el-button>
        </div>
      </div>

      <div class="url-actions">
        <el-button
          bg
          text
          size="large"
          @click="addRow"
        >
          {{ t("addRow") }}
        </el-button>
        <el-button
          bg
          text
          size="large"
          :disabled="!hasBuilderContent"
          @click="buildQuery"
        >
          {{ t("build") }}
        </el-button>
        <el-button
          bg
          text
          size="large"
          @click="clearAll"
        >
          {{ t("clear") }}
        </el-button>
        <el-button
          bg
          text
          size="large"
          :disabled="!result"
          @click="copyResult"
        >
          {{ t("copyResult") }}
        </el-button>
      </div>

      <el-input
        v-model="result"
        type="textarea"
        :rows="6"
        :placeholder="resultPlaceholder"
        readonly
      />
    </template>

    <template v-else-if="inputType === 'query' && operation === 'parse'">
      <el-input
        v-model="text"
        type="textarea"
        :rows="6"
        :placeholder="inputPlaceholder"
      />

      <div class="url-actions">
        <el-button
          bg
          text
          size="large"
          :disabled="!text.trim()"
          @click="parseQuery"
        >
          {{ t("parse") }}
        </el-button>
        <el-button
          bg
          text
          size="large"
          @click="clearAll"
        >
          {{ t("clear") }}
        </el-button>
        <el-button
          bg
          text
          size="large"
          :disabled="!result"
          @click="copyResult"
        >
          {{ t("copyResult") }}
        </el-button>
      </div>

      <div
        v-if="parsedRows.length"
        class="url-parsed"
      >
        <div class="url-parsed-title">
          {{ t("parsedResult") }} ({{ parsedRows.length }})
        </div>
        <div class="url-table">
          <div class="url-table-row url-table-head">
            <div>{{ t("keyLabel") }}</div>
            <div>{{ t("valueLabel") }}</div>
          </div>
          <div
            v-for="(row, index) in parsedRows"
            :key="`${row.key}-${index}`"
            class="url-table-row"
          >
            <div>{{ row.key }}</div>
            <div>{{ row.value }}</div>
          </div>
        </div>
      </div>

      <el-input
        v-model="result"
        type="textarea"
        :rows="8"
        :placeholder="resultPlaceholder"
        readonly
      />
    </template>

    <template v-else>
      <el-input
        v-model="text"
        type="textarea"
        :rows="8"
        :placeholder="inputPlaceholder"
      />

      <div class="url-actions">
        <el-button
          bg
          text
          size="large"
          :disabled="!text.trim()"
          @click="handleTransform"
        >
          {{ actionLabel }}
        </el-button>
        <el-button
          bg
          text
          size="large"
          @click="clearAll"
        >
          {{ t("clear") }}
        </el-button>
        <el-button
          bg
          text
          size="large"
          :disabled="!result"
          @click="copyResult"
        >
          {{ t("copyResult") }}
        </el-button>
      </div>

      <el-input
        v-model="result"
        type="textarea"
        :rows="8"
        :placeholder="resultPlaceholder"
        readonly
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { ElMessage } from "element-plus"
import { useI18n } from "vue-i18n"
import { copyToClipboard } from "@/utils"

type InputType = "component" | "query"
type Operation = "encode" | "decode" | "parse" | "build"
type QueryRow = { key: string; value: string }

const props = defineProps<{
  inputType: InputType
  operation: Operation
}>()

const { t } = useI18n({ useScope: "local" })

const text = ref("")
const result = ref("")
const parsedRows = ref<QueryRow[]>([])
const queryRows = ref<QueryRow[]>(createDefaultRows())

function createDefaultRows(): QueryRow[] {
  return [
    { key: "", value: "" },
    { key: "", value: "" },
  ]
}

const noticeTitle = computed(() => {
  if (props.inputType === "component") return t("componentModeTitle")
  if (props.operation === "parse") return t("queryParseTitle")
  return t("queryBuildTitle")
})

const noticeDesc = computed(() => {
  if (props.inputType === "component") return t("componentModeDesc")
  if (props.operation === "parse") return t("queryParseDesc")
  return t("queryBuildDesc")
})

const inputPlaceholder = computed(() => {
  if (props.inputType === "component" && props.operation === "encode") {
    return t("componentEncodePlaceholder")
  }
  if (props.inputType === "component" && props.operation === "decode") {
    return t("componentDecodePlaceholder")
  }
  return t("queryParsePlaceholder")
})

const resultPlaceholder = computed(() => {
  if (props.inputType === "query" && props.operation === "build") {
    return t("queryBuildResultPlaceholder")
  }
  return t("resultPlaceholder")
})

const actionLabel = computed(() => {
  if (props.operation === "encode") return t("encode")
  if (props.operation === "decode") return t("decode")
  if (props.operation === "parse") return t("parse")
  return t("build")
})

const hasBuilderContent = computed(() =>
  queryRows.value.some(row => row.key.trim() || row.value.trim())
)

function clearAll() {
  text.value = ""
  result.value = ""
  parsedRows.value = []
  queryRows.value = createDefaultRows()
}

async function copyResult() {
  if (!result.value) return
  await copyToClipboard(result.value)
  ElMessage.success(t("copySuccess"))
}

async function handleTransform() {
  try {
    const value = text.value.trim()
    if (!value) return

    result.value =
      props.operation === "encode"
        ? encodeURIComponent(value)
        : decodeURIComponent(value)

    await copyToClipboard(result.value)
    ElMessage.success(t("copySuccess"))
  } catch {
    result.value = t("errorMsg")
  }
}

function hasQueryStructure(value: string) {
  return /(^[a-z][a-z\d+.-]*:\/\/)|([?#])|(^[^=&?#]+\s*=)/i.test(value)
}

function extractQuerySegments(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return [] as Array<{ prefix: string; rawQuery: string }>

  const segments: Array<{ prefix: string; rawQuery: string }> = []
  const hashIndex = trimmed.indexOf("#")
  const beforeHash = hashIndex >= 0 ? trimmed.slice(0, hashIndex) : trimmed
  const hashPart = hashIndex >= 0 ? trimmed.slice(hashIndex + 1) : ""

  if (beforeHash.includes("?")) {
    const queryPart = beforeHash.slice(beforeHash.indexOf("?") + 1)
    if (queryPart) {
      segments.push({ prefix: "", rawQuery: queryPart })
    }
  } else if (
    !beforeHash.includes("://") &&
    !beforeHash.startsWith("/") &&
    beforeHash.includes("=")
  ) {
    segments.push({ prefix: "", rawQuery: beforeHash.replace(/^\?/, "") })
  }

  if (hashPart) {
    if (hashPart.includes("?")) {
      const hashQuery = hashPart.slice(hashPart.indexOf("?") + 1)
      if (hashQuery) {
        segments.push({ prefix: "hash.", rawQuery: hashQuery })
      }
    } else if (hashPart.startsWith("&")) {
      segments.push({ prefix: "hash.", rawQuery: hashPart.slice(1) })
    }
  }

  return segments
}

function appendParsedRows(
  value: string,
  rows: QueryRow[],
  parentKey = "",
  depth = 0
) {
  if (depth > 3) return

  const segments = extractQuerySegments(value)
  segments.forEach(({ prefix, rawQuery }) => {
    const params = new URLSearchParams(rawQuery)

    Array.from(params.entries()).forEach(([key, paramValue]) => {
      const scopedKey = `${parentKey}${prefix}${key}`
      rows.push({
        key: scopedKey,
        value: paramValue,
      })

      if (hasQueryStructure(paramValue)) {
        appendParsedRows(paramValue, rows, `${scopedKey}.`, depth + 1)
      }
    })
  })
}

function parseQuery() {
  try {
    const input = text.value.trim()
    const rows: QueryRow[] = []

    if (!input) {
      parsedRows.value = []
      result.value = ""
      return
    }

    appendParsedRows(input, rows)

    parsedRows.value = rows
    result.value = JSON.stringify(rows, null, 2)
  } catch {
    parsedRows.value = []
    result.value = t("errorMsg")
  }
}

function addRow() {
  queryRows.value.push({ key: "", value: "" })
}

function removeRow(index: number) {
  queryRows.value.splice(index, 1)
  if (queryRows.value.length === 0) {
    queryRows.value = createDefaultRows()
  }
}

async function buildQuery() {
  try {
    const params = new URLSearchParams()

    queryRows.value.forEach(row => {
      if (!row.key.trim() && !row.value.trim()) return
      params.append(row.key.trim(), row.value)
    })

    result.value = params.toString()
    await copyToClipboard(result.value)
    ElMessage.success(t("copySuccess"))
  } catch {
    result.value = t("errorMsg")
  }
}
</script>

<style lang="scss" scoped>
.url-wrap {
  margin-top: 16px;
}

.url-notice {
  margin-bottom: 16px;
  padding: 14px 16px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background: var(--el-fill-color-light);
}

.url-notice-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.url-notice-desc {
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--el-text-color-regular);
}

.url-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.url-builder {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.url-builder-row {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(220px, 1fr) auto;
  gap: 12px;
}

.url-builder-input {
  width: 100%;
}

.url-parsed {
  margin: 0 0 16px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  overflow: hidden;
}

.url-parsed-title {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid var(--el-border-color-light);
  background: var(--el-fill-color-lighter);
}

.url-table {
  display: grid;
}

.url-table-row {
  display: grid;
  grid-template-columns: 220px 1fr;
}

.url-table-row > div {
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-light);
  word-break: break-all;
}

.url-table-row > div:first-child {
  border-right: 1px solid var(--el-border-color-light);
}

.url-table-row:last-child > div {
  border-bottom: none;
}

.url-table-head {
  font-weight: 600;
  background: var(--el-fill-color-lighter);
}

@media (max-width: 768px) {
  .url-builder-row {
    grid-template-columns: 1fr;
  }

  .url-table-row {
    grid-template-columns: 1fr;
  }

  .url-table-row > div:first-child {
    border-right: none;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  .url-table-head {
    display: none;
  }
}
</style>

<i18n lang="json">
{
  "zh-CN": {
    "textModeTitle": "整条 URL 编解码",
    "componentModeTitle": "URL 组件编解码",
    "queryParseTitle": "Query 参数解析",
    "queryBuildTitle": "Query 参数生成",
    "textModeDesc": "适合整条 URL、完整链接或包含协议、路径、查询参数、hash 的字符串。这里使用 encodeURI / decodeURI，会保留 : / ? & = # 等结构字符。",
    "componentModeDesc": "适合单个参数值、路径片段或 hash 内容。这里使用 encodeURIComponent / decodeURIComponent，会把 / ? & = # 等保留字符一起编码。",
    "queryParseDesc": "支持输入完整 URL 或原始查询字符串，例如 a=1&b=2。解析结果会自动按键值对展示，并输出 JSON 结果方便复制。",
    "queryBuildDesc": "输入键值对后生成查询字符串。支持重复参数，生成时会自动对参数值做组件级编码，适合拼接分享链接和接口调试。",
    "textEncodePlaceholder": "例如：https://example.com/你好?q=测试 value#片段",
    "textDecodePlaceholder": "例如：https://example.com/%E4%BD%A0%E5%A5%BD?q=%E6%B5%8B%E8%AF%95%20value#%E7%89%87%E6%AE%B5",
    "componentEncodePlaceholder": "例如：你好 world / 测试?name=张三&from=首页",
    "componentDecodePlaceholder": "例如：%E4%BD%A0%E5%A5%BD%20world%20%2F%20%E6%B5%8B%E8%AF%95%3Fname%3D%E5%BC%A0%E4%B8%89%26from%3D%E9%A6%96%E9%A1%B5",
    "queryParsePlaceholder": "例如：https://example.com/search?q=hello%20world&lang=zh-CN 或 q=hello%20world&lang=zh-CN",
    "resultPlaceholder": "结果将显示在这里",
    "queryBuildResultPlaceholder": "生成的查询字符串会显示在这里，例如：q=hello+world&lang=zh-CN",
    "encode": "编码",
    "decode": "解码",
    "parse": "解析",
    "build": "生成",
    "clear": "清空",
    "copyResult": "复制结果",
    "copySuccess": "复制成功",
    "addRow": "添加一行",
    "remove": "删除",
    "keyPlaceholder": "参数名",
    "valuePlaceholder": "参数值",
    "parsedResult": "解析结果",
    "keyLabel": "键",
    "valueLabel": "值",
    "errorMsg": "出错了，请检查输入内容"
  },
  "en": {
    "textModeTitle": "Full URL Encode / Decode",
    "componentModeTitle": "URL Component Encode / Decode",
    "queryParseTitle": "Query Parser",
    "queryBuildTitle": "Query Builder",
    "textModeDesc": "Use this for a full URL or strings that contain protocol, path, query, and hash. It uses encodeURI / decodeURI and keeps structure characters like : / ? & = # intact.",
    "componentModeDesc": "Use this for a single parameter value, path segment, or hash fragment. It uses encodeURIComponent / decodeURIComponent and also encodes reserved characters like / ? & = #.",
    "queryParseDesc": "Paste a full URL or a raw query string like a=1&b=2. The tool splits it into key-value pairs and outputs JSON for quick copy.",
    "queryBuildDesc": "Build a query string from key-value pairs. Duplicate keys are supported, and values are encoded at the component level automatically.",
    "textEncodePlaceholder": "Example: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "Example: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "Example: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "Example: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "Example: https://example.com/search?q=hello%20world&lang=en or q=hello%20world&lang=en",
    "resultPlaceholder": "The result will appear here",
    "queryBuildResultPlaceholder": "Generated query string will appear here, e.g. q=hello+world&lang=en",
    "encode": "Encode",
    "decode": "Decode",
    "parse": "Parse",
    "build": "Build",
    "clear": "Clear",
    "copyResult": "Copy Result",
    "copySuccess": "Copied!",
    "addRow": "Add Row",
    "remove": "Remove",
    "keyPlaceholder": "Key",
    "valuePlaceholder": "Value",
    "parsedResult": "Parsed Result",
    "keyLabel": "Key",
    "valueLabel": "Value",
    "errorMsg": "Something went wrong. Please check your input."
  },
  "zh-TW": {
    "textModeTitle": "整條 URL 編解碼",
    "componentModeTitle": "URL 元件編解碼",
    "queryParseTitle": "Query 參數解析",
    "queryBuildTitle": "Query 參數產生",
    "textModeDesc": "適合整條 URL、完整連結或包含協定、路徑、查詢參數、hash 的字串。這裡使用 encodeURI / decodeURI，會保留 : / ? & = # 等結構字元。",
    "componentModeDesc": "適合單個參數值、路徑片段或 hash 內容。這裡使用 encodeURIComponent / decodeURIComponent，會把 / ? & = # 等保留字元一起編碼。",
    "queryParseDesc": "支援輸入完整 URL 或原始查詢字串，例如 a=1&b=2。解析結果會自動按鍵值對顯示，並輸出 JSON 方便複製。",
    "queryBuildDesc": "輸入鍵值對後產生查詢字串。支援重複參數，產生時會自動對參數值做元件級編碼。",
    "textEncodePlaceholder": "例如：https://example.com/你好?q=測試 value#片段",
    "textDecodePlaceholder": "例如：https://example.com/%E4%BD%A0%E5%A5%BD?q=%E6%B8%AC%E8%A9%A6%20value#%E7%89%87%E6%AE%B5",
    "componentEncodePlaceholder": "例如：你好 world / 測試?name=張三&from=首頁",
    "componentDecodePlaceholder": "例如：%E4%BD%A0%E5%A5%BD%20world%20%2F%20%E6%B8%AC%E8%A9%A6%3Fname%3D%E5%BC%B5%E4%B8%89%26from%3D%E9%A6%96%E9%A0%81",
    "queryParsePlaceholder": "例如：https://example.com/search?q=hello%20world&lang=zh-TW 或 q=hello%20world&lang=zh-TW",
    "resultPlaceholder": "結果將顯示在這裡",
    "queryBuildResultPlaceholder": "產生的查詢字串會顯示在這裡，例如：q=hello+world&lang=zh-TW",
    "encode": "編碼",
    "decode": "解碼",
    "parse": "解析",
    "build": "產生",
    "clear": "清空",
    "copyResult": "複製結果",
    "copySuccess": "複製成功",
    "addRow": "新增一列",
    "remove": "刪除",
    "keyPlaceholder": "參數名",
    "valuePlaceholder": "參數值",
    "parsedResult": "解析結果",
    "keyLabel": "鍵",
    "valueLabel": "值",
    "errorMsg": "出錯了，請檢查輸入內容"
  },
  "ja": {
    "textModeTitle": "完全な URL のエンコード / デコード",
    "componentModeTitle": "URL コンポーネントのエンコード / デコード",
    "queryParseTitle": "Query パーサー",
    "queryBuildTitle": "Query ビルダー",
    "textModeDesc": "プロトコル、パス、query、hash を含む完全な URL 向けです。encodeURI / decodeURI を使用し、: / ? & = # などの構造文字を保持します。",
    "componentModeDesc": "単一のパラメータ値、パスセグメント、hash フラグメント向けです。encodeURIComponent / decodeURIComponent を使用し、/ ? & = # もエンコードします。",
    "queryParseDesc": "完全な URL または a=1&b=2 のような raw query を入力できます。キーと値に分割し、JSON も出力します。",
    "queryBuildDesc": "キーと値のペアから query string を生成します。重複キーに対応し、値は自動でエンコードされます。",
    "textEncodePlaceholder": "例: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "例: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "例: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "例: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "例: https://example.com/search?q=hello%20world&lang=ja または q=hello%20world&lang=ja",
    "resultPlaceholder": "結果がここに表示されます",
    "queryBuildResultPlaceholder": "生成された query string がここに表示されます",
    "encode": "エンコード",
    "decode": "デコード",
    "parse": "解析",
    "build": "生成",
    "clear": "クリア",
    "copyResult": "結果をコピー",
    "copySuccess": "コピーしました",
    "addRow": "行を追加",
    "remove": "削除",
    "keyPlaceholder": "キー",
    "valuePlaceholder": "値",
    "parsedResult": "解析結果",
    "keyLabel": "キー",
    "valueLabel": "値",
    "errorMsg": "入力内容を確認してください"
  },
  "ko": {
    "textModeTitle": "전체 URL 인코딩 / 디코딩",
    "componentModeTitle": "URL 구성 요소 인코딩 / 디코딩",
    "queryParseTitle": "Query 파서",
    "queryBuildTitle": "Query 빌더",
    "textModeDesc": "프로토콜, 경로, query, hash를 포함한 전체 URL에 적합합니다. encodeURI / decodeURI를 사용하며 : / ? & = # 같은 구조 문자를 유지합니다.",
    "componentModeDesc": "단일 파라미터 값, 경로 세그먼트, hash 조각에 적합합니다. encodeURIComponent / decodeURIComponent를 사용하며 / ? & = #도 함께 인코딩합니다.",
    "queryParseDesc": "전체 URL 또는 a=1&b=2 같은 raw query를 입력할 수 있습니다. 키-값 쌍으로 분리하고 JSON도 출력합니다.",
    "queryBuildDesc": "키-값 쌍으로 query string을 생성합니다. 중복 키를 지원하며 값은 자동으로 인코딩됩니다.",
    "textEncodePlaceholder": "예: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "예: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "예: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "예: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "예: https://example.com/search?q=hello%20world&lang=ko 또는 q=hello%20world&lang=ko",
    "resultPlaceholder": "결과가 여기에 표시됩니다",
    "queryBuildResultPlaceholder": "생성된 query string이 여기에 표시됩니다",
    "encode": "인코딩",
    "decode": "디코딩",
    "parse": "분석",
    "build": "생성",
    "clear": "지우기",
    "copyResult": "결과 복사",
    "copySuccess": "복사 완료",
    "addRow": "행 추가",
    "remove": "삭제",
    "keyPlaceholder": "키",
    "valuePlaceholder": "값",
    "parsedResult": "분석 결과",
    "keyLabel": "키",
    "valueLabel": "값",
    "errorMsg": "입력 내용을 확인하세요"
  },
  "fr": {
    "textModeTitle": "Encodage / décodage d’URL complète",
    "componentModeTitle": "Encodage / décodage de composant URL",
    "queryParseTitle": "Analyseur Query",
    "queryBuildTitle": "Générateur Query",
    "textModeDesc": "À utiliser pour une URL complète avec protocole, chemin, query et hash. Utilise encodeURI / decodeURI et conserve les caractères de structure comme : / ? & = #.",
    "componentModeDesc": "À utiliser pour une seule valeur de paramètre, un segment de chemin ou un fragment hash. Utilise encodeURIComponent / decodeURIComponent et encode aussi / ? & = #.",
    "queryParseDesc": "Collez une URL complète ou une query brute comme a=1&b=2. L’outil la découpe en paires clé-valeur et génère aussi du JSON.",
    "queryBuildDesc": "Générez une query string à partir de paires clé-valeur. Les clés dupliquées sont prises en charge et les valeurs sont encodées automatiquement.",
    "textEncodePlaceholder": "Exemple : https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "Exemple : https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "Exemple : hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "Exemple : hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "Exemple : https://example.com/search?q=hello%20world&lang=fr ou q=hello%20world&lang=fr",
    "resultPlaceholder": "Le résultat s’affichera ici",
    "queryBuildResultPlaceholder": "La query string générée s’affichera ici",
    "encode": "Encoder",
    "decode": "Décoder",
    "parse": "Analyser",
    "build": "Générer",
    "clear": "Effacer",
    "copyResult": "Copier le résultat",
    "copySuccess": "Copié !",
    "addRow": "Ajouter une ligne",
    "remove": "Supprimer",
    "keyPlaceholder": "Clé",
    "valuePlaceholder": "Valeur",
    "parsedResult": "Résultat analysé",
    "keyLabel": "Clé",
    "valueLabel": "Valeur",
    "errorMsg": "Veuillez vérifier votre saisie"
  },
  "de": {
    "textModeTitle": "Vollständige URL kodieren / dekodieren",
    "componentModeTitle": "URL-Komponente kodieren / dekodieren",
    "queryParseTitle": "Query Parser",
    "queryBuildTitle": "Query Builder",
    "textModeDesc": "Für vollständige URLs mit Protokoll, Pfad, Query und Hash. Verwendet encodeURI / decodeURI und behält Strukturzeichen wie : / ? & = # bei.",
    "componentModeDesc": "Für einzelne Parameterwerte, Pfadsegmente oder Hash-Fragmente. Verwendet encodeURIComponent / decodeURIComponent und kodiert auch / ? & = #.",
    "queryParseDesc": "Fügen Sie eine vollständige URL oder eine rohe Query wie a=1&b=2 ein. Das Tool zerlegt sie in Schlüssel-Wert-Paare und erzeugt zusätzlich JSON.",
    "queryBuildDesc": "Erstellen Sie einen Query-String aus Schlüssel-Wert-Paaren. Doppelte Schlüssel werden unterstützt und Werte automatisch kodiert.",
    "textEncodePlaceholder": "Beispiel: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "Beispiel: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "Beispiel: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "Beispiel: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "Beispiel: https://example.com/search?q=hello%20world&lang=de oder q=hello%20world&lang=de",
    "resultPlaceholder": "Das Ergebnis erscheint hier",
    "queryBuildResultPlaceholder": "Der erzeugte Query-String erscheint hier",
    "encode": "Kodieren",
    "decode": "Dekodieren",
    "parse": "Parsen",
    "build": "Erstellen",
    "clear": "Leeren",
    "copyResult": "Ergebnis kopieren",
    "copySuccess": "Kopiert!",
    "addRow": "Zeile hinzufügen",
    "remove": "Entfernen",
    "keyPlaceholder": "Schlüssel",
    "valuePlaceholder": "Wert",
    "parsedResult": "Parsergebnis",
    "keyLabel": "Schlüssel",
    "valueLabel": "Wert",
    "errorMsg": "Bitte Eingabe prüfen"
  },
  "es": {
    "textModeTitle": "Codificar / decodificar URL completa",
    "componentModeTitle": "Codificar / decodificar componente URL",
    "queryParseTitle": "Analizador Query",
    "queryBuildTitle": "Generador Query",
    "textModeDesc": "Úsalo para una URL completa con protocolo, ruta, query y hash. Utiliza encodeURI / decodeURI y conserva caracteres de estructura como : / ? & = #.",
    "componentModeDesc": "Úsalo para un solo valor de parámetro, segmento de ruta o fragmento hash. Utiliza encodeURIComponent / decodeURIComponent y también codifica / ? & = #.",
    "queryParseDesc": "Pega una URL completa o una query cruda como a=1&b=2. La herramienta la divide en pares clave-valor y también genera JSON.",
    "queryBuildDesc": "Genera una query string a partir de pares clave-valor. Soporta claves duplicadas y codifica los valores automáticamente.",
    "textEncodePlaceholder": "Ejemplo: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "Ejemplo: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "Ejemplo: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "Ejemplo: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "Ejemplo: https://example.com/search?q=hello%20world&lang=es o q=hello%20world&lang=es",
    "resultPlaceholder": "El resultado aparecerá aquí",
    "queryBuildResultPlaceholder": "La query string generada aparecerá aquí",
    "encode": "Codificar",
    "decode": "Decodificar",
    "parse": "Analizar",
    "build": "Generar",
    "clear": "Limpiar",
    "copyResult": "Copiar resultado",
    "copySuccess": "¡Copiado!",
    "addRow": "Agregar fila",
    "remove": "Eliminar",
    "keyPlaceholder": "Clave",
    "valuePlaceholder": "Valor",
    "parsedResult": "Resultado analizado",
    "keyLabel": "Clave",
    "valueLabel": "Valor",
    "errorMsg": "Revise la entrada"
  },
  "pt": {
    "textModeTitle": "Codificar / decodificar URL completa",
    "componentModeTitle": "Codificar / decodificar componente de URL",
    "queryParseTitle": "Parser de Query",
    "queryBuildTitle": "Builder de Query",
    "textModeDesc": "Use para uma URL completa com protocolo, caminho, query e hash. Usa encodeURI / decodeURI e mantém caracteres estruturais como : / ? & = #.",
    "componentModeDesc": "Use para um valor de parâmetro, segmento de caminho ou fragmento hash. Usa encodeURIComponent / decodeURIComponent e também codifica / ? & = #.",
    "queryParseDesc": "Cole uma URL completa ou uma query bruta como a=1&b=2. A ferramenta divide em pares chave-valor e também gera JSON.",
    "queryBuildDesc": "Gere uma query string a partir de pares chave-valor. Chaves duplicadas são suportadas e os valores são codificados automaticamente.",
    "textEncodePlaceholder": "Exemplo: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "Exemplo: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "Exemplo: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "Exemplo: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "Exemplo: https://example.com/search?q=hello%20world&lang=pt ou q=hello%20world&lang=pt",
    "resultPlaceholder": "O resultado aparecerá aqui",
    "queryBuildResultPlaceholder": "A query string gerada aparecerá aqui",
    "encode": "Codificar",
    "decode": "Decodificar",
    "parse": "Analisar",
    "build": "Gerar",
    "clear": "Limpar",
    "copyResult": "Copiar resultado",
    "copySuccess": "Copiado!",
    "addRow": "Adicionar linha",
    "remove": "Remover",
    "keyPlaceholder": "Chave",
    "valuePlaceholder": "Valor",
    "parsedResult": "Resultado analisado",
    "keyLabel": "Chave",
    "valueLabel": "Valor",
    "errorMsg": "Verifique a entrada"
  },
  "ru": {
    "textModeTitle": "Кодирование / декодирование полного URL",
    "componentModeTitle": "Кодирование / декодирование компонента URL",
    "queryParseTitle": "Query Parser",
    "queryBuildTitle": "Query Builder",
    "textModeDesc": "Используйте для полного URL с протоколом, путём, query и hash. Применяет encodeURI / decodeURI и сохраняет структурные символы : / ? & = #.",
    "componentModeDesc": "Используйте для одного значения параметра, сегмента пути или hash-фрагмента. Применяет encodeURIComponent / decodeURIComponent и кодирует также / ? & = #.",
    "queryParseDesc": "Вставьте полный URL или сырую query вроде a=1&b=2. Инструмент разобьёт её на пары ключ-значение и выведет JSON.",
    "queryBuildDesc": "Создавайте query string из пар ключ-значение. Поддерживаются повторяющиеся ключи, значения кодируются автоматически.",
    "textEncodePlaceholder": "Пример: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "Пример: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "Пример: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "Пример: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "Пример: https://example.com/search?q=hello%20world&lang=ru или q=hello%20world&lang=ru",
    "resultPlaceholder": "Результат появится здесь",
    "queryBuildResultPlaceholder": "Сгенерированная query string появится здесь",
    "encode": "Кодировать",
    "decode": "Декодировать",
    "parse": "Разобрать",
    "build": "Создать",
    "clear": "Очистить",
    "copyResult": "Копировать результат",
    "copySuccess": "Скопировано!",
    "addRow": "Добавить строку",
    "remove": "Удалить",
    "keyPlaceholder": "Ключ",
    "valuePlaceholder": "Значение",
    "parsedResult": "Результат разбора",
    "keyLabel": "Ключ",
    "valueLabel": "Значение",
    "errorMsg": "Проверьте введённые данные"
  },
  "ar": {
    "textModeTitle": "ترميز / فك ترميز URL كامل",
    "componentModeTitle": "ترميز / فك ترميز مكوّن URL",
    "queryParseTitle": "محلل Query",
    "queryBuildTitle": "منشئ Query",
    "textModeDesc": "استخدم هذا مع الرابط الكامل الذي يحتوي على البروتوكول والمسار وquery وhash. يستعمل encodeURI / decodeURI ويحافظ على : / ? & = #.",
    "componentModeDesc": "استخدم هذا مع قيمة معلمة واحدة أو جزء من المسار أو hash fragment. يستعمل encodeURIComponent / decodeURIComponent ويشفر أيضاً / ? & = #.",
    "queryParseDesc": "ألصق رابطاً كاملاً أو query خام مثل a=1&b=2. ستتم تجزئته إلى أزواج مفتاح وقيمة مع إخراج JSON.",
    "queryBuildDesc": "أنشئ query string من أزواج المفتاح والقيمة. يدعم المفاتيح المكررة ويقوم بترميز القيم تلقائياً.",
    "textEncodePlaceholder": "مثال: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "مثال: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "مثال: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "مثال: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "مثال: https://example.com/search?q=hello%20world&lang=ar أو q=hello%20world&lang=ar",
    "resultPlaceholder": "ستظهر النتيجة هنا",
    "queryBuildResultPlaceholder": "ستظهر query string التي تم إنشاؤها هنا",
    "encode": "ترميز",
    "decode": "فك الترميز",
    "parse": "تحليل",
    "build": "إنشاء",
    "clear": "مسح",
    "copyResult": "نسخ النتيجة",
    "copySuccess": "تم النسخ!",
    "addRow": "إضافة سطر",
    "remove": "حذف",
    "keyPlaceholder": "المفتاح",
    "valuePlaceholder": "القيمة",
    "parsedResult": "نتيجة التحليل",
    "keyLabel": "المفتاح",
    "valueLabel": "القيمة",
    "errorMsg": "يرجى التحقق من الإدخال"
  },
  "hi": {
    "textModeTitle": "पूर्ण URL एन्कोड / डिकोड",
    "componentModeTitle": "URL कंपोनेंट एन्कोड / डिकोड",
    "queryParseTitle": "Query Parser",
    "queryBuildTitle": "Query Builder",
    "textModeDesc": "इसे पूरी URL के लिए उपयोग करें जिसमें protocol, path, query और hash हो। यह encodeURI / decodeURI का उपयोग करता है और : / ? & = # जैसे structure characters को बनाए रखता है।",
    "componentModeDesc": "इसे single parameter value, path segment या hash fragment के लिए उपयोग करें। यह encodeURIComponent / decodeURIComponent का उपयोग करता है और / ? & = # को भी एन्कोड करता है।",
    "queryParseDesc": "पूरी URL या a=1&b=2 जैसी raw query डालें। यह key-value pairs में बांटकर JSON भी देगा।",
    "queryBuildDesc": "key-value pairs से query string बनाएं। duplicate keys समर्थित हैं और values अपने आप encode होंगी।",
    "textEncodePlaceholder": "उदाहरण: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "उदाहरण: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "उदाहरण: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "उदाहरण: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "उदाहरण: https://example.com/search?q=hello%20world&lang=hi या q=hello%20world&lang=hi",
    "resultPlaceholder": "परिणाम यहाँ दिखाई देगा",
    "queryBuildResultPlaceholder": "बना हुआ query string यहाँ दिखाई देगा",
    "encode": "एन्कोड",
    "decode": "डीकोड",
    "parse": "पार्स",
    "build": "बनाएं",
    "clear": "साफ़ करें",
    "copyResult": "परिणाम कॉपी करें",
    "copySuccess": "कॉपी हो गया!",
    "addRow": "पंक्ति जोड़ें",
    "remove": "हटाएँ",
    "keyPlaceholder": "कुंजी",
    "valuePlaceholder": "मान",
    "parsedResult": "पार्स परिणाम",
    "keyLabel": "कुंजी",
    "valueLabel": "मान",
    "errorMsg": "इनपुट जाँचें"
  },
  "it": {
    "textModeTitle": "Codifica / decodifica URL completa",
    "componentModeTitle": "Codifica / decodifica componente URL",
    "queryParseTitle": "Parser Query",
    "queryBuildTitle": "Builder Query",
    "textModeDesc": "Usalo per un URL completo con protocollo, percorso, query e hash. Usa encodeURI / decodeURI e mantiene caratteri strutturali come : / ? & = #.",
    "componentModeDesc": "Usalo per un singolo valore di parametro, segmento di percorso o frammento hash. Usa encodeURIComponent / decodeURIComponent e codifica anche / ? & = #.",
    "queryParseDesc": "Incolla un URL completo o una query grezza come a=1&b=2. Lo strumento la divide in coppie chiave-valore e produce anche JSON.",
    "queryBuildDesc": "Genera una query string da coppie chiave-valore. Supporta chiavi duplicate e codifica automaticamente i valori.",
    "textEncodePlaceholder": "Esempio: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "Esempio: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "Esempio: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "Esempio: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "Esempio: https://example.com/search?q=hello%20world&lang=it oppure q=hello%20world&lang=it",
    "resultPlaceholder": "Il risultato apparirà qui",
    "queryBuildResultPlaceholder": "La query string generata apparirà qui",
    "encode": "Codifica",
    "decode": "Decodifica",
    "parse": "Analizza",
    "build": "Genera",
    "clear": "Cancella",
    "copyResult": "Copia risultato",
    "copySuccess": "Copiato!",
    "addRow": "Aggiungi riga",
    "remove": "Rimuovi",
    "keyPlaceholder": "Chiave",
    "valuePlaceholder": "Valore",
    "parsedResult": "Risultato analizzato",
    "keyLabel": "Chiave",
    "valueLabel": "Valore",
    "errorMsg": "Controlla l'input"
  },
  "nl": {
    "textModeTitle": "Volledige URL coderen / decoderen",
    "componentModeTitle": "URL-component coderen / decoderen",
    "queryParseTitle": "Query parser",
    "queryBuildTitle": "Query builder",
    "textModeDesc": "Gebruik dit voor een volledige URL met protocol, pad, query en hash. Het gebruikt encodeURI / decodeURI en behoudt structuurtekens zoals : / ? & = #.",
    "componentModeDesc": "Gebruik dit voor een enkele parameterwaarde, padsegment of hash-fragment. Het gebruikt encodeURIComponent / decodeURIComponent en codeert ook / ? & = #.",
    "queryParseDesc": "Plak een volledige URL of een ruwe query zoals a=1&b=2. De tool splitst dit in sleutel-waardeparen en geeft ook JSON terug.",
    "queryBuildDesc": "Maak een querystring van sleutel-waardeparen. Dubbele sleutels worden ondersteund en waarden worden automatisch gecodeerd.",
    "textEncodePlaceholder": "Voorbeeld: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "Voorbeeld: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "Voorbeeld: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "Voorbeeld: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "Voorbeeld: https://example.com/search?q=hello%20world&lang=nl of q=hello%20world&lang=nl",
    "resultPlaceholder": "Het resultaat verschijnt hier",
    "queryBuildResultPlaceholder": "De gegenereerde querystring verschijnt hier",
    "encode": "Coderen",
    "decode": "Decoderen",
    "parse": "Parseren",
    "build": "Bouwen",
    "clear": "Wissen",
    "copyResult": "Resultaat kopiëren",
    "copySuccess": "Gekopieerd!",
    "addRow": "Rij toevoegen",
    "remove": "Verwijderen",
    "keyPlaceholder": "Sleutel",
    "valuePlaceholder": "Waarde",
    "parsedResult": "Geparseerd resultaat",
    "keyLabel": "Sleutel",
    "valueLabel": "Waarde",
    "errorMsg": "Controleer de invoer"
  },
  "tr": {
    "textModeTitle": "Tam URL kodlama / çözme",
    "componentModeTitle": "URL bileşeni kodlama / çözme",
    "queryParseTitle": "Query ayrıştırıcı",
    "queryBuildTitle": "Query oluşturucu",
    "textModeDesc": "Bunu protocol, path, query ve hash içeren tam URL için kullanın. encodeURI / decodeURI kullanır ve : / ? & = # gibi yapı karakterlerini korur.",
    "componentModeDesc": "Bunu tek bir parametre değeri, path segmenti veya hash fragmenti için kullanın. encodeURIComponent / decodeURIComponent kullanır ve / ? & = # karakterlerini de kodlar.",
    "queryParseDesc": "Tam URL veya a=1&b=2 gibi raw query girin. Araç bunu anahtar-değer çiftlerine böler ve JSON da üretir.",
    "queryBuildDesc": "Anahtar-değer çiftlerinden query string oluşturun. Tekrarlanan anahtarları destekler ve değerleri otomatik kodlar.",
    "textEncodePlaceholder": "Örnek: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "Örnek: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "Örnek: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "Örnek: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "Örnek: https://example.com/search?q=hello%20world&lang=tr veya q=hello%20world&lang=tr",
    "resultPlaceholder": "Sonuç burada görünecek",
    "queryBuildResultPlaceholder": "Oluşturulan query string burada görünecek",
    "encode": "Kodla",
    "decode": "Kodu Çöz",
    "parse": "Ayrıştır",
    "build": "Oluştur",
    "clear": "Temizle",
    "copyResult": "Sonucu Kopyala",
    "copySuccess": "Kopyalandı!",
    "addRow": "Satır ekle",
    "remove": "Sil",
    "keyPlaceholder": "Anahtar",
    "valuePlaceholder": "Değer",
    "parsedResult": "Ayrıştırma sonucu",
    "keyLabel": "Anahtar",
    "valueLabel": "Değer",
    "errorMsg": "Girdiyi kontrol edin"
  },
  "vi": {
    "textModeTitle": "Mã hóa / giải mã URL đầy đủ",
    "componentModeTitle": "Mã hóa / giải mã thành phần URL",
    "queryParseTitle": "Trình phân tích Query",
    "queryBuildTitle": "Trình tạo Query",
    "textModeDesc": "Dùng cho URL đầy đủ có protocol, path, query và hash. Công cụ sử dụng encodeURI / decodeURI và giữ nguyên các ký tự cấu trúc như : / ? & = #.",
    "componentModeDesc": "Dùng cho một giá trị tham số, đoạn path hoặc hash fragment. Công cụ sử dụng encodeURIComponent / decodeURIComponent và cũng mã hóa / ? & = #.",
    "queryParseDesc": "Dán URL đầy đủ hoặc query thô như a=1&b=2. Công cụ sẽ tách thành các cặp khóa-giá trị và xuất thêm JSON.",
    "queryBuildDesc": "Tạo query string từ các cặp khóa-giá trị. Hỗ trợ khóa trùng lặp và tự động mã hóa giá trị.",
    "textEncodePlaceholder": "Ví dụ: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "Ví dụ: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "Ví dụ: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "Ví dụ: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "Ví dụ: https://example.com/search?q=hello%20world&lang=vi hoặc q=hello%20world&lang=vi",
    "resultPlaceholder": "Kết quả sẽ hiển thị ở đây",
    "queryBuildResultPlaceholder": "Chuỗi query được tạo sẽ hiển thị ở đây",
    "encode": "Mã hóa",
    "decode": "Giải mã",
    "parse": "Phân tích",
    "build": "Tạo",
    "clear": "Xóa",
    "copyResult": "Sao chép kết quả",
    "copySuccess": "Đã sao chép!",
    "addRow": "Thêm dòng",
    "remove": "Xóa",
    "keyPlaceholder": "Khóa",
    "valuePlaceholder": "Giá trị",
    "parsedResult": "Kết quả phân tích",
    "keyLabel": "Khóa",
    "valueLabel": "Giá trị",
    "errorMsg": "Vui lòng kiểm tra dữ liệu nhập"
  },
  "th": {
    "textModeTitle": "เข้ารหัส / ถอดรหัส URL ทั้งเส้น",
    "componentModeTitle": "เข้ารหัส / ถอดรหัสส่วนประกอบ URL",
    "queryParseTitle": "ตัวแยก Query",
    "queryBuildTitle": "ตัวสร้าง Query",
    "textModeDesc": "ใช้สำหรับ URL ทั้งเส้นที่มี protocol, path, query และ hash เครื่องมือนี้ใช้ encodeURI / decodeURI และคงอักขระโครงสร้างอย่าง : / ? & = # ไว้",
    "componentModeDesc": "ใช้สำหรับค่า parameter เดี่ยว, path segment หรือ hash fragment เครื่องมือนี้ใช้ encodeURIComponent / decodeURIComponent และเข้ารหัส / ? & = # ด้วย",
    "queryParseDesc": "วาง URL เต็มหรือ raw query เช่น a=1&b=2 เครื่องมือจะแยกเป็นคู่คีย์-ค่าและแสดง JSON ด้วย",
    "queryBuildDesc": "สร้าง query string จากคู่คีย์-ค่า รองรับคีย์ซ้ำและเข้ารหัสค่าให้อัตโนมัติ",
    "textEncodePlaceholder": "ตัวอย่าง: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "ตัวอย่าง: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "ตัวอย่าง: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "ตัวอย่าง: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "ตัวอย่าง: https://example.com/search?q=hello%20world&lang=th หรือ q=hello%20world&lang=th",
    "resultPlaceholder": "ผลลัพธ์จะแสดงที่นี่",
    "queryBuildResultPlaceholder": "query string ที่สร้างจะแสดงที่นี่",
    "encode": "เข้ารหัส",
    "decode": "ถอดรหัส",
    "parse": "แยก",
    "build": "สร้าง",
    "clear": "ล้าง",
    "copyResult": "คัดลอกผลลัพธ์",
    "copySuccess": "คัดลอกแล้ว!",
    "addRow": "เพิ่มแถว",
    "remove": "ลบ",
    "keyPlaceholder": "คีย์",
    "valuePlaceholder": "ค่า",
    "parsedResult": "ผลการแยก",
    "keyLabel": "คีย์",
    "valueLabel": "ค่า",
    "errorMsg": "โปรดตรวจสอบข้อมูลที่ป้อน"
  },
  "id": {
    "textModeTitle": "Encode / decode URL penuh",
    "componentModeTitle": "Encode / decode komponen URL",
    "queryParseTitle": "Parser Query",
    "queryBuildTitle": "Builder Query",
    "textModeDesc": "Gunakan ini untuk URL penuh dengan protocol, path, query, dan hash. Alat ini memakai encodeURI / decodeURI dan menjaga karakter struktur seperti : / ? & = #.",
    "componentModeDesc": "Gunakan ini untuk satu nilai parameter, segmen path, atau fragmen hash. Alat ini memakai encodeURIComponent / decodeURIComponent dan juga meng-encode / ? & = #.",
    "queryParseDesc": "Tempel URL penuh atau query mentah seperti a=1&b=2. Alat ini akan memecahnya menjadi pasangan key-value dan juga menghasilkan JSON.",
    "queryBuildDesc": "Buat query string dari pasangan key-value. Mendukung key duplikat dan otomatis meng-encode nilai.",
    "textEncodePlaceholder": "Contoh: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "Contoh: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "Contoh: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "Contoh: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "Contoh: https://example.com/search?q=hello%20world&lang=id atau q=hello%20world&lang=id",
    "resultPlaceholder": "Hasil akan muncul di sini",
    "queryBuildResultPlaceholder": "Query string yang dibuat akan muncul di sini",
    "encode": "Enkode",
    "decode": "Dekode",
    "parse": "Parse",
    "build": "Buat",
    "clear": "Hapus",
    "copyResult": "Salin hasil",
    "copySuccess": "Disalin!",
    "addRow": "Tambah baris",
    "remove": "Hapus",
    "keyPlaceholder": "Key",
    "valuePlaceholder": "Value",
    "parsedResult": "Hasil parse",
    "keyLabel": "Key",
    "valueLabel": "Value",
    "errorMsg": "Periksa input Anda"
  },
  "pl": {
    "textModeTitle": "Kodowanie / dekodowanie pełnego URL",
    "componentModeTitle": "Kodowanie / dekodowanie komponentu URL",
    "queryParseTitle": "Parser Query",
    "queryBuildTitle": "Builder Query",
    "textModeDesc": "Użyj tego dla pełnego URL z protokołem, ścieżką, query i hash. Narzędzie używa encodeURI / decodeURI i zachowuje znaki struktury takie jak : / ? & = #.",
    "componentModeDesc": "Użyj tego dla pojedynczej wartości parametru, segmentu ścieżki lub fragmentu hash. Narzędzie używa encodeURIComponent / decodeURIComponent i koduje także / ? & = #.",
    "queryParseDesc": "Wklej pełny URL lub surowe query jak a=1&b=2. Narzędzie rozdzieli je na pary klucz-wartość i wygeneruje także JSON.",
    "queryBuildDesc": "Buduj query string z par klucz-wartość. Obsługuje zduplikowane klucze i automatycznie koduje wartości.",
    "textEncodePlaceholder": "Przykład: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "Przykład: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "Przykład: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "Przykład: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "Przykład: https://example.com/search?q=hello%20world&lang=pl lub q=hello%20world&lang=pl",
    "resultPlaceholder": "Wynik pojawi się tutaj",
    "queryBuildResultPlaceholder": "Wygenerowany query string pojawi się tutaj",
    "encode": "Koduj",
    "decode": "Dekoduj",
    "parse": "Parsuj",
    "build": "Buduj",
    "clear": "Wyczyść",
    "copyResult": "Kopiuj wynik",
    "copySuccess": "Skopiowano!",
    "addRow": "Dodaj wiersz",
    "remove": "Usuń",
    "keyPlaceholder": "Klucz",
    "valuePlaceholder": "Wartość",
    "parsedResult": "Wynik parsowania",
    "keyLabel": "Klucz",
    "valueLabel": "Wartość",
    "errorMsg": "Sprawdź dane wejściowe"
  },
  "sv": {
    "textModeTitle": "Koda / avkoda fullständig URL",
    "componentModeTitle": "Koda / avkoda URL-komponent",
    "queryParseTitle": "Query-parser",
    "queryBuildTitle": "Query-byggare",
    "textModeDesc": "Använd detta för en fullständig URL med protokoll, sökväg, query och hash. Verktyget använder encodeURI / decodeURI och behåller strukturtecken som : / ? & = #.",
    "componentModeDesc": "Använd detta för ett enskilt parametervärde, sökvägssegment eller hash-fragment. Verktyget använder encodeURIComponent / decodeURIComponent och kodar även / ? & = #.",
    "queryParseDesc": "Klistra in en fullständig URL eller en rå query som a=1&b=2. Verktyget delar upp den i nyckel-värdepar och ger även JSON.",
    "queryBuildDesc": "Bygg en query-sträng från nyckel-värdepar. Dubbla nycklar stöds och värden kodas automatiskt.",
    "textEncodePlaceholder": "Exempel: https://example.com/hello world?q=test value#section",
    "textDecodePlaceholder": "Exempel: https://example.com/hello%20world?q=test%20value#section",
    "componentEncodePlaceholder": "Exempel: hello world / test?name=tom&from=home",
    "componentDecodePlaceholder": "Exempel: hello%20world%20%2F%20test%3Fname%3Dtom%26from%3Dhome",
    "queryParsePlaceholder": "Exempel: https://example.com/search?q=hello%20world&lang=sv eller q=hello%20world&lang=sv",
    "resultPlaceholder": "Resultatet visas här",
    "queryBuildResultPlaceholder": "Den genererade query-strängen visas här",
    "encode": "Koda",
    "decode": "Avkoda",
    "parse": "Tolka",
    "build": "Bygg",
    "clear": "Rensa",
    "copyResult": "Kopiera resultat",
    "copySuccess": "Kopierat!",
    "addRow": "Lägg till rad",
    "remove": "Ta bort",
    "keyPlaceholder": "Nyckel",
    "valuePlaceholder": "Värde",
    "parsedResult": "Tolkat resultat",
    "keyLabel": "Nyckel",
    "valueLabel": "Värde",
    "errorMsg": "Kontrollera inmatningen"
  }
}
</i18n>
