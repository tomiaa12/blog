import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "ऑनलाइन उपकरण, मुफ्त उपकरण, खेल, FC खेल, छोटे खेल, छवि संसाधन, छवि संपीड़न, छवि परिवर्तन, छवि कटाव, PDF संसाधन, PDF से Word, PDF संयोजन, PDF संपीड़न, वीडियो संसाधन, वीडियो संपीड़न, वीडियो परिवर्तन, Base64 एनकोडिंग, URL एन्कोडिंग, संयोजन परिवर्तन, मानचित्र टाइल डाउनलोड, ऑनलाइन शब्द लिखना, iframe परीक्षण, WEM ऑडियो परिवर्तन MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "ऑनलाइन उपकरण, मुफ्त उपकरण, खेल, FC खेल, छोटे खेल, छवि संसाधन, छवि संपीड़न, छवि परिवर्तन, छवि कटाव, PDF संसाधन, PDF से Word, PDF संयोजन, PDF संपीड़न, वीडियो संसाधन, वीडियो संपीड़न, वीडियो परिवर्तन, Base64 एनकोडिंग, URL एन्कोडिंग, संयोजन परिवर्तन, मानचित्र टाइल डाउनलोड, ऑनलाइन शब्द लिखना, iframe परीक्षण, WEM ऑडियो परिवर्तन MP3",
      },
    ],
  ],
  themeConfig: {
    nav: [
      {
        text: "फ़ॉर्मेट रूपांतरण",
        items: [
          { text: "ऑडियो रूपांतरण", link: "/hi/web/convert/audio" },
        ],
      },
      {
        text: "एन्कोडिंग / डीकोडिंग",
        items: [
          { text: "Base64 एन्कोडिंग / डीकोडिंग", link: "/hi/web/encode-decode/base64" },
          { text: "URL एन्कोडिंग / डीकोडिंग", link: "/hi/web/encode-decode/url" },
        ],
      },
      {
        text: "पाठ उपकरण",
        items: [
          { text: "बहु-पंक्ति मर्ज / विभाजन", link: "/hi/web/text-tools/multi-line-merge-split" },
          { text: "टेक्स्ट से इमेज", link: "/hi/web/text-tools/text-to-image" },
          { text: "टेक्स्ट से इमेज", link: "/hi/web/text-tools/text-to-image" },
          { text: "टेक्स्ट से इमेज", link: "/hi/web/text-tools/text-to-image" },
          { text: "पिनयिन कनवर्टर", link: "/hi/web/text-tools/pinyin-conversion" },
          { text: "सरलीकृत-पारंपरिक कनवर्टर", link: "/hi/web/text-tools/simplified-traditional-conversion" },
          { text: "केस कनवर्टर", link: "/hi/web/text-tools/case-conversion" },
          { text: "डुप्लीकेट हटाएं", link: "/hi/web/text-tools/duplicate-removal" },
          { text: "रोमन अंक परिवर्तक", link: "/hi/web/text-tools/roman-numeral-conversion" },
          { text: "चीनी वित्तीय राशि परिवर्तक", link: "/hi/web/text-tools/uppercase-amount-conversion" },
          { text: "पढ़ने का समय अनुमान", link: "/hi/web/text-tools/reading-time-estimation" },
          { text: "पूर्ण-चौड़ाई/अर्ध-चौड़ाई परिवर्तक", link: "/hi/web/text-tools/full-width-half-width-conversion" },
          { text: "कीवर्ड आँकड़े", link: "/hi/web/text-tools/keyword-statistics" },
          { text: "इमोजी संग्रह", link: "/hi/web/text-tools/emoji-all" },
          { text: "शब्द गणना", link: "/hi/web/text-tools/word-count" },
        ],
      },
      {
        text: "हार्डवेयर टेस्ट",
        items: [
          { text: "माइक्रोफोन टेस्ट", link: "/hi/web/hardware-test/microphone-test" },
          { text: "कैमरा टेस्ट", link: "/hi/web/hardware-test/camera-test" },
          { text: "साउंड टेस्ट", link: "/hi/web/hardware-test/sound-test" },
          { text: "कीबोर्ड टेस्ट", link: "/hi/web/hardware-test/keyboard-test" },
          { text: "ऑडियो प्लेबैक टेस्ट", link: "/hi/web/hardware-test/audio-playback-test" },
          { text: "गेमपैड टेस्ट", link: "/hi/web/hardware-test/gamepad-test" },
          { text: "माउस टेस्ट", link: "/hi/web/hardware-test/mouse-test" },
          { text: "टच स्क्रीन टेस्ट", link: "/hi/web/hardware-test/touch-screen-test" },
          { text: "मल्टी-टच टेस्ट", link: "/hi/web/hardware-test/multi-touch-test" },
          { text: "कंपन टेस्ट", link: "/hi/web/hardware-test/vibration-test" },
          { text: "जाइरोस्कोप टेस्ट", link: "/hi/web/hardware-test/gyroscope-test" },
          { text: "एक्सेलेरोमीटर टेस्ट", link: "/hi/web/hardware-test/accelerometer-test" },
          { text: "FPS टेस्ट", link: "/hi/web/hardware-test/fps-test" },
          { text: "डेड पिक्सेल टेस्ट", link: "/hi/web/hardware-test/screen-bad-point-test" },
          { text: "स्क्रीन रिज़ॉल्यूशन टेस्ट", link: "/hi/web/hardware-test/screen-resolution-test" },
        ],
      },
      {
        text: "डेवलपर टूल्स",
        items: [
          { text: "मैप कोऑर्डिनेट कन्वर्ज़न", link: "/hi/web/dev-tools/map-coordinate-conversion" },
        ],
      },
      {
        text: "गेम्स",
        items: [
          { text: "FC रेट्रो गेम्स", link: "/pages/game" },
          { text: "Java क्लासिक गेम्स", link: "/pages/javaGames" },
          { text: "आर्केड गेम्स", link: "/pages/arcade" },
        ],
      },
    ],
    returnToTopLabel: "शीर्ष पर वापस जाएं",
    sidebarMenuLabel: "विषय सूची",
    darkModeSwitchLabel: "मोड बदलें",
    lightModeSwitchTitle: "लाइट मोड पर स्विच करें",
    darkModeSwitchTitle: "डार्क मोड पर स्विच करें",
    notFound: {
      title: "पृष्ठ नहीं मिला",
      quote: "पृष्ठ मौजूद नहीं है, कृपया URL जांचें।",
      linkLabel: "होम पेज पर वापस जाएं",
      linkText: "होम पेज पर वापस जाएं",
    },
    search: {
      options: {
        placeholder: "दस्तावेज़ खोजें",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "AI से पूछें",
                buttonAriaLabel: "AI से पूछें",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "AI से पूछें",
                  conversationHistoryTitle: "मेरा बातचीत इतिहास",
                  newConversationText: "नई बातचीत शुरू करें",
                  viewConversationHistoryText: "बातचीत इतिहास",
                },
                promptForm: {
                  promptPlaceholderText: "प्रश्न पूछें",
                  promptAnsweringText: "उत्तर दे रहे हैं...",
                  promptAskAnotherQuestionText: "दूसरा प्रश्न पूछें",
                  promptDisclaimerText:
                    "AI द्वारा उत्पन्न उत्तर, त्रुटियां हो सकती हैं।",
                  promptLabelText:
                    "भेजने के लिए Enter, नई पंक्ति के लिए Shift+Enter।",
                  promptAriaLabelText: "प्रश्न इनपुट",
                },
                conversationScreen: {
                  preToolCallText: "खोज रहे हैं...",
                  searchingText: "खोज रहे हैं...",
                  toolCallResultText: "खोज की गई",
                  conversationDisclaimer:
                    "AI द्वारा उत्पन्न उत्तर, त्रुटियां हो सकती हैं। जांचें।",
                  reasoningText: "तर्क कर रहे हैं...",
                  thinkingText: "सोच रहे हैं...",
                  relatedSourcesText: "संबंधित स्रोत",
                  stoppedStreamingText: "आपने यह उत्तर रोक दिया",
                  copyButtonText: "कॉपी करें",
                  copyButtonCopiedText: "कॉपी हो गया!",
                  likeButtonTitle: "पसंद",
                  dislikeButtonTitle: "नापसंद",
                  thanksForFeedbackText: "आपकी प्रतिक्रिया के लिए धन्यवाद!",
                  errorTitleText: "चैट त्रुटि",
                },
                newConversationScreen: {
                  titleText: "आज मैं आपकी कैसे मदद कर सकता हूं?",
                  introductionText:
                    "मैं आपके दस्तावेज़ में खोज करूंगा और सेटअप गाइड, फ़ीचर विवरण और समस्या निवारण युक्तियां जल्दी से ढूंढूंगा।",
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
            buttonText: "खोजें",
            buttonAriaLabel: "खोजें",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "साफ़ करें",
              clearButtonAriaLabel: "खोज साफ़ करें",
              closeButtonText: "बंद करें",
              closeButtonAriaLabel: "बंद करें",
              placeholderText: "दस्तावेज़ खोजें या AI से पूछें",
              placeholderTextAskAi: "दूसरा प्रश्न दर्ज करें...",
              placeholderTextAskAiStreaming: "उत्तर दे रहे हैं...",
              searchInputLabel: "खोजें",
              backToKeywordSearchButtonText: "कीवर्ड खोज पर वापस जाएं",
              backToKeywordSearchButtonAriaLabel: "कीवर्ड खोज पर वापस जाएं",
              newConversationPlaceholder: "प्रश्न पूछें",
              conversationHistoryTitle: "मेरा बातचीत इतिहास",
              startNewConversationText: "नई बातचीत शुरू करें",
              viewConversationHistoryText: "बातचीत इतिहास",
              threadDepthErrorPlaceholder: "बातचीत सीमा पहुंच गई",
            },
            newConversation: {
              newConversationTitle: "आज मैं आपकी कैसे मदद कर सकता हूं?",
              newConversationDescription:
                "मैं आपके दस्तावेज़ में खोज करूंगा और सेटअप गाइड, फ़ीचर विवरण और समस्या निवारण युक्तियां जल्दी से ढूंढूंगा।",
            },
            footer: {
              selectText: "चुनें",
              submitQuestionText: "प्रश्न सबमिट करें",
              selectKeyAriaLabel: "Enter कुंजी",
              navigateText: "नेविगेट करें",
              navigateUpKeyAriaLabel: "ऊपर तीर",
              navigateDownKeyAriaLabel: "नीचे तीर",
              closeText: "बंद करें",
              backToSearchText: "खोज पर वापस जाएं",
              closeKeyAriaLabel: "Esc कुंजी",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "परिणाम प्राप्त नहीं हो सके",
              helpText:
                "आपको अपना नेटवर्क कनेक्शन जांचने की आवश्यकता हो सकती है।",
            },
            startScreen: {
              recentSearchesTitle: "हाल की",
              noRecentSearchesText: "कोई हालिया खोज नहीं",
              saveRecentSearchButtonTitle: "यह खोज सहेजें",
              removeRecentSearchButtonTitle: "इतिहास से यह खोज हटाएं",
              favoriteSearchesTitle: "पसंदीदा",
              removeFavoriteSearchButtonTitle: "पसंदीदा से हटाएं",
              recentConversationsTitle: "हाल की बातचीत",
              removeRecentConversationButtonTitle: "इतिहास से यह बातचीत हटाएं",
            },
            noResultsScreen: {
              noResultsText: "कोई प्रासंगिक परिणाम नहीं मिला",
              suggestedQueryText: "खोजने का प्रयास करें",
              reportMissingResultsText:
                "क्या आपको लगता है कि इस क्वेरी के लिए परिणाम होने चाहिए?",
              reportMissingResultsLinkText: "हमें बताएं।",
            },
            resultsScreen: {
              askAiPlaceholder: "AI से पूछें:",
              noResultsAskAiPlaceholder:
                "दस्तावेज़ में नहीं मिला? Ask AI आज़माएं:",
            },
            askAiScreen: {
              disclaimerText:
                "AI द्वारा उत्पन्न उत्तर, त्रुटियां हो सकती हैं। जांचें।",
              relatedSourcesText: "संबंधित स्रोत",
              thinkingText: "सोच रहे हैं...",
              copyButtonText: "कॉपी करें",
              copyButtonCopiedText: "कॉपी हो गया!",
              copyButtonTitle: "कॉपी करें",
              likeButtonTitle: "पसंद",
              dislikeButtonTitle: "नापसंद",
              thanksForFeedbackText: "आपकी प्रतिक्रिया के लिए धन्यवाद!",
              preToolCallText: "खोज रहे हैं...",
              duringToolCallText: "खोज रहे हैं...",
              afterToolCallText: "खोज की गई",
              stoppedStreamingText: "आपने यह उत्तर रोक दिया",
              errorTitleText: "चैट त्रुटि",
              threadDepthExceededMessage:
                "उत्तरों की सटीकता बनाए रखने के लिए यह बातचीत बंद कर दी गई।",
              startNewConversationButtonText: "नई बातचीत शुरू करें",
            },
          },
        },
      },
    },
    outlineTitle: "इस पृष्ठ पर",
    lastUpdatedText: "अंतिम अपडेट",
    docFooter: {
      prev: "पिछला",
      next: "अगला",
    },
    footer: {},
    editLink: {
      text: "GitHub पर इस पृष्ठ को संपादित करें",
    },
  },
})
