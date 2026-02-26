import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "線上工具，免費工具，遊戲，FC遊戲，小遊戲，圖片處理，圖片壓縮，圖片轉換，圖片裁剪，PDF處理，PDF轉Word，PDF合併，PDF壓縮，視頻處理，視頻壓縮，視頻轉換，Base64編碼，坐標轉換，地圖瓦片下載，線上默寫單詞，iframe測試，WEM音頻轉換MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "線上工具，免費工具，遊戲，FC遊戲，小遊戲，圖片處理，圖片壓縮，圖片轉換，圖片裁剪，PDF處理，PDF轉Word，PDF合併，PDF壓縮，視頻處理，視頻壓縮，視頻轉換，Base64編碼，坐標轉換，地圖瓦片下載，線上默寫單詞，iframe測試，WEM音頻轉換MP3",
      },
    ],
  ],
  themeConfig: {
    returnToTopLabel: "返回頂部",
    sidebarMenuLabel: "目錄",
    darkModeSwitchLabel: "切換模式",
    lightModeSwitchTitle: "切換到淺色",
    darkModeSwitchTitle: "切換到深色",
    notFound: {
      title: "頁面不存在",
      quote: "頁面不存在，請檢查URL是否正確。",
      linkLabel: "返回首頁",
      linkText: "返回首頁",
    },
    search: {
      options: {
        placeholder: "搜尋文件",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "詢問 AI",
                buttonAriaLabel: "詢問 AI",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "詢問 AI",
                  conversationHistoryTitle: "我的對話歷史",
                  newConversationText: "開始新的對話",
                  viewConversationHistoryText: "對話歷史",
                },
                promptForm: {
                  promptPlaceholderText: "提問",
                  promptAnsweringText: "正在回答...",
                  promptAskAnotherQuestionText: "再問一個問題",
                  promptDisclaimerText: "回答由 AI 生成，可能會出錯。",
                  promptLabelText: "按回車發送，Shift+回車換行。",
                  promptAriaLabelText: "問題輸入",
                },
                conversationScreen: {
                  preToolCallText: "搜尋中...",
                  searchingText: "搜尋中...",
                  toolCallResultText: "已搜尋",
                  conversationDisclaimer:
                    "回答由 AI 生成，可能會出錯。請核實。",
                  reasoningText: "推理中...",
                  thinkingText: "思考中...",
                  relatedSourcesText: "相關來源",
                  stoppedStreamingText: "你已停止此回覆",
                  copyButtonText: "複製",
                  copyButtonCopiedText: "已複製！",
                  likeButtonTitle: "喜歡",
                  dislikeButtonTitle: "不喜歡",
                  thanksForFeedbackText: "感謝你的反饋！",
                  errorTitleText: "聊天錯誤",
                },
                newConversationScreen: {
                  titleText: "我今天能幫你什麼？",
                  introductionText:
                    "我會搜尋你的文件，快速幫你找到設定指南、功能細節和故障排除提示。",
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
            buttonText: "搜尋",
            buttonAriaLabel: "搜尋",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "清除",
              clearButtonAriaLabel: "清除查詢",
              closeButtonText: "關閉",
              closeButtonAriaLabel: "關閉",
              placeholderText: "搜尋文件或向 AI 提問",
              placeholderTextAskAi: "再問一個問題...",
              placeholderTextAskAiStreaming: "正在回答...",
              searchInputLabel: "搜尋",
              backToKeywordSearchButtonText: "返回關鍵詞搜尋",
              backToKeywordSearchButtonAriaLabel: "返回關鍵詞搜尋",
              newConversationPlaceholder: "提問",
              conversationHistoryTitle: "我的對話歷史",
              startNewConversationText: "開始新的對話",
              viewConversationHistoryText: "對話歷史",
              threadDepthErrorPlaceholder: "對話已達上限",
            },
            newConversation: {
              newConversationTitle: "我今天能幫你什麼？",
              newConversationDescription:
                "我會搜尋你的文件，快速幫你找到設定指南、功能細節和故障排除提示。",
            },
            footer: {
              selectText: "選擇",
              submitQuestionText: "提交問題",
              selectKeyAriaLabel: "回車鍵",
              navigateText: "導航",
              navigateUpKeyAriaLabel: "向上箭頭",
              navigateDownKeyAriaLabel: "向下箭頭",
              closeText: "關閉",
              backToSearchText: "返回搜尋",
              closeKeyAriaLabel: "Esc 鍵",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "無法獲取結果",
              helpText: "你可能需要檢查網路連接。",
            },
            startScreen: {
              recentSearchesTitle: "最近",
              noRecentSearchesText: "暫無最近搜尋",
              saveRecentSearchButtonTitle: "儲存此搜尋",
              removeRecentSearchButtonTitle: "從歷史記錄中移除此搜尋",
              favoriteSearchesTitle: "收藏",
              removeFavoriteSearchButtonTitle: "從收藏中移除此搜尋",
              recentConversationsTitle: "最近對話",
              removeRecentConversationButtonTitle: "從歷史記錄中移除此對話",
            },
            noResultsScreen: {
              noResultsText: "未找到相關結果",
              suggestedQueryText: "嘗試搜尋",
              reportMissingResultsText: "認為此查詢應該有結果？",
              reportMissingResultsLinkText: "告訴我們。",
            },
            resultsScreen: {
              askAiPlaceholder: "詢問 AI：",
              noResultsAskAiPlaceholder: "文件裡沒找到？讓 Ask AI 幫忙：",
            },
            askAiScreen: {
              disclaimerText: "回答由 AI 生成，可能會出錯。請核實。",
              relatedSourcesText: "相關來源",
              thinkingText: "思考中...",
              copyButtonText: "複製",
              copyButtonCopiedText: "已複製！",
              copyButtonTitle: "複製",
              likeButtonTitle: "喜歡",
              dislikeButtonTitle: "不喜歡",
              thanksForFeedbackText: "感謝你的反饋！",
              preToolCallText: "搜尋中...",
              duringToolCallText: "搜尋中...",
              afterToolCallText: "已搜尋",
              stoppedStreamingText: "你已停止此回覆",
              errorTitleText: "聊天錯誤",
              threadDepthExceededMessage: "為保持回答準確，此對話已關閉。",
              startNewConversationButtonText: "開始新的對話",
            },
          },
        },
      },
    },
    outlineTitle: "此頁目錄",
    lastUpdatedText: "最後更新時間",
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    footer: {},
    editLink: {
      text: "在 GitHub 編輯此頁",
    },
  },
})
