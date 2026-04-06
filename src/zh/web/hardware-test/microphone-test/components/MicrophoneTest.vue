<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

const { t } = useI18n()

type Status = "idle" | "requesting" | "active" | "denied" | "error"

const status = ref<Status>("idle")
const canvasRef = ref<HTMLCanvasElement | null>(null)
const wrapRef = ref<HTMLElement | null>(null)

let mediaStream: MediaStream | null = null
let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
let rafId = 0
const timeData = shallowRef<Uint8Array | null>(null)
let resizeObserver: ResizeObserver | null = null

function syncCanvasSize() {
  const canvas = canvasRef.value
  const wrap = wrapRef.value
  if (!canvas || !wrap) return
  const rect = wrap.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  const w = Math.max(1, Math.floor(rect.width * dpr))
  const h = Math.max(1, Math.floor(rect.height * dpr))
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
}

function cssVar(name: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || (name.includes("brand") ? "#3451b2" : "#f6f6f7")
}

function drawFrame() {
  const canvas = canvasRef.value
  if (!canvas || !analyser || !timeData.value) return
  syncCanvasSize()
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  analyser.getByteTimeDomainData(timeData.value)
  const w = canvas.width
  const h = canvas.height
  ctx.fillStyle = cssVar("--vp-c-bg-soft")
  ctx.fillRect(0, 0, w, h)
  ctx.lineWidth = Math.max(1, dprLineWidth())
  ctx.strokeStyle = cssVar("--vp-c-brand-1")
  ctx.beginPath()
  const len = timeData.value.length
  const slice = w / (len - 1)
  let x = 0
  for (let i = 0; i < len; i++) {
    const v = (timeData.value[i]! - 128) / 128
    const y = h / 2 - v * (h * 0.45)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
    x += slice
  }
  ctx.stroke()
  rafId = requestAnimationFrame(drawFrame)
}

function dprLineWidth(): number {
  return (window.devicePixelRatio || 1) * 1.5
}

function cleanupStream() {
  cancelAnimationFrame(rafId)
  rafId = 0
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    mediaStream = null
  }
  if (audioContext) {
    void audioContext.close()
    audioContext = null
  }
  analyser = null
  timeData.value = null
}

async function start() {
  if (status.value === "requesting" || status.value === "active") return
  if (!navigator.mediaDevices?.getUserMedia) {
    status.value = "error"
    ElMessage({ message: t("msgNoApi"), type: "error" })
    return
  }
  status.value = "requesting"
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    })
    mediaStream = stream
    const ctx = new AudioContext()
    audioContext = ctx
    if (ctx.state === "suspended") await ctx.resume()
    const source = ctx.createMediaStreamSource(stream)
    const node = ctx.createAnalyser()
    node.fftSize = 2048
    node.smoothingTimeConstant = 0.65
    source.connect(node)
    analyser = node
    timeData.value = new Uint8Array(node.fftSize)
    status.value = "active"
    syncCanvasSize()
    drawFrame()
  } catch (e: unknown) {
    cleanupStream()
    const name = e && typeof e === "object" && "name" in e ? String((e as Error).name) : ""
    if (
      name === "NotAllowedError" ||
      name === "PermissionDeniedError"
    ) {
      status.value = "denied"
      ElMessage({ message: t("msgDenied"), type: "warning" })
    } else {
      status.value = "error"
      ElMessage({ message: t("msgError"), type: "error" })
    }
  }
}

function stop() {
  cancelAnimationFrame(rafId)
  rafId = 0
  cleanupStream()
  status.value = "idle"
}

onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    if (status.value === "active") syncCanvasSize()
  })
  if (wrapRef.value) resizeObserver.observe(wrapRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  stop()
})
</script>

<template>
  <div class="mic-test">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <el-button
        type="primary"
        :disabled="status === 'requesting' || status === 'active'"
        @click="start"
      >
        {{ t("startBtn") }}
      </el-button>
      <el-button
        :disabled="status !== 'active'"
        @click="stop"
      >
        {{ t("stopBtn") }}
      </el-button>
    </div>

    <p class="status-line">
      <span class="status-label">{{ t("statusLabel") }}</span>
      <span
        class="status-value"
        :data-state="status"
      >{{ t(`status_${status}`) }}</span>
    </p>

    <div
      ref="wrapRef"
      class="canvas-wrap"
    >
      <canvas ref="canvasRef" />
    </div>

    <p class="hint">{{ t("hintWave") }}</p>
    <p class="hint muted">{{ t("hintHttps") }}</p>
  </div>
</template>

<style lang="scss" scoped>
.mic-test {
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
  margin: 0 0 20px;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.status-line {
  margin: 0 0 14px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.status-label {
  margin-right: 8px;
  font-weight: 500;
}

.status-value[data-state="active"] {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.status-value[data-state="denied"],
.status-value[data-state="error"] {
  color: var(--vp-c-danger-2);
  font-weight: 600;
}

.canvas-wrap {
  width: 100%;
  height: 180px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.canvas-wrap canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.hint {
  margin: 14px 0 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;

  &.muted {
    color: var(--vp-c-text-3);
    margin-top: 8px;
  }
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "麦克风测试",
    "desc": "点击开始后，浏览器会请求使用麦克风；授权后即可看到实时波形。仅用于检测输入是否工作，不会上传录音。",
    "startBtn": "开始测试",
    "stopBtn": "停止",
    "statusLabel": "状态：",
    "status_idle": "未开始",
    "status_requesting": "正在请求权限…",
    "status_active": "正在采集",
    "status_denied": "已拒绝麦克风权限",
    "status_error": "无法访问麦克风",
    "hintWave": "波形为时域信号；有声音时曲线应明显起伏。",
    "hintHttps": "多数浏览器仅在 HTTPS 或 localhost 下允许访问麦克风。",
    "msgDenied": "请在浏览器设置中允许本站使用麦克风。",
    "msgError": "无法打开麦克风，请检查设备与浏览器设置。",
    "msgNoApi": "当前环境不支持 getUserMedia。"
  },
  "en": {
    "title_page": "Microphone Test",
    "desc": "Click Start and allow microphone access to see a live waveform. Audio stays in your browser and is not uploaded.",
    "startBtn": "Start",
    "stopBtn": "Stop",
    "statusLabel": "Status: ",
    "status_idle": "Idle",
    "status_requesting": "Requesting permission…",
    "status_active": "Listening",
    "status_denied": "Microphone permission denied",
    "status_error": "Cannot access microphone",
    "hintWave": "This is a time-domain waveform; it should move when you speak.",
    "hintHttps": "Most browsers only allow the mic on HTTPS or localhost.",
    "msgDenied": "Allow microphone access in your browser settings.",
    "msgError": "Could not open the microphone. Check device and settings.",
    "msgNoApi": "getUserMedia is not supported here."
  },
  "ja": {
    "title_page": "マイクテスト",
    "desc": "「開始」を押してマイクの許可を与えると、波形が表示されます。音声はブラウザ内のみでアップロードされません。",
    "startBtn": "開始",
    "stopBtn": "停止",
    "statusLabel": "状態：",
    "status_idle": "未開始",
    "status_requesting": "許可を要求中…",
    "status_active": "収集中",
    "status_denied": "マイクの許可が拒否されました",
    "status_error": "マイクにアクセスできません",
    "hintWave": "時系列の波形です。声を出すと動きます。",
    "hintHttps": "多くのブラウザでは HTTPS または localhost でのみマイクを許可します。",
    "msgDenied": "ブラウザの設定でマイクを許可してください。",
    "msgError": "マイクを開けません。デバイスと設定を確認してください。",
    "msgNoApi": "この環境では getUserMedia が使えません。"
  },
  "ko": {
    "title_page": "마이크 테스트",
    "desc": "시작을 누르고 마이크 권한을 허용하면 실시간 파형이 표시됩니다. 오디오는 브라우저에만 머물며 업로드되지 않습니다.",
    "startBtn": "시작",
    "stopBtn": "중지",
    "statusLabel": "상태: ",
    "status_idle": "대기",
    "status_requesting": "권한 요청 중…",
    "status_active": "수신 중",
    "status_denied": "마이크 권한이 거부됨",
    "status_error": "마이크에 액세스할 수 없음",
    "hintWave": "시간 영역 파형입니다. 말하면 움직입니다.",
    "hintHttps": "대부분의 브라우저는 HTTPS 또는 localhost에서만 마이크를 허용합니다.",
    "msgDenied": "브라우저 설정에서 마이크를 허용하세요.",
    "msgError": "마이크를 열 수 없습니다. 기기와 설정을 확인하세요.",
    "msgNoApi": "이 환경에서는 getUserMedia를 지원하지 않습니다."
  },
  "fr": {
    "title_page": "Test du microphone",
    "desc": "Cliquez sur Démarrer et autorisez le micro pour voir la forme d'onde en direct. L'audio reste dans le navigateur.",
    "startBtn": "Démarrer",
    "stopBtn": "Arrêter",
    "statusLabel": "État : ",
    "status_idle": "Inactif",
    "status_requesting": "Demande d'autorisation…",
    "status_active": "Écoute",
    "status_denied": "Autorisation micro refusée",
    "status_error": "Impossible d'accéder au micro",
    "hintWave": "Forme d'onde temporelle ; elle bouge quand vous parlez.",
    "hintHttps": "Souvent autorisé seulement en HTTPS ou sur localhost.",
    "msgDenied": "Autorisez le micro dans les paramètres du navigateur.",
    "msgError": "Impossible d'ouvrir le micro. Vérifiez l'appareil.",
    "msgNoApi": "getUserMedia n'est pas disponible ici."
  },
  "de": {
    "title_page": "Mikrofontest",
    "desc": "Start klicken und Mikrofon erlauben, um die Wellenform live zu sehen. Audio wird nicht hochgeladen.",
    "startBtn": "Start",
    "stopBtn": "Stopp",
    "statusLabel": "Status: ",
    "status_idle": "Bereit",
    "status_requesting": "Berechtigung wird angefragt…",
    "status_active": "Aktiv",
    "status_denied": "Mikrofonzugriff verweigert",
    "status_error": "Mikrofon nicht erreichbar",
    "hintWave": "Zeitbereichs-Wellenform; bewegt sich bei Sprache.",
    "hintHttps": "Meist nur unter HTTPS oder localhost erlaubt.",
    "msgDenied": "Mikrofon in den Browsereinstellungen erlauben.",
    "msgError": "Mikrofon konnte nicht geöffnet werden.",
    "msgNoApi": "getUserMedia wird hier nicht unterstützt."
  },
  "es": {
    "title_page": "Prueba de micrófono",
    "desc": "Pulsa Iniciar y permite el micrófono para ver la forma de onda en vivo. El audio no se sube.",
    "startBtn": "Iniciar",
    "stopBtn": "Detener",
    "statusLabel": "Estado: ",
    "status_idle": "Inactivo",
    "status_requesting": "Solicitando permiso…",
    "status_active": "Escuchando",
    "status_denied": "Permiso de micrófono denegado",
    "status_error": "No se puede acceder al micrófono",
    "hintWave": "Forma de onda en el tiempo; se mueve al hablar.",
    "hintHttps": "A menudo solo HTTPS o localhost.",
    "msgDenied": "Permite el micrófono en la configuración del navegador.",
    "msgError": "No se pudo abrir el micrófono.",
    "msgNoApi": "getUserMedia no está disponible aquí."
  },
  "pt": {
    "title_page": "Teste de microfone",
    "desc": "Clique em Iniciar e permita o microfone para ver a forma de onda ao vivo. O áudio não é enviado.",
    "startBtn": "Iniciar",
    "stopBtn": "Parar",
    "statusLabel": "Estado: ",
    "status_idle": "Parado",
    "status_requesting": "A pedir permissão…",
    "status_active": "A escutar",
    "status_denied": "Permissão do microfone negada",
    "status_error": "Não é possível aceder ao microfone",
    "hintWave": "Forma de onda no tempo; move-se ao falar.",
    "hintHttps": "Muitas vezes só HTTPS ou localhost.",
    "msgDenied": "Permita o microfone nas definições do navegador.",
    "msgError": "Não foi possível abrir o microfone.",
    "msgNoApi": "getUserMedia não é suportado aqui."
  },
  "ru": {
    "title_page": "Проверка микрофона",
    "desc": "Нажмите «Старт» и разрешите доступ к микрофону, чтобы увидеть волну в реальном времени. Звук не загружается.",
    "startBtn": "Старт",
    "stopBtn": "Стоп",
    "statusLabel": "Статус: ",
    "status_idle": "Ожидание",
    "status_requesting": "Запрос разрешения…",
    "status_active": "Запись",
    "status_denied": "Доступ к микрофону запрещён",
    "status_error": "Нет доступа к микрофону",
    "hintWave": "Волна во времени; движется при речи.",
    "hintHttps": "Обычно только HTTPS или localhost.",
    "msgDenied": "Разрешите микрофон в настройках браузера.",
    "msgError": "Не удалось открыть микрофон.",
    "msgNoApi": "getUserMedia недоступен."
  },
  "ar": {
    "title_page": "اختبار الميكروفون",
    "desc": "اضغط ابدأ واسمح بالميكروفون لرؤية الموجة مباشرة. الصوت لا يُرفع.",
    "startBtn": "بدء",
    "stopBtn": "إيقاف",
    "statusLabel": "الحالة: ",
    "status_idle": "خامل",
    "status_requesting": "جارٍ طلب الإذن…",
    "status_active": "يستمع",
    "status_denied": "تم رفض إذن الميكروفون",
    "status_error": "تعذر الوصول إلى الميكروفون",
    "hintWave": "موجة زمنية؛ تتحرك عند التحدث.",
    "hintHttps": "غالبًا يُسمح فقط عبر HTTPS أو localhost.",
    "msgDenied": "اسمح بالميكروفون في إعدادات المتصفح.",
    "msgError": "تعذر فتح الميكروفون.",
    "msgNoApi": "getUserMedia غير متوفر هنا."
  },
  "hi": {
    "title_page": "माइक्रोफ़ोन टेस्ट",
    "desc": "शुरू करें दबाएँ और माइक की अनुमति दें ताकि लहर दिखे। ऑडियो अपलोड नहीं होता।",
    "startBtn": "शुरू",
    "stopBtn": "रोकें",
    "statusLabel": "स्थिति: ",
    "status_idle": "निष्क्रिय",
    "status_requesting": "अनुमति माँग रहा है…",
    "status_active": "सुन रहा है",
    "status_denied": "माइक अनुमति अस्वीकृत",
    "status_error": "माइक तक पहुँच नहीं",
    "hintWave": "समय-डोमेन तरंग; बोलने पर हिलती है।",
    "hintHttps": "अक्सर केवल HTTPS या localhost।",
    "msgDenied": "ब्राउज़र सेटिंग में माइक अनुमति दें।",
    "msgError": "माइक नहीं खुल सका।",
    "msgNoApi": "यहाँ getUserMedia उपलब्ध नहीं।"
  },
  "it": {
    "title_page": "Test microfono",
    "desc": "Clicca Avvia e consenti il microfono per vedere l'onda in tempo reale. L'audio non viene caricato.",
    "startBtn": "Avvia",
    "stopBtn": "Stop",
    "statusLabel": "Stato: ",
    "status_idle": "Inattivo",
    "status_requesting": "Richiesta permesso…",
    "status_active": "In ascolto",
    "status_denied": "Permesso microfono negato",
    "status_error": "Impossibile accedere al microfono",
    "hintWave": "Onda nel dominio del tempo; si muove parlando.",
    "hintHttps": "Spesso solo HTTPS o localhost.",
    "msgDenied": "Consenti il microfono nelle impostazioni del browser.",
    "msgError": "Impossibile aprire il microfono.",
    "msgNoApi": "getUserMedia non supportato qui."
  },
  "nl": {
    "title_page": "Microfoontest",
    "desc": "Klik Start en sta de microfoon toe om de golf live te zien. Audio wordt niet geüpload.",
    "startBtn": "Start",
    "stopBtn": "Stop",
    "statusLabel": "Status: ",
    "status_idle": "Inactief",
    "status_requesting": "Toestemming vragen…",
    "status_active": "Luistert",
    "status_denied": "Microfoontoegang geweigerd",
    "status_error": "Geen toegang tot microfoon",
    "hintWave": "Tijdsgolf; beweegt als je praat.",
    "hintHttps": "Vaak alleen HTTPS of localhost.",
    "msgDenied": "Sta de microfoon toe in de browserinstellingen.",
    "msgError": "Microfoon kon niet worden geopend.",
    "msgNoApi": "getUserMedia wordt hier niet ondersteund."
  },
  "tr": {
    "title_page": "Mikrofon testi",
    "desc": "Başlat'a tıklayıp mikrofona izin verin; dalga şeklini canlı görün. Ses yüklenmez.",
    "startBtn": "Başlat",
    "stopBtn": "Durdur",
    "statusLabel": "Durum: ",
    "status_idle": "Beklemede",
    "status_requesting": "İzin isteniyor…",
    "status_active": "Dinleniyor",
    "status_denied": "Mikrofon izni reddedildi",
    "status_error": "Mikrofona erişilemiyor",
    "hintWave": "Zaman alanı dalgası; konuşunca hareket eder.",
    "hintHttps": "Genelde yalnızca HTTPS veya localhost.",
    "msgDenied": "Tarayıcı ayarlarından mikrofona izin verin.",
    "msgError": "Mikrofon açılamadı.",
    "msgNoApi": "getUserMedia burada desteklenmiyor."
  },
  "vi": {
    "title_page": "Kiểm tra mic",
    "desc": "Nhấn Bắt đầu và cho phép mic để xem sóng theo thời gian thực. Âm thanh không tải lên.",
    "startBtn": "Bắt đầu",
    "stopBtn": "Dừng",
    "statusLabel": "Trạng thái: ",
    "status_idle": "Chưa chạy",
    "status_requesting": "Đang xin quyền…",
    "status_active": "Đang thu",
    "status_denied": "Đã từ chối quyền mic",
    "status_error": "Không truy cập được mic",
    "hintWave": "Sóng miền thời gian; nói sẽ thấy dao động.",
    "hintHttps": "Thường chỉ HTTPS hoặc localhost.",
    "msgDenied": "Hãy cho phép mic trong cài đặt trình duyệt.",
    "msgError": "Không mở được mic.",
    "msgNoApi": "Không hỗ trợ getUserMedia."
  },
  "th": {
    "title_page": "ทดสอบไมโครโฟน",
    "desc": "กดเริ่มแล้วอนุญาตไมค์เพื่อดูคลื่นแบบเรียลไทม์ เสียงไม่อัปโหลด",
    "startBtn": "เริ่ม",
    "stopBtn": "หยุด",
    "statusLabel": "สถานะ: ",
    "status_idle": "พร้อม",
    "status_requesting": "กำลังขอสิทธิ์…",
    "status_active": "กำลังรับเสียง",
    "status_denied": "ปฏิเสธสิทธิ์ไมค์",
    "status_error": "เข้าถึงไมค์ไม่ได้",
    "hintWave": "คลื่นโดเมนเวลา พูดแล้วจะขยับ",
    "hintHttps": "มักต้องเป็น HTTPS หรือ localhost",
    "msgDenied": "อนุญาตไมค์ในการตั้งค่าเบราว์เซอร์",
    "msgError": "เปิดไมค์ไม่ได้",
    "msgNoApi": "ไม่รองรับ getUserMedia"
  },
  "id": {
    "title_page": "Tes mikrofon",
    "desc": "Klik Mulai dan izinkan mikrofon untuk melihat gelombang langsung. Audio tidak diunggah.",
    "startBtn": "Mulai",
    "stopBtn": "Berhenti",
    "statusLabel": "Status: ",
    "status_idle": "Siaga",
    "status_requesting": "Meminta izin…",
    "status_active": "Mendengarkan",
    "status_denied": "Izin mikrofon ditolak",
    "status_error": "Tidak dapat mengakses mikrofon",
    "hintWave": "Gelombang domain waktu; bergerak saat berbicara.",
    "hintHttps": "Biasanya hanya HTTPS atau localhost.",
    "msgDenied": "Izinkan mikrofon di pengaturan browser.",
    "msgError": "Tidak bisa membuka mikrofon.",
    "msgNoApi": "getUserMedia tidak didukung di sini."
  },
  "ms": {
    "title_page": "Ujian mikrofon",
    "desc": "Klik Mula dan benarkan mikrofon untuk lihat gelombang langsung. Audio tidak dimuat naik.",
    "startBtn": "Mula",
    "stopBtn": "Henti",
    "statusLabel": "Status: ",
    "status_idle": "Tidak aktif",
    "status_requesting": "Meminta kebenaran…",
    "status_active": "Mendengar",
    "status_denied": "Kebenaran mikrofon ditolak",
    "status_error": "Tidak dapat mengakses mikrofon",
    "hintWave": "Gelombang domain masa; bergerak bila bercakap.",
    "hintHttps": "Biasanya hanya HTTPS atau localhost.",
    "msgDenied": "Benarkan mikrofon dalam tetapan pelayar.",
    "msgError": "Tidak dapat membuka mikrofon.",
    "msgNoApi": "getUserMedia tidak disokong di sini."
  },
  "pl": {
    "title_page": "Test mikrofonu",
    "desc": "Kliknij Start i zezwól na mikrofon, aby zobaczyć falę na żywo. Dźwięk nie jest wysyłany.",
    "startBtn": "Start",
    "stopBtn": "Stop",
    "statusLabel": "Status: ",
    "status_idle": "Bezczynny",
    "status_requesting": "Prośba o uprawnienia…",
    "status_active": "Nasłuch",
    "status_denied": "Odmowa dostępu do mikrofonu",
    "status_error": "Brak dostępu do mikrofonu",
    "hintWave": "Fala w dziedzinie czasu; rusza się podczas mowy.",
    "hintHttps": "Zwykle tylko HTTPS lub localhost.",
    "msgDenied": "Zezwól na mikrofon w ustawieniach przeglądarki.",
    "msgError": "Nie można otworzyć mikrofonu.",
    "msgNoApi": "getUserMedia niedostępne."
  },
  "uk": {
    "title_page": "Перевірка мікрофона",
    "desc": "Натисніть Почати й дозвольте мікрофон, щоб бачити хвилю в реальному часі. Аудіо не завантажується.",
    "startBtn": "Почати",
    "stopBtn": "Зупинити",
    "statusLabel": "Статус: ",
    "status_idle": "Очікування",
    "status_requesting": "Запит дозволу…",
    "status_active": "Прослуховування",
    "status_denied": "Доступ до мікрофона заборонено",
    "status_error": "Немає доступу до мікрофона",
    "hintWave": "Хвиля в часі; рухається під час мови.",
    "hintHttps": "Зазвичай лише HTTPS або localhost.",
    "msgDenied": "Дозвольте мікрофон у налаштуваннях браузера.",
    "msgError": "Не вдалося відкрити мікрофон.",
    "msgNoApi": "getUserMedia недоступний."
  }
}
</i18n>
