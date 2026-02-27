import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "온라인 도구, 무료 도구, 게임, FC 게임, 소게임, 이미지 처리, 이미지 압축, 이미지 변환, 이미지 자르기, PDF 처리, PDF to Word, PDF 병합, PDF 압축, 비디오 처리, 비디오 압축, 비디오 변환, Base64 인코딩, 좌표 변환, 지도 타일 다운로드, 온라인 단어 쓰기, iframe 테스트, WEM 오디오 변환 MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "온라인 도구, 무료 도구, 게임, FC 게임, 소게임, 이미지 처리, 이미지 압축, 이미지 변환, 이미지 자르기, PDF 처리, PDF to Word, PDF 병합, PDF 압축, 비디오 처리, 비디오 압축, 비디오 변환, Base64 인코딩, 좌표 변환, 지도 타일 다운로드, 온라인 단어 쓰기, iframe 테스트, WEM 오디오 변환 MP3",
      },
    ],
  ],
  themeConfig: {
    nav: [
      {
        text: "형식 변환",
        items: [
          { text: "오디오 변환", link: "/web/convert/audio" },
        ],
      },
      {
        text: "게임",
        items: [
          { text: "FC 레트로 게임", link: "/pages/game" },
          { text: "Java 클래식 게임", link: "/pages/javaGames" },
        ],
      },
    ],
    returnToTopLabel: "맨 위로",
    sidebarMenuLabel: "목차",
    darkModeSwitchLabel: "모드 전환",
    lightModeSwitchTitle: "라이트 모드로 전환",
    darkModeSwitchTitle: "다크 모드로 전환",
    notFound: {
      title: "페이지를 찾을 수 없습니다",
      quote: "페이지를 찾을 수 없습니다. URL이 올바른지 확인하세요.",
      linkLabel: "홈으로 돌아가기",
      linkText: "홈으로 돌아가기",
    },
    search: {
      options: {
        placeholder: "문서 검색",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "AI에게 묻기",
                buttonAriaLabel: "AI에게 묻기",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "AI에게 묻기",
                  conversationHistoryTitle: "내 대화 기록",
                  newConversationText: "새 대화 시작",
                  viewConversationHistoryText: "대화 기록",
                },
                promptForm: {
                  promptPlaceholderText: "질문하기",
                  promptAnsweringText: "답변 중...",
                  promptAskAnotherQuestionText: "다른 질문하기",
                  promptDisclaimerText:
                    "AI가 생성한 답변으로 오류가 있을 수 있습니다.",
                  promptLabelText: "Enter로 전송, Shift+Enter로 줄바꿈.",
                  promptAriaLabelText: "질문 입력",
                },
                conversationScreen: {
                  preToolCallText: "검색 중...",
                  searchingText: "검색 중...",
                  toolCallResultText: "검색 완료",
                  conversationDisclaimer:
                    "AI가 생성한 답변으로 오류가 있을 수 있습니다. 확인하세요.",
                  reasoningText: "추론 중...",
                  thinkingText: "생각 중...",
                  relatedSourcesText: "관련 출처",
                  stoppedStreamingText: "답변을 중단했습니다",
                  copyButtonText: "복사",
                  copyButtonCopiedText: "복사됨!",
                  likeButtonTitle: "좋아요",
                  dislikeButtonTitle: "싫어요",
                  thanksForFeedbackText: "피드백 감사합니다!",
                  errorTitleText: "채팅 오류",
                },
                newConversationScreen: {
                  titleText: "오늘 무엇을 도와드릴까요?",
                  introductionText:
                    "문서를 검색하여 설정 가이드, 기능 세부 정보 및 문제 해결 팁을 빠르게 찾아드립니다.",
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
            buttonText: "검색",
            buttonAriaLabel: "검색",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "지우기",
              clearButtonAriaLabel: "쿼리 지우기",
              closeButtonText: "닫기",
              closeButtonAriaLabel: "닫기",
              placeholderText: "문서 검색 또는 AI에게 질문",
              placeholderTextAskAi: "다른 질문을 입력...",
              placeholderTextAskAiStreaming: "답변 중...",
              searchInputLabel: "검색",
              backToKeywordSearchButtonText: "키워드 검색으로 돌아가기",
              backToKeywordSearchButtonAriaLabel: "키워드 검색으로 돌아가기",
              newConversationPlaceholder: "질문하기",
              conversationHistoryTitle: "내 대화 기록",
              startNewConversationText: "새 대화 시작",
              viewConversationHistoryText: "대화 기록",
              threadDepthErrorPlaceholder: "대화 한도에 도달했습니다",
            },
            newConversation: {
              newConversationTitle: "오늘 무엇을 도와드릴까요?",
              newConversationDescription:
                "문서를 검색하여 설정 가이드, 기능 세부 정보 및 문제 해결 팁을 빠르게 찾아드립니다.",
            },
            footer: {
              selectText: "선택",
              submitQuestionText: "질문 제출",
              selectKeyAriaLabel: "Enter 키",
              navigateText: "탐색",
              navigateUpKeyAriaLabel: "위쪽 화살표",
              navigateDownKeyAriaLabel: "아래쪽 화살표",
              closeText: "닫기",
              backToSearchText: "검색으로 돌아가기",
              closeKeyAriaLabel: "Esc 키",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "결과를 가져올 수 없습니다",
              helpText: "네트워크 연결을 확인하세요.",
            },
            startScreen: {
              recentSearchesTitle: "최근",
              noRecentSearchesText: "최근 검색 없음",
              saveRecentSearchButtonTitle: "이 검색 저장",
              removeRecentSearchButtonTitle: "기록에서 이 검색 제거",
              favoriteSearchesTitle: "즐겨찾기",
              removeFavoriteSearchButtonTitle: "즐겨찾기에서 이 검색 제거",
              recentConversationsTitle: "최근 대화",
              removeRecentConversationButtonTitle: "기록에서 이 대화 제거",
            },
            noResultsScreen: {
              noResultsText: "관련 결과를 찾을 수 없습니다",
              suggestedQueryText: "검색을 시도해 보세요",
              reportMissingResultsText:
                "이 쿼리에 결과가 있어야 한다고 생각하시나요?",
              reportMissingResultsLinkText: "알려주세요.",
            },
            resultsScreen: {
              askAiPlaceholder: "AI에게 질문：",
              noResultsAskAiPlaceholder:
                "문서에서 찾지 못했나요? AI에게 물어보세요：",
            },
            askAiScreen: {
              disclaimerText:
                "AI가 생성한 답변으로 오류가 있을 수 있습니다. 확인하세요.",
              relatedSourcesText: "관련 출처",
              thinkingText: "생각 중...",
              copyButtonText: "복사",
              copyButtonCopiedText: "복사됨!",
              copyButtonTitle: "복사",
              likeButtonTitle: "좋아요",
              dislikeButtonTitle: "싫어요",
              thanksForFeedbackText: "피드백 감사합니다!",
              preToolCallText: "검색 중...",
              duringToolCallText: "검색 중...",
              afterToolCallText: "검색 완료",
              stoppedStreamingText: "답변을 중단했습니다",
              errorTitleText: "채팅 오류",
              threadDepthExceededMessage:
                "답변 정확도를 유지하기 위해 이 대화가 종료되었습니다.",
              startNewConversationButtonText: "새 대화 시작",
            },
          },
        },
      },
    },
    outlineTitle: "이 페이지 목차",
    lastUpdatedText: "마지막 업데이트",
    docFooter: {
      prev: "이전",
      next: "다음",
    },
    footer: {},
    editLink: {
      text: "GitHub에서 이 페이지 편집",
    },
  },
})
