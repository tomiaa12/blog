import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3 (MPEG-1 Audio Layer III) هو أكثر تنسيقات الصوت المضغوط انتشارًا، يتميز بتوافق عالٍ ومناسب للاستماع اليومي للموسيقى' },
  wav: { desc: 'WAV هو تنسيق صوت غير مضغوط طورته Microsoft يتميز بجودة صوت مثالية ومناسب للتسجيل والتحرير الاحترافي' },
  wem: { desc: 'WEM هو تنسيق صوت للألعاب يُستخدم بشكل شائع في محرك Wwise' },
}

const customMeta = (source: string, target: string) => ({
  title: `محول ${source.toUpperCase()} إلى ${target.toUpperCase()} مجاني عبر الإنترنت - سريع، لا يتطلب برامج`,
  description: `حوّل ${source.toUpperCase()} إلى ${target.toUpperCase()} عبر الإنترنت مجانًا. لا حاجة لتحميل برامج أو رفع الملفات إلى خادم. يدعم التحويل الدفعي مع إخراج صوتي عالي الجودة، سريع وآمن.`,
  keywords: `${source} إلى ${target},تحويل ${source} إلى ${target},محول ${source} إلى ${target} عبر الإنترنت,محول صوت مجاني,دفعة ${source} إلى ${target},لا يتطلب رفعًا,تحويل سريع,تحويل الصوت عبر الإنترنت`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
