import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "Çevrimiçi araçlar, ücretsiz araçlar, oyunlar, FC oyunları, küçük oyunlar, görüntü işleme, görüntü sıkıştırma, görüntü dönüştürme, görüntü kırpma, PDF işleme, PDF to Word, PDF birleştirme, PDF sıkıştırma, video işleme, video sıkıştırma, video dönüştürme, Base64 kodlama, koordinat dönüştürme, harita parça indirme, çevrimiçi kelime yazma, iframe testi, WEM audio dönüştürme MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "Çevrimiçi araçlar, ücretsiz araçlar, oyunlar, FC oyunları, küçük oyunlar, görüntü işleme, görüntü sıkıştırma, görüntü dönüştürme, görüntü kırpma, PDF işleme, PDF to Word, PDF birleştirme, PDF sıkıştırma, video işleme, video sıkıştırma, video dönüştürme, Base64 kodlama, koordinat dönüştürme, harita parça indirme, çevrimiçi kelime yazma, iframe testi, WEM audio dönüştürme MP3",
      },
    ],
  ],
  themeConfig: {
    returnToTopLabel: "Başa dön",
    sidebarMenuLabel: "İçindekiler",
    darkModeSwitchLabel: "Modu değiştir",
    lightModeSwitchTitle: "Açık moda geç",
    darkModeSwitchTitle: "Karanlık moda geç",
    notFound: {
      title: "Sayfa bulunamadı",
      quote: "Sayfa mevcut değil, lütfen URL'yi kontrol edin.",
      linkLabel: "Ana sayfaya dön",
      linkText: "Ana sayfaya dön",
    },
    search: {
      options: {
        placeholder: "Belgelerde ara",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "AI'ya sor",
                buttonAriaLabel: "AI'ya sor",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "AI'ya sor",
                  conversationHistoryTitle: "Konuşma geçmişim",
                  newConversationText: "Yeni konuşma başlat",
                  viewConversationHistoryText: "Geçmiş",
                },
                promptForm: {
                  promptPlaceholderText: "Soru sor",
                  promptAnsweringText: "Yanıtlanıyor...",
                  promptAskAnotherQuestionText: "Başka soru sor",
                  promptDisclaimerText:
                    "Yapay zeka tarafından üretilen yanıt, hata içerebilir.",
                  promptLabelText:
                    "Göndermek için Enter, yeni satır için Shift+Enter.",
                  promptAriaLabelText: "Soru girişi",
                },
                conversationScreen: {
                  preToolCallText: "Aranıyor...",
                  searchingText: "Aranıyor...",
                  toolCallResultText: "Arama tamamlandı",
                  conversationDisclaimer:
                    "Yapay zeka tarafından üretilen yanıt, hata içerebilir. Doğrulayın.",
                  reasoningText: "Düşünülüyor...",
                  thinkingText: "Düşünülüyor...",
                  relatedSourcesText: "İlgili kaynaklar",
                  stoppedStreamingText: "Bu yanıtı durdurdunuz",
                  copyButtonText: "Kopyala",
                  copyButtonCopiedText: "Kopyalandı!",
                  likeButtonTitle: "Beğen",
                  dislikeButtonTitle: "Beğenme",
                  thanksForFeedbackText: "Geri bildiriminiz için teşekkürler!",
                  errorTitleText: "Sohbet hatası",
                },
                newConversationScreen: {
                  titleText: "Bugün size nasıl yardımcı olabilirim?",
                  introductionText:
                    "Kurulum kılavuzlarını, özellik ayrıntılarını ve sorun giderme ipuçlarını hızla bulmak için belgelerinizi arayacağım.",
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
            buttonText: "Ara",
            buttonAriaLabel: "Ara",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "Temizle",
              clearButtonAriaLabel: "Aramayı temizle",
              closeButtonText: "Kapat",
              closeButtonAriaLabel: "Kapat",
              placeholderText: "Belgelerde ara veya AI'ya sor",
              placeholderTextAskAi: "Başka soru girin...",
              placeholderTextAskAiStreaming: "Yanıtlanıyor...",
              searchInputLabel: "Ara",
              backToKeywordSearchButtonText: "Anahtar kelime aramasına dön",
              backToKeywordSearchButtonAriaLabel:
                "Anahtar kelime aramasına dön",
              newConversationPlaceholder: "Soru sor",
              conversationHistoryTitle: "Konuşma geçmişim",
              startNewConversationText: "Yeni konuşma başlat",
              viewConversationHistoryText: "Geçmiş",
              threadDepthErrorPlaceholder: "Konuşma sınırına ulaşıldı",
            },
            newConversation: {
              newConversationTitle: "Bugün size nasıl yardımcı olabilirim?",
              newConversationDescription:
                "Kurulum kılavuzlarını, özellik ayrıntılarını ve sorun giderme ipuçlarını hızla bulmak için belgelerinizi arayacağım.",
            },
            footer: {
              selectText: "Seç",
              submitQuestionText: "Soru gönder",
              selectKeyAriaLabel: "Enter tuşu",
              navigateText: "Gezin",
              navigateUpKeyAriaLabel: "Yukarı ok",
              navigateDownKeyAriaLabel: "Aşağı ok",
              closeText: "Kapat",
              backToSearchText: "Aramaya dön",
              closeKeyAriaLabel: "Esc tuşu",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "Sonuçlar alınamadı",
              helpText: "Ağ bağlantınızı kontrol etmeniz gerekebilir.",
            },
            startScreen: {
              recentSearchesTitle: "Son",
              noRecentSearchesText: "Son arama yok",
              saveRecentSearchButtonTitle: "Bu aramayı kaydet",
              removeRecentSearchButtonTitle: "Bu aramayı geçmişten kaldır",
              favoriteSearchesTitle: "Favoriler",
              removeFavoriteSearchButtonTitle: "Favorilerden kaldır",
              recentConversationsTitle: "Son konuşmalar",
              removeRecentConversationButtonTitle:
                "Bu konuşmayı geçmişten kaldır",
            },
            noResultsScreen: {
              noResultsText: "İlgili sonuç bulunamadı",
              suggestedQueryText: "Aramayı deneyin",
              reportMissingResultsText:
                "Bu sorgunun sonuçları olması gerektiğini düşünüyor musunuz?",
              reportMissingResultsLinkText: "Bize bildirin.",
            },
            resultsScreen: {
              askAiPlaceholder: "AI'ya sor:",
              noResultsAskAiPlaceholder:
                "Belgede bulamadınız mı? Ask AI'yı deneyin:",
            },
            askAiScreen: {
              disclaimerText:
                "Yapay zeka tarafından üretilen yanıt, hata içerebilir. Doğrulayın.",
              relatedSourcesText: "İlgili kaynaklar",
              thinkingText: "Düşünülüyor...",
              copyButtonText: "Kopyala",
              copyButtonCopiedText: "Kopyalandı!",
              copyButtonTitle: "Kopyala",
              likeButtonTitle: "Beğen",
              dislikeButtonTitle: "Beğenme",
              thanksForFeedbackText: "Geri bildiriminiz için teşekkürler!",
              preToolCallText: "Aranıyor...",
              duringToolCallText: "Aranıyor...",
              afterToolCallText: "Arama tamamlandı",
              stoppedStreamingText: "Bu yanıtı durdurdunuz",
              errorTitleText: "Sohbet hatası",
              threadDepthExceededMessage:
                "Yanıt doğruluğunu korumak için bu konuşma kapatıldı.",
              startNewConversationButtonText: "Yeni konuşma başlat",
            },
          },
        },
      },
    },
    outlineTitle: "Bu sayfada",
    lastUpdatedText: "Son güncelleme",
    docFooter: {
      prev: "Önceki",
      next: "Sonraki",
    },
    footer: {},
    editLink: {
      text: "Bu sayfayı GitHub'da düzenle",
    },
  },
})
