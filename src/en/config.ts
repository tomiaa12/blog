import { defineAdditionalConfig } from 'vitepress'

export default defineAdditionalConfig({
  description: "Online tools, free tools, games, FC games, small games, image processing, image compression, image conversion, image cropping, PDF processing, PDF to Word, PDF merge, PDF compression, video processing, video compression, video conversion, Base64 encoding, URL encoding, coordinate conversion, map tile download, online word writing, iframe test, WEM audio conversion MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content: "Online tools, free tools, games, FC games, small games, image processing, image compression, image conversion, image cropping, PDF processing, PDF to Word, PDF merge, PDF compression, video processing, video compression, video conversion, Base64 encoding, URL encoding, coordinate conversion, map tile download, online word writing, iframe test, WEM audio conversion MP3",
      },
    ],
  ],
  themeConfig: {
    nav: [
      {
        text: "Format Conversion",
        items: [
          { text: "Audio Conversion", link: "/en/web/convert/audio" },
        ],
      },
      {
        text: "Encode / Decode",
        items: [
          { text: "Base64 Encode / Decode", link: "/en/web/encode-decode/base64" },
          { text: "URL Encode / Decode", link: "/en/web/encode-decode/url" },
        ],
      },
      {
        text: "Text Tools",
        items: [
          { text: "Multi-line Merge / Split", link: "/en/web/text-tools/multi-line-merge-split" },
          { text: "Pinyin Converter", link: "/en/web/text-tools/pinyin-conversion" },
          { text: "Simplified-Traditional Converter", link: "/en/web/text-tools/simplified-traditional-conversion" },
          { text: "Case Converter", link: "/en/web/text-tools/case-conversion" },
          { text: "Duplicate Line Remover", link: "/en/web/text-tools/duplicate-removal" },
          { text: "Roman Numeral Converter", link: "/en/web/text-tools/roman-numeral-conversion" },
          { text: "Chinese Financial Amount Converter", link: "/en/web/text-tools/uppercase-amount-conversion" },
          { text: "Reading Time Estimator", link: "/en/web/text-tools/reading-time-estimation" },
          { text: "Full-Width / Half-Width Converter", link: "/en/web/text-tools/full-width-half-width-conversion" },
          { text: "Word Count", link: "/en/web/text-tools/word-count" },
        ],
      },
      {
        text: "Developer Tools",
        items: [
          { text: "Map Coordinate Conversion", link: "/en/web/dev-tools/map-coordinate-conversion" },
        ],
      },
      {
        text: "Games",
        items: [
          { text: "NES Retro Games", link: "/pages/game" },
          { text: "Java Classic Games", link: "/pages/javaGames" },
        ],
      },
    ],
  }
})