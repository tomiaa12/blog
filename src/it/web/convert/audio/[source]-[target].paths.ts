import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: "MP3 (MPEG-1 Audio Layer III) è il formato audio con perdita più popolare, altamente compatibile e ideale per la riproduzione musicale quotidiana" },
  wav: { desc: "WAV è un formato audio lossless sviluppato da Microsoft con qualità audio perfetta, adatto alla registrazione e all'editing professionale" },
  wem: { desc: "WEM è un formato audio per giochi comunemente usato nel motore Wwise" },
}

const customMeta = (source: string, target: string) => ({
  title: `Convertitore Online Gratuito da ${source.toUpperCase()} a ${target.toUpperCase()} - Veloce, Senza Software`,
  description: `Converti ${source.toUpperCase()} in ${target.toUpperCase()} online gratuitamente. Nessun download di software richiesto, nessun upload su server necessario. Supporta la conversione in batch con output audio di alta qualità, veloce e sicuro.`,
  keywords: `${source} in ${target},converti ${source} in ${target},convertitore online ${source} in ${target},convertitore audio gratuito,batch ${source} in ${target},nessun upload richiesto,conversione rapida,conversione audio online`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
