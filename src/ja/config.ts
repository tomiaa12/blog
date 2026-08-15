import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "オンラインツール，無料ツール，ゲーム，FCゲーム，小ゲーム，画像処理，画像圧縮，画像変換，画像裁剪，PDF処理，PDF to Word，PDFマージ，PDF圧縮，ビデオ処理，ビデオ圧縮，ビデオ変換，Base64エンコーディング，URLエンコード，座標変換，地図タイルダウンロード，オンライン単語書き，iframeテスト，WEM音声変換MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "オンラインツール，無料ツール，ゲーム，FCゲーム，小ゲーム，画像処理，画像圧縮，画像変換，画像裁剪，PDF処理，PDF to Word，PDFマージ，PDF圧縮，ビデオ処理，ビデオ圧縮，ビデオ変換，Base64エンコーディング，URLエンコード，座標変換，地図タイルダウンロード，オンライン単語書き，iframeテスト，WEM音声変換MP3",
      },
    ],
  ],
  themeConfig: {
    nav: [
      {
        text: "フォーマット変換",
        items: [
          { text: "音声変換", link: "/ja/web/convert/audio" },
        ],
      },
      {
        text: "エンコード / デコード",
        items: [
          { text: "Base64 エンコード・デコード", link: "/ja/web/encode-decode/base64" },
          { text: "URL エンコード・デコード", link: "/ja/web/encode-decode/url" },
        ],
      },
      {
        text: "テキストツール",
        items: [
          { text: "複数行の結合 / 分割", link: "/ja/web/text-tools/multi-line-merge-split" },
          { text: "テキストを画像に変換", link: "/ja/web/text-tools/text-to-image" },
          { text: "テキストを画像に変換", link: "/ja/web/text-tools/text-to-image" },
          { text: "テキストを画像に変換", link: "/ja/web/text-tools/text-to-image" },
          { text: "ピンイン変換", link: "/ja/web/text-tools/pinyin-conversion" },
          { text: "簡体字・繁体字変換", link: "/ja/web/text-tools/simplified-traditional-conversion" },
          { text: "大文字・小文字変換", link: "/ja/web/text-tools/case-conversion" },
          { text: "重複行削除", link: "/ja/web/text-tools/duplicate-removal" },
          { text: "ローマ数字変換", link: "/ja/web/text-tools/roman-numeral-conversion" },
          { text: "中国語大文字金額変換", link: "/ja/web/text-tools/uppercase-amount-conversion" },
          { text: "読了時間の見積もり", link: "/ja/web/text-tools/reading-time-estimation" },
          { text: "全角・半角変換", link: "/ja/web/text-tools/full-width-half-width-conversion" },
          { text: "キーワード統計", link: "/ja/web/text-tools/keyword-statistics" },
          { text: "絵文字一覧", link: "/ja/web/text-tools/emoji-all" },
          { text: "文字数カウント", link: "/ja/web/text-tools/word-count" },
        ],
      },
      {
        text: "ハードウェアテスト",
        items: [
          { text: "マイクテスト", link: "/ja/web/hardware-test/microphone-test" },
          { text: "カメラテスト", link: "/ja/web/hardware-test/camera-test" },
          { text: "サウンドテスト", link: "/ja/web/hardware-test/sound-test" },
          { text: "キーボードテスト", link: "/ja/web/hardware-test/keyboard-test" },
          { text: "音声再生テスト", link: "/ja/web/hardware-test/audio-playback-test" },
          { text: "ゲームパッドテスト", link: "/ja/web/hardware-test/gamepad-test" },
          { text: "マウステスト", link: "/ja/web/hardware-test/mouse-test" },
          { text: "タッチスクリーンテスト", link: "/ja/web/hardware-test/touch-screen-test" },
          { text: "マルチタッチテスト", link: "/ja/web/hardware-test/multi-touch-test" },
          { text: "振動テスト", link: "/ja/web/hardware-test/vibration-test" },
          { text: "ジャイロテスト", link: "/ja/web/hardware-test/gyroscope-test" },
          { text: "加速度計テスト", link: "/ja/web/hardware-test/accelerometer-test" },
          { text: "FPSテスト", link: "/ja/web/hardware-test/fps-test" },
          { text: "ドット欠けテスト", link: "/ja/web/hardware-test/screen-bad-point-test" },
          { text: "解像度テスト", link: "/ja/web/hardware-test/screen-resolution-test" },
        ],
      },
      {
        text: "開発ツール",
        items: [
          { text: "地図座標変換", link: "/ja/web/dev-tools/map-coordinate-conversion" },
        ],
      },
      {
        text: "ゲーム",
        items: [
          { text: "FC レトロゲーム", link: "/pages/game" },
          { text: "Java クラシックゲーム", link: "/pages/javaGames" },
        ],
      },
    ],
    returnToTopLabel: "トップへ戻る",
    sidebarMenuLabel: "目次",
    darkModeSwitchLabel: "モード切替",
    lightModeSwitchTitle: "ライトモードに切替",
    darkModeSwitchTitle: "ダークモードに切替",
    notFound: {
      title: "ページが見つかりません",
      quote: "ページが見つかりません。URLが正しいか確認してください。",
      linkLabel: "ホームへ戻る",
      linkText: "ホームへ戻る",
    },
    search: {
      options: {
        placeholder: "ドキュメントを検索",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "AIに聞く",
                buttonAriaLabel: "AIに聞く",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "AIに聞く",
                  conversationHistoryTitle: "会話履歴",
                  newConversationText: "新しい会話を始める",
                  viewConversationHistoryText: "会話履歴",
                },
                promptForm: {
                  promptPlaceholderText: "質問する",
                  promptAnsweringText: "回答中...",
                  promptAskAnotherQuestionText: "別の質問をする",
                  promptDisclaimerText:
                    "回答はAIにより生成され、誤りがある場合があります。",
                  promptLabelText: "Enterで送信、Shift+Enterで改行。",
                  promptAriaLabelText: "質問入力",
                },
                conversationScreen: {
                  preToolCallText: "検索中...",
                  searchingText: "検索中...",
                  toolCallResultText: "検索しました",
                  conversationDisclaimer:
                    "回答はAIにより生成され、誤りがある場合があります。確認してください。",
                  reasoningText: "推論中...",
                  thinkingText: "考え中...",
                  relatedSourcesText: "関連ソース",
                  stoppedStreamingText: "この返信を停止しました",
                  copyButtonText: "コピー",
                  copyButtonCopiedText: "コピーしました！",
                  likeButtonTitle: "良い",
                  dislikeButtonTitle: "良くない",
                  thanksForFeedbackText: "フィードバックありがとうございます！",
                  errorTitleText: "チャットエラー",
                },
                newConversationScreen: {
                  titleText: "今日は何をお手伝いできますか？",
                  introductionText:
                    "ドキュメントを検索して、設定ガイド、機能の詳細、トラブルシューティングのヒントをすぐに見つけます。",
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
            buttonText: "検索",
            buttonAriaLabel: "検索",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "クリア",
              clearButtonAriaLabel: "クエリをクリア",
              closeButtonText: "閉じる",
              closeButtonAriaLabel: "閉じる",
              placeholderText: "ドキュメントを検索またはAIに質問",
              placeholderTextAskAi: "別の質問を入力...",
              placeholderTextAskAiStreaming: "回答中...",
              searchInputLabel: "検索",
              backToKeywordSearchButtonText: "キーワード検索に戻る",
              backToKeywordSearchButtonAriaLabel: "キーワード検索に戻る",
              newConversationPlaceholder: "質問する",
              conversationHistoryTitle: "会話履歴",
              startNewConversationText: "新しい会話を始める",
              viewConversationHistoryText: "会話履歴",
              threadDepthErrorPlaceholder: "会話の上限に達しました",
            },
            newConversation: {
              newConversationTitle: "今日は何をお手伝いできますか？",
              newConversationDescription:
                "ドキュメントを検索して、設定ガイド、機能の詳細、トラブルシューティングのヒントをすぐに見つけます。",
            },
            footer: {
              selectText: "選択",
              submitQuestionText: "質問を送信",
              selectKeyAriaLabel: "Enterキー",
              navigateText: "移動",
              navigateUpKeyAriaLabel: "上矢印",
              navigateDownKeyAriaLabel: "下矢印",
              closeText: "閉じる",
              backToSearchText: "検索に戻る",
              closeKeyAriaLabel: "Escキー",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "結果を取得できません",
              helpText: "ネットワーク接続を確認してください。",
            },
            startScreen: {
              recentSearchesTitle: "最近",
              noRecentSearchesText: "最近の検索はありません",
              saveRecentSearchButtonTitle: "この検索を保存",
              removeRecentSearchButtonTitle: "履歴からこの検索を削除",
              favoriteSearchesTitle: "お気に入り",
              removeFavoriteSearchButtonTitle: "お気に入りからこの検索を削除",
              recentConversationsTitle: "最近の会話",
              removeRecentConversationButtonTitle: "履歴からこの会話を削除",
            },
            noResultsScreen: {
              noResultsText: "関連する結果が見つかりません",
              suggestedQueryText: "検索してみてください",
              reportMissingResultsText: "このクエリには結果があるべきですか？",
              reportMissingResultsLinkText: "教えてください。",
            },
            resultsScreen: {
              askAiPlaceholder: "AIに質問：",
              noResultsAskAiPlaceholder:
                "ドキュメントで見つかりませんか？AIに聞いてください：",
            },
            askAiScreen: {
              disclaimerText:
                "回答はAIにより生成され、誤りがある場合があります。確認してください。",
              relatedSourcesText: "関連ソース",
              thinkingText: "考え中...",
              copyButtonText: "コピー",
              copyButtonCopiedText: "コピーしました！",
              copyButtonTitle: "コピー",
              likeButtonTitle: "良い",
              dislikeButtonTitle: "良くない",
              thanksForFeedbackText: "フィードバックありがとうございます！",
              preToolCallText: "検索中...",
              duringToolCallText: "検索中...",
              afterToolCallText: "検索しました",
              stoppedStreamingText: "この返信を停止しました",
              errorTitleText: "チャットエラー",
              threadDepthExceededMessage:
                "回答の精度を保つため、この会話はクローズされました。",
              startNewConversationButtonText: "新しい会話を始める",
            },
          },
        },
      },
    },
    outlineTitle: "このページの目次",
    lastUpdatedText: "最終更新日時",
    docFooter: {
      prev: "前の記事",
      next: "次の記事",
    },
    footer: {},
    editLink: {
      text: "GitHubでこのページを編集",
    },
  },
})
