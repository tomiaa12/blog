<template>
  <ul class="site-tool backdrop-filter" :class="isMobile && 'mini'">
    <!-- <li @click="to('/docs/关于/交流群.html')">
      <el-popover
        placement="left"
        title="交流群"
        :width="250"
        trigger="hover"
        popper-class="qun-contianer"
      >
        <template #reference>
          <div class="grounp">
            <el-icon :size="24">
              <wechat />
            </el-icon>
            <span>交流群</span>
          </div>
        </template>
<CommunicationGroup />
</el-popover>
</li> -->
    <li v-if="isZhCN" @click="to('/docs/关于/支持我.html')">
      <el-popover placement="left" title="支持我" :width="250" trigger="hover" popper-class="qun-contianer">
        <template #reference>
          <div class="grounp">
            <el-icon :size="24">
              <love />
            </el-icon>
            <span>支持我</span>
          </div>
        </template>
        <SupportMe />
      </el-popover>
    </li>
    <li v-if="!isMobile" @click="toggleFullScreen">
      <div class="grounp">
        <el-icon :size="24">
          <fullScreen />
        </el-icon>
        <span>{{ t('fullscreen') }}</span>
      </div>
    </li>
    <li v-if="!isMobile" @click="toggleWebFullScreen">
      <div class="grounp">
        <el-icon :size="24">
          <fullScreen />
        </el-icon>
        <span>{{ isWebFullScreen ? t('exitWebFullscreen') : t('webFullscreen') }}</span>
      </div>
    </li>
    <li v-if="!isMobile">
      <el-popover placement="left" :title="t('scanQR')" :width="250" trigger="hover" popper-class="qun-contianer">
        <template #reference>
          <div class="grounp">
            <el-icon :size="24">
              <el-icon-iphone />
            </el-icon>
            <span>{{ t('mobileView') }}</span>
          </div>
        </template>
        <canvas ref="qrcodeRef"></canvas>
      </el-popover>
    </li>
    <li v-if="isZhCN" @click="to('/pages/navigation.html')">
      <div class="grounp">
        <el-icon :size="24">
          <docSearch />
        </el-icon>
        <span>导航</span>
      </div>
    </li>
    <li v-if="isZhCN" @click="to('/pages/software.html')">
      <div class="grounp">
        <el-icon :size="24">
          <app />
        </el-icon>
        <span>软件</span>
      </div>
    </li>
    <li @click="to('/pages/game.html')">
      <div class="grounp">
        <el-icon :size="24">
          <gamepad />
        </el-icon>
        <span>{{ t('game') }}</span>
      </div>
    </li>
    <li @click="emits('toggle-live2d')">
      <div class="grounp">
        <el-icon :size="24">
          <cat />
        </el-icon>
        <span>Live2D</span>
      </div>
    </li>
    <!-- <li @click="to('/pages/chatGPT.html')">
      <div class="grounp">
        <el-icon :size="24">
          <chatGPT />
        </el-icon>
        <span>GPT</span>
      </div>
    </li> -->
  </ul>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import { useRouter } from "vitepress"
import { useWebFullScreen } from "@/hooks/useWebFullScreen"

import CommunicationGroup from "./CommunicationGroup/index.vue"
import SupportMe from "./SupportMe/index.vue"

import wechat from "@/assets/svg/wechat.svg"
import fullScreen from "@/assets/svg/fullScreen.svg"
import love from "@/assets/svg/love.svg"
import docSearch from "@/assets/svg/docSearch.svg"
import app from "@/assets/svg/app.svg"
import gamepad from "@/assets/svg/gamepad.svg"
import chatGPT from "@/assets/svg/chatGPT.svg"
import cat from "@/assets/svg/cat.svg"
import QRCode from "qrcode"
import { useI18n } from "vue-i18n"

import { isMobile } from "@/utils"
import { useLang } from "@/hooks/useLang"

const { isZhCN } = useLang()


// const props = defineProps({})
const emits = defineEmits<{
  (e: "toggle-live2d"): void
}>()

const router = useRouter()
const { isWebFullScreen, toggleWebFullScreen } = useWebFullScreen()
const { t } = useI18n({
  useScope: "local",
})

const to = (path: string) => router.go(path)

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen?.()
  }
}

const qrcodeRef = ref()

onMounted(() => {
  watch(
    () => router.route.path,
    () => {
      QRCode.toCanvas(qrcodeRef.value, location.href, {
        width: 224,
      })
    },
    {
      immediate: true,
    }
  )
})
</script>
<style lang="scss" scoped>
.site-tool {
  position: fixed;
  top: calc(var(--vp-nav-height) + 0.5em);
  right: 0;
  z-index: 2000;
  box-shadow: var(--el-box-shadow-light);

  &.mini {
    li {
      padding: 2px;
      font-size: 10px;
      line-height: 1.2;
    }
  }

  li {
    transition: 0.3s;
    font-size: 12px;
    color: var(--el-color-info-light);
    padding: 8px;
    cursor: pointer;

    &:hover {
      background-color: var(--el-fill-color-light);
      color: var(--vp-c-brand);
    }

    &+li {
      border-top: 1px solid var(--el-border-color-light);
    }
  }
}

.grounp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

<style lang="scss">
.qun-contianer {
  max-height: 55vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>


<i18n lang="json">{
  "zh-CN": { "fullscreen": "放大看", "webFullscreen": "网页全屏", "exitWebFullscreen": "退出网页全屏", "scanQR": "扫码手机看", "mobileView": "手机看", "game": "游戏" },
  "en":    { "fullscreen": "Fullscreen", "webFullscreen": "Web Fullscreen", "exitWebFullscreen": "Exit Fullscreen", "scanQR": "Scan QR for Mobile", "mobileView": "Mobile", "game": "Game" },
  "zh-TW": { "fullscreen": "放大看", "webFullscreen": "網頁全螢幕", "exitWebFullscreen": "退出網頁全螢幕", "scanQR": "掃碼手機看", "mobileView": "手機看", "game": "遊戲" },
  "ja":    { "fullscreen": "拡大", "webFullscreen": "Webフルスクリーン", "exitWebFullscreen": "フルスクリーン終了", "scanQR": "QRコードでスマホ表示", "mobileView": "スマホ", "game": "ゲーム" },
  "ko":    { "fullscreen": "전체화면", "webFullscreen": "웹 전체화면", "exitWebFullscreen": "전체화면 종료", "scanQR": "QR 코드로 모바일 보기", "mobileView": "모바일", "game": "게임" },
  "fr":    { "fullscreen": "Plein écran", "webFullscreen": "Plein écran web", "exitWebFullscreen": "Quitter le plein écran", "scanQR": "Scanner QR sur mobile", "mobileView": "Mobile", "game": "Jeu" },
  "de":    { "fullscreen": "Vollbild", "webFullscreen": "Web-Vollbild", "exitWebFullscreen": "Vollbild beenden", "scanQR": "QR für Handy scannen", "mobileView": "Handy", "game": "Spiel" },
  "es":    { "fullscreen": "Pantalla completa", "webFullscreen": "Pantalla completa web", "exitWebFullscreen": "Salir de pantalla completa", "scanQR": "Escanear QR en móvil", "mobileView": "Móvil", "game": "Juego" },
  "pt":    { "fullscreen": "Tela cheia", "webFullscreen": "Tela cheia web", "exitWebFullscreen": "Sair da tela cheia", "scanQR": "Escanear QR no celular", "mobileView": "Celular", "game": "Jogo" },
  "ru":    { "fullscreen": "Полный экран", "webFullscreen": "Веб полный экран", "exitWebFullscreen": "Выйти из полного экрана", "scanQR": "QR-код для телефона", "mobileView": "Телефон", "game": "Игра" },
  "ar":    { "fullscreen": "ملء الشاشة", "webFullscreen": "الشاشة الكاملة", "exitWebFullscreen": "إنهاء ملء الشاشة", "scanQR": "مسح QR للهاتف", "mobileView": "هاتف", "game": "لعبة" },
  "hi":    { "fullscreen": "पूर्ण स्क्रीन", "webFullscreen": "वेब पूर्ण स्क्रीन", "exitWebFullscreen": "पूर्ण स्क्रीन से बाहर", "scanQR": "मोबाइल के लिए QR स्कैन करें", "mobileView": "मोबाइल", "game": "खेल" },
  "it":    { "fullscreen": "Schermo intero", "webFullscreen": "Schermo intero web", "exitWebFullscreen": "Esci dallo schermo intero", "scanQR": "Scansiona QR su mobile", "mobileView": "Mobile", "game": "Gioco" },
  "nl":    { "fullscreen": "Volledig scherm", "webFullscreen": "Web volledig scherm", "exitWebFullscreen": "Volledig scherm verlaten", "scanQR": "QR scannen op mobiel", "mobileView": "Mobiel", "game": "Spel" },
  "tr":    { "fullscreen": "Tam ekran", "webFullscreen": "Web tam ekran", "exitWebFullscreen": "Tam ekrandan çık", "scanQR": "Mobil için QR tara", "mobileView": "Mobil", "game": "Oyun" },
  "vi":    { "fullscreen": "Toàn màn hình", "webFullscreen": "Toàn màn hình web", "exitWebFullscreen": "Thoát toàn màn hình", "scanQR": "Quét QR trên điện thoại", "mobileView": "Điện thoại", "game": "Trò chơi" },
  "th":    { "fullscreen": "เต็มหน้าจอ", "webFullscreen": "เต็มหน้าจอเว็บ", "exitWebFullscreen": "ออกจากเต็มหน้าจอ", "scanQR": "สแกน QR บนมือถือ", "mobileView": "มือถือ", "game": "เกม" },
  "id":    { "fullscreen": "Layar penuh", "webFullscreen": "Layar penuh web", "exitWebFullscreen": "Keluar layar penuh", "scanQR": "Scan QR di ponsel", "mobileView": "Ponsel", "game": "Game" },
  "pl":    { "fullscreen": "Pełny ekran", "webFullscreen": "Pełny ekran web", "exitWebFullscreen": "Wyjdź z pełnego ekranu", "scanQR": "Skanuj QR na telefon", "mobileView": "Telefon", "game": "Gra" },
  "sv":    { "fullscreen": "Helskärm", "webFullscreen": "Webb helskärm", "exitWebFullscreen": "Avsluta helskärm", "scanQR": "Skanna QR för mobil", "mobileView": "Mobil", "game": "Spel" }
}</i18n>
