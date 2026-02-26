import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "Công cụ trực tuyến, công cụ miễn phí, trò chơi, trò chơi FC, trò chơi nhỏ, xử lý ảnh, nén ảnh, chuyển đổi ảnh, cắt ảnh, xử lý PDF, PDF to Word, PDF hợp nhất, PDF nén, xử lý video, nén video, chuyển đổi video, Base64 mã hóa, chuyển đổi tọa độ, tải xuống khối ảnh bản đồ, viết từ trực tuyến, kiểm tra iframe, chuyển đổi âm thanh WEM thành MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "Công cụ trực tuyến, công cụ miễn phí, trò chơi, trò chơi FC, trò chơi nhỏ, xử lý ảnh, nén ảnh, chuyển đổi ảnh, cắt ảnh, xử lý PDF, PDF to Word, PDF hợp nhất, PDF nén, xử lý video, nén video, chuyển đổi video, Base64 mã hóa, chuyển đổi tọa độ, tải xuống khối ảnh bản đồ, viết từ trực tuyến, kiểm tra iframe, chuyển đổi âm thanh WEM thành MP3",
      },
    ],
  ],
  themeConfig: {
    returnToTopLabel: "Lên đầu trang",
    sidebarMenuLabel: "Mục lục",
    darkModeSwitchLabel: "Chuyển đổi chế độ",
    lightModeSwitchTitle: "Chuyển sang chế độ sáng",
    darkModeSwitchTitle: "Chuyển sang chế độ tối",
    notFound: {
      title: "Trang không tồn tại",
      quote: "Trang không tồn tại, vui lòng kiểm tra URL.",
      linkLabel: "Quay lại trang chủ",
      linkText: "Quay lại trang chủ",
    },
    search: {
      options: {
        placeholder: "Tìm kiếm tài liệu",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "Hỏi AI",
                buttonAriaLabel: "Hỏi AI",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "Hỏi AI",
                  conversationHistoryTitle: "Lịch sử hội thoại của tôi",
                  newConversationText: "Bắt đầu hội thoại mới",
                  viewConversationHistoryText: "Lịch sử hội thoại",
                },
                promptForm: {
                  promptPlaceholderText: "Đặt câu hỏi",
                  promptAnsweringText: "Đang trả lời...",
                  promptAskAnotherQuestionText: "Đặt câu hỏi khác",
                  promptDisclaimerText:
                    "Câu trả lời do AI tạo ra, có thể có lỗi.",
                  promptLabelText: "Enter để gửi, Shift+Enter để xuống dòng.",
                  promptAriaLabelText: "Nhập câu hỏi",
                },
                conversationScreen: {
                  preToolCallText: "Đang tìm kiếm...",
                  searchingText: "Đang tìm kiếm...",
                  toolCallResultText: "Đã tìm kiếm",
                  conversationDisclaimer:
                    "Câu trả lời do AI tạo ra, có thể có lỗi. Hãy kiểm tra.",
                  reasoningText: "Đang suy luận...",
                  thinkingText: "Đang suy nghĩ...",
                  relatedSourcesText: "Nguồn liên quan",
                  stoppedStreamingText: "Bạn đã dừng phản hồi này",
                  copyButtonText: "Sao chép",
                  copyButtonCopiedText: "Đã sao chép!",
                  likeButtonTitle: "Thích",
                  dislikeButtonTitle: "Không thích",
                  thanksForFeedbackText: "Cảm ơn phản hồi của bạn!",
                  errorTitleText: "Lỗi trò chuyện",
                },
                newConversationScreen: {
                  titleText: "Hôm nay tôi có thể giúp gì cho bạn?",
                  introductionText:
                    "Tôi sẽ tìm kiếm trong tài liệu của bạn để nhanh chóng tìm thấy hướng dẫn cài đặt, chi tiết tính năng và mẹo xử lý sự cố.",
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
            buttonText: "Tìm kiếm",
            buttonAriaLabel: "Tìm kiếm",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "Xóa",
              clearButtonAriaLabel: "Xóa tìm kiếm",
              closeButtonText: "Đóng",
              closeButtonAriaLabel: "Đóng",
              placeholderText: "Tìm kiếm tài liệu hoặc hỏi AI",
              placeholderTextAskAi: "Nhập câu hỏi khác...",
              placeholderTextAskAiStreaming: "Đang trả lời...",
              searchInputLabel: "Tìm kiếm",
              backToKeywordSearchButtonText: "Quay lại tìm kiếm từ khóa",
              backToKeywordSearchButtonAriaLabel: "Quay lại tìm kiếm từ khóa",
              newConversationPlaceholder: "Đặt câu hỏi",
              conversationHistoryTitle: "Lịch sử hội thoại của tôi",
              startNewConversationText: "Bắt đầu hội thoại mới",
              viewConversationHistoryText: "Lịch sử hội thoại",
              threadDepthErrorPlaceholder: "Đã đạt giới hạn hội thoại",
            },
            newConversation: {
              newConversationTitle: "Hôm nay tôi có thể giúp gì cho bạn?",
              newConversationDescription:
                "Tôi sẽ tìm kiếm trong tài liệu của bạn để nhanh chóng tìm thấy hướng dẫn cài đặt, chi tiết tính năng và mẹo xử lý sự cố.",
            },
            footer: {
              selectText: "Chọn",
              submitQuestionText: "Gửi câu hỏi",
              selectKeyAriaLabel: "Phím Enter",
              navigateText: "Điều hướng",
              navigateUpKeyAriaLabel: "Mũi tên lên",
              navigateDownKeyAriaLabel: "Mũi tên xuống",
              closeText: "Đóng",
              backToSearchText: "Quay lại tìm kiếm",
              closeKeyAriaLabel: "Phím Esc",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "Không thể tải kết quả",
              helpText: "Bạn có thể cần kiểm tra kết nối mạng.",
            },
            startScreen: {
              recentSearchesTitle: "Gần đây",
              noRecentSearchesText: "Không có tìm kiếm gần đây",
              saveRecentSearchButtonTitle: "Lưu tìm kiếm này",
              removeRecentSearchButtonTitle: "Xóa tìm kiếm này khỏi lịch sử",
              favoriteSearchesTitle: "Yêu thích",
              removeFavoriteSearchButtonTitle: "Xóa khỏi yêu thích",
              recentConversationsTitle: "Hội thoại gần đây",
              removeRecentConversationButtonTitle:
                "Xóa hội thoại này khỏi lịch sử",
            },
            noResultsScreen: {
              noResultsText: "Không tìm thấy kết quả liên quan",
              suggestedQueryText: "Hãy thử tìm kiếm",
              reportMissingResultsText: "Bạn nghĩ truy vấn này nên có kết quả?",
              reportMissingResultsLinkText: "Hãy cho chúng tôi biết.",
            },
            resultsScreen: {
              askAiPlaceholder: "Hỏi AI:",
              noResultsAskAiPlaceholder:
                "Không tìm thấy trong tài liệu? Hãy thử Ask AI:",
            },
            askAiScreen: {
              disclaimerText:
                "Câu trả lời do AI tạo ra, có thể có lỗi. Hãy kiểm tra.",
              relatedSourcesText: "Nguồn liên quan",
              thinkingText: "Đang suy nghĩ...",
              copyButtonText: "Sao chép",
              copyButtonCopiedText: "Đã sao chép!",
              copyButtonTitle: "Sao chép",
              likeButtonTitle: "Thích",
              dislikeButtonTitle: "Không thích",
              thanksForFeedbackText: "Cảm ơn phản hồi của bạn!",
              preToolCallText: "Đang tìm kiếm...",
              duringToolCallText: "Đang tìm kiếm...",
              afterToolCallText: "Đã tìm kiếm",
              stoppedStreamingText: "Bạn đã dừng phản hồi này",
              errorTitleText: "Lỗi trò chuyện",
              threadDepthExceededMessage:
                "Cuộc hội thoại này đã bị đóng để duy trì độ chính xác của câu trả lời.",
              startNewConversationButtonText: "Bắt đầu hội thoại mới",
            },
          },
        },
      },
    },
    outlineTitle: "Trên trang này",
    lastUpdatedText: "Cập nhật lần cuối",
    docFooter: {
      prev: "Bài trước",
      next: "Bài tiếp theo",
    },
    footer: {},
    editLink: {
      text: "Chỉnh sửa trang này trên GitHub",
    },
  },
})
