import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "Онлайн-инструменты, бесплатные инструменты, игры, игры FC, маленькие игры, обработка изображений, сжатие изображений, преобразование изображений, обрезка изображений, обработка PDF, PDF в Word, PDF слияние, PDF сжатие, обработка видео, сжатие видео, преобразование видео, Base64 кодирование, преобразование координат, загрузка карточных плиток, онлайн-написание слов, тест iframe, преобразование аудио WEM в MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "Онлайн-инструменты, бесплатные инструменты, игры, игры FC, маленькие игры, обработка изображений, сжатие изображений, преобразование изображений, обрезка изображений, обработка PDF, PDF в Word, PDF слияние, PDF сжатие, обработка видео, сжатие видео, преобразование видео, Base64 кодирование, преобразование координат, загрузка карточных плиток, онлайн-написание слов, тест iframe, преобразование аудио WEM в MP3",
      },
    ],
  ],
  themeConfig: {
    returnToTopLabel: "Вернуться наверх",
    sidebarMenuLabel: "Оглавление",
    darkModeSwitchLabel: "Переключить режим",
    lightModeSwitchTitle: "Переключить на светлый режим",
    darkModeSwitchTitle: "Переключить на тёмный режим",
    notFound: {
      title: "Страница не найдена",
      quote: "Страница не существует, пожалуйста, проверьте URL.",
      linkLabel: "Вернуться на главную",
      linkText: "Вернуться на главную",
    },
    search: {
      options: {
        placeholder: "Поиск в документации",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "Спросить ИИ",
                buttonAriaLabel: "Спросить ИИ",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "Спросить ИИ",
                  conversationHistoryTitle: "История моих разговоров",
                  newConversationText: "Начать новый разговор",
                  viewConversationHistoryText: "История",
                },
                promptForm: {
                  promptPlaceholderText: "Задать вопрос",
                  promptAnsweringText: "Отвечаю...",
                  promptAskAnotherQuestionText: "Задать другой вопрос",
                  promptDisclaimerText:
                    "Ответ сгенерирован ИИ, может содержать ошибки.",
                  promptLabelText:
                    "Enter для отправки, Shift+Enter для переноса строки.",
                  promptAriaLabelText: "Ввод вопроса",
                },
                conversationScreen: {
                  preToolCallText: "Поиск...",
                  searchingText: "Поиск...",
                  toolCallResultText: "Поиск выполнен",
                  conversationDisclaimer:
                    "Ответ сгенерирован ИИ, может содержать ошибки. Проверьте.",
                  reasoningText: "Рассуждаю...",
                  thinkingText: "Думаю...",
                  relatedSourcesText: "Связанные источники",
                  stoppedStreamingText: "Вы остановили этот ответ",
                  copyButtonText: "Копировать",
                  copyButtonCopiedText: "Скопировано!",
                  likeButtonTitle: "Нравится",
                  dislikeButtonTitle: "Не нравится",
                  thanksForFeedbackText: "Спасибо за отзыв!",
                  errorTitleText: "Ошибка чата",
                },
                newConversationScreen: {
                  titleText: "Чем я могу помочь вам сегодня?",
                  introductionText:
                    "Я выполню поиск в вашей документации и быстро найду руководства по настройке, сведения о функциях и советы по устранению неполадок.",
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
            buttonText: "Поиск",
            buttonAriaLabel: "Поиск",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "Очистить",
              clearButtonAriaLabel: "Очистить запрос",
              closeButtonText: "Закрыть",
              closeButtonAriaLabel: "Закрыть",
              placeholderText: "Поиск в документации или вопрос к ИИ",
              placeholderTextAskAi: "Ввести другой вопрос...",
              placeholderTextAskAiStreaming: "Отвечаю...",
              searchInputLabel: "Поиск",
              backToKeywordSearchButtonText:
                "Вернуться к поиску по ключевым словам",
              backToKeywordSearchButtonAriaLabel:
                "Вернуться к поиску по ключевым словам",
              newConversationPlaceholder: "Задать вопрос",
              conversationHistoryTitle: "История моих разговоров",
              startNewConversationText: "Начать новый разговор",
              viewConversationHistoryText: "История",
              threadDepthErrorPlaceholder: "Достигнут лимит разговора",
            },
            newConversation: {
              newConversationTitle: "Чем я могу помочь вам сегодня?",
              newConversationDescription:
                "Я выполню поиск в вашей документации и быстро найду руководства по настройке, сведения о функциях и советы по устранению неполадок.",
            },
            footer: {
              selectText: "Выбрать",
              submitQuestionText: "Отправить вопрос",
              selectKeyAriaLabel: "Клавиша Enter",
              navigateText: "Навигация",
              navigateUpKeyAriaLabel: "Стрелка вверх",
              navigateDownKeyAriaLabel: "Стрелка вниз",
              closeText: "Закрыть",
              backToSearchText: "Вернуться к поиску",
              closeKeyAriaLabel: "Клавиша Esc",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "Не удалось получить результаты",
              helpText: "Возможно, вам нужно проверить сетевое подключение.",
            },
            startScreen: {
              recentSearchesTitle: "Недавние",
              noRecentSearchesText: "Нет недавних поисков",
              saveRecentSearchButtonTitle: "Сохранить этот поиск",
              removeRecentSearchButtonTitle: "Удалить этот поиск из истории",
              favoriteSearchesTitle: "Избранное",
              removeFavoriteSearchButtonTitle: "Удалить из избранного",
              recentConversationsTitle: "Недавние разговоры",
              removeRecentConversationButtonTitle:
                "Удалить этот разговор из истории",
            },
            noResultsScreen: {
              noResultsText: "Не найдено релевантных результатов",
              suggestedQueryText: "Попробуйте поискать",
              reportMissingResultsText:
                "Считаете, что этот запрос должен иметь результаты?",
              reportMissingResultsLinkText: "Сообщите нам.",
            },
            resultsScreen: {
              askAiPlaceholder: "Спросить ИИ:",
              noResultsAskAiPlaceholder:
                "Не нашли в документации? Попробуйте Ask AI:",
            },
            askAiScreen: {
              disclaimerText:
                "Ответ сгенерирован ИИ, может содержать ошибки. Проверьте.",
              relatedSourcesText: "Связанные источники",
              thinkingText: "Думаю...",
              copyButtonText: "Копировать",
              copyButtonCopiedText: "Скопировано!",
              copyButtonTitle: "Копировать",
              likeButtonTitle: "Нравится",
              dislikeButtonTitle: "Не нравится",
              thanksForFeedbackText: "Спасибо за отзыв!",
              preToolCallText: "Поиск...",
              duringToolCallText: "Поиск...",
              afterToolCallText: "Поиск выполнен",
              stoppedStreamingText: "Вы остановили этот ответ",
              errorTitleText: "Ошибка чата",
              threadDepthExceededMessage:
                "Этот разговор был закрыт для сохранения точности ответов.",
              startNewConversationButtonText: "Начать новый разговор",
            },
          },
        },
      },
    },
    outlineTitle: "На этой странице",
    lastUpdatedText: "Последнее обновление",
    docFooter: {
      prev: "Предыдущая",
      next: "Следующая",
    },
    footer: {},
    editLink: {
      text: "Редактировать эту страницу на GitHub",
    },
  },
})
