import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3 (MPEG-1 Audio Layer III) es el formato de audio con pérdida más popular, muy compatible e ideal para la reproducción de música cotidiana' },
  wav: { desc: 'WAV es un formato de audio sin pérdidas desarrollado por Microsoft con calidad de audio perfecta, adecuado para grabación y edición profesional' },
  wem: { desc: 'WEM es un formato de audio para juegos comúnmente usado en el motor Wwise' },
}

const customMeta = (source: string, target: string) => ({
  title: `Convertidor Online Gratuito de ${source.toUpperCase()} a ${target.toUpperCase()} - Rápido, Sin Software`,
  description: `Convierte ${source.toUpperCase()} a ${target.toUpperCase()} online gratis. Sin necesidad de descargar software ni subir a servidores. Compatible con conversión por lotes con salida de audio de alta calidad, rápido y seguro.`,
  keywords: `${source} a ${target},convertir ${source} a ${target},convertidor online de ${source} a ${target},convertidor de audio gratuito,${source} a ${target} en lote,sin subida requerida,conversión rápida,conversión de audio online`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
