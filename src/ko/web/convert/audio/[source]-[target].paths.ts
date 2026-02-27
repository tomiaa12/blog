import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3(MPEG-1 Audio Layer III)는 가장 인기 있는 손실 압축 오디오 포맷으로 호환성이 뛰어나 일상적인 음악 재생에 적합합니다' },
  wav: { desc: 'WAV는 Microsoft가 개발한 무손실 오디오 포맷으로 완벽한 음질을 제공하며 전문적인 녹음 및 편집에 적합합니다' },
  wem: { desc: 'WEM은 Wwise 엔진에서 주로 사용되는 게임 오디오 포맷입니다' },
}

const customMeta = (source: string, target: string) => ({
  title: `무료 온라인 ${source.toUpperCase()} to ${target.toUpperCase()} 변환기 - 빠르고 소프트웨어 불필요`,
  description: `${source.toUpperCase()}을 ${target.toUpperCase()}로 온라인에서 무료 변환. 소프트웨어 다운로드 불필요, 서버 업로드 불필요. 배치 변환 지원, 고품질 오디오 출력, 빠르고 안전.`,
  keywords: `${source} to ${target},${source}를 ${target}로 변환,온라인 ${source} to ${target} 변환기,무료 오디오 변환기,배치 ${source} to ${target},업로드 불필요,빠른 변환,온라인 오디오 변환`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
