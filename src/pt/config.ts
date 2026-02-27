import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "Ferramentas online, ferramentas gratuitas, jogos, jogos FC, jogos pequenos, processamento de imagens, compressão de imagens, conversão de imagens, recorte de imagens, processamento de PDF, PDF para Word, PDF de fusão, PDF de compressão, processamento de vídeo, compressão de vídeo, conversão de vídeo, Base64 de codificação, conversão de coordenadas, download de mosaicos de mapa, escrita online de palavras, teste de iframe, conversão de áudio WEM para MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "Ferramentas online, ferramentas gratuitas, jogos, jogos FC, jogos pequenos, processamento de imagens, compressão de imagens, conversão de imagens, recorte de imagens, processamento de PDF, PDF para Word, PDF de fusão, PDF de compressão, processamento de vídeo, compressão de vídeo, conversão de vídeo, Base64 de codificação, conversão de coordenadas, download de mosaicos de mapa, escrita online de palavras, teste de iframe, conversão de áudio WEM para MP3",
      },
    ],
  ],
  themeConfig: {
    nav: [
      {
        text: "Conversão de formato",
        items: [
          { text: "Conversão de áudio", link: "/web/convert/audio" },
        ],
      },
      {
        text: "Jogos",
        items: [
          { text: "Jogos retro NES", link: "/pages/game" },
          { text: "Jogos clássicos Java", link: "/pages/javaGames" },
        ],
      },
    ],
    returnToTopLabel: "Voltar ao topo",
    sidebarMenuLabel: "Índice",
    darkModeSwitchLabel: "Alternar modo",
    lightModeSwitchTitle: "Mudar para modo claro",
    darkModeSwitchTitle: "Mudar para modo escuro",
    notFound: {
      title: "Página não encontrada",
      quote: "A página não existe, verifique se a URL está correta.",
      linkLabel: "Voltar à página inicial",
      linkText: "Voltar à página inicial",
    },
    search: {
      options: {
        placeholder: "Pesquisar na documentação",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "Perguntar à IA",
                buttonAriaLabel: "Perguntar à IA",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "Perguntar à IA",
                  conversationHistoryTitle: "Meu histórico de conversas",
                  newConversationText: "Iniciar nova conversa",
                  viewConversationHistoryText: "Histórico",
                },
                promptForm: {
                  promptPlaceholderText: "Fazer uma pergunta",
                  promptAnsweringText: "Respondendo...",
                  promptAskAnotherQuestionText: "Fazer outra pergunta",
                  promptDisclaimerText:
                    "Resposta gerada por IA, pode conter erros.",
                  promptLabelText:
                    "Enter para enviar, Shift+Enter para nova linha.",
                  promptAriaLabelText: "Entrada de pergunta",
                },
                conversationScreen: {
                  preToolCallText: "Pesquisando...",
                  searchingText: "Pesquisando...",
                  toolCallResultText: "Pesquisa concluída",
                  conversationDisclaimer:
                    "Resposta gerada por IA, pode conter erros. Verifique.",
                  reasoningText: "Raciocinando...",
                  thinkingText: "Pensando...",
                  relatedSourcesText: "Fontes relacionadas",
                  stoppedStreamingText: "Você parou esta resposta",
                  copyButtonText: "Copiar",
                  copyButtonCopiedText: "Copiado!",
                  likeButtonTitle: "Gostei",
                  dislikeButtonTitle: "Não gostei",
                  thanksForFeedbackText: "Obrigado pelo seu feedback!",
                  errorTitleText: "Erro de chat",
                },
                newConversationScreen: {
                  titleText: "Como posso ajudá-lo hoje?",
                  introductionText:
                    "Vou pesquisar na sua documentação para encontrar rapidamente guias de configuração, detalhes de funcionalidades e dicas de solução de problemas.",
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
            buttonText: "Pesquisar",
            buttonAriaLabel: "Pesquisar",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "Limpar",
              clearButtonAriaLabel: "Limpar pesquisa",
              closeButtonText: "Fechar",
              closeButtonAriaLabel: "Fechar",
              placeholderText: "Pesquisar na doc ou perguntar à IA",
              placeholderTextAskAi: "Fazer outra pergunta...",
              placeholderTextAskAiStreaming: "Respondendo...",
              searchInputLabel: "Pesquisar",
              backToKeywordSearchButtonText:
                "Voltar à pesquisa por palavra-chave",
              backToKeywordSearchButtonAriaLabel:
                "Voltar à pesquisa por palavra-chave",
              newConversationPlaceholder: "Fazer uma pergunta",
              conversationHistoryTitle: "Meu histórico de conversas",
              startNewConversationText: "Iniciar nova conversa",
              viewConversationHistoryText: "Histórico",
              threadDepthErrorPlaceholder: "Limite de conversa atingido",
            },
            newConversation: {
              newConversationTitle: "Como posso ajudá-lo hoje?",
              newConversationDescription:
                "Vou pesquisar na sua documentação para encontrar rapidamente guias de configuração, detalhes de funcionalidades e dicas de solução de problemas.",
            },
            footer: {
              selectText: "Selecionar",
              submitQuestionText: "Enviar pergunta",
              selectKeyAriaLabel: "Tecla Enter",
              navigateText: "Navegar",
              navigateUpKeyAriaLabel: "Seta para cima",
              navigateDownKeyAriaLabel: "Seta para baixo",
              closeText: "Fechar",
              backToSearchText: "Voltar à pesquisa",
              closeKeyAriaLabel: "Tecla Esc",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "Não foi possível obter resultados",
              helpText: "Pode ser necessário verificar sua conexão de rede.",
            },
            startScreen: {
              recentSearchesTitle: "Recente",
              noRecentSearchesText: "Sem pesquisas recentes",
              saveRecentSearchButtonTitle: "Salvar esta pesquisa",
              removeRecentSearchButtonTitle:
                "Remover esta pesquisa do histórico",
              favoriteSearchesTitle: "Favoritos",
              removeFavoriteSearchButtonTitle: "Remover dos favoritos",
              recentConversationsTitle: "Conversas recentes",
              removeRecentConversationButtonTitle:
                "Remover esta conversa do histórico",
            },
            noResultsScreen: {
              noResultsText: "Nenhum resultado relevante encontrado",
              suggestedQueryText: "Tente pesquisar",
              reportMissingResultsText:
                "Acha que esta consulta deveria ter resultados?",
              reportMissingResultsLinkText: "Conte-nos.",
            },
            resultsScreen: {
              askAiPlaceholder: "Perguntar à IA:",
              noResultsAskAiPlaceholder:
                "Não encontrou na doc? Experimente o Ask AI:",
            },
            askAiScreen: {
              disclaimerText:
                "Resposta gerada por IA, pode conter erros. Verifique.",
              relatedSourcesText: "Fontes relacionadas",
              thinkingText: "Pensando...",
              copyButtonText: "Copiar",
              copyButtonCopiedText: "Copiado!",
              copyButtonTitle: "Copiar",
              likeButtonTitle: "Gostei",
              dislikeButtonTitle: "Não gostei",
              thanksForFeedbackText: "Obrigado pelo seu feedback!",
              preToolCallText: "Pesquisando...",
              duringToolCallText: "Pesquisando...",
              afterToolCallText: "Pesquisa concluída",
              stoppedStreamingText: "Você parou esta resposta",
              errorTitleText: "Erro de chat",
              threadDepthExceededMessage:
                "Esta conversa foi encerrada para manter a precisão das respostas.",
              startNewConversationButtonText: "Iniciar nova conversa",
            },
          },
        },
      },
    },
    outlineTitle: "Nesta página",
    lastUpdatedText: "Última atualização",
    docFooter: {
      prev: "Anterior",
      next: "Próximo",
    },
    footer: {},
    editLink: {
      text: "Editar esta página no GitHub",
    },
  },
})
