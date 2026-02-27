import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3 (MPEG-1 Audio Layer III) to najpopularniejszy stratny format audio, wysoce kompatybilny i idealny do codziennego odtwarzania muzyki' },
  wav: { desc: 'WAV to bezstratny format audio opracowany przez Microsoft z doskonałą jakością dźwięku, odpowiedni do profesjonalnego nagrywania i edycji' },
  wem: { desc: 'WEM to format audio do gier powszechnie używany w silniku Wwise' },
}

const customMeta = (source: string, target: string) => ({
  title: `Darmowy Konwerter Online ${source.toUpperCase()} do ${target.toUpperCase()} - Szybki, Bez Oprogramowania`,
  description: `Konwertuj ${source.toUpperCase()} do ${target.toUpperCase()} online za darmo. Nie wymaga pobierania oprogramowania ani przesyłania na serwer. Obsługuje konwersję wsadową z wysokiej jakości wyjściem audio, szybko i bezpiecznie.`,
  keywords: `${source} do ${target},konwertuj ${source} do ${target},konwerter online ${source} do ${target},darmowy konwerter audio,wsadowe ${source} do ${target},bez wysyłania,szybka konwersja,konwersja audio online`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
