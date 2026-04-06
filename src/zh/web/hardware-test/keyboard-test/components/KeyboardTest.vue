<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"
import {
  KEYBOARD_ROW_F,
  KEYBOARD_MAIN_ROWS,
  KEYBOARD_NAV_ROWS,
  NUMPAD_PLACEMENTS,
  isAnyCodeDown,
  isAnyCodeTouched,
  type KeyCap,
} from "../keyboard-layout"

const { t } = useI18n()

const pageRoot = ref<HTMLElement | null>(null)

const down = reactive<Record<string, boolean>>({})
const touched = reactive<Record<string, boolean>>({})
const count = ref(0)
const lastCode = ref("")
const lastKey = ref("")

function setDown(code: string) {
  if (!down[code]) {
    down[code] = true
  }
}

function setUp(code: string) {
  if (down[code]) {
    delete down[code]
  }
}

function clearHeld() {
  for (const k of Object.keys(down)) delete down[k]
}

function clearTouched() {
  for (const k of Object.keys(touched)) delete touched[k]
}


function onKeyDown(e: KeyboardEvent) {
  e.preventDefault()
  lastCode.value = e.code
  lastKey.value = e.key
  setDown(e.code)
  if (!e.repeat) {
    touched[e.code] = true
    count.value += 1
  }
}

function onKeyUp(e: KeyboardEvent) {
  setUp(e.code)
}

function onWinBlur() {
  clearHeld()
}

function keyStyle(cap: KeyCap): Record<string, string> {
  if (cap.spacer) {
    return { flex: `${cap.flex ?? 1} 1 0`, minWidth: "0" }
  }
  const f = cap.flex ?? 1
  return { flex: `${f} 1 0`, minWidth: "0" }
}

function keyActive(cap: KeyCap): boolean {
  return isAnyCodeDown(down, cap.codes)
}

function keyUsed(cap: KeyCap): boolean {
  return isAnyCodeTouched(touched, cap.codes)
}

function keyCellClass(cap: KeyCap) {
  return {
    "kb-key": true,
    "kb-spacer": !!cap.spacer,
    "is-down": keyActive(cap),
    "is-used": keyUsed(cap) && !cap.spacer,
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeyDown, true)
  window.addEventListener("keyup", onKeyUp, true)
  window.addEventListener("blur", onWinBlur)
})

onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown, true)
  window.removeEventListener("keyup", onKeyUp, true)
  window.removeEventListener("blur", onWinBlur)
})
</script>

<template>
  <div
    ref="pageRoot"
    class="hw-page"
    tabindex="-1"
  >
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>
    <p class="focus-tip">{{ t("focusTip") }}</p>

    <div
      class="kb-wrap"
      role="presentation"
    >
      <div class="kb-104">
        <div class="kb-left">
          <div class="kb-row">
            <div
              v-for="(cap, ci) in KEYBOARD_ROW_F"
              :key="'f-' + ci"
              :class="keyCellClass(cap)"
              :style="keyStyle(cap)"
            >
              <span
                v-if="!cap.spacer"
                class="kb-label"
              >{{ cap.label }}</span>
            </div>
          </div>
          <div
            v-for="(row, ri) in KEYBOARD_MAIN_ROWS"
            :key="'m-' + ri"
            class="kb-row"
          >
            <div
              v-for="(cap, ci) in row"
              :key="ri + '-' + ci"
              :class="keyCellClass(cap)"
              :style="keyStyle(cap)"
            >
              <span
                v-if="!cap.spacer"
                class="kb-label"
              >{{ cap.label }}</span>
            </div>
          </div>
        </div>

        <div class="kb-nav">
          <div
            v-for="(row, ri) in KEYBOARD_NAV_ROWS"
            :key="'n-' + ri"
            class="kb-row kb-nav-row"
          >
            <div
              v-for="(cap, ci) in row"
              :key="ri + '-' + ci"
              :class="keyCellClass(cap)"
              :style="keyStyle(cap)"
            >
              <span
                v-if="!cap.spacer"
                class="kb-label"
              >{{ cap.label }}</span>
            </div>
          </div>
        </div>

        <div
          class="kb-numpad"
          aria-hidden="true"
        >
          <div
            v-for="(item, i) in NUMPAD_PLACEMENTS"
            :key="'np-' + i"
            class="kb-key kb-np-key"
            :class="{
              'is-down': keyActive(item.cap),
              'is-used': keyUsed(item.cap),
            }"
            :style="{
              gridColumn: item.gridColumn,
              gridRow: item.gridRow,
            }"
          >
            <span class="kb-label">{{ item.cap.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-stats">
      <span>{{ t("countLabel") }} {{ count }}</span>
      <button
        type="button"
        class="clear-btn"
        @click="clearTouched"
      >
        {{ t("clearUsed") }}
      </button>
      <span
        v-if="lastCode"
        class="last-pair mono"
      >
        <span class="muted">code</span> {{ lastCode }}
        <span class="muted">key</span> {{ lastKey }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hw-page {
  outline: none;
  max-width: 1180px;
  margin: 0 auto;
  padding: 24px 12px 48px;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
}

.page-desc {
  margin: 0 0 8px;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

.focus-tip {
  margin: 0 0 16px;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.kb-wrap {
  padding: 14px;
  border-radius: 12px;
  background: linear-gradient(180deg, var(--vp-c-bg-alt) 0%, var(--vp-c-bg-soft) 100%);
  border: 1px solid var(--vp-c-divider);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06);
  overflow-x: auto;
}

.kb-104 {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-end;
  gap: 10px;
  min-width: min(100%, 1040px);
}

.kb-left {
  flex: 1 1 auto;
  min-width: 0;
}

.kb-nav {
  flex: 0 0 auto;
  width: 168px;
}

.kb-nav-row {
  margin-bottom: 6px;
  &:last-child {
    margin-bottom: 0;
  }
}

.kb-numpad {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 40px));
  grid-template-rows: repeat(5, minmax(34px, auto));
  gap: 5px;
  width: 175px;
  align-self: flex-end;
}

.kb-row {
  display: flex;
  flex-direction: row;
  gap: 5px;
  margin-bottom: 6px;
  &:last-child {
    margin-bottom: 0;
  }
}

.kb-key {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 4px 3px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: clamp(0.58rem, 1.1vw, 0.75rem);
  font-weight: 500;
  text-align: center;
  line-height: 1.15;
  user-select: none;
  transition:
    background 0.08s ease,
    border-color 0.08s ease,
    color 0.08s ease,
    box-shadow 0.08s ease;

  &.kb-spacer {
    min-height: 36px;
    border-color: transparent;
    background: transparent;
    box-shadow: none;
    pointer-events: none;
  }

  &.is-used:not(.is-down) {
    background: var(--vp-c-brand-soft);
    border-color: var(--vp-c-divider);
    color: var(--vp-c-text-1);
    font-weight: 600;
  }

  &.is-down {
    background: var(--vp-c-brand-soft);
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
    font-weight: 700;
    box-shadow:
      0 0 0 1px var(--vp-c-brand-1),
      inset 0 2px 4px rgba(0, 0, 0, 0.08);
  }
}

.kb-np-key {
  min-height: 0;
  height: 100%;
}

.kb-label {
  pointer-events: none;
  word-break: break-word;
  white-space: pre-line;
}

.footer-stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin-top: 16px;
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
}

.clear-btn {
  padding: 6px 12px;
  font-size: 0.85rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition:
    border-color 0.12s ease,
    background 0.12s ease;

  &:hover {
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-bg-soft);
  }
}

.last-pair .muted {
  color: var(--vp-c-text-3);
  margin-right: 4px;
}

.last-pair .muted + * {
  margin-right: 12px;
}

.mono {
  font-family: var(--vp-font-family-mono);
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "键盘测试",
    "desc": "参照常见 104 键美式键盘（以物理键 KeyboardEvent.code 为准）。按过的键会一直保持浅色高亮，正在按住时会更亮；可点按钮清除「按过」记录。切换标签页会松开未抬起的键，但不会清除已按过的标记。",
    "focusTip": "在本页任意位置按键即可测试。",
    "countLabel": "累计按下次数（不计长按重复）：",
    "clearUsed": "清除已按过高亮"
  },
  "en": {
    "title_page": "Keyboard Test",
    "desc": "Layout follows a common 104-key US keyboard (KeyboardEvent.code). Pressed keys stay dimly highlighted; held keys are brighter. Use the button to clear “pressed before” marks. Switching tabs releases held keys but keeps the highlights.",
    "focusTip": "Press keys anywhere on this page.",
    "countLabel": "Key presses (no auto-repeat): ",
    "clearUsed": "Clear pressed highlights"
  },
  "ja": {
    "title_page": "キーボードテスト",
    "desc": "一般的な104キー英字配列です。一度押したキーは薄く残り、押し続けている間は強く光ります。ボタンで履歴を消せます。",
    "focusTip": "このページ上でキーを押してください。",
    "countLabel": "キー押下回数（リピート除く）：",
    "clearUsed": "押下表示をクリア"
  },
  "ko": {
    "title_page": "키보드 테스트",
    "desc": "일반적인 104키 영문 배열입니다. 눌렀던 키는 연하게 유지되고 누르고 있는 동안 더 밝게 표시됩니다.",
    "focusTip": "이 페이지에서 키를 누르세요.",
    "countLabel": "키 입력 횟수 (반복 제외): ",
    "clearUsed": "눌림 표시 지우기"
  },
  "fr": {
    "title_page": "Test clavier",
    "desc": "Disposition 104 touches type US. Les touches frappées restent en surbrillance légère ; plus forte si maintenues.",
    "focusTip": "Appuyez sur les touches sur cette page.",
    "countLabel": "Frappes (sans répétition auto) : ",
    "clearUsed": "Effacer les surbrillances"
  },
  "de": {
    "title_page": "Tastaturtest",
    "desc": "104-Tasten-US-Layout. Gedrückte Tasten bleiben schwach markiert, gehaltene stärker.",
    "focusTip": "Tasten auf dieser Seite drücken.",
    "countLabel": "Tastendrücke (ohne Wiederholung): ",
    "clearUsed": "Markierungen löschen"
  },
  "es": {
    "title_page": "Prueba de teclado",
    "desc": "Teclado US de 104 teclas. Las pulsadas quedan resaltadas suavemente; más fuerte si las mantienes.",
    "focusTip": "Pulsa teclas en esta página.",
    "countLabel": "Pulsaciones (sin repetición): ",
    "clearUsed": "Borrar resaltados"
  },
  "pt": {
    "title_page": "Teste de teclado",
    "desc": "Teclado US de 104 teclas. Teclas premidas ficam sublinhadas; mais forte enquanto seguradas.",
    "focusTip": "Prime teclas nesta página.",
    "countLabel": "Pressões (sem repetição): ",
    "clearUsed": "Limpar destaques"
  },
  "ru": {
    "title_page": "Тест клавиатуры",
    "desc": "Раскладка 104 клавиши (US). Нажатые остаются подсвеченными слабее, зажатые — ярче.",
    "focusTip": "Нажимайте клавиши на этой странице.",
    "countLabel": "Нажатий (без автоповтора): ",
    "clearUsed": "Сбросить подсветку"
  },
  "ar": {
    "title_page": "اختبار لوحة المفاتيح",
    "desc": "تخطيط 104 مفتاحًا أمريكيًا. المفاتيح المضغوطة تبقى مضيئة بخفة.",
    "focusTip": "اضغط المفاتيح في هذه الصفحة.",
    "countLabel": "عدد الضغطات (بدون تكرار): ",
    "clearUsed": "مسح التمييز"
  },
  "hi": {
    "title_page": "कीबोर्ड टेस्ट",
    "desc": "104 कुंजी US जैसी। दबाई गई कुंजियाँ हल्की रहती हैं।",
    "focusTip": "इस पृष्ठ पर कुंजी दबाएँ।",
    "countLabel": "दबाव (ऑटो-रिपीट नहीं): ",
    "clearUsed": "हाइलाइट हटाएँ"
  },
  "it": {
    "title_page": "Test tastiera",
    "desc": "Layout US 104 tasti. I tasti premuti restano evidenziati debolmente.",
    "focusTip": "Premi i tasti in questa pagina.",
    "countLabel": "Pressioni (senza ripetizione): ",
    "clearUsed": "Cancella evidenziazioni"
  },
  "nl": {
    "title_page": "Toetsenbordtest",
    "desc": "US 104-toetsenindeling. Ingedrukte toetsen blijven zacht oplichten.",
    "focusTip": "Druk op toetsen op deze pagina.",
    "countLabel": "Aanslagen (zonder herhaling): ",
    "clearUsed": "Markering wissen"
  },
  "tr": {
    "title_page": "Klavye testi",
    "desc": "104 tuşlu US düzeni. Basılan tuşlar soluk kalır.",
    "focusTip": "Bu sayfada tuşlara basın.",
    "countLabel": "Basım (otomatik tekrar yok): ",
    "clearUsed": "Vurguları temizle"
  },
  "vi": {
    "title_page": "Kiểm tra bàn phím",
    "desc": "Bố cục bàn phím 104 phím kiểu Mỹ. Phím đã bấm vẫn sáng nhẹ.",
    "focusTip": "Bấm phím trên trang này.",
    "countLabel": "Lần nhấn (không lặp): ",
    "clearUsed": "Xóa đánh dấu"
  },
  "th": {
    "title_page": "ทดสอบคีย์บอร์ด",
    "desc": "แป้น 104 คีย์แบบ US คีย์ที่กดแล้วจะค้างสีอ่อน",
    "focusTip": "กดปุ่มในหน้านี้",
    "countLabel": "ครั้งกด (ไม่นับซ้ำ): ",
    "clearUsed": "ล้างไฮไลต์"
  },
  "id": {
    "title_page": "Tes keyboard",
    "desc": "Tata letak 104 tombol US. Tombol yang pernah ditekan tetap terang redup.",
    "focusTip": "Tekan tombol di halaman ini.",
    "countLabel": "Tekanan (tanpa ulang): ",
    "clearUsed": "Hapus sorotan"
  },
  "ms": {
    "title_page": "Ujian papan kekunci",
    "desc": "Susun atur 104 kekunci gaya US. Kekunci yang ditekan kekal lembut.",
    "focusTip": "Tekan kekunci di halaman ini.",
    "countLabel": "Tekanan (tanpa ulangan): ",
    "clearUsed": "Padam sorotan"
  },
  "pl": {
    "title_page": "Test klawiatury",
    "desc": "Układ 104 klawiszy (US). Wciśnięte pozostają delikatnie podświetlone.",
    "focusTip": "Naciskaj klawisze na tej stronie.",
    "countLabel": "Naciśnięć (bez autorepeat): ",
    "clearUsed": "Wyczyść podświetlenia"
  },
  "uk": {
    "title_page": "Тест клавіатури",
    "desc": "Розкладка 104 клавіш (US). Натиснуті лишаються слабко підсвіченими.",
    "focusTip": "Натискайте клавіші на цій сторінці.",
    "countLabel": "Натискань (без автоповтору): ",
    "clearUsed": "Скинути підсвічування"
  }
}
</i18n>
