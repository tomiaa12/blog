<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

const { t } = useI18n()

type Status = "idle" | "requesting" | "active" | "denied" | "unsupported"

const status = ref<Status>("idle")
const ax = ref<number | null>(null)
const ay = ref<number | null>(null)
const az = ref<number | null>(null)
const gx = ref<number | null>(null)
const gy = ref<number | null>(null)
const gz = ref<number | null>(null)
const gotData = ref(false)

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

const ballStyle = computed(() => {
  const x = gx.value ?? 0
  const y = gy.value ?? 0
  const left = 50 + clamp(x / 9.81, -1, 1) * 42
  const top = 50 + clamp(-y / 9.81, -1, 1) * 42
  return { left: `${left}%`, top: `${top}%` }
})

function barPct(n: number | null) {
  if (n == null) return 50
  return clamp(50 + (n / 19.6) * 50, 0, 100)
}

function fmt(n: number | null) {
  return n == null ? "—" : n.toFixed(2)
}

function onMotion(e: DeviceMotionEvent) {
  const a = e.acceleration
  const g = e.accelerationIncludingGravity
  if (!a && !g) return
  if (a) {
    ax.value = a.x
    ay.value = a.y
    az.value = a.z
  }
  if (g) {
    gx.value = g.x
    gy.value = g.y
    gz.value = g.z
  }
  gotData.value = true
}

function needsPermission() {
  const DME = window.DeviceMotionEvent as unknown as {
    requestPermission?: () => Promise<string>
  }
  return typeof DME?.requestPermission === "function"
}

async function start() {
  if (status.value === "requesting" || status.value === "active") return
  if (typeof window.DeviceMotionEvent === "undefined") {
    status.value = "unsupported"
    ElMessage({ message: t("unsupported"), type: "warning" })
    return
  }
  status.value = "requesting"
  try {
    if (needsPermission()) {
      const DME = window.DeviceMotionEvent as unknown as {
        requestPermission: () => Promise<string>
      }
      const perm = await DME.requestPermission()
      if (perm !== "granted") {
        status.value = "denied"
        ElMessage({ message: t("denied"), type: "warning" })
        return
      }
    }
    window.addEventListener("devicemotion", onMotion)
    status.value = "active"
  } catch {
    status.value = "denied"
    ElMessage({ message: t("denied"), type: "warning" })
  }
}

function stop() {
  window.removeEventListener("devicemotion", onMotion)
  status.value = "idle"
  gotData.value = false
  ax.value = ay.value = az.value = null
  gx.value = gy.value = gz.value = null
}

onUnmounted(stop)
</script>

<template>
  <div class="hw-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div class="toolbar">
      <el-button
        type="primary"
        :disabled="status === 'requesting' || status === 'active'"
        @click="start"
      >
        {{ t("start") }}
      </el-button>
      <el-button
        :disabled="status !== 'active'"
        @click="stop"
      >
        {{ t("stop") }}
      </el-button>
    </div>

    <p class="status-line">
      <span class="status-label">{{ t("statusLabel") }}</span>
      <span
        class="status-value"
        :data-state="status"
      >{{ t(`status_${status}`) }}</span>
    </p>

    <div class="well">
      <div
        class="ball"
        :style="ballStyle"
      />
      <p class="well-hint">{{ t("ballHint") }}</p>
    </div>

    <h2 class="sub">{{ t("gravityTitle") }}</h2>
    <div
      v-for="row in [
        { k: 'gx', n: gx },
        { k: 'gy', n: gy },
        { k: 'gz', n: gz },
      ]"
      :key="row.k"
      class="bar-row"
    >
      <span class="bar-k">{{ t(row.k) }}</span>
      <div class="bar-track">
        <div
          class="bar-fill"
          :style="{ width: `${barPct(row.n)}%` }"
        />
      </div>
      <span class="mono">{{ fmt(row.n) }}</span>
    </div>

    <h2 class="sub">{{ t("accelTitle") }}</h2>
    <div class="table">
      <div class="tr">
        <span class="td k">{{ t("ax") }}</span>
        <span class="td v mono">{{ fmt(ax) }}</span>
      </div>
      <div class="tr">
        <span class="td k">{{ t("ay") }}</span>
        <span class="td v mono">{{ fmt(ay) }}</span>
      </div>
      <div class="tr">
        <span class="td k">{{ t("az") }}</span>
        <span class="td v mono">{{ fmt(az) }}</span>
      </div>
    </div>

    <p
      v-if="status === 'active' && !gotData"
      class="hint"
    >
      {{ t("noData") }}
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

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
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

  &[data-state="active"] {
    color: var(--vp-c-brand-1);
  }

  &[data-state="denied"],
  &[data-state="unsupported"] {
    color: var(--vp-c-danger-1);
  }
}

.well {
  position: relative;
  height: 220px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  margin-bottom: 20px;
}

.ball {
  position: absolute;
  width: 36px;
  height: 36px;
  margin: -18px 0 0 -18px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  transition: left 0.08s linear, top 0.08s linear;
}

.well-hint {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 10px;
  margin: 0;
  text-align: center;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.sub {
  font-size: 1rem;
  margin: 0 0 10px;
  color: var(--vp-c-text-1);
}

.bar-row {
  display: grid;
  grid-template-columns: 72px 1fr 72px;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.bar-k {
  color: var(--vp-c-text-3);
}

.bar-track {
  height: 8px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--vp-c-brand-1);
  border-radius: inherit;
}

.table {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  margin: 8px 0 14px;
}

.tr {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;

  &:last-child {
    border-bottom: none;
  }
}

.k {
  color: var(--vp-c-text-3);
}

.v {
  color: var(--vp-c-text-1);
}

.mono {
  font-family: var(--vp-font-family-mono);
  text-align: right;
}

.hint {
  margin: 0 0 8px;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  line-height: 1.5;
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "加速度计测试",
    "desc": "读取线性加速度与含重力分量。倾斜手机时滚珠会跟着移动，用来确认加速度计是否在工作。",
    "start": "开始监听",
    "stop": "停止",
    "statusLabel": "状态",
    "status_idle": "未开始",
    "status_requesting": "正在请求权限…",
    "status_active": "正在读取",
    "status_denied": "未获得权限",
    "status_unsupported": "不支持",
    "unsupported": "当前浏览器不支持 DeviceMotion。",
    "denied": "未授予运动传感器权限。可在系统或浏览器设置里打开。",
    "ballHint": "倾斜设备，滚珠会滑向低处",
    "gravityTitle": "含重力加速度（m/s²）",
    "accelTitle": "线性加速度（去掉重力，m/s²）",
    "gx": "重力 X",
    "gy": "重力 Y",
    "gz": "重力 Z",
    "ax": "加速度 X",
    "ay": "加速度 Y",
    "az": "加速度 Z",
    "noData": "已开始监听，但还没有读数。请拿起并晃动或倾斜设备。",
    "hint": "多数手机需 HTTPS。iOS 会弹出权限。桌面电脑通常没有加速度计。坐标轴因系统而异，以数值会变为准。"
  },
  "en": {
    "title_page": "Accelerometer Test",
    "desc": "Reads linear acceleration and gravity. Tilt the phone and the ball slides to confirm the sensor works.",
    "start": "Start",
    "stop": "Stop",
    "statusLabel": "Status",
    "status_idle": "Idle",
    "status_requesting": "Asking permission…",
    "status_active": "Listening",
    "status_denied": "Permission denied",
    "status_unsupported": "Unsupported",
    "unsupported": "DeviceMotion is not supported.",
    "denied": "Motion-sensor permission was not granted.",
    "ballHint": "Tilt the device; the ball slides downhill",
    "gravityTitle": "Acceleration including gravity (m/s²)",
    "accelTitle": "Linear acceleration (gravity removed, m/s²)",
    "gx": "Gravity X",
    "gy": "Gravity Y",
    "gz": "Gravity Z",
    "ax": "Accel X",
    "ay": "Accel Y",
    "az": "Accel Z",
    "noData": "Listening, but no readings yet. Pick up and tilt the device.",
    "hint": "Phones usually need HTTPS. iOS prompts for permission. Desktops often have no accelerometer."
  },
  "ja": {
    "title_page": "加速度計テスト",
    "desc": "加速度と重力を読みます。傾けると玉が動き、センサーの動作を確認できます。",
    "start": "開始",
    "stop": "停止",
    "statusLabel": "状態",
    "status_idle": "未開始",
    "status_requesting": "許可を確認中…",
    "status_active": "取得中",
    "status_denied": "許可なし",
    "status_unsupported": "非対応",
    "unsupported": "DeviceMotion 非対応です。",
    "denied": "モーション許可がありません。",
    "ballHint": "傾けると玉が低い方へ",
    "gravityTitle": "重力込み加速度（m/s²）",
    "accelTitle": "線形加速度（重力除去、m/s²）",
    "gx": "重力 X",
    "gy": "重力 Y",
    "gz": "重力 Z",
    "ax": "加速度 X",
    "ay": "加速度 Y",
    "az": "加速度 Z",
    "noData": "開始しましたが値なし。端末を傾けてください。",
    "hint": "多くは HTTPS が必要です。iOS は許可ダイアログが出ます。"
  },
  "ko": {
    "title_page": "가속도계 테스트",
    "desc": "가속도와 중력을 읽습니다. 기울이면 공이 움직여 센서 동작을 확인합니다.",
    "start": "시작",
    "stop": "중지",
    "statusLabel": "상태",
    "status_idle": "대기",
    "status_requesting": "권한 요청 중…",
    "status_active": "수신 중",
    "status_denied": "권한 거부",
    "status_unsupported": "미지원",
    "unsupported": "DeviceMotion을 지원하지 않습니다.",
    "denied": "동작 센서 권한이 없습니다.",
    "ballHint": "기울이면 공이 낮은 쪽으로",
    "gravityTitle": "중력 포함 가속도 (m/s²)",
    "accelTitle": "선형 가속도 (중력 제거, m/s²)",
    "gx": "중력 X",
    "gy": "중력 Y",
    "gz": "중력 Z",
    "ax": "가속도 X",
    "ay": "가속도 Y",
    "az": "가속도 Z",
    "noData": "수신 중이지만 값이 없습니다. 기기를 기울여 보세요.",
    "hint": "휴대폰은 보통 HTTPS가 필요합니다. iOS는 권한을 묻습니다."
  },
  "fr": {
    "title_page": "Test accéléromètre",
    "desc": "Lit l’accélération et la gravité. Inclinez : la bille bouge si le capteur marche.",
    "start": "Démarrer",
    "stop": "Arrêter",
    "statusLabel": "État",
    "status_idle": "Inactif",
    "status_requesting": "Demande d’autorisation…",
    "status_active": "Écoute",
    "status_denied": "Refusé",
    "status_unsupported": "Non pris en charge",
    "unsupported": "DeviceMotion non pris en charge.",
    "denied": "Autorisation capteur de mouvement refusée.",
    "ballHint": "Inclinez : la bille va vers le bas",
    "gravityTitle": "Accélération avec gravité (m/s²)",
    "accelTitle": "Accélération linéaire (sans gravité, m/s²)",
    "gx": "Gravité X",
    "gy": "Gravité Y",
    "gz": "Gravité Z",
    "ax": "Accél. X",
    "ay": "Accél. Y",
    "az": "Accél. Z",
    "noData": "À l’écoute, pas encore de valeurs. Inclinez l’appareil.",
    "hint": "Souvent HTTPS. iOS demande une autorisation."
  },
  "de": {
    "title_page": "Beschleunigungssensor",
    "desc": "Liest Beschleunigung und Schwerkraft. Beim Neigen rollt die Kugel, wenn der Sensor arbeitet.",
    "start": "Start",
    "stop": "Stopp",
    "statusLabel": "Status",
    "status_idle": "Bereit",
    "status_requesting": "Berechtigung…",
    "status_active": "Läuft",
    "status_denied": "Verweigert",
    "status_unsupported": "Nicht unterstützt",
    "unsupported": "DeviceMotion wird nicht unterstützt.",
    "denied": "Keine Bewegungssensor-Berechtigung.",
    "ballHint": "Neigen: die Kugel rollt nach unten",
    "gravityTitle": "Beschleunigung inkl. Gravitation (m/s²)",
    "accelTitle": "Lineare Beschleunigung (ohne Gravitation, m/s²)",
    "gx": "Grav. X",
    "gy": "Grav. Y",
    "gz": "Grav. Z",
    "ax": "Beschl. X",
    "ay": "Beschl. Y",
    "az": "Beschl. Z",
    "noData": "Läuft, aber keine Werte. Gerät neigen.",
    "hint": "Meist HTTPS nötig. iOS fragt nach Erlaubnis."
  },
  "es": {
    "title_page": "Prueba acelerómetro",
    "desc": "Lee aceleración y gravedad. Inclina el móvil: la bola se mueve si el sensor funciona.",
    "start": "Iniciar",
    "stop": "Detener",
    "statusLabel": "Estado",
    "status_idle": "Inactivo",
    "status_requesting": "Pidiendo permiso…",
    "status_active": "Escuchando",
    "status_denied": "Denegado",
    "status_unsupported": "No compatible",
    "unsupported": "DeviceMotion no es compatible.",
    "denied": "Sin permiso del sensor de movimiento.",
    "ballHint": "Inclina: la bola va hacia abajo",
    "gravityTitle": "Aceleración con gravedad (m/s²)",
    "accelTitle": "Aceleración lineal (sin gravedad, m/s²)",
    "gx": "Grav. X",
    "gy": "Grav. Y",
    "gz": "Grav. Z",
    "ax": "Acel. X",
    "ay": "Acel. Y",
    "az": "Acel. Z",
    "noData": "Escuchando, aún sin datos. Inclina el dispositivo.",
    "hint": "Suele hacer falta HTTPS. iOS pide permiso."
  },
  "pt": {
    "title_page": "Teste acelerómetro",
    "desc": "Lê aceleração e gravidade. Incline: a bola move-se se o sensor funcionar.",
    "start": "Iniciar",
    "stop": "Parar",
    "statusLabel": "Estado",
    "status_idle": "Inativo",
    "status_requesting": "A pedir permissão…",
    "status_active": "A ouvir",
    "status_denied": "Recusado",
    "status_unsupported": "Não suportado",
    "unsupported": "DeviceMotion não é suportado.",
    "denied": "Sem permissão do sensor de movimento.",
    "ballHint": "Incline: a bola vai para baixo",
    "gravityTitle": "Aceleração com gravidade (m/s²)",
    "accelTitle": "Aceleração linear (sem gravidade, m/s²)",
    "gx": "Grav. X",
    "gy": "Grav. Y",
    "gz": "Grav. Z",
    "ax": "Acel. X",
    "ay": "Acel. Y",
    "az": "Acel. Z",
    "noData": "A ouvir, ainda sem valores. Incline o aparelho.",
    "hint": "Costuma ser preciso HTTPS. O iOS pede permissão."
  },
  "ru": {
    "title_page": "Тест акселерометра",
    "desc": "Читает ускорение и гравитацию. Наклоните телефон — шарик сдвинется, если датчик работает.",
    "start": "Старт",
    "stop": "Стоп",
    "statusLabel": "Статус",
    "status_idle": "Не запущено",
    "status_requesting": "Запрос разрешения…",
    "status_active": "Слушает",
    "status_denied": "Отклонено",
    "status_unsupported": "Не поддерживается",
    "unsupported": "DeviceMotion не поддерживается.",
    "denied": "Нет разрешения на датчик движения.",
    "ballHint": "Наклоните: шарик катится вниз",
    "gravityTitle": "Ускорение с гравитацией (м/с²)",
    "accelTitle": "Линейное ускорение (без гравитации, м/с²)",
    "gx": "Грав. X",
    "gy": "Грав. Y",
    "gz": "Грав. Z",
    "ax": "Уск. X",
    "ay": "Уск. Y",
    "az": "Уск. Z",
    "noData": "Слушает, но данных нет. Наклоните устройство.",
    "hint": "Часто нужен HTTPS. iOS спрашивает разрешение."
  },
  "ar": {
    "title_page": "اختبار مقياس التسارع",
    "desc": "قراءة التسارع والجاذبية. أمل الجهاز فتتحرك الكرة إن عمل المستشعر.",
    "start": "بدء",
    "stop": "إيقاف",
    "statusLabel": "الحالة",
    "status_idle": "متوقف",
    "status_requesting": "طلب الإذن…",
    "status_active": "يستمع",
    "status_denied": "مرفوض",
    "status_unsupported": "غير مدعوم",
    "unsupported": "DeviceMotion غير مدعوم.",
    "denied": "لم يُمنح إذن مستشعر الحركة.",
    "ballHint": "أمل الجهاز فتنزلق الكرة للأسفل",
    "gravityTitle": "تسارع مع الجاذبية (م/ث²)",
    "accelTitle": "تسارع خطي (بدون جاذبية، م/ث²)",
    "gx": "جاذبية X",
    "gy": "جاذبية Y",
    "gz": "جاذبية Z",
    "ax": "تسارع X",
    "ay": "تسارع Y",
    "az": "تسارع Z",
    "noData": "يستمع بلا قراءات بعد. أمل الجهاز.",
    "hint": "غالباً يلزم HTTPS. iOS يطلب إذناً."
  },
  "hi": {
    "title_page": "एक्सेलेरोमीटर टेस्ट",
    "desc": "त्वरण और गुरुत्वाकर्षण पढ़ता है। झुकाएँ तो गेंद हिलेगी अगर सेंसर चल रहा हो।",
    "start": "शुरू",
    "stop": "रोकें",
    "statusLabel": "स्थिति",
    "status_idle": "बंद",
    "status_requesting": "अनुमति माँग रहे…",
    "status_active": "सुन रहा",
    "status_denied": "अस्वीकृत",
    "status_unsupported": "असमर्थित",
    "unsupported": "DeviceMotion समर्थित नहीं।",
    "denied": "गति सेंसर की अनुमति नहीं मिली।",
    "ballHint": "झुकाएँ, गेंद नीचे खिसकेगी",
    "gravityTitle": "गुरुत्वाकर्षण सहित त्वरण (m/s²)",
    "accelTitle": "रैखिक त्वरण (गुरुत्वाकर्षण हटा, m/s²)",
    "gx": "गुरुत्व X",
    "gy": "गुरुत्व Y",
    "gz": "गुरुत्व Z",
    "ax": "त्वरण X",
    "ay": "त्वरण Y",
    "az": "त्वरण Z",
    "noData": "सुन रहे हैं, मान नहीं आए। डिवाइस झुकाएँ।",
    "hint": "अक्सर HTTPS चाहिए। iOS अनुमति माँगता है।"
  },
  "it": {
    "title_page": "Test accelerometro",
    "desc": "Legge accelerazione e gravità. Inclina: la pallina si muove se il sensore funziona.",
    "start": "Avvia",
    "stop": "Stop",
    "statusLabel": "Stato",
    "status_idle": "Inattivo",
    "status_requesting": "Richiesta permesso…",
    "status_active": "In ascolto",
    "status_denied": "Negato",
    "status_unsupported": "Non supportato",
    "unsupported": "DeviceMotion non supportato.",
    "denied": "Permesso del sensore di movimento negato.",
    "ballHint": "Inclina: la pallina va in basso",
    "gravityTitle": "Accelerazione con gravità (m/s²)",
    "accelTitle": "Accelerazione lineare (senza gravità, m/s²)",
    "gx": "Grav. X",
    "gy": "Grav. Y",
    "gz": "Grav. Z",
    "ax": "Acc. X",
    "ay": "Acc. Y",
    "az": "Acc. Z",
    "noData": "In ascolto, ancora senza valori. Inclina il dispositivo.",
    "hint": "Di solito serve HTTPS. iOS chiede il permesso."
  },
  "nl": {
    "title_page": "Accelerometertest",
    "desc": "Leest versnelling en zwaartekracht. Kantel: de bal beweegt als de sensor werkt.",
    "start": "Start",
    "stop": "Stop",
    "statusLabel": "Status",
    "status_idle": "Inactief",
    "status_requesting": "Toestemming…",
    "status_active": "Luisteren",
    "status_denied": "Geweigerd",
    "status_unsupported": "Niet ondersteund",
    "unsupported": "DeviceMotion niet ondersteund.",
    "denied": "Geen toestemming voor bewegingssensor.",
    "ballHint": "Kantel: de bal glijdt omlaag",
    "gravityTitle": "Versnelling inclusief zwaartekracht (m/s²)",
    "accelTitle": "Lineaire versnelling (zonder zwaartekracht, m/s²)",
    "gx": "Zwaart. X",
    "gy": "Zwaart. Y",
    "gz": "Zwaart. Z",
    "ax": "Versn. X",
    "ay": "Versn. Y",
    "az": "Versn. Z",
    "noData": "Luistert, nog geen waarden. Kantel het apparaat.",
    "hint": "Vaak HTTPS nodig. iOS vraagt toestemming."
  },
  "tr": {
    "title_page": "İvmeölçer testi",
    "desc": "İvme ve yerçekimini okur. Eğin: sensör çalışıyorsa top kayar.",
    "start": "Başlat",
    "stop": "Durdur",
    "statusLabel": "Durum",
    "status_idle": "Boşta",
    "status_requesting": "İzin isteniyor…",
    "status_active": "Dinleniyor",
    "status_denied": "Reddedildi",
    "status_unsupported": "Desteklenmiyor",
    "unsupported": "DeviceMotion desteklenmiyor.",
    "denied": "Hareket sensörü izni yok.",
    "ballHint": "Eğin: top aşağı kayar",
    "gravityTitle": "Yerçekimli ivme (m/s²)",
    "accelTitle": "Doğrusal ivme (yerçekimi çıkarılmış, m/s²)",
    "gx": "Yerçek. X",
    "gy": "Yerçek. Y",
    "gz": "Yerçek. Z",
    "ax": "İvme X",
    "ay": "İvme Y",
    "az": "İvme Z",
    "noData": "Dinleniyor ama değer yok. Cihazı eğin.",
    "hint": "Genelde HTTPS gerekir. iOS izin sorar."
  },
  "vi": {
    "title_page": "Kiểm tra gia tốc kế",
    "desc": "Đọc gia tốc và trọng lực. Nghiêng máy, viên bi trượt nếu cảm biến hoạt động.",
    "start": "Bắt đầu",
    "stop": "Dừng",
    "statusLabel": "Trạng thái",
    "status_idle": "Chưa chạy",
    "status_requesting": "Đang xin quyền…",
    "status_active": "Đang nghe",
    "status_denied": "Từ chối",
    "status_unsupported": "Không hỗ trợ",
    "unsupported": "Không hỗ trợ DeviceMotion.",
    "denied": "Chưa cấp quyền cảm biến chuyển động.",
    "ballHint": "Nghiêng máy, bi trượt xuống thấp",
    "gravityTitle": "Gia tốc kèm trọng lực (m/s²)",
    "accelTitle": "Gia tốc tuyến tính (bỏ trọng lực, m/s²)",
    "gx": "Trọng lực X",
    "gy": "Trọng lực Y",
    "gz": "Trọng lực Z",
    "ax": "Gia tốc X",
    "ay": "Gia tốc Y",
    "az": "Gia tốc Z",
    "noData": "Đã nghe nhưng chưa có số. Hãy nghiêng máy.",
    "hint": "Thường cần HTTPS. iOS sẽ hỏi quyền."
  },
  "th": {
    "title_page": "ทดสอบความเร่ง",
    "desc": "อ่านความเร่งและแรงโน้มถ่วง เอียงเครื่องแล้วลูกกลิ้งจะขยับถ้าเซ็นเซอร์ทำงาน",
    "start": "เริ่ม",
    "stop": "หยุด",
    "statusLabel": "สถานะ",
    "status_idle": "ยังไม่เริ่ม",
    "status_requesting": "ขอสิทธิ์…",
    "status_active": "กำลังฟัง",
    "status_denied": "ถูกปฏิเสธ",
    "status_unsupported": "ไม่รองรับ",
    "unsupported": "ไม่รองรับ DeviceMotion",
    "denied": "ไม่ได้รับสิทธิ์เซ็นเซอร์การเคลื่อนไหว",
    "ballHint": "เอียงเครื่อง ลูกกลิ้งจะไหลลง",
    "gravityTitle": "ความเร่งรวมแรงโน้มถ่วง (m/s²)",
    "accelTitle": "ความเร่งเชิงเส้น (ตัดแรงโน้มถ่วง, m/s²)",
    "gx": "โน้มถ่วง X",
    "gy": "โน้มถ่วง Y",
    "gz": "โน้มถ่วง Z",
    "ax": "ความเร่ง X",
    "ay": "ความเร่ง Y",
    "az": "ความเร่ง Z",
    "noData": "เริ่มแล้วแต่ยังไม่มีค่า เอียงเครื่องดู",
    "hint": "มักต้อง HTTPS iOS จะขอสิทธิ์"
  },
  "id": {
    "title_page": "Tes akselerometer",
    "desc": "Membaca percepatan dan gravitasi. Miringkan: bola bergerak jika sensor bekerja.",
    "start": "Mulai",
    "stop": "Berhenti",
    "statusLabel": "Status",
    "status_idle": "Siaga",
    "status_requesting": "Meminta izin…",
    "status_active": "Mendengar",
    "status_denied": "Ditolak",
    "status_unsupported": "Tidak didukung",
    "unsupported": "DeviceMotion tidak didukung.",
    "denied": "Izin sensor gerak tidak diberikan.",
    "ballHint": "Miringkan: bola meluncur ke bawah",
    "gravityTitle": "Percepatan termasuk gravitasi (m/s²)",
    "accelTitle": "Percepatan linear (tanpa gravitasi, m/s²)",
    "gx": "Grav. X",
    "gy": "Grav. Y",
    "gz": "Grav. Z",
    "ax": "Percep. X",
    "ay": "Percep. Y",
    "az": "Percep. Z",
    "noData": "Mendengar, belum ada nilai. Miringkan perangkat.",
    "hint": "Sering perlu HTTPS. iOS meminta izin."
  },
  "ms": {
    "title_page": "Ujian pecutan",
    "desc": "Membaca pecutan dan graviti. Condongkan: bola bergerak jika penderia berfungsi.",
    "start": "Mula",
    "stop": "Henti",
    "statusLabel": "Status",
    "status_idle": "Rehat",
    "status_requesting": "Meminta kebenaran…",
    "status_active": "Mendengar",
    "status_denied": "Ditolak",
    "status_unsupported": "Tidak disokong",
    "unsupported": "DeviceMotion tidak disokong.",
    "denied": "Kebenaran penderia gerakan tidak diberi.",
    "ballHint": "Condongkan: bola menggelongsor ke bawah",
    "gravityTitle": "Pecutan termasuk graviti (m/s²)",
    "accelTitle": "Pecutan linear (tanpa graviti, m/s²)",
    "gx": "Grav. X",
    "gy": "Grav. Y",
    "gz": "Grav. Z",
    "ax": "Pecut. X",
    "ay": "Pecut. Y",
    "az": "Pecut. Z",
    "noData": "Mendengar, belum ada nilai. Condongkan peranti.",
    "hint": "Selalunya perlu HTTPS. iOS meminta kebenaran."
  },
  "pl": {
    "title_page": "Test akcelerometru",
    "desc": "Odczytuje przyspieszenie i grawitację. Pochyl: kulka się przesunie, jeśli czujnik działa.",
    "start": "Start",
    "stop": "Stop",
    "statusLabel": "Status",
    "status_idle": "Bezczynny",
    "status_requesting": "Prośba o zgodę…",
    "status_active": "Nasłuch",
    "status_denied": "Odmowa",
    "status_unsupported": "Brak wsparcia",
    "unsupported": "Brak DeviceMotion.",
    "denied": "Brak zgody na czujnik ruchu.",
    "ballHint": "Pochyl: kulka zjeżdża w dół",
    "gravityTitle": "Przyspieszenie z grawitacją (m/s²)",
    "accelTitle": "Przyspieszenie liniowe (bez grawitacji, m/s²)",
    "gx": "Graw. X",
    "gy": "Graw. Y",
    "gz": "Graw. Z",
    "ax": "Przysp. X",
    "ay": "Przysp. Y",
    "az": "Przysp. Z",
    "noData": "Nasłuch, brak odczytów. Pochyl urządzenie.",
    "hint": "Często potrzebny HTTPS. iOS prosi o zgodę."
  },
  "uk": {
    "title_page": "Тест акселерометра",
    "desc": "Читає прискорення і гравітацію. Нахиліть: кулька зрушиться, якщо датчик працює.",
    "start": "Почати",
    "stop": "Стоп",
    "statusLabel": "Статус",
    "status_idle": "Не запущено",
    "status_requesting": "Запит дозволу…",
    "status_active": "Слухає",
    "status_denied": "Відхилено",
    "status_unsupported": "Не підтримується",
    "unsupported": "DeviceMotion не підтримується.",
    "denied": "Немає дозволу на датчик руху.",
    "ballHint": "Нахиліть: кулька котиться вниз",
    "gravityTitle": "Прискорення з гравітацією (м/с²)",
    "accelTitle": "Лінійне прискорення (без гравітації, м/с²)",
    "gx": "Грав. X",
    "gy": "Грав. Y",
    "gz": "Грав. Z",
    "ax": "Приск. X",
    "ay": "Приск. Y",
    "az": "Приск. Z",
    "noData": "Слухає, але даних немає. Нахиліть пристрій.",
    "hint": "Часто потрібен HTTPS. iOS запитує дозвіл."
  },
  "sv": {
    "title_page": "Accelerometertest",
    "desc": "Läser acceleration och gravitation. Luta: kulan rör sig om sensorn fungerar.",
    "start": "Starta",
    "stop": "Stopp",
    "statusLabel": "Status",
    "status_idle": "Inaktiv",
    "status_requesting": "Ber om tillstånd…",
    "status_active": "Lyssnar",
    "status_denied": "Nekad",
    "status_unsupported": "Stöds inte",
    "unsupported": "DeviceMotion stöds inte.",
    "denied": "Inget tillstånd för rörelsesensorn.",
    "ballHint": "Luta: kulan glider nedåt",
    "gravityTitle": "Acceleration inklusive gravitation (m/s²)",
    "accelTitle": "Linjär acceleration (utan gravitation, m/s²)",
    "gx": "Grav. X",
    "gy": "Grav. Y",
    "gz": "Grav. Z",
    "ax": "Acc. X",
    "ay": "Acc. Y",
    "az": "Acc. Z",
    "noData": "Lyssnar, men inga värden än. Luta enheten.",
    "hint": "Ofta krävs HTTPS. iOS frågar om tillstånd."
  },
  "zh-TW": {
    "title_page": "加速度計測試",
    "desc": "讀取線性加速度與含重力分量。傾斜手機時滾珠會跟著移動，用來確認加速度計是否在工作。",
    "start": "開始監聽",
    "stop": "停止",
    "statusLabel": "狀態",
    "status_idle": "未開始",
    "status_requesting": "正在請求權限…",
    "status_active": "正在讀取",
    "status_denied": "未獲得權限",
    "status_unsupported": "不支援",
    "unsupported": "目前瀏覽器不支援 DeviceMotion。",
    "denied": "未授予運動感測器權限。可在系統或瀏覽器設定裡打開。",
    "ballHint": "傾斜裝置，滾珠會滑向低處",
    "gravityTitle": "含重力加速度（m/s²）",
    "accelTitle": "線性加速度（去掉重力，m/s²）",
    "gx": "重力 X",
    "gy": "重力 Y",
    "gz": "重力 Z",
    "ax": "加速度 X",
    "ay": "加速度 Y",
    "az": "加速度 Z",
    "noData": "已開始監聽，但還沒有讀數。請拿起並晃動或傾斜裝置。",
    "hint": "多數手機需 HTTPS。iOS 會跳出權限。桌電通常沒有加速度計。"
  }
}
</i18n>
