import { defineConfig } from "vitepress"
import { resolve } from "path"
import { createWriteStream } from "fs"

import { SitemapStream } from "sitemap"

import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

import DefineOptions from "unplugin-vue-define-options/vite"
import vueJsx from "@vitejs/plugin-vue-jsx"

import {
  HTMLAndCSS,
  JavaScript,
  ES6,
  Server,
  Lib,
  Advanced,
  Vue2,
  Vue3,
  Nuxt3,
  React,
  Openlayers,
  Article,
} from "./catalog"

// sitemap 列表
const links: any[] = []

export default defineConfig({
  title: "web技术学习",
  lang: "zh-CN",
  description:
    "包含网址导航、软件分享、HTML、CSS、JavaScript、Vue、React、TypeScript、Node.js...",
  lastUpdated: true,
  outDir: "../kuangyx",
  head: [
    // 添加百度统计
    [
      "script",
      {},
      ` var _hmt = _hmt || [];
        (function() {
          var hm = window.document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?bb01df18792391bcc6952b8b90c01d65";
          var s = window.document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })(); `,
    ],

    // 谷歌广告
    [
      "script",
      {
        "data-ad-client": "ca-pub-6209757986574246",
        async: "true",
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
      },
    ],
    ["meta", { name: "author", content: "tomiaa" }],
    // 百度
    ["meta", { name: "baidu-site-verification", content: "code-ElgEHVfH7I" }],
    // bing
    [
      "meta",
      { name: "msvalidate.01", content: "CD018AF52A6B027E21ED65922BB7531B" },
    ],
    // google
    [
      "meta",
      {
        name: "google-site-verification",
        content: "71K63A-IgfOHue0ZSCuhCEOhkxYGXB2HW5KZFuSIWek",
      },
    ],
    // 360搜索
    [
      "meta",
      {
        name: "360-site-verification",
        content: "5793ea2cdf94fe6b6406a2a3be4f47cb",
      },
    ],
    // 搜狗搜索
    ["meta", { name: "sogou_site_verification", content: "bkRsJwWIDT" }],
    // 头条搜索
    [
      "meta",
      { name: "bytedance-verification-code", content: "V6p4dafViZcR06HOkbec" },
    ],
    // 神马搜索
    [
      "meta",
      {
        name: "shenma-site-verification",
        content: "700e42cfb66469435b9439ad1550b66b_1632495428",
      },
    ],

    [
      "meta",
      {
        name: "description",
        content:
          "Web前端，web，前端开发，html，css，JavaScript，vue，es6，nodejs，less，typescript，小程序，uniapp，网址导航，软件分享",
      },
    ],
    [
      "meta",
      {
        name: "keywords",
        content:
          "Web前端，web，前端开发，html，css，JavaScript，vue，es6，nodejs，less，typescript，小程序，uniapp，网址导航，软件分享",
      },
    ],
    // 移动端优化
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    ["meta", { "http-equiv": "X-UA-Compatible", content: "IE=edge" }],
    // 移动端优化
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0,user-scalable=no",
      },
    ],
  ],
  themeConfig: {
    // algolia: {
    //   appId: "FGZRHFTTSH",
    //   apiKey: "1995152b867b6ed3a2b75c50bc8e9c81",
    //   indexName: "kuangyx",
    // },
    outlineTitle: "此页目录",
    lastUpdatedText: "最后更新时间",
    outline: [2, 6],
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    footer: {
      message: '© <a href="https://kuangyx.cn">kuangyx.cn</a>2021',
      copyright:
        '<a href="https://beian.miit.gov.cn/#/Integrated/index">湘ICP备2021013371号</a>',
    },
    socialLinks: [{ icon: "github", link: "https://github.com/tomiaa12" }],
    editLink: {
      pattern: "https://github.com/tomiaa12/kyx/edit/main/vitepress/src/:path",
      text: "在 GitHub 编辑此页",
    },
    nav: [
      { text: "导航", link: "/pages/navigation" },
      { text: "软件", link: "/pages/software" },
      {
        text: "文章",
        items: Article,
      },
      {
        text: "基础",
        items: HTMLAndCSS,
      },
      {
        text: "JavaScript",
        items: JavaScript,
      },
      {
        text: "ES6",
        items: ES6,
      },
      {
        text: "服务端",
        items: Server,
      },
      {
        text: "库",
        items: Lib,
      },
      {
        text: "框架",
        items: [
          Vue2,
          Vue3,
          Nuxt3,
          React,
          Openlayers,
          {
            text: "openlayers 示例",
            items: [
              {
                text: "地图控件",
                link: "/docs/框架/openlayers示例/地图控件/导航控件",
              },
            ],
          },
        ],
      },
      {
        text: "进阶",
        items: Advanced,
      },
      {
        text: "关于",
        items: [{ text: "更新日志", link: "/docs/关于/更新日志" }],
      },
    ],
    sidebar: {
      "/docs/文章/": Article,

      "/docs/HTML/": HTMLAndCSS,

      "/docs/CSS/": HTMLAndCSS,

      "/docs/JavaScript/": JavaScript,

      "/docs/ES6/": ES6,

      "/docs/服务端/": Server,

      "/docs/库/": Lib,

      "/docs/框架/": [
        Vue2,
        Vue3,
        Nuxt3,
        React,
        Openlayers,
        {
          text: "openlayers示例",
          collapsible: true,
          items: [
            {
              text: "地图控件",
              items: [
                {
                  text: "导航控件",
                  link: "/docs/框架/openlayers示例/地图控件/导航控件",
                },
                {
                  text: "鼠标位置",
                  link: "/docs/框架/openlayers示例/地图控件/鼠标位置",
                },
                {
                  text: "比例尺",
                  link: "/docs/框架/openlayers示例/地图控件/比例尺",
                },
                {
                  text: "缩略图",
                  link: "/docs/框架/openlayers示例/地图控件/缩略图",
                },
                {
                  text: "图层切换",
                  link: "/docs/框架/openlayers示例/地图控件/图层切换",
                },
                {
                  text: "地图联动",
                  link: "/docs/框架/openlayers示例/地图控件/地图联动",
                },
              ],
            },
          ],
        },
      ],

      "/docs/进阶/": Advanced,
    },
  },
  transformHtml(code, id, { pageData }) {
    if (!/[\\/]404\.html$/.test(id))
      links.push({
        url: pageData.relativePath.replace(/((^|\/)index)?\.md$/, "$2"),
        lastmod: pageData.lastUpdated,
      })
  },
  buildEnd: ({ outDir }) => {
    const sitemap = new SitemapStream({ hostname: "https://kuangyx.cn/" })
    const writeStream = createWriteStream(resolve(outDir, "sitemap.xml"))
    sitemap.pipe(writeStream)
    links.forEach(link => sitemap.write(link))
    sitemap.end()
  },
  vite: {
    ssr: {
      noExternal: [
        "element-plus",
        "ol",
        "@tomiaa/vue3-components",
        "@wangeditor/editor-for-vue",
        "@wangeditor/editor/dist/css/style.css",
      ],
    },
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      DefineOptions(),
      vueJsx(),
    ],
    server: {
      host: "0.0.0.0",
      fs: {
        // 允许开发服务器访问父级文件夹
        allow: ["../../../"],
      },
    },
    resolve: {
      alias: {
        // 别名
        "@": resolve(__dirname, "../"),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      },
    },
    build: {
      chunkSizeWarningLimit: 3000,
    },
  },
})
