<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

const { t } = useI18n()

const supported = ref(false)
const customMs = ref(200)
const lastPattern = ref("")

function canVibrate() {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function"
}

function run(pattern: number | number[], label: string) {
  if (!canVibrate()) {
    ElMessage({ message: t("unsupported"), type: "warning" })
    return
  }
  navigator.vibrate(0)
  const ok = navigator.vibrate(pattern)
  lastPattern.value = label
  if (!ok) ElMessage({ message: t("unsupported"), type: "warning" })
}

function stop() {
  if (canVibrate()) navigator.vibrate(0)
  lastPattern.value = ""
}

onMounted(() => {
  supported.value = canVibrate()
})
</script>

<template>
  <div class="hw-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <p class="status-line">
      <span class="status-label">{{ t("statusLabel") }}</span>
      <span
        class="status-value"
        :data-ok="supported"
      >{{ supported ? t("supported") : t("unsupported") }}</span>
    </p>

    <div class="toolbar">
      <el-button
        type="primary"
        :disabled="!supported"
        @click="run(80, t('short'))"
      >
        {{ t("short") }}
      </el-button>
      <el-button
        :disabled="!supported"
        @click="run(200, t('medium'))"
      >
        {{ t("medium") }}
      </el-button>
      <el-button
        :disabled="!supported"
        @click="run(500, t('long'))"
      >
        {{ t("long") }}
      </el-button>
      <el-button
        :disabled="!supported"
        @click="run([120, 80, 120, 80, 280], t('heartbeat'))"
      >
        {{ t("heartbeat") }}
      </el-button>
      <el-button
        :disabled="!supported"
        @click="run([80, 80, 80, 80, 80, 200, 200, 80, 200, 80, 200, 200, 80, 80, 80], t('sos'))"
      >
        {{ t("sos") }}
      </el-button>
      <el-button
        :disabled="!supported"
        @click="stop"
      >
        {{ t("stop") }}
      </el-button>
    </div>

    <div class="custom">
      <span class="k">{{ t("duration") }}</span>
      <el-input-number
        v-model="customMs"
        :min="20"
        :max="3000"
        :step="20"
        :disabled="!supported"
      />
      <el-button
        :disabled="!supported"
        @click="run(customMs, t('custom'))"
      >
        {{ t("custom") }}
      </el-button>
    </div>

    <p
      v-if="lastPattern"
      class="last"
    >
      {{ t("last", { name: lastPattern }) }}
    </p>
    <p class="hint">{{ t("hint") }}</p>
  </div>
</template>

<style lang="scss" scoped>
.hw-page {
  max-width: 720px;
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

.status-line {
  margin: 0 0 16px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.status-label {
  margin-right: 8px;
}

.status-value {
  font-weight: 600;
  color: var(--vp-c-danger-1);

  &[data-ok="true"] {
    color: var(--vp-c-brand-1);
  }
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.custom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.k {
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}

.last {
  margin: 0 0 12px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
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
    "title_page": "震动测试",
    "desc": "点击按钮触发手机或平板的振动马达。可试短震、长震、心跳与 SOS 节奏，也可自定义时长。",
    "statusLabel": "接口状态",
    "supported": "当前浏览器支持震动",
    "unsupported": "当前环境不支持 Vibration API（常见于 iOS Safari 与桌面浏览器）",
    "short": "短震",
    "medium": "中震",
    "long": "长震",
    "heartbeat": "心跳",
    "sos": "SOS",
    "custom": "自定义震动",
    "duration": "时长（毫秒）",
    "stop": "停止",
    "last": "刚才触发：{name}",
    "hint": "需真机且浏览器实现了 navigator.vibrate。把系统声音/触感开到允许振动；部分机型在静音时仍会震。"
  },
  "en": {
    "title_page": "Vibration Test",
    "desc": "Trigger the device vibration motor. Try short, long, heartbeat, SOS, or a custom duration.",
    "statusLabel": "API status",
    "supported": "Vibration is supported",
    "unsupported": "Vibration API is not available (common on iOS Safari and desktops)",
    "short": "Short",
    "medium": "Medium",
    "long": "Long",
    "heartbeat": "Heartbeat",
    "sos": "SOS",
    "custom": "Custom buzz",
    "duration": "Duration (ms)",
    "stop": "Stop",
    "last": "Last: {name}",
    "hint": "Needs a real device with navigator.vibrate. Allow haptics in system settings."
  },
  "ja": {
    "title_page": "振動テスト",
    "desc": "端末の振動モーターを鳴らします。短・長・心拍・SOS・任意時間に対応。",
    "statusLabel": "API 状態",
    "supported": "振動に対応",
    "unsupported": "Vibration API 非対応（iOS Safari や PC でよくあります）",
    "short": "短",
    "medium": "中",
    "long": "長",
    "heartbeat": "心拍",
    "sos": "SOS",
    "custom": "任意振動",
    "duration": "時間（ms）",
    "stop": "停止",
    "last": "直前：{name}",
    "hint": "navigator.vibrate 対応の実機が必要です。触覚を許可してください。"
  },
  "ko": {
    "title_page": "진동 테스트",
    "desc": "기기 진동 모터를 울립니다. 짧음, 김, 심박, SOS, 사용자 지정 길이를 시험하세요.",
    "statusLabel": "API 상태",
    "supported": "진동 지원",
    "unsupported": "Vibration API 미지원 (iOS Safari·데스크톱에서 흔함)",
    "short": "짧게",
    "medium": "중간",
    "long": "길게",
    "heartbeat": "심박",
    "sos": "SOS",
    "custom": "사용자 지정",
    "duration": "시간(ms)",
    "stop": "중지",
    "last": "방금: {name}",
    "hint": "navigator.vibrate를 지원하는 실제 기기가 필요합니다."
  },
  "fr": {
    "title_page": "Test vibration",
    "desc": "Déclenche le vibreur. Court, long, battement, SOS ou durée perso.",
    "statusLabel": "État API",
    "supported": "Vibration prise en charge",
    "unsupported": "API Vibration indisponible (souvent iOS Safari et bureau)",
    "short": "Court",
    "medium": "Moyen",
    "long": "Long",
    "heartbeat": "Battement",
    "sos": "SOS",
    "custom": "Perso",
    "duration": "Durée (ms)",
    "stop": "Arrêter",
    "last": "Dernier : {name}",
    "hint": "Nécessite un appareil avec navigator.vibrate."
  },
  "de": {
    "title_page": "Vibrationstest",
    "desc": "Vibrationsmotor auslösen: kurz, lang, Herzschlag, SOS oder eigene Dauer.",
    "statusLabel": "API-Status",
    "supported": "Vibration unterstützt",
    "unsupported": "Vibration API nicht verfügbar (oft iOS Safari und Desktop)",
    "short": "Kurz",
    "medium": "Mittel",
    "long": "Lang",
    "heartbeat": "Herzschlag",
    "sos": "SOS",
    "custom": "Eigene",
    "duration": "Dauer (ms)",
    "stop": "Stopp",
    "last": "Zuletzt: {name}",
    "hint": "Benötigt ein Gerät mit navigator.vibrate."
  },
  "es": {
    "title_page": "Prueba de vibración",
    "desc": "Activa el motor de vibración: corta, larga, latido, SOS o duración propia.",
    "statusLabel": "Estado de la API",
    "supported": "Vibración compatible",
    "unsupported": "API Vibration no disponible (suele ocurrir en iOS Safari y escritorio)",
    "short": "Corta",
    "medium": "Media",
    "long": "Larga",
    "heartbeat": "Latido",
    "sos": "SOS",
    "custom": "Personalizada",
    "duration": "Duración (ms)",
    "stop": "Parar",
    "last": "Último: {name}",
    "hint": "Hace falta un dispositivo con navigator.vibrate."
  },
  "pt": {
    "title_page": "Teste de vibração",
    "desc": "Aciona o motor de vibração: curta, longa, batimento, SOS ou duração própria.",
    "statusLabel": "Estado da API",
    "supported": "Vibração suportada",
    "unsupported": "API Vibration indisponível (comum no iOS Safari e no computador)",
    "short": "Curta",
    "medium": "Média",
    "long": "Longa",
    "heartbeat": "Batimento",
    "sos": "SOS",
    "custom": "Personalizada",
    "duration": "Duração (ms)",
    "stop": "Parar",
    "last": "Último: {name}",
    "hint": "Precisa de um aparelho com navigator.vibrate."
  },
  "ru": {
    "title_page": "Тест вибрации",
    "desc": "Запуск вибромотора: коротко, долго, пульс, SOS или своя длительность.",
    "statusLabel": "Статус API",
    "supported": "Вибрация поддерживается",
    "unsupported": "Vibration API недоступен (часто на iOS Safari и ПК)",
    "short": "Коротко",
    "medium": "Средне",
    "long": "Долго",
    "heartbeat": "Пульс",
    "sos": "SOS",
    "custom": "Своя",
    "duration": "Длительность (мс)",
    "stop": "Стоп",
    "last": "Последнее: {name}",
    "hint": "Нужно устройство с navigator.vibrate."
  },
  "ar": {
    "title_page": "اختبار الاهتزاز",
    "desc": "تشغيل محرك الاهتزاز: قصير، طويل، نبض، SOS أو مدة مخصصة.",
    "statusLabel": "حالة الواجهة",
    "supported": "الاهتزاز مدعوم",
    "unsupported": "واجهة الاهتزاز غير متاحة (شائع في iOS Safari وسطح المكتب)",
    "short": "قصير",
    "medium": "متوسط",
    "long": "طويل",
    "heartbeat": "نبض",
    "sos": "SOS",
    "custom": "مخصص",
    "duration": "المدة (مللي ثانية)",
    "stop": "إيقاف",
    "last": "الأخير: {name}",
    "hint": "يلزم جهاز يدعم navigator.vibrate."
  },
  "hi": {
    "title_page": "कंपन टेस्ट",
    "desc": "डिवाइस वाइब्रेशन चलाएँ: छोटा, लंबा, धड़कन, SOS या अपनी अवधि।",
    "statusLabel": "API स्थिति",
    "supported": "कंपन समर्थित",
    "unsupported": "Vibration API उपलब्ध नहीं (iOS Safari और डेस्कटॉप पर आम)",
    "short": "छोटा",
    "medium": "मध्यम",
    "long": "लंबा",
    "heartbeat": "धड़कन",
    "sos": "SOS",
    "custom": "कस्टम",
    "duration": "अवधि (ms)",
    "stop": "रोकें",
    "last": "अभी: {name}",
    "hint": "navigator.vibrate वाले असली डिवाइस की ज़रूरत है।"
  },
  "it": {
    "title_page": "Test vibrazione",
    "desc": "Attiva il motore: breve, lunga, battito, SOS o durata personalizzata.",
    "statusLabel": "Stato API",
    "supported": "Vibrazione supportata",
    "unsupported": "API Vibration non disponibile (spesso su iOS Safari e desktop)",
    "short": "Breve",
    "medium": "Media",
    "long": "Lunga",
    "heartbeat": "Battito",
    "sos": "SOS",
    "custom": "Personalizzata",
    "duration": "Durata (ms)",
    "stop": "Stop",
    "last": "Ultimo: {name}",
    "hint": "Serve un dispositivo con navigator.vibrate."
  },
  "nl": {
    "title_page": "Trillingstest",
    "desc": "Trillingsmotor: kort, lang, hartslag, SOS of eigen duur.",
    "statusLabel": "API-status",
    "supported": "Trilling ondersteund",
    "unsupported": "Vibration API niet beschikbaar (vaak iOS Safari en desktop)",
    "short": "Kort",
    "medium": "Gemiddeld",
    "long": "Lang",
    "heartbeat": "Hartslag",
    "sos": "SOS",
    "custom": "Aangepast",
    "duration": "Duur (ms)",
    "stop": "Stop",
    "last": "Laatst: {name}",
    "hint": "Vereist een apparaat met navigator.vibrate."
  },
  "tr": {
    "title_page": "Titreşim testi",
    "desc": "Titreşim motorunu çalıştırın: kısa, uzun, kalp atışı, SOS veya özel süre.",
    "statusLabel": "API durumu",
    "supported": "Titreşim destekleniyor",
    "unsupported": "Vibration API yok (iOS Safari ve masaüstünde sık)",
    "short": "Kısa",
    "medium": "Orta",
    "long": "Uzun",
    "heartbeat": "Kalp",
    "sos": "SOS",
    "custom": "Özel",
    "duration": "Süre (ms)",
    "stop": "Durdur",
    "last": "Son: {name}",
    "hint": "navigator.vibrate destekleyen gerçek cihaz gerekir."
  },
  "vi": {
    "title_page": "Kiểm tra rung",
    "desc": "Bật motor rung: ngắn, dài, nhịp tim, SOS hoặc thời lượng tự chọn.",
    "statusLabel": "Trạng thái API",
    "supported": "Hỗ trợ rung",
    "unsupported": "Không có Vibration API (thường gặp trên iOS Safari và máy tính)",
    "short": "Ngắn",
    "medium": "Vừa",
    "long": "Dài",
    "heartbeat": "Nhịp tim",
    "sos": "SOS",
    "custom": "Tùy chỉnh",
    "duration": "Thời lượng (ms)",
    "stop": "Dừng",
    "last": "Vừa rồi: {name}",
    "hint": "Cần máy thật có navigator.vibrate."
  },
  "th": {
    "title_page": "ทดสอบการสั่น",
    "desc": "สั่นมอเตอร์เครื่อง: สั้น ยาว หัวใจ SOS หรือกำหนดเวลาเอง",
    "statusLabel": "สถานะ API",
    "supported": "รองรับการสั่น",
    "unsupported": "ไม่มี Vibration API (พบบ่อยใน iOS Safari และคอมพิวเตอร์)",
    "short": "สั้น",
    "medium": "กลาง",
    "long": "ยาว",
    "heartbeat": "หัวใจ",
    "sos": "SOS",
    "custom": "กำหนดเอง",
    "duration": "ระยะเวลา (ms)",
    "stop": "หยุด",
    "last": "ล่าสุด: {name}",
    "hint": "ต้องใช้อุปกรณ์จริงที่รองรับ navigator.vibrate"
  },
  "id": {
    "title_page": "Tes getar",
    "desc": "Jalankan motor getar: pendek, panjang, detak, SOS, atau durasi sendiri.",
    "statusLabel": "Status API",
    "supported": "Getar didukung",
    "unsupported": "Vibration API tidak ada (umum di iOS Safari dan desktop)",
    "short": "Pendek",
    "medium": "Sedang",
    "long": "Panjang",
    "heartbeat": "Detak",
    "sos": "SOS",
    "custom": "Kustom",
    "duration": "Durasi (ms)",
    "stop": "Berhenti",
    "last": "Terakhir: {name}",
    "hint": "Perlu perangkat nyata dengan navigator.vibrate."
  },
  "ms": {
    "title_page": "Ujian getaran",
    "desc": "Hidupkan motor getar: pendek, panjang, degupan, SOS atau tempoh sendiri.",
    "statusLabel": "Status API",
    "supported": "Getaran disokong",
    "unsupported": "API Getaran tiada (biasa di iOS Safari dan desktop)",
    "short": "Pendek",
    "medium": "Sederhana",
    "long": "Panjang",
    "heartbeat": "Degupan",
    "sos": "SOS",
    "custom": "Tersuai",
    "duration": "Tempoh (ms)",
    "stop": "Henti",
    "last": "Terakhir: {name}",
    "hint": "Perlu peranti sebenar dengan navigator.vibrate."
  },
  "pl": {
    "title_page": "Test wibracji",
    "desc": "Włącz silnik wibracji: krótko, długo, bicie serca, SOS lub własny czas.",
    "statusLabel": "Status API",
    "supported": "Wibracja obsługiwana",
    "unsupported": "Brak Vibration API (często iOS Safari i pulpit)",
    "short": "Krótko",
    "medium": "Średnio",
    "long": "Długo",
    "heartbeat": "Tętno",
    "sos": "SOS",
    "custom": "Własna",
    "duration": "Czas (ms)",
    "stop": "Stop",
    "last": "Ostatnio: {name}",
    "hint": "Potrzebne urządzenie z navigator.vibrate."
  },
  "uk": {
    "title_page": "Тест вібрації",
    "desc": "Запуск вібромотора: коротко, довго, пульс, SOS або своя тривалість.",
    "statusLabel": "Статус API",
    "supported": "Вібрація підтримується",
    "unsupported": "Vibration API недоступний (часто на iOS Safari і ПК)",
    "short": "Коротко",
    "medium": "Середньо",
    "long": "Довго",
    "heartbeat": "Пульс",
    "sos": "SOS",
    "custom": "Своя",
    "duration": "Тривалість (мс)",
    "stop": "Стоп",
    "last": "Останнє: {name}",
    "hint": "Потрібен пристрій з navigator.vibrate."
  },
  "sv": {
    "title_page": "Vibrationstest",
    "desc": "Starta vibrationsmotorn: kort, lång, hjärtslag, SOS eller egen tid.",
    "statusLabel": "API-status",
    "supported": "Vibration stöds",
    "unsupported": "Vibration API saknas (vanligt på iOS Safari och dator)",
    "short": "Kort",
    "medium": "Medel",
    "long": "Lång",
    "heartbeat": "Hjärtslag",
    "sos": "SOS",
    "custom": "Anpassad",
    "duration": "Tid (ms)",
    "stop": "Stopp",
    "last": "Senast: {name}",
    "hint": "Kräver en enhet med navigator.vibrate."
  },
  "zh-TW": {
    "title_page": "震動測試",
    "desc": "點擊按鈕觸發手機或平板的振動馬達。可試短震、長震、心跳與 SOS 節奏，也可自訂時長。",
    "statusLabel": "介面狀態",
    "supported": "目前瀏覽器支援震動",
    "unsupported": "目前環境不支援 Vibration API（常見於 iOS Safari 與桌面瀏覽器）",
    "short": "短震",
    "medium": "中震",
    "long": "長震",
    "heartbeat": "心跳",
    "sos": "SOS",
    "custom": "自訂震動",
    "duration": "時長（毫秒）",
    "stop": "停止",
    "last": "剛才觸發：{name}",
    "hint": "需真機且瀏覽器實作了 navigator.vibrate。把系統觸感開到允許振動。"
  }
}
</i18n>
