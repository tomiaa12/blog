import { defineAdditionalConfig } from 'vitepress'

export default defineAdditionalConfig({
  description:
    "Herramientas en línea, herramientas gratuitas, juegos, juegos FC, juegos pequeños, procesamiento de imágenes, compresión de imágenes, conversión de imágenes, recorte de imágenes, procesamiento de PDF, PDF a Word, PDF de fusión, PDF de compresión, procesamiento de video, compresión de video, conversión de video, Base64 de codificación, conversión de coordenadas, descarga de mosaicos de mapa, escritura en línea de palabras, prueba de iframe, conversión de audio WEM a MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "Herramientas en línea, herramientas gratuitas, juegos, juegos FC, juegos pequeños, procesamiento de imágenes, compresión de imágenes, conversión de imágenes, recorte de imágenes, procesamiento de PDF, PDF a Word, PDF de fusión, PDF de compresión, procesamiento de video, compresión de video, conversión de video, Base64 de codificación, conversión de coordenadas, descarga de mosaicos de mapa, escritura en línea de palabras, prueba de iframe, conversión de audio WEM a MP3",
      },
    ],
  ],
  themeConfig: {
    returnToTopLabel: "Volver arriba",
    sidebarMenuLabel: "Índice",
    darkModeSwitchLabel: "Cambiar modo",
    lightModeSwitchTitle: "Cambiar a modo claro",
    darkModeSwitchTitle: "Cambiar a modo oscuro",
    notFound: {
      title: "Página no encontrada",
      quote: "La página no existe, por favor verifique la URL.",
      linkLabel: "Volver al inicio",
      linkText: "Volver al inicio",
    },
    search: {
      options: {
        placeholder: "Buscar en la documentación",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "Preguntar a la IA",
                buttonAriaLabel: "Preguntar a la IA",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "Preguntar a la IA",
                  conversationHistoryTitle:
                    "Mi historial de conversaciones",
                  newConversationText: "Iniciar nueva conversación",
                  viewConversationHistoryText: "Historial",
                },
                promptForm: {
                  promptPlaceholderText: "Hacer una pregunta",
                  promptAnsweringText: "Respondiendo...",
                  promptAskAnotherQuestionText: "Hacer otra pregunta",
                  promptDisclaimerText:
                    "Respuesta generada por IA, puede contener errores.",
                  promptLabelText:
                    "Enter para enviar, Shift+Enter para nueva línea.",
                  promptAriaLabelText: "Entrada de pregunta",
                },
                conversationScreen: {
                  preToolCallText: "Buscando...",
                  searchingText: "Buscando...",
                  toolCallResultText: "Búsqueda realizada",
                  conversationDisclaimer:
                    "Respuesta generada por IA, puede contener errores. Verifique.",
                  reasoningText: "Razonando...",
                  thinkingText: "Pensando...",
                  relatedSourcesText: "Fuentes relacionadas",
                  stoppedStreamingText: "Ha detenido esta respuesta",
                  copyButtonText: "Copiar",
                  copyButtonCopiedText: "¡Copiado!",
                  likeButtonTitle: "Me gusta",
                  dislikeButtonTitle: "No me gusta",
                  thanksForFeedbackText: "¡Gracias por su opinión!",
                  errorTitleText: "Error de chat",
                },
                newConversationScreen: {
                  titleText: "¿En qué puedo ayudarle hoy?",
                  introductionText:
                    "Buscaré en su documentación para encontrar rápidamente guías de configuración, detalles de funciones y consejos de solución de problemas.",
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
            buttonText: "Buscar",
            buttonAriaLabel: "Buscar",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "Limpiar",
              clearButtonAriaLabel: "Limpiar búsqueda",
              closeButtonText: "Cerrar",
              closeButtonAriaLabel: "Cerrar",
              placeholderText: "Buscar en la doc o preguntar a la IA",
              placeholderTextAskAi: "Hacer otra pregunta...",
              placeholderTextAskAiStreaming: "Respondiendo...",
              searchInputLabel: "Buscar",
              backToKeywordSearchButtonText:
                "Volver a la búsqueda por palabra clave",
              backToKeywordSearchButtonAriaLabel:
                "Volver a la búsqueda por palabra clave",
              newConversationPlaceholder: "Hacer una pregunta",
              conversationHistoryTitle: "Mi historial de conversaciones",
              startNewConversationText: "Iniciar nueva conversación",
              viewConversationHistoryText: "Historial",
              threadDepthErrorPlaceholder:
                "Límite de conversación alcanzado",
            },
            newConversation: {
              newConversationTitle: "¿En qué puedo ayudarle hoy?",
              newConversationDescription:
                "Buscaré en su documentación para encontrar rápidamente guías de configuración, detalles de funciones y consejos de solución de problemas.",
            },
            footer: {
              selectText: "Seleccionar",
              submitQuestionText: "Enviar pregunta",
              selectKeyAriaLabel: "Tecla Enter",
              navigateText: "Navegar",
              navigateUpKeyAriaLabel: "Flecha arriba",
              navigateDownKeyAriaLabel: "Flecha abajo",
              closeText: "Cerrar",
              backToSearchText: "Volver a la búsqueda",
              closeKeyAriaLabel: "Tecla Esc",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "No se pudieron obtener resultados",
              helpText: "Es posible que deba verificar su conexión de red.",
            },
            startScreen: {
              recentSearchesTitle: "Reciente",
              noRecentSearchesText: "Sin búsquedas recientes",
              saveRecentSearchButtonTitle: "Guardar esta búsqueda",
              removeRecentSearchButtonTitle:
                "Eliminar esta búsqueda del historial",
              favoriteSearchesTitle: "Favoritos",
              removeFavoriteSearchButtonTitle: "Eliminar de favoritos",
              recentConversationsTitle: "Conversaciones recientes",
              removeRecentConversationButtonTitle:
                "Eliminar esta conversación del historial",
            },
            noResultsScreen: {
              noResultsText: "No se encontraron resultados relevantes",
              suggestedQueryText: "Intente buscar",
              reportMissingResultsText:
                "¿Cree que esta consulta debería tener resultados?",
              reportMissingResultsLinkText: "Cuéntenos.",
            },
            resultsScreen: {
              askAiPlaceholder: "Preguntar a la IA:",
              noResultsAskAiPlaceholder:
                "¿No encontró en la doc? Pruebe Ask AI:",
            },
            askAiScreen: {
              disclaimerText:
                "Respuesta generada por IA, puede contener errores. Verifique.",
              relatedSourcesText: "Fuentes relacionadas",
              thinkingText: "Pensando...",
              copyButtonText: "Copiar",
              copyButtonCopiedText: "¡Copiado!",
              copyButtonTitle: "Copiar",
              likeButtonTitle: "Me gusta",
              dislikeButtonTitle: "No me gusta",
              thanksForFeedbackText: "¡Gracias por su opinión!",
              preToolCallText: "Buscando...",
              duringToolCallText: "Buscando...",
              afterToolCallText: "Búsqueda realizada",
              stoppedStreamingText: "Ha detenido esta respuesta",
              errorTitleText: "Error de chat",
              threadDepthExceededMessage:
                "Esta conversación ha sido cerrada para mantener la precisión de las respuestas.",
              startNewConversationButtonText: "Iniciar nueva conversación",
            },
          },
        },
      },
    },
    outlineTitle: "En esta página",
    lastUpdatedText: "Última actualización",
    docFooter: {
      prev: "Anterior",
      next: "Siguiente",
    },
    footer: {},
    editLink: {
      text: "Editar esta página en GitHub",
    },
  },
})
