import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "Verktyg online, gratis verktyg, spel, spel FC, små spel, bildbehandling, bildkompression, bildkonvertering, bildklipp, PDF-behandling, PDF till Word, PDF sammanföring, PDF kompression, video-behandling, video-kompression, video-konvertering, Base64-kodning, koordinattransformation, karttäcke-hämtning, online-ordskrivning, iframe-test, WEM-audio-konvertering MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "Verktyg online, gratis verktyg, spel, spel FC, små spel, bildbehandling, bildkompression, bildkonvertering, bildklipp, PDF-behandling, PDF till Word, PDF sammanföring, PDF kompression, video-behandling, video-kompression, video-konvertering, Base64-kodning, koordinattransformation, karttäcke-hämtning, online-ordskrivning, iframe-test, WEM-audio-konvertering MP3",
      },
    ],
  ],
  themeConfig: {
    nav: [
      {
        text: "Formatkonvertering",
        items: [
          { text: "Ljudkonvertering", link: "/web/convert/audio" },
        ],
      },
      {
        text: "Spel",
        items: [
          { text: "FC retro-spel", link: "/pages/game" },
          { text: "Java klassiska spel", link: "/pages/javaGames" },
        ],
      },
    ],
    returnToTopLabel: "Tillbaka till toppen",
    sidebarMenuLabel: "Innehållsförteckning",
    darkModeSwitchLabel: "Byt läge",
    lightModeSwitchTitle: "Byt till ljust läge",
    darkModeSwitchTitle: "Byt till mörkt läge",
    notFound: {
      title: "Sidan hittades inte",
      quote: "Sidan finns inte, kontrollera URL:en.",
      linkLabel: "Tillbaka till startsidan",
      linkText: "Tillbaka till startsidan",
    },
    search: {
      options: {
        placeholder: "Sök i dokumentationen",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "Fråga AI",
                buttonAriaLabel: "Fråga AI",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "Fråga AI",
                  conversationHistoryTitle: "Min konversationshistorik",
                  newConversationText: "Starta ny konversation",
                  viewConversationHistoryText: "Konversationshistorik",
                },
                promptForm: {
                  promptPlaceholderText: "Ställ en fråga",
                  promptAnsweringText: "Svarar...",
                  promptAskAnotherQuestionText: "Ställ en annan fråga",
                  promptDisclaimerText:
                    "Svar genererat av AI, kan innehålla fel.",
                  promptLabelText:
                    "Enter för att skicka, Shift+Enter för ny rad.",
                  promptAriaLabelText: "Frågeinmatning",
                },
                conversationScreen: {
                  preToolCallText: "Söker...",
                  searchingText: "Söker...",
                  toolCallResultText: "Sökning klar",
                  conversationDisclaimer:
                    "Svar genererat av AI, kan innehålla fel. Kontrollera.",
                  reasoningText: "Resonerar...",
                  thinkingText: "Tänker...",
                  relatedSourcesText: "Relaterade källor",
                  stoppedStreamingText: "Du stoppade det här svaret",
                  copyButtonText: "Kopiera",
                  copyButtonCopiedText: "Kopierat!",
                  likeButtonTitle: "Gilla",
                  dislikeButtonTitle: "Ogilla",
                  thanksForFeedbackText: "Tack för din feedback!",
                  errorTitleText: "Chattfel",
                },
                newConversationScreen: {
                  titleText: "Hur kan jag hjälpa dig idag?",
                  introductionText:
                    "Jag söker i din dokumentation för att snabbt hitta installationsguider, funktionsdetaljer och felsökningstips.",
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
            buttonText: "Sök",
            buttonAriaLabel: "Sök",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "Rensa",
              clearButtonAriaLabel: "Rensa sökning",
              closeButtonText: "Stäng",
              closeButtonAriaLabel: "Stäng",
              placeholderText: "Sök i dokumentationen eller fråga AI",
              placeholderTextAskAi: "Ange en annan fråga...",
              placeholderTextAskAiStreaming: "Svarar...",
              searchInputLabel: "Sök",
              backToKeywordSearchButtonText: "Tillbaka till nyckelordssökning",
              backToKeywordSearchButtonAriaLabel:
                "Tillbaka till nyckelordssökning",
              newConversationPlaceholder: "Ställ en fråga",
              conversationHistoryTitle: "Min konversationshistorik",
              startNewConversationText: "Starta ny konversation",
              viewConversationHistoryText: "Konversationshistorik",
              threadDepthErrorPlaceholder: "Konversationsgränsen nådd",
            },
            newConversation: {
              newConversationTitle: "Hur kan jag hjälpa dig idag?",
              newConversationDescription:
                "Jag söker i din dokumentation för att snabbt hitta installationsguider, funktionsdetaljer och felsökningstips.",
            },
            footer: {
              selectText: "Välj",
              submitQuestionText: "Skicka fråga",
              selectKeyAriaLabel: "Enter-tangent",
              navigateText: "Navigera",
              navigateUpKeyAriaLabel: "Pil upp",
              navigateDownKeyAriaLabel: "Pil ned",
              closeText: "Stäng",
              backToSearchText: "Tillbaka till sökning",
              closeKeyAriaLabel: "Esc-tangent",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "Det gick inte att hämta resultat",
              helpText: "Du kan behöva kontrollera din nätverksanslutning.",
            },
            startScreen: {
              recentSearchesTitle: "Senaste",
              noRecentSearchesText: "Inga senaste sökningar",
              saveRecentSearchButtonTitle: "Spara den här sökningen",
              removeRecentSearchButtonTitle:
                "Ta bort den här sökningen från historiken",
              favoriteSearchesTitle: "Favoriter",
              removeFavoriteSearchButtonTitle: "Ta bort från favoriter",
              recentConversationsTitle: "Senaste konversationer",
              removeRecentConversationButtonTitle:
                "Ta bort den här konversationen från historiken",
            },
            noResultsScreen: {
              noResultsText: "Inga relevanta resultat hittades",
              suggestedQueryText: "Försök söka",
              reportMissingResultsText:
                "Tror du att den här frågan borde ha resultat?",
              reportMissingResultsLinkText: "Berätta för oss.",
            },
            resultsScreen: {
              askAiPlaceholder: "Fråga AI:",
              noResultsAskAiPlaceholder:
                "Hittades inte i dokumentationen? Prova Ask AI:",
            },
            askAiScreen: {
              disclaimerText:
                "Svar genererat av AI, kan innehålla fel. Kontrollera.",
              relatedSourcesText: "Relaterade källor",
              thinkingText: "Tänker...",
              copyButtonText: "Kopiera",
              copyButtonCopiedText: "Kopierat!",
              copyButtonTitle: "Kopiera",
              likeButtonTitle: "Gilla",
              dislikeButtonTitle: "Ogilla",
              thanksForFeedbackText: "Tack för din feedback!",
              preToolCallText: "Söker...",
              duringToolCallText: "Söker...",
              afterToolCallText: "Sökning klar",
              stoppedStreamingText: "Du stoppade det här svaret",
              errorTitleText: "Chattfel",
              threadDepthExceededMessage:
                "Den här konversationen stängdes för att bibehålla svarens noggrannhet.",
              startNewConversationButtonText: "Starta ny konversation",
            },
          },
        },
      },
    },
    outlineTitle: "På den här sidan",
    lastUpdatedText: "Senast uppdaterad",
    docFooter: {
      prev: "Föregående",
      next: "Nästa",
    },
    footer: {},
    editLink: {
      text: "Redigera den här sidan på GitHub",
    },
  },
})
