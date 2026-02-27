import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3 (MPEG-1 Audio Layer III) é o formato de áudio com perda mais popular, altamente compatível e ideal para reprodução musical do dia a dia' },
  wav: { desc: 'WAV é um formato de áudio sem perda desenvolvido pela Microsoft com qualidade de áudio perfeita, adequado para gravação e edição profissional' },
  wem: { desc: 'WEM é um formato de áudio para jogos comumente usado no motor Wwise' },
}

const customMeta = (source: string, target: string) => ({
  title: `Conversor Online Gratuito de ${source.toUpperCase()} para ${target.toUpperCase()} - Rápido, Sem Software`,
  description: `Converta ${source.toUpperCase()} para ${target.toUpperCase()} online gratuitamente. Sem necessidade de download de software ou upload para servidor. Suporta conversão em lote com saída de áudio de alta qualidade, rápido e seguro.`,
  keywords: `${source} para ${target},converter ${source} para ${target},conversor online de ${source} para ${target},conversor de áudio gratuito,lote ${source} para ${target},sem upload necessário,conversão rápida,conversão de áudio online`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
