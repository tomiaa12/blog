import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3 (MPEG-1 Audio Layer III) ist das beliebteste verlustbehaftete Audioformat, sehr kompatibel und ideal für die alltägliche Musikwiedergabe' },
  wav: { desc: 'WAV ist ein von Microsoft entwickeltes verlustfreies Audioformat mit perfekter Audioqualität, geeignet für professionelle Aufnahmen und Bearbeitung' },
  wem: { desc: 'WEM ist ein Spielaudioformat, das häufig in der Wwise-Engine verwendet wird' },
}

const customMeta = (source: string, target: string) => ({
  title: `Kostenloser Online-Konverter ${source.toUpperCase()} zu ${target.toUpperCase()} - Schnell, Keine Software erforderlich`,
  description: `Konvertieren Sie ${source.toUpperCase()} kostenlos online zu ${target.toUpperCase()}. Kein Software-Download erforderlich, kein Server-Upload nötig. Unterstützt Batch-Konvertierung mit hochwertiger Audioausgabe, schnell und sicher.`,
  keywords: `${source} zu ${target},${source} in ${target} konvertieren,Online-${source}-zu-${target}-Konverter,kostenloser Audiokonverter,Batch-${source}-zu-${target},kein Upload erforderlich,schnelle Konvertierung,Online-Audiokonvertierung`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
