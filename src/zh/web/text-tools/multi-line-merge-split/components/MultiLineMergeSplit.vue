<template>
  <div class="mlms-wrap">
    <div class="mlms-header">
      <h1 class="mlms-title">{{ t("title") }}</h1>
      <p class="mlms-desc">{{ t("desc") }}</p>
    </div>

    <div class="mlms-tabs">
      <el-radio-group
        v-model="mode"
        size="large"
      >
        <el-radio-button value="merge">{{ t("mergeTab") }}</el-radio-button>
        <el-radio-button value="split">{{ t("splitTab") }}</el-radio-button>
      </el-radio-group>
    </div>

    <div class="mlms-body">
      <div class="mlms-panel">
        <div class="mlms-panel-label">
          {{ mode === "merge" ? t("inputLabelMerge") : t("inputLabelSplit") }}
        </div>
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="12"
          :placeholder="
            mode === 'merge'
              ? t('inputPlaceholderMerge')
              : t('inputPlaceholderSplit')
          "
          class="mlms-textarea"
          @input="handleInput"
        />
      </div>

      <div class="mlms-options">
        <div class="mlms-option-row">
          <span class="mlms-option-label">{{ t("separatorLabel") }}</span>
          <div class="mlms-separator-group">
            <el-radio-group
              v-model="separatorType"
              size="default"
              @change="handleSeparatorTypeChange"
            >
              <el-radio-button value="comma">{{
                t("sepComma")
              }}</el-radio-button>
              <el-radio-button value="space">{{
                t("sepSpace")
              }}</el-radio-button>
              <el-radio-button value="tab">{{ t("sepTab") }}</el-radio-button>
              <el-radio-button value="pipe">{{ t("sepPipe") }}</el-radio-button>
              <el-radio-button value="custom">{{
                t("sepCustom")
              }}</el-radio-button>
            </el-radio-group>
            <el-input
              v-if="separatorType === 'custom'"
              v-model="customSeparator"
              class="mlms-custom-sep"
              :placeholder="t('customSepPlaceholder')"
              @input="handleInput"
            />
          </div>
        </div>

        <div
          v-if="mode === 'merge'"
          class="mlms-option-row"
        >
          <span class="mlms-option-label">{{ t("ignoreEmptyLabel") }}</span>
          <el-switch
            v-model="ignoreEmpty"
            @change="handleInput"
          />
        </div>

        <div
          v-if="mode === 'merge'"
          class="mlms-option-row"
        >
          <span class="mlms-option-label">{{ t("trimLabel") }}</span>
          <el-switch
            v-model="trimLines"
            @change="handleInput"
          />
        </div>
      </div>

      <div class="mlms-actions">
        <el-button
          type="primary"
          size="large"
          :disabled="!inputText.trim()"
          @click="handleTransform"
        >
          {{ mode === "merge" ? t("mergeBtn") : t("splitBtn") }}
        </el-button>
        <el-button
          size="large"
          @click="swapContent"
          :disabled="!outputText"
        >
          {{ t("swapBtn") }}
        </el-button>
        <el-button
          size="large"
          @click="clearAll"
        >
          {{ t("clearBtn") }}
        </el-button>
        <el-button
          size="large"
          :disabled="!outputText"
          @click="copyOutput"
        >
          {{ copyLabel }}
        </el-button>
      </div>

      <div class="mlms-panel">
        <div class="mlms-panel-label">
          {{ t("outputLabel") }}
          <span
            v-if="outputStats"
            class="mlms-stats"
            >{{ outputStats }}</span
          >
        </div>
        <el-input
          v-model="outputText"
          type="textarea"
          :rows="12"
          :placeholder="t('outputPlaceholder')"
          readonly
          class="mlms-textarea"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

const { t } = useI18n()

const mode = ref<"merge" | "split">("merge")
const inputText = ref("")
const outputText = ref("")
const separatorType = ref("comma")
const customSeparator = ref("")
const ignoreEmpty = ref(true)
const trimLines = ref(true)
const copyLabel = ref(t("copyBtn"))

const currentSeparator = computed(() => {
  switch (separatorType.value) {
    case "comma":
      return ","
    case "space":
      return " "
    case "tab":
      return "\t"
    case "pipe":
      return "|"
    case "custom":
      return customSeparator.value
    default:
      return ","
  }
})

const outputStats = computed(() => {
  if (!outputText.value) return ""
  if (mode.value === "merge") {
    const count = outputText.value.split(currentSeparator.value).length
    return t("mergeStats", { count })
  } else {
    const lines = outputText.value.split("\n").filter(l => l.trim() !== "")
    return t("splitStats", { count: lines.length })
  }
})

function doMerge(text: string): string {
  let lines = text.split("\n")
  if (trimLines.value) lines = lines.map(l => l.trim())
  if (ignoreEmpty.value) lines = lines.filter(l => l !== "")
  return lines.join(currentSeparator.value)
}

function doSplit(text: string): string {
  const sep = currentSeparator.value
  if (!sep) return text
  return text.split(sep).join("\n")
}

function handleTransform() {
  if (!inputText.value.trim()) return
  outputText.value =
    mode.value === "merge" ? doMerge(inputText.value) : doSplit(inputText.value)
}

function handleInput() {
  if (outputText.value) {
    handleTransform()
  }
}

function handleSeparatorTypeChange() {
  if (outputText.value) {
    handleTransform()
  }
}

function swapContent() {
  const temp = outputText.value
  inputText.value = temp
  outputText.value = ""
  handleTransform()
}

function clearAll() {
  inputText.value = ""
  outputText.value = ""
}

async function copyOutput() {
  if (!outputText.value) return
  try {
    await navigator.clipboard.writeText(outputText.value)
    copyLabel.value = t("copySuccess")
    setTimeout(() => {
      copyLabel.value = t("copyBtn")
    }, 2000)
  } catch {
    ElMessage.error(t("copyFail"))
  }
}
</script>

<i18n lang="json">
{
  "zh": {
    "title": "多行合并 / 拆分",
    "desc": "将多行文本合并为一行，或将一行文本按分隔符拆分为多行。",
    "mergeTab": "合并",
    "splitTab": "拆分",
    "inputLabelMerge": "输入多行文本",
    "inputLabelSplit": "输入单行文本",
    "inputPlaceholderMerge": "每行一个内容，将被合并为一行",
    "inputPlaceholderSplit": "输入一行文本，将按分隔符拆分为多行",
    "separatorLabel": "分隔符",
    "sepComma": "逗号 ,",
    "sepSpace": "空格",
    "sepTab": "Tab",
    "sepPipe": "竖线 {'|'}",
    "sepCustom": "自定义",
    "customSepPlaceholder": "输入自定义分隔符",
    "ignoreEmptyLabel": "忽略空行",
    "trimLabel": "去除首尾空格",
    "mergeBtn": "合并",
    "splitBtn": "拆分",
    "swapBtn": "结果作为输入",
    "clearBtn": "清空",
    "copyBtn": "复制结果",
    "copySuccess": "已复制！",
    "copyFail": "复制失败",
    "outputLabel": "结果",
    "outputPlaceholder": "结果将在这里显示",
    "mergeStats": "共 {count} 项",
    "splitStats": "共 {count} 行"
  },
  "en": {
    "title": "Multi-line Merge / Split",
    "desc": "Merge multiple lines into one, or split a single line by delimiter into multiple lines.",
    "mergeTab": "Merge",
    "splitTab": "Split",
    "inputLabelMerge": "Input multi-line text",
    "inputLabelSplit": "Input single-line text",
    "inputPlaceholderMerge": "One item per line, will be merged into one line",
    "inputPlaceholderSplit": "Enter a line of text, will be split into multiple lines by delimiter",
    "separatorLabel": "Delimiter",
    "sepComma": "Comma ,",
    "sepSpace": "Space",
    "sepTab": "Tab",
    "sepPipe": "Pipe {'|'}",
    "sepCustom": "Custom",
    "customSepPlaceholder": "Enter custom delimiter",
    "ignoreEmptyLabel": "Ignore empty lines",
    "trimLabel": "Trim whitespace",
    "mergeBtn": "Merge",
    "splitBtn": "Split",
    "swapBtn": "Use result as input",
    "clearBtn": "Clear",
    "copyBtn": "Copy result",
    "copySuccess": "Copied!",
    "copyFail": "Copy failed",
    "outputLabel": "Result",
    "outputPlaceholder": "Result will appear here",
    "mergeStats": "{count} items",
    "splitStats": "{count} lines"
  },
  "ja": {
    "title": "複数行の結合 / 分割",
    "desc": "複数行のテキストを1行に結合するか、区切り文字で1行を複数行に分割します。",
    "mergeTab": "結合",
    "splitTab": "分割",
    "inputLabelMerge": "複数行テキストを入力",
    "inputLabelSplit": "1行テキストを入力",
    "inputPlaceholderMerge": "1行に1項目、1行に結合されます",
    "inputPlaceholderSplit": "テキストを入力し、区切り文字で複数行に分割します",
    "separatorLabel": "区切り文字",
    "sepComma": "カンマ ,",
    "sepSpace": "スペース",
    "sepTab": "タブ",
    "sepPipe": "パイプ {'|'}",
    "sepCustom": "カスタム",
    "customSepPlaceholder": "カスタム区切り文字を入力",
    "ignoreEmptyLabel": "空行を無視",
    "trimLabel": "前後の空白を除去",
    "mergeBtn": "結合",
    "splitBtn": "分割",
    "swapBtn": "結果を入力として使用",
    "clearBtn": "クリア",
    "copyBtn": "結果をコピー",
    "copySuccess": "コピーしました！",
    "copyFail": "コピー失敗",
    "outputLabel": "結果",
    "outputPlaceholder": "結果はここに表示されます",
    "mergeStats": "{count} 項目",
    "splitStats": "{count} 行"
  },
  "ko": {
    "title": "여러 줄 합치기 / 나누기",
    "desc": "여러 줄의 텍스트를 한 줄로 합치거나, 구분자로 한 줄을 여러 줄로 나눕니다.",
    "mergeTab": "합치기",
    "splitTab": "나누기",
    "inputLabelMerge": "여러 줄 텍스트 입력",
    "inputLabelSplit": "한 줄 텍스트 입력",
    "inputPlaceholderMerge": "한 줄에 한 항목, 한 줄로 합쳐집니다",
    "inputPlaceholderSplit": "텍스트를 입력하면 구분자로 여러 줄로 나뉩니다",
    "separatorLabel": "구분자",
    "sepComma": "쉼표 ,",
    "sepSpace": "공백",
    "sepTab": "탭",
    "sepPipe": "파이프 {'|'}",
    "sepCustom": "사용자 정의",
    "customSepPlaceholder": "사용자 정의 구분자 입력",
    "ignoreEmptyLabel": "빈 줄 무시",
    "trimLabel": "앞뒤 공백 제거",
    "mergeBtn": "합치기",
    "splitBtn": "나누기",
    "swapBtn": "결과를 입력으로 사용",
    "clearBtn": "지우기",
    "copyBtn": "결과 복사",
    "copySuccess": "복사됨!",
    "copyFail": "복사 실패",
    "outputLabel": "결과",
    "outputPlaceholder": "결과가 여기에 표시됩니다",
    "mergeStats": "{count}개 항목",
    "splitStats": "{count}줄"
  },
  "fr": {
    "title": "Fusionner / diviser plusieurs lignes",
    "desc": "Fusionnez plusieurs lignes en une seule, ou divisez une ligne par délimiteur en plusieurs lignes.",
    "mergeTab": "Fusionner",
    "splitTab": "Diviser",
    "inputLabelMerge": "Saisir du texte multiligne",
    "inputLabelSplit": "Saisir du texte sur une ligne",
    "inputPlaceholderMerge": "Un élément par ligne, sera fusionné en une ligne",
    "inputPlaceholderSplit": "Entrez une ligne, sera divisée en plusieurs lignes par le délimiteur",
    "separatorLabel": "Délimiteur",
    "sepComma": "Virgule ,",
    "sepSpace": "Espace",
    "sepTab": "Tab",
    "sepPipe": "Pipe {'|'}",
    "sepCustom": "Personnalisé",
    "customSepPlaceholder": "Entrer un délimiteur personnalisé",
    "ignoreEmptyLabel": "Ignorer les lignes vides",
    "trimLabel": "Supprimer les espaces",
    "mergeBtn": "Fusionner",
    "splitBtn": "Diviser",
    "swapBtn": "Utiliser le résultat comme entrée",
    "clearBtn": "Effacer",
    "copyBtn": "Copier le résultat",
    "copySuccess": "Copié !",
    "copyFail": "Échec de la copie",
    "outputLabel": "Résultat",
    "outputPlaceholder": "Le résultat apparaîtra ici",
    "mergeStats": "{count} éléments",
    "splitStats": "{count} lignes"
  },
  "de": {
    "title": "Mehrere Zeilen zusammenführen / aufteilen",
    "desc": "Mehrere Zeilen zu einer zusammenführen oder eine Zeile nach Trennzeichen in mehrere aufteilen.",
    "mergeTab": "Zusammenführen",
    "splitTab": "Aufteilen",
    "inputLabelMerge": "Mehrzeiligen Text eingeben",
    "inputLabelSplit": "Einzeiligen Text eingeben",
    "inputPlaceholderMerge": "Ein Element pro Zeile, wird zu einer Zeile zusammengeführt",
    "inputPlaceholderSplit": "Text eingeben, wird nach Trennzeichen in mehrere Zeilen aufgeteilt",
    "separatorLabel": "Trennzeichen",
    "sepComma": "Komma ,",
    "sepSpace": "Leerzeichen",
    "sepTab": "Tab",
    "sepPipe": "Pipe {'|'}",
    "sepCustom": "Benutzerdefiniert",
    "customSepPlaceholder": "Benutzerdefiniertes Trennzeichen eingeben",
    "ignoreEmptyLabel": "Leere Zeilen ignorieren",
    "trimLabel": "Leerzeichen entfernen",
    "mergeBtn": "Zusammenführen",
    "splitBtn": "Aufteilen",
    "swapBtn": "Ergebnis als Eingabe verwenden",
    "clearBtn": "Löschen",
    "copyBtn": "Ergebnis kopieren",
    "copySuccess": "Kopiert!",
    "copyFail": "Kopieren fehlgeschlagen",
    "outputLabel": "Ergebnis",
    "outputPlaceholder": "Das Ergebnis wird hier angezeigt",
    "mergeStats": "{count} Einträge",
    "splitStats": "{count} Zeilen"
  },
  "es": {
    "title": "Combinar / dividir múltiples líneas",
    "desc": "Combina varias líneas en una sola, o divide una línea por delimitador en varias líneas.",
    "mergeTab": "Combinar",
    "splitTab": "Dividir",
    "inputLabelMerge": "Ingresar texto multilínea",
    "inputLabelSplit": "Ingresar texto de una línea",
    "inputPlaceholderMerge": "Un elemento por línea, se combinará en una línea",
    "inputPlaceholderSplit": "Ingresa una línea de texto, se dividirá por el delimitador",
    "separatorLabel": "Delimitador",
    "sepComma": "Coma ,",
    "sepSpace": "Espacio",
    "sepTab": "Tab",
    "sepPipe": "Barra {'|'}",
    "sepCustom": "Personalizado",
    "customSepPlaceholder": "Ingresar delimitador personalizado",
    "ignoreEmptyLabel": "Ignorar líneas vacías",
    "trimLabel": "Eliminar espacios",
    "mergeBtn": "Combinar",
    "splitBtn": "Dividir",
    "swapBtn": "Usar resultado como entrada",
    "clearBtn": "Limpiar",
    "copyBtn": "Copiar resultado",
    "copySuccess": "¡Copiado!",
    "copyFail": "Error al copiar",
    "outputLabel": "Resultado",
    "outputPlaceholder": "El resultado aparecerá aquí",
    "mergeStats": "{count} elementos",
    "splitStats": "{count} líneas"
  },
  "pt": {
    "title": "Mesclar / dividir múltiplas linhas",
    "desc": "Mescle várias linhas em uma, ou divida uma linha por delimitador em várias linhas.",
    "mergeTab": "Mesclar",
    "splitTab": "Dividir",
    "inputLabelMerge": "Inserir texto de várias linhas",
    "inputLabelSplit": "Inserir texto de uma linha",
    "inputPlaceholderMerge": "Um item por linha, será mesclado em uma linha",
    "inputPlaceholderSplit": "Insira uma linha de texto, será dividida por delimitador",
    "separatorLabel": "Delimitador",
    "sepComma": "Vírgula ,",
    "sepSpace": "Espaço",
    "sepTab": "Tab",
    "sepPipe": "Barra {'|'}",
    "sepCustom": "Personalizado",
    "customSepPlaceholder": "Inserir delimitador personalizado",
    "ignoreEmptyLabel": "Ignorar linhas vazias",
    "trimLabel": "Remover espaços",
    "mergeBtn": "Mesclar",
    "splitBtn": "Dividir",
    "swapBtn": "Usar resultado como entrada",
    "clearBtn": "Limpar",
    "copyBtn": "Copiar resultado",
    "copySuccess": "Copiado!",
    "copyFail": "Falha ao copiar",
    "outputLabel": "Resultado",
    "outputPlaceholder": "O resultado aparecerá aqui",
    "mergeStats": "{count} itens",
    "splitStats": "{count} linhas"
  },
  "ru": {
    "title": "Объединить / разделить строки",
    "desc": "Объедините несколько строк в одну или разделите строку по разделителю на несколько строк.",
    "mergeTab": "Объединить",
    "splitTab": "Разделить",
    "inputLabelMerge": "Введите многострочный текст",
    "inputLabelSplit": "Введите однострочный текст",
    "inputPlaceholderMerge": "По одному элементу в строке, будет объединено в одну строку",
    "inputPlaceholderSplit": "Введите строку, она будет разделена по разделителю",
    "separatorLabel": "Разделитель",
    "sepComma": "Запятая ,",
    "sepSpace": "Пробел",
    "sepTab": "Таб",
    "sepPipe": "Черта {'|'}",
    "sepCustom": "Свой",
    "customSepPlaceholder": "Введите свой разделитель",
    "ignoreEmptyLabel": "Игнорировать пустые строки",
    "trimLabel": "Удалить пробелы",
    "mergeBtn": "Объединить",
    "splitBtn": "Разделить",
    "swapBtn": "Использовать результат как ввод",
    "clearBtn": "Очистить",
    "copyBtn": "Скопировать результат",
    "copySuccess": "Скопировано!",
    "copyFail": "Ошибка копирования",
    "outputLabel": "Результат",
    "outputPlaceholder": "Результат появится здесь",
    "mergeStats": "{count} элементов",
    "splitStats": "{count} строк"
  },
  "ar": {
    "title": "دمج / تقسيم الأسطر المتعددة",
    "desc": "ادمج أسطراً متعددة في سطر واحد، أو قسّم سطراً واحداً بفاصل إلى أسطر متعددة.",
    "mergeTab": "دمج",
    "splitTab": "تقسيم",
    "inputLabelMerge": "أدخل نصاً متعدد الأسطر",
    "inputLabelSplit": "أدخل نصاً في سطر واحد",
    "inputPlaceholderMerge": "عنصر واحد في كل سطر، سيتم دمجه في سطر واحد",
    "inputPlaceholderSplit": "أدخل سطراً من النص، سيتم تقسيمه بالفاصل",
    "separatorLabel": "الفاصل",
    "sepComma": "فاصلة ,",
    "sepSpace": "مسافة",
    "sepTab": "تاب",
    "sepPipe": "خط {'|'} ",
    "sepCustom": "مخصص",
    "customSepPlaceholder": "أدخل فاصلاً مخصصاً",
    "ignoreEmptyLabel": "تجاهل الأسطر الفارغة",
    "trimLabel": "إزالة المسافات",
    "mergeBtn": "دمج",
    "splitBtn": "تقسيم",
    "swapBtn": "استخدام النتيجة كمدخل",
    "clearBtn": "مسح",
    "copyBtn": "نسخ النتيجة",
    "copySuccess": "تم النسخ!",
    "copyFail": "فشل النسخ",
    "outputLabel": "النتيجة",
    "outputPlaceholder": "ستظهر النتيجة هنا",
    "mergeStats": "{count} عناصر",
    "splitStats": "{count} أسطر"
  },
  "hi": {
    "title": "बहु-पंक्ति मर्ज / विभाजन",
    "desc": "कई पंक्तियों को एक में मर्ज करें, या एक पंक्ति को डेलिमिटर से कई पंक्तियों में विभाजित करें।",
    "mergeTab": "मर्ज",
    "splitTab": "विभाजन",
    "inputLabelMerge": "बहु-पंक्ति टेक्स्ट दर्ज करें",
    "inputLabelSplit": "एकल-पंक्ति टेक्स्ट दर्ज करें",
    "inputPlaceholderMerge": "प्रति पंक्ति एक आइटम, एक पंक्ति में मर्ज होगा",
    "inputPlaceholderSplit": "एक पंक्ति दर्ज करें, डेलिमिटर से विभाजित होगी",
    "separatorLabel": "डेलिमिटर",
    "sepComma": "अल्पविराम ,",
    "sepSpace": "स्पेस",
    "sepTab": "टैब",
    "sepPipe": "पाइप {'|'}",
    "sepCustom": "कस्टम",
    "customSepPlaceholder": "कस्टम डेलिमिटर दर्ज करें",
    "ignoreEmptyLabel": "खाली पंक्तियाँ अनदेखा करें",
    "trimLabel": "व्हाइटस्पेस हटाएं",
    "mergeBtn": "मर्ज",
    "splitBtn": "विभाजित",
    "swapBtn": "परिणाम को इनपुट के रूप में उपयोग करें",
    "clearBtn": "साफ़",
    "copyBtn": "परिणाम कॉपी करें",
    "copySuccess": "कॉपी हो गया!",
    "copyFail": "कॉपी विफल",
    "outputLabel": "परिणाम",
    "outputPlaceholder": "परिणाम यहाँ दिखाई देगा",
    "mergeStats": "{count} आइटम",
    "splitStats": "{count} पंक्तियाँ"
  },
  "it": {
    "title": "Unire / dividere più righe",
    "desc": "Unisci più righe in una sola, o dividi una riga per delimitatore in più righe.",
    "mergeTab": "Unire",
    "splitTab": "Dividere",
    "inputLabelMerge": "Inserisci testo multiriga",
    "inputLabelSplit": "Inserisci testo su una riga",
    "inputPlaceholderMerge": "Un elemento per riga, verrà unito in una riga",
    "inputPlaceholderSplit": "Inserisci una riga di testo, verrà divisa per delimitatore",
    "separatorLabel": "Delimitatore",
    "sepComma": "Virgola ,",
    "sepSpace": "Spazio",
    "sepTab": "Tab",
    "sepPipe": "Pipe {'|'}",
    "sepCustom": "Personalizzato",
    "customSepPlaceholder": "Inserisci delimitatore personalizzato",
    "ignoreEmptyLabel": "Ignora righe vuote",
    "trimLabel": "Rimuovi spazi",
    "mergeBtn": "Unire",
    "splitBtn": "Dividere",
    "swapBtn": "Usa risultato come input",
    "clearBtn": "Cancella",
    "copyBtn": "Copia risultato",
    "copySuccess": "Copiato!",
    "copyFail": "Copia fallita",
    "outputLabel": "Risultato",
    "outputPlaceholder": "Il risultato apparirà qui",
    "mergeStats": "{count} elementi",
    "splitStats": "{count} righe"
  },
  "nl": {
    "title": "Meerdere regels samenvoegen / splitsen",
    "desc": "Voeg meerdere regels samen tot één, of splits een regel op scheidingsteken in meerdere regels.",
    "mergeTab": "Samenvoegen",
    "splitTab": "Splitsen",
    "inputLabelMerge": "Voer meerdere regels in",
    "inputLabelSplit": "Voer één regel in",
    "inputPlaceholderMerge": "Één item per regel, wordt samengevoegd tot één regel",
    "inputPlaceholderSplit": "Voer een regel in, wordt gesplitst op scheidingsteken",
    "separatorLabel": "Scheidingsteken",
    "sepComma": "Komma ,",
    "sepSpace": "Spatie",
    "sepTab": "Tab",
    "sepPipe": "Pipe {'|'}",
    "sepCustom": "Aangepast",
    "customSepPlaceholder": "Voer aangepast scheidingsteken in",
    "ignoreEmptyLabel": "Lege regels negeren",
    "trimLabel": "Spaties verwijderen",
    "mergeBtn": "Samenvoegen",
    "splitBtn": "Splitsen",
    "swapBtn": "Resultaat als invoer gebruiken",
    "clearBtn": "Wissen",
    "copyBtn": "Resultaat kopiëren",
    "copySuccess": "Gekopieerd!",
    "copyFail": "Kopiëren mislukt",
    "outputLabel": "Resultaat",
    "outputPlaceholder": "Het resultaat verschijnt hier",
    "mergeStats": "{count} items",
    "splitStats": "{count} regels"
  },
  "tr": {
    "title": "Çok satırlı birleştir / böl",
    "desc": "Birden fazla satırı tek satırda birleştirin veya bir satırı ayırıcıyla birden fazla satıra bölün.",
    "mergeTab": "Birleştir",
    "splitTab": "Böl",
    "inputLabelMerge": "Çok satırlı metin girin",
    "inputLabelSplit": "Tek satırlı metin girin",
    "inputPlaceholderMerge": "Her satıra bir öğe, tek satırda birleştirilecek",
    "inputPlaceholderSplit": "Bir satır metin girin, ayırıcıyla bölünecek",
    "separatorLabel": "Ayırıcı",
    "sepComma": "Virgül ,",
    "sepSpace": "Boşluk",
    "sepTab": "Tab",
    "sepPipe": "Pipe {'|'}",
    "sepCustom": "Özel",
    "customSepPlaceholder": "Özel ayırıcı girin",
    "ignoreEmptyLabel": "Boş satırları yoksay",
    "trimLabel": "Boşlukları kırp",
    "mergeBtn": "Birleştir",
    "splitBtn": "Böl",
    "swapBtn": "Sonucu girdi olarak kullan",
    "clearBtn": "Temizle",
    "copyBtn": "Sonucu kopyala",
    "copySuccess": "Kopyalandı!",
    "copyFail": "Kopyalama başarısız",
    "outputLabel": "Sonuç",
    "outputPlaceholder": "Sonuç burada görünecek",
    "mergeStats": "{count} öğe",
    "splitStats": "{count} satır"
  },
  "vi": {
    "title": "Ghép / tách nhiều dòng",
    "desc": "Ghép nhiều dòng thành một, hoặc tách một dòng theo dấu phân cách thành nhiều dòng.",
    "mergeTab": "Ghép",
    "splitTab": "Tách",
    "inputLabelMerge": "Nhập văn bản nhiều dòng",
    "inputLabelSplit": "Nhập văn bản một dòng",
    "inputPlaceholderMerge": "Mỗi dòng một mục, sẽ được ghép thành một dòng",
    "inputPlaceholderSplit": "Nhập một dòng văn bản, sẽ được tách theo dấu phân cách",
    "separatorLabel": "Dấu phân cách",
    "sepComma": "Dấu phẩy ,",
    "sepSpace": "Khoảng trắng",
    "sepTab": "Tab",
    "sepPipe": "Gạch đứng {'|'}",
    "sepCustom": "Tùy chỉnh",
    "customSepPlaceholder": "Nhập dấu phân cách tùy chỉnh",
    "ignoreEmptyLabel": "Bỏ qua dòng trống",
    "trimLabel": "Xóa khoảng trắng",
    "mergeBtn": "Ghép",
    "splitBtn": "Tách",
    "swapBtn": "Dùng kết quả làm đầu vào",
    "clearBtn": "Xóa",
    "copyBtn": "Sao chép kết quả",
    "copySuccess": "Đã sao chép!",
    "copyFail": "Sao chép thất bại",
    "outputLabel": "Kết quả",
    "outputPlaceholder": "Kết quả sẽ hiển thị ở đây",
    "mergeStats": "{count} mục",
    "splitStats": "{count} dòng"
  },
  "th": {
    "title": "รวม / แยกหลายบรรทัด",
    "desc": "รวมหลายบรรทัดเป็นบรรทัดเดียว หรือแยกบรรทัดเดียวด้วยตัวคั่นเป็นหลายบรรทัด",
    "mergeTab": "รวม",
    "splitTab": "แยก",
    "inputLabelMerge": "ป้อนข้อความหลายบรรทัด",
    "inputLabelSplit": "ป้อนข้อความบรรทัดเดียว",
    "inputPlaceholderMerge": "หนึ่งรายการต่อบรรทัด จะถูกรวมเป็นบรรทัดเดียว",
    "inputPlaceholderSplit": "ป้อนข้อความหนึ่งบรรทัด จะถูกแยกด้วยตัวคั่น",
    "separatorLabel": "ตัวคั่น",
    "sepComma": "จุลภาค ,",
    "sepSpace": "เว้นวรรค",
    "sepTab": "แท็บ",
    "sepPipe": "ไปป์ {'|'}",
    "sepCustom": "กำหนดเอง",
    "customSepPlaceholder": "ป้อนตัวคั่นที่กำหนดเอง",
    "ignoreEmptyLabel": "ละเว้นบรรทัดว่าง",
    "trimLabel": "ตัดช่องว่าง",
    "mergeBtn": "รวม",
    "splitBtn": "แยก",
    "swapBtn": "ใช้ผลลัพธ์เป็นข้อมูลเข้า",
    "clearBtn": "ล้าง",
    "copyBtn": "คัดลอกผลลัพธ์",
    "copySuccess": "คัดลอกแล้ว!",
    "copyFail": "คัดลอกล้มเหลว",
    "outputLabel": "ผลลัพธ์",
    "outputPlaceholder": "ผลลัพธ์จะแสดงที่นี่",
    "mergeStats": "{count} รายการ",
    "splitStats": "{count} บรรทัด"
  },
  "id": {
    "title": "Gabungkan / pisahkan beberapa baris",
    "desc": "Gabungkan beberapa baris menjadi satu, atau pisahkan satu baris dengan pemisah menjadi beberapa baris.",
    "mergeTab": "Gabungkan",
    "splitTab": "Pisahkan",
    "inputLabelMerge": "Masukkan teks multi-baris",
    "inputLabelSplit": "Masukkan teks satu baris",
    "inputPlaceholderMerge": "Satu item per baris, akan digabungkan menjadi satu baris",
    "inputPlaceholderSplit": "Masukkan satu baris teks, akan dipisahkan dengan pemisah",
    "separatorLabel": "Pemisah",
    "sepComma": "Koma ,",
    "sepSpace": "Spasi",
    "sepTab": "Tab",
    "sepPipe": "Garis {'|'} ",
    "sepCustom": "Kustom",
    "customSepPlaceholder": "Masukkan pemisah kustom",
    "ignoreEmptyLabel": "Abaikan baris kosong",
    "trimLabel": "Hapus spasi",
    "mergeBtn": "Gabungkan",
    "splitBtn": "Pisahkan",
    "swapBtn": "Gunakan hasil sebagai input",
    "clearBtn": "Hapus",
    "copyBtn": "Salin hasil",
    "copySuccess": "Disalin!",
    "copyFail": "Gagal menyalin",
    "outputLabel": "Hasil",
    "outputPlaceholder": "Hasil akan muncul di sini",
    "mergeStats": "{count} item",
    "splitStats": "{count} baris"
  },
  "ms": {
    "title": "Cantum / pisahkan berbilang baris",
    "desc": "Cantumkan berbilang baris menjadi satu, atau pisahkan satu baris mengikut pembatas menjadi berbilang baris.",
    "mergeTab": "Cantum",
    "splitTab": "Pisah",
    "inputLabelMerge": "Masukkan teks berbilang baris",
    "inputLabelSplit": "Masukkan teks satu baris",
    "inputPlaceholderMerge": "Satu item setiap baris, akan dicantumkan menjadi satu baris",
    "inputPlaceholderSplit": "Masukkan satu baris teks, akan dipisahkan mengikut pembatas",
    "separatorLabel": "Pembatas",
    "sepComma": "Koma ,",
    "sepSpace": "Ruang",
    "sepTab": "Tab",
    "sepPipe": "Paip {'|'}",
    "sepCustom": "Tersuai",
    "customSepPlaceholder": "Masukkan pembatas tersuai",
    "ignoreEmptyLabel": "Abaikan baris kosong",
    "trimLabel": "Buang ruang",
    "mergeBtn": "Cantum",
    "splitBtn": "Pisah",
    "swapBtn": "Guna hasil sebagai input",
    "clearBtn": "Kosongkan",
    "copyBtn": "Salin hasil",
    "copySuccess": "Disalin!",
    "copyFail": "Gagal menyalin",
    "outputLabel": "Hasil",
    "outputPlaceholder": "Hasil akan muncul di sini",
    "mergeStats": "{count} item",
    "splitStats": "{count} baris"
  },
  "pl": {
    "title": "Scalanie / dzielenie wielu wierszy",
    "desc": "Scal wiele wierszy w jeden lub podziel wiersz według separatora na wiele wierszy.",
    "mergeTab": "Scal",
    "splitTab": "Podziel",
    "inputLabelMerge": "Wprowadź tekst wielowierszowy",
    "inputLabelSplit": "Wprowadź tekst jednowierszowy",
    "inputPlaceholderMerge": "Jeden element na wiersz, zostanie scalony w jeden wiersz",
    "inputPlaceholderSplit": "Wprowadź jeden wiersz tekstu, zostanie podzielony separatorem",
    "separatorLabel": "Separator",
    "sepComma": "Przecinek ,",
    "sepSpace": "Spacja",
    "sepTab": "Tab",
    "sepPipe": "Kreska {'|'}",
    "sepCustom": "Niestandardowy",
    "customSepPlaceholder": "Wprowadź niestandardowy separator",
    "ignoreEmptyLabel": "Ignoruj puste wiersze",
    "trimLabel": "Usuń spacje",
    "mergeBtn": "Scal",
    "splitBtn": "Podziel",
    "swapBtn": "Użyj wyniku jako wejście",
    "clearBtn": "Wyczyść",
    "copyBtn": "Kopiuj wynik",
    "copySuccess": "Skopiowano!",
    "copyFail": "Kopiowanie nieudane",
    "outputLabel": "Wynik",
    "outputPlaceholder": "Wynik pojawi się tutaj",
    "mergeStats": "{count} elementów",
    "splitStats": "{count} wierszy"
  },
  "uk": {
    "title": "Об'єднати / розділити рядки",
    "desc": "Об'єднайте кілька рядків в один або розділіть рядок за роздільником на кілька рядків.",
    "mergeTab": "Об'єднати",
    "splitTab": "Розділити",
    "inputLabelMerge": "Введіть багаторядковий текст",
    "inputLabelSplit": "Введіть однорядковий текст",
    "inputPlaceholderMerge": "По одному елементу на рядок, буде об'єднано в один рядок",
    "inputPlaceholderSplit": "Введіть рядок тексту, буде розділено за роздільником",
    "separatorLabel": "Роздільник",
    "sepComma": "Кома ,",
    "sepSpace": "Пробіл",
    "sepTab": "Таб",
    "sepPipe": "Риска {'|'}",
    "sepCustom": "Власний",
    "customSepPlaceholder": "Введіть власний роздільник",
    "ignoreEmptyLabel": "Ігнорувати порожні рядки",
    "trimLabel": "Видалити пробіли",
    "mergeBtn": "Об'єднати",
    "splitBtn": "Розділити",
    "swapBtn": "Використати результат як введення",
    "clearBtn": "Очистити",
    "copyBtn": "Скопіювати результат",
    "copySuccess": "Скопійовано!",
    "copyFail": "Помилка копіювання",
    "outputLabel": "Результат",
    "outputPlaceholder": "Результат з'явиться тут",
    "mergeStats": "{count} елементів",
    "splitStats": "{count} рядків"
  },
  "sv": {
    "title": "Sammanfoga / dela upp flera rader",
    "desc": "Sammanfoga flera rader till en, eller dela upp en rad med avgränsare till flera rader.",
    "mergeTab": "Sammanfoga",
    "splitTab": "Dela upp",
    "inputLabelMerge": "Ange flerradstext",
    "inputLabelSplit": "Ange enradstext",
    "inputPlaceholderMerge": "Ett objekt per rad, sammanfogas till en rad",
    "inputPlaceholderSplit": "Ange en rad text, delas upp med avgränsare",
    "separatorLabel": "Avgränsare",
    "sepComma": "Komma ,",
    "sepSpace": "Mellanslag",
    "sepTab": "Tab",
    "sepPipe": "Pipe {'|'}",
    "sepCustom": "Anpassad",
    "customSepPlaceholder": "Ange anpassad avgränsare",
    "ignoreEmptyLabel": "Ignorera tomma rader",
    "trimLabel": "Ta bort blanksteg",
    "mergeBtn": "Sammanfoga",
    "splitBtn": "Dela upp",
    "swapBtn": "Använd resultat som indata",
    "clearBtn": "Rensa",
    "copyBtn": "Kopiera resultat",
    "copySuccess": "Kopierat!",
    "copyFail": "Kopiering misslyckades",
    "outputLabel": "Resultat",
    "outputPlaceholder": "Resultatet visas här",
    "mergeStats": "{count} objekt",
    "splitStats": "{count} rader"
  },
  "zh-TW": {
    "title": "多行合併 / 拆分",
    "desc": "將多行文字合併為一行，或將一行文字按分隔符拆分為多行。",
    "mergeTab": "合併",
    "splitTab": "拆分",
    "inputLabelMerge": "輸入多行文字",
    "inputLabelSplit": "輸入單行文字",
    "inputPlaceholderMerge": "每行一個內容，將被合併為一行",
    "inputPlaceholderSplit": "輸入一行文字，將按分隔符拆分為多行",
    "separatorLabel": "分隔符",
    "sepComma": "逗號 ,",
    "sepSpace": "空格",
    "sepTab": "Tab",
    "sepPipe": "豎線 {'|'}",
    "sepCustom": "自訂",
    "customSepPlaceholder": "輸入自訂分隔符",
    "ignoreEmptyLabel": "忽略空行",
    "trimLabel": "去除首尾空格",
    "mergeBtn": "合併",
    "splitBtn": "拆分",
    "swapBtn": "結果作為輸入",
    "clearBtn": "清空",
    "copyBtn": "複製結果",
    "copySuccess": "已複製！",
    "copyFail": "複製失敗",
    "outputLabel": "結果",
    "outputPlaceholder": "結果將在這裡顯示",
    "mergeStats": "共 {count} 項",
    "splitStats": "共 {count} 行"
  }
}
</i18n>

<style lang="scss" scoped>
.mlms-wrap {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.mlms-header {
  text-align: center;
  margin-bottom: 28px;
}

.mlms-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 8px;
}

.mlms-desc {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  margin: 0;
}

.mlms-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.mlms-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mlms-panel-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mlms-stats {
  font-weight: 400;
  font-size: 0.8rem;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 1px 8px;
  border-radius: 10px;
}

.mlms-textarea {
  :deep(.el-textarea__inner) {
    font-family: "Fira Mono", "Consolas", "Menlo", monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    resize: vertical;
  }
}

.mlms-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.mlms-option-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.mlms-option-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  min-width: 80px;
  flex-shrink: 0;
}

.mlms-separator-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.mlms-custom-sep {
  width: 160px;
}

.mlms-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
