import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "Narzędzia online, narzędzia darmowe, gry, gry FC, gry małe, przetwarzanie obrazu, kompresja obrazu, konwersja obrazu, przycinanie obrazu, przetwarzanie PDF, PDF do Word, PDF łączenie, PDF kompresja, przetwarzanie wideo, kompresja wideo, konwersja wideo, Base64 kodowanie, konwersja współrzędnych, pobieranie kafelków mapy, pisanie słów online, test iframe, konwersja audio WEM do MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "Narzędzia online, narzędzia darmowe, gry, gry FC, gry małe, przetwarzanie obrazu, kompresja obrazu, konwersja obrazu, przycinanie obrazu, przetwarzanie PDF, PDF do Word, PDF łączenie, PDF kompresja, przetwarzanie wideo, kompresja wideo, konwersja wideo, Base64 kodowanie, konwersja współrzędnych, pobieranie kafelków mapy, pisanie słów online, test iframe, konwersja audio WEM do MP3",
      },
    ],
  ],
  themeConfig: {
    returnToTopLabel: "Powrót na górę",
    sidebarMenuLabel: "Spis treści",
    darkModeSwitchLabel: "Zmień tryb",
    lightModeSwitchTitle: "Przełącz na tryb jasny",
    darkModeSwitchTitle: "Przełącz na tryb ciemny",
    notFound: {
      title: "Strona nie istnieje",
      quote: "Strona nie istnieje, sprawdź URL.",
      linkLabel: "Wróć do strony głównej",
      linkText: "Wróć do strony głównej",
    },
    search: {
      options: {
        placeholder: "Wyszukaj w dokumentacji",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "Zapytaj AI",
                buttonAriaLabel: "Zapytaj AI",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "Zapytaj AI",
                  conversationHistoryTitle: "Moja historia rozmów",
                  newConversationText: "Rozpocznij nową rozmowę",
                  viewConversationHistoryText: "Historia rozmów",
                },
                promptForm: {
                  promptPlaceholderText: "Zadaj pytanie",
                  promptAnsweringText: "Odpowiadanie...",
                  promptAskAnotherQuestionText: "Zadaj kolejne pytanie",
                  promptDisclaimerText:
                    "Odpowiedź wygenerowana przez AI, może zawierać błędy.",
                  promptLabelText:
                    "Enter aby wysłać, Shift+Enter aby przejść do nowej linii.",
                  promptAriaLabelText: "Pole pytania",
                },
                conversationScreen: {
                  preToolCallText: "Wyszukiwanie...",
                  searchingText: "Wyszukiwanie...",
                  toolCallResultText: "Wyszukiwanie zakończone",
                  conversationDisclaimer:
                    "Odpowiedź wygenerowana przez AI, może zawierać błędy. Sprawdź.",
                  reasoningText: "Przetwarzanie...",
                  thinkingText: "Myślenie...",
                  relatedSourcesText: "Powiązane źródła",
                  stoppedStreamingText: "Zatrzymałeś tę odpowiedź",
                  copyButtonText: "Kopiuj",
                  copyButtonCopiedText: "Skopiowano!",
                  likeButtonTitle: "Lubię to",
                  dislikeButtonTitle: "Nie lubię",
                  thanksForFeedbackText: "Dziękujemy za opinię!",
                  errorTitleText: "Błąd czatu",
                },
                newConversationScreen: {
                  titleText: "Jak mogę Ci dzisiaj pomóc?",
                  introductionText:
                    "Przeszukam dokumentację, aby szybko znaleźć przewodniki konfiguracji, szczegóły funkcji i wskazówki dotyczące rozwiązywania problemów.",
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
            buttonText: "Szukaj",
            buttonAriaLabel: "Szukaj",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "Wyczyść",
              clearButtonAriaLabel: "Wyczyść wyszukiwanie",
              closeButtonText: "Zamknij",
              closeButtonAriaLabel: "Zamknij",
              placeholderText: "Wyszukaj w dokumentacji lub zapytaj AI",
              placeholderTextAskAi: "Wprowadź kolejne pytanie...",
              placeholderTextAskAiStreaming: "Odpowiadanie...",
              searchInputLabel: "Szukaj",
              backToKeywordSearchButtonText:
                "Wróć do wyszukiwania słów kluczowych",
              backToKeywordSearchButtonAriaLabel:
                "Wróć do wyszukiwania słów kluczowych",
              newConversationPlaceholder: "Zadaj pytanie",
              conversationHistoryTitle: "Moja historia rozmów",
              startNewConversationText: "Rozpocznij nową rozmowę",
              viewConversationHistoryText: "Historia rozmów",
              threadDepthErrorPlaceholder: "Osiągnięto limit rozmowy",
            },
            newConversation: {
              newConversationTitle: "Jak mogę Ci dzisiaj pomóc?",
              newConversationDescription:
                "Przeszukam dokumentację, aby szybko znaleźć przewodniki konfiguracji, szczegóły funkcji i wskazówki dotyczące rozwiązywania problemów.",
            },
            footer: {
              selectText: "Wybierz",
              submitQuestionText: "Wyślij pytanie",
              selectKeyAriaLabel: "Klawisz Enter",
              navigateText: "Nawiguj",
              navigateUpKeyAriaLabel: "Strzałka w górę",
              navigateDownKeyAriaLabel: "Strzałka w dół",
              closeText: "Zamknij",
              backToSearchText: "Wróć do wyszukiwania",
              closeKeyAriaLabel: "Klawisz Esc",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "Nie można pobrać wyników",
              helpText: "Być może musisz sprawdzić połączenie sieciowe.",
            },
            startScreen: {
              recentSearchesTitle: "Ostatnie",
              noRecentSearchesText: "Brak ostatnich wyszukiwań",
              saveRecentSearchButtonTitle: "Zapisz to wyszukiwanie",
              removeRecentSearchButtonTitle: "Usuń to wyszukiwanie z historii",
              favoriteSearchesTitle: "Ulubione",
              removeFavoriteSearchButtonTitle: "Usuń z ulubionych",
              recentConversationsTitle: "Ostatnie rozmowy",
              removeRecentConversationButtonTitle: "Usuń tę rozmowę z historii",
            },
            noResultsScreen: {
              noResultsText: "Nie znaleziono odpowiednich wyników",
              suggestedQueryText: "Spróbuj wyszukać",
              reportMissingResultsText:
                "Czy uważasz, że to zapytanie powinno mieć wyniki?",
              reportMissingResultsLinkText: "Daj nam znać.",
            },
            resultsScreen: {
              askAiPlaceholder: "Zapytaj AI:",
              noResultsAskAiPlaceholder:
                "Nie znaleziono w dokumentacji? Wypróbuj Ask AI:",
            },
            askAiScreen: {
              disclaimerText:
                "Odpowiedź wygenerowana przez AI, może zawierać błędy. Sprawdź.",
              relatedSourcesText: "Powiązane źródła",
              thinkingText: "Myślenie...",
              copyButtonText: "Kopiuj",
              copyButtonCopiedText: "Skopiowano!",
              copyButtonTitle: "Kopiuj",
              likeButtonTitle: "Lubię to",
              dislikeButtonTitle: "Nie lubię",
              thanksForFeedbackText: "Dziękujemy za opinię!",
              preToolCallText: "Wyszukiwanie...",
              duringToolCallText: "Wyszukiwanie...",
              afterToolCallText: "Wyszukiwanie zakończone",
              stoppedStreamingText: "Zatrzymałeś tę odpowiedź",
              errorTitleText: "Błąd czatu",
              threadDepthExceededMessage:
                "Ta rozmowa została zamknięta, aby zachować dokładność odpowiedzi.",
              startNewConversationButtonText: "Rozpocznij nową rozmowę",
            },
          },
        },
      },
    },
    outlineTitle: "Na tej stronie",
    lastUpdatedText: "Ostatnia aktualizacja",
    docFooter: {
      prev: "Poprzedni",
      next: "Następny",
    },
    footer: {},
    editLink: {
      text: "Edytuj tę stronę na GitHub",
    },
  },
})
