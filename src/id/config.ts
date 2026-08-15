import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "Alat online, alat gratis, permainan, permainan FC, permainan kecil, pemrosesan gambar, pemampatan gambar, konversi gambar, potongan gambar, pemrosesan PDF, PDF ke Word, PDF penggabungan, PDF pemampatan, pemrosesan video, pemampatan video, konversi video, Base64 pengkodean, pengkodean URL, konversi koordinat, pengunduhan ubin peta, menulis kata online, tes iframe, konversi audio WEM ke MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "Alat online, alat gratis, permainan, permainan FC, permainan kecil, pemrosesan gambar, pemampatan gambar, konversi gambar, potongan gambar, pemrosesan PDF, PDF ke Word, PDF penggabungan, PDF pemampatan, pemrosesan video, pemampatan video, konversi video, Base64 pengkodean, pengkodean URL, konversi koordinat, pengunduhan ubin peta, menulis kata online, tes iframe, konversi audio WEM ke MP3",
      },
    ],
  ],
  themeConfig: {
    nav: [
      {
        text: "Konversi format",
        items: [
          { text: "Konversi audio", link: "/id/web/convert/audio" },
        ],
      },
      {
        text: "Enkode / Dekode",
        items: [
          { text: "Base64 Enkode / Dekode", link: "/id/web/encode-decode/base64" },
          { text: "URL Enkode / Dekode", link: "/id/web/encode-decode/url" },
        ],
      },
      {
        text: "Alat teks",
        items: [
          { text: "Gabungkan / pisahkan beberapa baris", link: "/id/web/text-tools/multi-line-merge-split" },
          { text: "Teks ke gambar", link: "/id/web/text-tools/text-to-image" },
          { text: "Teks ke gambar", link: "/id/web/text-tools/text-to-image" },
          { text: "Teks ke gambar", link: "/id/web/text-tools/text-to-image" },
          { text: "Konverter Pinyin", link: "/id/web/text-tools/pinyin-conversion" },
          { text: "Konverter Sederhana-Tradisional", link: "/id/web/text-tools/simplified-traditional-conversion" },
          { text: "Konverter Huruf Besar/Kecil", link: "/id/web/text-tools/case-conversion" },
          { text: "Penghapus Baris Duplikat", link: "/id/web/text-tools/duplicate-removal" },
          { text: "Konverter Angka Romawi", link: "/id/web/text-tools/roman-numeral-conversion" },
          { text: "Konverter Jumlah ke Bahasa China", link: "/id/web/text-tools/uppercase-amount-conversion" },
          { text: "Estimasi Waktu Baca", link: "/id/web/text-tools/reading-time-estimation" },
          { text: "Konverter Lebar Penuh/Setengah", link: "/id/web/text-tools/full-width-half-width-conversion" },
          { text: "Statistik Kata Kunci", link: "/id/web/text-tools/keyword-statistics" },
          { text: "Koleksi Emoji", link: "/id/web/text-tools/emoji-all" },
          { text: "Penghitung Kata", link: "/id/web/text-tools/word-count" },
        ],
      },
      {
        text: "Tes perangkat keras",
        items: [
          { text: "Tes mikrofon", link: "/id/web/hardware-test/microphone-test" },
          { text: "Tes kamera", link: "/id/web/hardware-test/camera-test" },
          { text: "Tes suara", link: "/id/web/hardware-test/sound-test" },
          { text: "Tes keyboard", link: "/id/web/hardware-test/keyboard-test" },
          { text: "Tes pemutaran audio", link: "/id/web/hardware-test/audio-playback-test" },
          { text: "Tes gamepad", link: "/id/web/hardware-test/gamepad-test" },
          { text: "Tes mouse", link: "/id/web/hardware-test/mouse-test" },
          { text: "Tes layar sentuh", link: "/id/web/hardware-test/touch-screen-test" },
          { text: "Tes multi-sentuh", link: "/id/web/hardware-test/multi-touch-test" },
          { text: "Tes getar", link: "/id/web/hardware-test/vibration-test" },
          { text: "Tes giroskop", link: "/id/web/hardware-test/gyroscope-test" },
          { text: "Tes akselerometer", link: "/id/web/hardware-test/accelerometer-test" },
          { text: "Tes FPS", link: "/id/web/hardware-test/fps-test" },
          { text: "Tes piksel mati", link: "/id/web/hardware-test/screen-bad-point-test" },
          { text: "Tes resolusi", link: "/id/web/hardware-test/screen-resolution-test" },
        ],
      },
      {
        text: "Alat pengembang",
        items: [
          { text: "Konversi koordinat peta", link: "/id/web/dev-tools/map-coordinate-conversion" },
        ],
      },
      {
        text: "Permainan",
        items: [
          { text: "Game retro FC", link: "/pages/game" },
          { text: "Game klasik Java", link: "/pages/javaGames" },
          { text: "Game arcade", link: "/pages/arcade" },
        ],
      },
    ],
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
