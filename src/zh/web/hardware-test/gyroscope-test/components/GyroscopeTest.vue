<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

const { t } = useI18n()

type Status = "idle" | "requesting" | "active" | "denied" | "unsupported"

const status = ref<Status>("idle")
const alpha = ref<number | null>(null)
const beta = ref<number | null>(null)
const gamma = ref<number | null>(null)
const gotData = ref(false)

const phoneStyle = computed(() => {
  const b = beta.value ?? 0
  const g = gamma.value ?? 0
  return {
    transform: `rotateX(${(-b).toFixed(1)}deg) rotateY(${g.toFixed(1)}deg)`,
  }
})

const needleStyle = computed(() => ({
  transform: `rotate(${(alpha.value ?? 0).toFixed(1)}deg)`,
}))

function fmt(n: number | null) {
  return n == null ? "—" : n.toFixed(1)
}

function onOrient(e: DeviceOrientationEvent) {
  if (e.alpha == null && e.beta == null && e.gamma == null) return
  alpha.value = e.alpha
  beta.value = e.beta
  gamma.value = e.gamma
  gotData.value = true
}

function needsPermission() {
  const DOE = window.DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<string>
  }
  return typeof DOE?.requestPermission === "function"
}

async function start() {
  if (status.value === "requesting" || status.value === "active") return
  if (typeof window.DeviceOrientationEvent === "undefined") {
    status.value = "unsupported"
    ElMessage({ message: t("unsupported"), type: "warning" })
    return
  }
  status.value = "requesting"
  try {
    if (needsPermission()) {
      const DOE = window.DeviceOrientationEvent as unknown as {
        requestPermission: () => Promise<string>
      }
      const perm = await DOE.requestPermission()
      if (perm !== "granted") {
        status.value = "denied"
        ElMessage({ message: t("denied"), type: "warning" })
        return
      }
    }
    window.addEventListener("deviceorientation", onOrient)
    status.value = "active"
  } catch {
    status.value = "denied"
    ElMessage({ message: t("denied"), type: "warning" })
  }
}

function stop() {
  window.removeEventListener("deviceorientation", onOrient)
  status.value = "idle"
  gotData.value = false
  alpha.value = null
  beta.value = null
  gamma.value = null
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

    <div class="viz">
      <div class="scene">
        <div
          class="phone"
          :style="phoneStyle"
        >
          <div class="phone-notch" />
          <div class="phone-face">{{ t("tiltHint") }}</div>
        </div>
      </div>
      <div
        class="compass"
        aria-hidden="true"
      >
        <div
          class="needle"
          :style="needleStyle"
        />
        <span class="compass-n">N</span>
      </div>
    </div>

    <div class="table">
      <div class="tr">
        <span class="td k">{{ t("alpha") }}</span>
        <span class="td v mono">{{ fmt(alpha) }}°</span>
      </div>
      <div class="tr">
        <span class="td k">{{ t("beta") }}</span>
        <span class="td v mono">{{ fmt(beta) }}°</span>
      </div>
      <div class="tr">
        <span class="td k">{{ t("gamma") }}</span>
        <span class="td v mono">{{ fmt(gamma) }}°</span>
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

.viz {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 28px;
  margin-bottom: 20px;
}

.scene {
  width: 160px;
  height: 220px;
  perspective: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.phone {
  width: 88px;
  height: 160px;
  border-radius: 14px;
  border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  transform-style: preserve-3d;
  transition: transform 0.06s linear;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 6px;
}

.phone-notch {
  width: 28px;
  height: 6px;
  border-radius: 4px;
  background: var(--vp-c-divider);
  margin-bottom: 8px;
}

.phone-face {
  flex: 1;
  width: 100%;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.68rem;
  color: var(--vp-c-text-3);
  padding: 6px;
  line-height: 1.35;
}

.compass {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.needle {
  position: absolute;
  left: 50%;
  top: 12px;
  width: 4px;
  height: 48px;
  margin-left: -2px;
  border-radius: 2px;
  background: var(--vp-c-brand-1);
  transform-origin: 50% 48px;
}

.compass-n {
  position: absolute;
  top: 6px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--vp-c-text-3);
}

.table {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 14px;
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
    "title_page": "陀螺仪测试",
    "desc": "读取设备姿态角。倾斜或旋转手机，左侧模型会跟着转，右侧指针表示绕竖直轴的朝向（alpha）。",
    "start": "开始监听",
    "stop": "停止",
    "statusLabel": "状态",
    "status_idle": "未开始",
    "status_requesting": "正在请求权限…",
    "status_active": "正在读取",
    "status_denied": "未获得权限",
    "status_unsupported": "不支持",
    "unsupported": "当前浏览器不支持 DeviceOrientation。",
    "denied": "未授予运动与方向权限。可在系统或浏览器设置里打开。",
    "alpha": "alpha（绕 Z，朝向）",
    "beta": "beta（绕 X，前后倾）",
    "gamma": "gamma（绕 Y，左右倾）",
    "tiltHint": "倾斜手机",
    "noData": "已开始监听，但还没有收到有效角度。请拿起并转动设备。",
    "hint": "多数手机需 HTTPS。iOS 会弹出权限。桌面电脑通常没有陀螺仪，数值会一直为空。"
  },
  "en": {
    "title_page": "Gyroscope Test",
    "desc": "Reads device orientation. Tilt or turn the phone: the model follows, the needle shows heading (alpha).",
    "start": "Start",
    "stop": "Stop",
    "statusLabel": "Status",
    "status_idle": "Idle",
    "status_requesting": "Asking permission…",
    "status_active": "Listening",
    "status_denied": "Permission denied",
    "status_unsupported": "Unsupported",
    "unsupported": "DeviceOrientation is not supported.",
    "denied": "Motion/orientation permission was not granted.",
    "alpha": "alpha (Z, heading)",
    "beta": "beta (X, front-back)",
    "gamma": "gamma (Y, left-right)",
    "tiltHint": "Tilt the phone",
    "noData": "Listening, but no angles yet. Pick up and move the device.",
    "hint": "Phones usually need HTTPS. iOS prompts for permission. Desktops often have no gyro."
  },
  "ja": {
    "title_page": "ジャイロテスト",
    "desc": "姿勢角を読み取ります。傾けると模型が追従し、針は向き（alpha）です。",
    "start": "開始",
    "stop": "停止",
    "statusLabel": "状態",
    "status_idle": "未開始",
    "status_requesting": "許可を確認中…",
    "status_active": "取得中",
    "status_denied": "許可なし",
    "status_unsupported": "非対応",
    "unsupported": "DeviceOrientation 非対応です。",
    "denied": "モーション許可がありません。",
    "alpha": "alpha（Z・方位）",
    "beta": "beta（X・前後）",
    "gamma": "gamma（Y・左右）",
    "tiltHint": "端末を傾ける",
    "noData": "開始しましたが角度が来ていません。端末を動かしてください。",
    "hint": "多くは HTTPS が必要です。iOS は許可ダイアログが出ます。"
  },
  "ko": {
    "title_page": "자이로스코프 테스트",
    "desc": "자세 각도를 읽습니다. 기울이면 모형이 따라 움직이고, 바늘은 방향(alpha)입니다.",
    "start": "시작",
    "stop": "중지",
    "statusLabel": "상태",
    "status_idle": "대기",
    "status_requesting": "권한 요청 중…",
    "status_active": "수신 중",
    "status_denied": "권한 거부",
    "status_unsupported": "미지원",
    "unsupported": "DeviceOrientation을 지원하지 않습니다.",
    "denied": "동작/방향 권한이 없습니다.",
    "alpha": "alpha (Z, 방향)",
    "beta": "beta (X, 앞뒤)",
    "gamma": "gamma (Y, 좌우)",
    "tiltHint": "휴대폰을 기울이세요",
    "noData": "수신 중이지만 각도가 없습니다. 기기를 움직여 보세요.",
    "hint": "휴대폰은 보통 HTTPS가 필요합니다. iOS는 권한을 묻습니다."
  },
  "fr": {
    "title_page": "Test gyroscope",
    "desc": "Lit l’orientation. Inclinez le téléphone : le modèle suit, l’aiguille indique le cap (alpha).",
    "start": "Démarrer",
    "stop": "Arrêter",
    "statusLabel": "État",
    "status_idle": "Inactif",
    "status_requesting": "Demande d’autorisation…",
    "status_active": "Écoute",
    "status_denied": "Refusé",
    "status_unsupported": "Non pris en charge",
    "unsupported": "DeviceOrientation non pris en charge.",
    "denied": "Autorisation mouvement/orientation refusée.",
    "alpha": "alpha (Z, cap)",
    "beta": "beta (X, avant-arrière)",
    "gamma": "gamma (Y, gauche-droite)",
    "tiltHint": "Inclinez le téléphone",
    "noData": "À l’écoute, mais pas encore d’angles. Bougez l’appareil.",
    "hint": "Souvent HTTPS. iOS demande une autorisation. Un PC n’a souvent pas de gyro."
  },
  "de": {
    "title_page": "Gyroskop-Test",
    "desc": "Liest die Lage. Neigen Sie das Handy: das Modell folgt, der Zeiger zeigt die Richtung (alpha).",
    "start": "Start",
    "stop": "Stopp",
    "statusLabel": "Status",
    "status_idle": "Bereit",
    "status_requesting": "Berechtigung…",
    "status_active": "Läuft",
    "status_denied": "Verweigert",
    "status_unsupported": "Nicht unterstützt",
    "unsupported": "DeviceOrientation wird nicht unterstützt.",
    "denied": "Keine Bewegungsberechtigung.",
    "alpha": "alpha (Z, Richtung)",
    "beta": "beta (X, vor/zurück)",
    "gamma": "gamma (Y, links/rechts)",
    "tiltHint": "Handy neigen",
    "noData": "Läuft, aber noch keine Winkel. Gerät bewegen.",
    "hint": "Meist HTTPS nötig. iOS fragt nach Erlaubnis."
  },
  "es": {
    "title_page": "Prueba giroscopio",
    "desc": "Lee la orientación. Inclina el móvil: el modelo sigue; la aguja es el rumbo (alpha).",
    "start": "Iniciar",
    "stop": "Detener",
    "statusLabel": "Estado",
    "status_idle": "Inactivo",
    "status_requesting": "Pidiendo permiso…",
    "status_active": "Escuchando",
    "status_denied": "Denegado",
    "status_unsupported": "No compatible",
    "unsupported": "DeviceOrientation no es compatible.",
    "denied": "Sin permiso de movimiento/orientación.",
    "alpha": "alpha (Z, rumbo)",
    "beta": "beta (X, delante-atrás)",
    "gamma": "gamma (Y, izq-der)",
    "tiltHint": "Inclina el móvil",
    "noData": "Escuchando, aún sin ángulos. Mueve el dispositivo.",
    "hint": "Suele hacer falta HTTPS. iOS pide permiso."
  },
  "pt": {
    "title_page": "Teste giroscópio",
    "desc": "Lê a orientação. Incline o telemóvel: o modelo segue; o ponteiro é o rumo (alpha).",
    "start": "Iniciar",
    "stop": "Parar",
    "statusLabel": "Estado",
    "status_idle": "Inativo",
    "status_requesting": "A pedir permissão…",
    "status_active": "A ouvir",
    "status_denied": "Recusado",
    "status_unsupported": "Não suportado",
    "unsupported": "DeviceOrientation não é suportado.",
    "denied": "Sem permissão de movimento/orientação.",
    "alpha": "alpha (Z, rumo)",
    "beta": "beta (X, frente-trás)",
    "gamma": "gamma (Y, esq-dir)",
    "tiltHint": "Incline o telemóvel",
    "noData": "A ouvir, ainda sem ângulos. Mexa no aparelho.",
    "hint": "Costuma ser preciso HTTPS. O iOS pede permissão."
  },
  "ru": {
    "title_page": "Тест гироскопа",
    "desc": "Читает ориентацию. Наклоните телефон: модель следует, стрелка — направление (alpha).",
    "start": "Старт",
    "stop": "Стоп",
    "statusLabel": "Статус",
    "status_idle": "Не запущено",
    "status_requesting": "Запрос разрешения…",
    "status_active": "Слушает",
    "status_denied": "Отклонено",
    "status_unsupported": "Не поддерживается",
    "unsupported": "DeviceOrientation не поддерживается.",
    "denied": "Нет разрешения на движение/ориентацию.",
    "alpha": "alpha (Z, курс)",
    "beta": "beta (X, вперёд-назад)",
    "gamma": "gamma (Y, влево-вправо)",
    "tiltHint": "Наклоните телефон",
    "noData": "Слушает, но углов ещё нет. Подвиньте устройство.",
    "hint": "Часто нужен HTTPS. iOS спрашивает разрешение."
  },
  "ar": {
    "title_page": "اختبار الجيروسكوب",
    "desc": "قراءة الاتجاه. أمل الجهاز: النموذج يتبع، والإبرة هي الاتجاه (alpha).",
    "start": "بدء",
    "stop": "إيقاف",
    "statusLabel": "الحالة",
    "status_idle": "متوقف",
    "status_requesting": "طلب الإذن…",
    "status_active": "يستمع",
    "status_denied": "مرفوض",
    "status_unsupported": "غير مدعوم",
    "unsupported": "DeviceOrientation غير مدعوم.",
    "denied": "لم يُمنح إذن الحركة/الاتجاه.",
    "alpha": "alpha (Z، الاتجاه)",
    "beta": "beta (X، أمام-خلف)",
    "gamma": "gamma (Y، يسار-يمين)",
    "tiltHint": "أمل الهاتف",
    "noData": "يستمع لكن بلا زوايا بعد. حرّك الجهاز.",
    "hint": "غالباً يلزم HTTPS. iOS يطلب إذناً."
  },
  "hi": {
    "title_page": "जाइरोस्कोप टेस्ट",
    "desc": "दिशा पढ़ता है। फ़ोन झुकाएँ: मॉडल साथ घूमेगा, सुई दिशा (alpha) है।",
    "start": "शुरू",
    "stop": "रोकें",
    "statusLabel": "स्थिति",
    "status_idle": "बंद",
    "status_requesting": "अनुमति माँग रहे…",
    "status_active": "सुन रहा",
    "status_denied": "अस्वीकृत",
    "status_unsupported": "असमर्थित",
    "unsupported": "DeviceOrientation समर्थित नहीं।",
    "denied": "गति/दिशा की अनुमति नहीं मिली।",
    "alpha": "alpha (Z, दिशा)",
    "beta": "beta (X, आगे-पीछे)",
    "gamma": "gamma (Y, बाएँ-दाएँ)",
    "tiltHint": "फ़ोन झुकाएँ",
    "noData": "सुन रहे हैं, कोण नहीं आए। डिवाइस हिलाएँ।",
    "hint": "अक्सर HTTPS चाहिए। iOS अनुमति माँगता है।"
  },
  "it": {
    "title_page": "Test giroscopio",
    "desc": "Legge l’orientamento. Inclina il telefono: il modello segue, la lancetta è la prua (alpha).",
    "start": "Avvia",
    "stop": "Stop",
    "statusLabel": "Stato",
    "status_idle": "Inattivo",
    "status_requesting": "Richiesta permesso…",
    "status_active": "In ascolto",
    "status_denied": "Negato",
    "status_unsupported": "Non supportato",
    "unsupported": "DeviceOrientation non supportato.",
    "denied": "Permesso movimento/orientamento negato.",
    "alpha": "alpha (Z, prua)",
    "beta": "beta (X, avanti-indietro)",
    "gamma": "gamma (Y, sx-dx)",
    "tiltHint": "Inclina il telefono",
    "noData": "In ascolto, ancora senza angoli. Muovi il dispositivo.",
    "hint": "Di solito serve HTTPS. iOS chiede il permesso."
  },
  "nl": {
    "title_page": "Gyroscooptest",
    "desc": "Leest de stand. Kantel de telefoon: het model volgt, de naald is de koers (alpha).",
    "start": "Start",
    "stop": "Stop",
    "statusLabel": "Status",
    "status_idle": "Inactief",
    "status_requesting": "Toestemming…",
    "status_active": "Luisteren",
    "status_denied": "Geweigerd",
    "status_unsupported": "Niet ondersteund",
    "unsupported": "DeviceOrientation niet ondersteund.",
    "denied": "Geen bewegings-/oriëntatietoestemming.",
    "alpha": "alpha (Z, koers)",
    "beta": "beta (X, voor-achter)",
    "gamma": "gamma (Y, links-rechts)",
    "tiltHint": "Kantel de telefoon",
    "noData": "Luistert, nog geen hoeken. Beweeg het apparaat.",
    "hint": "Vaak HTTPS nodig. iOS vraagt toestemming."
  },
  "tr": {
    "title_page": "Jiroskop testi",
    "desc": "Yönü okur. Telefonu eğin: model takip eder, iğne yönü (alpha) gösterir.",
    "start": "Başlat",
    "stop": "Durdur",
    "statusLabel": "Durum",
    "status_idle": "Boşta",
    "status_requesting": "İzin isteniyor…",
    "status_active": "Dinleniyor",
    "status_denied": "Reddedildi",
    "status_unsupported": "Desteklenmiyor",
    "unsupported": "DeviceOrientation desteklenmiyor.",
    "denied": "Hareket/yön izni yok.",
    "alpha": "alpha (Z, yön)",
    "beta": "beta (X, ön-arka)",
    "gamma": "gamma (Y, sol-sağ)",
    "tiltHint": "Telefonu eğin",
    "noData": "Dinleniyor ama açı yok. Cihazı hareket ettirin.",
    "hint": "Genelde HTTPS gerekir. iOS izin sorar."
  },
  "vi": {
    "title_page": "Kiểm tra con quay",
    "desc": "Đọc góc tư thế. Nghiêng máy: mô hình xoay theo, kim là hướng (alpha).",
    "start": "Bắt đầu",
    "stop": "Dừng",
    "statusLabel": "Trạng thái",
    "status_idle": "Chưa chạy",
    "status_requesting": "Đang xin quyền…",
    "status_active": "Đang nghe",
    "status_denied": "Từ chối",
    "status_unsupported": "Không hỗ trợ",
    "unsupported": "Không hỗ trợ DeviceOrientation.",
    "denied": "Chưa cấp quyền chuyển động/hướng.",
    "alpha": "alpha (Z, hướng)",
    "beta": "beta (X, trước-sau)",
    "gamma": "gamma (Y, trái-phải)",
    "tiltHint": "Nghiêng điện thoại",
    "noData": "Đã nghe nhưng chưa có góc. Hãy xoay máy.",
    "hint": "Thường cần HTTPS. iOS sẽ hỏi quyền."
  },
  "th": {
    "title_page": "ทดสอบไจโรสโคป",
    "desc": "อ่านมุมทิศทาง เอียงมือถือแล้วโมเดลจะตาม เข็มคือทิศ (alpha)",
    "start": "เริ่ม",
    "stop": "หยุด",
    "statusLabel": "สถานะ",
    "status_idle": "ยังไม่เริ่ม",
    "status_requesting": "ขอสิทธิ์…",
    "status_active": "กำลังฟัง",
    "status_denied": "ถูกปฏิเสธ",
    "status_unsupported": "ไม่รองรับ",
    "unsupported": "ไม่รองรับ DeviceOrientation",
    "denied": "ไม่ได้รับสิทธิ์การเคลื่อนไหว/ทิศทาง",
    "alpha": "alpha (Z ทิศ)",
    "beta": "beta (X หน้า-หลัง)",
    "gamma": "gamma (Y ซ้าย-ขวา)",
    "tiltHint": "เอียงมือถือ",
    "noData": "เริ่มแล้วแต่ยังไม่มีมุม ขยับเครื่องดู",
    "hint": "มักต้อง HTTPS iOS จะขอสิทธิ์"
  },
  "id": {
    "title_page": "Tes giroskop",
    "desc": "Membaca orientasi. Miringkan ponsel: model mengikuti, jarum adalah arah (alpha).",
    "start": "Mulai",
    "stop": "Berhenti",
    "statusLabel": "Status",
    "status_idle": "Siaga",
    "status_requesting": "Meminta izin…",
    "status_active": "Mendengar",
    "status_denied": "Ditolak",
    "status_unsupported": "Tidak didukung",
    "unsupported": "DeviceOrientation tidak didukung.",
    "denied": "Izin gerak/orientasi tidak diberikan.",
    "alpha": "alpha (Z, arah)",
    "beta": "beta (X, depan-belakang)",
    "gamma": "gamma (Y, kiri-kanan)",
    "tiltHint": "Miringkan ponsel",
    "noData": "Mendengar, belum ada sudut. Gerakkan perangkat.",
    "hint": "Sering perlu HTTPS. iOS meminta izin."
  },
  "ms": {
    "title_page": "Ujian giroskop",
    "desc": "Membaca orientasi. Condongkan telefon: model ikut, jarum ialah arah (alpha).",
    "start": "Mula",
    "stop": "Henti",
    "statusLabel": "Status",
    "status_idle": "Rehat",
    "status_requesting": "Meminta kebenaran…",
    "status_active": "Mendengar",
    "status_denied": "Ditolak",
    "status_unsupported": "Tidak disokong",
    "unsupported": "DeviceOrientation tidak disokong.",
    "denied": "Kebenaran gerakan/orientasi tidak diberi.",
    "alpha": "alpha (Z, arah)",
    "beta": "beta (X, depan-belakang)",
    "gamma": "gamma (Y, kiri-kanan)",
    "tiltHint": "Condongkan telefon",
    "noData": "Mendengar, belum ada sudut. Gerakkan peranti.",
    "hint": "Selalunya perlu HTTPS. iOS meminta kebenaran."
  },
  "pl": {
    "title_page": "Test żyroskopu",
    "desc": "Odczytuje orientację. Pochyl telefon: model podąża, wskazówka to kierunek (alpha).",
    "start": "Start",
    "stop": "Stop",
    "statusLabel": "Status",
    "status_idle": "Bezczynny",
    "status_requesting": "Prośba o zgodę…",
    "status_active": "Nasłuch",
    "status_denied": "Odmowa",
    "status_unsupported": "Brak wsparcia",
    "unsupported": "Brak DeviceOrientation.",
    "denied": "Brak zgody na ruch/orientację.",
    "alpha": "alpha (Z, kierunek)",
    "beta": "beta (X, przód-tył)",
    "gamma": "gamma (Y, lewo-prawo)",
    "tiltHint": "Pochyl telefon",
    "noData": "Nasłuch, ale brak kątów. Porusz urządzeniem.",
    "hint": "Często potrzebny HTTPS. iOS prosi o zgodę."
  },
  "uk": {
    "title_page": "Тест гіроскопа",
    "desc": "Читає орієнтацію. Нахиліть телефон: модель повторює, стрілка — напрямок (alpha).",
    "start": "Почати",
    "stop": "Стоп",
    "statusLabel": "Статус",
    "status_idle": "Не запущено",
    "status_requesting": "Запит дозволу…",
    "status_active": "Слухає",
    "status_denied": "Відхилено",
    "status_unsupported": "Не підтримується",
    "unsupported": "DeviceOrientation не підтримується.",
    "denied": "Немає дозволу на рух/орієнтацію.",
    "alpha": "alpha (Z, курс)",
    "beta": "beta (X, вперед-назад)",
    "gamma": "gamma (Y, ліво-право)",
    "tiltHint": "Нахиліть телефон",
    "noData": "Слухає, але кутів ще немає. Порухайте пристрій.",
    "hint": "Часто потрібен HTTPS. iOS запитує дозвіл."
  },
  "sv": {
    "title_page": "Gyroskoptest",
    "desc": "Läser orientering. Luta telefonen: modellen följer, nålen är kursen (alpha).",
    "start": "Starta",
    "stop": "Stopp",
    "statusLabel": "Status",
    "status_idle": "Inaktiv",
    "status_requesting": "Ber om tillstånd…",
    "status_active": "Lyssnar",
    "status_denied": "Nekad",
    "status_unsupported": "Stöds inte",
    "unsupported": "DeviceOrientation stöds inte.",
    "denied": "Inget tillstånd för rörelse/orientering.",
    "alpha": "alpha (Z, kurs)",
    "beta": "beta (X, fram-bak)",
    "gamma": "gamma (Y, vänster-höger)",
    "tiltHint": "Luta telefonen",
    "noData": "Lyssnar, men inga vinklar än. Rör enheten.",
    "hint": "Ofta krävs HTTPS. iOS frågar om tillstånd."
  },
  "zh-TW": {
    "title_page": "陀螺儀測試",
    "desc": "讀取裝置姿態角。傾斜或旋轉手機，左側模型會跟著轉，右側指針表示繞竖直軸的朝向（alpha）。",
    "start": "開始監聽",
    "stop": "停止",
    "statusLabel": "狀態",
    "status_idle": "未開始",
    "status_requesting": "正在請求權限…",
    "status_active": "正在讀取",
    "status_denied": "未獲得權限",
    "status_unsupported": "不支援",
    "unsupported": "目前瀏覽器不支援 DeviceOrientation。",
    "denied": "未授予運動與方向權限。可在系統或瀏覽器設定裡打開。",
    "alpha": "alpha（繞 Z，朝向）",
    "beta": "beta（繞 X，前後傾）",
    "gamma": "gamma（繞 Y，左右傾）",
    "tiltHint": "傾斜手機",
    "noData": "已開始監聽，但還沒有收到有效角度。請拿起並轉動裝置。",
    "hint": "多數手機需 HTTPS。iOS 會跳出權限。桌電通常沒有陀螺儀。"
  }
}
</i18n>
