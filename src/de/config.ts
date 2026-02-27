import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "Online-Tools, kostenlose Tools, Spiele, FC-Spiele, Kleine Spiele, Bildbearbeitung, Bildkompression, Bildumwandlung, Bildzuschnitt, PDF-Bearbeitung, PDF zu Word, PDF-Zusammenführung, PDF-Kompression, Videobearbeitung, Videokompression, Videoumwandlung, Base64-Encoding, Koordinatentransformation, Kartentile-Download, Online-Wortschreiben, iframe-Test, WEM-Audio-Umwandlung MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "Online-Tools, kostenlose Tools, Spiele, FC-Spiele, Kleine Spiele, Bildbearbeitung, Bildkompression, Bildumwandlung, Bildzuschnitt, PDF-Bearbeitung, PDF zu Word, PDF-Zusammenführung, PDF-Kompression, Videobearbeitung, Videokompression, Videoumwandlung, Base64-Encoding, Koordinatentransformation, Kartentile-Download, Online-Wortschreiben, iframe-Test, WEM-Audio-Umwandlung MP3",
      },
    ],
  ],
  themeConfig: {
    nav: [
      {
        text: "Formatkonvertierung",
        items: [
          { text: "Audiokonvertierung", link: "/web/convert/audio" },
        ],
      },
      {
        text: "Spiele",
        items: [
          { text: "NES Retro-Spiele", link: "/pages/game" },
          { text: "Java Klassikspiele", link: "/pages/javaGames" },
        ],
      },
    ],
    returnToTopLabel: "Nach oben",
    sidebarMenuLabel: "Inhaltsverzeichnis",
    darkModeSwitchLabel: "Modus wechseln",
    lightModeSwitchTitle: "Zum hellen Modus wechseln",
    darkModeSwitchTitle: "Zum dunklen Modus wechseln",
    notFound: {
      title: "Seite nicht gefunden",
      quote: "Die Seite existiert nicht, bitte überprüfen Sie die URL.",
      linkLabel: "Zur Startseite",
      linkText: "Zur Startseite",
    },
    search: {
      options: {
        placeholder: "Dokumentation durchsuchen",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "KI fragen",
                buttonAriaLabel: "KI fragen",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "KI fragen",
                  conversationHistoryTitle: "Mein Gesprächsverlauf",
                  newConversationText: "Neues Gespräch beginnen",
                  viewConversationHistoryText: "Gesprächsverlauf",
                },
                promptForm: {
                  promptPlaceholderText: "Frage stellen",
                  promptAnsweringText: "Antworte...",
                  promptAskAnotherQuestionText: "Weitere Frage stellen",
                  promptDisclaimerText:
                    "Antwort von KI generiert, kann Fehler enthalten.",
                  promptLabelText:
                    "Enter zum Senden, Shift+Enter für Zeilenumbruch.",
                  promptAriaLabelText: "Frageingabe",
                },
                conversationScreen: {
                  preToolCallText: "Suche läuft...",
                  searchingText: "Suche läuft...",
                  toolCallResultText: "Suche abgeschlossen",
                  conversationDisclaimer:
                    "Antwort von KI generiert, kann Fehler enthalten. Bitte prüfen.",
                  reasoningText: "Wird verarbeitet...",
                  thinkingText: "Denkt nach...",
                  relatedSourcesText: "Verwandte Quellen",
                  stoppedStreamingText: "Sie haben diese Antwort gestoppt",
                  copyButtonText: "Kopieren",
                  copyButtonCopiedText: "Kopiert!",
                  likeButtonTitle: "Gefällt mir",
                  dislikeButtonTitle: "Gefällt mir nicht",
                  thanksForFeedbackText: "Danke für Ihr Feedback!",
                  errorTitleText: "Chat-Fehler",
                },
                newConversationScreen: {
                  titleText: "Wie kann ich Ihnen heute helfen?",
                  introductionText:
                    "Ich durchsuche Ihre Dokumentation und finde schnell Einrichtungsanleitungen, Funktionsdetails und Tipps zur Fehlerbehebung.",
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
            buttonText: "Suchen",
            buttonAriaLabel: "Suchen",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "Löschen",
              clearButtonAriaLabel: "Suchanfrage löschen",
              closeButtonText: "Schließen",
              closeButtonAriaLabel: "Schließen",
              placeholderText: "Dokumentation durchsuchen oder KI fragen",
              placeholderTextAskAi: "Weitere Frage eingeben...",
              placeholderTextAskAiStreaming: "Antworte...",
              searchInputLabel: "Suchen",
              backToKeywordSearchButtonText: "Zurück zur Schlüsselwortsuche",
              backToKeywordSearchButtonAriaLabel:
                "Zurück zur Schlüsselwortsuche",
              newConversationPlaceholder: "Frage stellen",
              conversationHistoryTitle: "Mein Gesprächsverlauf",
              startNewConversationText: "Neues Gespräch beginnen",
              viewConversationHistoryText: "Gesprächsverlauf",
              threadDepthErrorPlaceholder: "Gesprächslimit erreicht",
            },
            newConversation: {
              newConversationTitle: "Wie kann ich Ihnen heute helfen?",
              newConversationDescription:
                "Ich durchsuche Ihre Dokumentation und finde schnell Einrichtungsanleitungen, Funktionsdetails und Tipps zur Fehlerbehebung.",
            },
            footer: {
              selectText: "Auswählen",
              submitQuestionText: "Frage absenden",
              selectKeyAriaLabel: "Enter-Taste",
              navigateText: "Navigieren",
              navigateUpKeyAriaLabel: "Pfeil nach oben",
              navigateDownKeyAriaLabel: "Pfeil nach unten",
              closeText: "Schließen",
              backToSearchText: "Zurück zur Suche",
              closeKeyAriaLabel: "Esc-Taste",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "Ergebnisse konnten nicht abgerufen werden",
              helpText: "Überprüfen Sie Ihre Netzwerkverbindung.",
            },
            startScreen: {
              recentSearchesTitle: "Zuletzt",
              noRecentSearchesText: "Keine letzten Suchen",
              saveRecentSearchButtonTitle: "Diese Suche speichern",
              removeRecentSearchButtonTitle:
                "Diese Suche aus dem Verlauf entfernen",
              favoriteSearchesTitle: "Favoriten",
              removeFavoriteSearchButtonTitle: "Aus Favoriten entfernen",
              recentConversationsTitle: "Letzte Gespräche",
              removeRecentConversationButtonTitle:
                "Dieses Gespräch aus dem Verlauf entfernen",
            },
            noResultsScreen: {
              noResultsText: "Keine relevanten Ergebnisse gefunden",
              suggestedQueryText: "Versuchen Sie zu suchen",
              reportMissingResultsText:
                "Meinen Sie, diese Anfrage sollte Ergebnisse haben?",
              reportMissingResultsLinkText: "Teilen Sie es uns mit.",
            },
            resultsScreen: {
              askAiPlaceholder: "KI fragen:",
              noResultsAskAiPlaceholder:
                "In der Doku nicht gefunden? Fragen Sie die KI:",
            },
            askAiScreen: {
              disclaimerText:
                "Antwort von KI generiert, kann Fehler enthalten. Bitte prüfen.",
              relatedSourcesText: "Verwandte Quellen",
              thinkingText: "Denkt nach...",
              copyButtonText: "Kopieren",
              copyButtonCopiedText: "Kopiert!",
              copyButtonTitle: "Kopieren",
              likeButtonTitle: "Gefällt mir",
              dislikeButtonTitle: "Gefällt mir nicht",
              thanksForFeedbackText: "Danke für Ihr Feedback!",
              preToolCallText: "Suche läuft...",
              duringToolCallText: "Suche läuft...",
              afterToolCallText: "Suche abgeschlossen",
              stoppedStreamingText: "Sie haben diese Antwort gestoppt",
              errorTitleText: "Chat-Fehler",
              threadDepthExceededMessage:
                "Dieses Gespräch wurde geschlossen, um die Antwortgenauigkeit zu erhalten.",
              startNewConversationButtonText: "Neues Gespräch beginnen",
            },
          },
        },
      },
    },
    outlineTitle: "Auf dieser Seite",
    lastUpdatedText: "Zuletzt aktualisiert",
    docFooter: {
      prev: "Vorherige",
      next: "Nächste",
    },
    footer: {},
    editLink: {
      text: "Diese Seite auf GitHub bearbeiten",
    },
  },
})
