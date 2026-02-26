import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "Outils en ligne, outils gratuits, jeux, jeux FC, petits jeux, traitement d'images, compression d'images, conversion d'images, recadrage d'images, traitement PDF, PDF en Word, fusion PDF, compression PDF, traitement vidéo, compression vidéo, conversion vidéo, encodage Base64, conversion de coordonnées, téléchargement de tuiles de carte, écriture de mots en ligne, test iframe, conversion audio WEM en MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "Outils en ligne, outils gratuits, jeux, jeux FC, petits jeux, traitement d'images, compression d'images, conversion d'images, recadrage d'images, traitement PDF, PDF en Word, fusion PDF, compression PDF, traitement vidéo, compression vidéo, conversion vidéo, encodage Base64, conversion de coordonnées, téléchargement de tuiles de carte, écriture de mots en ligne, test iframe, conversion audio WEM en MP3",
      },
    ],
  ],
  themeConfig: {
    returnToTopLabel: "Retour en haut",
    sidebarMenuLabel: "Sommaire",
    darkModeSwitchLabel: "Changer de mode",
    lightModeSwitchTitle: "Passer en mode clair",
    darkModeSwitchTitle: "Passer en mode sombre",
    notFound: {
      title: "Page introuvable",
      quote: "La page n'existe pas, veuillez vérifier l'URL.",
      linkLabel: "Retour à l'accueil",
      linkText: "Retour à l'accueil",
    },
    search: {
      options: {
        placeholder: "Rechercher dans la documentation",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "Demander à l'IA",
                buttonAriaLabel: "Demander à l'IA",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "Demander à l'IA",
                  conversationHistoryTitle: "Historique de mes conversations",
                  newConversationText: "Nouvelle conversation",
                  viewConversationHistoryText: "Historique",
                },
                promptForm: {
                  promptPlaceholderText: "Poser une question",
                  promptAnsweringText: "En train de répondre...",
                  promptAskAnotherQuestionText: "Poser une autre question",
                  promptDisclaimerText:
                    "Réponse générée par l'IA, peut contenir des erreurs.",
                  promptLabelText:
                    "Entrée pour envoyer, Shift+Entrée pour saut de ligne.",
                  promptAriaLabelText: "Saisie de question",
                },
                conversationScreen: {
                  preToolCallText: "Recherche en cours...",
                  searchingText: "Recherche en cours...",
                  toolCallResultText: "Recherche effectuée",
                  conversationDisclaimer:
                    "Réponse générée par l'IA, peut contenir des erreurs. Vérifiez.",
                  reasoningText: "Raisonnement en cours...",
                  thinkingText: "Réflexion en cours...",
                  relatedSourcesText: "Sources associées",
                  stoppedStreamingText: "Vous avez arrêté cette réponse",
                  copyButtonText: "Copier",
                  copyButtonCopiedText: "Copié !",
                  likeButtonTitle: "J'aime",
                  dislikeButtonTitle: "Je n'aime pas",
                  thanksForFeedbackText: "Merci pour votre retour !",
                  errorTitleText: "Erreur de chat",
                },
                newConversationScreen: {
                  titleText: "Comment puis-je vous aider aujourd'hui ?",
                  introductionText:
                    "Je vais rechercher dans votre documentation pour trouver rapidement des guides de configuration, des détails sur les fonctionnalités et des conseils de dépannage.",
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
            buttonText: "Rechercher",
            buttonAriaLabel: "Rechercher",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "Effacer",
              clearButtonAriaLabel: "Effacer la recherche",
              closeButtonText: "Fermer",
              closeButtonAriaLabel: "Fermer",
              placeholderText: "Rechercher dans la doc ou demander à l'IA",
              placeholderTextAskAi: "Poser une autre question...",
              placeholderTextAskAiStreaming: "En train de répondre...",
              searchInputLabel: "Rechercher",
              backToKeywordSearchButtonText:
                "Retour à la recherche par mot-clé",
              backToKeywordSearchButtonAriaLabel:
                "Retour à la recherche par mot-clé",
              newConversationPlaceholder: "Poser une question",
              conversationHistoryTitle: "Historique de mes conversations",
              startNewConversationText: "Nouvelle conversation",
              viewConversationHistoryText: "Historique",
              threadDepthErrorPlaceholder: "Limite de conversation atteinte",
            },
            newConversation: {
              newConversationTitle: "Comment puis-je vous aider aujourd'hui ?",
              newConversationDescription:
                "Je vais rechercher dans votre documentation pour trouver rapidement des guides de configuration, des détails sur les fonctionnalités et des conseils de dépannage.",
            },
            footer: {
              selectText: "Sélectionner",
              submitQuestionText: "Soumettre la question",
              selectKeyAriaLabel: "Touche Entrée",
              navigateText: "Naviguer",
              navigateUpKeyAriaLabel: "Flèche vers le haut",
              navigateDownKeyAriaLabel: "Flèche vers le bas",
              closeText: "Fermer",
              backToSearchText: "Retour à la recherche",
              closeKeyAriaLabel: "Touche Échap",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "Impossible de récupérer les résultats",
              helpText: "Vérifiez votre connexion réseau.",
            },
            startScreen: {
              recentSearchesTitle: "Récent",
              noRecentSearchesText: "Aucune recherche récente",
              saveRecentSearchButtonTitle: "Enregistrer cette recherche",
              removeRecentSearchButtonTitle:
                "Supprimer cette recherche de l'historique",
              favoriteSearchesTitle: "Favoris",
              removeFavoriteSearchButtonTitle: "Supprimer des favoris",
              recentConversationsTitle: "Conversations récentes",
              removeRecentConversationButtonTitle:
                "Supprimer cette conversation de l'historique",
            },
            noResultsScreen: {
              noResultsText: "Aucun résultat trouvé",
              suggestedQueryText: "Essayez de rechercher",
              reportMissingResultsText:
                "Vous pensez que cette requête devrait avoir des résultats ?",
              reportMissingResultsLinkText: "Dites-le nous.",
            },
            resultsScreen: {
              askAiPlaceholder: "Demander à l'IA :",
              noResultsAskAiPlaceholder:
                "Pas trouvé dans la doc ? Essayez Ask AI :",
            },
            askAiScreen: {
              disclaimerText:
                "Réponse générée par l'IA, peut contenir des erreurs. Vérifiez.",
              relatedSourcesText: "Sources associées",
              thinkingText: "Réflexion en cours...",
              copyButtonText: "Copier",
              copyButtonCopiedText: "Copié !",
              copyButtonTitle: "Copier",
              likeButtonTitle: "J'aime",
              dislikeButtonTitle: "Je n'aime pas",
              thanksForFeedbackText: "Merci pour votre retour !",
              preToolCallText: "Recherche en cours...",
              duringToolCallText: "Recherche en cours...",
              afterToolCallText: "Recherche effectuée",
              stoppedStreamingText: "Vous avez arrêté cette réponse",
              errorTitleText: "Erreur de chat",
              threadDepthExceededMessage:
                "Cette conversation a été fermée pour maintenir la précision des réponses.",
              startNewConversationButtonText: "Nouvelle conversation",
            },
          },
        },
      },
    },
    outlineTitle: "Sur cette page",
    lastUpdatedText: "Dernière mise à jour",
    docFooter: {
      prev: "Précédent",
      next: "Suivant",
    },
    footer: {},
    editLink: {
      text: "Modifier cette page sur GitHub",
    },
  },
})
