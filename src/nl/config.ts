import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "Online-tools, gratis tools, spellen, spellen FC, kleine spellen, beeldverwerking, beeldcompressie, beeldconversie, beeldknip, PDF-verwerking, PDF naar Word, PDF fusie, PDF compressie, video-verwerking, video-compressie, video-conversie, Base64-codering, coordinatentransformatie, kaarttegeltje-download, online-woordschrijven, iframe-test, WEM-audio-conversie MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "Online-tools, gratis tools, spellen, spellen FC, kleine spellen, beeldverwerking, beeldcompressie, beeldconversie, beeldknip, PDF-verwerking, PDF naar Word, PDF fusie, PDF compressie, video-verwerking, video-compressie, video-conversie, Base64-codering, coordinatentransformatie, kaarttegeltje-download, online-woordschrijven, iframe-test, WEM-audio-conversie MP3",
      },
    ],
  ],
  themeConfig: {
    returnToTopLabel: "Terug naar boven",
    sidebarMenuLabel: "Inhoudsopgave",
    darkModeSwitchLabel: "Modus wisselen",
    lightModeSwitchTitle: "Naar lichte modus wisselen",
    darkModeSwitchTitle: "Naar donkere modus wisselen",
    notFound: {
      title: "Pagina niet gevonden",
      quote: "De pagina bestaat niet, controleer de URL.",
      linkLabel: "Terug naar de startpagina",
      linkText: "Terug naar de startpagina",
    },
    search: {
      options: {
        placeholder: "Documentatie doorzoeken",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "AI vragen",
                buttonAriaLabel: "AI vragen",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "AI vragen",
                  conversationHistoryTitle: "Mijn gespreksgeschiedenis",
                  newConversationText: "Nieuw gesprek starten",
                  viewConversationHistoryText: "Geschiedenis",
                },
                promptForm: {
                  promptPlaceholderText: "Stel een vraag",
                  promptAnsweringText: "Beantwoorden...",
                  promptAskAnotherQuestionText: "Nog een vraag stellen",
                  promptDisclaimerText:
                    "Antwoord gegenereerd door AI, kan fouten bevatten.",
                  promptLabelText:
                    "Enter om te verzenden, Shift+Enter voor nieuwe regel.",
                  promptAriaLabelText: "Vraaginvoer",
                },
                conversationScreen: {
                  preToolCallText: "Zoeken...",
                  searchingText: "Zoeken...",
                  toolCallResultText: "Zoekopdracht voltooid",
                  conversationDisclaimer:
                    "Antwoord gegenereerd door AI, kan fouten bevatten. Controleer.",
                  reasoningText: "Redeneren...",
                  thinkingText: "Nadenken...",
                  relatedSourcesText: "Gerelateerde bronnen",
                  stoppedStreamingText: "U heeft dit antwoord gestopt",
                  copyButtonText: "Kopiëren",
                  copyButtonCopiedText: "Gekopieerd!",
                  likeButtonTitle: "Vind ik leuk",
                  dislikeButtonTitle: "Vind ik niet leuk",
                  thanksForFeedbackText: "Bedankt voor uw feedback!",
                  errorTitleText: "Chatfout",
                },
                newConversationScreen: {
                  titleText: "Hoe kan ik u vandaag helpen?",
                  introductionText:
                    "Ik doorzoek uw documentatie om snel installatiegidsen, functiedetails en probleemoplossingstips te vinden.",
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
            buttonText: "Zoeken",
            buttonAriaLabel: "Zoeken",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "Wissen",
              clearButtonAriaLabel: "Zoekopdracht wissen",
              closeButtonText: "Sluiten",
              closeButtonAriaLabel: "Sluiten",
              placeholderText: "Documentatie doorzoeken of AI vragen",
              placeholderTextAskAi: "Nog een vraag invoeren...",
              placeholderTextAskAiStreaming: "Beantwoorden...",
              searchInputLabel: "Zoeken",
              backToKeywordSearchButtonText: "Terug naar zoeken op trefwoord",
              backToKeywordSearchButtonAriaLabel:
                "Terug naar zoeken op trefwoord",
              newConversationPlaceholder: "Stel een vraag",
              conversationHistoryTitle: "Mijn gespreksgeschiedenis",
              startNewConversationText: "Nieuw gesprek starten",
              viewConversationHistoryText: "Geschiedenis",
              threadDepthErrorPlaceholder: "Gesprekslimiet bereikt",
            },
            newConversation: {
              newConversationTitle: "Hoe kan ik u vandaag helpen?",
              newConversationDescription:
                "Ik doorzoek uw documentatie om snel installatiegidsen, functiedetails en probleemoplossingstips te vinden.",
            },
            footer: {
              selectText: "Selecteren",
              submitQuestionText: "Vraag indienen",
              selectKeyAriaLabel: "Enter-toets",
              navigateText: "Navigeren",
              navigateUpKeyAriaLabel: "Pijl omhoog",
              navigateDownKeyAriaLabel: "Pijl omlaag",
              closeText: "Sluiten",
              backToSearchText: "Terug naar zoeken",
              closeKeyAriaLabel: "Esc-toets",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "Kan geen resultaten ophalen",
              helpText: "U moet mogelijk uw netwerkverbinding controleren.",
            },
            startScreen: {
              recentSearchesTitle: "Recent",
              noRecentSearchesText: "Geen recente zoekopdrachten",
              saveRecentSearchButtonTitle: "Deze zoekopdracht opslaan",
              removeRecentSearchButtonTitle:
                "Deze zoekopdracht uit de geschiedenis verwijderen",
              favoriteSearchesTitle: "Favorieten",
              removeFavoriteSearchButtonTitle: "Uit favorieten verwijderen",
              recentConversationsTitle: "Recente gesprekken",
              removeRecentConversationButtonTitle:
                "Dit gesprek uit de geschiedenis verwijderen",
            },
            noResultsScreen: {
              noResultsText: "Geen relevante resultaten gevonden",
              suggestedQueryText: "Probeer te zoeken",
              reportMissingResultsText:
                "Denkt u dat deze zoekopdracht resultaten zou moeten hebben?",
              reportMissingResultsLinkText: "Laat het ons weten.",
            },
            resultsScreen: {
              askAiPlaceholder: "AI vragen:",
              noResultsAskAiPlaceholder:
                "Niet gevonden in de doc? Probeer Ask AI:",
            },
            askAiScreen: {
              disclaimerText:
                "Antwoord gegenereerd door AI, kan fouten bevatten. Controleer.",
              relatedSourcesText: "Gerelateerde bronnen",
              thinkingText: "Nadenken...",
              copyButtonText: "Kopiëren",
              copyButtonCopiedText: "Gekopieerd!",
              copyButtonTitle: "Kopiëren",
              likeButtonTitle: "Vind ik leuk",
              dislikeButtonTitle: "Vind ik niet leuk",
              thanksForFeedbackText: "Bedankt voor uw feedback!",
              preToolCallText: "Zoeken...",
              duringToolCallText: "Zoeken...",
              afterToolCallText: "Zoekopdracht voltooid",
              stoppedStreamingText: "U heeft dit antwoord gestopt",
              errorTitleText: "Chatfout",
              threadDepthExceededMessage:
                "Dit gesprek is gesloten om de nauwkeurigheid van antwoorden te behouden.",
              startNewConversationButtonText: "Nieuw gesprek starten",
            },
          },
        },
      },
    },
    outlineTitle: "Op deze pagina",
    lastUpdatedText: "Laatste update",
    docFooter: {
      prev: "Vorige",
      next: "Volgende",
    },
    footer: {},
    editLink: {
      text: "Deze pagina bewerken op GitHub",
    },
  },
})
