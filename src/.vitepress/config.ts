import { defineConfig, type DefaultTheme } from "vitepress"
import { resolve } from "path"

import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

import vueJsx from "@vitejs/plugin-vue-jsx"
import svgLoader from "vite-svg-loader"

import {
  HTMLAndCSS,
  JavaScript,
  ES6,
  Server,
  Lib,
  Advanced,
  Frame,
  Article,
  OnLineApp,
} from "./catalog"

const generateNav = (arr: DefaultTheme.SidebarItem[]) =>
  arr.map(i => ({
    ...i,
    items: i.items?.map(i => ({
      ...i,
      link: Array.isArray(i.items) ? i.items[0].link : i.link,
    })),
  })) as (DefaultTheme.NavItemChildren | DefaultTheme.NavItemWithLink)[]

export default defineConfig({
  title: "web技术学习",
  lang: "zh-CN",
  description:
    "包含网址导航、软件分享、HTML、CSS、JavaScript、Vue、React、TypeScript、Node.js...",
  lastUpdated: true,
  outDir: "../kuangyx",
  head: [
    // vercel CSP 网络分析
    // [
    //   "meta",
    //   {
    //     "http-equiv": "Content-Security-Policy",
    //     content: "script-src 'unsafe-inline' vitals.vercel-insights.com",
    //   },
    // ],

    // 在 Chrome 85 版本中，为了保护用户的隐私，默认的 Referrer Policy 则变成了 strict-origin-when-cross-origin
    // 所以必须加入此部分代码，否则文章统计访问量的数据则不正确
    ["meta", { name: "referrer", content: "no-referrer-when-downgrade" }],
    // 添加百度统计
    [
      "script",
      {},
      ` var _hmt = _hmt || [];
        (function() {
          if(location.hostname === 'localhost') return;
          var hm = window.document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?bb01df18792391bcc6952b8b90c01d65";
          var s = window.document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })(); `,
    ],

    // [
    //   "script",
    //   {
    //     src: "https://giscus.app/client.js",
    //     async: "true",
    //     "data-repo": "tomiaa12/blogComments",
    //     "data-repo-id": "R_kgDONlUJAw",
    //     "data-category": "BlogComments",
    //     "data-category-id": "DIC_kwDONlUJA84ClsSx",
    //     "data-mapping": "pathname",
    //     "data-strict": "0",
    //     "data-reactions-enabled": "1",
    //     "data-emit-metadata": "0",
    //     "data-input-position": "top",
    //     "data-theme": "preferred_color_scheme",
    //     "data-lang": "zh-CN",
    //     "data-loading": "lazy",
    //     "crossorigin": "anonymous",
    //   },
    // ],

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
    returnToTopLabel: "返回顶部",
    sidebarMenuLabel: "目录",
    darkModeSwitchLabel: "切换模式",
    externalLinkIcon: true,
    lightModeSwitchTitle: "切换到浅色",
    darkModeSwitchTitle: "切换到深色",
    search: {
      provider: "algolia",
      options: {
        appId: "1AS9BEA8JY",
        apiKey: "6564a713013f5f79664a8be62e7f3235",
        indexName: "kuangyx",
        placeholder: "搜索文档",
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            searchBox: {
              resetButtonTitle: "清除查询条件",
              resetButtonAriaLabel: "清除查询条件",
              cancelButtonText: "取消",
              cancelButtonAriaLabel: "取消",
            },
            startScreen: {
              recentSearchesTitle: "搜索历史",
              noRecentSearchesText: "没有搜索历史",
              saveRecentSearchButtonTitle: "保存至搜索历史",
              removeRecentSearchButtonTitle: "从搜索历史中移除",
              favoriteSearchesTitle: "收藏",
              removeFavoriteSearchButtonTitle: "从收藏中移除",
            },
            errorScreen: {
              titleText: "无法获取结果",
              helpText: "你可能需要检查你的网络连接",
            },
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
              searchByText: "搜索提供者",
            },
            noResultsScreen: {
              noResultsText: "无法找到相关结果",
              suggestedQueryText: "你可以尝试查询",
              reportMissingResultsText: "你认为该查询应该有结果？",
              reportMissingResultsLinkText: "点击反馈",
            },
          },
        },
      },
    },
    outlineTitle: "此页目录",
    lastUpdatedText: "最后更新时间",
    outline: [2, 6],
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    footer: {
      message: '© <a href="https://kuangyx.cn">kuangyx.cn</a> @2021',
      copyright:
        '<a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">湘ICP备2024094445号</a>',
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/tomiaa12" },
      {
        icon: {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><title>Gitee</title><path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296z"/></svg>`,
        },
        link: "https://gitee.com/tomiaa",
      },
    ],
    editLink: {
      pattern: "https://github.com/tomiaa12/kyx/edit/main/src/:path",
      text: "在 GitHub 编辑此页",
    },
    nav: [
      { text: "导航", link: "/pages/navigation" },
      { text: "软件", link: "/pages/software" },
      { text: "游戏", link: "/pages/game" },
      // { text: "GPT", link: "/pages/chatGPT" },
      { text: "在线应用", items: OnLineApp },
      {
        text: "文章",
        items: generateNav(Article),
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
        items: generateNav(Frame),
      },
      {
        text: "进阶",
        items: generateNav(Advanced),
      },
      {
        text: "关于",
        items: [
          { text: "更新日志", link: "/docs/关于/更新日志" },
          { text: "支持我", link: "/docs/关于/支持我" },
          { text: "交流群", link: "/docs/关于/交流群" },
          { text: "我的云盘", link: "/docs/关于/我的云盘" },
        ],
      },
    ],
    sidebar: {
      "/docs/在线应用/": OnLineApp,

      "/docs/文章/": Article,

      "/docs/HTML/": HTMLAndCSS,

      "/docs/CSS/": HTMLAndCSS,

      "/docs/JavaScript/": JavaScript,

      "/docs/ES6/": ES6,

      "/docs/服务端/": Server,

      "/docs/库/": Lib,

      "/docs/框架/": Frame,

      "/docs/进阶/": Advanced,
    },
  },
  sitemap: {
    hostname: "https://kuangyx.cn/",
  },
  markdown: {
    image: {
      lazyLoading: true,
    },
  },
  vite: {
    optimizeDeps: {
      include: [
        "element-plus",
        "ol",
        "@tomiaa/vue3-components",
        "@tomiaa/live2d",
        "@tomiaa/comment",
        "@tomiaa/hitokoto",
        "@tomiaa/utils",
        "@tomiaa/canvas-graffiti",
        "@tomiaa/latex-template",
        "@wangeditor/editor-for-vue",
        // "@wangeditor/editor/dist/css/style.css",
        "three",
        "dat.gui",
      ],
    },
    ssr: {
      noExternal: [
        "element-plus",
        "ol",
        "@tomiaa/vue3-components",
        "@tomiaa/live2d",
        "@tomiaa/comment",
        "@tomiaa/hitokoto",
        "@tomiaa/utils",
        "@tomiaa/canvas-graffiti",
        "@tomiaa/latex-template",
        "@wangeditor/editor-for-vue",
        "@wangeditor/editor/dist/css/style.css",
        "three",
        "dat.gui",
      ],
    },
    plugins: [
      svgLoader(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      vueJsx(),
    ],
    server: {
      host: "0.0.0.0",
      // proxy: {
      //   "/api": 'http://localhost:3000'
      // }
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
