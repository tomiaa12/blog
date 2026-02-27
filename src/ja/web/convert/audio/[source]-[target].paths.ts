import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3（MPEG-1 Audio Layer III）は最も人気の高い非可逆圧縮音声フォーマットで、互換性が高く日常の音楽再生に最適です' },
  wav: { desc: 'WAVはMicrosoftが開発した無劣化音声フォーマットで、完璧な音質を持ち、プロフェッショナルな録音・編集に適しています' },
  wem: { desc: 'WEMはWwiseエンジンでよく使われるゲーム音声フォーマットです' },
}

const customMeta = (source: string, target: string) => ({
  title: `無料オンライン ${source.toUpperCase()} から ${target.toUpperCase()} 変換 - 高速、ソフト不要`,
  description: `${source.toUpperCase()} を ${target.toUpperCase()} にオンラインで無料変換。ソフトのダウンロード不要、サーバーへのアップロード不要。バッチ変換対応、高品質な音声出力、高速かつ安全。`,
  keywords: `${source} から ${target},${source} を ${target} に変換,オンライン ${source} から ${target} 変換器,無料音声変換器,バッチ ${source} から ${target},アップロード不要,高速変換,オンライン音声変換`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
