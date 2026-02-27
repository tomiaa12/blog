import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3 (MPEG-1 Audio Layer III) adalah format audio lossy yang paling populer, sangat kompatibel dan ideal untuk pemutaran musik sehari-hari' },
  wav: { desc: 'WAV adalah format audio lossless yang dikembangkan oleh Microsoft dengan kualitas audio sempurna, cocok untuk perekaman dan pengeditan profesional' },
  wem: { desc: 'WEM adalah format audio game yang umum digunakan dalam mesin Wwise' },
}

const customMeta = (source: string, target: string) => ({
  title: `Konverter ${source.toUpperCase()} ke ${target.toUpperCase()} Online Gratis - Cepat, Tanpa Perangkat Lunak`,
  description: `Konversi ${source.toUpperCase()} ke ${target.toUpperCase()} secara online gratis. Tidak perlu mengunduh perangkat lunak atau mengunggah ke server. Mendukung konversi batch dengan output audio berkualitas tinggi, cepat dan aman.`,
  keywords: `${source} ke ${target},konversi ${source} ke ${target},konverter ${source} ke ${target} online,konverter audio gratis,batch ${source} ke ${target},tidak perlu unggah,konversi cepat,konversi audio online`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
