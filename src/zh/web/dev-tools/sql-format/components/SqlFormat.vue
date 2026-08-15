<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { copyToClipboard } from "@/utils"
import {
  ensureSqlFormatter,
  type KeywordCase,
  type SqlLanguage,
} from "./loadSqlFormatter"

const { t } = useI18n()

const DIALECTS: SqlLanguage[] = [
  "sql",
  "mysql",
  "mariadb",
  "postgresql",
  "sqlite",
  "transactsql",
  "plsql",
  "tidb",
  "bigquery",
  "snowflake",
  "spark",
  "hive",
  "redshift",
  "clickhouse",
  "trino",
]

const SAMPLE =
  "select u.id,u.name,count(o.id) as cnt from users u left join orders o on u.id=o.user_id where u.status=1 group by u.id,u.name having count(o.id)>0 order by cnt desc;"

const input = ref(SAMPLE)
const output = ref("")
const language = ref<SqlLanguage>("sql")
const keywordCase = ref<KeywordCase>("upper")
const indent = ref<"2" | "4" | "tab">("2")
const running = ref(false)

function minifySql(sql: string) {
  const parts: string[] = []
  const re = /('(?:''|[^'])*')|("(?:""|[^"])*")|(`[^`]*`)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(sql))) {
    parts.push(sql.slice(last, m.index).replace(/\s+/g, " "))
    parts.push(m[0])
    last = m.index + m[0].length
  }
  parts.push(sql.slice(last).replace(/\s+/g, " "))
  return parts.join("").trim()
}

async function beautify() {
  const sql = input.value.trim()
  if (!sql) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  running.value = true
  try {
    const lib = await ensureSqlFormatter()
    output.value = lib.format(sql, {
      language: language.value,
      keywordCase: keywordCase.value,
      tabWidth: indent.value === "tab" ? 1 : Number(indent.value),
      useTabs: indent.value === "tab",
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : ""
    ElMessage({
      message: msg.includes("sqlFormatter") || msg.includes("资源")
        ? t("msgLib")
        : t("msgFail"),
      type: "error",
    })
  } finally {
    running.value = false
  }
}

function minify() {
  const sql = input.value.trim()
  if (!sql) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  output.value = minifySql(sql)
}

async function copyOut() {
  if (!output.value) {
    ElMessage({ message: t("msgEmpty"), type: "warning" })
    return
  }
  await copyToClipboard(output.value)
  ElMessage({ message: t("copied"), type: "success", duration: 1500 })
}

function useSample() {
  input.value = SAMPLE
}

function clearAll() {
  input.value = ""
  output.value = ""
}

function toInput() {
  if (!output.value) return
  input.value = output.value
}
</script>

<template>
  <div class="sql-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <el-select
        v-model="language"
        class="dialect"
      >
        <el-option
          v-for="d in DIALECTS"
          :key="d"
          :label="t(`lang_${d}`)"
          :value="d"
        />
      </el-select>
      <el-radio-group v-model="keywordCase">
        <el-radio-button value="upper">{{ t("kwUpper") }}</el-radio-button>
        <el-radio-button value="lower">{{ t("kwLower") }}</el-radio-button>
        <el-radio-button value="preserve">{{ t("kwKeep") }}</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="indent">
        <el-radio-button value="2">{{ t("indent2") }}</el-radio-button>
        <el-radio-button value="4">{{ t("indent4") }}</el-radio-button>
        <el-radio-button value="tab">{{ t("indentTab") }}</el-radio-button>
      </el-radio-group>
    </div>

    <div class="actions">
      <el-button
        type="primary"
        :loading="running"
        @click="beautify"
      >
        {{ t("beautify") }}
      </el-button>
      <el-button @click="minify">{{ t("minify") }}</el-button>
      <el-button @click="copyOut">{{ t("copy") }}</el-button>
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
          class="sql-area"
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
          class="sql-area"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sql-page {
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

.dialect {
  width: 180px;
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

.sql-area {
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
    "title_page": "SQL 美化",
    "desc": "在浏览器里格式化或压缩 SQL，支持多种方言。首次会从 CDN 加载 sql-formatter，语句不会上传。",
    "inputLabel": "输入",
    "outputLabel": "输出",
    "placeholder": "粘贴 SQL…",
    "outputHint": "点击「美化」或「压缩」后显示结果",
    "beautify": "美化",
    "minify": "压缩",
    "copy": "复制结果",
    "toInput": "结果回填",
    "sample": "示例",
    "clear": "清空",
    "kwUpper": "关键字大写",
    "kwLower": "关键字小写",
    "kwKeep": "保持原样",
    "indent2": "2 空格",
    "indent4": "4 空格",
    "indentTab": "Tab",
    "copied": "已复制",
    "msgEmpty": "请先输入 SQL。",
    "msgFail": "格式化失败，请检查 SQL 或换一种方言。",
    "msgLib": "格式化库加载失败，请检查网络后重试。",
    "lang_sql": "标准 SQL",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "zh-CN": {
    "title_page": "SQL 美化",
    "desc": "在浏览器里格式化或压缩 SQL，支持多种方言。首次会从 CDN 加载 sql-formatter，语句不会上传。",
    "inputLabel": "输入",
    "outputLabel": "输出",
    "placeholder": "粘贴 SQL…",
    "outputHint": "点击「美化」或「压缩」后显示结果",
    "beautify": "美化",
    "minify": "压缩",
    "copy": "复制结果",
    "toInput": "结果回填",
    "sample": "示例",
    "clear": "清空",
    "kwUpper": "关键字大写",
    "kwLower": "关键字小写",
    "kwKeep": "保持原样",
    "indent2": "2 空格",
    "indent4": "4 空格",
    "indentTab": "Tab",
    "copied": "已复制",
    "msgEmpty": "请先输入 SQL。",
    "msgFail": "格式化失败，请检查 SQL 或换一种方言。",
    "msgLib": "格式化库加载失败，请检查网络后重试。",
    "lang_sql": "标准 SQL",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "en": {
    "title_page": "SQL formatter",
    "desc": "Pretty-print or minify SQL in your browser. Many dialects. sql-formatter loads from a CDN; nothing is uploaded.",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Paste SQL…",
    "outputHint": "Result appears after Beautify or Minify",
    "beautify": "Beautify",
    "minify": "Minify",
    "copy": "Copy result",
    "toInput": "Use as input",
    "sample": "Sample",
    "clear": "Clear",
    "kwUpper": "Keywords UPPER",
    "kwLower": "Keywords lower",
    "kwKeep": "Keep case",
    "indent2": "2 spaces",
    "indent4": "4 spaces",
    "indentTab": "Tab",
    "copied": "Copied",
    "msgEmpty": "Enter some SQL first.",
    "msgFail": "Could not format this SQL. Check the statement or dialect.",
    "msgLib": "Could not load the formatter. Check your network and retry.",
    "lang_sql": "Standard SQL",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "ja": {
    "title_page": "SQL 整形",
    "desc": "ブラウザ内で SQL を整形・圧縮。複数の方言に対応。初回は CDN から sql-formatter を読み込み、文は送信しません。",
    "inputLabel": "入力",
    "outputLabel": "出力",
    "placeholder": "SQL を貼り付け…",
    "outputHint": "「整形」または「圧縮」のあと表示",
    "beautify": "整形",
    "minify": "圧縮",
    "copy": "結果をコピー",
    "toInput": "入力へ戻す",
    "sample": "サンプル",
    "clear": "クリア",
    "kwUpper": "キーワード大文字",
    "kwLower": "キーワード小文字",
    "kwKeep": "そのまま",
    "indent2": "2 スペース",
    "indent4": "4 スペース",
    "indentTab": "Tab",
    "copied": "コピーしました",
    "msgEmpty": "先に SQL を入力してください。",
    "msgFail": "整形できませんでした。文または方言を確認してください。",
    "msgLib": "ライブラリの読み込みに失敗しました。通信を確認して再試行してください。",
    "lang_sql": "標準 SQL",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "ko": {
    "title_page": "SQL 정리",
    "desc": "브라우저에서 SQL을 정리하거나 압축합니다. 여러 방언을 지원합니다. sql-formatter는 CDN에서 불러오며 문은 업로드되지 않습니다.",
    "inputLabel": "입력",
    "outputLabel": "출력",
    "placeholder": "SQL을 붙여넣기…",
    "outputHint": "정리 또는 압축 후 결과가 나타납니다",
    "beautify": "정리",
    "minify": "압축",
    "copy": "결과 복사",
    "toInput": "입력으로",
    "sample": "예시",
    "clear": "지우기",
    "kwUpper": "키워드 대문자",
    "kwLower": "키워드 소문자",
    "kwKeep": "유지",
    "indent2": "공백 2",
    "indent4": "공백 4",
    "indentTab": "Tab",
    "copied": "복사됨",
    "msgEmpty": "먼저 SQL을 입력하세요.",
    "msgFail": "정리하지 못했습니다. 문장이나 방언을 확인하세요.",
    "msgLib": "라이브러리를 불러오지 못했습니다. 네트워크를 확인한 뒤 다시 시도하세요.",
    "lang_sql": "표준 SQL",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "fr": {
    "title_page": "Mise en forme SQL",
    "desc": "Formatez ou minifiez du SQL dans le navigateur. Plusieurs dialectes. sql-formatter vient d’un CDN ; rien n’est envoyé.",
    "inputLabel": "Entrée",
    "outputLabel": "Sortie",
    "placeholder": "Collez du SQL…",
    "outputHint": "Le résultat apparaît après Beautifier ou Minifier",
    "beautify": "Beautifier",
    "minify": "Minifier",
    "copy": "Copier",
    "toInput": "Remettre en entrée",
    "sample": "Exemple",
    "clear": "Effacer",
    "kwUpper": "Mots-clés MAJ",
    "kwLower": "Mots-clés min",
    "kwKeep": "Conserver",
    "indent2": "2 espaces",
    "indent4": "4 espaces",
    "indentTab": "Tab",
    "copied": "Copié",
    "msgEmpty": "Saisissez d’abord du SQL.",
    "msgFail": "Impossible de formater. Vérifiez la requête ou le dialecte.",
    "msgLib": "Impossible de charger le formateur. Vérifiez le réseau et réessayez.",
    "lang_sql": "SQL standard",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "de": {
    "title_page": "SQL formatieren",
    "desc": "SQL im Browser schön formatieren oder verdichten. Viele Dialekte. sql-formatter kommt vom CDN; nichts wird hochgeladen.",
    "inputLabel": "Eingabe",
    "outputLabel": "Ausgabe",
    "placeholder": "SQL einfügen…",
    "outputHint": "Ergebnis nach Formatieren oder Verdichten",
    "beautify": "Formatieren",
    "minify": "Verdichten",
    "copy": "Ergebnis kopieren",
    "toInput": "Als Eingabe",
    "sample": "Beispiel",
    "clear": "Leeren",
    "kwUpper": "Schlüssel GROSS",
    "kwLower": "Schlüssel klein",
    "kwKeep": "Behalten",
    "indent2": "2 Leerzeichen",
    "indent4": "4 Leerzeichen",
    "indentTab": "Tab",
    "copied": "Kopiert",
    "msgEmpty": "Bitte zuerst SQL eingeben.",
    "msgFail": "Formatierung fehlgeschlagen. Anweisung oder Dialekt prüfen.",
    "msgLib": "Formatter konnte nicht geladen werden. Netzwerk prüfen und erneut versuchen.",
    "lang_sql": "Standard-SQL",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "es": {
    "title_page": "Formatear SQL",
    "desc": "Embellece o comprime SQL en el navegador. Varios dialectos. sql-formatter se carga desde un CDN; no se sube nada.",
    "inputLabel": "Entrada",
    "outputLabel": "Salida",
    "placeholder": "Pega SQL…",
    "outputHint": "El resultado aparece tras Embellecer o Comprimir",
    "beautify": "Embellecer",
    "minify": "Comprimir",
    "copy": "Copiar resultado",
    "toInput": "Usar como entrada",
    "sample": "Ejemplo",
    "clear": "Vaciar",
    "kwUpper": "Palabras MAYÚS",
    "kwLower": "Palabras minús",
    "kwKeep": "Conservar",
    "indent2": "2 espacios",
    "indent4": "4 espacios",
    "indentTab": "Tab",
    "copied": "Copiado",
    "msgEmpty": "Introduce SQL primero.",
    "msgFail": "No se pudo formatear. Revisa la sentencia o el dialecto.",
    "msgLib": "No se pudo cargar el formateador. Revisa la red e inténtalo de nuevo.",
    "lang_sql": "SQL estándar",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "pt": {
    "title_page": "Formatar SQL",
    "desc": "Formate ou minifique SQL no navegador. Vários dialetos. O sql-formatter vem de um CDN; nada é enviado.",
    "inputLabel": "Entrada",
    "outputLabel": "Saída",
    "placeholder": "Cole o SQL…",
    "outputHint": "O resultado aparece após Formatá-lo ou Minificá-lo",
    "beautify": "Formatar",
    "minify": "Minificar",
    "copy": "Copiar resultado",
    "toInput": "Usar como entrada",
    "sample": "Exemplo",
    "clear": "Limpar",
    "kwUpper": "Palavras MAIÚS",
    "kwLower": "Palavras minúsc",
    "kwKeep": "Manter",
    "indent2": "2 espaços",
    "indent4": "4 espaços",
    "indentTab": "Tab",
    "copied": "Copiado",
    "msgEmpty": "Digite o SQL primeiro.",
    "msgFail": "Não foi possível formatar. Verifique a sentença ou o dialeto.",
    "msgLib": "Não foi possível carregar o formatador. Verifique a rede e tente de novo.",
    "lang_sql": "SQL padrão",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "ru": {
    "title_page": "Форматирование SQL",
    "desc": "Красиво оформите или сожмите SQL в браузере. Много диалектов. sql-formatter с CDN, ничего не отправляется.",
    "inputLabel": "Ввод",
    "outputLabel": "Вывод",
    "placeholder": "Вставьте SQL…",
    "outputHint": "Результат появится после «Оформить» или «Сжать»",
    "beautify": "Оформить",
    "minify": "Сжать",
    "copy": "Копировать",
    "toInput": "Вставить во ввод",
    "sample": "Пример",
    "clear": "Очистить",
    "kwUpper": "Ключевые ПРОПИСНЫЕ",
    "kwLower": "Ключевые строчные",
    "kwKeep": "Как есть",
    "indent2": "2 пробела",
    "indent4": "4 пробела",
    "indentTab": "Tab",
    "copied": "Скопировано",
    "msgEmpty": "Сначала введите SQL.",
    "msgFail": "Не удалось отформатировать. Проверьте запрос или диалект.",
    "msgLib": "Не удалось загрузить библиотеку. Проверьте сеть и повторите.",
    "lang_sql": "Стандартный SQL",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "ar": {
    "title_page": "تنسيق SQL",
    "desc": "جمّل أو اضغط SQL في المتصفح. لهجات متعددة. تُحمَّل sql-formatter من CDN ولا يُرفع شيء.",
    "inputLabel": "الإدخال",
    "outputLabel": "الإخراج",
    "placeholder": "الصق SQL…",
    "outputHint": "تظهر النتيجة بعد التجميل أو الضغط",
    "beautify": "تجميل",
    "minify": "ضغط",
    "copy": "نسخ النتيجة",
    "toInput": "إرجاع للإدخال",
    "sample": "مثال",
    "clear": "مسح",
    "kwUpper": "كلمات كبيرة",
    "kwLower": "كلمات صغيرة",
    "kwKeep": "الإبقاء",
    "indent2": "مسافتان",
    "indent4": "4 مسافات",
    "indentTab": "Tab",
    "copied": "تم النسخ",
    "msgEmpty": "أدخل SQL أولاً.",
    "msgFail": "تعذر التنسيق. راجع الجملة أو اللهجة.",
    "msgLib": "تعذر تحميل المكتبة. تحقق من الشبكة ثم أعد المحاولة.",
    "lang_sql": "SQL قياسي",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "hi": {
    "title_page": "SQL सुंदर करें",
    "desc": "ब्राउज़र में SQL प्रारूपित या संपीड़ित करें। कई बोलियाँ। sql-formatter CDN से आता है; कुछ अपलोड नहीं होता।",
    "inputLabel": "इनपुट",
    "outputLabel": "आउटपुट",
    "placeholder": "SQL चिपकाएँ…",
    "outputHint": "सुंदर या संपीड़ित करने के बाद परिणाम दिखेगा",
    "beautify": "सुंदर करें",
    "minify": "संपीड़ित करें",
    "copy": "परिणाम कॉपी",
    "toInput": "इनपुट में डालें",
    "sample": "उदाहरण",
    "clear": "साफ़",
    "kwUpper": "कीवर्ड बड़े",
    "kwLower": "कीवर्ड छोटे",
    "kwKeep": "वैसा ही",
    "indent2": "2 स्पेस",
    "indent4": "4 स्पेस",
    "indentTab": "Tab",
    "copied": "कॉपी हो गया",
    "msgEmpty": "पहले SQL दर्ज करें।",
    "msgFail": "प्रारूपित नहीं हो सका। कथन या बोली जाँचें।",
    "msgLib": "फ़ॉर्मेटर लोड नहीं हुआ। नेटवर्क जाँचकर पुनः प्रयास करें।",
    "lang_sql": "मानक SQL",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "it": {
    "title_page": "Formatta SQL",
    "desc": "Formatta o comprimi SQL nel browser. Molti dialetti. sql-formatter arriva da un CDN; nulla viene inviato.",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Incolla SQL…",
    "outputHint": "Il risultato appare dopo Formatta o Comprimi",
    "beautify": "Formatta",
    "minify": "Comprimi",
    "copy": "Copia risultato",
    "toInput": "Usa come input",
    "sample": "Esempio",
    "clear": "Svuota",
    "kwUpper": "Parole MAIUSC",
    "kwLower": "Parole minusc",
    "kwKeep": "Mantieni",
    "indent2": "2 spazi",
    "indent4": "4 spazi",
    "indentTab": "Tab",
    "copied": "Copiato",
    "msgEmpty": "Inserisci prima dell’SQL.",
    "msgFail": "Impossibile formattare. Controlla l’istruzione o il dialetto.",
    "msgLib": "Impossibile caricare il formatter. Controlla la rete e riprova.",
    "lang_sql": "SQL standard",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "nl": {
    "title_page": "SQL opmaken",
    "desc": "Maak SQL mooi of compact in de browser. Veel dialecten. sql-formatter komt van een CDN; niets wordt geüpload.",
    "inputLabel": "Invoer",
    "outputLabel": "Uitvoer",
    "placeholder": "Plak SQL…",
    "outputHint": "Resultaat na Opmaken of Comprimeren",
    "beautify": "Opmaken",
    "minify": "Comprimeren",
    "copy": "Resultaat kopiëren",
    "toInput": "Als invoer",
    "sample": "Voorbeeld",
    "clear": "Wissen",
    "kwUpper": "Trefwoorden HOOFD",
    "kwLower": "Trefwoorden klein",
    "kwKeep": "Behouden",
    "indent2": "2 spaties",
    "indent4": "4 spaties",
    "indentTab": "Tab",
    "copied": "Gekopieerd",
    "msgEmpty": "Voer eerst SQL in.",
    "msgFail": "Kon niet opmaken. Controleer de query of het dialect.",
    "msgLib": "Formatter kon niet worden geladen. Controleer het netwerk en probeer opnieuw.",
    "lang_sql": "Standaard-SQL",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "tr": {
    "title_page": "SQL güzelleştir",
    "desc": "Tarayıcıda SQL biçimlendirin veya sıkıştırın. Birçok lehçe. sql-formatter CDN’den gelir; hiçbir şey yüklenmez.",
    "inputLabel": "Girdi",
    "outputLabel": "Çıktı",
    "placeholder": "SQL yapıştırın…",
    "outputHint": "Sonuç Güzelleştir veya Sıkıştır sonrası görünür",
    "beautify": "Güzelleştir",
    "minify": "Sıkıştır",
    "copy": "Sonucu kopyala",
    "toInput": "Girdiye al",
    "sample": "Örnek",
    "clear": "Temizle",
    "kwUpper": "Anahtar BÜYÜK",
    "kwLower": "Anahtar küçük",
    "kwKeep": "Koru",
    "indent2": "2 boşluk",
    "indent4": "4 boşluk",
    "indentTab": "Tab",
    "copied": "Kopyalandı",
    "msgEmpty": "Önce SQL girin.",
    "msgFail": "Biçimlendirilemedi. Sorguyu veya lehçeyi kontrol edin.",
    "msgLib": "Biçimlendirici yüklenemedi. Ağı kontrol edip tekrar deneyin.",
    "lang_sql": "Standart SQL",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "vi": {
    "title_page": "Làm đẹp SQL",
    "desc": "Định dạng hoặc nén SQL trong trình duyệt. Nhiều phương ngữ. sql-formatter tải từ CDN; không tải lên máy chủ.",
    "inputLabel": "Đầu vào",
    "outputLabel": "Đầu ra",
    "placeholder": "Dán SQL…",
    "outputHint": "Kết quả hiện sau khi Làm đẹp hoặc Nén",
    "beautify": "Làm đẹp",
    "minify": "Nén",
    "copy": "Sao chép kết quả",
    "toInput": "Đưa lại đầu vào",
    "sample": "Mẫu",
    "clear": "Xóa",
    "kwUpper": "Từ khóa HOA",
    "kwLower": "Từ khóa thường",
    "kwKeep": "Giữ nguyên",
    "indent2": "2 khoảng",
    "indent4": "4 khoảng",
    "indentTab": "Tab",
    "copied": "Đã sao chép",
    "msgEmpty": "Hãy nhập SQL trước.",
    "msgFail": "Không định dạng được. Kiểm tra câu lệnh hoặc phương ngữ.",
    "msgLib": "Không tải được thư viện. Kiểm tra mạng rồi thử lại.",
    "lang_sql": "SQL chuẩn",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "th": {
    "title_page": "จัดรูปแบบ SQL",
    "desc": "จัดรูปแบบหรือย่อ SQL ในเบราว์เซอร์ รองรับหลายสำเนียง sql-formatter มาจาก CDN ไม่ได้อัปโหลด",
    "inputLabel": "อินพุต",
    "outputLabel": "เอาต์พุต",
    "placeholder": "วาง SQL…",
    "outputHint": "ผลลัพธ์หลังจัดรูปแบบหรือย่อ",
    "beautify": "จัดรูปแบบ",
    "minify": "ย่อ",
    "copy": "คัดลอกผลลัพธ์",
    "toInput": "ใส่กลับอินพุต",
    "sample": "ตัวอย่าง",
    "clear": "ล้าง",
    "kwUpper": "คำสำคัญตัวใหญ่",
    "kwLower": "คำสำคัญตัวเล็ก",
    "kwKeep": "คงเดิม",
    "indent2": "2 ช่องว่าง",
    "indent4": "4 ช่องว่าง",
    "indentTab": "Tab",
    "copied": "คัดลอกแล้ว",
    "msgEmpty": "กรอก SQL ก่อน",
    "msgFail": "จัดรูปแบบไม่ได้ ตรวจคำสั่งหรือสำเนียง",
    "msgLib": "โหลดไลบรารีไม่สำเร็จ ตรวจเครือข่ายแล้วลองใหม่",
    "lang_sql": "SQL มาตรฐาน",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "id": {
    "title_page": "Rapikan SQL",
    "desc": "Format atau minifikasi SQL di browser. Banyak dialek. sql-formatter dari CDN; tidak diunggah.",
    "inputLabel": "Masukan",
    "outputLabel": "Keluaran",
    "placeholder": "Tempel SQL…",
    "outputHint": "Hasil muncul setelah Rapikan atau Minifikasi",
    "beautify": "Rapikan",
    "minify": "Minifikasi",
    "copy": "Salin hasil",
    "toInput": "Jadikan masukan",
    "sample": "Contoh",
    "clear": "Hapus",
    "kwUpper": "Kata kunci BESAR",
    "kwLower": "Kata kunci kecil",
    "kwKeep": "Pertahankan",
    "indent2": "2 spasi",
    "indent4": "4 spasi",
    "indentTab": "Tab",
    "copied": "Tersalin",
    "msgEmpty": "Masukkan SQL dulu.",
    "msgFail": "Gagal memformat. Periksa pernyataan atau dialek.",
    "msgLib": "Gagal memuat pemformat. Periksa jaringan lalu coba lagi.",
    "lang_sql": "SQL standar",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "ms": {
    "title_page": "Cantikkan SQL",
    "desc": "Format atau mampatkan SQL dalam pelayar. Banyak dialek. sql-formatter dari CDN; tiada yang dimuat naik.",
    "inputLabel": "Input",
    "outputLabel": "Output",
    "placeholder": "Tampal SQL…",
    "outputHint": "Hasil muncul selepas Cantikkan atau Mampatkan",
    "beautify": "Cantikkan",
    "minify": "Mampatkan",
    "copy": "Salin hasil",
    "toInput": "Guna sebagai input",
    "sample": "Contoh",
    "clear": "Kosongkan",
    "kwUpper": "Kata kunci BESAR",
    "kwLower": "Kata kunci kecil",
    "kwKeep": "Kekalkan",
    "indent2": "2 ruang",
    "indent4": "4 ruang",
    "indentTab": "Tab",
    "copied": "Disalin",
    "msgEmpty": "Masukkan SQL dahulu.",
    "msgFail": "Tidak dapat memformat. Semak pernyataan atau dialek.",
    "msgLib": "Tidak dapat memuatkan pemformat. Semak rangkaian dan cuba lagi.",
    "lang_sql": "SQL piawai",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "pl": {
    "title_page": "Formatowanie SQL",
    "desc": "Sformatuj lub zminimalizuj SQL w przeglądarce. Wiele dialektów. sql-formatter z CDN; nic nie jest wysyłane.",
    "inputLabel": "Wejście",
    "outputLabel": "Wyjście",
    "placeholder": "Wklej SQL…",
    "outputHint": "Wynik po Formatuj lub Miniaturyzuj",
    "beautify": "Formatuj",
    "minify": "Zminimalizuj",
    "copy": "Kopiuj wynik",
    "toInput": "Użyj jako wejście",
    "sample": "Przykład",
    "clear": "Wyczyść",
    "kwUpper": "Słowa WIELKIE",
    "kwLower": "Słowa małe",
    "kwKeep": "Zachowaj",
    "indent2": "2 spacje",
    "indent4": "4 spacje",
    "indentTab": "Tab",
    "copied": "Skopiowano",
    "msgEmpty": "Najpierw wpisz SQL.",
    "msgFail": "Nie udało się sformatować. Sprawdź zapytanie lub dialekt.",
    "msgLib": "Nie udało się wczytać formatera. Sprawdź sieć i spróbuj ponownie.",
    "lang_sql": "Standardowy SQL",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "uk": {
    "title_page": "Форматування SQL",
    "desc": "Оформіть або стисніть SQL у браузері. Багато діалектів. sql-formatter з CDN, нічого не надсилається.",
    "inputLabel": "Ввід",
    "outputLabel": "Вивід",
    "placeholder": "Вставте SQL…",
    "outputHint": "Результат з’явиться після «Оформити» або «Стиснути»",
    "beautify": "Оформити",
    "minify": "Стиснути",
    "copy": "Копіювати",
    "toInput": "У ввід",
    "sample": "Приклад",
    "clear": "Очистити",
    "kwUpper": "Ключові ВЕЛИКІ",
    "kwLower": "Ключові малі",
    "kwKeep": "Як є",
    "indent2": "2 пробіли",
    "indent4": "4 пробіли",
    "indentTab": "Tab",
    "copied": "Скопійовано",
    "msgEmpty": "Спочатку введіть SQL.",
    "msgFail": "Не вдалося форматувати. Перевірте запит або діалект.",
    "msgLib": "Не вдалося завантажити бібліотеку. Перевірте мережу й повторіть.",
    "lang_sql": "Стандартний SQL",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "sv": {
    "title_page": "Formatera SQL",
    "desc": "Gör SQL snygg eller kompakt i webbläsaren. Många dialekter. sql-formatter hämtas från CDN; inget laddas upp.",
    "inputLabel": "Indata",
    "outputLabel": "Utdata",
    "placeholder": "Klistra in SQL…",
    "outputHint": "Resultat efter Formatera eller Komprimera",
    "beautify": "Formatera",
    "minify": "Komprimera",
    "copy": "Kopiera resultat",
    "toInput": "Använd som indata",
    "sample": "Exempel",
    "clear": "Rensa",
    "kwUpper": "Nyckelord STORA",
    "kwLower": "Nyckelord små",
    "kwKeep": "Behåll",
    "indent2": "2 mellanslag",
    "indent4": "4 mellanslag",
    "indentTab": "Tab",
    "copied": "Kopierat",
    "msgEmpty": "Ange SQL först.",
    "msgFail": "Kunde inte formatera. Kontrollera frågan eller dialekten.",
    "msgLib": "Kunde inte ladda formateraren. Kontrollera nätverket och försök igen.",
    "lang_sql": "Standard-SQL",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  },
  "zh-TW": {
    "title_page": "SQL 美化",
    "desc": "在瀏覽器裡格式化或壓縮 SQL，支援多種方言。首次會從 CDN 載入 sql-formatter，語句不會上傳。",
    "inputLabel": "輸入",
    "outputLabel": "輸出",
    "placeholder": "貼上 SQL…",
    "outputHint": "點「美化」或「壓縮」後顯示結果",
    "beautify": "美化",
    "minify": "壓縮",
    "copy": "複製結果",
    "toInput": "結果回填",
    "sample": "範例",
    "clear": "清空",
    "kwUpper": "關鍵字大寫",
    "kwLower": "關鍵字小寫",
    "kwKeep": "保持原樣",
    "indent2": "2 空格",
    "indent4": "4 空格",
    "indentTab": "Tab",
    "copied": "已複製",
    "msgEmpty": "請先輸入 SQL。",
    "msgFail": "格式化失敗，請檢查 SQL 或換一種方言。",
    "msgLib": "格式化函式庫載入失敗，請檢查網路後重試。",
    "lang_sql": "標準 SQL",
    "lang_mysql": "MySQL",
    "lang_mariadb": "MariaDB",
    "lang_postgresql": "PostgreSQL",
    "lang_sqlite": "SQLite",
    "lang_transactsql": "SQL Server",
    "lang_plsql": "PL/SQL",
    "lang_tidb": "TiDB",
    "lang_bigquery": "BigQuery",
    "lang_snowflake": "Snowflake",
    "lang_spark": "Spark",
    "lang_hive": "Hive",
    "lang_redshift": "Redshift",
    "lang_clickhouse": "ClickHouse",
    "lang_trino": "Trino"
  }
}
</i18n>
