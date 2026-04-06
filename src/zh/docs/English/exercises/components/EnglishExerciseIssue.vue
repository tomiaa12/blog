<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import type { ExerciseIssue, ExerciseItem } from "../data/types"

const props = defineProps<{
  issue: ExerciseIssue
}>()

const { t } = useI18n()

const userInputs = ref<Record<number, string>>({})
const checked = ref<Record<number, boolean | null>>({})
const revealAnswer = ref<Record<number, boolean>>({})
const revealAll = ref(false)
const showExplanation = ref<Record<number, boolean>>({})

watch(
  () => props.issue.id,
  () => {
    userInputs.value = {}
    checked.value = {}
    revealAnswer.value = {}
    showExplanation.value = {}
    revealAll.value = false
  },
)

function normalizeAnswer(s: string) {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.?!。！？]+$/g, "")
    .toLowerCase()
}

function matches(user: string, item: ExerciseItem) {
  const u = normalizeAnswer(user)
  if (!u) return false
  return item.answers.some(a => normalizeAnswer(a) === u)
}

function checkItem(item: ExerciseItem) {
  checked.value[item.n] = matches(userInputs.value[item.n] ?? "", item)
}

function checkAll() {
  for (const it of props.issue.items) {
    checkItem(it)
  }
}

function clearAll() {
  userInputs.value = {}
  checked.value = {}
}

function toggleRevealAll() {
  revealAll.value = !revealAll.value
  const next = revealAll.value
  for (const it of props.issue.items) {
    revealAnswer.value[it.n] = next
  }
}

function setReveal(n: number, v: boolean) {
  revealAnswer.value[n] = v
}

const progress = computed(() => {
  let done = 0
  let right = 0
  for (const it of props.issue.items) {
    const c = checked.value[it.n]
    if (c !== null && c !== undefined) {
      done++
      if (c) right++
    }
  }
  return { done, right, total: props.issue.items.length }
})

function primaryAnswer(item: ExerciseItem) {
  return item.answers[0] ?? ""
}

function copyAnswer(text: string) {
  void navigator.clipboard?.writeText(text)
}
</script>

<template>
  <div class="english-exercise">
    <header class="ex-head">
      <h1 class="ex-title">{{ issue.title }}</h1>
      <p
        v-if="issue.subtitle"
        class="ex-sub"
      >
        {{ issue.subtitle }}
      </p>
      <div class="ex-toolbar">
        <span class="ex-progress">
          {{ t("progress", { right: progress.right, total: progress.total }) }}
        </span>
        <el-button
          size="small"
          @click="checkAll"
          >{{ t("checkAll") }}</el-button
        >
        <el-button
          size="small"
          @click="clearAll"
          >{{ t("clearInputs") }}</el-button
        >
        <el-button
          size="small"
          @click="toggleRevealAll"
          >{{
            revealAll ? t("hideAllAnswers") : t("showAllAnswers")
          }}</el-button
        >
      </div>
    </header>

    <ol class="ex-list">
      <li
        v-for="item in issue.items"
        :key="item.n"
        class="ex-item"
      >
        <div class="ex-item-head">
          <span class="ex-num">{{ item.n }}.</span>
          <span class="ex-prompt">{{ item.prompt }}</span>
        </div>
        <div class="ex-input-row">
          <el-input
            v-model="userInputs[item.n]"
            :placeholder="t('inputPlaceholder')"
            clearable
            class="ex-input"
            @keyup.enter="checkItem(item)"
          />
          <el-button
            size="small"
            type="primary"
            @click="checkItem(item)"
            >{{ t("check") }}</el-button
          >
          <span
            v-if="checked[item.n] === true"
            class="ex-result ok"
            >{{ t("correct") }}</span
          >
          <span
            v-else-if="checked[item.n] === false"
            class="ex-result bad"
            >{{ t("incorrect") }}</span
          >
        </div>

        <div class="ex-answer-block">
          <span class="ex-label">{{ t("referenceAnswer") }}</span>
          <div
            class="ex-spoiler-wrap"
            :class="{ revealed: revealAnswer[item.n] }"
            @click="setReveal(item.n, !revealAnswer[item.n])"
          >
            <span class="ex-spoiler-text">{{ primaryAnswer(item) }}</span>
          </div>
          <el-button
            link
            type="primary"
            size="small"
            class="ex-copy"
            @click.stop="copyAnswer(primaryAnswer(item))"
            >{{ t("copy") }}</el-button
          >
        </div>

        <div
          v-if="item.explanation?.trim()"
          class="ex-exp"
        >
          <button
            type="button"
            class="ex-exp-toggle"
            @click="
              showExplanation[item.n] = !showExplanation[item.n]
            "
          >
            {{ showExplanation[item.n] ? t("hideExplanation") : t("showExplanation") }}
          </button>
          <div
            v-show="showExplanation[item.n]"
            class="ex-exp-body"
          >
            {{ item.explanation }}
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.english-exercise {
  max-width: 820px;
  margin: 0 auto;
  padding: 8px 0 48px;
}

.ex-head {
  margin-bottom: 28px;
}

.ex-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 8px;
}

.ex-sub {
  margin: 0 0 16px;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.ex-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.ex-progress {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-right: 8px;
}

.ex-list {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: ex;
}

.ex-item {
  padding: 18px 0;
  border-bottom: 1px solid var(--vp-c-divider);

  &:last-child {
    border-bottom: none;
  }
}

.ex-item-head {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  line-height: 1.55;
}

.ex-num {
  flex-shrink: 0;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.ex-prompt {
  color: var(--vp-c-text-1);
}

.ex-input-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.ex-input {
  flex: 1 1 220px;
  min-width: 180px;
}

.ex-result {
  font-size: 0.85rem;
  font-weight: 600;

  &.ok {
    color: var(--vp-c-green-1, #22c55e);
  }

  &.bad {
    color: var(--vp-c-red-1, #ef4444);
  }
}

.ex-answer-block {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ex-label {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.ex-spoiler-wrap {
  position: relative;
  display: inline-block;
  max-width: 100%;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  min-height: 1.5em;
  background: var(--vp-c-bg-soft);
  border: 1px dashed var(--vp-c-divider);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 6px;
    background: #515c67;
    opacity: 0.92;
    transition: opacity 0.15s ease;
    pointer-events: none;
  }

  .ex-spoiler-text {
    position: relative;
    z-index: 1;
    font-family: var(--vp-font-family-mono);
    color: var(--vp-c-text-1);
    opacity: 0;
    transition: opacity 0.12s ease;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover::before {
      opacity: 0;
    }

    &:hover .ex-spoiler-text {
      opacity: 1;
    }
  }

  &.revealed::before {
    opacity: 0;
  }

  &.revealed .ex-spoiler-text {
    opacity: 1;
  }
}

.ex-copy {
  margin-left: 4px;
}

.ex-exp {
  margin-top: 6px;
}

.ex-exp-toggle {
  border: none;
  background: none;
  padding: 0;
  font-size: 0.85rem;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.ex-exp-body {
  margin-top: 10px;
  padding: 12px 14px;
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  white-space: pre-wrap;
}
</style>

<i18n lang="json">
{
  "zh": {
    "check": "检查",
    "checkAll": "全部检查",
    "correct": "正确",
    "incorrect": "再试试",
    "referenceAnswer": "参考答案",
    "showAllAnswers": "显示全部参考答案",
    "hideAllAnswers": "隐藏全部参考答案",
    "clearInputs": "清空输入",
    "inputPlaceholder": "在此输入英文句子…",
    "copy": "复制",
    "showExplanation": "答案解析",
    "hideExplanation": "收起解析",
    "progress": "已判对 {right} / {total} 题"
  },
  "en": {
    "check": "Check",
    "checkAll": "Check all",
    "correct": "Correct",
    "incorrect": "Try again",
    "referenceAnswer": "Answer",
    "showAllAnswers": "Show all answers",
    "hideAllAnswers": "Hide all answers",
    "clearInputs": "Clear inputs",
    "inputPlaceholder": "Type your English sentence…",
    "copy": "Copy",
    "showExplanation": "Explanation",
    "hideExplanation": "Hide explanation",
    "progress": "{right} / {total} correct"
  },
  "ja": {
    "check": "確認",
    "checkAll": "すべて確認",
    "correct": "正解",
    "incorrect": "再挑戦",
    "referenceAnswer": "模範解答",
    "showAllAnswers": "解答をすべて表示",
    "hideAllAnswers": "解答をすべて隠す",
    "clearInputs": "入力をクリア",
    "inputPlaceholder": "英語の文を入力…",
    "copy": "コピー",
    "showExplanation": "解説",
    "hideExplanation": "解説を閉じる",
    "progress": "正解 {right} / {total}"
  },
  "ko": {
    "check": "확인",
    "checkAll": "전부 확인",
    "correct": "정답",
    "incorrect": "다시 시도",
    "referenceAnswer": "모범 답안",
    "showAllAnswers": "모든 답 표시",
    "hideAllAnswers": "모든 답 숨기기",
    "clearInputs": "입력 지우기",
    "inputPlaceholder": "영어 문장을 입력…",
    "copy": "복사",
    "showExplanation": "해설",
    "hideExplanation": "해설 닫기",
    "progress": "정답 {right} / {total}"
  },
  "fr": {
    "check": "Vérifier",
    "checkAll": "Tout vérifier",
    "correct": "Correct",
    "incorrect": "Réessayez",
    "referenceAnswer": "Réponse",
    "showAllAnswers": "Afficher toutes les réponses",
    "hideAllAnswers": "Masquer toutes les réponses",
    "clearInputs": "Effacer",
    "inputPlaceholder": "Saisissez votre phrase…",
    "copy": "Copier",
    "showExplanation": "Explication",
    "hideExplanation": "Masquer",
    "progress": "{right} / {total} corrects"
  },
  "de": {
    "check": "Prüfen",
    "checkAll": "Alle prüfen",
    "correct": "Richtig",
    "incorrect": "Nochmal",
    "referenceAnswer": "Musterlösung",
    "showAllAnswers": "Alle Antworten zeigen",
    "hideAllAnswers": "Alle verbergen",
    "clearInputs": "Eingaben löschen",
    "inputPlaceholder": "Englischen Satz eingeben…",
    "copy": "Kopieren",
    "showExplanation": "Erklärung",
    "hideExplanation": "Ausblenden",
    "progress": "{right} / {total} richtig"
  },
  "es": {
    "check": "Comprobar",
    "checkAll": "Comprobar todo",
    "correct": "Correcto",
    "incorrect": "Inténtalo de nuevo",
    "referenceAnswer": "Respuesta",
    "showAllAnswers": "Mostrar todas",
    "hideAllAnswers": "Ocultar todas",
    "clearInputs": "Borrar",
    "inputPlaceholder": "Escribe la frase en inglés…",
    "copy": "Copiar",
    "showExplanation": "Explicación",
    "hideExplanation": "Ocultar",
    "progress": "{right} / {total} correctas"
  },
  "pt": {
    "check": "Verificar",
    "checkAll": "Verificar tudo",
    "correct": "Correto",
    "incorrect": "Tente de novo",
    "referenceAnswer": "Resposta",
    "showAllAnswers": "Mostrar todas",
    "hideAllAnswers": "Ocultar todas",
    "clearInputs": "Limpar",
    "inputPlaceholder": "Digite a frase em inglês…",
    "copy": "Copiar",
    "showExplanation": "Explicação",
    "hideExplanation": "Ocultar",
    "progress": "{right} / {total} corretas"
  },
  "ru": {
    "check": "Проверить",
    "checkAll": "Проверить всё",
    "correct": "Верно",
    "incorrect": "Ещё раз",
    "referenceAnswer": "Ответ",
    "showAllAnswers": "Показать все ответы",
    "hideAllAnswers": "Скрыть все",
    "clearInputs": "Очистить",
    "inputPlaceholder": "Введите предложение…",
    "copy": "Копировать",
    "showExplanation": "Разбор",
    "hideExplanation": "Скрыть",
    "progress": "Верно {right} из {total}"
  },
  "ar": {
    "check": "تحقق",
    "checkAll": "تحقق من الكل",
    "correct": "صحيح",
    "incorrect": "حاول مجددًا",
    "referenceAnswer": "الإجابة",
    "showAllAnswers": "إظهار الكل",
    "hideAllAnswers": "إخفاء الكل",
    "clearInputs": "مسح",
    "inputPlaceholder": "اكتب الجملة…",
    "copy": "نسخ",
    "showExplanation": "شرح",
    "hideExplanation": "إخفاء",
    "progress": "{right} / {total} صحيحة"
  },
  "hi": {
    "check": "जाँच",
    "checkAll": "सभी जाँचें",
    "correct": "सही",
    "incorrect": "फिर कोशिश करें",
    "referenceAnswer": "उत्तर",
    "showAllAnswers": "सभी दिखाएँ",
    "hideAllAnswers": "सभी छिपाएँ",
    "clearInputs": "साफ़ करें",
    "inputPlaceholder": "अंग्रेज़ी वाक्य लिखें…",
    "copy": "कॉपी",
    "showExplanation": "व्याख्या",
    "hideExplanation": "छिपाएँ",
    "progress": "{right} / {total} सही"
  },
  "it": {
    "check": "Controlla",
    "checkAll": "Controlla tutto",
    "correct": "Corretto",
    "incorrect": "Riprova",
    "referenceAnswer": "Risposta",
    "showAllAnswers": "Mostra tutte",
    "hideAllAnswers": "Nascondi tutte",
    "clearInputs": "Cancella",
    "inputPlaceholder": "Scrivi la frase…",
    "copy": "Copia",
    "showExplanation": "Spiegazione",
    "hideExplanation": "Nascondi",
    "progress": "{right} / {total} corrette"
  },
  "nl": {
    "check": "Controleren",
    "checkAll": "Alles controleren",
    "correct": "Goed",
    "incorrect": "Opnieuw",
    "referenceAnswer": "Antwoord",
    "showAllAnswers": "Alles tonen",
    "hideAllAnswers": "Alles verbergen",
    "clearInputs": "Wissen",
    "inputPlaceholder": "Typ je zin…",
    "copy": "Kopiëren",
    "showExplanation": "Uitleg",
    "hideExplanation": "Verbergen",
    "progress": "{right} / {total} goed"
  },
  "tr": {
    "check": "Kontrol",
    "checkAll": "Tümünü kontrol et",
    "correct": "Doğru",
    "incorrect": "Tekrar dene",
    "referenceAnswer": "Cevap",
    "showAllAnswers": "Tümünü göster",
    "hideAllAnswers": "Tümünü gizle",
    "clearInputs": "Temizle",
    "inputPlaceholder": "İngilizce cümle yaz…",
    "copy": "Kopyala",
    "showExplanation": "Açıklama",
    "hideExplanation": "Gizle",
    "progress": "{right} / {total} doğru"
  },
  "vi": {
    "check": "Kiểm tra",
    "checkAll": "Kiểm tra hết",
    "correct": "Đúng",
    "incorrect": "Thử lại",
    "referenceAnswer": "Đáp án",
    "showAllAnswers": "Hiện tất cả",
    "hideAllAnswers": "Ẩn tất cả",
    "clearInputs": "Xóa",
    "inputPlaceholder": "Nhập câu tiếng Anh…",
    "copy": "Sao chép",
    "showExplanation": "Giải thích",
    "hideExplanation": "Thu gọn",
    "progress": "Đúng {right}/{total}"
  },
  "th": {
    "check": "ตรวจ",
    "checkAll": "ตรวจทั้งหมด",
    "correct": "ถูกต้อง",
    "incorrect": "ลองอีกครั้ง",
    "referenceAnswer": "เฉลย",
    "showAllAnswers": "แสดงทั้งหมด",
    "hideAllAnswers": "ซ่อนทั้งหมด",
    "clearInputs": "ล้าง",
    "inputPlaceholder": "พิมพ์ประโยค…",
    "copy": "คัดลอก",
    "showExplanation": "คำอธิบาย",
    "hideExplanation": "ซ่อน",
    "progress": "ถูก {right}/{total}"
  },
  "id": {
    "check": "Periksa",
    "checkAll": "Periksa semua",
    "correct": "Benar",
    "incorrect": "Coba lagi",
    "referenceAnswer": "Jawaban",
    "showAllAnswers": "Tampilkan semua",
    "hideAllAnswers": "Sembunyikan semua",
    "clearInputs": "Hapus",
    "inputPlaceholder": "Ketik kalimat…",
    "copy": "Salin",
    "showExplanation": "Penjelasan",
    "hideExplanation": "Sembunyikan",
    "progress": "{right}/{total} benar"
  },
  "ms": {
    "check": "Semak",
    "checkAll": "Semak semua",
    "correct": "Betul",
    "incorrect": "Cuba lagi",
    "referenceAnswer": "Jawapan",
    "showAllAnswers": "Tunjuk semua",
    "hideAllAnswers": "Sembunyi semua",
    "clearInputs": "Kosongkan",
    "inputPlaceholder": "Taip ayat…",
    "copy": "Salin",
    "showExplanation": "Penjelasan",
    "hideExplanation": "Sembunyi",
    "progress": "{right}/{total} betul"
  },
  "pl": {
    "check": "Sprawdź",
    "checkAll": "Sprawdź wszystko",
    "correct": "Dobrze",
    "incorrect": "Spróbuj ponownie",
    "referenceAnswer": "Odpowiedź",
    "showAllAnswers": "Pokaż wszystkie",
    "hideAllAnswers": "Ukryj wszystkie",
    "clearInputs": "Wyczyść",
    "inputPlaceholder": "Wpisz zdanie…",
    "copy": "Kopiuj",
    "showExplanation": "Wyjaśnienie",
    "hideExplanation": "Ukryj",
    "progress": "{right}/{total} poprawnych"
  },
  "uk": {
    "check": "Перевірити",
    "checkAll": "Перевірити все",
    "correct": "Вірно",
    "incorrect": "Ще раз",
    "referenceAnswer": "Відповідь",
    "showAllAnswers": "Показати всі",
    "hideAllAnswers": "Сховати всі",
    "clearInputs": "Очистити",
    "inputPlaceholder": "Введіть речення…",
    "copy": "Копіювати",
    "showExplanation": "Пояснення",
    "hideExplanation": "Сховати",
    "progress": "Вірно {right} з {total}"
  }
}
</i18n>
