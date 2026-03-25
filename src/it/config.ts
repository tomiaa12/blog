import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "Strumenti online, strumenti gratuiti, giochi, giochi FC, giochi piccoli, elaborazione immagini, compressione immagini, conversione immagini, taglio immagini, elaborazione PDF, PDF a Word, PDF di fusione, PDF di compressione, elaborazione video, compressione video, conversione video, Base64 di codifica, codifica URL, conversione coordinate, download di tessere di mappa, scrittura online di parole, test iframe, conversione audio WEM in MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "Strumenti online, strumenti gratuiti, giochi, giochi FC, giochi piccoli, elaborazione immagini, compressione immagini, conversione immagini, taglio immagini, elaborazione PDF, PDF a Word, PDF di fusione, PDF di compressione, elaborazione video, compressione video, conversione video, Base64 di codifica, codifica URL, conversione coordinate, download di tessere di mappa, scrittura online di parole, test iframe, conversione audio WEM in MP3",
      },
    ],
  ],
  themeConfig: {
    nav: [
      {
        text: "Conversione formato",
        items: [
          { text: "Conversione audio", link: "/it/web/convert/audio" },
        ],
      },
      {
        text: "Codifica / Decodifica",
        items: [
          { text: "Base64 Codifica / Decodifica", link: "/it/web/encode-decode/base64" },
          { text: "URL Codifica / Decodifica", link: "/it/web/encode-decode/url" },
        ],
      },
      {
        text: "Strumenti testo",
        items: [
          { text: "Unire / dividere più righe", link: "/it/web/text-tools/multi-line-merge-split" },
          { text: "Testo in immagine", link: "/it/web/text-tools/text-to-image" },
          { text: "Testo in immagine", link: "/it/web/text-tools/text-to-image" },
          { text: "Testo in immagine", link: "/it/web/text-tools/text-to-image" },
          { text: "Convertitore Pinyin", link: "/it/web/text-tools/pinyin-conversion" },
          { text: "Convertitore semplificato-tradizionale", link: "/it/web/text-tools/simplified-traditional-conversion" },
          { text: "Convertitore maiuscole/minuscole", link: "/it/web/text-tools/case-conversion" },
          { text: "Rimuovi duplicati", link: "/it/web/text-tools/duplicate-removal" },
          { text: "Convertitore di numeri romani", link: "/it/web/text-tools/roman-numeral-conversion" },
          { text: "Convertitore importo in cinese", link: "/it/web/text-tools/uppercase-amount-conversion" },
          { text: "Stimatore di tempo di lettura", link: "/it/web/text-tools/reading-time-estimation" },
          { text: "Convertitore larghezza piena/media", link: "/it/web/text-tools/full-width-half-width-conversion" },
          { text: "Statistiche parole chiave", link: "/it/web/text-tools/keyword-statistics" },
          { text: "Raccolta emoji", link: "/it/web/text-tools/emoji-all" },
          { text: "Contatore di parole", link: "/it/web/text-tools/word-count" },
        ],
      },
      {
        text: "Strumenti per sviluppatori",
        items: [
          { text: "Conversione coordinate mappa", link: "/it/web/dev-tools/map-coordinate-conversion" },
        ],
      },
      {
        text: "Giochi",
        items: [
          { text: "Giochi retro FC", link: "/pages/game" },
          { text: "Giochi classici Java", link: "/pages/javaGames" },
        ],
      },
    ],
    returnToTopLabel: "Torna in cima",
    sidebarMenuLabel: "Indice",
    darkModeSwitchLabel: "Cambia modalità",
    lightModeSwitchTitle: "Passa alla modalità chiara",
    darkModeSwitchTitle: "Passa alla modalità scura",
    notFound: {
      title: "Pagina non trovata",
      quote: "La pagina non esiste, controlla l'URL.",
      linkLabel: "Torna alla home",
      linkText: "Torna alla home",
    },
    search: {
      options: {
        placeholder: "Cerca nella documentazione",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "Chiedi all'IA",
                buttonAriaLabel: "Chiedi all'IA",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "Chiedi all'IA",
                  conversationHistoryTitle: "La mia cronologia conversazioni",
                  newConversationText: "Inizia nuova conversazione",
                  viewConversationHistoryText: "Cronologia",
                },
                promptForm: {
                  promptPlaceholderText: "Poni una domanda",
                  promptAnsweringText: "Sto rispondendo...",
                  promptAskAnotherQuestionText: "Poni un'altra domanda",
                  promptDisclaimerText:
                    "Risposta generata dall'IA, potrebbe contenere errori.",
                  promptLabelText:
                    "Invio per inviare, Shift+Invio per nuova riga.",
                  promptAriaLabelText: "Inserimento domanda",
                },
                conversationScreen: {
                  preToolCallText: "Ricerca in corso...",
                  searchingText: "Ricerca in corso...",
                  toolCallResultText: "Ricerca completata",
                  conversationDisclaimer:
                    "Risposta generata dall'IA, potrebbe contenere errori. Verificare.",
                  reasoningText: "Ragionamento in corso...",
                  thinkingText: "Sto pensando...",
                  relatedSourcesText: "Fonti correlate",
                  stoppedStreamingText: "Hai interrotto questa risposta",
                  copyButtonText: "Copia",
                  copyButtonCopiedText: "Copiato!",
                  likeButtonTitle: "Mi piace",
                  dislikeButtonTitle: "Non mi piace",
                  thanksForFeedbackText: "Grazie per il tuo feedback!",
                  errorTitleText: "Errore chat",
                },
                newConversationScreen: {
                  titleText: "Come posso aiutarti oggi?",
                  introductionText:
                    "Cercherò nella tua documentazione per trovare rapidamente guide di configurazione, dettagli sulle funzionalità e suggerimenti per la risoluzione dei problemi.",
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
            buttonText: "Cerca",
            buttonAriaLabel: "Cerca",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "Cancella",
              clearButtonAriaLabel: "Cancella ricerca",
              closeButtonText: "Chiudi",
              closeButtonAriaLabel: "Chiudi",
              placeholderText: "Cerca nella doc o chiedi all'IA",
              placeholderTextAskAi: "Poni un'altra domanda...",
              placeholderTextAskAiStreaming: "Sto rispondendo...",
              searchInputLabel: "Cerca",
              backToKeywordSearchButtonText:
                "Torna alla ricerca per parola chiave",
              backToKeywordSearchButtonAriaLabel:
                "Torna alla ricerca per parola chiave",
              newConversationPlaceholder: "Poni una domanda",
              conversationHistoryTitle: "La mia cronologia conversazioni",
              startNewConversationText: "Inizia nuova conversazione",
              viewConversationHistoryText: "Cronologia",
              threadDepthErrorPlaceholder: "Limite conversazione raggiunto",
            },
            newConversation: {
              newConversationTitle: "Come posso aiutarti oggi?",
              newConversationDescription:
                "Cercherò nella tua documentazione per trovare rapidamente guide di configurazione, dettagli sulle funzionalità e suggerimenti per la risoluzione dei problemi.",
            },
            footer: {
              selectText: "Seleziona",
              submitQuestionText: "Invia domanda",
              selectKeyAriaLabel: "Tasto Invio",
              navigateText: "Naviga",
              navigateUpKeyAriaLabel: "Freccia su",
              navigateDownKeyAriaLabel: "Freccia giù",
              closeText: "Chiudi",
              backToSearchText: "Torna alla ricerca",
              closeKeyAriaLabel: "Tasto Esc",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "Impossibile recuperare i risultati",
              helpText:
                "Potrebbe essere necessario controllare la connessione di rete.",
            },
            startScreen: {
              recentSearchesTitle: "Recenti",
              noRecentSearchesText: "Nessuna ricerca recente",
              saveRecentSearchButtonTitle: "Salva questa ricerca",
              removeRecentSearchButtonTitle:
                "Rimuovi questa ricerca dalla cronologia",
              favoriteSearchesTitle: "Preferiti",
              removeFavoriteSearchButtonTitle: "Rimuovi dai preferiti",
              recentConversationsTitle: "Conversazioni recenti",
              removeRecentConversationButtonTitle:
                "Rimuovi questa conversazione dalla cronologia",
            },
            noResultsScreen: {
              noResultsText: "Nessun risultato rilevante trovato",
              suggestedQueryText: "Prova a cercare",
              reportMissingResultsText:
                "Pensi che questa ricerca dovrebbe avere risultati?",
              reportMissingResultsLinkText: "Faccelo sapere.",
            },
            resultsScreen: {
              askAiPlaceholder: "Chiedi all'IA:",
              noResultsAskAiPlaceholder: "Non trovato nella doc? Prova Ask AI:",
            },
            askAiScreen: {
              disclaimerText:
                "Risposta generata dall'IA, potrebbe contenere errori. Verificare.",
              relatedSourcesText: "Fonti correlate",
              thinkingText: "Sto pensando...",
              copyButtonText: "Copia",
              copyButtonCopiedText: "Copiato!",
              copyButtonTitle: "Copia",
              likeButtonTitle: "Mi piace",
              dislikeButtonTitle: "Non mi piace",
              thanksForFeedbackText: "Grazie per il tuo feedback!",
              preToolCallText: "Ricerca in corso...",
              duringToolCallText: "Ricerca in corso...",
              afterToolCallText: "Ricerca completata",
              stoppedStreamingText: "Hai interrotto questa risposta",
              errorTitleText: "Errore chat",
              threadDepthExceededMessage:
                "Questa conversazione è stata chiusa per mantenere la precisione delle risposte.",
              startNewConversationButtonText: "Inizia nuova conversazione",
            },
          },
        },
      },
    },
    outlineTitle: "In questa pagina",
    lastUpdatedText: "Ultimo aggiornamento",
    docFooter: {
      prev: "Precedente",
      next: "Successivo",
    },
    footer: {},
    editLink: {
      text: "Modifica questa pagina su GitHub",
    },
  },
})
