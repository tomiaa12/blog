import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "Alat online, alat gratis, permainan, permainan FC, permainan kecil, pemrosesan gambar, pemampatan gambar, konversi gambar, potongan gambar, pemrosesan PDF, PDF ke Word, PDF penggabungan, PDF pemampatan, pemrosesan video, pemampatan video, konversi video, Base64 pengkodean, konversi koordinat, pengunduhan ubin peta, menulis kata online, tes iframe, konversi audio WEM ke MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "Alat online, alat gratis, permainan, permainan FC, permainan kecil, pemrosesan gambar, pemampatan gambar, konversi gambar, potongan gambar, pemrosesan PDF, PDF ke Word, PDF penggabungan, PDF pemampatan, pemrosesan video, pemampatan video, konversi video, Base64 pengkodean, konversi koordinat, pengunduhan ubin peta, menulis kata online, tes iframe, konversi audio WEM ke MP3",
      },
    ],
  ],
  themeConfig: {
    returnToTopLabel: "Kembali ke atas",
    sidebarMenuLabel: "Daftar Isi",
    darkModeSwitchLabel: "Ganti mode",
    lightModeSwitchTitle: "Beralih ke mode terang",
    darkModeSwitchTitle: "Beralih ke mode gelap",
    notFound: {
      title: "Halaman tidak ditemukan",
      quote: "Halaman tidak ada, harap periksa URL.",
      linkLabel: "Kembali ke beranda",
      linkText: "Kembali ke beranda",
    },
    search: {
      options: {
        placeholder: "Cari dokumentasi",
        askAi: {
          sidePanel: {
            button: {
              translations: {
                buttonText: "Tanya AI",
                buttonAriaLabel: "Tanya AI",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "Tanya AI",
                  conversationHistoryTitle: "Riwayat percakapan saya",
                  newConversationText: "Mulai percakapan baru",
                  viewConversationHistoryText: "Riwayat percakapan",
                },
                promptForm: {
                  promptPlaceholderText: "Ajukan pertanyaan",
                  promptAnsweringText: "Sedang menjawab...",
                  promptAskAnotherQuestionText: "Ajukan pertanyaan lain",
                  promptDisclaimerText:
                    "Jawaban dihasilkan oleh AI, mungkin mengandung kesalahan.",
                  promptLabelText:
                    "Enter untuk mengirim, Shift+Enter untuk baris baru.",
                  promptAriaLabelText: "Input pertanyaan",
                },
                conversationScreen: {
                  preToolCallText: "Mencari...",
                  searchingText: "Mencari...",
                  toolCallResultText: "Pencarian selesai",
                  conversationDisclaimer:
                    "Jawaban dihasilkan oleh AI, mungkin mengandung kesalahan. Periksa.",
                  reasoningText: "Memproses...",
                  thinkingText: "Berpikir...",
                  relatedSourcesText: "Sumber terkait",
                  stoppedStreamingText: "Anda menghentikan respons ini",
                  copyButtonText: "Salin",
                  copyButtonCopiedText: "Disalin!",
                  likeButtonTitle: "Suka",
                  dislikeButtonTitle: "Tidak suka",
                  thanksForFeedbackText: "Terima kasih atas masukan Anda!",
                  errorTitleText: "Kesalahan obrolan",
                },
                newConversationScreen: {
                  titleText: "Bagaimana saya bisa membantu Anda hari ini?",
                  introductionText:
                    "Saya akan mencari di dokumentasi Anda untuk menemukan panduan penyiapan, detail fitur, dan tips pemecahan masalah dengan cepat.",
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
            buttonText: "Cari",
            buttonAriaLabel: "Cari",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "Hapus",
              clearButtonAriaLabel: "Hapus pencarian",
              closeButtonText: "Tutup",
              closeButtonAriaLabel: "Tutup",
              placeholderText: "Cari dokumentasi atau tanya AI",
              placeholderTextAskAi: "Masukkan pertanyaan lain...",
              placeholderTextAskAiStreaming: "Sedang menjawab...",
              searchInputLabel: "Cari",
              backToKeywordSearchButtonText: "Kembali ke pencarian kata kunci",
              backToKeywordSearchButtonAriaLabel:
                "Kembali ke pencarian kata kunci",
              newConversationPlaceholder: "Ajukan pertanyaan",
              conversationHistoryTitle: "Riwayat percakapan saya",
              startNewConversationText: "Mulai percakapan baru",
              viewConversationHistoryText: "Riwayat percakapan",
              threadDepthErrorPlaceholder: "Batas percakapan tercapai",
            },
            newConversation: {
              newConversationTitle:
                "Bagaimana saya bisa membantu Anda hari ini?",
              newConversationDescription:
                "Saya akan mencari di dokumentasi Anda untuk menemukan panduan penyiapan, detail fitur, dan tips pemecahan masalah dengan cepat.",
            },
            footer: {
              selectText: "Pilih",
              submitQuestionText: "Kirim pertanyaan",
              selectKeyAriaLabel: "Tombol Enter",
              navigateText: "Navigasi",
              navigateUpKeyAriaLabel: "Panah atas",
              navigateDownKeyAriaLabel: "Panah bawah",
              closeText: "Tutup",
              backToSearchText: "Kembali ke pencarian",
              closeKeyAriaLabel: "Tombol Esc",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "Tidak dapat mengambil hasil",
              helpText: "Anda mungkin perlu memeriksa koneksi jaringan Anda.",
            },
            startScreen: {
              recentSearchesTitle: "Terbaru",
              noRecentSearchesText: "Tidak ada pencarian terbaru",
              saveRecentSearchButtonTitle: "Simpan pencarian ini",
              removeRecentSearchButtonTitle: "Hapus pencarian ini dari riwayat",
              favoriteSearchesTitle: "Favorit",
              removeFavoriteSearchButtonTitle: "Hapus dari favorit",
              recentConversationsTitle: "Percakapan terbaru",
              removeRecentConversationButtonTitle:
                "Hapus percakapan ini dari riwayat",
            },
            noResultsScreen: {
              noResultsText: "Tidak ditemukan hasil yang relevan",
              suggestedQueryText: "Coba cari",
              reportMissingResultsText:
                "Apakah Anda pikir kueri ini seharusnya memiliki hasil?",
              reportMissingResultsLinkText: "Beritahu kami.",
            },
            resultsScreen: {
              askAiPlaceholder: "Tanya AI:",
              noResultsAskAiPlaceholder:
                "Tidak ditemukan di dokumen? Coba Ask AI:",
            },
            askAiScreen: {
              disclaimerText:
                "Jawaban dihasilkan oleh AI, mungkin mengandung kesalahan. Periksa.",
              relatedSourcesText: "Sumber terkait",
              thinkingText: "Berpikir...",
              copyButtonText: "Salin",
              copyButtonCopiedText: "Disalin!",
              copyButtonTitle: "Salin",
              likeButtonTitle: "Suka",
              dislikeButtonTitle: "Tidak suka",
              thanksForFeedbackText: "Terima kasih atas masukan Anda!",
              preToolCallText: "Mencari...",
              duringToolCallText: "Mencari...",
              afterToolCallText: "Pencarian selesai",
              stoppedStreamingText: "Anda menghentikan respons ini",
              errorTitleText: "Kesalahan obrolan",
              threadDepthExceededMessage:
                "Percakapan ini ditutup untuk menjaga akurasi jawaban.",
              startNewConversationButtonText: "Mulai percakapan baru",
            },
          },
        },
      },
    },
    outlineTitle: "Di halaman ini",
    lastUpdatedText: "Terakhir diperbarui",
    docFooter: {
      prev: "Sebelumnya",
      next: "Berikutnya",
    },
    footer: {},
    editLink: {
      text: "Edit halaman ini di GitHub",
    },
  },
})
