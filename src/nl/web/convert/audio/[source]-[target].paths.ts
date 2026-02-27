import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3 (MPEG-1 Audio Layer III) is het meest populaire lossy audioformaat, zeer compatibel en ideaal voor dagelijkse muziekweergave' },
  wav: { desc: 'WAV is een lossless audioformaat ontwikkeld door Microsoft met perfecte audiokwaliteit, geschikt voor professionele opnames en bewerking' },
  wem: { desc: 'WEM is een gameaudioformaat dat vaak wordt gebruikt in de Wwise-engine' },
}

const customMeta = (source: string, target: string) => ({
  title: `Gratis Online ${source.toUpperCase()} naar ${target.toUpperCase()} Converter - Snel, Geen Software Vereist`,
  description: `Converteer ${source.toUpperCase()} naar ${target.toUpperCase()} online gratis. Geen software-download vereist, geen server-upload nodig. Ondersteunt batchconversie met hoogwaardige audio-uitvoer, snel en veilig.`,
  keywords: `${source} naar ${target},${source} naar ${target} converteren,online ${source} naar ${target} converter,gratis audioconverter,batch ${source} naar ${target},geen upload vereist,snelle conversie,online audioconversie`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
