import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "أدوات على الإنترنت, أدوات مجانية, الألعاب, الألعاب FC, الألعاب الصغيرة, معالجة الصور, ضغط الصور, تحويل الصور, قص الصور, معالجة الPDF, PDF إلى Word, PDF من إعادة تسوية, PDF الضغط, معالجة الفيديو, ضغط الفيديو, تحويل الفيديو, Base64 الترميز, تحويل الإحداثيات, تحميل بلاطات الخريطة, كتابة الكلمات على الإنترنت, اختبار iframe, تحويل الصوت WEM إلى MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "أدوات على الإنترنت, أدوات مجانية, الألعاب, الألعاب FC, الألعاب الصغيرة, معالجة الصور, ضغط الصور, تحويل الصور, قص الصور, معالجة الPDF, PDF إلى Word, PDF من إعادة تسوية, PDF الضغط, معالجة الفيديو, ضغط الفيديو, تحويل الفيديو, Base64 الترميز, تحويل الإحداثيات, تحميل بلاطات الخريطة, كتابة الكلمات على الإنترنت, اختبار iframe, تحويل الصوت WEM إلى MP3",
      },
    ],
  ],
  themeConfig: {
    nav: [
      {
        text: "تحويل الصيغ",
        items: [
          { text: "تحويل الصوت", link: "/web/convert/audio" },
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
