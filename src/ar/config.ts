import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "أدوات على الإنترنت, أدوات مجانية, الألعاب, الألعاب FC, الألعاب الصغيرة, معالجة الصور, ضغط الصور, تحويل الصور, قص الصور, معالجة الPDF, PDF إلى Word, PDF من إعادة تسوية, PDF الضغط, معالجة الفيديو, ضغط الفيديو, تحويل الفيديو, Base64 الترميز, ترميز URL, تحويل الإحداثيات, تحميل بلاطات الخريطة, كتابة الكلمات على الإنترنت, اختبار iframe, تحويل الصوت WEM إلى MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "أدوات على الإنترنت, أدوات مجانية, الألعاب, الألعاب FC, الألعاب الصغيرة, معالجة الصور, ضغط الصور, تحويل الصور, قص الصور, معالجة الPDF, PDF إلى Word, PDF من إعادة تسوية, PDF الضغط, معالجة الفيديو, ضغط الفيديو, تحويل الفيديو, Base64 الترميز, ترميز URL, تحويل الإحداثيات, تحميل بلاطات الخريطة, كتابة الكلمات على الإنترنت, اختبار iframe, تحويل الصوت WEM إلى MP3",
      },
    ],
  ],
  themeConfig: {
    nav: [
      {
        text: "تحويل الصيغ",
        items: [
          { text: "تحويل الصوت", link: "/ar/web/convert/audio" },
        ],
      },
      {
        text: "تشفير / فك التشفير",
        items: [
          { text: "Base64 تشفير / فك التشفير", link: "/ar/web/encode-decode/base64" },
          { text: "URL ترميز / فك ترميز", link: "/ar/web/encode-decode/url" },
        ],
      },
      {
        text: "أدوات النص",
        items: [
          { text: "دمج / تقسيم الأسطر المتعددة", link: "/ar/web/text-tools/multi-line-merge-split" },
          { text: "النص إلى صورة", link: "/ar/web/text-tools/text-to-image" },
          { text: "النص إلى صورة", link: "/ar/web/text-tools/text-to-image" },
          { text: "النص إلى صورة", link: "/ar/web/text-tools/text-to-image" },
          { text: "النص إلى صورة", link: "/ar/web/text-tools/text-to-image" },
          { text: "محوّل البينيين", link: "/ar/web/text-tools/pinyin-conversion" },
          { text: "محوّل المبسّط-التقليدي", link: "/ar/web/text-tools/simplified-traditional-conversion" },
          { text: "محوّل حالة الأحرف", link: "/ar/web/text-tools/case-conversion" },
          { text: "إزالة التكرارات", link: "/ar/web/text-tools/duplicate-removal" },
          { text: "محوّل الأرقام الرومانية", link: "/ar/web/text-tools/roman-numeral-conversion" },
          { text: "محوّل المبلغ إلى الصينية", link: "/ar/web/text-tools/uppercase-amount-conversion" },
          { text: "تقدير وقت القراءة", link: "/ar/web/text-tools/reading-time-estimation" },
          { text: "محوّل العرض الكامل/النصفي", link: "/ar/web/text-tools/full-width-half-width-conversion" },
          { text: "إحصائيات الكلمات الرئيسية", link: "/ar/web/text-tools/keyword-statistics" },
          { text: "مجموعة الإيموجي", link: "/ar/web/text-tools/emoji-all" },
          { text: "عداد الكلمات", link: "/ar/web/text-tools/word-count" },
        ],
      },
      {
        text: "اختبارات العتاد",
        items: [
          { text: "اختبار الميكروفون", link: "/ar/web/hardware-test/microphone-test" },
          { text: "اختبار الكاميرا", link: "/ar/web/hardware-test/camera-test" },
          { text: "اختبار الصوت", link: "/ar/web/hardware-test/sound-test" },
          { text: "اختبار لوحة المفاتيح", link: "/ar/web/hardware-test/keyboard-test" },
          { text: "اختبار تشغيل الصوت", link: "/ar/web/hardware-test/audio-playback-test" },
          { text: "اختبار يد التحكم", link: "/ar/web/hardware-test/gamepad-test" },
          { text: "اختبار الفأرة", link: "/ar/web/hardware-test/mouse-test" },
          { text: "اختبار الشاشة اللمسية", link: "/ar/web/hardware-test/touch-screen-test" },
          { text: "اختبار اللمس المتعدد", link: "/ar/web/hardware-test/multi-touch-test" },
          { text: "اختبار الاهتزاز", link: "/ar/web/hardware-test/vibration-test" },
          { text: "اختبار الجيروسكوب", link: "/ar/web/hardware-test/gyroscope-test" },
          { text: "اختبار مقياس التسارع", link: "/ar/web/hardware-test/accelerometer-test" },
          { text: "اختبار FPS", link: "/ar/web/hardware-test/fps-test" },
          { text: "اختبار البكسل المعطلة", link: "/ar/web/hardware-test/screen-bad-point-test" },
          { text: "اختبار دقة الشاشة", link: "/ar/web/hardware-test/screen-resolution-test" },
        ],
      },
      {
        text: "أدوات المطور",
        items: [
          { text: "تحويل إحداثيات الخريطة", link: "/ar/web/dev-tools/map-coordinate-conversion" },
        ],
      },
      {
        text: "ألعاب",
        items: [
          { text: "ألعاب FC الكلاسيكية", link: "/pages/game" },
          { text: "ألعاب Java الكلاسيكية", link: "/pages/javaGames" },
        ],
      },
    ],
    returnToTopLabel: "العودة إلى الأعلى",
    sidebarMenuLabel: "الفهرس",
    darkModeSwitchLabel: "تبديل الوضع",
    lightModeSwitchTitle: "التبديل إلى الوضع الفاتح",
    darkModeSwitchTitle: "التبديل إلى الوضع الداكن",
    notFound: {
      title: "الصفحة غير موجودة",
      quote: "الصفحة غير موجودة، يرجى التحقق من صحة الرابط.",
      linkLabel: "العودة إلى الصفحة الرئيسية",
      linkText: "العودة إلى الصفحة الرئيسية",
    },
    search: {
      options: {
        placeholder: "البحث في الوثائق",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "اسأل الذكاء الاصطناعي",
                buttonAriaLabel: "اسأل الذكاء الاصطناعي",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "اسأل الذكاء الاصطناعي",
                  conversationHistoryTitle: "سجل محادثاتي",
                  newConversationText: "بدء محادثة جديدة",
                  viewConversationHistoryText: "سجل المحادثات",
                },
                promptForm: {
                  promptPlaceholderText: "طرح سؤال",
                  promptAnsweringText: "جارٍ الإجابة...",
                  promptAskAnotherQuestionText: "طرح سؤال آخر",
                  promptDisclaimerText:
                    "الإجابة مولّدة بواسطة الذكاء الاصطناعي وقد تحتوي على أخطاء.",
                  promptLabelText: "Enter للإرسال، Shift+Enter لسطر جديد.",
                  promptAriaLabelText: "إدخال السؤال",
                },
                conversationScreen: {
                  preToolCallText: "جارٍ البحث...",
                  searchingText: "جارٍ البحث...",
                  toolCallResultText: "تم البحث",
                  conversationDisclaimer:
                    "الإجابة مولّدة بواسطة الذكاء الاصطناعي وقد تحتوي على أخطاء. يرجى التحقق.",
                  reasoningText: "جارٍ التفكير...",
                  thinkingText: "جارٍ التفكير...",
                  relatedSourcesText: "المصادر ذات الصلة",
                  stoppedStreamingText: "لقد أوقفت هذه الإجابة",
                  copyButtonText: "نسخ",
                  copyButtonCopiedText: "تم النسخ!",
                  likeButtonTitle: "إعجاب",
                  dislikeButtonTitle: "عدم إعجاب",
                  thanksForFeedbackText: "شكراً على ملاحظاتك!",
                  errorTitleText: "خطأ في الدردشة",
                },
                newConversationScreen: {
                  titleText: "كيف يمكنني مساعدتك اليوم؟",
                  introductionText:
                    "سأبحث في وثائقك للعثور بسرعة على أدلة الإعداد وتفاصيل الميزات ونصائح استكشاف الأخطاء.",
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
            buttonText: "بحث",
            buttonAriaLabel: "بحث",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "مسح",
              clearButtonAriaLabel: "مسح البحث",
              closeButtonText: "إغلاق",
              closeButtonAriaLabel: "إغلاق",
              placeholderText: "البحث في الوثائق أو سؤال الذكاء الاصطناعي",
              placeholderTextAskAi: "طرح سؤال آخر...",
              placeholderTextAskAiStreaming: "جارٍ الإجابة...",
              searchInputLabel: "بحث",
              backToKeywordSearchButtonText:
                "العودة إلى البحث بالكلمات المفتاحية",
              backToKeywordSearchButtonAriaLabel:
                "العودة إلى البحث بالكلمات المفتاحية",
              newConversationPlaceholder: "طرح سؤال",
              conversationHistoryTitle: "سجل محادثاتي",
              startNewConversationText: "بدء محادثة جديدة",
              viewConversationHistoryText: "سجل المحادثات",
              threadDepthErrorPlaceholder: "تم الوصول إلى حد المحادثة",
            },
            newConversation: {
              newConversationTitle: "كيف يمكنني مساعدتك اليوم؟",
              newConversationDescription:
                "سأبحث في وثائقك للعثور بسرعة على أدلة الإعداد وتفاصيل الميزات ونصائح استكشاف الأخطاء.",
            },
            footer: {
              selectText: "تحديد",
              submitQuestionText: "إرسال السؤال",
              selectKeyAriaLabel: "مفتاح Enter",
              navigateText: "تنقل",
              navigateUpKeyAriaLabel: "سهم لأعلى",
              navigateDownKeyAriaLabel: "سهم لأسفل",
              closeText: "إغلاق",
              backToSearchText: "العودة إلى البحث",
              closeKeyAriaLabel: "مفتاح Esc",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "تعذّر جلب النتائج",
              helpText: "قد تحتاج إلى التحقق من اتصالك بالشبكة.",
            },
            startScreen: {
              recentSearchesTitle: "الأخيرة",
              noRecentSearchesText: "لا توجد عمليات بحث حديثة",
              saveRecentSearchButtonTitle: "حفظ هذا البحث",
              removeRecentSearchButtonTitle: "إزالة هذا البحث من السجل",
              favoriteSearchesTitle: "المفضلة",
              removeFavoriteSearchButtonTitle: "إزالة من المفضلة",
              recentConversationsTitle: "المحادثات الأخيرة",
              removeRecentConversationButtonTitle:
                "إزالة هذه المحادثة من السجل",
            },
            noResultsScreen: {
              noResultsText: "لم يتم العثور على نتائج ذات صلة",
              suggestedQueryText: "حاول البحث",
              reportMissingResultsText:
                "هل تعتقد أن هذا الاستعلام يجب أن تكون له نتائج؟",
              reportMissingResultsLinkText: "أخبرنا.",
            },
            resultsScreen: {
              askAiPlaceholder: "اسأل الذكاء الاصطناعي:",
              noResultsAskAiPlaceholder: "لم تجد في الوثائق؟ جرّب Ask AI:",
            },
            askAiScreen: {
              disclaimerText:
                "الإجابة مولّدة بواسطة الذكاء الاصطناعي وقد تحتوي على أخطاء. يرجى التحقق.",
              relatedSourcesText: "المصادر ذات الصلة",
              thinkingText: "جارٍ التفكير...",
              copyButtonText: "نسخ",
              copyButtonCopiedText: "تم النسخ!",
              copyButtonTitle: "نسخ",
              likeButtonTitle: "إعجاب",
              dislikeButtonTitle: "عدم إعجاب",
              thanksForFeedbackText: "شكراً على ملاحظاتك!",
              preToolCallText: "جارٍ البحث...",
              duringToolCallText: "جارٍ البحث...",
              afterToolCallText: "تم البحث",
              stoppedStreamingText: "لقد أوقفت هذه الإجابة",
              errorTitleText: "خطأ في الدردشة",
              threadDepthExceededMessage:
                "تم إغلاق هذه المحادثة للحفاظ على دقة الإجابات.",
              startNewConversationButtonText: "بدء محادثة جديدة",
            },
          },
        },
      },
    },
    outlineTitle: "في هذه الصفحة",
    lastUpdatedText: "آخر تحديث",
    docFooter: {
      prev: "السابق",
      next: "التالي",
    },
    footer: {},
    editLink: {
      text: "تحرير هذه الصفحة على GitHub",
    },
  },
})
