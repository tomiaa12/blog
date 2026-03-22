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