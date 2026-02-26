import { defineConfig, type DefaultTheme } from "vitepress"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

import vueJsx from "@vitejs/plugin-vue-jsx"
import svgLoader from "vite-svg-loader"

import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite"

export default defineConfig({
  title: "KYX Box",
  lastUpdated: true,
  outDir: "../kuangyx",
  // srcDir: "apps",
  rewrites: {
    "zh/:rest*": ":rest*",
    // 'apps/:lang/:rest*': ':lang/:rest*',
  },
  transformPageData(pageData) {
    const p = pageData.params
    if (p?.source && p?.target && p?.title) {
      pageData.title = p.title
      pageData.description = p.description
      pageData.frontmatter.head ??= []
      pageData.frontmatter.head.push(
        ["meta", { name: "description", content: p.description }],
        ["meta", { name: "keywords", content: p.keywords }],
        ["meta", { property: "og:title", content: p.title }],
        ["meta", { property: "og:description", content: p.description }]
      )
    }
  },
  head: [
    // Google Analytics
    [
      "script",
      {
        async: "true",
        src: "https://www.googletagmanager.com/gtag/js?id=G-1E60HGJXV1",
      },
    ],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-1E60HGJXV1');`,
    ],
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
    externalLinkIcon: true,
    search: {
      provider: "algolia",
      options: {
        appId: "1AS9BEA8JY",
        apiKey: "6564a713013f5f79664a8be62e7f3235",
        indexName: "kuangyx",
        askAi: {
          assistantId: "34RtOk3KOUKu",
          sidePanel: {
            panel: {
              side: "left",
              suggestedQuestions: true,
            },
          },
        },
      },
    },
    outline: [2, 6],
    footer: {
      message: '© <a href="https://kuangyx.cn">kuangyx.cn</a> @2021',
    },

    socialLinks: [{ icon: "github", link: "https://github.com/tomiaa12" }],
    editLink: {
      pattern: "https://github.com/tomiaa12/kyx/edit/main/src/:path",
    },
    nav: [],
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
      VueI18nPlugin({
        include: resolve(
          dirname(fileURLToPath(import.meta.url)),
          "../locales/**"
        ),
      }),
    ],
    server: {
      host: "0.0.0.0",
      // proxy: {
      //   "/api": 'http://localhost:3000'
      // }
    },
    resolve: {
      alias: (() => {
        const aliases = {
          "@": resolve(__dirname, "../"),
          "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
        }
        console.log("[alias]", aliases)
        return aliases
      })(),
    },
    build: {
      chunkSizeWarningLimit: 3000,
    },
  },
  locales: {
    root: {
      lang: "zh-CN",
      label: "简体中文", // 中文（简体）
    },
    en: {
      lang: "en",
      label: "English", // 英语
    },
    "zh-TW": {
      lang: "zh-TW",
      label: "繁體中文", // 中文（繁体）
    },
    ja: {
      lang: "ja",
      label: "日本語", // 日语
    },
    ko: {
      lang: "ko",
      label: "한국어", // 韩语
    },
    fr: {
      lang: "fr",
      label: "Français", // 法语
    },
    de: {
      lang: "de",
      label: "Deutsch", // 德语
    },
    es: {
      lang: "es",
      label: "Español", // 西班牙语
    },
    pt: {
      lang: "pt",
      label: "Português", // 葡萄牙语
    },
    ru: {
      lang: "ru",
      label: "Русский", // 俄语
    },
    ar: {
      lang: "ar",
      dir: "rtl",
      label: "العربية", // 阿拉伯语
    },
    hi: {
      lang: "hi",
      label: "हिन्दी", // 印地语
    },
    it: {
      lang: "it",
      label: "Italiano", // 意大利语
    },
    nl: {
      lang: "nl",
      label: "Nederlands", // 荷兰语
    },
    tr: {
      lang: "tr",
      label: "Türkçe", // 土耳其语
    },
    vi: {
      lang: "vi",
      label: "Tiếng Việt", // 越南语
    },
    th: {
      lang: "th",
      label: "ภาษาไทย", // 泰语
    },
    id: {
      lang: "id",
      label: "Bahasa Indonesia", // 印度尼西亚语
    },
    pl: {
      lang: "pl",
      label: "Polski", // 波兰语
    },
    sv: {
      lang: "sv",
      label: "Svenska", // 瑞典语
    },
  },
})
