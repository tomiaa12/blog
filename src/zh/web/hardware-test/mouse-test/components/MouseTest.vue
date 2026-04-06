<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const client = ref({ x: 0, y: 0 })
const buttons = ref(0)
const wheel = ref({ x: 0, y: 0 })
const wheelFlash = ref(false)
let wheelTimer: ReturnType<typeof setTimeout> | null = null

const leftDown = computed(() => (buttons.value & 1) !== 0)
const rightDown = computed(() => (buttons.value & 2) !== 0)
const midDown = computed(() => (buttons.value & 4) !== 0)
const backDown = computed(() => (buttons.value & 8) !== 0)
const fwdDown = computed(() => (buttons.value & 16) !== 0)

const wheelActive = computed(() => wheelFlash.value || midDown.value)

const pressedKeysText = computed(() => {
  const b = buttons.value
  if (!b) return t("noKeysDown")
  const parts: string[] = []
  if (b & 1) parts.push(t("keyLeft"))
  if (b & 2) parts.push(t("keyRight"))
  if (b & 4) parts.push(t("keyMiddle"))
  if (b & 8) parts.push(t("keyBack"))
  if (b & 16) parts.push(t("keyForward"))
  return parts.length ? parts.join(t("keyJoiner")) : t("noKeysDown")
})

const wheelLine = computed(() => {
  const { x, y } = wheel.value
  if (x === 0 && y === 0) return t("wheelNone")
  return t("wheelMoved", { x, y })
})

function flashWheel() {
  wheelFlash.value = true
  if (wheelTimer) clearTimeout(wheelTimer)
  wheelTimer = setTimeout(() => {
    wheelFlash.value = false
    wheelTimer = null
  }, 320)
}

function isSideButton(btn: number): boolean {
  return btn === 3 || btn === 4
}

/** 罗技等侧键会触发历史后退/前进：在本页任意位置拦截默认行为 */
function blockSideButtonDefault(e: MouseEvent | PointerEvent) {
  if (!isSideButton(e.button)) return
  e.preventDefault()
}

function syncFromMouse(e: MouseEvent) {
  client.value = { x: e.clientX, y: e.clientY }
  buttons.value = e.buttons
}

function onDocMouseMove(e: MouseEvent) {
  syncFromMouse(e)
}

function onDocMouseDown(e: MouseEvent) {
  blockSideButtonDefault(e)
  syncFromMouse(e)
}

function onDocMouseUp(e: MouseEvent) {
  if (isSideButton(e.button)) e.preventDefault()
  syncFromMouse(e)
}

function onDocAuxClick(e: MouseEvent) {
  blockSideButtonDefault(e)
}

function onDocClickCapture(e: MouseEvent) {
  if (isSideButton(e.button)) {
    e.preventDefault()
    e.stopPropagation()
  }
}

function onDocPointerDown(e: PointerEvent) {
  if (e.pointerType !== "mouse") return
  blockSideButtonDefault(e)
  client.value = { x: e.clientX, y: e.clientY }
  buttons.value = e.buttons
}

function onDocPointerUp(e: PointerEvent) {
  if (e.pointerType !== "mouse") return
  if (isSideButton(e.button)) e.preventDefault()
  client.value = { x: e.clientX, y: e.clientY }
  buttons.value = e.buttons
}

function onWinBlur() {
  buttons.value = 0
}

function onWheelInStage(e: WheelEvent) {
  wheel.value = { x: e.deltaX, y: e.deltaY }
  flashWheel()
}

function onMountedDocListeners() {
  document.addEventListener("mousemove", onDocMouseMove, true)
  document.addEventListener("mousedown", onDocMouseDown, true)
  document.addEventListener("mouseup", onDocMouseUp, true)
  document.addEventListener("auxclick", onDocAuxClick, true)
  document.addEventListener("click", onDocClickCapture, true)
  document.addEventListener("pointerdown", onDocPointerDown, true)
  document.addEventListener("pointerup", onDocPointerUp, true)
  window.addEventListener("blur", onWinBlur)
}

function onUnmountedDocListeners() {
  document.removeEventListener("mousemove", onDocMouseMove, true)
  document.removeEventListener("mousedown", onDocMouseDown, true)
  document.removeEventListener("mouseup", onDocMouseUp, true)
  document.removeEventListener("auxclick", onDocAuxClick, true)
  document.removeEventListener("click", onDocClickCapture, true)
  document.removeEventListener("pointerdown", onDocPointerDown, true)
  document.removeEventListener("pointerup", onDocPointerUp, true)
  window.removeEventListener("blur", onWinBlur)
}

onMounted(() => {
  onMountedDocListeners()
})

onUnmounted(() => {
  onUnmountedDocListeners()
  if (wheelTimer) clearTimeout(wheelTimer)
})
</script>

<template>
  <div class="hw-page">
    <h1 class="page-title">{{ t("title_page") }}</h1>
    <p class="page-desc">{{ t("desc") }}</p>

    <div
      class="mouse-stage"
      @wheel.prevent="onWheelInStage"
      @contextmenu.prevent
    >
      <div class="mouse-shell">
        <div
          class="side-rail"
          aria-hidden="true"
        >
          <div
            class="side-key"
            :class="{ 'is-down': backDown }"
          >
            {{ t("btnBack") }}
          </div>
          <div
            class="side-key"
            :class="{ 'is-down': fwdDown }"
          >
            {{ t("btnFwd") }}
          </div>
        </div>

        <div
          class="mouse-body"
          aria-hidden="true"
        >
          <div class="mouse-upper">
            <div
              class="btn-left"
              :class="{ 'is-down': leftDown }"
            >
              <span>{{ t("btnLeft") }}</span>
            </div>
            <div class="wheel-col">
              <div
                class="wheel"
                :class="{ 'is-down': wheelActive }"
              />
            </div>
            <div
              class="btn-right"
              :class="{ 'is-down': rightDown }"
            >
              <span>{{ t("btnRight") }}</span>
            </div>
          </div>
          <div class="mouse-lower" />
        </div>
      </div>

      <p class="panel-hint">{{ t("panelHint") }}</p>
    </div>

    <div class="detail">
      <div class="row">
        <span class="k">{{ t("detailPos") }}</span>
        <span class="v">{{ t("detailPosValue", { x: client.x, y: client.y }) }}</span>
      </div>
      <div class="row">
        <span class="k">{{ t("detailKeys") }}</span>
        <span class="v">{{ pressedKeysText }}</span>
      </div>
      <div class="row">
        <span class="k">{{ t("detailWheel") }}</span>
        <span class="v">{{ wheelLine }}</span>
      </div>
    </div>
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

.mouse-stage {
  min-height: 260px;
  padding: 24px 16px 16px;
  border-radius: 12px;
  border: 2px dashed var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.mouse-shell {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 10px;
}

.side-rail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  width: 36px;
}

.side-key {
  flex: 1;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transition:
    background 0.06s ease,
    border-color 0.06s ease,
    color 0.06s ease,
    box-shadow 0.06s ease;

  &.is-down {
    background: var(--vp-c-brand-soft);
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.08);
  }
}

.mouse-body {
  width: 148px;
  height: 218px;
  border-radius: 50% 50% 48% 48%;
  border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.mouse-upper {
  flex: 0 0 46%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: stretch;
  align-content: stretch;
  gap: 0;
  padding: 0;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  min-height: 60%;
}

.wheel-col {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 4px;
  box-sizing: border-box;
}

.wheel {
  width: 28px;
  height: 52px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: linear-gradient(90deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  transition:
    background 0.08s ease,
    border-color 0.08s ease,
    box-shadow 0.08s ease;

  &.is-down {
    background: var(--vp-c-brand-soft);
    border-color: var(--vp-c-brand-1);
    box-shadow:
      0 0 0 1px var(--vp-c-brand-1),
      inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}

.mouse-lower {
  flex: 1;
  min-height: 0;
  background: var(--vp-c-bg);
}

.btn-left,
.btn-right {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border-radius: 0;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  transition:
    background 0.06s ease,
    color 0.06s ease,
    box-shadow 0.06s ease;

  span {
    pointer-events: none;
    text-align: center;
    line-height: 1.2;
    padding: 0 4px;
  }

  &.is-down {
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
  }
}

.btn-left {
  border-right: 1px solid var(--vp-c-divider);
}

.btn-right {
  border-left: 1px solid var(--vp-c-divider);
}

.panel-hint {
  margin: 0;
  font-size: 0.88rem;
  color: var(--vp-c-text-3);
  text-align: center;
}

.detail {
  padding: 16px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-bottom: 8px;
  font-size: 0.88rem;
}

.k {
  flex: 0 0 148px;
  color: var(--vp-c-text-3);
  line-height: 1.45;
}

.v {
  color: var(--vp-c-text-1);
  word-break: break-all;
}

.mono {
  font-family: var(--vp-font-family-mono);
}
</style>

<i18n lang="json">
{
  "zh": {
    "title_page": "鼠标测试",
    "desc": "打开本页后，上面的鼠标图会跟着您操作实时变化，不用先点进虚线框。侧面的「后退」「前进」键只在这页里试手感，不会真的让浏览器翻历史记录。要试滚轮，请把鼠标移到虚线框里再转一下。下面三行用白话说明：指针大概在哪、正按着哪些键、滚轮刚才有没有动。",
    "panelHint": "试滚轮时，请把鼠标移到虚线框里面再转动滚轮。",
    "btnLeft": "左键",
    "btnRight": "右键",
    "btnBack": "后退",
    "btnFwd": "前进",
    "detailPos": "指针大概在哪",
    "detailPosValue": "离窗口左边缘大约 {x}，离上边缘大约 {y}（数字在变就说明指针在动）",
    "detailKeys": "当前按着什么",
    "detailWheel": "滚轮刚才怎么滚的",
    "noKeysDown": "目前没有检测到任何键被按住",
    "keyLeft": "左键",
    "keyRight": "右键",
    "keyMiddle": "按下滚轮（中键）",
    "keyBack": "侧面后退键",
    "keyForward": "侧面前进键",
    "keyJoiner": "、",
    "wheelNone": "还没有在虚线框里滚过。把鼠标移到虚线框里转一下滚轮，这里就会出现说明。",
    "wheelMoved": "左右方向大约动了 {x}，上下方向大约动了 {y}。数字有变化就说明滚轮有反应。"
  },
  "en": {
    "title_page": "Mouse Test",
    "desc": "As soon as you open this page, the mouse picture above follows what you do in real time—you don’t have to click inside the dashed box first. The thumb back/forward buttons are safe to try here: they won’t send the browser backward or forward through history. To test the wheel, move the pointer into the dashed box and scroll. The three lines below say, in plain words, roughly where the pointer is, which buttons are held, and how the wheel last moved.",
    "panelHint": "To test the scroll wheel, move the mouse into the dashed box, then roll the wheel.",
    "btnLeft": "L",
    "btnRight": "R",
    "btnBack": "Back",
    "btnFwd": "Forward",
    "detailPos": "Where the pointer is",
    "detailPosValue": "About {x} from the left edge of the window and {y} from the top (if the numbers change, the pointer is moving)",
    "detailKeys": "What’s held down now",
    "detailWheel": "How the wheel last moved",
    "noKeysDown": "No buttons detected as pressed right now",
    "keyLeft": "Left button",
    "keyRight": "Right button",
    "keyMiddle": "Middle (wheel click)",
    "keyBack": "Side back button",
    "keyForward": "Side forward button",
    "keyJoiner": ", ",
    "wheelNone": "You haven’t scrolled inside the dashed box yet. Move the pointer there and roll the wheel to see a reading here.",
    "wheelMoved": "Sideways about {x}, up/down about {y}. If these numbers change when you scroll, the wheel is responding."
  },
  "ja": {
    "title_page": "マウステスト",
    "desc": "ページを開いたら、上のイラストがマウスの動きに合わせて変わります（点線の中を先にクリックする必要はありません）。親指の戻る／進むボタンは、このページではブラウザの履歴を動かしません。ホイールは点線の内側にポインタを置いてから回してください。下の3行は、位置・押しているボタン・ホイールの動きをやさしい言葉で示します。",
    "panelHint": "ホイールを試すときは、マウスを点線の枠の中に入れてからスクロールしてください。",
    "btnLeft": "左",
    "btnRight": "右",
    "btnBack": "戻る",
    "btnFwd": "進む",
    "detailPos": "ポインタのおおよその位置",
    "detailPosValue": "ウィンドウ左端から約 {x}、上端から約 {y}（数字が変われば動いています）",
    "detailKeys": "今押されているボタン",
    "detailWheel": "ホイールの最後の動き",
    "noKeysDown": "いま押されているボタンはありません",
    "keyLeft": "左ボタン",
    "keyRight": "右ボタン",
    "keyMiddle": "ホイール押し込み（中ボタン）",
    "keyBack": "側面の戻るボタン",
    "keyForward": "側面の進むボタン",
    "keyJoiner": "、",
    "wheelNone": "まだ点線の中でホイールを回していません。枠の中で回すとここに表示されます。",
    "wheelMoved": "左右の動き約 {x}、上下の動き約 {y}。数字が変わればホイールは反応しています。"
  },
  "ko": {
    "title_page": "마우스 테스트",
    "desc": "페이지를 열면 위 그림이 마우스 움직임을 따라 바뀝니다(점선 안을 먼저 클릭할 필요 없음). 엄지 뒤로/앞으로 버튼은 이 페이지에서 브라우저 기록을 넘기지 않습니다. 휠은 점선 안으로 포인터를 옮긴 뒤 돌리세요. 아래 세 줄은 위치, 눌린 버튼, 휠 움직임을 쉬운 말로 보여 줍니다.",
    "panelHint": "휠을 시험하려면 마우스를 점선 상자 안으로 넣은 다음 휠을 돌리세요.",
    "btnLeft": "왼쪽",
    "btnRight": "오른쪽",
    "btnBack": "뒤로",
    "btnFwd": "앞으로",
    "detailPos": "포인터 대략 위치",
    "detailPosValue": "창 왼쪽에서 약 {x}, 위에서 약 {y}(숫자가 바뀌면 움직이는 중)",
    "detailKeys": "지금 눌린 버튼",
    "detailWheel": "휠이 마지막으로 움직인 방식",
    "noKeysDown": "지금 눌린 버튼이 없습니다",
    "keyLeft": "왼쪽 버튼",
    "keyRight": "오른쪽 버튼",
    "keyMiddle": "휠 누르기(가운데)",
    "keyBack": "옆면 뒤로 버튼",
    "keyForward": "옆면 앞으로 버튼",
    "keyJoiner": ", ",
    "wheelNone": "아직 점선 안에서 휠을 돌리지 않았습니다. 상자 안에서 돌리면 여기에 표시됩니다.",
    "wheelMoved": "좌우 약 {x}, 상하 약 {y}. 숫자가 바뀌면 휠이 반응하는 것입니다."
  },
  "fr": {
    "title_page": "Test souris",
    "desc": "En ouvrant la page, le schéma suit votre souris en direct, sans cliquer d’abord dans la zone en pointillés. Les boutons pouce précédent/suivant ne font pas défiler l’historique du navigateur ici. Pour la molette, placez le pointeur dans la zone puis faites défiler. Les trois lignes en bas expliquent simplement la position, les boutons enfoncés et le dernier mouvement de la molette.",
    "panelHint": "Pour tester la molette, mettez la souris dans le cadre en pointillés, puis faites-la rouler.",
    "btnLeft": "G",
    "btnRight": "D",
    "btnBack": "Retour",
    "btnFwd": "Suivant",
    "detailPos": "Position approximative du pointeur",
    "detailPosValue": "Environ {x} depuis le bord gauche de la fenêtre et {y} depuis le haut (si les chiffres changent, le pointeur bouge)",
    "detailKeys": "Boutons actuellement enfoncés",
    "detailWheel": "Dernier mouvement de la molette",
    "noKeysDown": "Aucun bouton détecté comme enfoncé",
    "keyLeft": "Bouton gauche",
    "keyRight": "Bouton droit",
    "keyMiddle": "Clic molette (milieu)",
    "keyBack": "Bouton latéral retour",
    "keyForward": "Bouton latéral suivant",
    "keyJoiner": ", ",
    "wheelNone": "Vous n’avez pas encore fait défiler dans la zone en pointillés. Placez-y le pointeur et tournez la molette.",
    "wheelMoved": "Environ {x} latéralement et {y} verticalement. Si ces nombres changent en défilant, la molette réagit."
  },
  "de": {
    "title_page": "Maustest",
    "desc": "Nach dem Öffnen folgt die Grafik oben live Ihrer Maus – Sie müssen nicht zuerst in den gestrichelten Rahmen klicken. Daumen-Zurück/Vor-Buttons blättern hier nicht in der Browser-Historie. Testen Sie das Rad, indem Sie den Zeiger in den Rahmen bewegen und scrollen. Die drei Zeilen unten erklären in einfachen Worten Position, gedrückte Tasten und die letzte Radbewegung.",
    "panelHint": "Zum Testen des Rads die Maus in den gestrichelten Kasten bewegen und dann das Rad drehen.",
    "btnLeft": "Li",
    "btnRight": "Re",
    "btnBack": "Zurück",
    "btnFwd": "Vor",
    "detailPos": "Ungefähre Zeigerposition",
    "detailPosValue": "Etwa {x} vom linken Fensterrand und {y} vom oberen Rand (ändert sich die Zahl, bewegt sich der Zeiger)",
    "detailKeys": "Gerade gedrückte Tasten",
    "detailWheel": "Letzte Radbewegung",
    "noKeysDown": "Gerade wird keine Taste als gedrückt erkannt",
    "keyLeft": "Linke Taste",
    "keyRight": "Rechte Taste",
    "keyMiddle": "Mausrad-Klick (Mitte)",
    "keyBack": "Seitliche Zurück-Taste",
    "keyForward": "Seitliche Vor-Taste",
    "keyJoiner": ", ",
    "wheelNone": "Noch nicht im gestrichelten Bereich gescrollt. Zeiger hineinbewegen und Rad drehen.",
    "wheelMoved": "Seitlich etwa {x}, auf/ab etwa {y}. Ändern sich die Werte beim Scrollen, reagiert das Rad."
  },
  "es": {
    "title_page": "Prueba de ratón",
    "desc": "Al abrir la página, el dibujo de arriba sigue tu ratón al instante; no hace falta hacer clic primero dentro del recuadro punteado. Los botones del pulgar atrás/adelante no cambian el historial del navegador aquí. Para la rueda, mueve el puntero dentro del recuadro y desplázala. Las tres líneas de abajo explican, en palabras sencillas, la posición, qué botones están pulsados y cómo se movió la rueda.",
    "panelHint": "Para probar la rueda, mete el ratón en el recuadro punteado y gírala.",
    "btnLeft": "I",
    "btnRight": "D",
    "btnBack": "Atrás",
    "btnFwd": "Adelante",
    "detailPos": "Dónde está el puntero (aprox.)",
    "detailPosValue": "Unos {x} desde el borde izquierdo de la ventana y {y} desde arriba (si cambian, el puntero se mueve)",
    "detailKeys": "Qué botones están pulsados ahora",
    "detailWheel": "Cómo se movió la rueda la última vez",
    "noKeysDown": "No se detecta ningún botón pulsado ahora",
    "keyLeft": "Botón izquierdo",
    "keyRight": "Botón derecho",
    "keyMiddle": "Clic de rueda (centro)",
    "keyBack": "Botón lateral atrás",
    "keyForward": "Botón lateral adelante",
    "keyJoiner": ", ",
    "wheelNone": "Aún no has desplazado la rueda dentro del recuadro. Coloca el puntero allí y gira la rueda.",
    "wheelMoved": "Unos {x} en horizontal y {y} en vertical. Si cambian al desplazar, la rueda responde."
  },
  "pt": {
    "title_page": "Teste do rato",
    "desc": "Ao abrir a página, o desenho em cima acompanha o rato em tempo real; não precisa clicar primeiro dentro da caixa tracejada. Os botões do polegar voltar/avançar não mudam o histórico do navegador aqui. Para a roda, ponha o ponteiro dentro da caixa e role. As três linhas em baixo explicam, em linguagem simples, a posição, que botões estão premidos e como a roda se moveu por último.",
    "panelHint": "Para testar a roda, coloque o rato dentro da caixa tracejada e rode a roda.",
    "btnLeft": "E",
    "btnRight": "D",
    "btnBack": "Voltar",
    "btnFwd": "Avançar",
    "detailPos": "Onde está o ponteiro (aprox.)",
    "detailPosValue": "Cerca de {x} da borda esquerda da janela e {y} do topo (se mudam, o ponteiro move-se)",
    "detailKeys": "Que botões estão premidos agora",
    "detailWheel": "Como a roda se moveu da última vez",
    "noKeysDown": "Nenhum botão premido detetado agora",
    "keyLeft": "Botão esquerdo",
    "keyRight": "Botão direito",
    "keyMiddle": "Clique da roda (meio)",
    "keyBack": "Botão lateral voltar",
    "keyForward": "Botão lateral avançar",
    "keyJoiner": ", ",
    "wheelNone": "Ainda não rolou dentro da caixa tracejada. Coloque o ponteiro lá e rode a roda.",
    "wheelMoved": "Cerca de {x} na horizontal e {y} na vertical. Se mudam ao rolar, a roda responde."
  },
  "ru": {
    "title_page": "Тест мыши",
    "desc": "После открытия страницы картинка сверху следует за мышью сразу, не нужно сначала кликать в пунктир. Боковые «назад/вперёд» здесь не листают историю браузера. Колесо проверяйте, наведя указатель в пунктир и прокрутив. Три строки ниже простыми словами: где указатель, какие кнопки зажаты, как двигалось колесо.",
    "panelHint": "Чтобы проверить колесо, наведите мышь в пунктирную рамку и покрутите колесо.",
    "btnLeft": "Л",
    "btnRight": "П",
    "btnBack": "Назад",
    "btnFwd": "Вперёд",
    "detailPos": "Где примерно указатель",
    "detailPosValue": "Около {x} от левого края окна и {y} сверху (если цифры меняются — указатель двигается)",
    "detailKeys": "Какие кнопки сейчас зажаты",
    "detailWheel": "Как колесо двигалось в последний раз",
    "noKeysDown": "Сейчас не зажата ни одна кнопка",
    "keyLeft": "Левая кнопка",
    "keyRight": "Правая кнопка",
    "keyMiddle": "Нажатие на колесо (средняя)",
    "keyBack": "Боковая «назад»",
    "keyForward": "Боковая «вперёд»",
    "keyJoiner": ", ",
    "wheelNone": "Вы ещё не крутили колесо внутри пунктира. Наведите указатель туда и прокрутите.",
    "wheelMoved": "Примерно {x} по горизонтали и {y} по вертикали. Если при прокрутке меняются — колесо реагирует."
  },
  "ar": {
    "title_page": "اختبار الفأرة",
    "desc": "بعد فتح الصفحة، الصورة أعلاه تتبع الفأرة مباشرة دون الحاجة للنقر أولاً داخل الإطار المنقط. أزرار الإبهام للخلف/للأمام لا تقلب سجل المتصفح هنا. لاختبار العجلة، انقل المؤشر داخل الإطار ثم مرّر. الأسطر الثلاثة أدناه تشرح بلغة بسيطة: مكان المؤشر، الأزرار المضغوطة، وآخر حركة للعجلة.",
    "panelHint": "لاختبار عجلة التمرير، ضع الفأرة داخل الإطار المنقط ثم درّ العجلة.",
    "btnLeft": "L",
    "btnRight": "R",
    "btnBack": "رجوع",
    "btnFwd": "تقدّم",
    "detailPos": "مكان المؤشر تقريباً",
    "detailPosValue": "نحو {x} من الحافة اليسرى للنافذة و{y} من الأعلى (إن تغيّرت الأرقام فالمؤشر يتحرك)",
    "detailKeys": "الأزرار المضغوطة الآن",
    "detailWheel": "آخر حركة لعجلة التمرير",
    "noKeysDown": "لا يُضغط أي زر الآن",
    "keyLeft": "الزر الأيسر",
    "keyRight": "الزر الأيمن",
    "keyMiddle": "النقر على العجلة (الأوسط)",
    "keyBack": "زر جانبي للخلف",
    "keyForward": "زر جانبي للأمام",
    "keyJoiner": "، ",
    "wheelNone": "لم تمرّر داخل الإطار المنقط بعد. انقل المؤشر إليه ودرّ العجلة.",
    "wheelMoved": "نحو {x} أفقياً و{y} رأسياً. إن تغيّرت أثناء التمرير فالعجلة تستجيب."
  },
  "hi": {
    "title_page": "माउस टेस्ट",
    "desc": "पेज खुलते ही ऊपर की तस्वीर आपके माउस के साथ चलती है; पहले बिंदीदार बॉक्स में क्लिक ज़रूरी नहीं। अंगूठे वाले पीछे/आगे बटन यहाँ ब्राउज़र इतिहास नहीं बदलते। व्हील आज़माने के लिए सूचक को बॉक्स में ले जाकर स्क्रॉल करें। नीचे तीन पंक्तियाँ सरल भाषा में बताती हैं: सूचक कहाँ है, कौन-से बटन दबे हैं, व्हील कैसे हिली।",
    "panelHint": "व्हील जाँचने के लिए माउस को बिंदीदार बॉक्स में रखकर व्हील घुमाएँ।",
    "btnLeft": "बा",
    "btnRight": "दा",
    "btnBack": "पीछे",
    "btnFwd": "आगे",
    "detailPos": "सूचक लगभग कहाँ है",
    "detailPosValue": "खिड़की के बाएँ किनारे से लगभग {x} और ऊपर से {y} (संख्या बदले तो सूचक चल रहा है)",
    "detailKeys": "अभी कौन-से बटन दबे हैं",
    "detailWheel": "व्हील आखिरी बार कैसे हिली",
    "noKeysDown": "अभी कोई बटन दबा नहीं है",
    "keyLeft": "बायाँ बटन",
    "keyRight": "दायाँ बटन",
    "keyMiddle": "व्हील दबाना (बीच)",
    "keyBack": "साइड पीछे बटन",
    "keyForward": "साइड आगे बटन",
    "keyJoiner": ", ",
    "wheelNone": "अभी बॉक्स के अंदर स्क्रॉल नहीं किया। सूचक वहाँ ले जाकर व्हील घुमाएँ।",
    "wheelMoved": "लगभग {x} बाएँ-दाएँ और {y} ऊपर-नीचे। स्क्रॉल पर बदलें तो व्हील काम कर रहा है।"
  },
  "it": {
    "title_page": "Test mouse",
    "desc": "Aprendo la pagina, il disegno in alto segue il mouse in tempo reale; non serve cliccare prima nel riquadro tratteggiato. I pulsanti pollice indietro/avanti qui non fanno andare avanti/indietro nella cronologia del browser. Per la rotella, metti il puntatore nel riquadro e scorri. Le tre righe sotto spiegano in parole semplici posizione, pulsanti premuti e ultimo movimento della rotella.",
    "panelHint": "Per provare la rotella, metti il mouse nel riquadro tratteggiato e gira la rotella.",
    "btnLeft": "S",
    "btnRight": "D",
    "btnBack": "Indietro",
    "btnFwd": "Avanti",
    "detailPos": "Dove si trova circa il puntatore",
    "detailPosValue": "Circa {x} dal bordo sinistro della finestra e {y} dall’alto (se i numeri cambiano, il puntatore si muove)",
    "detailKeys": "Quali pulsanti sono premuti ora",
    "detailWheel": "Come si è mossa la rotella l’ultima volta",
    "noKeysDown": "Nessun pulsante rilevato come premuto ora",
    "keyLeft": "Pulsante sinistro",
    "keyRight": "Pulsante destro",
    "keyMiddle": "Clic rotella (centrale)",
    "keyBack": "Pulsante laterale indietro",
    "keyForward": "Pulsante laterale avanti",
    "keyJoiner": ", ",
    "wheelNone": "Non hai ancora scrollato nel riquadro tratteggiato. Sposta il puntatore lì e gira la rotella.",
    "wheelMoved": "Circa {x} in orizzontale e {y} in verticale. Se cambiano mentre scorri, la rotella risponde."
  },
  "nl": {
    "title_page": "Muis test",
    "desc": "Na het openen volgt de tekening hierboven direct uw muis; u hoeft niet eerst in het stippelkader te klikken. Duim terug/voor-knoppen bladeren hier niet door de browsergeschiedenis. Test het wiel door de aanwijzer in het kader te zetten en te scrollen. De drie regels hieronder leggen in eenvoudige taal positie, ingedrukte knoppen en de laatste wielbeweging uit.",
    "panelHint": "Om het wiel te testen: muis in het stippelkader en dan het wiel draaien.",
    "btnLeft": "L",
    "btnRight": "R",
    "btnBack": "Terug",
    "btnFwd": "Vooruit",
    "detailPos": "Ongeveer waar de aanwijzer is",
    "detailPosValue": "Ongeveer {x} vanaf de linkerrand van het venster en {y} vanaf boven (veranderen de getallen, dan beweegt de aanwijzer)",
    "detailKeys": "Welke knoppen nu ingedrukt zijn",
    "detailWheel": "Hoe het wiel zich laatst bewoog",
    "noKeysDown": "Geen knop ingedrukt gedetecteerd",
    "keyLeft": "Linkerknop",
    "keyRight": "Rechterknop",
    "keyMiddle": "Wiel klikken (midden)",
    "keyBack": "Zijkant terug-knop",
    "keyForward": "Zijkant vooruit-knop",
    "keyJoiner": ", ",
    "wheelNone": "Nog niet binnen het stippelkader gescrolld. Zet de aanwijzer erin en draai het wiel.",
    "wheelMoved": "Ongeveer {x} horizontaal en {y} verticaal. Veranderen ze bij scrollen, dan reageert het wiel."
  },
  "tr": {
    "title_page": "Fare testi",
    "desc": "Sayfa açılır açılmaz üstteki çizim fareyi anında takip eder; önce kesik çizgili kutuya tıklamanız gerekmez. Başparmak geri/ileri tuşları burada tarayıcı geçmişini değiştirmez. Tekerleği denemek için işaretçiyi kutunun içine alıp kaydırın. Alttaki üç satır konumu, basılı tuşları ve tekerleğin son hareketini sade dille anlatır.",
    "panelHint": "Tekerleği denemek için fareyi kesik çizgili kutunun içine alıp tekerleği çevirin.",
    "btnLeft": "S",
    "btnRight": "S",
    "btnBack": "Geri",
    "btnFwd": "İleri",
    "detailPos": "İşaretçi kabaca nerede",
    "detailPosValue": "Pencerenin sol kenarından yaklaşık {x}, üstten yaklaşık {y} (rakamlar değişiyorsa işaretçi hareket ediyor)",
    "detailKeys": "Şu an basılı tutulan tuşlar",
    "detailWheel": "Tekerleğin son hareketi",
    "noKeysDown": "Şu an basılı tuş algılanmıyor",
    "keyLeft": "Sol tuş",
    "keyRight": "Sağ tuş",
    "keyMiddle": "Tekerleğe basma (orta)",
    "keyBack": "Yan geri tuşu",
    "keyForward": "Yan ileri tuşu",
    "keyJoiner": ", ",
    "wheelNone": "Henüz kesik çizgili alanda kaydırma yapılmadı. İşaretçiyi oraya alıp tekerleği çevirin.",
    "wheelMoved": "Yatayda yaklaşık {x}, dikeyde yaklaşık {y}. Kaydırırken değişiyorsa tekerlek çalışıyor."
  },
  "vi": {
    "title_page": "Kiểm tra chuột",
    "desc": "Mở trang là hình phía trên bám theo chuột ngay, không cần bấm vào khung nét đứt trước. Nút cái ngón cái lùi/tiến ở đây không làm trình duyệt chuyển lịch sử. Thử bánh xe: đưa con trỏ vào khung nét đứt rồi lăn. Ba dòng dưới giải thích đơn giản vị trí, nút đang giữ và lần lăn gần nhất.",
    "panelHint": "Để thử bánh xe, đưa chuột vào khung nét đứt rồi lăn bánh xe.",
    "btnLeft": "T",
    "btnRight": "P",
    "btnBack": "Lùi",
    "btnFwd": "Tiến",
    "detailPos": "Con trỏ khoảng ở đâu",
    "detailPosValue": "Khoảng {x} từ mép trái cửa sổ và {y} từ trên xuống (số thay đổi là con trỏ đang chạy)",
    "detailKeys": "Đang giữ những nút nào",
    "detailWheel": "Bánh xe vừa lăn thế nào",
    "noKeysDown": "Hiện không có nút nào được nhận là đang giữ",
    "keyLeft": "Nút trái",
    "keyRight": "Nút phải",
    "keyMiddle": "Bấm bánh xe (giữa)",
    "keyBack": "Nút cạnh lùi",
    "keyForward": "Nút cạnh tiến",
    "keyJoiner": ", ",
    "wheelNone": "Chưa lăn trong khung nét đứt. Đưa trỏ vào đó và lăn thử.",
    "wheelMoved": "Khoảng {x} ngang và {y} dọc. Lăn mà số đổi là bánh xe có phản hồi."
  },
  "th": {
    "title_page": "ทดสอบเมาส์",
    "desc": "เปิดหน้าแล้วรูปด้านบนจะตามเมาส์ทันที ไม่ต้องคลิกในกรอบจุดไข่ปากก่อน ปุ่มนิ้วโป้งถอย/ไปข้างหน้าในหน้านี้ไม่พลิกประวัติเบราว์เซอร์ ทดสอบล้อเลื่อนโดยเลื่อนตัวชี้เข้าไปในกรอบแล้วหมุนล้อ สามบรรทัดด้านล่างอธิบายตำแหน่ง ปุ่มที่กดค้าง และการเคลื่อนไหวของล้อแบบเข้าใจง่าย",
    "panelHint": "ทดสอบล้อเลื่อน: วางเมาส์ในกรอบจุดไข่ปากแล้วหมุนล้อ",
    "btnLeft": "ซ",
    "btnRight": "ข",
    "btnBack": "ถอย",
    "btnFwd": "ไปต่อ",
    "detailPos": "ตัวชี้อยู่ประมาณไหน",
    "detailPosValue": "ประมาณ {x} จากขอบซ้ายของหน้าต่าง และ {y} จากด้านบน (ตัวเลขเปลี่ยนแปลงแสดงว่าตัวชี้เคลื่อน)",
    "detailKeys": "กำลังกดปุ่มอะไรอยู่",
    "detailWheel": "ล้อเพิ่งหมุนอย่างไร",
    "noKeysDown": "ตอนนี้ไม่พบปุ่มใดถูกกดค้าง",
    "keyLeft": "ปุ่มซ้าย",
    "keyRight": "ปุ่มขวา",
    "keyMiddle": "กดล้อกลาง",
    "keyBack": "ปุ่มข้างถอย",
    "keyForward": "ปุ่มข้างไปต่อ",
    "keyJoiner": ", ",
    "wheelNone": "ยังไม่ได้เลื่อนในกรอบจุดไข่ปาก เลื่อนตัวชี้เข้าไปแล้วหมุนล้อ",
    "wheelMoved": "แนวนอนประมาณ {x} แนวตั้งประมาณ {y} ถ้าเลขเปลี่ยนขณะหมุนแสดงว่าล้อตอบสนอง"
  },
  "id": {
    "title_page": "Tes mouse",
    "desc": "Setelah halaman terbuka, gambar di atas langsung mengikuti mouse; tidak perlu klik di dalam kotak putus-putus dulu. Tombol jempol mundur/maju di sini tidak mengubah riwayat browser. Uji roda dengan mengarahkan penunjuk ke dalam kotak lalu scroll. Tiga baris di bawah menjelaskan posisi, tombol yang ditekan, dan gerakan roda terakhir dengan bahasa sederhana.",
    "panelHint": "Untuk menguji roda, letakkan mouse di dalam kotak putus-putus lalu putar rodanya.",
    "btnLeft": "Ki",
    "btnRight": "Ka",
    "btnBack": "Mundur",
    "btnFwd": "Maju",
    "detailPos": "Kira-kira penunjuk di mana",
    "detailPosValue": "Sekitar {x} dari tepi kiri jendela dan {y} dari atas (angka berubah berarti penunjuk bergerak)",
    "detailKeys": "Tombol apa yang sedang ditekan",
    "detailWheel": "Roda baru saja bergerak bagaimana",
    "noKeysDown": "Tidak ada tombol terdeteksi sedang ditekan",
    "keyLeft": "Tombol kiri",
    "keyRight": "Tombol kanan",
    "keyMiddle": "Tekan roda (tengah)",
    "keyBack": "Tombol samping mundur",
    "keyForward": "Tombol samping maju",
    "keyJoiner": ", ",
    "wheelNone": "Belum scroll di dalam kotak putus-putus. Arahkan penunjuk ke sana dan putar roda.",
    "wheelMoved": "Sekitar {x} horizontal dan {y} vertikal. Jika berubah saat scroll, roda merespons."
  },
  "ms": {
    "title_page": "Ujian tetikus",
    "desc": "Selepas halaman dibuka, gambar di atas mengikut tetikus serta-merta; tidak perlu klik dalam kotak putus-putus dahulu. Butang ibu jari undur/maju di sini tidak menukar sejarah pelayar. Uji roda dengan menggerakkan penunjuk ke dalam kotak lalu tatal. Tiga baris di bawah menerangkan kedudukan, butang ditekan, dan pergerakan roda terakhir dengan bahasa ringkas.",
    "panelHint": "Untuk uji roda, letakkan tetikus dalam kotak putus-putus lalu putar roda.",
    "btnLeft": "Ki",
    "btnRight": "Ka",
    "btnBack": "Undur",
    "btnFwd": "Maju",
    "detailPos": "Penunjuk lebih kurang di mana",
    "detailPosValue": "Lebih kurang {x} dari tepi kiri tetingkap dan {y} dari atas (nombor berubah bermakna penunjuk bergerak)",
    "detailKeys": "Butang apa sedang ditekan",
    "detailWheel": "Roda baru sahaja bergerak bagaimana",
    "noKeysDown": "Tiada butang dikesan sedang ditekan",
    "keyLeft": "Butang kiri",
    "keyRight": "Butang kanan",
    "keyMiddle": "Tekan roda (tengah)",
    "keyBack": "Butang sisi undur",
    "keyForward": "Butang sisi maju",
    "keyJoiner": ", ",
    "wheelNone": "Belum tatal dalam kotak putus-putus. Alih penunjuk ke situ dan putar roda.",
    "wheelMoved": "Lebih kurang {x} mengufuk dan {y} menegak. Jika berubah semasa tatal, roda bertindak balas."
  },
  "pl": {
    "title_page": "Test myszy",
    "desc": "Po otwarciu strony rysunek u góry od razu podąża za myszą; nie trzeba najpierw klikać w ramkę z kreskami. Boczne przyciski wstecz/dalej tutaj nie przewijają historii przeglądarki. Kółko testuj, wskazując w ramkę i przewijając. Trzy linie poniżej prostym językiem mówią o położeniu, wciśniętych przyciskach i ostatnim ruchu kółka.",
    "panelHint": "Aby sprawdzić kółko, wstaw mysz do ramki z kreskami i przewiń kółkiem.",
    "btnLeft": "L",
    "btnRight": "P",
    "btnBack": "Wstecz",
    "btnFwd": "Dalej",
    "detailPos": "Gdzie mniej więcej jest kursor",
    "detailPosValue": "Około {x} od lewej krawędzi okna i {y} od góry (zmiana liczb oznacza ruch kursora)",
    "detailKeys": "Które przyciski są teraz wciśnięte",
    "detailWheel": "Jak ostatnio poruszało się kółko",
    "noKeysDown": "Żaden przycisk nie jest teraz wykryty jako wciśnięty",
    "keyLeft": "Lewy przycisk",
    "keyRight": "Prawy przycisk",
    "keyMiddle": "Klik kółkiem (środek)",
    "keyBack": "Boczny przycisk wstecz",
    "keyForward": "Boczny przycisk dalej",
    "keyJoiner": ", ",
    "wheelNone": "Jeszcze nie przewijałeś w ramce. Wskaż w nią kursor i przewiń kółkiem.",
    "wheelMoved": "Około {x} w poziomie i {y} w pionie. Jeśli się zmieniają przy przewijaniu, kółko działa."
  },
  "uk": {
    "title_page": "Тест миші",
    "desc": "Після відкриття сторінки малюнок зверху одразу слідує за мишею; не потрібно спочатку клікати в пунктир. Бокові кнопки «назад/вперед» тут не гортатимуть історію браузера. Коліщатко перевіряйте, наведіть вказівник у пунктир і прокрутіть. Три рядки нижче простою мовою: де вказівник, які кнопки зажаті, як рухалося коліщатко.",
    "panelHint": "Щоб перевірити коліщатко, наведіть мишу в пунктирну рамку і прокрутіть коліщатко.",
    "btnLeft": "Л",
    "btnRight": "П",
    "btnBack": "Назад",
    "btnFwd": "Вперед",
    "detailPos": "Де приблизно вказівник",
    "detailPosValue": "Близько {x} від лівого краю вікна і {y} зверху (якщо цифри змінюються — вказівник рухається)",
    "detailKeys": "Які кнопки зараз зажаті",
    "detailWheel": "Як коліщатко рухалося востаннє",
    "noKeysDown": "Зараз жодна кнопка не натиснута",
    "keyLeft": "Ліва кнопка",
    "keyRight": "Права кнопка",
    "keyMiddle": "Натискання на коліщатко (середня)",
    "keyBack": "Бокова «назад»",
    "keyForward": "Бокова «вперед»",
    "keyJoiner": ", ",
    "wheelNone": "Ще не прокручували всередині пунктира. Наведіть вказівник туди і прокрутіть.",
    "wheelMoved": "Приблизно {x} по горизонталі та {y} по вертикалі. Якщо змінюються під час прокрутки — коліщатко реагує."
  }
}
</i18n>
