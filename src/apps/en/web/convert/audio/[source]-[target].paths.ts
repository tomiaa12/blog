// @ts-ignore - TS cannot statically resolve filenames with brackets, Vite handles this at runtime
import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3 (MPEG-1 Audio Layer III) is the most popular lossy audio format, highly compatible and ideal for everyday music playback' },
  wav: { desc: 'WAV is a lossless audio format developed by Microsoft with perfect audio quality, suitable for professional recording and editing' },
  wem: { desc: 'WEM is a game audio format commonly used in the Wwise engine' },
}

const customMeta = (source: string, target: string) => ({
  title: `Free Online ${source.toUpperCase()} to ${target.toUpperCase()} Converter - Fast, No Software Required`,
  description: `Convert ${source.toUpperCase()} to ${target.toUpperCase()} online for free. No software download needed, no server upload required. Supports batch conversion with high-quality audio output, fast and secure.`,
  keywords: `${source} to ${target},convert ${source} to ${target},online ${source} to ${target} converter,free audio converter,batch ${source} to ${target},no upload required,fast conversion,online audio conversion`,
})
console.log(generateAudioRoutes(customMeta, customAudioFormats)())
export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
