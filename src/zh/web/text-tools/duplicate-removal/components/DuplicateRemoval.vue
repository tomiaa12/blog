<script setup lang="ts">
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

const { t } = useI18n()

const inputText = ref(`https://kuangyx.cn/web/text-tools/duplicate-removal/
https://kuangyx.cn/web/text-tools/duplicate-removal/
https://kuangyx.cn/web/text-tools/reading-time-estimation/
https://kuangyx.cn/web/text-tools/pinyin-conversion/
https://kuangyx.cn/web/text-tools/pinyin-conversion/
`)
const caseSensitive = ref(false)
const removeBlank = ref(true)
const sortLines = ref(false)

const result = computed(() => {
  if (!inputText.value) return null

  let lines = inputText.value.split("\n")
  const totalOriginal = lines.length

  if (removeBlank.value) {
    lines = lines.filter(l => l.trim() !== "")
  }

  const seen = new Set<string>()
  const unique: string[] = []

  for (const line of lines) {
    const key = caseSensitive.value ? line : line.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(line)
    }
  }

  if (sortLines.value) {
    unique.sort((a, b) => a.localeCompare(b))
  }

  return {
    text: unique.join("\n"),
    original: totalOriginal,
    filtered: lines.length,
    unique: unique.length,
    removed: lines.length - unique.length,
  }
})

function copyResult() {
  if (!result.value?.text) return
  navigator.clipboard.writeText(result.value.text).then(() => {
    ElMessage({ message: t("copied"), type: "success", duration: 1500 })
  })
}

function clear() {
  inputText.value = ""
}
</script>

<template>
  <div class="dup-removal">
    <h1 class="page-title">{{ t("title_page") }}</h1>

    <div class="input-area">
      <div class="input-header">
        <span class="label">{{ t("inputLabel") }}</span>
        <el-button @click="clear">{{ t("clear") }}</el-button>
      </div>
      <el-input
        v-model="inputText"
        type="textarea"
        :rows="10"
        :placeholder="t('placeholder')"
        resize="vertical"
      />
    </div>

    <div class="options">
      <el-checkbox v-model="caseSensitive">{{
        t("caseSensitive")
      }}</el-checkbox>
      <el-checkbox v-model="removeBlank">{{ t("removeBlank") }}</el-checkbox>
      <el-checkbox v-model="sortLines">{{ t("sortLines") }}</el-checkbox>
    </div>

    <template v-if="result">
      <div class="stats-bar">
        <span class="stat-item"
          >{{ t("totalLines") }}：<b>{{ result.original }}</b></span
        >
        <span class="stat-item"
          >{{ t("uniqueLines") }}：<b>{{ result.unique }}</b></span
        >
        <span class="stat-item removed-count"
          >{{ t("removedLines") }}：<b>{{ result.removed }}</b></span
        >
      </div>

      <div class="output-area">
        <div class="output-header">
          <span class="label">{{ t("outputLabel") }}</span>
          <el-button
            type="primary"
            :disabled="!result.text"
            @click="copyResult"
            >{{ t("copy") }}</el-button
          >
        </div>
        <pre class="output-box">{{ result.text || "　" }}</pre>
      </div>
    </template>

    <div
      v-else
      class="empty-hint"
    >
      {{ t("emptyHint") }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dup-removal {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--vp-c-text-1);
}

.input-area {
  margin-bottom: 16px;
}

.input-header,
.output-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.label {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.options {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.stats-bar {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);

  .removed-count b {
    color: var(--vp-c-brand-1);
  }
}

.output-area {
  margin-top: 4px;
}

.output-box {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  white-space: pre-wrap;
  word-break: break-all;
  min-height: 120px;
  max-height: 400px;
  overflow-y: auto;
  margin: 0;
  font-family: var(--vp-font-family-mono);
}

.empty-hint {
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
  padding: 48px 0;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "文本去重",
    "inputLabel": "输入文本",
    "placeholder": "每行输入一条数据，工具将自动去除重复行...",
    "outputLabel": "去重结果",
    "clear": "清空",
    "copy": "复制",
    "copied": "已复制！",
    "emptyHint": "请在上方输入文本",
    "caseSensitive": "区分大小写",
    "removeBlank": "去除空行",
    "sortLines": "排序",
    "totalLines": "总行数",
    "uniqueLines": "去重后",
    "removedLines": "已去除"
  },
  "en": {
    "title_page": "Duplicate Line Remover",
    "inputLabel": "Input Text",
    "placeholder": "Enter one item per line. Duplicate lines will be removed automatically...",
    "outputLabel": "Result",
    "clear": "Clear",
    "copy": "Copy",
    "copied": "Copied!",
    "emptyHint": "Enter some text above to get started",
    "caseSensitive": "Case sensitive",
    "removeBlank": "Remove blank lines",
    "sortLines": "Sort lines",
    "totalLines": "Total",
    "uniqueLines": "Unique",
    "removedLines": "Removed"
  },
  "ja": {
    "title_page": "重複行削除",
    "inputLabel": "入力テキスト",
    "placeholder": "1行に1データを入力してください。重複行は自動的に削除されます...",
    "outputLabel": "結果",
    "clear": "クリア",
    "copy": "コピー",
    "copied": "コピーしました",
    "emptyHint": "上にテキストを入力してください",
    "caseSensitive": "大文字・小文字を区別",
    "removeBlank": "空行を削除",
    "sortLines": "並び替え",
    "totalLines": "合計行数",
    "uniqueLines": "重複削除後",
    "removedLines": "削除済み"
  },
  "ko": {
    "title_page": "중복 줄 제거",
    "inputLabel": "입력 텍스트",
    "placeholder": "한 줄에 하나씩 입력하세요. 중복 줄이 자동으로 제거됩니다...",
    "outputLabel": "결과",
    "clear": "지우기",
    "copy": "복사",
    "copied": "복사되었습니다!",
    "emptyHint": "위에 텍스트를 입력하세요",
    "caseSensitive": "대소문자 구분",
    "removeBlank": "빈 줄 제거",
    "sortLines": "정렬",
    "totalLines": "총 줄 수",
    "uniqueLines": "중복 제거 후",
    "removedLines": "제거됨"
  },
  "fr": {
    "title_page": "Suppression de doublons",
    "inputLabel": "Texte d'entrée",
    "placeholder": "Entrez un élément par ligne. Les doublons seront supprimés automatiquement...",
    "outputLabel": "Résultat",
    "clear": "Effacer",
    "copy": "Copier",
    "copied": "Copié !",
    "emptyHint": "Saisissez du texte ci-dessus pour commencer",
    "caseSensitive": "Sensible à la casse",
    "removeBlank": "Supprimer les lignes vides",
    "sortLines": "Trier les lignes",
    "totalLines": "Total",
    "uniqueLines": "Uniques",
    "removedLines": "Supprimés"
  },
  "de": {
    "title_page": "Duplikat-Zeilen-Entferner",
    "inputLabel": "Eingabetext",
    "placeholder": "Ein Element pro Zeile eingeben. Doppelte Zeilen werden automatisch entfernt...",
    "outputLabel": "Ergebnis",
    "clear": "Löschen",
    "copy": "Kopieren",
    "copied": "Kopiert!",
    "emptyHint": "Geben Sie oben Text ein, um zu beginnen",
    "caseSensitive": "Groß-/Kleinschreibung beachten",
    "removeBlank": "Leerzeilen entfernen",
    "sortLines": "Zeilen sortieren",
    "totalLines": "Gesamt",
    "uniqueLines": "Eindeutig",
    "removedLines": "Entfernt"
  },
  "es": {
    "title_page": "Eliminador de duplicados",
    "inputLabel": "Texto de entrada",
    "placeholder": "Ingrese un elemento por línea. Las líneas duplicadas se eliminarán automáticamente...",
    "outputLabel": "Resultado",
    "clear": "Limpiar",
    "copy": "Copiar",
    "copied": "¡Copiado!",
    "emptyHint": "Ingrese texto arriba para comenzar",
    "caseSensitive": "Distinguir mayúsculas",
    "removeBlank": "Eliminar líneas en blanco",
    "sortLines": "Ordenar líneas",
    "totalLines": "Total",
    "uniqueLines": "Únicos",
    "removedLines": "Eliminados"
  },
  "pt": {
    "title_page": "Removedor de duplicatas",
    "inputLabel": "Texto de entrada",
    "placeholder": "Insira um item por linha. Linhas duplicadas serão removidas automaticamente...",
    "outputLabel": "Resultado",
    "clear": "Limpar",
    "copy": "Copiar",
    "copied": "Copiado!",
    "emptyHint": "Insira texto acima para começar",
    "caseSensitive": "Diferenciar maiúsculas",
    "removeBlank": "Remover linhas em branco",
    "sortLines": "Ordenar linhas",
    "totalLines": "Total",
    "uniqueLines": "Únicos",
    "removedLines": "Removidos"
  },
  "ru": {
    "title_page": "Удаление дублей",
    "inputLabel": "Входной текст",
    "placeholder": "Вводите по одному элементу на строку. Дубликаты будут удалены автоматически...",
    "outputLabel": "Результат",
    "clear": "Очистить",
    "copy": "Копировать",
    "copied": "Скопировано!",
    "emptyHint": "Введите текст выше, чтобы начать",
    "caseSensitive": "Учитывать регистр",
    "removeBlank": "Удалить пустые строки",
    "sortLines": "Сортировать строки",
    "totalLines": "Всего",
    "uniqueLines": "Уникальных",
    "removedLines": "Удалено"
  },
  "ar": {
    "title_page": "إزالة التكرارات",
    "inputLabel": "النص المدخل",
    "placeholder": "أدخل عنصرًا واحدًا في كل سطر. سيتم إزالة الأسطر المكررة تلقائيًا...",
    "outputLabel": "النتيجة",
    "clear": "مسح",
    "copy": "نسخ",
    "copied": "تم النسخ!",
    "emptyHint": "أدخل نصاً أعلاه للبدء",
    "caseSensitive": "حساس لحالة الأحرف",
    "removeBlank": "إزالة الأسطر الفارغة",
    "sortLines": "ترتيب الأسطر",
    "totalLines": "الإجمالي",
    "uniqueLines": "الفريدة",
    "removedLines": "المُزالة"
  },
  "hi": {
    "title_page": "डुप्लीकेट हटाएं",
    "inputLabel": "इनपुट टेक्स्ट",
    "placeholder": "प्रति पंक्ति एक आइटम दर्ज करें। डुप्लीकेट पंक्तियाँ स्वचालित रूप से हटा दी जाएंगी...",
    "outputLabel": "परिणाम",
    "clear": "साफ़ करें",
    "copy": "कॉपी करें",
    "copied": "कॉपी हो गया!",
    "emptyHint": "शुरू करने के लिए ऊपर टेक्स्ट दर्ज करें",
    "caseSensitive": "केस संवेदनशील",
    "removeBlank": "खाली पंक्तियाँ हटाएं",
    "sortLines": "पंक्तियाँ क्रमबद्ध करें",
    "totalLines": "कुल",
    "uniqueLines": "अद्वितीय",
    "removedLines": "हटाई गईं"
  },
  "it": {
    "title_page": "Rimuovi duplicati",
    "inputLabel": "Testo di input",
    "placeholder": "Inserisci un elemento per riga. Le righe duplicate verranno rimosse automaticamente...",
    "outputLabel": "Risultato",
    "clear": "Cancella",
    "copy": "Copia",
    "copied": "Copiato!",
    "emptyHint": "Inserisci del testo sopra per iniziare",
    "caseSensitive": "Distinzione maiuscole/minuscole",
    "removeBlank": "Rimuovi righe vuote",
    "sortLines": "Ordina righe",
    "totalLines": "Totale",
    "uniqueLines": "Univoche",
    "removedLines": "Rimosse"
  },
  "nl": {
    "title_page": "Duplicaten verwijderen",
    "inputLabel": "Invoertekst",
    "placeholder": "Voer één item per regel in. Dubbele regels worden automatisch verwijderd...",
    "outputLabel": "Resultaat",
    "clear": "Wissen",
    "copy": "Kopiëren",
    "copied": "Gekopieerd!",
    "emptyHint": "Voer hierboven tekst in om te beginnen",
    "caseSensitive": "Hoofdlettergevoelig",
    "removeBlank": "Lege regels verwijderen",
    "sortLines": "Regels sorteren",
    "totalLines": "Totaal",
    "uniqueLines": "Uniek",
    "removedLines": "Verwijderd"
  },
  "tr": {
    "title_page": "Yinelenen Satır Kaldırıcı",
    "inputLabel": "Giriş Metni",
    "placeholder": "Her satıra bir öğe girin. Yinelenen satırlar otomatik olarak kaldırılacaktır...",
    "outputLabel": "Sonuç",
    "clear": "Temizle",
    "copy": "Kopyala",
    "copied": "Kopyalandı!",
    "emptyHint": "Başlamak için yukarıya metin girin",
    "caseSensitive": "Büyük/küçük harf duyarlı",
    "removeBlank": "Boş satırları kaldır",
    "sortLines": "Satırları sırala",
    "totalLines": "Toplam",
    "uniqueLines": "Benzersiz",
    "removedLines": "Kaldırıldı"
  },
  "vi": {
    "title_page": "Xóa dòng trùng lặp",
    "inputLabel": "Văn bản đầu vào",
    "placeholder": "Nhập một mục mỗi dòng. Các dòng trùng lặp sẽ tự động bị xóa...",
    "outputLabel": "Kết quả",
    "clear": "Xóa",
    "copy": "Sao chép",
    "copied": "Đã sao chép!",
    "emptyHint": "Nhập văn bản ở trên để bắt đầu",
    "caseSensitive": "Phân biệt hoa thường",
    "removeBlank": "Xóa dòng trống",
    "sortLines": "Sắp xếp dòng",
    "totalLines": "Tổng",
    "uniqueLines": "Duy nhất",
    "removedLines": "Đã xóa"
  },
  "th": {
    "title_page": "ลบรายการซ้ำ",
    "inputLabel": "ข้อความที่ป้อน",
    "placeholder": "ป้อนรายการหนึ่งรายการต่อบรรทัด บรรทัดที่ซ้ำกันจะถูกลบออกโดยอัตโนมัติ...",
    "outputLabel": "ผลลัพธ์",
    "clear": "ล้าง",
    "copy": "คัดลอก",
    "copied": "คัดลอกแล้ว!",
    "emptyHint": "ป้อนข้อความด้านบนเพื่อเริ่มต้น",
    "caseSensitive": "คำนึงถึงตัวพิมพ์",
    "removeBlank": "ลบบรรทัดว่าง",
    "sortLines": "เรียงบรรทัด",
    "totalLines": "ทั้งหมด",
    "uniqueLines": "ไม่ซ้ำ",
    "removedLines": "ลบแล้ว"
  },
  "id": {
    "title_page": "Penghapus Baris Duplikat",
    "inputLabel": "Teks Masukan",
    "placeholder": "Masukkan satu item per baris. Baris duplikat akan dihapus secara otomatis...",
    "outputLabel": "Hasil",
    "clear": "Hapus",
    "copy": "Salin",
    "copied": "Disalin!",
    "emptyHint": "Masukkan teks di atas untuk memulai",
    "caseSensitive": "Peka huruf besar/kecil",
    "removeBlank": "Hapus baris kosong",
    "sortLines": "Urutkan baris",
    "totalLines": "Total",
    "uniqueLines": "Unik",
    "removedLines": "Dihapus"
  },
  "sv": {
    "title_page": "Ta bort dubbletter",
    "inputLabel": "Inmatningstext",
    "placeholder": "Ange ett objekt per rad. Duplicerade rader tas bort automatiskt...",
    "outputLabel": "Resultat",
    "clear": "Rensa",
    "copy": "Kopiera",
    "copied": "Kopierat!",
    "emptyHint": "Ange text ovan för att börja",
    "caseSensitive": "Skiftlägeskänslig",
    "removeBlank": "Ta bort tomma rader",
    "sortLines": "Sortera rader",
    "totalLines": "Totalt",
    "uniqueLines": "Unika",
    "removedLines": "Borttagna"
  },
  "pl": {
    "title_page": "Usuwanie duplikatów",
    "inputLabel": "Tekst wejściowy",
    "placeholder": "Wprowadź jeden element na wiersz. Zduplikowane wiersze zostaną automatycznie usunięte...",
    "outputLabel": "Wynik",
    "clear": "Wyczyść",
    "copy": "Kopiuj",
    "copied": "Skopiowano!",
    "emptyHint": "Wprowadź tekst powyżej, aby rozpocząć",
    "caseSensitive": "Uwzględniaj wielkość liter",
    "removeBlank": "Usuń puste wiersze",
    "sortLines": "Sortuj wiersze",
    "totalLines": "Łącznie",
    "uniqueLines": "Unikalne",
    "removedLines": "Usunięte"
  },
  "zh-TW": {
    "title_page": "文字去重",
    "inputLabel": "輸入文字",
    "placeholder": "每行輸入一筆資料，工具將自動去除重複行...",
    "outputLabel": "去重結果",
    "clear": "清空",
    "copy": "複製",
    "copied": "已複製！",
    "emptyHint": "請在上方輸入文字",
    "caseSensitive": "區分大小寫",
    "removeBlank": "去除空行",
    "sortLines": "排序",
    "totalLines": "總行數",
    "uniqueLines": "去重後",
    "removedLines": "已去除"
  }
}
</i18n>
