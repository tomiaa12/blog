import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "ऑनलाइन उपकरण, मुफ्त उपकरण, खेल, FC खेल, छोटे खेल, छवि संसाधन, छवि संपीड़न, छवि परिवर्तन, छवि कटाव, PDF संसाधन, PDF से Word, PDF संयोजन, PDF संपीड़न, वीडियो संसाधन, वीडियो संपीड़न, वीडियो परिवर्तन, Base64 एनकोडिंग, संयोजन परिवर्तन, मानचित्र टाइल डाउनलोड, ऑनलाइन शब्द लिखना, iframe परीक्षण, WEM ऑडियो परिवर्तन MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "ऑनलाइन उपकरण, मुफ्त उपकरण, खेल, FC खेल, छोटे खेल, छवि संसाधन, छवि संपीड़न, छवि परिवर्तन, छवि कटाव, PDF संसाधन, PDF से Word, PDF संयोजन, PDF संपीड़न, वीडियो संसाधन, वीडियो संपीड़न, वीडियो परिवर्तन, Base64 एनकोडिंग, संयोजन परिवर्तन, मानचित्र टाइल डाउनलोड, ऑनलाइन शब्द लिखना, iframe परीक्षण, WEM ऑडियो परिवर्तन MP3",
      },
    ],
  ],
  themeConfig: {
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
