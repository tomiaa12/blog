import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3（MPEG-1 Audio Layer III）是最流行的有損壓縮音訊格式，相容性極強，適合日常音樂播放' },
  wav: { desc: 'WAV 是微軟開發的無損音訊格式，音質完美無損，但檔案體積較大，適合專業錄音與編輯' },
  wem: { desc: 'WEM 是遊戲音訊格式，常見於 Wwise 引擎' },
}

const customMeta = (source: string, target: string) => ({
  title: `免費線上批次 ${source} 轉 ${target} - 極速轉換，無需安裝軟體`,
  description: `線上將 ${source} 轉為 ${target}，免費，無需下載軟體，無需上傳伺服器，支援批次轉換，極速處理，高品質音訊直接下載，安全又私密。`,
  keywords: `${source}轉${target},${source} to ${target},線上${source}轉${target},免費音訊轉換器,批次${source}轉${target},無需上傳,高速轉換,線上批次音訊轉換,安全私密音訊轉換`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
