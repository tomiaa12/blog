import { generateAudioRoutes } from '../../../../zh/web/convert/audio/[source]-[target].paths'
import type { AudioFormat } from '../../../../zh/web/convert/audio/[source]-[target].paths'

const customAudioFormats: Record<string, Partial<AudioFormat>> = {
  mp3: { desc: 'MP3 (MPEG-1 Audio Layer III) เป็นรูปแบบเสียงที่มีการสูญเสียข้อมูลที่ได้รับความนิยมสูงสุด มีความเข้ากันได้สูงและเหมาะสำหรับการเล่นเพลงในชีวิตประจำวัน' },
  wav: { desc: 'WAV เป็นรูปแบบเสียงที่ไม่มีการสูญเสียข้อมูลที่พัฒนาโดย Microsoft มีคุณภาพเสียงที่สมบูรณ์แบบ เหมาะสำหรับการบันทึกและการแก้ไขอย่างมืออาชีพ' },
  wem: { desc: 'WEM เป็นรูปแบบเสียงสำหรับเกมที่ใช้กันทั่วไปในเอ็นจิน Wwise' },
}

const customMeta = (source: string, target: string) => ({
  title: `แปลง ${source.toUpperCase()} เป็น ${target.toUpperCase()} ออนไลน์ฟรี - รวดเร็ว ไม่ต้องติดตั้งซอฟต์แวร์`,
  description: `แปลง ${source.toUpperCase()} เป็น ${target.toUpperCase()} ออนไลน์ฟรี ไม่ต้องดาวน์โหลดซอฟต์แวร์หรืออัปโหลดไปยังเซิร์ฟเวอร์ รองรับการแปลงแบบเป็นชุด ด้วยเอาต์พุตเสียงคุณภาพสูง รวดเร็วและปลอดภัย`,
  keywords: `${source} เป็น ${target},แปลง ${source} เป็น ${target},ตัวแปลง ${source} เป็น ${target} ออนไลน์,ตัวแปลงเสียงฟรี,แบทช์ ${source} เป็น ${target},ไม่ต้องอัปโหลด,แปลงเร็ว,แปลงเสียงออนไลน์`,
})

export default {
  paths: generateAudioRoutes(customMeta, customAudioFormats),
}
