import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3 (MPEG-1 Audio Layer III) en popüler kayıplı ses formatıdır, yüksek uyumluluk sunar ve günlük müzik çalma için idealdir' },
  wav: { desc: 'WAV, Microsoft tarafından geliştirilen kayıpsız bir ses formatıdır, mükemmel ses kalitesiyle profesyonel kayıt ve düzenleme için uygundur' },
  wem: { desc: 'WEM, Wwise motorunda yaygın olarak kullanılan bir oyun ses formatıdır' },
}

const customMeta = (source: string, target: string) => ({
  title: `Ücretsiz Online ${source.toUpperCase()} to ${target.toUpperCase()} Dönüştürücü - Hızlı, Yazılım Gerektirmez`,
  description: `${source.toUpperCase()} dosyalarını ${target.toUpperCase()} formatına çevrimiçi ücretsiz dönüştürün. Yazılım indirmeye veya sunucuya yüklemeye gerek yok. Yüksek kaliteli ses çıktısıyla toplu dönüştürmeyi destekler, hızlı ve güvenli.`,
  keywords: `${source} to ${target},${source} ${target} dönüştür,online ${source} ${target} dönüştürücü,ücretsiz ses dönüştürücü,toplu ${source} ${target},yükleme gerekmez,hızlı dönüştürme,online ses dönüştürme`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
