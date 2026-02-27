import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3 (MPEG-1 Audio Layer III) är det mest populära förlustiga ljudformatet, mycket kompatibelt och idealiskt för daglig musikuppspelning' },
  wav: { desc: 'WAV är ett förlustfritt ljudformat utvecklat av Microsoft med perfekt ljudkvalitet, lämpligt för professionell inspelning och redigering' },
  wem: { desc: 'WEM är ett spelljudformat som vanligtvis används i Wwise-motorn' },
}

const customMeta = (source: string, target: string) => ({
  title: `Gratis Online ${source.toUpperCase()} till ${target.toUpperCase()} Konverterare - Snabb, Ingen Programvara Krävs`,
  description: `Konvertera ${source.toUpperCase()} till ${target.toUpperCase()} online gratis. Ingen programvara behöver laddas ner, ingen serveruppladdning krävs. Stöder batchkonvertering med högkvalitativ ljudutmatning, snabb och säker.`,
  keywords: `${source} till ${target},konvertera ${source} till ${target},online ${source} till ${target} konverterare,gratis ljudkonverterare,batch ${source} till ${target},ingen uppladdning krävs,snabb konvertering,online ljudkonvertering`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
