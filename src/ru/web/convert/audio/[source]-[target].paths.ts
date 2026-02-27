import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3 (MPEG-1 Audio Layer III) — самый популярный формат аудио с потерями, высоко совместимый и идеальный для повседневного прослушивания музыки' },
  wav: { desc: 'WAV — аудиоформат без потерь, разработанный Microsoft, с идеальным качеством звука, подходящий для профессиональной записи и редактирования' },
  wem: { desc: 'WEM — игровой аудиоформат, широко используемый в движке Wwise' },
}

const customMeta = (source: string, target: string) => ({
  title: `Бесплатный онлайн-конвертер ${source.toUpperCase()} в ${target.toUpperCase()} - Быстро, без программ`,
  description: `Конвертируйте ${source.toUpperCase()} в ${target.toUpperCase()} онлайн бесплатно. Не нужно скачивать программы или загружать файлы на сервер. Поддерживает пакетную конвертацию с высококачественным аудиовыходом, быстро и безопасно.`,
  keywords: `${source} в ${target},конвертировать ${source} в ${target},онлайн-конвертер ${source} в ${target},бесплатный аудиоконвертер,пакетный ${source} в ${target},без загрузки,быстрая конвертация,онлайн-конвертация аудио`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
