import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "เครื่องมือออนไลน์, เครื่องมือฟรี, เกม, เกม FC, เกมเล็ก, การประมวลผลรูปภาพ, การบีบอัดรูปภาพ, การแปลงรูปภาพ, การตัดรูปภาพ, การประมวลผล PDF, PDF เป็น Word, PDF รวม, PDF บีบอัด, การประมวลผลวิดีโอ, การบีบอัดวิดีโอ, การแปลงวิดีโอ, Base64 การเขียนรหัส, การแปลงพิกัด, ดาวน์โหลดกริดแผนที่, เขียนคำออนไลน์, ทดสอบ iframe, แปลงเสียง WEM เป็น MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "เครื่องมือออนไลน์, เครื่องมือฟรี, เกม, เกม FC, เกมเล็ก, การประมวลผลรูปภาพ, การบีบอัดรูปภาพ, การแปลงรูปภาพ, การตัดรูปภาพ, การประมวลผล PDF, PDF เป็น Word, PDF รวม, PDF บีบอัด, การประมวลผลวิดีโอ, การบีบอัดวิดีโอ, การแปลงวิดีโอ, Base64 การเขียนรหัส, การแปลงพิกัด, ดาวน์โหลดกริดแผนที่, เขียนคำออนไลน์, ทดสอบ iframe, แปลงเสียง WEM เป็น MP3",
      },
    ],
  ],
  themeConfig: {
    nav: [
      {
        text: "แปลงรูปแบบ",
        items: [
          { text: "แปลงเสียง", link: "/web/convert/audio" },
        ],
      },
      {
        text: "เกม",
        items: [
          { text: "เกม FC คลาสสิก", link: "/pages/game" },
          { text: "เกม Java คลาสสิก", link: "/pages/javaGames" },
        ],
      },
    ],
    returnToTopLabel: "กลับสู่ด้านบน",
    sidebarMenuLabel: "สารบัญ",
    darkModeSwitchLabel: "สลับโหมด",
    lightModeSwitchTitle: "เปลี่ยนเป็นโหมดสว่าง",
    darkModeSwitchTitle: "เปลี่ยนเป็นโหมดมืด",
    notFound: {
      title: "ไม่พบหน้า",
      quote: "ไม่พบหน้า กรุณาตรวจสอบ URL",
      linkLabel: "กลับสู่หน้าหลัก",
      linkText: "กลับสู่หน้าหลัก",
    },
    search: {
      options: {
        placeholder: "ค้นหาเอกสาร",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "ถาม AI",
                buttonAriaLabel: "ถาม AI",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "ถาม AI",
                  conversationHistoryTitle: "ประวัติการสนทนาของฉัน",
                  newConversationText: "เริ่มการสนทนาใหม่",
                  viewConversationHistoryText: "ประวัติการสนทนา",
                },
                promptForm: {
                  promptPlaceholderText: "ถามคำถาม",
                  promptAnsweringText: "กำลังตอบ...",
                  promptAskAnotherQuestionText: "ถามคำถามอื่น",
                  promptDisclaimerText: "คำตอบสร้างโดย AI อาจมีข้อผิดพลาด",
                  promptLabelText:
                    "Enter เพื่อส่ง, Shift+Enter เพื่อขึ้นบรรทัดใหม่",
                  promptAriaLabelText: "ป้อนคำถาม",
                },
                conversationScreen: {
                  preToolCallText: "กำลังค้นหา...",
                  searchingText: "กำลังค้นหา...",
                  toolCallResultText: "ค้นหาแล้ว",
                  conversationDisclaimer:
                    "คำตอบสร้างโดย AI อาจมีข้อผิดพลาด กรุณาตรวจสอบ",
                  reasoningText: "กำลังวิเคราะห์...",
                  thinkingText: "กำลังคิด...",
                  relatedSourcesText: "แหล่งที่มาที่เกี่ยวข้อง",
                  stoppedStreamingText: "คุณหยุดการตอบนี้แล้ว",
                  copyButtonText: "คัดลอก",
                  copyButtonCopiedText: "คัดลอกแล้ว!",
                  likeButtonTitle: "ชอบ",
                  dislikeButtonTitle: "ไม่ชอบ",
                  thanksForFeedbackText: "ขอบคุณสำหรับความคิดเห็น!",
                  errorTitleText: "ข้อผิดพลาดในการแชท",
                },
                newConversationScreen: {
                  titleText: "วันนี้ฉันจะช่วยคุณได้อย่างไร?",
                  introductionText:
                    "ฉันจะค้นหาในเอกสารของคุณเพื่อค้นหาคู่มือการตั้งค่า รายละเอียดฟีเจอร์ และเคล็ดลับการแก้ปัญหาอย่างรวดเร็ว",
                },
                logo: {
                  poweredByText: "",
                },
              },
            },
          },
        },
        translations: {
          button: {
            buttonText: "ค้นหา",
            buttonAriaLabel: "ค้นหา",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "ล้าง",
              clearButtonAriaLabel: "ล้างการค้นหา",
              closeButtonText: "ปิด",
              closeButtonAriaLabel: "ปิด",
              placeholderText: "ค้นหาเอกสารหรือถาม AI",
              placeholderTextAskAi: "ป้อนคำถามอื่น...",
              placeholderTextAskAiStreaming: "กำลังตอบ...",
              searchInputLabel: "ค้นหา",
              backToKeywordSearchButtonText: "กลับไปค้นหาด้วยคีย์เวิร์ด",
              backToKeywordSearchButtonAriaLabel: "กลับไปค้นหาด้วยคีย์เวิร์ด",
              newConversationPlaceholder: "ถามคำถาม",
              conversationHistoryTitle: "ประวัติการสนทนาของฉัน",
              startNewConversationText: "เริ่มการสนทนาใหม่",
              viewConversationHistoryText: "ประวัติการสนทนา",
              threadDepthErrorPlaceholder: "ถึงขีดจำกัดการสนทนา",
            },
            newConversation: {
              newConversationTitle: "วันนี้ฉันจะช่วยคุณได้อย่างไร?",
              newConversationDescription:
                "ฉันจะค้นหาในเอกสารของคุณเพื่อค้นหาคู่มือการตั้งค่า รายละเอียดฟีเจอร์ และเคล็ดลับการแก้ปัญหาอย่างรวดเร็ว",
            },
            footer: {
              selectText: "เลือก",
              submitQuestionText: "ส่งคำถาม",
              selectKeyAriaLabel: "ปุ่ม Enter",
              navigateText: "นำทาง",
              navigateUpKeyAriaLabel: "ลูกศรขึ้น",
              navigateDownKeyAriaLabel: "ลูกศรลง",
              closeText: "ปิด",
              backToSearchText: "กลับไปค้นหา",
              closeKeyAriaLabel: "ปุ่ม Esc",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "ไม่สามารถดึงผลลัพธ์ได้",
              helpText: "คุณอาจต้องตรวจสอบการเชื่อมต่อเครือข่าย",
            },
            startScreen: {
              recentSearchesTitle: "ล่าสุด",
              noRecentSearchesText: "ไม่มีการค้นหาล่าสุด",
              saveRecentSearchButtonTitle: "บันทึกการค้นหานี้",
              removeRecentSearchButtonTitle: "ลบการค้นหานี้ออกจากประวัติ",
              favoriteSearchesTitle: "รายการโปรด",
              removeFavoriteSearchButtonTitle: "ลบออกจากรายการโปรด",
              recentConversationsTitle: "การสนทนาล่าสุด",
              removeRecentConversationButtonTitle: "ลบการสนทนานี้ออกจากประวัติ",
            },
            noResultsScreen: {
              noResultsText: "ไม่พบผลลัพธ์ที่เกี่ยวข้อง",
              suggestedQueryText: "ลองค้นหา",
              reportMissingResultsText: "คุณคิดว่าการค้นหานี้ควรมีผลลัพธ์?",
              reportMissingResultsLinkText: "แจ้งให้เราทราบ",
            },
            resultsScreen: {
              askAiPlaceholder: "ถาม AI:",
              noResultsAskAiPlaceholder: "ไม่พบในเอกสาร? ลอง Ask AI:",
            },
            askAiScreen: {
              disclaimerText: "คำตอบสร้างโดย AI อาจมีข้อผิดพลาด กรุณาตรวจสอบ",
              relatedSourcesText: "แหล่งที่มาที่เกี่ยวข้อง",
              thinkingText: "กำลังคิด...",
              copyButtonText: "คัดลอก",
              copyButtonCopiedText: "คัดลอกแล้ว!",
              copyButtonTitle: "คัดลอก",
              likeButtonTitle: "ชอบ",
              dislikeButtonTitle: "ไม่ชอบ",
              thanksForFeedbackText: "ขอบคุณสำหรับความคิดเห็น!",
              preToolCallText: "กำลังค้นหา...",
              duringToolCallText: "กำลังค้นหา...",
              afterToolCallText: "ค้นหาแล้ว",
              stoppedStreamingText: "คุณหยุดการตอบนี้แล้ว",
              errorTitleText: "ข้อผิดพลาดในการแชท",
              threadDepthExceededMessage:
                "การสนทนานี้ถูกปิดเพื่อรักษาความถูกต้องของคำตอบ",
              startNewConversationButtonText: "เริ่มการสนทนาใหม่",
            },
          },
        },
      },
    },
    outlineTitle: "ในหน้านี้",
    lastUpdatedText: "อัปเดตล่าสุด",
    docFooter: {
      prev: "ก่อนหน้า",
      next: "ถัดไป",
    },
    footer: {},
    editLink: {
      text: "แก้ไขหน้านี้บน GitHub",
    },
  },
})
