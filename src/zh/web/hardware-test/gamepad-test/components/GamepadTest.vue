<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const pads = ref<(Gamepad | null)[]>([])
let raf = 0

function poll() {
  const raw = navigator.getGamepads?.()
  pads.value = raw ? Array.from(raw) : []
  raf = requestAnimationFrame(poll)
}

onMounted(() => {
  poll()
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="hw-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <template
      v-for="(gp, i) in pads"
      :key="'g' + i"
    >
      <div
        v-if="gp"
        class="pad-card"
      >
        <h2 class="pad-title">{{ t("padTitle", { n: i }) }}</h2>
        <p class="meta">{{ t("idLabel") }} {{ gp.id || "—" }}</p>
        <p class="meta">{{ t("mappingLabel") }} {{ gp.mapping || "—" }}</p>

        <h3 class="sub">{{ t("axes") }}</h3>
        <div
          v-for="(a, ai) in gp.axes"
          :key="'a' + ai"
          class="axis-row"
        >
          <span class="axis-name">{{ t("axisN", { n: ai }) }}</span>
          <div class="meter-track">
            <div class="meter-center" />
            <div
              class="meter-thumb"
              :style="{
                left: `calc(${50 + Math.max(-1, Math.min(1, a)) * 50}% - 4px)`,
              }"
            />
          </div>
          <span class="axis-val mono">{{ a.toFixed(3) }}</span>
        </div>

        <h3 class="sub">{{ t("buttons") }}</h3>
        <div class="btn-grid">
          <div
            v-for="(b, bi) in gp.buttons"
            :key="'b' + bi"
            class="btn-cell"
            :data-pressed="b.pressed"
          >
            <span class="bi">{{ bi }}</span>
            <span class="bv mono">{{ b.value.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </template>

    <p
      v-if="!pads.some(Boolean)"
      class="empty"
    >
      {{ t("noGamepad") }}
    </p>

    <p class="hint">{{ t("hintPoll") }}</p>
  </div>
</template>

<style lang="scss" scoped>
.hw-page {
  max-width: 760px;
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

.pad-card {
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.pad-title {
  margin: 0 0 8px;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.meta {
  margin: 4px 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.sub {
  margin: 16px 0 8px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.axis-row {
  display: grid;
  grid-template-columns: 72px 1fr 64px;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 0.85rem;
}

.meter-track {
  position: relative;
  height: 12px;
  background: var(--vp-c-divider);
  border-radius: 6px;
}

.meter-center {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
  background: var(--vp-c-text-3);
  opacity: 0.5;
}

.meter-thumb {
  position: absolute;
  top: 2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}

.axis-val {
  text-align: right;
  color: var(--vp-c-text-2);
}

.mono {
  font-family: var(--vp-font-family-mono);
}

.btn-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn-cell {
  min-width: 52px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  text-align: center;
  font-size: 0.78rem;
  background: var(--vp-c-bg-alt);

  &[data-pressed="true"] {
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
  }
}

.bi {
  display: block;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.bv {
  color: var(--vp-c-text-3);
  font-size: 0.72rem;
}

.empty {
  padding: 24px;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 0.95rem;
}

.hint {
  margin-top: 16px;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  line-height: 1.5;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "手柄测试",
    "desc": "连接手柄后按下任意键或拨动摇杆，页面会每帧读取 Gamepad API 数据。若始终无数据，请确认手柄已被系统识别并在部分浏览器中先按下手柄按键激活。",
    "noGamepad": "未检测到已连接的手柄。请连接设备后按下手柄上的按键再试。",
    "padTitle": "手柄 {n}",
    "idLabel": "ID：",
    "mappingLabel": "映射：",
    "axes": "摇杆轴",
    "axisN": "轴 {n}",
    "buttons": "按键",
    "hintPoll": "提示：Chrome 等浏览器可能需要先与页面交互后再连接手柄；无线手柄请确认接收器或蓝牙已配对。"
  },
  "en": {
    "title_page": "Gamepad Test",
    "desc": "Connect a gamepad and press a button or move a stick. Data is read every frame via the Gamepad API.",
    "noGamepad": "No gamepad detected. Connect one and press any button.",
    "padTitle": "Gamepad {n}",
    "idLabel": "ID: ",
    "mappingLabel": "Mapping: ",
    "axes": "Axes",
    "axisN": "Axis {n}",
    "buttons": "Buttons",
    "hintPoll": "Some browsers need a page interaction first; check wireless pairing."
  },
  "ja": {
    "title_page": "ゲームパッドテスト",
    "desc": "コントローラーを接続しボタンやスティックを操作すると、Gamepad API の値が表示されます。",
    "noGamepad": "ゲームパッドが見つかりません。接続してボタンを押してください。",
    "padTitle": "ゲームパッド {n}",
    "idLabel": "ID: ",
    "mappingLabel": "マッピング: ",
    "axes": "軸",
    "axisN": "軸 {n}",
    "buttons": "ボタン",
    "hintPoll": "ブラウザによってはページ操作後に認識されます。"
  },
  "ko": {
    "title_page": "게임패드 테스트",
    "desc": "게임패드를 연결하고 버튼이나 스틱을 움직이면 Gamepad API 값이 표시됩니다.",
    "noGamepad": "게임패드가 없습니다. 연결 후 버튼을 누르세요.",
    "padTitle": "게임패드 {n}",
    "idLabel": "ID: ",
    "mappingLabel": "매핑: ",
    "axes": "축",
    "axisN": "축 {n}",
    "buttons": "버튼",
    "hintPoll": "일부 브라우저는 페이지 상호작용 후 인식됩니다."
  },
  "fr": {
    "title_page": "Test manette",
    "desc": "Branchez une manette et appuyez sur un bouton. Données lues via l'API Gamepad.",
    "noGamepad": "Aucune manette détectée.",
    "padTitle": "Manette {n}",
    "idLabel": "ID : ",
    "mappingLabel": "Mappage : ",
    "axes": "Axes",
    "axisN": "Axe {n}",
    "buttons": "Boutons",
    "hintPoll": "Une interaction avec la page peut être nécessaire."
  },
  "de": {
    "title_page": "Gamepad-Test",
    "desc": "Gamepad anschließen und Knöpfe oder Sticks bewegen. Auslesen per Gamepad API.",
    "noGamepad": "Kein Gamepad erkannt.",
    "padTitle": "Gamepad {n}",
    "idLabel": "ID: ",
    "mappingLabel": "Mapping: ",
    "axes": "Achsen",
    "axisN": "Achse {n}",
    "buttons": "Tasten",
    "hintPoll": "Manche Browser brauchen zuerst eine Seiteninteraktion."
  },
  "es": {
    "title_page": "Prueba de mando",
    "desc": "Conecta un mando y pulsa botones. Datos vía Gamepad API.",
    "noGamepad": "No se detectó ningún mando.",
    "padTitle": "Mando {n}",
    "idLabel": "ID: ",
    "mappingLabel": "Mapeo: ",
    "axes": "Ejes",
    "axisN": "Eje {n}",
    "buttons": "Botones",
    "hintPoll": "Algunos navegadores requieren interacción previa."
  },
  "pt": {
    "title_page": "Teste de comando",
    "desc": "Ligue um comando e prima botões. Dados via Gamepad API.",
    "noGamepad": "Nenhum comando detetado.",
    "padTitle": "Comando {n}",
    "idLabel": "ID: ",
    "mappingLabel": "Mapeamento: ",
    "axes": "Eixos",
    "axisN": "Eixo {n}",
    "buttons": "Botões",
    "hintPoll": "Pode ser necessária interação com a página."
  },
  "ru": {
    "title_page": "Тест геймпада",
    "desc": "Подключите геймпад и нажимайте кнопки. Данные через Gamepad API.",
    "noGamepad": "Геймпад не обнаружен.",
    "padTitle": "Геймпад {n}",
    "idLabel": "ID: ",
    "mappingLabel": "Схема: ",
    "axes": "Оси",
    "axisN": "Ось {n}",
    "buttons": "Кнопки",
    "hintPoll": "Иногда нужно сначала взаимодействовать со страницей."
  },
  "ar": {
    "title_page": "اختبار يد التحكم",
    "desc": "صِل يد التحكم واضغط الأزرار. البيانات عبر Gamepad API.",
    "noGamepad": "لم يُكتشف أي يد تحكم.",
    "padTitle": "يد التحكم {n}",
    "idLabel": "المعرّف: ",
    "mappingLabel": "التعيين: ",
    "axes": "المحاور",
    "axisN": "محور {n}",
    "buttons": "الأزرار",
    "hintPoll": "قد تحتاج إلى تفاعل مع الصفحة أولاً."
  },
  "hi": {
    "title_page": "गेमपैड टेस्ट",
    "desc": "गेमपैड कनेक्ट करें और बटन दबाएँ। Gamepad API से डेटा।",
    "noGamepad": "कोई गेमपैड नहीं मिला।",
    "padTitle": "गेमपैड {n}",
    "idLabel": "ID: ",
    "mappingLabel": "मैपिंग: ",
    "axes": "अक्ष",
    "axisN": "अक्ष {n}",
    "buttons": "बटन",
    "hintPoll": "कुछ ब्राउज़र में पहले पेज पर क्लिक ज़रूरी।"
  },
  "it": {
    "title_page": "Test gamepad",
    "desc": "Collega un gamepad e premi i pulsanti. Dati tramite Gamepad API.",
    "noGamepad": "Nessun gamepad rilevato.",
    "padTitle": "Gamepad {n}",
    "idLabel": "ID: ",
    "mappingLabel": "Mapping: ",
    "axes": "Assi",
    "axisN": "Asse {n}",
    "buttons": "Pulsanti",
    "hintPoll": "A volte serve prima un'interazione con la pagina."
  },
  "nl": {
    "title_page": "Gamepadtest",
    "desc": "Sluit een gamepad aan en druk op knoppen. Data via Gamepad API.",
    "noGamepad": "Geen gamepad gedetecteerd.",
    "padTitle": "Gamepad {n}",
    "idLabel": "ID: ",
    "mappingLabel": "Mapping: ",
    "axes": "Assen",
    "axisN": "As {n}",
    "buttons": "Knoppen",
    "hintPoll": "Soms is eerst interactie met de pagina nodig."
  },
  "tr": {
    "title_page": "Gamepad testi",
    "desc": "Gamepad bağlayıp düğmelere basın. Gamepad API ile veri.",
    "noGamepad": "Gamepad algılanmadı.",
    "padTitle": "Gamepad {n}",
    "idLabel": "ID: ",
    "mappingLabel": "Eşleme: ",
    "axes": "Eksenler",
    "axisN": "Eksen {n}",
    "buttons": "Düğmeler",
    "hintPoll": "Bazen önce sayfayla etkileşim gerekir."
  },
  "vi": {
    "title_page": "Kiểm tra tay cầm",
    "desc": "Kết nối gamepad và nhấn nút. Dữ liệu qua Gamepad API.",
    "noGamepad": "Chưa phát hiện gamepad.",
    "padTitle": "Gamepad {n}",
    "idLabel": "ID: ",
    "mappingLabel": "Ánh xạ: ",
    "axes": "Trục",
    "axisN": "Trục {n}",
    "buttons": "Nút",
    "hintPoll": "Đôi khi cần tương tác trang trước."
  },
  "th": {
    "title_page": "ทดสอบเกมแพด",
    "desc": "เชื่อมเกมแพดแล้วกดปุ่ม อ่านค่าผ่าน Gamepad API",
    "noGamepad": "ไม่พบเกมแพด",
    "padTitle": "เกมแพด {n}",
    "idLabel": "ID: ",
    "mappingLabel": "แมป: ",
    "axes": "แกน",
    "axisN": "แกน {n}",
    "buttons": "ปุ่ม",
    "hintPoll": "บางเบราว์เซอร์ต้องคลิกหน้าก่อน"
  },
  "id": {
    "title_page": "Tes gamepad",
    "desc": "Sambungkan gamepad dan tekan tombol. Data lewat Gamepad API.",
    "noGamepad": "Tidak ada gamepad terdeteksi.",
    "padTitle": "Gamepad {n}",
    "idLabel": "ID: ",
    "mappingLabel": "Pemetaan: ",
    "axes": "Sumbu",
    "axisN": "Sumbu {n}",
    "buttons": "Tombol",
    "hintPoll": "Kadang perlu interaksi halaman dulu."
  },
  "ms": {
    "title_page": "Ujian gamepad",
    "desc": "Sambung gamepad dan tekan butang. Data melalui Gamepad API.",
    "noGamepad": "Tiada gamepad dikesan.",
    "padTitle": "Gamepad {n}",
    "idLabel": "ID: ",
    "mappingLabel": "Pemetaan: ",
    "axes": "Paksi",
    "axisN": "Paksi {n}",
    "buttons": "Butang",
    "hintPoll": "Kadang perlu interaksi halaman dahulu."
  },
  "pl": {
    "title_page": "Test gamepada",
    "desc": "Podłącz gamepad i naciskaj przyciski. Dane przez Gamepad API.",
    "noGamepad": "Nie wykryto gamepada.",
    "padTitle": "Gamepad {n}",
    "idLabel": "ID: ",
    "mappingLabel": "Mapowanie: ",
    "axes": "Osie",
    "axisN": "Oś {n}",
    "buttons": "Przyciski",
    "hintPoll": "Czasem potrzebna jest interakcja ze stroną."
  },
  "uk": {
    "title_page": "Тест геймпада",
    "desc": "Підключіть геймпад і натискайте кнопки. Дані через Gamepad API.",
    "noGamepad": "Геймпад не виявлено.",
    "padTitle": "Геймпад {n}",
    "idLabel": "ID: ",
    "mappingLabel": "Мапінг: ",
    "axes": "Осі",
    "axisN": "Вісь {n}",
    "buttons": "Кнопки",
    "hintPoll": "Іноді потрібна взаємодія зі сторінкою спочатку."
  }
}
</i18n>
