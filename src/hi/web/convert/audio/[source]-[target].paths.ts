import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3 (MPEG-1 Audio Layer III) सबसे लोकप्रिय लॉसी ऑडियो फॉर्मेट है, जो अत्यधिक संगत है और रोजमर्रा के संगीत प्लेबैक के लिए उपयुक्त है' },
  wav: { desc: 'WAV Microsoft द्वारा विकसित एक लॉसलेस ऑडियो फॉर्मेट है, जिसकी ऑडियो गुणवत्ता बेहतरीन है और पेशेवर रिकॉर्डिंग व संपादन के लिए उपयुक्त है' },
  wem: { desc: 'WEM एक गेम ऑडियो फॉर्मेट है जो आमतौर पर Wwise इंजन में उपयोग किया जाता है' },
}

const customMeta = (source: string, target: string) => ({
  title: `मुफ्त ऑनलाइन ${source.toUpperCase()} से ${target.toUpperCase()} कनवर्टर - तेज़, कोई सॉफ्टवेयर नहीं`,
  description: `${source.toUpperCase()} को ${target.toUpperCase()} में ऑनलाइन मुफ्त में बदलें। कोई सॉफ्टवेयर डाउनलोड की जरूरत नहीं, सर्वर पर अपलोड की जरूरत नहीं। बैच रूपांतरण का समर्थन करता है, उच्च गुणवत्ता वाली ऑडियो आउटपुट, तेज़ और सुरक्षित।`,
  keywords: `${source} से ${target},${source} को ${target} में बदलें,ऑनलाइन ${source} से ${target} कनवर्टर,मुफ्त ऑडियो कनवर्टर,बैच ${source} से ${target},अपलोड की जरूरत नहीं,तेज़ रूपांतरण,ऑनलाइन ऑडियो रूपांतरण`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
