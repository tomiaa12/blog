import { defineAdditionalConfig } from 'vitepress'

export default defineAdditionalConfig({
  description: "Online tools, free tools, games, FC games, small games, image processing, image compression, image conversion, image cropping, PDF processing, PDF to Word, PDF merge, PDF compression, video processing, video compression, video conversion, Base64 encoding, coordinate conversion, map tile download, online word writing, iframe test, WEM audio conversion MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content: "Online tools, free tools, games, FC games, small games, image processing, image compression, image conversion, image cropping, PDF processing, PDF to Word, PDF merge, PDF compression, video processing, video compression, video conversion, Base64 encoding, coordinate conversion, map tile download, online word writing, iframe test, WEM audio conversion MP3",
      },
    ],
  ],
  themeConfig: {
    nav: [
      {
        text: "Format Conversion",
        items: [
          { text: "Audio Conversion", link: "/web/convert/audio" },
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