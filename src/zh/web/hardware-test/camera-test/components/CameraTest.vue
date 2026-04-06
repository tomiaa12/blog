<script setup lang="ts">
import { ref, onUnmounted, watch } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

const { t } = useI18n()

type Status = "idle" | "requesting" | "active" | "denied" | "error"

const status = ref<Status>("idle")
const videoRef = ref<HTMLVideoElement | null>(null)
let mediaStream: MediaStream | null = null

watch(videoRef, el => {
  if (el && mediaStream) el.srcObject = mediaStream
})

function cleanup() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    mediaStream = null
  }
  const v = videoRef.value
  if (v) v.srcObject = null
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
      audio: false,
      video: { facingMode: "user" },
    })
    mediaStream = stream
    status.value = "active"
    const v = videoRef.value
    if (v) v.srcObject = stream
    await v?.play().catch(() => {})
  } catch (e: unknown) {
    cleanup()
    const name = e && typeof e === "object" && "name" in e ? String((e as Error).name) : ""
    if (name === "NotAllowedError" || name === "PermissionDeniedError") {
      status.value = "denied"
      ElMessage({ message: t("msgDenied"), type: "warning" })
    } else {
      status.value = "error"
      ElMessage({ message: t("msgError"), type: "error" })
    }
  }
}

function stop() {
  cleanup()
  status.value = "idle"
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

    <div class="video-wrap">
      <video
        ref="videoRef"
        class="video-el"
        playsinline
        muted
        autoplay
      />
      <p
        v-if="status !== 'active'"
        class="video-placeholder"
      >
        {{ t("placeholder") }}
      </p>
    </div>

    <p class="hint">{{ t("hintVideo") }}</p>
    <p class="hint muted">{{ t("hintHttps") }}</p>
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

.video-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  max-height: 420px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.video-el {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.video-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 16px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  pointer-events: none;
  background: var(--vp-c-bg-soft);
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
    "title_page": "摄像头测试",
    "desc": "点击开始后授权摄像头即可预览画面。视频仅在浏览器内显示，不会上传。",
    "startBtn": "开始预览",
    "stopBtn": "停止",
    "statusLabel": "状态：",
    "status_idle": "未开始",
    "status_requesting": "正在请求权限…",
    "status_active": "预览中",
    "status_denied": "已拒绝摄像头权限",
    "status_error": "无法访问摄像头",
    "placeholder": "开始预览后将显示摄像头画面",
    "hintVideo": "若画面镜像属于正常现象（前置摄像头）。",
    "hintHttps": "多数浏览器仅在 HTTPS 或 localhost 下允许访问摄像头。",
    "msgDenied": "请在浏览器设置中允许本站使用摄像头。",
    "msgError": "无法打开摄像头，请检查设备与占用情况。",
    "msgNoApi": "当前环境不支持 getUserMedia。"
  },
  "en": {
    "title_page": "Camera Test",
    "desc": "Click Start and allow camera access to preview video. Nothing is uploaded.",
    "startBtn": "Start",
    "stopBtn": "Stop",
    "statusLabel": "Status: ",
    "status_idle": "Idle",
    "status_requesting": "Requesting permission…",
    "status_active": "Previewing",
    "status_denied": "Camera permission denied",
    "status_error": "Cannot access camera",
    "placeholder": "Camera preview appears after you start",
    "hintVideo": "Mirrored preview is normal for front cameras.",
    "hintHttps": "Most browsers only allow the camera on HTTPS or localhost.",
    "msgDenied": "Allow camera access in your browser settings.",
    "msgError": "Could not open the camera. Check device and other apps using it.",
    "msgNoApi": "getUserMedia is not supported here."
  },
  "ja": {
    "title_page": "カメラテスト",
    "desc": "「開始」で許可するとプレビューが表示されます。動画はアップロードされません。",
    "startBtn": "開始",
    "stopBtn": "停止",
    "statusLabel": "状態：",
    "status_idle": "未開始",
    "status_requesting": "許可を要求中…",
    "status_active": "プレビュー中",
    "status_denied": "カメラの許可が拒否されました",
    "status_error": "カメラにアクセスできません",
    "placeholder": "開始後にプレビューが表示されます",
    "hintVideo": "内カメラでは左右反転することがあります。",
    "hintHttps": "多くのブラウザでは HTTPS または localhost のみ許可されます。",
    "msgDenied": "ブラウザ設定でカメラを許可してください。",
    "msgError": "カメラを開けません。他アプリの占有を確認してください。",
    "msgNoApi": "この環境では getUserMedia が使えません。"
  },
  "ko": {
    "title_page": "카메라 테스트",
    "desc": "시작을 누르고 권한을 허용하면 미리보기가 표시됩니다. 영상은 업로드되지 않습니다.",
    "startBtn": "시작",
    "stopBtn": "중지",
    "statusLabel": "상태: ",
    "status_idle": "대기",
    "status_requesting": "권한 요청 중…",
    "status_active": "미리보기 중",
    "status_denied": "카메라 권한이 거부됨",
    "status_error": "카메라에 액세스할 수 없음",
    "placeholder": "시작 후 미리보기가 표시됩니다",
    "hintVideo": "전면 카메라는 좌우 반전될 수 있습니다.",
    "hintHttps": "대부분 HTTPS 또는 localhost에서만 허용됩니다.",
    "msgDenied": "브라우저 설정에서 카메라를 허용하세요.",
    "msgError": "카메라를 열 수 없습니다.",
    "msgNoApi": "getUserMedia를 지원하지 않습니다."
  },
  "fr": {
    "title_page": "Test de la caméra",
    "desc": "Cliquez sur Démarrer et autorisez la caméra pour prévisualiser la vidéo. Rien n'est envoyé.",
    "startBtn": "Démarrer",
    "stopBtn": "Arrêter",
    "statusLabel": "État : ",
    "status_idle": "Inactif",
    "status_requesting": "Demande d'autorisation…",
    "status_active": "Aperçu",
    "status_denied": "Autorisation caméra refusée",
    "status_error": "Impossible d'accéder à la caméra",
    "placeholder": "L'aperçu s'affiche après démarrage",
    "hintVideo": "L'image miroir est normale pour la caméra avant.",
    "hintHttps": "Souvent autorisé seulement en HTTPS ou localhost.",
    "msgDenied": "Autorisez la caméra dans les paramètres du navigateur.",
    "msgError": "Impossible d'ouvrir la caméra.",
    "msgNoApi": "getUserMedia n'est pas disponible ici."
  },
  "de": {
    "title_page": "Kameratest",
    "desc": "Start klicken und Kamera erlauben, um die Vorschau zu sehen. Kein Upload.",
    "startBtn": "Start",
    "stopBtn": "Stopp",
    "statusLabel": "Status: ",
    "status_idle": "Bereit",
    "status_requesting": "Berechtigung wird angefragt…",
    "status_active": "Vorschau",
    "status_denied": "Kamerazugriff verweigert",
    "status_error": "Kamera nicht erreichbar",
    "placeholder": "Nach dem Start erscheint die Vorschau",
    "hintVideo": "Gespiegelte Vorderkamera ist normal.",
    "hintHttps": "Meist nur unter HTTPS oder localhost erlaubt.",
    "msgDenied": "Kamera in den Browsereinstellungen erlauben.",
    "msgError": "Kamera konnte nicht geöffnet werden.",
    "msgNoApi": "getUserMedia wird hier nicht unterstützt."
  },
  "es": {
    "title_page": "Prueba de cámara",
    "desc": "Pulsa Iniciar y permite la cámara para previsualizar. No se sube nada.",
    "startBtn": "Iniciar",
    "stopBtn": "Detener",
    "statusLabel": "Estado: ",
    "status_idle": "Inactivo",
    "status_requesting": "Solicitando permiso…",
    "status_active": "Vista previa",
    "status_denied": "Permiso de cámara denegado",
    "status_error": "No se puede acceder a la cámara",
    "placeholder": "La vista previa aparece al iniciar",
    "hintVideo": "La imagen espejo es normal en la cámara frontal.",
    "hintHttps": "A menudo solo HTTPS o localhost.",
    "msgDenied": "Permite la cámara en la configuración del navegador.",
    "msgError": "No se pudo abrir la cámara.",
    "msgNoApi": "getUserMedia no está disponible aquí."
  },
  "pt": {
    "title_page": "Teste de câmara",
    "desc": "Clique em Iniciar e permita a câmara para pré-visualizar. Nada é enviado.",
    "startBtn": "Iniciar",
    "stopBtn": "Parar",
    "statusLabel": "Estado: ",
    "status_idle": "Parado",
    "status_requesting": "A pedir permissão…",
    "status_active": "Pré-visualização",
    "status_denied": "Permissão da câmara negada",
    "status_error": "Não é possível aceder à câmara",
    "placeholder": "A pré-visualização aparece após iniciar",
    "hintVideo": "Imagem espelhada é normal na câmara frontal.",
    "hintHttps": "Muitas vezes só HTTPS ou localhost.",
    "msgDenied": "Permita a câmara nas definições do navegador.",
    "msgError": "Não foi possível abrir a câmara.",
    "msgNoApi": "getUserMedia não é suportado aqui."
  },
  "ru": {
    "title_page": "Проверка камеры",
    "desc": "Нажмите «Старт» и разрешите камеру для предпросмотра. Видео не загружается.",
    "startBtn": "Старт",
    "stopBtn": "Стоп",
    "statusLabel": "Статус: ",
    "status_idle": "Ожидание",
    "status_requesting": "Запрос разрешения…",
    "status_active": "Предпросмотр",
    "status_denied": "Доступ к камере запрещён",
    "status_error": "Нет доступа к камере",
    "placeholder": "После запуска появится изображение",
    "hintVideo": "Зеркальное изображение фронтальной камеры — норма.",
    "hintHttps": "Обычно только HTTPS или localhost.",
    "msgDenied": "Разрешите камеру в настройках браузера.",
    "msgError": "Не удалось открыть камеру.",
    "msgNoApi": "getUserMedia недоступен."
  },
  "ar": {
    "title_page": "اختبار الكاميرا",
    "desc": "اضغط ابدأ واسمح بالكاميرا لمعاينة الفيديو. لا يُرفع شيء.",
    "startBtn": "بدء",
    "stopBtn": "إيقاف",
    "statusLabel": "الحالة: ",
    "status_idle": "خامل",
    "status_requesting": "جارٍ طلب الإذن…",
    "status_active": "معاينة",
    "status_denied": "تم رفض إذن الكاميرا",
    "status_error": "تعذر الوصول إلى الكاميرا",
    "placeholder": "تظهر المعاينة بعد البدء",
    "hintVideo": "انعكاس الصورة طبيعي للكاميرا الأمامية.",
    "hintHttps": "غالبًا HTTPS أو localhost فقط.",
    "msgDenied": "اسمح بالكاميرا في إعدادات المتصفح.",
    "msgError": "تعذر فتح الكاميرا.",
    "msgNoApi": "getUserMedia غير متوفر هنا."
  },
  "hi": {
    "title_page": "कैमरा टेस्ट",
    "desc": "शुरू करें दबाएँ और कैमरा अनुमति दें। वीडियो अपलोड नहीं होता।",
    "startBtn": "शुरू",
    "stopBtn": "रोकें",
    "statusLabel": "स्थिति: ",
    "status_idle": "निष्क्रिय",
    "status_requesting": "अनुमति माँग रहा है…",
    "status_active": "पूर्वावलोकन",
    "status_denied": "कैमरा अस्वीकृत",
    "status_error": "कैमरा तक पहुँच नहीं",
    "placeholder": "शुरू करने पर पूर्वावलोकन दिखेगा",
    "hintVideo": "फ्रंट कैमरे पर दर्पण सामान्य है।",
    "hintHttps": "अक्सर केवल HTTPS या localhost।",
    "msgDenied": "ब्राउज़र में कैमरा अनुमति दें।",
    "msgError": "कैमरा नहीं खुल सका।",
    "msgNoApi": "यहाँ getUserMedia उपलब्ध नहीं।"
  },
  "it": {
    "title_page": "Test fotocamera",
    "desc": "Clicca Avvia e consenti la fotocamera per l'anteprima. Nessun upload.",
    "startBtn": "Avvia",
    "stopBtn": "Stop",
    "statusLabel": "Stato: ",
    "status_idle": "Inattivo",
    "status_requesting": "Richiesta permesso…",
    "status_active": "Anteprima",
    "status_denied": "Permesso fotocamera negato",
    "status_error": "Impossibile accedere alla fotocamera",
    "placeholder": "L'anteprima appare dopo l'avvio",
    "hintVideo": "L'immagine specchiata è normale per la frontale.",
    "hintHttps": "Spesso solo HTTPS o localhost.",
    "msgDenied": "Consenti la fotocamera nelle impostazioni.",
    "msgError": "Impossibile aprire la fotocamera.",
    "msgNoApi": "getUserMedia non supportato qui."
  },
  "nl": {
    "title_page": "Cameratest",
    "desc": "Klik Start en sta de camera toe om te bekijken. Niets wordt geüpload.",
    "startBtn": "Start",
    "stopBtn": "Stop",
    "statusLabel": "Status: ",
    "status_idle": "Inactief",
    "status_requesting": "Toestemming vragen…",
    "status_active": "Voorbeeld",
    "status_denied": "Cameratoegang geweigerd",
    "status_error": "Geen toegang tot camera",
    "placeholder": "Voorbeeld verschijnt na start",
    "hintVideo": "Spiegelbeeld is normaal voor de frontcamera.",
    "hintHttps": "Vaak alleen HTTPS of localhost.",
    "msgDenied": "Sta de camera toe in de browserinstellingen.",
    "msgError": "Camera kon niet worden geopend.",
    "msgNoApi": "getUserMedia wordt hier niet ondersteund."
  },
  "tr": {
    "title_page": "Kamera testi",
    "desc": "Başlat'a tıklayıp kameraya izin verin. Yükleme yok.",
    "startBtn": "Başlat",
    "stopBtn": "Durdur",
    "statusLabel": "Durum: ",
    "status_idle": "Beklemede",
    "status_requesting": "İzin isteniyor…",
    "status_active": "Önizleme",
    "status_denied": "Kamera izni reddedildi",
    "status_error": "Kameraya erişilemiyor",
    "placeholder": "Başlatınca önizleme görünür",
    "hintVideo": "Ön kamera için ayna görüntüsü normaldir.",
    "hintHttps": "Genelde yalnızca HTTPS veya localhost.",
    "msgDenied": "Tarayıcıdan kameraya izin verin.",
    "msgError": "Kamera açılamadı.",
    "msgNoApi": "getUserMedia burada desteklenmiyor."
  },
  "vi": {
    "title_page": "Kiểm tra camera",
    "desc": "Nhấn Bắt đầu và cho phép camera để xem trước. Không tải lên.",
    "startBtn": "Bắt đầu",
    "stopBtn": "Dừng",
    "statusLabel": "Trạng thái: ",
    "status_idle": "Chưa chạy",
    "status_requesting": "Đang xin quyền…",
    "status_active": "Xem trước",
    "status_denied": "Từ chối quyền camera",
    "status_error": "Không truy cập được camera",
    "placeholder": "Xem trước sau khi bắt đầu",
    "hintVideo": "Hình gương là bình thường với camera trước.",
    "hintHttps": "Thường chỉ HTTPS hoặc localhost.",
    "msgDenied": "Cho phép camera trong cài đặt trình duyệt.",
    "msgError": "Không mở được camera.",
    "msgNoApi": "Không hỗ trợ getUserMedia."
  },
  "th": {
    "title_page": "ทดสอบกล้อง",
    "desc": "กดเริ่มและอนุญาตกล้องเพื่อดูตัวอย่าง ไม่อัปโหลด",
    "startBtn": "เริ่ม",
    "stopBtn": "หยุด",
    "statusLabel": "สถานะ: ",
    "status_idle": "พร้อม",
    "status_requesting": "กำลังขอสิทธิ์…",
    "status_active": "แสดงตัวอย่าง",
    "status_denied": "ปฏิเสธสิทธิ์กล้อง",
    "status_error": "เข้าถึงกล้องไม่ได้",
    "placeholder": "หลังเริ่มจะเห็นตัวอย่าง",
    "hintVideo": "ภาพกระจกเป็นปกติสำหรับกล้องหน้า",
    "hintHttps": "มักต้อง HTTPS หรือ localhost",
    "msgDenied": "อนุญาตกล้องในเบราว์เซอร์",
    "msgError": "เปิดกล้องไม่ได้",
    "msgNoApi": "ไม่รองรับ getUserMedia"
  },
  "id": {
    "title_page": "Tes kamera",
    "desc": "Klik Mulai dan izinkan kamera untuk pratinjau. Tidak diunggah.",
    "startBtn": "Mulai",
    "stopBtn": "Berhenti",
    "statusLabel": "Status: ",
    "status_idle": "Siaga",
    "status_requesting": "Meminta izin…",
    "status_active": "Pratinjau",
    "status_denied": "Izin kamera ditolak",
    "status_error": "Tidak dapat mengakses kamera",
    "placeholder": "Pratinjau muncul setelah mulai",
    "hintVideo": "Cermin normal untuk kamera depan.",
    "hintHttps": "Biasanya hanya HTTPS atau localhost.",
    "msgDenied": "Izinkan kamera di pengaturan browser.",
    "msgError": "Tidak bisa membuka kamera.",
    "msgNoApi": "getUserMedia tidak didukung di sini."
  },
  "ms": {
    "title_page": "Ujian kamera",
    "desc": "Klik Mula dan benarkan kamera untuk pratonton. Tiada muat naik.",
    "startBtn": "Mula",
    "stopBtn": "Henti",
    "statusLabel": "Status: ",
    "status_idle": "Tidak aktif",
    "status_requesting": "Meminta kebenaran…",
    "status_active": "Pratonton",
    "status_denied": "Kebenaran kamera ditolak",
    "status_error": "Tidak dapat mengakses kamera",
    "placeholder": "Pratonton selepas mula",
    "hintVideo": "Imej cermin biasa untuk kamera hadapan.",
    "hintHttps": "Biasanya hanya HTTPS atau localhost.",
    "msgDenied": "Benarkan kamera dalam tetapan pelayar.",
    "msgError": "Tidak dapat membuka kamera.",
    "msgNoApi": "getUserMedia tidak disokong di sini."
  },
  "pl": {
    "title_page": "Test kamery",
    "desc": "Kliknij Start i zezwól na kamerę, aby zobaczyć podgląd. Bez wysyłania.",
    "startBtn": "Start",
    "stopBtn": "Stop",
    "statusLabel": "Status: ",
    "status_idle": "Bezczynny",
    "status_requesting": "Prośba o uprawnienia…",
    "status_active": "Podgląd",
    "status_denied": "Odmowa dostępu do kamery",
    "status_error": "Brak dostępu do kamery",
    "placeholder": "Podgląd po uruchomieniu",
    "hintVideo": "Lustrzany obraz to norma dla przedniej kamery.",
    "hintHttps": "Zwykle tylko HTTPS lub localhost.",
    "msgDenied": "Zezwól na kamerę w ustawieniach przeglądarki.",
    "msgError": "Nie można otworzyć kamery.",
    "msgNoApi": "getUserMedia niedostępne."
  },
  "uk": {
    "title_page": "Перевірка камери",
    "desc": "Натисніть Почати й дозвольте камеру для перегляду. Без завантаження.",
    "startBtn": "Почати",
    "stopBtn": "Зупинити",
    "statusLabel": "Статус: ",
    "status_idle": "Очікування",
    "status_requesting": "Запит дозволу…",
    "status_active": "Перегляд",
    "status_denied": "Доступ до камери заборонено",
    "status_error": "Немає доступу до камери",
    "placeholder": "Після запуску з’явиться зображення",
    "hintVideo": "Дзеркальне зображення — норма для фронтальної камери.",
    "hintHttps": "Зазвичай лише HTTPS або localhost.",
    "msgDenied": "Дозвольте камеру в налаштуваннях браузера.",
    "msgError": "Не вдалося відкрити камеру.",
    "msgNoApi": "getUserMedia недоступний."
  }
}
</i18n>
