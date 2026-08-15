<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

type TPoint = { id: number; x: number; y: number; color: string }

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#a855f7",
  "#06b6d4",
  "#f97316",
  "#ec4899",
  "#84cc16",
  "#6366f1",
]

const stageRef = ref<HTMLElement | null>(null)
const points = ref<TPoint[]>([])
const maxSimul = ref(0)
const isFs = ref(false)
const activeMap = new Map<number, TPoint>()

const current = computed(() => points.value.length)

function colorFor(id: number) {
  return COLORS[Math.abs(id) % COLORS.length]
}

function rel(e: PointerEvent) {
  const el = stageRef.value
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { x: e.clientX - r.left, y: e.clientY - r.top }
}

function publish() {
  points.value = [...activeMap.values()]
  if (activeMap.size > maxSimul.value) maxSimul.value = activeMap.size
}

function onDown(e: PointerEvent) {
  const pos = rel(e)
  if (!pos) return
  try {
    stageRef.value?.setPointerCapture(e.pointerId)
  } catch {
    /* ignore */
  }
  activeMap.set(e.pointerId, {
    id: e.pointerId,
    x: pos.x,
    y: pos.y,
    color: colorFor(e.pointerId),
  })
  publish()
}

function onMove(e: PointerEvent) {
  const prev = activeMap.get(e.pointerId)
  if (!prev) return
  const pos = rel(e)
  if (!pos) return
  prev.x = pos.x
  prev.y = pos.y
  publish()
}

function onUp(e: PointerEvent) {
  activeMap.delete(e.pointerId)
  publish()
}

function resetMax() {
  maxSimul.value = current.value
}

function onFsChange() {
  const el = stageRef.value
  isFs.value = !!(el && document.fullscreenElement === el)
}

async function enterFs() {
  const el = stageRef.value
  if (!el?.requestFullscreen) return
  await el.requestFullscreen()
}

async function exitFs() {
  if (document.fullscreenElement) await document.exitFullscreen()
}

onMounted(() => {
  document.addEventListener("fullscreenchange", onFsChange)
})

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", onFsChange)
  void exitFs()
})
</script>

<template>
  <div class="hw-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <el-button @click="resetMax">{{ t("reset") }}</el-button>
      <el-button
        v-if="!isFs"
        type="primary"
        @click="enterFs"
      >
        {{ t("enterFs") }}
      </el-button>
    </div>

    <div
      ref="stageRef"
      class="stage"
      @pointerdown.prevent="onDown"
      @pointermove.prevent="onMove"
      @pointerup.prevent="onUp"
      @pointercancel.prevent="onUp"
      @contextmenu.prevent
    >
      <div class="count-wrap">
        <span class="count">{{ current }}</span>
        <span class="count-sub">{{ t("current") }}</span>
        <span class="max">{{ t("max", { n: maxSimul }) }}</span>
      </div>
      <div
        v-for="p in points"
        :key="p.id"
        class="dot"
        :style="{
          left: `${p.x}px`,
          top: `${p.y}px`,
          '--c': p.color,
          borderColor: p.color,
        }"
      >
        <span>{{ p.id }}</span>
      </div>
      <p
        v-if="!points.length"
        class="panel-hint"
      >
        {{ t("panelHint") }}
      </p>
      <div
        v-if="isFs"
        class="fs-bar"
        @pointerdown.stop
      >
        <el-button @click="resetMax">{{ t("reset") }}</el-button>
        <el-button @click="exitFs">{{ t("exitFs") }}</el-button>
      </div>
    </div>
    <p class="hint">{{ t("hint") }}</p>
  </div>
</template>

<style lang="scss" scoped>
.hw-page {
  max-width: 960px;
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
  margin: 0 0 16px;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.stage {
  position: relative;
  height: min(62vh, 560px);
  min-height: 320px;
  border-radius: 12px;
  border: 2px dashed var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  touch-action: none;
  user-select: none;
  margin-bottom: 16px;
}

.stage:fullscreen {
  height: 100vh;
  min-height: 100vh;
  border-radius: 0;
  border: none;
  background: #111;
}

.count-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
}

.count {
  font-size: clamp(4rem, 18vw, 8rem);
  font-weight: 800;
  line-height: 1;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-brand-1);
}

.stage:fullscreen .count {
  color: #fff;
}

.count-sub,
.max {
  margin-top: 6px;
  font-size: 0.95rem;
  color: var(--vp-c-text-3);
}

.stage:fullscreen .count-sub,
.stage:fullscreen .max {
  color: rgba(255, 255, 255, 0.65);
}

.dot {
  position: absolute;
  width: 56px;
  height: 56px;
  border: 3px solid;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  background: color-mix(in srgb, var(--c) 22%, transparent);
  z-index: 2;
}

.stage:fullscreen .dot {
  color: #fff;
}

.panel-hint {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 20px;
  margin: 0;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 0.92rem;
  pointer-events: none;
  z-index: 1;
}

.stage:fullscreen .panel-hint {
  color: rgba(255, 255, 255, 0.55);
}

.fs-bar {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 3;
  display: flex;
  gap: 8px;
}

.hint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  line-height: 1.5;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "多点触控测试",
    "desc": "同时按下尽可能多的手指，中间大数字是当前触点数，下面记录本次最多同时按下了几指。",
    "current": "当前同时触点",
    "max": "本次最多 {n} 指",
    "reset": "重置最高纪录",
    "enterFs": "全屏测试",
    "exitFs": "退出全屏",
    "panelHint": "把手指按在此区域（可多指同时按住）…",
    "hint": "用来检查屏幕最多支持几指。电脑可用多个鼠标/触控板指针预览，但不代表手机上限。Esc 退出全屏。"
  },
  "en": {
    "title_page": "Multi-Touch Test",
    "desc": "Press as many fingers as you can. The big number is the current count; below is the session maximum.",
    "current": "fingers down now",
    "max": "session max {n}",
    "reset": "Reset max",
    "enterFs": "Fullscreen",
    "exitFs": "Exit fullscreen",
    "panelHint": "Put fingers here (hold several at once)…",
    "hint": "Checks how many simultaneous touches the screen reports. Esc exits fullscreen."
  },
  "ja": {
    "title_page": "マルチタッチテスト",
    "desc": "できるだけ多くの指を同時に置きます。大きな数字が現在の点数、下は今回の最大です。",
    "current": "現在の同時タッチ",
    "max": "今回最大 {n} 本",
    "reset": "最大をリセット",
    "enterFs": "全画面",
    "exitFs": "終了",
    "panelHint": "ここに指を置いてください（複数可）…",
    "hint": "画面が何本まで同時認識するかを確認します。Esc で全画面終了。"
  },
  "ko": {
    "title_page": "멀티터치 테스트",
    "desc": "손가락을 최대한 많이 동시에 누르세요. 큰 숫자는 현재 개수, 아래는 이번 최대입니다.",
    "current": "현재 동시 터치",
    "max": "이번 최대 {n}개",
    "reset": "최대 초기화",
    "enterFs": "전체 화면",
    "exitFs": "종료",
    "panelHint": "여기에 손가락을 올리세요 (여러 개 가능)…",
    "hint": "화면이 몇 개까지 동시에 인식하는지 확인합니다. Esc로 전체 화면 종료."
  },
  "fr": {
    "title_page": "Test multi-touch",
    "desc": "Posez le plus de doigts possible. Le grand chiffre est le compte actuel ; en dessous, le max de la session.",
    "current": "doigts posés",
    "max": "max session {n}",
    "reset": "Réinitialiser le max",
    "enterFs": "Plein écran",
    "exitFs": "Quitter",
    "panelHint": "Posez les doigts ici (plusieurs à la fois)…",
    "hint": "Vérifie combien de touches simultanées l’écran signale. Échap quitte le plein écran."
  },
  "de": {
    "title_page": "Multi-Touch-Test",
    "desc": "So viele Finger wie möglich gleichzeitig. Die große Zahl ist aktuell; darunter das Sitzungsmaximum.",
    "current": "Finger jetzt",
    "max": "Max. diese Sitzung {n}",
    "reset": "Maximum zurücksetzen",
    "enterFs": "Vollbild",
    "exitFs": "Beenden",
    "panelHint": "Finger hier auflegen (mehrere gleichzeitig)…",
    "hint": "Prüft, wie viele gleichzeitige Touches gemeldet werden. Esc beendet Vollbild."
  },
  "es": {
    "title_page": "Prueba multitáctil",
    "desc": "Pulsa con tantos dedos como puedas. El número grande es el actual; abajo, el máximo de la sesión.",
    "current": "dedos ahora",
    "max": "máx. de la sesión {n}",
    "reset": "Reiniciar máximo",
    "enterFs": "Pantalla completa",
    "exitFs": "Salir",
    "panelHint": "Pon los dedos aquí (varios a la vez)…",
    "hint": "Comprueba cuántos toques simultáneos informa la pantalla. Esc sale."
  },
  "pt": {
    "title_page": "Teste multi-toque",
    "desc": "Prima com o máximo de dedos. O número grande é o atual; abaixo, o máximo da sessão.",
    "current": "dedos agora",
    "max": "máx. da sessão {n}",
    "reset": "Repor máximo",
    "enterFs": "Ecrã inteiro",
    "exitFs": "Sair",
    "panelHint": "Ponha os dedos aqui (vários ao mesmo tempo)…",
    "hint": "Verifica quantos toques simultâneos o ecrã reporta. Esc sai."
  },
  "ru": {
    "title_page": "Тест мультитач",
    "desc": "Нажмите как можно большим числом пальцев. Крупная цифра — сейчас, ниже — максимум сессии.",
    "current": "пальцев сейчас",
    "max": "макс. за сессию {n}",
    "reset": "Сбросить максимум",
    "enterFs": "Полный экран",
    "exitFs": "Выйти",
    "panelHint": "Положите пальцы сюда (несколько сразу)…",
    "hint": "Показывает, сколько одновременных касаний сообщает экран. Esc — выход."
  },
  "ar": {
    "title_page": "اختبار اللمس المتعدد",
    "desc": "اضغط بأكبر عدد من الأصابع. الرقم الكبير هو العدد الحالي، وأسفله أقصى عدد في الجلسة.",
    "current": "أصابع الآن",
    "max": "أقصى هذه الجلسة {n}",
    "reset": "إعادة تعيين الأقصى",
    "enterFs": "ملء الشاشة",
    "exitFs": "خروج",
    "panelHint": "ضع الأصابع هنا (عدة معاً)…",
    "hint": "للتحقق من عدد اللمسات المتزامنة. Esc للخروج من ملء الشاشة."
  },
  "hi": {
    "title_page": "मल्टी-टच टेस्ट",
    "desc": "जितनी हो सके उंगलियाँ एक साथ दबाएँ। बड़ा अंक अभी की संख्या है, नीचे सत्र का अधिकतम।",
    "current": "अभी उंगलियाँ",
    "max": "सत्र अधिकतम {n}",
    "reset": "अधिकतम रीसेट",
    "enterFs": "पूर्ण स्क्रीन",
    "exitFs": "बाहर",
    "panelHint": "यहाँ उंगलियाँ रखें (एक साथ कई)…",
    "hint": "स्क्रीन कितने एक साथ स्पर्श बताती है, यह जाँचता है। Esc से बाहर।"
  },
  "it": {
    "title_page": "Test multi-touch",
    "desc": "Tieni premuti più dita possibile. Il numero grande è il conteggio attuale; sotto il massimo della sessione.",
    "current": "dita ora",
    "max": "max sessione {n}",
    "reset": "Azzera massimo",
    "enterFs": "Schermo intero",
    "exitFs": "Esci",
    "panelHint": "Metti le dita qui (più insieme)…",
    "hint": "Controlla quanti tocchi simultanei segnala lo schermo. Esc esce."
  },
  "nl": {
    "title_page": "Multi-touchtest",
    "desc": "Zet zoveel mogelijk vingers neer. Het grote cijfer is nu; eronder het sessiemaximum.",
    "current": "vingers nu",
    "max": "sessiemax {n}",
    "reset": "Maximum resetten",
    "enterFs": "Volledig scherm",
    "exitFs": "Afsluiten",
    "panelHint": "Leg vingers hier (meerdere tegelijk)…",
    "hint": "Controleert hoeveel gelijktijdige touches het scherm meldt. Esc sluit af."
  },
  "tr": {
    "title_page": "Çoklu dokunma testi",
    "desc": "Mümkün olduğunca çok parmağı aynı anda basın. Büyük sayı şu anki adet; altta oturum rekoru.",
    "current": "şu an parmak",
    "max": "oturum maks. {n}",
    "reset": "Rekoru sıfırla",
    "enterFs": "Tam ekran",
    "exitFs": "Çık",
    "panelHint": "Parmakları buraya koyun (birden fazla)…",
    "hint": "Ekranın kaç eşzamanlı dokunuş bildirdiğini gösterir. Esc çıkar."
  },
  "vi": {
    "title_page": "Kiểm tra đa điểm",
    "desc": "Nhấn càng nhiều ngón càng tốt. Số lớn là hiện tại; bên dưới là tối đa phiên này.",
    "current": "ngón đang nhấn",
    "max": "tối đa phiên {n}",
    "reset": "Xóa kỷ lục",
    "enterFs": "Toàn màn hình",
    "exitFs": "Thoát",
    "panelHint": "Đặt ngón tay vào đây (nhiều ngón cùng lúc)…",
    "hint": "Kiểm tra màn hình báo bao nhiêu điểm chạm đồng thời. Esc thoát."
  },
  "th": {
    "title_page": "ทดสอบมัลติทัช",
    "desc": "กดนิ้วให้มากที่สุดพร้อมกัน ตัวเลขใหญ่คือจำนวนปัจจุบัน ด้านล่างคือสูงสุดของรอบนี้",
    "current": "นิ้วที่กดอยู่",
    "max": "สูงสุดรอบนี้ {n}",
    "reset": "รีเซ็ตสถิติ",
    "enterFs": "เต็มหน้าจอ",
    "exitFs": "ออก",
    "panelHint": "วางนิ้วที่นี่ (หลายนิ้วพร้อมกัน)…",
    "hint": "ตรวจว่าหน้าจอรายงานกี่จุดพร้อมกัน Esc ออกจากเต็มหน้าจอ"
  },
  "id": {
    "title_page": "Tes multi-sentuh",
    "desc": "Tekan sebanyak mungkin jari. Angka besar adalah jumlah sekarang; di bawah, maksimum sesi.",
    "current": "jari sekarang",
    "max": "maks sesi {n}",
    "reset": "Reset maksimum",
    "enterFs": "Layar penuh",
    "exitFs": "Keluar",
    "panelHint": "Letakkan jari di sini (beberapa sekaligus)…",
    "hint": "Memeriksa berapa sentuhan simultan yang dilaporkan layar. Esc keluar."
  },
  "ms": {
    "title_page": "Ujian multi-sentuh",
    "desc": "Tekan sebanyak mungkin jari. Nombor besar ialah bilangan semasa; di bawah, maksimum sesi.",
    "current": "jari sekarang",
    "max": "maks sesi {n}",
    "reset": "Set semula maksimum",
    "enterFs": "Skrin penuh",
    "exitFs": "Keluar",
    "panelHint": "Letak jari di sini (beberapa sekali gus)…",
    "hint": "Menyemak berapa sentuhan serentak dilapor skrin. Esc keluar."
  },
  "pl": {
    "title_page": "Test multi-touch",
    "desc": "Przytrzymaj jak najwięcej palców. Duża liczba to stan teraz; poniżej maksimum sesji.",
    "current": "palce teraz",
    "max": "maks. sesji {n}",
    "reset": "Resetuj maksimum",
    "enterFs": "Pełny ekran",
    "exitFs": "Wyjście",
    "panelHint": "Połóż palce tutaj (kilka naraz)…",
    "hint": "Sprawdza, ile jednoczesnych dotknięć zgłasza ekran. Esc zamyka pełny ekran."
  },
  "uk": {
    "title_page": "Тест мультитач",
    "desc": "Натисніть якомога більшою кількістю пальців. Велика цифра — зараз, нижче — максимум сесії.",
    "current": "пальців зараз",
    "max": "макс. за сесію {n}",
    "reset": "Скинути максимум",
    "enterFs": "На весь екран",
    "exitFs": "Вийти",
    "panelHint": "Покладіть пальці сюди (кілька одразу)…",
    "hint": "Показує, скільки одночасних дотиків повідомляє екран. Esc — вихід."
  },
  "sv": {
    "title_page": "Multitouch-test",
    "desc": "Tryck med så många fingrar som möjligt. Den stora siffran är nu; under syns sessionens max.",
    "current": "fingrar nu",
    "max": "sessionsmax {n}",
    "reset": "Nollställ max",
    "enterFs": "Helskärm",
    "exitFs": "Avsluta",
    "panelHint": "Lägg fingrarna här (flera samtidigt)…",
    "hint": "Visar hur många samtidiga tryck skärmen rapporterar. Esc lämnar helskärm."
  },
  "zh-TW": {
    "title_page": "多點觸控測試",
    "desc": "同時按下盡可能多的手指，中間大數字是目前觸點數，下面記錄本次最多同時按下了幾指。",
    "current": "目前同時觸點",
    "max": "本次最多 {n} 指",
    "reset": "重設最高紀錄",
    "enterFs": "全螢幕測試",
    "exitFs": "退出全螢幕",
    "panelHint": "把手指按在此區域（可多指同時按住）…",
    "hint": "用來檢查螢幕最多支援幾指。Esc 退出全螢幕。"
  }
}
</i18n>
