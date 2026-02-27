import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3 (MPEG-1 Audio Layer III) là định dạng âm thanh nén có mất mát phổ biến nhất, tương thích cao và lý tưởng cho việc nghe nhạc hàng ngày' },
  wav: { desc: 'WAV là định dạng âm thanh không mất mát do Microsoft phát triển với chất lượng âm thanh hoàn hảo, phù hợp cho việc ghi âm và chỉnh sửa chuyên nghiệp' },
  wem: { desc: 'WEM là định dạng âm thanh trò chơi thường được sử dụng trong engine Wwise' },
}

const customMeta = (source: string, target: string) => ({
  title: `Chuyển đổi ${source.toUpperCase()} sang ${target.toUpperCase()} trực tuyến miễn phí - Nhanh, không cần phần mềm`,
  description: `Chuyển đổi ${source.toUpperCase()} sang ${target.toUpperCase()} trực tuyến miễn phí. Không cần tải phần mềm hay tải lên máy chủ. Hỗ trợ chuyển đổi hàng loạt với đầu ra âm thanh chất lượng cao, nhanh và an toàn.`,
  keywords: `${source} sang ${target},chuyển ${source} sang ${target},trình chuyển đổi ${source} sang ${target} trực tuyến,trình chuyển đổi âm thanh miễn phí,hàng loạt ${source} sang ${target},không cần tải lên,chuyển đổi nhanh,chuyển đổi âm thanh trực tuyến`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
