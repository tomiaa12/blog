import { defineConfig, type DefaultTheme } from "vitepress"
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

import vueJsx from "@vitejs/plugin-vue-jsx"
import svgLoader from "vite-svg-loader"

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig({
  title: "KYX Box",
  lastUpdated: true,
  outDir: "../kuangyx",
  srcExclude: ["**/vscodeExtension/**"],
  rewrites: {
    'apps/zh/:rest*': ':rest*',
    'apps/:lang/:rest*': ':lang/:rest*',
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
              side: 'left',
              suggestedQuestions: true,
            }
          }
        },
      }
    },
    outline: [2, 6],
    footer: {
      message: '© <a href="https://kuangyx.cn">kuangyx.cn</a> @2021',
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/tomiaa12" },
    ],
    editLink: {
      pattern: "https://github.com/tomiaa12/kyx/edit/main/src/:path",
    },
    nav: [
    ]
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
        include: resolve(dirname(fileURLToPath(import.meta.url)), "../locales/**"),
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
        console.log('[alias]', aliases)
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
      description: "在线工具，免费工具，游戏，FC游戏，小游戏，图片处理，图片压缩，图片转换，图片裁剪，PDF处理，PDF转Word，PDF合并，PDF压缩，视频处理，视频压缩，视频转换，Base64编解码，坐标转换，地图瓦片下载，在线默写单词，iframe测试，WEM音频转换MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "在线工具，免费工具，游戏，FC游戏，小游戏，图片处理，图片压缩，图片转换，图片裁剪，PDF处理，PDF转Word，PDF合并，PDF压缩，视频处理，视频压缩，视频转换，Base64编解码，坐标转换，地图瓦片下载，在线默写单词，iframe测试，WEM音频转换MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "返回顶部",
        sidebarMenuLabel: "目录",
        darkModeSwitchLabel: "切换模式",
        lightModeSwitchTitle: "切换到浅色",
        darkModeSwitchTitle: "切换到深色",
        notFound: {
          title: "页面不存在",
          quote: "页面不存在，请检查URL是否正确。",
          linkLabel: "返回首页",
          linkText: "返回首页",
        },
        search: {
          options: {
            placeholder: "搜索文档",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: '询问 AI',
                    buttonAriaLabel: '询问 AI'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: '询问 AI',
                      conversationHistoryTitle: '我的对话历史',
                      newConversationText: '开始新的对话',
                      viewConversationHistoryText: '对话历史'
                    },
                    promptForm: {
                      promptPlaceholderText: '提问',
                      promptAnsweringText: '正在回答...',
                      promptAskAnotherQuestionText: '再问一个问题',
                      promptDisclaimerText: '回答由 AI 生成，可能会出错。',
                      promptLabelText: '按回车发送，Shift+回车换行。',
                      promptAriaLabelText: '问题输入'
                    },
                    conversationScreen: {
                      preToolCallText: '搜索中...',
                      searchingText: '搜索中...',
                      toolCallResultText: '已搜索',
                      conversationDisclaimer:
                        '回答由 AI 生成，可能会出错。请核实。',
                      reasoningText: '推理中...',
                      thinkingText: '思考中...',
                      relatedSourcesText: '相关来源',
                      stoppedStreamingText: '你已停止此回复',
                      copyButtonText: '复制',
                      copyButtonCopiedText: '已复制！',
                      likeButtonTitle: '喜欢',
                      dislikeButtonTitle: '不喜欢',
                      thanksForFeedbackText: '感谢你的反馈！',
                      errorTitleText: '聊天错误'
                    },
                    newConversationScreen: {
                      titleText: '我今天能帮你什么？',
                      introductionText:
                        '我会搜索你的文档，快速帮你找到设置指南、功能细节和故障排除提示。'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: '清除',
                  clearButtonAriaLabel: '清除查询',
                  closeButtonText: '关闭',
                  closeButtonAriaLabel: '关闭',
                  placeholderText: '搜索文档或向 AI 提问',
                  placeholderTextAskAi: '再问一个问题...',
                  placeholderTextAskAiStreaming: '正在回答...',
                  searchInputLabel: '搜索',
                  backToKeywordSearchButtonText: '返回关键词搜索',
                  backToKeywordSearchButtonAriaLabel: '返回关键词搜索',
                  newConversationPlaceholder: '提问',
                  conversationHistoryTitle: '我的对话历史',
                  startNewConversationText: '开始新的对话',
                  viewConversationHistoryText: '对话历史',
                  threadDepthErrorPlaceholder: '对话已达上限'
                },
                newConversation: {
                  newConversationTitle: '我今天能帮你什么？',
                  newConversationDescription:
                    '我会搜索你的文档，快速帮你找到设置指南、功能细节和故障排除提示。'
                },
                footer: {
                  selectText: '选择',
                  submitQuestionText: '提交问题',
                  selectKeyAriaLabel: '回车键',
                  navigateText: '导航',
                  navigateUpKeyAriaLabel: '向上箭头',
                  navigateDownKeyAriaLabel: '向下箭头',
                  closeText: '关闭',
                  backToSearchText: '返回搜索',
                  closeKeyAriaLabel: 'Esc 键',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: '无法获取结果',
                  helpText: '你可能需要检查网络连接。'
                },
                startScreen: {
                  recentSearchesTitle: '最近',
                  noRecentSearchesText: '暂无最近搜索',
                  saveRecentSearchButtonTitle: '保存此搜索',
                  removeRecentSearchButtonTitle: '从历史记录中移除此搜索',
                  favoriteSearchesTitle: '收藏',
                  removeFavoriteSearchButtonTitle: '从收藏中移除此搜索',
                  recentConversationsTitle: '最近对话',
                  removeRecentConversationButtonTitle: '从历史记录中移除此对话'
                },
                noResultsScreen: {
                  noResultsText: '未找到相关结果',
                  suggestedQueryText: '尝试搜索',
                  reportMissingResultsText: '认为此查询应该有结果？',
                  reportMissingResultsLinkText: '告诉我们。'
                },
                resultsScreen: {
                  askAiPlaceholder: '询问 AI：',
                  noResultsAskAiPlaceholder: '文档里没找到？让 Ask AI 帮忙：'
                },
                askAiScreen: {
                  disclaimerText: '回答由 AI 生成，可能会出错。请核实。',
                  relatedSourcesText: '相关来源',
                  thinkingText: '思考中...',
                  copyButtonText: '复制',
                  copyButtonCopiedText: '已复制！',
                  copyButtonTitle: '复制',
                  likeButtonTitle: '喜欢',
                  dislikeButtonTitle: '不喜欢',
                  thanksForFeedbackText: '感谢你的反馈！',
                  preToolCallText: '搜索中...',
                  duringToolCallText: '搜索中...',
                  afterToolCallText: '已搜索',
                  stoppedStreamingText: '你已停止此回复',
                  errorTitleText: '聊天错误',
                  threadDepthExceededMessage: '为保持回答准确，此对话已关闭。',
                  startNewConversationButtonText: '开始新的对话'
                }
              }
            },
          },
        },
        outlineTitle: "此页目录",
        lastUpdatedText: "最后更新时间",
        docFooter: {
          prev: "上一篇",
          next: "下一篇",
        },
        footer: {
          // copyright:
          //   '<a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">湘ICP备2024094445号</a>',
        },
        editLink: {
          text: "在 GitHub 编辑此页",
        },
        nav: [
          {
            text: "笔记", items: [
              { text: "导航", link: "/pages/navigation" },
              { text: "软件", link: "/pages/software" },
              {
                text: "游戏", items: [
                  { text: "FC 童年小霸王", link: "/pages/game" },
                  { text: "Java 经典游戏", link: "/pages/javaGames" },
                  // { text: "GTA VC 侠盗飞车 罪恶都市", link: "https://gtavc.kuangyx.cn" },
                ]
              },
              // { text: "GPT", link: "/pages/chatGPT" },
              {
                text: "在线应用", items: [
                  // {
                  //   text: "小游戏",
                  //   collapsed: true,
                  //   items: [
                  //     { text: "鸡乐盒", link: "/docs/在线应用/小游戏/鸡乐盒" },
                  //     { text: "猜英雄联盟", link: "/docs/在线应用/小游戏/猜英雄联盟" },
                  //     { text: "猜电影", link: "/docs/在线应用/小游戏/猜电影" },
                  //     { text: "猜奥特曼", link: "/docs/在线应用/小游戏/猜奥特曼" },
                  //     { text: "猜音乐", link: "/docs/在线应用/小游戏/猜音乐" },
                  //     { text: "js问题测验", link: "/docs/在线应用/小游戏/js问题测验" },
                  //     { text: "二次元浓度测试", link: "/docs/在线应用/小游戏/二次元浓度测试" },
                  //     { text: "一言", link: "/docs/在线应用/小游戏/一言" },
                  //     { text: "一句", link: "/docs/在线应用/小游戏/一句" },
                  //     { text: "早报", link: "/docs/在线应用/小游戏/早报" },
                  //     { text: "彩虹屁", link: "/docs/在线应用/小游戏/彩虹屁" },
                  //     { text: "毒鸡汤", link: "/docs/在线应用/小游戏/毒鸡汤" },
                  //     { text: "舔狗日记", link: "/docs/在线应用/小游戏/舔狗日记" },
                  //     { text: "网易云热评", link: "/docs/在线应用/小游戏/网易云热评" },
                  //     { text: "人生倒计时", link: "/docs/在线应用/小游戏/人生倒计时" },
                  //     { text: "历史上的今天", link: "/docs/在线应用/小游戏/历史上的今天" },
                  //     { text: "动漫里那些可爱女主", link: "/docs/在线应用/小游戏/动漫里那些可爱女主" },
                  //   ],
                  // },
                  {
                    text: "工具",
                    items: [
                      { text: "在线默写单词", link: "/docs/在线应用/工具/在线默写单词" },
                      { text: "鸡乐盒", link: "/docs/在线应用/小游戏/鸡乐盒" },
                      { text: "坐标转换", link: "/docs/在线应用/工具/坐标转换" },
                      { text: "Base64 编解码", link: "/docs/在线应用/工具/Base64编解码" },
                      // { text: "steam 喜加一", link: "/docs/在线应用/工具/steam喜加一" },
                      // { text: "IP 归属地", link: "/docs/在线应用/工具/IP归属地" },
                      { text: "百度地图瓦片下载", link: "/docs/在线应用/工具/百度地图瓦片下载" },
                      { text: "在线 iframe 测试", link: "/docs/在线应用/工具/在线iframe测试" },
                    ]
                  }
                ]
              },
              {
                text: "推荐文章",
                items: [
                  { text: "资源收集", link: "/docs/资源收集/介绍" },
                  {
                    text: "JS 库",
                    link: "/docs/文章/JS Lib/百度地图，高德地图，腾讯地图，天地图等坐标互转",
                  },
                  { text: "Vue3 业务组件", link: "/docs/文章/vue3组件/快速上手" },
                  { text: "前端文章", link: "/docs/文章/前端/音频频谱" },
                  {
                    text: "技术教程",
                    link: "/docs/文章/技术教程/v2rarN搭配SwitchyOmega自动代理",
                  },
                ],
              },
              {
                text: "前端",
                items: [
                  { text: "Pixi.js", link: "/docs/框架/pixi.js/基本图形绘制" },
                  { text: "Openlayers", link: "/docs/框架/openlayers示例/地图控件/导航控件" },
                  { text: "Cesium", link: "/docs/进阶/Cesium/基础配置" },
                  { text: "Flutter", link: "/docs/进阶/Flutter/01-Flutter" },
                  {
                    text: "TypeScript",
                    link: "/docs/进阶/TypeScript/安装配置",
                  },
                  {
                    text: "Three.js",
                    link: "/docs/进阶/Three.js/01渲染一个场景和物体",
                  }
                ],
              },
              {
                text: "服务端",
                items: [
                  { text: "Python", link: "/docs/服务端/Python/01-初识" },
                  { text: "Java", link: "/docs/服务端/java/01-初识" },
                  { text: "C 语言", link: "/docs/服务端/C语言/概述" },
                  { text: "部署", link: "/docs/服务端/部署/docker" },
                  { text: "Node.js", link: "/docs/服务端/Node.js/模块引入" },
                  { text: "MySql", link: "/docs/服务端/MySql" },
                ],
              },
              {
                text: "其他",
                items: [
                  { text: "面试", link: "/docs/关于/面试" },
                  // { text: "我的云盘", link: "/docs/关于/我的云盘" },
                  { text: "英语", link: "/docs/English/主语" },
                ],
              },
              {
                text: "关于",
                items: [
                  { text: "更新日志", link: "/docs/关于/更新日志" },
                  { text: "支持我", link: "/docs/关于/支持我" },
                  // { text: "交流群", link: "/docs/关于/交流群" },
                ],
              },
            ]
          },
        ],
        sidebar: {
          "/docs/资源收集/": [
            { text: "介绍", link: "/docs/资源收集/介绍" },

            {
              text: "前端资源收集",
              collapsed: true,
              items: [
                { text: "UI库", link: "/docs/资源收集/前端资源收集/UI库" },
                { text: "后台管理模板", link: "/docs/资源收集/前端资源收集/后台管理模板" },
                { text: "富文本", link: "/docs/资源收集/前端资源收集/富文本" },
                { text: "Markdown", link: "/docs/资源收集/前端资源收集/Markdown" },
                { text: "文件上传", link: "/docs/资源收集/前端资源收集/文件上传" },
                { text: "图片", link: "/docs/资源收集/前端资源收集/图片" },
                { text: "音视频", link: "/docs/资源收集/前端资源收集/音视频" },
                { text: "图标", link: "/docs/资源收集/前端资源收集/图标" },
                { text: "图表", link: "/docs/资源收集/前端资源收集/图表" },
                { text: "拖拽", link: "/docs/资源收集/前端资源收集/拖拽" },
                { text: "文件", link: "/docs/资源收集/前端资源收集/文件" },
                { text: "动画", link: "/docs/资源收集/前端资源收集/动画" },
                { text: "地图/GIS", link: "/docs/资源收集/前端资源收集/地图" },
              ],
            },
          ],

          "/docs/在线应用/": [
            // {
            //   text: "小游戏",
            //   collapsed: true,
            //   items: [
            //     { text: "鸡乐盒", link: "/docs/在线应用/小游戏/鸡乐盒" },
            //     { text: "猜英雄联盟", link: "/docs/在线应用/小游戏/猜英雄联盟" },
            //     { text: "猜电影", link: "/docs/在线应用/小游戏/猜电影" },
            //     { text: "猜奥特曼", link: "/docs/在线应用/小游戏/猜奥特曼" },
            //     { text: "猜音乐", link: "/docs/在线应用/小游戏/猜音乐" },
            //     { text: "js问题测验", link: "/docs/在线应用/小游戏/js问题测验" },
            //     { text: "二次元浓度测试", link: "/docs/在线应用/小游戏/二次元浓度测试" },
            //     { text: "一言", link: "/docs/在线应用/小游戏/一言" },
            //     { text: "一句", link: "/docs/在线应用/小游戏/一句" },
            //     { text: "早报", link: "/docs/在线应用/小游戏/早报" },
            //     { text: "彩虹屁", link: "/docs/在线应用/小游戏/彩虹屁" },
            //     { text: "毒鸡汤", link: "/docs/在线应用/小游戏/毒鸡汤" },
            //     { text: "舔狗日记", link: "/docs/在线应用/小游戏/舔狗日记" },
            //     { text: "网易云热评", link: "/docs/在线应用/小游戏/网易云热评" },
            //     { text: "人生倒计时", link: "/docs/在线应用/小游戏/人生倒计时" },
            //     { text: "历史上的今天", link: "/docs/在线应用/小游戏/历史上的今天" },
            //     { text: "动漫里那些可爱女主", link: "/docs/在线应用/小游戏/动漫里那些可爱女主" },
            //   ],
            // },
            {
              text: "工具",
              collapsed: true,
              items: [
                { text: "在线默写单词", link: "/docs/在线应用/工具/在线默写单词" },
                { text: "鸡乐盒", link: "/docs/在线应用/小游戏/鸡乐盒" },
                { text: "坐标转换", link: "/docs/在线应用/工具/坐标转换" },
                { text: "Base64 编解码", link: "/docs/在线应用/工具/Base64编解码" },
                // { text: "steam 喜加一", link: "/docs/在线应用/工具/steam喜加一" },
                // { text: "IP 归属地", link: "/docs/在线应用/工具/IP归属地" },
                { text: "百度地图瓦片下载", link: "/docs/在线应用/工具/百度地图瓦片下载" },
                { text: "在线 iframe 测试", link: "/docs/在线应用/工具/在线iframe测试" },
              ]
            }
          ],

          "/docs/文章/": [
            {
              text: "JS 库",
              collapsed: true,
              items: [
                {
                  text: "地图坐标互转",
                  link: "/docs/文章/JS Lib/百度地图，高德地图，腾讯地图，天地图等坐标互转",
                },
                {
                  text: "Latex 公式模板",
                  link: "/docs/文章/JS Lib/Latex公式录入模板",
                },
                { text: "Live2d", link: "/docs/文章/JS Lib/Live2d" },
                { text: "hitokoto 一言", link: "/docs/文章/JS Lib/hitokoto" },
                { text: "canvas 涂鸦画板", link: "/docs/文章/JS Lib/canvas 涂鸦画板" },
                {
                  text: "gitee 博客评论插件",
                  link: "/docs/文章/JS Lib/gitee Issue 评论插件",
                },
              ],
            },
            {
              text: "Vue3 组件",
              collapsed: true,
              items: [
                { text: "快速上手", link: "/docs/文章/vue3组件/快速上手" },
                { text: "深色模式", link: "/docs/文章/vue3组件/深色模式" },
                { text: "城市选择", link: "/docs/文章/vue3组件/城市选择" },
                { text: "日期选择", link: "/docs/文章/vue3组件/日期选择" },
                { text: "时间选择", link: "/docs/文章/vue3组件/时间选择" },
                { text: "趋势标记", link: "/docs/文章/vue3组件/趋势标记" },
                { text: "进度条", link: "/docs/文章/vue3组件/进度条" },
                { text: "通知菜单", link: "/docs/文章/vue3组件/通知菜单" },
                { text: "表格分页", link: "/docs/文章/vue3组件/表格分页" },
                { text: "表单", link: "/docs/文章/vue3组件/表单" },
              ],
            },
            {
              text: "前端",
              collapsed: true,
              items: [
                {
                  text: "GTA罪恶都市网页版Nginx伪静态配置",
                  link: "/docs/文章/前端/GTA罪恶都市网页版Nginx伪静态配置",
                },
                {
                  text: "svg绘制流程图",
                  link: "/docs/文章/前端/svg绘制流程图",
                },
                {
                  text: "加载Lottie动态图标",
                  link: "/docs/文章/前端/加载Lottie动态图标",
                },
                {
                  text: "vue气泡组件",
                  link: "/docs/文章/前端/vue气泡组件",
                },
                {
                  text: "打包选择环境并压缩",
                  link: "/docs/文章/前端/打包选择环境并压缩",
                },
                {
                  text: "Highcharts 不同高度 3D 饼图",
                  link: "/docs/文章/前端/Highcharts不同高度的3D饼图",
                },
                {
                  text: "cheerio 爬虫",
                  link: "/docs/文章/前端/cheerio爬虫",
                },
                {
                  text: "git配置分支合并规则",
                  link: "/docs/文章/前端/husky禁止git某个分支合并到另一个分支",
                },
                {
                  text: "音频频谱",
                  link: "/docs/文章/前端/音频频谱",
                },
                {
                  text: "豆瓣图片403",
                  link: "/docs/文章/前端/API访问第三方图片403的解决方案",
                },
                {
                  text: "githubAction自动发版",
                  link: "/docs/文章/前端/githubAction自动化发布到服务器",
                },
                {
                  text: "微信机器人",
                  link: "/docs/文章/前端/js调用openai实现chatgpt微信机器人",
                },
                {
                  text: "ElementUi 弹窗动画",
                  link: "/docs/文章/前端/ElementUi-Dialog弹窗动画origin设置",
                },
                {
                  text: "eslint使用",
                  link: "/docs/文章/前端/eslint与prettierrc使用",
                },
                {
                  text: "monorepo仓库搭建",
                  link: "/docs/文章/前端/monorepo仓库搭建",
                },
                {
                  text: "Vssue实用方法",
                  link: "/docs/文章/前端/vssue实用方法",
                },
                { text: "常用正则", link: "/docs/文章/前端/常用正则" },
                {
                  text: "axios防抖",
                  link: "/docs/文章/前端/axios防抖取消多次请求",
                },
                {
                  text: "取消axios请求",
                  link: "/docs/文章/前端/cancel_axios_request取消axios请求",
                },
                { text: "防抖与节流", link: "/docs/文章/前端/防抖与节流" },
                {
                  text: "vue 预览 word 文件 docx",
                  link: "/docs/文章/前端/vue预览word文件docx",
                },
                {
                  text: "vue 预览 Excel（导入导出）",
                  link: "/docs/文章/前端/vue预览Excel表格",
                },
                {
                  text: "json 转 excel 文件保存",
                  link: "/docs/文章/前端/json转换为excel文件保存",
                },
                {
                  text: "vue3 axios封装",
                  link: "/docs/文章/前端/vue3中axios封装",
                },
                {
                  text: "Vue 融云音视频",
                  link: "/docs/文章/前端/Vue融云音视频会议",
                },
                { text: "rem 自适应", link: "/docs/文章/前端/rem自适应" },
                {
                  text: "不规则透明滚动边框",
                  link: "/docs/文章/前端/css实现不规则透明盒子滚动边框",
                },
                {
                  text: "提取图片主题色",
                  link: "/docs/文章/前端/提取图片主题色",
                },
                {
                  text: "快速启动 npm",
                  link: "/docs/文章/前端/配置环境变量快速启动服务",
                },
                {
                  text: "发布组件到 npm",
                  link: "/docs/文章/前端/编写一个vue组件发布至npm",
                },
                {
                  text: "npm发布失败",
                  link: "/docs/文章/前端/npm发布失败可能的原因",
                },
                {
                  text: "兼容getUserMedia低版本",
                  link: "/docs/文章/前端/兼容getUserMedia",
                },
                {
                  text: "socket.io推流",
                  link: "/docs/文章/前端/socket.io音视频推流",
                },
                {
                  text: "vuepress2推送站点至百度",
                  link: "/docs/文章/前端/vuepress2自动推送站点至百度",
                },
              ],
            },
            {
              text: "技术教程",
              collapsed: true,
              items: [
                {
                  text: "v2ray服务器搭建创建订阅链接",
                  link: "/docs/文章/技术教程/v2ray服务器搭建创建订阅链接",
                },
                {
                  text: "v2rar搭配SwitchyOmega",
                  link: "/docs/文章/技术教程/v2rarN搭配SwitchyOmega自动代理",
                },
                {
                  text: "Tampermonkey油候脚本",
                  link: "/docs/文章/技术教程/如何编写一个Tampermonkey油候脚本",
                },
                {
                  text: "一台电脑双人分屏本地联机",
                  link: "/docs/文章/技术教程/一台电脑实现双人分屏本地联机游戏",
                },
                {
                  text: "wem格式音频转换",
                  link: "/docs/文章/技术教程/wem格式音频转换mp3、amr、ogg、wav、flac",
                },
              ],
            },
            {
              text: "计算机相关",
              collapsed: true,
              items: [
                {
                  text: "ASCII码表",
                  link: "/docs/文章/计算机相关/ASCII码表",
                },
                {
                  text: "进制",
                  collapsed: true,
                  items: [
                    {
                      text: "二进制",
                      link: "/docs/文章/计算机相关/进制/二进制",
                    },
                    {
                      text: "八进制",
                      link: "/docs/文章/计算机相关/进制/八进制",
                    },
                    {
                      text: "十六进制",
                      link: "/docs/文章/计算机相关/进制/十六进制",
                    },
                    {
                      text: "快速转换",
                      link: "/docs/文章/计算机相关/进制/快速转换",
                    },
                  ],
                },
                {
                  text: "数值存储方式",
                  link: "/docs/文章/计算机相关/数值存储方式",
                },
              ],
            },
            {
              text: "系统软件相关",
              collapsed: true,
              items: [
                {
                  text: "PowerShell命令别名",
                  link: "/docs/文章/系统软件相关/PowerShell命令别名",
                },
                {
                  text: "vscode 更新功能会被禁用",
                  link: "/docs/文章/系统软件相关/vscode更新功能会被禁用",
                },
                {
                  text: "永久激活 windows",
                  link: "/docs/文章/系统软件相关/永久激活win11、win10",
                },
                {
                  text: "Win11 打开方式没反应",
                  link: "/docs/文章/系统软件相关/Win11打开方式选择其他应用没反应",
                },
                {
                  text: "VMware所有版本激活密钥",
                  link: "/docs/文章/系统软件相关/VMware所有版本激活密钥",
                },
                {
                  text: "cmd 命令",
                  link: "/docs/文章/系统软件相关/cmd命令",
                },
              ],
            },
            {
              text: "CAD Auto Lisp",
              collapsed: true,
              items: [
                { text: "AutoLisp 介绍", link: "/docs/文章/AutoLisp/AutoLisp介绍" },
                { text: "简单命令编写", link: "/docs/文章/AutoLisp/简单命令编写" },
                { text: "多边形简易用法", link: "/docs/文章/AutoLisp/多边形简易用法" },
                { text: "同心圆绘制", link: "/docs/文章/AutoLisp/同心圆绘制" },
                { text: "梯形折线绘制", link: "/docs/文章/AutoLisp/梯形折线绘制" },
                { text: "偏移复制", link: "/docs/文章/AutoLisp/偏移复制" },
                { text: "图元名组码", link: "/docs/文章/AutoLisp/图元名组码" },
                { text: "圆形转多边形", link: "/docs/文章/AutoLisp/圆形转多边形" },
                {
                  text: "根据圆绘制坐标轴",
                  link: "/docs/文章/AutoLisp/根据圆绘制坐标轴",
                },
                {
                  text: "循环顶点绘制图形",
                  link: "/docs/文章/AutoLisp/循环顶点绘制图形",
                },
                {
                  text: "获取图形顶点坐标",
                  link: "/docs/文章/AutoLisp/获取图形顶点坐标",
                },
                { text: "两点创建同心圆", link: "/docs/文章/AutoLisp/两点创建同心圆" },
                { text: "选取相同图层", link: "/docs/文章/AutoLisp/选取相同图层" },
                {
                  text: "输入边数绘制多边形",
                  link: "/docs/文章/AutoLisp/输入边数绘制多边形",
                },
                { text: "端点调整", link: "/docs/文章/AutoLisp/端点调整" },
                { text: "动态五边形", link: "/docs/文章/AutoLisp/动态五边形" },
                { text: "插入时间", link: "/docs/文章/AutoLisp/插入时间" },
                { text: "绘制网格", link: "/docs/文章/AutoLisp/绘制网格" },
                { text: "SSget 过滤技巧", link: "/docs/文章/AutoLisp/SSget过滤技巧" },
                {
                  text: "entmake 创建图元必要条件",
                  link: "/docs/文章/AutoLisp/entmake创建图元必要条件",
                },
              ],
            },
          ],

          "/docs/JavaScript/": [
            {
              text: "基本概念",
              collapsed: true,
              items: [
                { text: "变量", link: "/docs/JavaScript/基本概念/变量" },
                {
                  text: "严格模式及运算问题",
                  link: "/docs/JavaScript/基本概念/严格模式及运算问题",
                },
                { text: "数值转换", link: "/docs/JavaScript/基本概念/数值转换" },
                {
                  text: "数据类型检测",
                  link: "/docs/JavaScript/基本概念/数据类型检测",
                },
                { text: "运算符", link: "/docs/JavaScript/基本概念/运算符" },
                { text: "语句", link: "/docs/JavaScript/基本概念/语句" },
                {
                  text: "作用域与内存",
                  link: "/docs/JavaScript/基本概念/变量、作用域、内存",
                },
              ],
            },
            {
              text: "数据类型",
              collapsed: true,
              items: [
                { text: "类型分类", link: "/docs/JavaScript/数据类型/类型分类" },
                { text: "String", link: "/docs/JavaScript/数据类型/String" },
                { text: "Number", link: "/docs/JavaScript/数据类型/Number" },
                { text: "Array", link: "/docs/JavaScript/数据类型/Array" },
                {
                  text: "数组去重排序",
                  link: "/docs/JavaScript/数据类型/数组去重排序",
                },
                { text: "Math", link: "/docs/JavaScript/数据类型/Math" },
                { text: "Date", link: "/docs/JavaScript/数据类型/Date" },
                { text: "Function", link: "/docs/JavaScript/数据类型/Function" },
                { text: "RegExp", link: "/docs/JavaScript/数据类型/RegExp" },
                { text: "Object", link: "/docs/JavaScript/数据类型/Object" },
              ],
            },
            {
              text: "面向对象",
              collapsed: true,
              items: [
                { text: "对象创建", link: "/docs/JavaScript/面向对象/对象创建" },
                { text: "设计模式", link: "/docs/JavaScript/面向对象/设计模式" },
                { text: "原型继承", link: "/docs/JavaScript/面向对象/原型继承" },
                {
                  text: "检查来自实例还是原型",
                  link: "/docs/JavaScript/面向对象/检查来自实例还是原型",
                },
              ],
            },
            {
              text: "BOM",
              collapsed: true,
              items: [
                {
                  text: "BOM常用方法",
                  link: "/docs/JavaScript/BOM/BOM常用方法",
                },
                { text: "location", link: "/docs/JavaScript/BOM/location" },
                { text: "history", link: "/docs/JavaScript/BOM/history" },
                { text: "navigator", link: "/docs/JavaScript/BOM/navigator" },
                { text: "窗口位置", link: "/docs/JavaScript/BOM/窗口位置" },
              ],
            },
            {
              text: "DOM",
              collapsed: true,
              items: [
                { text: "获取元素", link: "/docs/JavaScript/DOM/获取元素" },
                { text: "节点操作", link: "/docs/JavaScript/DOM/节点操作" },
                { text: "attribute", link: "/docs/JavaScript/DOM/attribute" },
                { text: "样式操作", link: "/docs/JavaScript/DOM/样式操作" },
                { text: "classList", link: "/docs/JavaScript/DOM/classList" },
              ],
            },
            {
              text: "事件",
              collapsed: true,
              items: [
                { text: "事件分类", link: "/docs/JavaScript/事件/事件分类" },
                {
                  text: "event事件对象",
                  link: "/docs/JavaScript/事件/event事件对象",
                },
                { text: "事件委托", link: "/docs/JavaScript/事件/事件委托" },
                {
                  text: "阻止冒泡及默认行为",
                  link: "/docs/JavaScript/事件/阻止冒泡及默认行为",
                },
                { text: "事件监听", link: "/docs/JavaScript/事件/事件监听" },
                { text: "UI事件", link: "/docs/JavaScript/事件/UI事件" },
              ],
            },
            {
              text: "动画",
              collapsed: true,
              items: [
                { text: "拖拽效果", link: "/docs/JavaScript/动画/拖拽效果" },
                { text: "碰撞检测", link: "/docs/JavaScript/动画/碰撞检测" },
                { text: "链式运动", link: "/docs/JavaScript/动画/链式运动" },
              ],
            },
            {
              text: "ajax",
              collapsed: true,
              items: [
                { text: "ajax 状态", link: "/docs/JavaScript/ajax/ajax状态" },
                { text: "ajax 封装", link: "/docs/JavaScript/ajax/ajax封装" },
              ],
            },
            {
              text: "表单脚本",
              collapsed: true,
              items: [
                {
                  text: "属性方法事件",
                  link: "/docs/JavaScript/表单脚本/属性方法事件",
                },
                {
                  text: "文本选中检测",
                  link: "/docs/JavaScript/表单脚本/文本选中检测",
                },
              ],
            },
            {
              text: "本地储存技术",
              collapsed: true,
              items: [
                {
                  text: "localStorage",
                  link: "/docs/JavaScript/本地储存技术/localStorage",
                },
                {
                  text: "sessionStorage",
                  link: "/docs/JavaScript/本地储存技术/sessionStorage",
                },
                { text: "cookie", link: "/docs/JavaScript/本地储存技术/cookie" },
              ],
            },
            {
              text: "多媒体 API",
              collapsed: true,
              items: [
                { text: "video", link: "/docs/JavaScript/多媒体API/video" },
                { text: "audio", link: "/docs/JavaScript/多媒体API/audio" },
              ],
            },
          ],

          "/docs/ES6/": [
            {
              text: "ECMAScript 6+",
              collapsed: true,
              items: [
                { text: "变量声明与解构", link: "/docs/ES6/变量声明与解构" },
                { text: "Object", link: "/docs/ES6/Object" },
                { text: "Symbol", link: "/docs/ES6/Symbol" },
                { text: "Map", link: "/docs/ES6/Map" },
                { text: "Set", link: "/docs/ES6/Set" },
                { text: "Proxy", link: "/docs/ES6/Proxy" },
                { text: "String", link: "/docs/ES6/String" },
                { text: "Array", link: "/docs/ES6/Array" },
                { text: "Function", link: "/docs/ES6/Function" },
                { text: "Iterator", link: "/docs/ES6/Iterator" },
                { text: "Promise", link: "/docs/ES6/Promise" },
                { text: "Generator", link: "/docs/ES6/Generator" },
                { text: "async", link: "/docs/ES6/async" },
                { text: "class", link: "/docs/ES6/class" },
                { text: "模块化", link: "/docs/ES6/模块化" },
              ],
            },
          ],

          "/docs/服务端/": [
            {
              text: "Python",
              collapsed: true,
              items: [
                { text: "初识", link: "/docs/服务端/Python/01-初识" },
                { text: "初识（二）", link: "/docs/服务端/Python/02-初识-2" },
              ]
            },
            {
              text: "Java",
              collapsed: true,
              items: [
                { text: "初识", link: "/docs/服务端/java/01-初识" },
                { text: "Scanner输入", link: "/docs/服务端/java/02-Scanner输入" },
                { text: "运算符", link: "/docs/服务端/java/03-运算符" },
                { text: "输入输出流", link: "/docs/服务端/java/04-输入输出流" },
                { text: "反射机制", link: "/docs/服务端/java/05-反射机制" },
                { text: "注解", link: "/docs/服务端/java/06-注解" },
              ],
            },
            {
              text: "C 语言",
              collapsed: true,
              items: [
                { text: "概述", link: "/docs/服务端/C语言/概述" },
                {
                  text: "CPU内部结构与寄存器",
                  link: "/docs/服务端/C语言/CPU内部结构与寄存器",
                },
                {
                  text: "数据类型",
                  collapsed: true,
                  items: [
                    { text: "常量与变量", link: "/docs/服务端/C语言/数据类型/常量与变量" },
                    { text: "整型", link: "/docs/服务端/C语言/数据类型/整型" },
                    { text: "字符型", link: "/docs/服务端/C语言/数据类型/字符型" },
                    { text: "浮点型", link: "/docs/服务端/C语言/数据类型/浮点型" },
                    {
                      text: "输入输出函数",
                      link: "/docs/服务端/C语言/数据类型/输入输出函数",
                    },
                  ],
                },
                {
                  text: "运算符与表达式",
                  collapsed: true,
                  items: [
                    {
                      text: "算术运算符",
                      link: "/docs/服务端/C语言/运算符与表达式/算术运算符",
                    },
                    { text: "语句", link: "/docs/服务端/C语言/运算符与表达式/语句" },
                  ],
                },
                {
                  text: "数组",
                  collapsed: true,
                  items: [
                    { text: "数组定义", link: "/docs/服务端/C语言/数组/数组定义" },
                    { text: "字符型数组", link: "/docs/服务端/C语言/数组/字符型数组" },
                  ],
                },
                { text: "函数", link: "/docs/服务端/C语言/函数" },
                {
                  text: "指针",
                  collapsed: true,
                  items: [
                    { text: "指针定义", link: "/docs/服务端/C语言/指针/指针定义" },
                    { text: "指针和数组", link: "/docs/服务端/C语言/指针/指针和数组" },
                    { text: "指针运算", link: "/docs/服务端/C语言/指针/指针运算" },
                    { text: "多级指针", link: "/docs/服务端/C语言/指针/多级指针" },
                    { text: "指针和字符串", link: "/docs/服务端/C语言/指针/指针和字符串" },
                    { text: "指针和函数", link: "/docs/服务端/C语言/指针/指针和函数" },
                  ],
                },
                {
                  text: "内存",
                  collapsed: true,
                  items: [
                    { text: "内存管理", link: "/docs/服务端/C语言/内存/内存管理" },
                    { text: "内存操作", link: "/docs/服务端/C语言/内存/内存操作" },
                  ],
                },
                {
                  text: "复合类型",
                  collapsed: true,
                  items: [
                    { text: "结构体", link: "/docs/服务端/C语言/复合类型/结构体" },
                  ],
                },
              ],
            },
            {
              text: "部署",
              collapsed: true,
              items: [
                { text: "docker", link: "/docs/服务端/部署/docker" },
                { text: "VMware安装Linux", link: "/docs/服务端/VMware安装Linux" },
                { text: "Linux 命令", link: "/docs/服务端/部署/Linux命令" },
                {
                  text: "生成公钥私钥连接服务器",
                  link: "/docs/服务端/部署/生成公钥私钥连接服务器",
                },
                {
                  text: "宝塔面板服务器部署",
                  link: "/docs/服务端/部署/宝塔面板服务器部署",
                },
                {
                  text: "nginx 部署前端项目",
                  link: "/docs/服务端/部署/nginx部署前端项目",
                },
                {
                  text: "nginx 代理 502 的情况",
                  link: "/docs/服务端/部署/nginx代理502的情况",
                },
                {
                  text: "nginx 配置 ssl 证书 https",
                  link: "/docs/服务端/部署/nginx配置ssl证书https",
                },
                {
                  text: "nginx 配置代理至后台服务",
                  link: "/docs/服务端/部署/nginx配置代理至后台服务",
                },
                { text: "部署 nodejs 项目", link: "/docs/服务端/部署/部署nodejs项目" },
                { text: "服务器迁移", link: "/docs/服务端/部署/服务器迁移" },
                {
                  text: "服务器文件压缩备份下载",
                  link: "/docs/服务端/部署/服务器文件压缩备份下载",
                },
                {
                  text: "npm 命令一键部署至服务器",
                  link: "/docs/服务端/部署/npm命令一键部署至服务器",
                },
                {
                  text: "服务器安装 Git 克隆仓库",
                  link: "/docs/服务端/部署/服务器安装Git克隆仓库",
                },
                {
                  text: "服务器离线安装 lrzsz",
                  link: "/docs/服务端/部署/服务器离线安装lrzsz",
                },
              ],
            },
            {
              text: "Node.js",
              collapsed: true,
              items: [
                { text: "Node.js 控制台动态进度条（带转圈动画）", link: "/docs/服务端/Node.js/Node.js 控制台动态进度条（带转圈动画）" },
                { text: "获取302接口cookie", link: "/docs/服务端/Node.js/Node.js爬虫获取302接口cookie" },
                { text: "模块引入", link: "/docs/服务端/Node.js/模块引入" },
                { text: "dos 指令", link: "/docs/服务端/Node.js/dos指令" },
                { text: "Buffer 缓冲区", link: "/docs/服务端/Node.js/Buffer" },
                { text: "FS 文件系统", link: "/docs/服务端/Node.js/FS" },
                { text: "url 地址", link: "/docs/服务端/Node.js/url" },
                { text: "http 服务器", link: "/docs/服务端/Node.js/http" },
                { text: "events 事件", link: "/docs/服务端/Node.js/events" },
                { text: "npm", link: "/docs/服务端/Node.js/npm" },
                { text: "node运行npm脚本", link: "/docs/服务端/Node.js/node运行npm脚本" },
              ],
            },
            {
              text: "数据库",
              collapsed: true,
              items: [{ text: "MySql", link: "/docs/服务端/MySql" }],
            },
          ],

          "/docs/框架/": [
            {
              text: "Pixi",
              collapsed: true,
              items: [
                { text: "基本图形绘制", link: "/docs/框架/pixi.js/基本图形绘制" },
                { text: "不规则图形绘制", link: "/docs/框架/pixi.js/不规则图形绘制" },
                { text: "图像运动", link: "/docs/框架/pixi.js/图像运动" },
                { text: "交互动画", link: "/docs/框架/pixi.js/交互动画" },
                { text: "资源管理", link: "/docs/框架/pixi.js/资源管理" },
                { text: "文字与遮罩", link: "/docs/框架/pixi.js/文字与遮罩" },
                { text: "滤镜特效", link: "/docs/框架/pixi.js/滤镜特效" },
                { text: "谷歌恐龙小游戏", link: "/docs/框架/pixi.js/谷歌恐龙小游戏" },
              ],
            },
            {
              text: "Openlayers",
              collapsed: true,
              items: [
                { text: "功能介绍", link: "/docs/框架/openlayers/功能介绍" },
                {
                  text: "ol-Map地图",
                  link: "/docs/框架/openlayers/ol-Map地图",
                },
                {
                  text: "ol-control控件",
                  link: "/docs/框架/openlayers/ol-control控件",
                },
                {
                  text: "ol-proj坐标系",
                  link: "/docs/框架/openlayers/ol-proj坐标系",
                },
              ],
            },
            {
              text: "Openlayers示例",
              collapsed: true,
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
                {
                  text: "加载百度地图",
                  link: "/docs/框架/openlayers示例/地图控件/加载百度地图",
                },
              ],
            },
            {
              text: "Wordpress",
              collapsed: true,
              items: [
                {
                  text: "wordpress 常用 sql",
                  link: "/docs/框架/wordpress/wordpress常用sql",
                },
                {
                  text: "子比主题隐藏普通会员价格",
                  link: "/docs/框架/wordpress/子比主题隐藏普通会员价格",
                },
              ],
            },
          ],

          "/docs/进阶/": [
            {
              text: "Flutter",
              collapsed: true,
              items: [
                { text: "Flutter 环境搭建", link: "/docs/进阶/Flutter/环境搭建" },
                { text: "Flutter 快速上手", link: "/docs/进阶/Flutter/01-Flutter" },
                { text: "Flutter 数据类型", link: "/docs/进阶/Flutter/02.数据类型" },
                { text: "Flutter 方法", link: "/docs/进阶/Flutter/03.方法" },
                { text: "Flutter 泛型", link: "/docs/进阶/Flutter/04.泛型" },
                { text: "Flutter HTTP 请求接口", link: "/docs/进阶/Flutter/05.http" },
                { text: "Flutter 本地存储", link: "/docs/进阶/Flutter/06.本地存储" },
                { text: "Flutter Widgets", link: "/docs/进阶/Flutter/07.widgets" },
                { text: "StatelessWidget & StatefulWidget", link: "/docs/进阶/Flutter/08.StatelessWidget&StatefulWidget" },
                { text: "实战", link: "/docs/进阶/Flutter/09.实战" },
              ],
            },
            {
              text: "Cesium",
              collapsed: true,
              items: [
                { text: "静态资源配置", link: "/docs/进阶/Cesium/静态资源配置" },
                {
                  link: "/docs/进阶/Cesium/基础配置",
                  text: "基础配置",
                },
                {
                  link: "/docs/进阶/Cesium/自定义背景",
                  text: "自定义背景",
                },
                {
                  link: "/docs/进阶/Cesium/自定义地图",
                  text: "自定义地图",
                },
                {
                  link: "/docs/进阶/Cesium/添加地形",
                  text: "添加地形",
                },
                {
                  link: "/docs/进阶/Cesium/坐标系转换",
                  text: "坐标系转换",
                },
                {
                  link: "/docs/进阶/Cesium/相机控制",
                  text: "相机控制",
                },
                {
                  link: "/docs/进阶/Cesium/添加物体",
                  text: "添加物体",
                },
                {
                  link: "/docs/进阶/Cesium/添加3D模型",
                  text: "添加3D模型",
                },
                {
                  link: "/docs/进阶/Cesium/primitive元素",
                  text: "primitive元素",
                },
                {
                  link: "/docs/进阶/Cesium/多个实体在一个primitive元素",
                  text: "多个实体在一个primitive元素",
                },
                {
                  link: "/docs/进阶/Cesium/修改primitive颜色",
                  text: "修改primitive颜色",
                },
                {
                  link: "/docs/进阶/Cesium/primitive和entity物体互动",
                  text: "primitive和entity物体互动",
                },
                {
                  link: "/docs/进阶/Cesium/entity面材质",
                  text: "entity面材质",
                },
                {
                  link: "/docs/进阶/Cesium/entity线材质",
                  text: "entity线材质",
                },
                {
                  link: "/docs/进阶/Cesium/Appearance",
                  text: "Appearance",
                },
                {
                  link: "/docs/进阶/Cesium/primitive材质",
                  text: "primitive材质",
                },
                {
                  link: "/docs/进阶/Cesium/着色器自定义材质",
                  text: "着色器自定义材质",
                },
                {
                  link: "/docs/进阶/Cesium/加载GeoJson数据",
                  text: "加载GeoJson数据",
                },
                {
                  link: "/docs/进阶/Cesium/加载kml数据",
                  text: "加载kml数据",
                },
                {
                  link: "/docs/进阶/Cesium/加载kmz数据",
                  text: "加载kmz数据",
                },
                {
                  link: "/docs/进阶/Cesium/加载czml数据",
                  text: "加载czml数据",
                },
                {
                  link: "/docs/进阶/Cesium/加载czml时序数据",
                  text: "加载czml时序数据",
                },
                {
                  link: "/docs/进阶/Cesium/追踪飞机跨洋飞行",
                  text: "追踪飞机跨洋飞行",
                },
                {
                  link: "/docs/进阶/Cesium/3DTiles与性能监控",
                  text: "3DTiles与性能监控",
                },
                {
                  link: "/docs/进阶/Cesium/设置3DTiles样式",
                  text: "设置3DTiles样式",
                },
                {
                  link: "/docs/进阶/Cesium/设置3DTiles样式高级设置",
                  text: "设置3DTiles样式高级设置",
                },
              ],
            },
            {
              text: "Three.js",
              collapsed: true,
              items: [
                {
                  text: "渲染一个场景和物体",
                  link: "/docs/进阶/Three.js/01渲染一个场景和物体",
                },
                { text: "轨道控制器", link: "/docs/进阶/Three.js/02轨道控制器" },
                { text: "坐标辅助器", link: "/docs/进阶/Three.js/03坐标辅助器" },
                {
                  text: "设置物体移动、缩放、旋转",
                  link: "/docs/进阶/Three.js/04设置物体移动、缩放、旋转",
                },
                {
                  text: "requstAnimationFrame 应用",
                  link: "/docs/进阶/Three.js/05requstAnimationFrame应用",
                },
                {
                  text: "clock 跟踪时间处理动画",
                  link: "/docs/进阶/Three.js/06clock跟踪时间处理动画",
                },
                { text: "gsap 处理动画", link: "/docs/进阶/Three.js/07gsap处理动画" },
                { text: "画布自适应宽度", link: "/docs/进阶/Three.js/08画布自适应宽度" },
                {
                  text: "可视化界面更改变量",
                  link: "/docs/进阶/Three.js/09可视化界面更改变量",
                },
                {
                  text: "几何体顶点法向属性",
                  link: "/docs/进阶/Three.js/10几何体顶点法向属性",
                },
              ],
            },
            {
              text: "TypeScript",
              collapsed: true,
              items: [
                { text: "安装配置", link: "/docs/进阶/TypeScript/安装配置" },
                { text: "类型声明", link: "/docs/进阶/TypeScript/类型声明" },
                { text: "函数", link: "/docs/进阶/TypeScript/函数" },
                { text: "类", link: "/docs/进阶/TypeScript/类" },
                { text: "接口", link: "/docs/进阶/TypeScript/接口" },
                { text: "泛型", link: "/docs/进阶/TypeScript/泛型" },
                { text: "装饰器", link: "/docs/进阶/TypeScript/装饰器" },
              ],
            },
            {
              text: "Canvas",
              collapsed: true,
              items: [
                { text: "canvas 入门", link: "/docs/进阶/Canvas/canvas入门" },
                { text: "绘制", link: "/docs/进阶/Canvas/绘制" },
                { text: "贝塞尔曲线", link: "/docs/进阶/Canvas/贝塞尔曲线" },
                { text: "渐变", link: "/docs/进阶/Canvas/渐变" },
                { text: "变换", link: "/docs/进阶/Canvas/变换" },
                { text: "状态", link: "/docs/进阶/Canvas/状态" },
              ],
            },
            {
              text: "版本管理工具",
              collapsed: true,
              items: [{ text: "git版本管理工具", link: "/docs/进阶/git版本管理工具" }],
            },
          ],

          "/docs/English/": [
            {
              text: "英语",
              collapsed: true,
              items: [
                { text: "总览", link: "/docs/English/总览" },
                { text: "常见发音对照表", link: "/docs/English/常见发音对照表" },
                { text: "主语", link: "/docs/English/主语" },
                { text: "谓语", link: "/docs/English/谓语" },
                { text: "表语", link: "/docs/English/表语" },
                { text: "宾语", link: "/docs/English/宾语" },
                { text: "状语", link: "/docs/English/状语" },
                { text: "定语", link: "/docs/English/定语" },
                { text: "同位语", link: "/docs/English/同位语" },
                { text: "基本句型", link: "/docs/English/基本句型" },
                { text: "名词与分类", link: "/docs/English/名词与分类" },
                { text: "名词单数变复数规则", link: "/docs/English/名词单数变复数规则" },
                { text: "不可数名词与量词", link: "/docs/English/不可数名词与量词" },
                { text: "名词的作用", link: "/docs/English/名词的作用" },
                { text: "名词所有格", link: "/docs/English/名词所有格" },
                { text: "人称代词", link: "/docs/English/人称代词" },
                { text: "物主代词", link: "/docs/English/物主代词" },
                { text: "指示代词", link: "/docs/English/指示代词" },
                { text: "形容词定义和语法", link: "/docs/English/形容词定义和语法" },
                { text: "形容词的比较级和最高级规则", link: "/docs/English/形容词的比较级和最高级规则" },
                { text: "形容词的比较级和最高级用法", link: "/docs/English/形容词的比较级和最高级用法" },
                { text: "谓语动词", link: "/docs/English/谓语动词" },
                { text: "实义动词格式变化", link: "/docs/English/实义动词格式变化" },
                { text: "系动词", link: "/docs/English/系动词" },
                { text: "助动词", link: "/docs/English/助动词" },
                { text: "情态动词", link: "/docs/English/情态动词" },
                { text: "冠词", link: "/docs/English/冠词" },
                { text: "一般现在时", link: "/docs/English/一般现在时" },
                { text: "主系表疑问句和否定句", link: "/docs/English/主系表疑问句和否定句" },
                { text: "主谓宾构成方式", link: "/docs/English/主谓宾构成方式" },
                { text: "主谓宾疑问句否定句", link: "/docs/English/主谓宾疑问句否定句" },
                { text: "16种时态", link: "/docs/English/16种时态" },

                { text: "序数词与基数词", link: "/docs/English/序数词与基数词" },

                { text: "否定句", link: "/docs/English/否定句" },
                { text: "肯定句转疑问句", link: "/docs/English/肯定句转疑问句" },
                { text: "特殊疑问句", link: "/docs/English/特殊疑问句" },
                { text: "介词", link: "/docs/English/介词" },
                { text: "从句", link: "/docs/English/从句" },
                { text: "非谓语", link: "/docs/English/非谓语" },
              ]
            }
          ],
        },
      },
    },
    'en': {
      lang: "en",
      label: "English", // 英语    
    },
    'zh-TW': {
      lang: "zh-TW",
      label: "繁體中文", // 中文（繁体）
      description: "線上工具，免費工具，遊戲，FC遊戲，小遊戲，圖片處理，圖片壓縮，圖片轉換，圖片裁剪，PDF處理，PDF轉Word，PDF合併，PDF壓縮，視頻處理，視頻壓縮，視頻轉換，Base64編碼，坐標轉換，地圖瓦片下載，線上默寫單詞，iframe測試，WEM音頻轉換MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "線上工具，免費工具，遊戲，FC遊戲，小遊戲，圖片處理，圖片壓縮，圖片轉換，圖片裁剪，PDF處理，PDF轉Word，PDF合併，PDF壓縮，視頻處理，視頻壓縮，視頻轉換，Base64編碼，坐標轉換，地圖瓦片下載，線上默寫單詞，iframe測試，WEM音頻轉換MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "返回頂部",
        sidebarMenuLabel: "目錄",
        darkModeSwitchLabel: "切換模式",
        lightModeSwitchTitle: "切換到淺色",
        darkModeSwitchTitle: "切換到深色",
        notFound: {
          title: "頁面不存在",
          quote: "頁面不存在，請檢查URL是否正確。",
          linkLabel: "返回首頁",
          linkText: "返回首頁",
        },
        search: {
          options: {
            placeholder: "搜尋文件",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: '詢問 AI',
                    buttonAriaLabel: '詢問 AI'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: '詢問 AI',
                      conversationHistoryTitle: '我的對話歷史',
                      newConversationText: '開始新的對話',
                      viewConversationHistoryText: '對話歷史'
                    },
                    promptForm: {
                      promptPlaceholderText: '提問',
                      promptAnsweringText: '正在回答...',
                      promptAskAnotherQuestionText: '再問一個問題',
                      promptDisclaimerText: '回答由 AI 生成，可能會出錯。',
                      promptLabelText: '按回車發送，Shift+回車換行。',
                      promptAriaLabelText: '問題輸入'
                    },
                    conversationScreen: {
                      preToolCallText: '搜尋中...',
                      searchingText: '搜尋中...',
                      toolCallResultText: '已搜尋',
                      conversationDisclaimer: '回答由 AI 生成，可能會出錯。請核實。',
                      reasoningText: '推理中...',
                      thinkingText: '思考中...',
                      relatedSourcesText: '相關來源',
                      stoppedStreamingText: '你已停止此回覆',
                      copyButtonText: '複製',
                      copyButtonCopiedText: '已複製！',
                      likeButtonTitle: '喜歡',
                      dislikeButtonTitle: '不喜歡',
                      thanksForFeedbackText: '感謝你的反饋！',
                      errorTitleText: '聊天錯誤'
                    },
                    newConversationScreen: {
                      titleText: '我今天能幫你什麼？',
                      introductionText: '我會搜尋你的文件，快速幫你找到設定指南、功能細節和故障排除提示。'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: '搜尋',
                buttonAriaLabel: '搜尋'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: '清除',
                  clearButtonAriaLabel: '清除查詢',
                  closeButtonText: '關閉',
                  closeButtonAriaLabel: '關閉',
                  placeholderText: '搜尋文件或向 AI 提問',
                  placeholderTextAskAi: '再問一個問題...',
                  placeholderTextAskAiStreaming: '正在回答...',
                  searchInputLabel: '搜尋',
                  backToKeywordSearchButtonText: '返回關鍵詞搜尋',
                  backToKeywordSearchButtonAriaLabel: '返回關鍵詞搜尋',
                  newConversationPlaceholder: '提問',
                  conversationHistoryTitle: '我的對話歷史',
                  startNewConversationText: '開始新的對話',
                  viewConversationHistoryText: '對話歷史',
                  threadDepthErrorPlaceholder: '對話已達上限'
                },
                newConversation: {
                  newConversationTitle: '我今天能幫你什麼？',
                  newConversationDescription: '我會搜尋你的文件，快速幫你找到設定指南、功能細節和故障排除提示。'
                },
                footer: {
                  selectText: '選擇',
                  submitQuestionText: '提交問題',
                  selectKeyAriaLabel: '回車鍵',
                  navigateText: '導航',
                  navigateUpKeyAriaLabel: '向上箭頭',
                  navigateDownKeyAriaLabel: '向下箭頭',
                  closeText: '關閉',
                  backToSearchText: '返回搜尋',
                  closeKeyAriaLabel: 'Esc 鍵',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: '無法獲取結果',
                  helpText: '你可能需要檢查網路連接。'
                },
                startScreen: {
                  recentSearchesTitle: '最近',
                  noRecentSearchesText: '暫無最近搜尋',
                  saveRecentSearchButtonTitle: '儲存此搜尋',
                  removeRecentSearchButtonTitle: '從歷史記錄中移除此搜尋',
                  favoriteSearchesTitle: '收藏',
                  removeFavoriteSearchButtonTitle: '從收藏中移除此搜尋',
                  recentConversationsTitle: '最近對話',
                  removeRecentConversationButtonTitle: '從歷史記錄中移除此對話'
                },
                noResultsScreen: {
                  noResultsText: '未找到相關結果',
                  suggestedQueryText: '嘗試搜尋',
                  reportMissingResultsText: '認為此查詢應該有結果？',
                  reportMissingResultsLinkText: '告訴我們。'
                },
                resultsScreen: {
                  askAiPlaceholder: '詢問 AI：',
                  noResultsAskAiPlaceholder: '文件裡沒找到？讓 Ask AI 幫忙：'
                },
                askAiScreen: {
                  disclaimerText: '回答由 AI 生成，可能會出錯。請核實。',
                  relatedSourcesText: '相關來源',
                  thinkingText: '思考中...',
                  copyButtonText: '複製',
                  copyButtonCopiedText: '已複製！',
                  copyButtonTitle: '複製',
                  likeButtonTitle: '喜歡',
                  dislikeButtonTitle: '不喜歡',
                  thanksForFeedbackText: '感謝你的反饋！',
                  preToolCallText: '搜尋中...',
                  duringToolCallText: '搜尋中...',
                  afterToolCallText: '已搜尋',
                  stoppedStreamingText: '你已停止此回覆',
                  errorTitleText: '聊天錯誤',
                  threadDepthExceededMessage: '為保持回答準確，此對話已關閉。',
                  startNewConversationButtonText: '開始新的對話'
                }
              }
            },
          },
        },
        outlineTitle: "此頁目錄",
        lastUpdatedText: "最後更新時間",
        docFooter: {
          prev: "上一篇",
          next: "下一篇",
        },
        footer: {},
        editLink: {
          text: "在 GitHub 編輯此頁",
        },
      },
    },
    'ja': {
      lang: "ja",
      label: "日本語", // 日语
      description: "オンラインツール，無料ツール，ゲーム，FCゲーム，小ゲーム，画像処理，画像圧縮，画像変換，画像裁剪，PDF処理，PDF to Word，PDFマージ，PDF圧縮，ビデオ処理，ビデオ圧縮，ビデオ変換，Base64エンコーディング，座標変換，地図タイルダウンロード，オンライン単語書き，iframeテスト，WEM音声変換MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "オンラインツール，無料ツール，ゲーム，FCゲーム，小ゲーム，画像処理，画像圧縮，画像変換，画像裁剪，PDF処理，PDF to Word，PDFマージ，PDF圧縮，ビデオ処理，ビデオ圧縮，ビデオ変換，Base64エンコーディング，座標変換，地図タイルダウンロード，オンライン単語書き，iframeテスト，WEM音声変換MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "トップへ戻る",
        sidebarMenuLabel: "目次",
        darkModeSwitchLabel: "モード切替",
        lightModeSwitchTitle: "ライトモードに切替",
        darkModeSwitchTitle: "ダークモードに切替",
        notFound: {
          title: "ページが見つかりません",
          quote: "ページが見つかりません。URLが正しいか確認してください。",
          linkLabel: "ホームへ戻る",
          linkText: "ホームへ戻る",
        },
        search: {
          options: {
            placeholder: "ドキュメントを検索",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: 'AIに聞く',
                    buttonAriaLabel: 'AIに聞く'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: 'AIに聞く',
                      conversationHistoryTitle: '会話履歴',
                      newConversationText: '新しい会話を始める',
                      viewConversationHistoryText: '会話履歴'
                    },
                    promptForm: {
                      promptPlaceholderText: '質問する',
                      promptAnsweringText: '回答中...',
                      promptAskAnotherQuestionText: '別の質問をする',
                      promptDisclaimerText: '回答はAIにより生成され、誤りがある場合があります。',
                      promptLabelText: 'Enterで送信、Shift+Enterで改行。',
                      promptAriaLabelText: '質問入力'
                    },
                    conversationScreen: {
                      preToolCallText: '検索中...',
                      searchingText: '検索中...',
                      toolCallResultText: '検索しました',
                      conversationDisclaimer: '回答はAIにより生成され、誤りがある場合があります。確認してください。',
                      reasoningText: '推論中...',
                      thinkingText: '考え中...',
                      relatedSourcesText: '関連ソース',
                      stoppedStreamingText: 'この返信を停止しました',
                      copyButtonText: 'コピー',
                      copyButtonCopiedText: 'コピーしました！',
                      likeButtonTitle: '良い',
                      dislikeButtonTitle: '良くない',
                      thanksForFeedbackText: 'フィードバックありがとうございます！',
                      errorTitleText: 'チャットエラー'
                    },
                    newConversationScreen: {
                      titleText: '今日は何をお手伝いできますか？',
                      introductionText: 'ドキュメントを検索して、設定ガイド、機能の詳細、トラブルシューティングのヒントをすぐに見つけます。'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: '検索',
                buttonAriaLabel: '検索'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'クリア',
                  clearButtonAriaLabel: 'クエリをクリア',
                  closeButtonText: '閉じる',
                  closeButtonAriaLabel: '閉じる',
                  placeholderText: 'ドキュメントを検索またはAIに質問',
                  placeholderTextAskAi: '別の質問を入力...',
                  placeholderTextAskAiStreaming: '回答中...',
                  searchInputLabel: '検索',
                  backToKeywordSearchButtonText: 'キーワード検索に戻る',
                  backToKeywordSearchButtonAriaLabel: 'キーワード検索に戻る',
                  newConversationPlaceholder: '質問する',
                  conversationHistoryTitle: '会話履歴',
                  startNewConversationText: '新しい会話を始める',
                  viewConversationHistoryText: '会話履歴',
                  threadDepthErrorPlaceholder: '会話の上限に達しました'
                },
                newConversation: {
                  newConversationTitle: '今日は何をお手伝いできますか？',
                  newConversationDescription: 'ドキュメントを検索して、設定ガイド、機能の詳細、トラブルシューティングのヒントをすぐに見つけます。'
                },
                footer: {
                  selectText: '選択',
                  submitQuestionText: '質問を送信',
                  selectKeyAriaLabel: 'Enterキー',
                  navigateText: '移動',
                  navigateUpKeyAriaLabel: '上矢印',
                  navigateDownKeyAriaLabel: '下矢印',
                  closeText: '閉じる',
                  backToSearchText: '検索に戻る',
                  closeKeyAriaLabel: 'Escキー',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: '結果を取得できません',
                  helpText: 'ネットワーク接続を確認してください。'
                },
                startScreen: {
                  recentSearchesTitle: '最近',
                  noRecentSearchesText: '最近の検索はありません',
                  saveRecentSearchButtonTitle: 'この検索を保存',
                  removeRecentSearchButtonTitle: '履歴からこの検索を削除',
                  favoriteSearchesTitle: 'お気に入り',
                  removeFavoriteSearchButtonTitle: 'お気に入りからこの検索を削除',
                  recentConversationsTitle: '最近の会話',
                  removeRecentConversationButtonTitle: '履歴からこの会話を削除'
                },
                noResultsScreen: {
                  noResultsText: '関連する結果が見つかりません',
                  suggestedQueryText: '検索してみてください',
                  reportMissingResultsText: 'このクエリには結果があるべきですか？',
                  reportMissingResultsLinkText: '教えてください。'
                },
                resultsScreen: {
                  askAiPlaceholder: 'AIに質問：',
                  noResultsAskAiPlaceholder: 'ドキュメントで見つかりませんか？AIに聞いてください：'
                },
                askAiScreen: {
                  disclaimerText: '回答はAIにより生成され、誤りがある場合があります。確認してください。',
                  relatedSourcesText: '関連ソース',
                  thinkingText: '考え中...',
                  copyButtonText: 'コピー',
                  copyButtonCopiedText: 'コピーしました！',
                  copyButtonTitle: 'コピー',
                  likeButtonTitle: '良い',
                  dislikeButtonTitle: '良くない',
                  thanksForFeedbackText: 'フィードバックありがとうございます！',
                  preToolCallText: '検索中...',
                  duringToolCallText: '検索中...',
                  afterToolCallText: '検索しました',
                  stoppedStreamingText: 'この返信を停止しました',
                  errorTitleText: 'チャットエラー',
                  threadDepthExceededMessage: '回答の精度を保つため、この会話はクローズされました。',
                  startNewConversationButtonText: '新しい会話を始める'
                }
              }
            },
          },
        },
        outlineTitle: "このページの目次",
        lastUpdatedText: "最終更新日時",
        docFooter: {
          prev: "前の記事",
          next: "次の記事",
        },
        footer: {},
        editLink: {
          text: "GitHubでこのページを編集",
        },
      },
    },
    'ko': {
      lang: "ko",
      label: "한국어", // 韩语
      description: "온라인 도구, 무료 도구, 게임, FC 게임, 소게임, 이미지 처리, 이미지 압축, 이미지 변환, 이미지 자르기, PDF 처리, PDF to Word, PDF 병합, PDF 압축, 비디오 처리, 비디오 압축, 비디오 변환, Base64 인코딩, 좌표 변환, 지도 타일 다운로드, 온라인 단어 쓰기, iframe 테스트, WEM 오디오 변환 MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "온라인 도구, 무료 도구, 게임, FC 게임, 소게임, 이미지 처리, 이미지 압축, 이미지 변환, 이미지 자르기, PDF 처리, PDF to Word, PDF 병합, PDF 압축, 비디오 처리, 비디오 압축, 비디오 변환, Base64 인코딩, 좌표 변환, 지도 타일 다운로드, 온라인 단어 쓰기, iframe 테스트, WEM 오디오 변환 MP3",
          },
        ],
      ],
      themeConfig: {
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
                    buttonText: 'AI에게 묻기',
                    buttonAriaLabel: 'AI에게 묻기'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: 'AI에게 묻기',
                      conversationHistoryTitle: '내 대화 기록',
                      newConversationText: '새 대화 시작',
                      viewConversationHistoryText: '대화 기록'
                    },
                    promptForm: {
                      promptPlaceholderText: '질문하기',
                      promptAnsweringText: '답변 중...',
                      promptAskAnotherQuestionText: '다른 질문하기',
                      promptDisclaimerText: 'AI가 생성한 답변으로 오류가 있을 수 있습니다.',
                      promptLabelText: 'Enter로 전송, Shift+Enter로 줄바꿈.',
                      promptAriaLabelText: '질문 입력'
                    },
                    conversationScreen: {
                      preToolCallText: '검색 중...',
                      searchingText: '검색 중...',
                      toolCallResultText: '검색 완료',
                      conversationDisclaimer: 'AI가 생성한 답변으로 오류가 있을 수 있습니다. 확인하세요.',
                      reasoningText: '추론 중...',
                      thinkingText: '생각 중...',
                      relatedSourcesText: '관련 출처',
                      stoppedStreamingText: '답변을 중단했습니다',
                      copyButtonText: '복사',
                      copyButtonCopiedText: '복사됨!',
                      likeButtonTitle: '좋아요',
                      dislikeButtonTitle: '싫어요',
                      thanksForFeedbackText: '피드백 감사합니다!',
                      errorTitleText: '채팅 오류'
                    },
                    newConversationScreen: {
                      titleText: '오늘 무엇을 도와드릴까요?',
                      introductionText: '문서를 검색하여 설정 가이드, 기능 세부 정보 및 문제 해결 팁을 빠르게 찾아드립니다.'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: '검색',
                buttonAriaLabel: '검색'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: '지우기',
                  clearButtonAriaLabel: '쿼리 지우기',
                  closeButtonText: '닫기',
                  closeButtonAriaLabel: '닫기',
                  placeholderText: '문서 검색 또는 AI에게 질문',
                  placeholderTextAskAi: '다른 질문을 입력...',
                  placeholderTextAskAiStreaming: '답변 중...',
                  searchInputLabel: '검색',
                  backToKeywordSearchButtonText: '키워드 검색으로 돌아가기',
                  backToKeywordSearchButtonAriaLabel: '키워드 검색으로 돌아가기',
                  newConversationPlaceholder: '질문하기',
                  conversationHistoryTitle: '내 대화 기록',
                  startNewConversationText: '새 대화 시작',
                  viewConversationHistoryText: '대화 기록',
                  threadDepthErrorPlaceholder: '대화 한도에 도달했습니다'
                },
                newConversation: {
                  newConversationTitle: '오늘 무엇을 도와드릴까요?',
                  newConversationDescription: '문서를 검색하여 설정 가이드, 기능 세부 정보 및 문제 해결 팁을 빠르게 찾아드립니다.'
                },
                footer: {
                  selectText: '선택',
                  submitQuestionText: '질문 제출',
                  selectKeyAriaLabel: 'Enter 키',
                  navigateText: '탐색',
                  navigateUpKeyAriaLabel: '위쪽 화살표',
                  navigateDownKeyAriaLabel: '아래쪽 화살표',
                  closeText: '닫기',
                  backToSearchText: '검색으로 돌아가기',
                  closeKeyAriaLabel: 'Esc 키',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: '결과를 가져올 수 없습니다',
                  helpText: '네트워크 연결을 확인하세요.'
                },
                startScreen: {
                  recentSearchesTitle: '최근',
                  noRecentSearchesText: '최근 검색 없음',
                  saveRecentSearchButtonTitle: '이 검색 저장',
                  removeRecentSearchButtonTitle: '기록에서 이 검색 제거',
                  favoriteSearchesTitle: '즐겨찾기',
                  removeFavoriteSearchButtonTitle: '즐겨찾기에서 이 검색 제거',
                  recentConversationsTitle: '최근 대화',
                  removeRecentConversationButtonTitle: '기록에서 이 대화 제거'
                },
                noResultsScreen: {
                  noResultsText: '관련 결과를 찾을 수 없습니다',
                  suggestedQueryText: '검색을 시도해 보세요',
                  reportMissingResultsText: '이 쿼리에 결과가 있어야 한다고 생각하시나요?',
                  reportMissingResultsLinkText: '알려주세요.'
                },
                resultsScreen: {
                  askAiPlaceholder: 'AI에게 질문：',
                  noResultsAskAiPlaceholder: '문서에서 찾지 못했나요? AI에게 물어보세요：'
                },
                askAiScreen: {
                  disclaimerText: 'AI가 생성한 답변으로 오류가 있을 수 있습니다. 확인하세요.',
                  relatedSourcesText: '관련 출처',
                  thinkingText: '생각 중...',
                  copyButtonText: '복사',
                  copyButtonCopiedText: '복사됨!',
                  copyButtonTitle: '복사',
                  likeButtonTitle: '좋아요',
                  dislikeButtonTitle: '싫어요',
                  thanksForFeedbackText: '피드백 감사합니다!',
                  preToolCallText: '검색 중...',
                  duringToolCallText: '검색 중...',
                  afterToolCallText: '검색 완료',
                  stoppedStreamingText: '답변을 중단했습니다',
                  errorTitleText: '채팅 오류',
                  threadDepthExceededMessage: '답변 정확도를 유지하기 위해 이 대화가 종료되었습니다.',
                  startNewConversationButtonText: '새 대화 시작'
                }
              }
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
    },
    'fr': {
      lang: "fr",
      label: "Français", // 法语
      description: "Outils en ligne, outils gratuits, jeux, jeux FC, petits jeux, traitement d'images, compression d'images, conversion d'images, recadrage d'images, traitement PDF, PDF en Word, fusion PDF, compression PDF, traitement vidéo, compression vidéo, conversion vidéo, encodage Base64, conversion de coordonnées, téléchargement de tuiles de carte, écriture de mots en ligne, test iframe, conversion audio WEM en MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "Outils en ligne, outils gratuits, jeux, jeux FC, petits jeux, traitement d'images, compression d'images, conversion d'images, recadrage d'images, traitement PDF, PDF en Word, fusion PDF, compression PDF, traitement vidéo, compression vidéo, conversion vidéo, encodage Base64, conversion de coordonnées, téléchargement de tuiles de carte, écriture de mots en ligne, test iframe, conversion audio WEM en MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "Retour en haut",
        sidebarMenuLabel: "Sommaire",
        darkModeSwitchLabel: "Changer de mode",
        lightModeSwitchTitle: "Passer en mode clair",
        darkModeSwitchTitle: "Passer en mode sombre",
        notFound: {
          title: "Page introuvable",
          quote: "La page n'existe pas, veuillez vérifier l'URL.",
          linkLabel: "Retour à l'accueil",
          linkText: "Retour à l'accueil",
        },
        search: {
          options: {
            placeholder: "Rechercher dans la documentation",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: "Demander à l'IA",
                    buttonAriaLabel: "Demander à l'IA"
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: "Demander à l'IA",
                      conversationHistoryTitle: 'Historique de mes conversations',
                      newConversationText: 'Nouvelle conversation',
                      viewConversationHistoryText: 'Historique'
                    },
                    promptForm: {
                      promptPlaceholderText: 'Poser une question',
                      promptAnsweringText: 'En train de répondre...',
                      promptAskAnotherQuestionText: 'Poser une autre question',
                      promptDisclaimerText: "Réponse générée par l'IA, peut contenir des erreurs.",
                      promptLabelText: 'Entrée pour envoyer, Shift+Entrée pour saut de ligne.',
                      promptAriaLabelText: 'Saisie de question'
                    },
                    conversationScreen: {
                      preToolCallText: 'Recherche en cours...',
                      searchingText: 'Recherche en cours...',
                      toolCallResultText: 'Recherche effectuée',
                      conversationDisclaimer: "Réponse générée par l'IA, peut contenir des erreurs. Vérifiez.",
                      reasoningText: 'Raisonnement en cours...',
                      thinkingText: 'Réflexion en cours...',
                      relatedSourcesText: 'Sources associées',
                      stoppedStreamingText: 'Vous avez arrêté cette réponse',
                      copyButtonText: 'Copier',
                      copyButtonCopiedText: 'Copié !',
                      likeButtonTitle: "J'aime",
                      dislikeButtonTitle: "Je n'aime pas",
                      thanksForFeedbackText: 'Merci pour votre retour !',
                      errorTitleText: 'Erreur de chat'
                    },
                    newConversationScreen: {
                      titleText: "Comment puis-je vous aider aujourd'hui ?",
                      introductionText: "Je vais rechercher dans votre documentation pour trouver rapidement des guides de configuration, des détails sur les fonctionnalités et des conseils de dépannage."
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: 'Rechercher',
                buttonAriaLabel: 'Rechercher'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'Effacer',
                  clearButtonAriaLabel: 'Effacer la recherche',
                  closeButtonText: 'Fermer',
                  closeButtonAriaLabel: 'Fermer',
                  placeholderText: "Rechercher dans la doc ou demander à l'IA",
                  placeholderTextAskAi: 'Poser une autre question...',
                  placeholderTextAskAiStreaming: 'En train de répondre...',
                  searchInputLabel: 'Rechercher',
                  backToKeywordSearchButtonText: 'Retour à la recherche par mot-clé',
                  backToKeywordSearchButtonAriaLabel: 'Retour à la recherche par mot-clé',
                  newConversationPlaceholder: 'Poser une question',
                  conversationHistoryTitle: 'Historique de mes conversations',
                  startNewConversationText: 'Nouvelle conversation',
                  viewConversationHistoryText: 'Historique',
                  threadDepthErrorPlaceholder: 'Limite de conversation atteinte'
                },
                newConversation: {
                  newConversationTitle: "Comment puis-je vous aider aujourd'hui ?",
                  newConversationDescription: "Je vais rechercher dans votre documentation pour trouver rapidement des guides de configuration, des détails sur les fonctionnalités et des conseils de dépannage."
                },
                footer: {
                  selectText: 'Sélectionner',
                  submitQuestionText: 'Soumettre la question',
                  selectKeyAriaLabel: 'Touche Entrée',
                  navigateText: 'Naviguer',
                  navigateUpKeyAriaLabel: 'Flèche vers le haut',
                  navigateDownKeyAriaLabel: 'Flèche vers le bas',
                  closeText: 'Fermer',
                  backToSearchText: 'Retour à la recherche',
                  closeKeyAriaLabel: 'Touche Échap',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: 'Impossible de récupérer les résultats',
                  helpText: 'Vérifiez votre connexion réseau.'
                },
                startScreen: {
                  recentSearchesTitle: 'Récent',
                  noRecentSearchesText: 'Aucune recherche récente',
                  saveRecentSearchButtonTitle: 'Enregistrer cette recherche',
                  removeRecentSearchButtonTitle: "Supprimer cette recherche de l'historique",
                  favoriteSearchesTitle: 'Favoris',
                  removeFavoriteSearchButtonTitle: 'Supprimer des favoris',
                  recentConversationsTitle: 'Conversations récentes',
                  removeRecentConversationButtonTitle: "Supprimer cette conversation de l'historique"
                },
                noResultsScreen: {
                  noResultsText: 'Aucun résultat trouvé',
                  suggestedQueryText: 'Essayez de rechercher',
                  reportMissingResultsText: 'Vous pensez que cette requête devrait avoir des résultats ?',
                  reportMissingResultsLinkText: 'Dites-le nous.'
                },
                resultsScreen: {
                  askAiPlaceholder: "Demander à l'IA :",
                  noResultsAskAiPlaceholder: "Pas trouvé dans la doc ? Essayez Ask AI :"
                },
                askAiScreen: {
                  disclaimerText: "Réponse générée par l'IA, peut contenir des erreurs. Vérifiez.",
                  relatedSourcesText: 'Sources associées',
                  thinkingText: 'Réflexion en cours...',
                  copyButtonText: 'Copier',
                  copyButtonCopiedText: 'Copié !',
                  copyButtonTitle: 'Copier',
                  likeButtonTitle: "J'aime",
                  dislikeButtonTitle: "Je n'aime pas",
                  thanksForFeedbackText: 'Merci pour votre retour !',
                  preToolCallText: 'Recherche en cours...',
                  duringToolCallText: 'Recherche en cours...',
                  afterToolCallText: 'Recherche effectuée',
                  stoppedStreamingText: 'Vous avez arrêté cette réponse',
                  errorTitleText: 'Erreur de chat',
                  threadDepthExceededMessage: 'Cette conversation a été fermée pour maintenir la précision des réponses.',
                  startNewConversationButtonText: 'Nouvelle conversation'
                }
              }
            },
          },
        },
        outlineTitle: "Sur cette page",
        lastUpdatedText: "Dernière mise à jour",
        docFooter: {
          prev: "Précédent",
          next: "Suivant",
        },
        footer: {},
        editLink: {
          text: "Modifier cette page sur GitHub",
        },
      },
    },
    'de': {
      lang: "de",
      label: "Deutsch", // 德语
      description: "Online-Tools, kostenlose Tools, Spiele, FC-Spiele, Kleine Spiele, Bildbearbeitung, Bildkompression, Bildumwandlung, Bildzuschnitt, PDF-Bearbeitung, PDF zu Word, PDF-Zusammenführung, PDF-Kompression, Videobearbeitung, Videokompression, Videoumwandlung, Base64-Encoding, Koordinatentransformation, Kartentile-Download, Online-Wortschreiben, iframe-Test, WEM-Audio-Umwandlung MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "Online-Tools, kostenlose Tools, Spiele, FC-Spiele, Kleine Spiele, Bildbearbeitung, Bildkompression, Bildumwandlung, Bildzuschnitt, PDF-Bearbeitung, PDF zu Word, PDF-Zusammenführung, PDF-Kompression, Videobearbeitung, Videokompression, Videoumwandlung, Base64-Encoding, Koordinatentransformation, Kartentile-Download, Online-Wortschreiben, iframe-Test, WEM-Audio-Umwandlung MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "Nach oben",
        sidebarMenuLabel: "Inhaltsverzeichnis",
        darkModeSwitchLabel: "Modus wechseln",
        lightModeSwitchTitle: "Zum hellen Modus wechseln",
        darkModeSwitchTitle: "Zum dunklen Modus wechseln",
        notFound: {
          title: "Seite nicht gefunden",
          quote: "Die Seite existiert nicht, bitte überprüfen Sie die URL.",
          linkLabel: "Zur Startseite",
          linkText: "Zur Startseite",
        },
        search: {
          options: {
            placeholder: "Dokumentation durchsuchen",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: 'KI fragen',
                    buttonAriaLabel: 'KI fragen'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: 'KI fragen',
                      conversationHistoryTitle: 'Mein Gesprächsverlauf',
                      newConversationText: 'Neues Gespräch beginnen',
                      viewConversationHistoryText: 'Gesprächsverlauf'
                    },
                    promptForm: {
                      promptPlaceholderText: 'Frage stellen',
                      promptAnsweringText: 'Antworte...',
                      promptAskAnotherQuestionText: 'Weitere Frage stellen',
                      promptDisclaimerText: 'Antwort von KI generiert, kann Fehler enthalten.',
                      promptLabelText: 'Enter zum Senden, Shift+Enter für Zeilenumbruch.',
                      promptAriaLabelText: 'Frageingabe'
                    },
                    conversationScreen: {
                      preToolCallText: 'Suche läuft...',
                      searchingText: 'Suche läuft...',
                      toolCallResultText: 'Suche abgeschlossen',
                      conversationDisclaimer: 'Antwort von KI generiert, kann Fehler enthalten. Bitte prüfen.',
                      reasoningText: 'Wird verarbeitet...',
                      thinkingText: 'Denkt nach...',
                      relatedSourcesText: 'Verwandte Quellen',
                      stoppedStreamingText: 'Sie haben diese Antwort gestoppt',
                      copyButtonText: 'Kopieren',
                      copyButtonCopiedText: 'Kopiert!',
                      likeButtonTitle: 'Gefällt mir',
                      dislikeButtonTitle: 'Gefällt mir nicht',
                      thanksForFeedbackText: 'Danke für Ihr Feedback!',
                      errorTitleText: 'Chat-Fehler'
                    },
                    newConversationScreen: {
                      titleText: 'Wie kann ich Ihnen heute helfen?',
                      introductionText: 'Ich durchsuche Ihre Dokumentation und finde schnell Einrichtungsanleitungen, Funktionsdetails und Tipps zur Fehlerbehebung.'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: 'Suchen',
                buttonAriaLabel: 'Suchen'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'Löschen',
                  clearButtonAriaLabel: 'Suchanfrage löschen',
                  closeButtonText: 'Schließen',
                  closeButtonAriaLabel: 'Schließen',
                  placeholderText: 'Dokumentation durchsuchen oder KI fragen',
                  placeholderTextAskAi: 'Weitere Frage eingeben...',
                  placeholderTextAskAiStreaming: 'Antworte...',
                  searchInputLabel: 'Suchen',
                  backToKeywordSearchButtonText: 'Zurück zur Schlüsselwortsuche',
                  backToKeywordSearchButtonAriaLabel: 'Zurück zur Schlüsselwortsuche',
                  newConversationPlaceholder: 'Frage stellen',
                  conversationHistoryTitle: 'Mein Gesprächsverlauf',
                  startNewConversationText: 'Neues Gespräch beginnen',
                  viewConversationHistoryText: 'Gesprächsverlauf',
                  threadDepthErrorPlaceholder: 'Gesprächslimit erreicht'
                },
                newConversation: {
                  newConversationTitle: 'Wie kann ich Ihnen heute helfen?',
                  newConversationDescription: 'Ich durchsuche Ihre Dokumentation und finde schnell Einrichtungsanleitungen, Funktionsdetails und Tipps zur Fehlerbehebung.'
                },
                footer: {
                  selectText: 'Auswählen',
                  submitQuestionText: 'Frage absenden',
                  selectKeyAriaLabel: 'Enter-Taste',
                  navigateText: 'Navigieren',
                  navigateUpKeyAriaLabel: 'Pfeil nach oben',
                  navigateDownKeyAriaLabel: 'Pfeil nach unten',
                  closeText: 'Schließen',
                  backToSearchText: 'Zurück zur Suche',
                  closeKeyAriaLabel: 'Esc-Taste',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: 'Ergebnisse konnten nicht abgerufen werden',
                  helpText: 'Überprüfen Sie Ihre Netzwerkverbindung.'
                },
                startScreen: {
                  recentSearchesTitle: 'Zuletzt',
                  noRecentSearchesText: 'Keine letzten Suchen',
                  saveRecentSearchButtonTitle: 'Diese Suche speichern',
                  removeRecentSearchButtonTitle: 'Diese Suche aus dem Verlauf entfernen',
                  favoriteSearchesTitle: 'Favoriten',
                  removeFavoriteSearchButtonTitle: 'Aus Favoriten entfernen',
                  recentConversationsTitle: 'Letzte Gespräche',
                  removeRecentConversationButtonTitle: 'Dieses Gespräch aus dem Verlauf entfernen'
                },
                noResultsScreen: {
                  noResultsText: 'Keine relevanten Ergebnisse gefunden',
                  suggestedQueryText: 'Versuchen Sie zu suchen',
                  reportMissingResultsText: 'Meinen Sie, diese Anfrage sollte Ergebnisse haben?',
                  reportMissingResultsLinkText: 'Teilen Sie es uns mit.'
                },
                resultsScreen: {
                  askAiPlaceholder: 'KI fragen:',
                  noResultsAskAiPlaceholder: 'In der Doku nicht gefunden? Fragen Sie die KI:'
                },
                askAiScreen: {
                  disclaimerText: 'Antwort von KI generiert, kann Fehler enthalten. Bitte prüfen.',
                  relatedSourcesText: 'Verwandte Quellen',
                  thinkingText: 'Denkt nach...',
                  copyButtonText: 'Kopieren',
                  copyButtonCopiedText: 'Kopiert!',
                  copyButtonTitle: 'Kopieren',
                  likeButtonTitle: 'Gefällt mir',
                  dislikeButtonTitle: 'Gefällt mir nicht',
                  thanksForFeedbackText: 'Danke für Ihr Feedback!',
                  preToolCallText: 'Suche läuft...',
                  duringToolCallText: 'Suche läuft...',
                  afterToolCallText: 'Suche abgeschlossen',
                  stoppedStreamingText: 'Sie haben diese Antwort gestoppt',
                  errorTitleText: 'Chat-Fehler',
                  threadDepthExceededMessage: 'Dieses Gespräch wurde geschlossen, um die Antwortgenauigkeit zu erhalten.',
                  startNewConversationButtonText: 'Neues Gespräch beginnen'
                }
              }
            },
          },
        },
        outlineTitle: "Auf dieser Seite",
        lastUpdatedText: "Zuletzt aktualisiert",
        docFooter: {
          prev: "Vorherige",
          next: "Nächste",
        },
        footer: {},
        editLink: {
          text: "Diese Seite auf GitHub bearbeiten",
        },
      },
    },
    'es': {
      lang: "es",
      label: "Español", // 西班牙语
      description: "Herramientas en línea, herramientas gratuitas, juegos, juegos FC, juegos pequeños, procesamiento de imágenes, compresión de imágenes, conversión de imágenes, recorte de imágenes, procesamiento de PDF, PDF a Word, PDF de fusión, PDF de compresión, procesamiento de video, compresión de video, conversión de video, Base64 de codificación, conversión de coordenadas, descarga de mosaicos de mapa, escritura en línea de palabras, prueba de iframe, conversión de audio WEM a MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "Herramientas en línea, herramientas gratuitas, juegos, juegos FC, juegos pequeños, procesamiento de imágenes, compresión de imágenes, conversión de imágenes, recorte de imágenes, procesamiento de PDF, PDF a Word, PDF de fusión, PDF de compresión, procesamiento de video, compresión de video, conversión de video, Base64 de codificación, conversión de coordenadas, descarga de mosaicos de mapa, escritura en línea de palabras, prueba de iframe, conversión de audio WEM a MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "Volver arriba",
        sidebarMenuLabel: "Índice",
        darkModeSwitchLabel: "Cambiar modo",
        lightModeSwitchTitle: "Cambiar a modo claro",
        darkModeSwitchTitle: "Cambiar a modo oscuro",
        notFound: {
          title: "Página no encontrada",
          quote: "La página no existe, por favor verifique la URL.",
          linkLabel: "Volver al inicio",
          linkText: "Volver al inicio",
        },
        search: {
          options: {
            placeholder: "Buscar en la documentación",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: 'Preguntar a la IA',
                    buttonAriaLabel: 'Preguntar a la IA'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: 'Preguntar a la IA',
                      conversationHistoryTitle: 'Mi historial de conversaciones',
                      newConversationText: 'Iniciar nueva conversación',
                      viewConversationHistoryText: 'Historial'
                    },
                    promptForm: {
                      promptPlaceholderText: 'Hacer una pregunta',
                      promptAnsweringText: 'Respondiendo...',
                      promptAskAnotherQuestionText: 'Hacer otra pregunta',
                      promptDisclaimerText: 'Respuesta generada por IA, puede contener errores.',
                      promptLabelText: 'Enter para enviar, Shift+Enter para nueva línea.',
                      promptAriaLabelText: 'Entrada de pregunta'
                    },
                    conversationScreen: {
                      preToolCallText: 'Buscando...',
                      searchingText: 'Buscando...',
                      toolCallResultText: 'Búsqueda realizada',
                      conversationDisclaimer: 'Respuesta generada por IA, puede contener errores. Verifique.',
                      reasoningText: 'Razonando...',
                      thinkingText: 'Pensando...',
                      relatedSourcesText: 'Fuentes relacionadas',
                      stoppedStreamingText: 'Ha detenido esta respuesta',
                      copyButtonText: 'Copiar',
                      copyButtonCopiedText: '¡Copiado!',
                      likeButtonTitle: 'Me gusta',
                      dislikeButtonTitle: 'No me gusta',
                      thanksForFeedbackText: '¡Gracias por su opinión!',
                      errorTitleText: 'Error de chat'
                    },
                    newConversationScreen: {
                      titleText: '¿En qué puedo ayudarle hoy?',
                      introductionText: 'Buscaré en su documentación para encontrar rápidamente guías de configuración, detalles de funciones y consejos de solución de problemas.'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: 'Buscar',
                buttonAriaLabel: 'Buscar'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'Limpiar',
                  clearButtonAriaLabel: 'Limpiar búsqueda',
                  closeButtonText: 'Cerrar',
                  closeButtonAriaLabel: 'Cerrar',
                  placeholderText: 'Buscar en la doc o preguntar a la IA',
                  placeholderTextAskAi: 'Hacer otra pregunta...',
                  placeholderTextAskAiStreaming: 'Respondiendo...',
                  searchInputLabel: 'Buscar',
                  backToKeywordSearchButtonText: 'Volver a la búsqueda por palabra clave',
                  backToKeywordSearchButtonAriaLabel: 'Volver a la búsqueda por palabra clave',
                  newConversationPlaceholder: 'Hacer una pregunta',
                  conversationHistoryTitle: 'Mi historial de conversaciones',
                  startNewConversationText: 'Iniciar nueva conversación',
                  viewConversationHistoryText: 'Historial',
                  threadDepthErrorPlaceholder: 'Límite de conversación alcanzado'
                },
                newConversation: {
                  newConversationTitle: '¿En qué puedo ayudarle hoy?',
                  newConversationDescription: 'Buscaré en su documentación para encontrar rápidamente guías de configuración, detalles de funciones y consejos de solución de problemas.'
                },
                footer: {
                  selectText: 'Seleccionar',
                  submitQuestionText: 'Enviar pregunta',
                  selectKeyAriaLabel: 'Tecla Enter',
                  navigateText: 'Navegar',
                  navigateUpKeyAriaLabel: 'Flecha arriba',
                  navigateDownKeyAriaLabel: 'Flecha abajo',
                  closeText: 'Cerrar',
                  backToSearchText: 'Volver a la búsqueda',
                  closeKeyAriaLabel: 'Tecla Esc',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: 'No se pudieron obtener resultados',
                  helpText: 'Es posible que deba verificar su conexión de red.'
                },
                startScreen: {
                  recentSearchesTitle: 'Reciente',
                  noRecentSearchesText: 'Sin búsquedas recientes',
                  saveRecentSearchButtonTitle: 'Guardar esta búsqueda',
                  removeRecentSearchButtonTitle: 'Eliminar esta búsqueda del historial',
                  favoriteSearchesTitle: 'Favoritos',
                  removeFavoriteSearchButtonTitle: 'Eliminar de favoritos',
                  recentConversationsTitle: 'Conversaciones recientes',
                  removeRecentConversationButtonTitle: 'Eliminar esta conversación del historial'
                },
                noResultsScreen: {
                  noResultsText: 'No se encontraron resultados relevantes',
                  suggestedQueryText: 'Intente buscar',
                  reportMissingResultsText: '¿Cree que esta consulta debería tener resultados?',
                  reportMissingResultsLinkText: 'Cuéntenos.'
                },
                resultsScreen: {
                  askAiPlaceholder: 'Preguntar a la IA:',
                  noResultsAskAiPlaceholder: '¿No encontró en la doc? Pruebe Ask AI:'
                },
                askAiScreen: {
                  disclaimerText: 'Respuesta generada por IA, puede contener errores. Verifique.',
                  relatedSourcesText: 'Fuentes relacionadas',
                  thinkingText: 'Pensando...',
                  copyButtonText: 'Copiar',
                  copyButtonCopiedText: '¡Copiado!',
                  copyButtonTitle: 'Copiar',
                  likeButtonTitle: 'Me gusta',
                  dislikeButtonTitle: 'No me gusta',
                  thanksForFeedbackText: '¡Gracias por su opinión!',
                  preToolCallText: 'Buscando...',
                  duringToolCallText: 'Buscando...',
                  afterToolCallText: 'Búsqueda realizada',
                  stoppedStreamingText: 'Ha detenido esta respuesta',
                  errorTitleText: 'Error de chat',
                  threadDepthExceededMessage: 'Esta conversación ha sido cerrada para mantener la precisión de las respuestas.',
                  startNewConversationButtonText: 'Iniciar nueva conversación'
                }
              }
            },
          },
        },
        outlineTitle: "En esta página",
        lastUpdatedText: "Última actualización",
        docFooter: {
          prev: "Anterior",
          next: "Siguiente",
        },
        footer: {},
        editLink: {
          text: "Editar esta página en GitHub",
        },
      },
    },
    'pt': {
      lang: "pt",
      label: "Português", // 葡萄牙语
      description: "Ferramentas online, ferramentas gratuitas, jogos, jogos FC, jogos pequenos, processamento de imagens, compressão de imagens, conversão de imagens, recorte de imagens, processamento de PDF, PDF para Word, PDF de fusão, PDF de compressão, processamento de vídeo, compressão de vídeo, conversão de vídeo, Base64 de codificação, conversão de coordenadas, download de mosaicos de mapa, escrita online de palavras, teste de iframe, conversão de áudio WEM para MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "Ferramentas online, ferramentas gratuitas, jogos, jogos FC, jogos pequenos, processamento de imagens, compressão de imagens, conversão de imagens, recorte de imagens, processamento de PDF, PDF para Word, PDF de fusão, PDF de compressão, processamento de vídeo, compressão de vídeo, conversão de vídeo, Base64 de codificação, conversão de coordenadas, download de mosaicos de mapa, escrita online de palavras, teste de iframe, conversão de áudio WEM para MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "Voltar ao topo",
        sidebarMenuLabel: "Índice",
        darkModeSwitchLabel: "Alternar modo",
        lightModeSwitchTitle: "Mudar para modo claro",
        darkModeSwitchTitle: "Mudar para modo escuro",
        notFound: {
          title: "Página não encontrada",
          quote: "A página não existe, verifique se a URL está correta.",
          linkLabel: "Voltar à página inicial",
          linkText: "Voltar à página inicial",
        },
        search: {
          options: {
            placeholder: "Pesquisar na documentação",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: 'Perguntar à IA',
                    buttonAriaLabel: 'Perguntar à IA'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: 'Perguntar à IA',
                      conversationHistoryTitle: 'Meu histórico de conversas',
                      newConversationText: 'Iniciar nova conversa',
                      viewConversationHistoryText: 'Histórico'
                    },
                    promptForm: {
                      promptPlaceholderText: 'Fazer uma pergunta',
                      promptAnsweringText: 'Respondendo...',
                      promptAskAnotherQuestionText: 'Fazer outra pergunta',
                      promptDisclaimerText: 'Resposta gerada por IA, pode conter erros.',
                      promptLabelText: 'Enter para enviar, Shift+Enter para nova linha.',
                      promptAriaLabelText: 'Entrada de pergunta'
                    },
                    conversationScreen: {
                      preToolCallText: 'Pesquisando...',
                      searchingText: 'Pesquisando...',
                      toolCallResultText: 'Pesquisa concluída',
                      conversationDisclaimer: 'Resposta gerada por IA, pode conter erros. Verifique.',
                      reasoningText: 'Raciocinando...',
                      thinkingText: 'Pensando...',
                      relatedSourcesText: 'Fontes relacionadas',
                      stoppedStreamingText: 'Você parou esta resposta',
                      copyButtonText: 'Copiar',
                      copyButtonCopiedText: 'Copiado!',
                      likeButtonTitle: 'Gostei',
                      dislikeButtonTitle: 'Não gostei',
                      thanksForFeedbackText: 'Obrigado pelo seu feedback!',
                      errorTitleText: 'Erro de chat'
                    },
                    newConversationScreen: {
                      titleText: 'Como posso ajudá-lo hoje?',
                      introductionText: 'Vou pesquisar na sua documentação para encontrar rapidamente guias de configuração, detalhes de funcionalidades e dicas de solução de problemas.'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: 'Pesquisar',
                buttonAriaLabel: 'Pesquisar'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'Limpar',
                  clearButtonAriaLabel: 'Limpar pesquisa',
                  closeButtonText: 'Fechar',
                  closeButtonAriaLabel: 'Fechar',
                  placeholderText: 'Pesquisar na doc ou perguntar à IA',
                  placeholderTextAskAi: 'Fazer outra pergunta...',
                  placeholderTextAskAiStreaming: 'Respondendo...',
                  searchInputLabel: 'Pesquisar',
                  backToKeywordSearchButtonText: 'Voltar à pesquisa por palavra-chave',
                  backToKeywordSearchButtonAriaLabel: 'Voltar à pesquisa por palavra-chave',
                  newConversationPlaceholder: 'Fazer uma pergunta',
                  conversationHistoryTitle: 'Meu histórico de conversas',
                  startNewConversationText: 'Iniciar nova conversa',
                  viewConversationHistoryText: 'Histórico',
                  threadDepthErrorPlaceholder: 'Limite de conversa atingido'
                },
                newConversation: {
                  newConversationTitle: 'Como posso ajudá-lo hoje?',
                  newConversationDescription: 'Vou pesquisar na sua documentação para encontrar rapidamente guias de configuração, detalhes de funcionalidades e dicas de solução de problemas.'
                },
                footer: {
                  selectText: 'Selecionar',
                  submitQuestionText: 'Enviar pergunta',
                  selectKeyAriaLabel: 'Tecla Enter',
                  navigateText: 'Navegar',
                  navigateUpKeyAriaLabel: 'Seta para cima',
                  navigateDownKeyAriaLabel: 'Seta para baixo',
                  closeText: 'Fechar',
                  backToSearchText: 'Voltar à pesquisa',
                  closeKeyAriaLabel: 'Tecla Esc',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: 'Não foi possível obter resultados',
                  helpText: 'Pode ser necessário verificar sua conexão de rede.'
                },
                startScreen: {
                  recentSearchesTitle: 'Recente',
                  noRecentSearchesText: 'Sem pesquisas recentes',
                  saveRecentSearchButtonTitle: 'Salvar esta pesquisa',
                  removeRecentSearchButtonTitle: 'Remover esta pesquisa do histórico',
                  favoriteSearchesTitle: 'Favoritos',
                  removeFavoriteSearchButtonTitle: 'Remover dos favoritos',
                  recentConversationsTitle: 'Conversas recentes',
                  removeRecentConversationButtonTitle: 'Remover esta conversa do histórico'
                },
                noResultsScreen: {
                  noResultsText: 'Nenhum resultado relevante encontrado',
                  suggestedQueryText: 'Tente pesquisar',
                  reportMissingResultsText: 'Acha que esta consulta deveria ter resultados?',
                  reportMissingResultsLinkText: 'Conte-nos.'
                },
                resultsScreen: {
                  askAiPlaceholder: 'Perguntar à IA:',
                  noResultsAskAiPlaceholder: 'Não encontrou na doc? Experimente o Ask AI:'
                },
                askAiScreen: {
                  disclaimerText: 'Resposta gerada por IA, pode conter erros. Verifique.',
                  relatedSourcesText: 'Fontes relacionadas',
                  thinkingText: 'Pensando...',
                  copyButtonText: 'Copiar',
                  copyButtonCopiedText: 'Copiado!',
                  copyButtonTitle: 'Copiar',
                  likeButtonTitle: 'Gostei',
                  dislikeButtonTitle: 'Não gostei',
                  thanksForFeedbackText: 'Obrigado pelo seu feedback!',
                  preToolCallText: 'Pesquisando...',
                  duringToolCallText: 'Pesquisando...',
                  afterToolCallText: 'Pesquisa concluída',
                  stoppedStreamingText: 'Você parou esta resposta',
                  errorTitleText: 'Erro de chat',
                  threadDepthExceededMessage: 'Esta conversa foi encerrada para manter a precisão das respostas.',
                  startNewConversationButtonText: 'Iniciar nova conversa'
                }
              }
            },
          },
        },
        outlineTitle: "Nesta página",
        lastUpdatedText: "Última atualização",
        docFooter: {
          prev: "Anterior",
          next: "Próximo",
        },
        footer: {},
        editLink: {
          text: "Editar esta página no GitHub",
        },
      },
    },
    'ru': {
      lang: "ru",
      label: "Русский", // 俄语
      description: "Онлайн-инструменты, бесплатные инструменты, игры, игры FC, маленькие игры, обработка изображений, сжатие изображений, преобразование изображений, обрезка изображений, обработка PDF, PDF в Word, PDF слияние, PDF сжатие, обработка видео, сжатие видео, преобразование видео, Base64 кодирование, преобразование координат, загрузка карточных плиток, онлайн-написание слов, тест iframe, преобразование аудио WEM в MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "Онлайн-инструменты, бесплатные инструменты, игры, игры FC, маленькие игры, обработка изображений, сжатие изображений, преобразование изображений, обрезка изображений, обработка PDF, PDF в Word, PDF слияние, PDF сжатие, обработка видео, сжатие видео, преобразование видео, Base64 кодирование, преобразование координат, загрузка карточных плиток, онлайн-написание слов, тест iframe, преобразование аудио WEM в MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "Вернуться наверх",
        sidebarMenuLabel: "Оглавление",
        darkModeSwitchLabel: "Переключить режим",
        lightModeSwitchTitle: "Переключить на светлый режим",
        darkModeSwitchTitle: "Переключить на тёмный режим",
        notFound: {
          title: "Страница не найдена",
          quote: "Страница не существует, пожалуйста, проверьте URL.",
          linkLabel: "Вернуться на главную",
          linkText: "Вернуться на главную",
        },
        search: {
          options: {
            placeholder: "Поиск в документации",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: 'Спросить ИИ',
                    buttonAriaLabel: 'Спросить ИИ'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: 'Спросить ИИ',
                      conversationHistoryTitle: 'История моих разговоров',
                      newConversationText: 'Начать новый разговор',
                      viewConversationHistoryText: 'История'
                    },
                    promptForm: {
                      promptPlaceholderText: 'Задать вопрос',
                      promptAnsweringText: 'Отвечаю...',
                      promptAskAnotherQuestionText: 'Задать другой вопрос',
                      promptDisclaimerText: 'Ответ сгенерирован ИИ, может содержать ошибки.',
                      promptLabelText: 'Enter для отправки, Shift+Enter для переноса строки.',
                      promptAriaLabelText: 'Ввод вопроса'
                    },
                    conversationScreen: {
                      preToolCallText: 'Поиск...',
                      searchingText: 'Поиск...',
                      toolCallResultText: 'Поиск выполнен',
                      conversationDisclaimer: 'Ответ сгенерирован ИИ, может содержать ошибки. Проверьте.',
                      reasoningText: 'Рассуждаю...',
                      thinkingText: 'Думаю...',
                      relatedSourcesText: 'Связанные источники',
                      stoppedStreamingText: 'Вы остановили этот ответ',
                      copyButtonText: 'Копировать',
                      copyButtonCopiedText: 'Скопировано!',
                      likeButtonTitle: 'Нравится',
                      dislikeButtonTitle: 'Не нравится',
                      thanksForFeedbackText: 'Спасибо за отзыв!',
                      errorTitleText: 'Ошибка чата'
                    },
                    newConversationScreen: {
                      titleText: 'Чем я могу помочь вам сегодня?',
                      introductionText: 'Я выполню поиск в вашей документации и быстро найду руководства по настройке, сведения о функциях и советы по устранению неполадок.'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: 'Поиск',
                buttonAriaLabel: 'Поиск'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'Очистить',
                  clearButtonAriaLabel: 'Очистить запрос',
                  closeButtonText: 'Закрыть',
                  closeButtonAriaLabel: 'Закрыть',
                  placeholderText: 'Поиск в документации или вопрос к ИИ',
                  placeholderTextAskAi: 'Ввести другой вопрос...',
                  placeholderTextAskAiStreaming: 'Отвечаю...',
                  searchInputLabel: 'Поиск',
                  backToKeywordSearchButtonText: 'Вернуться к поиску по ключевым словам',
                  backToKeywordSearchButtonAriaLabel: 'Вернуться к поиску по ключевым словам',
                  newConversationPlaceholder: 'Задать вопрос',
                  conversationHistoryTitle: 'История моих разговоров',
                  startNewConversationText: 'Начать новый разговор',
                  viewConversationHistoryText: 'История',
                  threadDepthErrorPlaceholder: 'Достигнут лимит разговора'
                },
                newConversation: {
                  newConversationTitle: 'Чем я могу помочь вам сегодня?',
                  newConversationDescription: 'Я выполню поиск в вашей документации и быстро найду руководства по настройке, сведения о функциях и советы по устранению неполадок.'
                },
                footer: {
                  selectText: 'Выбрать',
                  submitQuestionText: 'Отправить вопрос',
                  selectKeyAriaLabel: 'Клавиша Enter',
                  navigateText: 'Навигация',
                  navigateUpKeyAriaLabel: 'Стрелка вверх',
                  navigateDownKeyAriaLabel: 'Стрелка вниз',
                  closeText: 'Закрыть',
                  backToSearchText: 'Вернуться к поиску',
                  closeKeyAriaLabel: 'Клавиша Esc',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: 'Не удалось получить результаты',
                  helpText: 'Возможно, вам нужно проверить сетевое подключение.'
                },
                startScreen: {
                  recentSearchesTitle: 'Недавние',
                  noRecentSearchesText: 'Нет недавних поисков',
                  saveRecentSearchButtonTitle: 'Сохранить этот поиск',
                  removeRecentSearchButtonTitle: 'Удалить этот поиск из истории',
                  favoriteSearchesTitle: 'Избранное',
                  removeFavoriteSearchButtonTitle: 'Удалить из избранного',
                  recentConversationsTitle: 'Недавние разговоры',
                  removeRecentConversationButtonTitle: 'Удалить этот разговор из истории'
                },
                noResultsScreen: {
                  noResultsText: 'Не найдено релевантных результатов',
                  suggestedQueryText: 'Попробуйте поискать',
                  reportMissingResultsText: 'Считаете, что этот запрос должен иметь результаты?',
                  reportMissingResultsLinkText: 'Сообщите нам.'
                },
                resultsScreen: {
                  askAiPlaceholder: 'Спросить ИИ:',
                  noResultsAskAiPlaceholder: 'Не нашли в документации? Попробуйте Ask AI:'
                },
                askAiScreen: {
                  disclaimerText: 'Ответ сгенерирован ИИ, может содержать ошибки. Проверьте.',
                  relatedSourcesText: 'Связанные источники',
                  thinkingText: 'Думаю...',
                  copyButtonText: 'Копировать',
                  copyButtonCopiedText: 'Скопировано!',
                  copyButtonTitle: 'Копировать',
                  likeButtonTitle: 'Нравится',
                  dislikeButtonTitle: 'Не нравится',
                  thanksForFeedbackText: 'Спасибо за отзыв!',
                  preToolCallText: 'Поиск...',
                  duringToolCallText: 'Поиск...',
                  afterToolCallText: 'Поиск выполнен',
                  stoppedStreamingText: 'Вы остановили этот ответ',
                  errorTitleText: 'Ошибка чата',
                  threadDepthExceededMessage: 'Этот разговор был закрыт для сохранения точности ответов.',
                  startNewConversationButtonText: 'Начать новый разговор'
                }
              }
            },
          },
        },
        outlineTitle: "На этой странице",
        lastUpdatedText: "Последнее обновление",
        docFooter: {
          prev: "Предыдущая",
          next: "Следующая",
        },
        footer: {},
        editLink: {
          text: "Редактировать эту страницу на GitHub",
        },
      },
    },
    'ar': {
      lang: "ar",
      dir: "rtl",
      label: "العربية", // 阿拉伯语
      description: "أدوات على الإنترنت, أدوات مجانية, الألعاب, الألعاب FC, الألعاب الصغيرة, معالجة الصور, ضغط الصور, تحويل الصور, قص الصور, معالجة الPDF, PDF إلى Word, PDF من إعادة تسوية, PDF الضغط, معالجة الفيديو, ضغط الفيديو, تحويل الفيديو, Base64 الترميز, تحويل الإحداثيات, تحميل بلاطات الخريطة, كتابة الكلمات على الإنترنت, اختبار iframe, تحويل الصوت WEM إلى MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "أدوات على الإنترنت, أدوات مجانية, الألعاب, الألعاب FC, الألعاب الصغيرة, معالجة الصور, ضغط الصور, تحويل الصور, قص الصور, معالجة الPDF, PDF إلى Word, PDF من إعادة تسوية, PDF الضغط, معالجة الفيديو, ضغط الفيديو, تحويل الفيديو, Base64 الترميز, تحويل الإحداثيات, تحميل بلاطات الخريطة, كتابة الكلمات على الإنترنت, اختبار iframe, تحويل الصوت WEM إلى MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "العودة إلى الأعلى",
        sidebarMenuLabel: "الفهرس",
        darkModeSwitchLabel: "تبديل الوضع",
        lightModeSwitchTitle: "التبديل إلى الوضع الفاتح",
        darkModeSwitchTitle: "التبديل إلى الوضع الداكن",
        notFound: {
          title: "الصفحة غير موجودة",
          quote: "الصفحة غير موجودة، يرجى التحقق من صحة الرابط.",
          linkLabel: "العودة إلى الصفحة الرئيسية",
          linkText: "العودة إلى الصفحة الرئيسية",
        },
        search: {
          options: {
            placeholder: "البحث في الوثائق",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: 'اسأل الذكاء الاصطناعي',
                    buttonAriaLabel: 'اسأل الذكاء الاصطناعي'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: 'اسأل الذكاء الاصطناعي',
                      conversationHistoryTitle: 'سجل محادثاتي',
                      newConversationText: 'بدء محادثة جديدة',
                      viewConversationHistoryText: 'سجل المحادثات'
                    },
                    promptForm: {
                      promptPlaceholderText: 'طرح سؤال',
                      promptAnsweringText: 'جارٍ الإجابة...',
                      promptAskAnotherQuestionText: 'طرح سؤال آخر',
                      promptDisclaimerText: 'الإجابة مولّدة بواسطة الذكاء الاصطناعي وقد تحتوي على أخطاء.',
                      promptLabelText: 'Enter للإرسال، Shift+Enter لسطر جديد.',
                      promptAriaLabelText: 'إدخال السؤال'
                    },
                    conversationScreen: {
                      preToolCallText: 'جارٍ البحث...',
                      searchingText: 'جارٍ البحث...',
                      toolCallResultText: 'تم البحث',
                      conversationDisclaimer: 'الإجابة مولّدة بواسطة الذكاء الاصطناعي وقد تحتوي على أخطاء. يرجى التحقق.',
                      reasoningText: 'جارٍ التفكير...',
                      thinkingText: 'جارٍ التفكير...',
                      relatedSourcesText: 'المصادر ذات الصلة',
                      stoppedStreamingText: 'لقد أوقفت هذه الإجابة',
                      copyButtonText: 'نسخ',
                      copyButtonCopiedText: 'تم النسخ!',
                      likeButtonTitle: 'إعجاب',
                      dislikeButtonTitle: 'عدم إعجاب',
                      thanksForFeedbackText: 'شكراً على ملاحظاتك!',
                      errorTitleText: 'خطأ في الدردشة'
                    },
                    newConversationScreen: {
                      titleText: 'كيف يمكنني مساعدتك اليوم؟',
                      introductionText: 'سأبحث في وثائقك للعثور بسرعة على أدلة الإعداد وتفاصيل الميزات ونصائح استكشاف الأخطاء.'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: 'بحث',
                buttonAriaLabel: 'بحث'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'مسح',
                  clearButtonAriaLabel: 'مسح البحث',
                  closeButtonText: 'إغلاق',
                  closeButtonAriaLabel: 'إغلاق',
                  placeholderText: 'البحث في الوثائق أو سؤال الذكاء الاصطناعي',
                  placeholderTextAskAi: 'طرح سؤال آخر...',
                  placeholderTextAskAiStreaming: 'جارٍ الإجابة...',
                  searchInputLabel: 'بحث',
                  backToKeywordSearchButtonText: 'العودة إلى البحث بالكلمات المفتاحية',
                  backToKeywordSearchButtonAriaLabel: 'العودة إلى البحث بالكلمات المفتاحية',
                  newConversationPlaceholder: 'طرح سؤال',
                  conversationHistoryTitle: 'سجل محادثاتي',
                  startNewConversationText: 'بدء محادثة جديدة',
                  viewConversationHistoryText: 'سجل المحادثات',
                  threadDepthErrorPlaceholder: 'تم الوصول إلى حد المحادثة'
                },
                newConversation: {
                  newConversationTitle: 'كيف يمكنني مساعدتك اليوم؟',
                  newConversationDescription: 'سأبحث في وثائقك للعثور بسرعة على أدلة الإعداد وتفاصيل الميزات ونصائح استكشاف الأخطاء.'
                },
                footer: {
                  selectText: 'تحديد',
                  submitQuestionText: 'إرسال السؤال',
                  selectKeyAriaLabel: 'مفتاح Enter',
                  navigateText: 'تنقل',
                  navigateUpKeyAriaLabel: 'سهم لأعلى',
                  navigateDownKeyAriaLabel: 'سهم لأسفل',
                  closeText: 'إغلاق',
                  backToSearchText: 'العودة إلى البحث',
                  closeKeyAriaLabel: 'مفتاح Esc',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: 'تعذّر جلب النتائج',
                  helpText: 'قد تحتاج إلى التحقق من اتصالك بالشبكة.'
                },
                startScreen: {
                  recentSearchesTitle: 'الأخيرة',
                  noRecentSearchesText: 'لا توجد عمليات بحث حديثة',
                  saveRecentSearchButtonTitle: 'حفظ هذا البحث',
                  removeRecentSearchButtonTitle: 'إزالة هذا البحث من السجل',
                  favoriteSearchesTitle: 'المفضلة',
                  removeFavoriteSearchButtonTitle: 'إزالة من المفضلة',
                  recentConversationsTitle: 'المحادثات الأخيرة',
                  removeRecentConversationButtonTitle: 'إزالة هذه المحادثة من السجل'
                },
                noResultsScreen: {
                  noResultsText: 'لم يتم العثور على نتائج ذات صلة',
                  suggestedQueryText: 'حاول البحث',
                  reportMissingResultsText: 'هل تعتقد أن هذا الاستعلام يجب أن تكون له نتائج؟',
                  reportMissingResultsLinkText: 'أخبرنا.'
                },
                resultsScreen: {
                  askAiPlaceholder: 'اسأل الذكاء الاصطناعي:',
                  noResultsAskAiPlaceholder: 'لم تجد في الوثائق؟ جرّب Ask AI:'
                },
                askAiScreen: {
                  disclaimerText: 'الإجابة مولّدة بواسطة الذكاء الاصطناعي وقد تحتوي على أخطاء. يرجى التحقق.',
                  relatedSourcesText: 'المصادر ذات الصلة',
                  thinkingText: 'جارٍ التفكير...',
                  copyButtonText: 'نسخ',
                  copyButtonCopiedText: 'تم النسخ!',
                  copyButtonTitle: 'نسخ',
                  likeButtonTitle: 'إعجاب',
                  dislikeButtonTitle: 'عدم إعجاب',
                  thanksForFeedbackText: 'شكراً على ملاحظاتك!',
                  preToolCallText: 'جارٍ البحث...',
                  duringToolCallText: 'جارٍ البحث...',
                  afterToolCallText: 'تم البحث',
                  stoppedStreamingText: 'لقد أوقفت هذه الإجابة',
                  errorTitleText: 'خطأ في الدردشة',
                  threadDepthExceededMessage: 'تم إغلاق هذه المحادثة للحفاظ على دقة الإجابات.',
                  startNewConversationButtonText: 'بدء محادثة جديدة'
                }
              }
            },
          },
        },
        outlineTitle: "في هذه الصفحة",
        lastUpdatedText: "آخر تحديث",
        docFooter: {
          prev: "السابق",
          next: "التالي",
        },
        footer: {},
        editLink: {
          text: "تحرير هذه الصفحة على GitHub",
        },
      },
    },
    'hi': {
      lang: "hi",
      label: "हिन्दी", // 印地语
      description: "ऑनलाइन उपकरण, मुफ्त उपकरण, खेल, FC खेल, छोटे खेल, छवि संसाधन, छवि संपीड़न, छवि परिवर्तन, छवि कटाव, PDF संसाधन, PDF से Word, PDF संयोजन, PDF संपीड़न, वीडियो संसाधन, वीडियो संपीड़न, वीडियो परिवर्तन, Base64 एनकोडिंग, संयोजन परिवर्तन, मानचित्र टाइल डाउनलोड, ऑनलाइन शब्द लिखना, iframe परीक्षण, WEM ऑडियो परिवर्तन MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "ऑनलाइन उपकरण, मुफ्त उपकरण, खेल, FC खेल, छोटे खेल, छवि संसाधन, छवि संपीड़न, छवि परिवर्तन, छवि कटाव, PDF संसाधन, PDF से Word, PDF संयोजन, PDF संपीड़न, वीडियो संसाधन, वीडियो संपीड़न, वीडियो परिवर्तन, Base64 एनकोडिंग, संयोजन परिवर्तन, मानचित्र टाइल डाउनलोड, ऑनलाइन शब्द लिखना, iframe परीक्षण, WEM ऑडियो परिवर्तन MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "शीर्ष पर वापस जाएं",
        sidebarMenuLabel: "विषय सूची",
        darkModeSwitchLabel: "मोड बदलें",
        lightModeSwitchTitle: "लाइट मोड पर स्विच करें",
        darkModeSwitchTitle: "डार्क मोड पर स्विच करें",
        notFound: {
          title: "पृष्ठ नहीं मिला",
          quote: "पृष्ठ मौजूद नहीं है, कृपया URL जांचें।",
          linkLabel: "होम पेज पर वापस जाएं",
          linkText: "होम पेज पर वापस जाएं",
        },
        search: {
          options: {
            placeholder: "दस्तावेज़ खोजें",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: 'AI से पूछें',
                    buttonAriaLabel: 'AI से पूछें'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: 'AI से पूछें',
                      conversationHistoryTitle: 'मेरा बातचीत इतिहास',
                      newConversationText: 'नई बातचीत शुरू करें',
                      viewConversationHistoryText: 'बातचीत इतिहास'
                    },
                    promptForm: {
                      promptPlaceholderText: 'प्रश्न पूछें',
                      promptAnsweringText: 'उत्तर दे रहे हैं...',
                      promptAskAnotherQuestionText: 'दूसरा प्रश्न पूछें',
                      promptDisclaimerText: 'AI द्वारा उत्पन्न उत्तर, त्रुटियां हो सकती हैं।',
                      promptLabelText: 'भेजने के लिए Enter, नई पंक्ति के लिए Shift+Enter।',
                      promptAriaLabelText: 'प्रश्न इनपुट'
                    },
                    conversationScreen: {
                      preToolCallText: 'खोज रहे हैं...',
                      searchingText: 'खोज रहे हैं...',
                      toolCallResultText: 'खोज की गई',
                      conversationDisclaimer: 'AI द्वारा उत्पन्न उत्तर, त्रुटियां हो सकती हैं। जांचें।',
                      reasoningText: 'तर्क कर रहे हैं...',
                      thinkingText: 'सोच रहे हैं...',
                      relatedSourcesText: 'संबंधित स्रोत',
                      stoppedStreamingText: 'आपने यह उत्तर रोक दिया',
                      copyButtonText: 'कॉपी करें',
                      copyButtonCopiedText: 'कॉपी हो गया!',
                      likeButtonTitle: 'पसंद',
                      dislikeButtonTitle: 'नापसंद',
                      thanksForFeedbackText: 'आपकी प्रतिक्रिया के लिए धन्यवाद!',
                      errorTitleText: 'चैट त्रुटि'
                    },
                    newConversationScreen: {
                      titleText: 'आज मैं आपकी कैसे मदद कर सकता हूं?',
                      introductionText: 'मैं आपके दस्तावेज़ में खोज करूंगा और सेटअप गाइड, फ़ीचर विवरण और समस्या निवारण युक्तियां जल्दी से ढूंढूंगा।'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: 'खोजें',
                buttonAriaLabel: 'खोजें'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'साफ़ करें',
                  clearButtonAriaLabel: 'खोज साफ़ करें',
                  closeButtonText: 'बंद करें',
                  closeButtonAriaLabel: 'बंद करें',
                  placeholderText: 'दस्तावेज़ खोजें या AI से पूछें',
                  placeholderTextAskAi: 'दूसरा प्रश्न दर्ज करें...',
                  placeholderTextAskAiStreaming: 'उत्तर दे रहे हैं...',
                  searchInputLabel: 'खोजें',
                  backToKeywordSearchButtonText: 'कीवर्ड खोज पर वापस जाएं',
                  backToKeywordSearchButtonAriaLabel: 'कीवर्ड खोज पर वापस जाएं',
                  newConversationPlaceholder: 'प्रश्न पूछें',
                  conversationHistoryTitle: 'मेरा बातचीत इतिहास',
                  startNewConversationText: 'नई बातचीत शुरू करें',
                  viewConversationHistoryText: 'बातचीत इतिहास',
                  threadDepthErrorPlaceholder: 'बातचीत सीमा पहुंच गई'
                },
                newConversation: {
                  newConversationTitle: 'आज मैं आपकी कैसे मदद कर सकता हूं?',
                  newConversationDescription: 'मैं आपके दस्तावेज़ में खोज करूंगा और सेटअप गाइड, फ़ीचर विवरण और समस्या निवारण युक्तियां जल्दी से ढूंढूंगा।'
                },
                footer: {
                  selectText: 'चुनें',
                  submitQuestionText: 'प्रश्न सबमिट करें',
                  selectKeyAriaLabel: 'Enter कुंजी',
                  navigateText: 'नेविगेट करें',
                  navigateUpKeyAriaLabel: 'ऊपर तीर',
                  navigateDownKeyAriaLabel: 'नीचे तीर',
                  closeText: 'बंद करें',
                  backToSearchText: 'खोज पर वापस जाएं',
                  closeKeyAriaLabel: 'Esc कुंजी',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: 'परिणाम प्राप्त नहीं हो सके',
                  helpText: 'आपको अपना नेटवर्क कनेक्शन जांचने की आवश्यकता हो सकती है।'
                },
                startScreen: {
                  recentSearchesTitle: 'हाल की',
                  noRecentSearchesText: 'कोई हालिया खोज नहीं',
                  saveRecentSearchButtonTitle: 'यह खोज सहेजें',
                  removeRecentSearchButtonTitle: 'इतिहास से यह खोज हटाएं',
                  favoriteSearchesTitle: 'पसंदीदा',
                  removeFavoriteSearchButtonTitle: 'पसंदीदा से हटाएं',
                  recentConversationsTitle: 'हाल की बातचीत',
                  removeRecentConversationButtonTitle: 'इतिहास से यह बातचीत हटाएं'
                },
                noResultsScreen: {
                  noResultsText: 'कोई प्रासंगिक परिणाम नहीं मिला',
                  suggestedQueryText: 'खोजने का प्रयास करें',
                  reportMissingResultsText: 'क्या आपको लगता है कि इस क्वेरी के लिए परिणाम होने चाहिए?',
                  reportMissingResultsLinkText: 'हमें बताएं।'
                },
                resultsScreen: {
                  askAiPlaceholder: 'AI से पूछें:',
                  noResultsAskAiPlaceholder: 'दस्तावेज़ में नहीं मिला? Ask AI आज़माएं:'
                },
                askAiScreen: {
                  disclaimerText: 'AI द्वारा उत्पन्न उत्तर, त्रुटियां हो सकती हैं। जांचें।',
                  relatedSourcesText: 'संबंधित स्रोत',
                  thinkingText: 'सोच रहे हैं...',
                  copyButtonText: 'कॉपी करें',
                  copyButtonCopiedText: 'कॉपी हो गया!',
                  copyButtonTitle: 'कॉपी करें',
                  likeButtonTitle: 'पसंद',
                  dislikeButtonTitle: 'नापसंद',
                  thanksForFeedbackText: 'आपकी प्रतिक्रिया के लिए धन्यवाद!',
                  preToolCallText: 'खोज रहे हैं...',
                  duringToolCallText: 'खोज रहे हैं...',
                  afterToolCallText: 'खोज की गई',
                  stoppedStreamingText: 'आपने यह उत्तर रोक दिया',
                  errorTitleText: 'चैट त्रुटि',
                  threadDepthExceededMessage: 'उत्तरों की सटीकता बनाए रखने के लिए यह बातचीत बंद कर दी गई।',
                  startNewConversationButtonText: 'नई बातचीत शुरू करें'
                }
              }
            },
          },
        },
        outlineTitle: "इस पृष्ठ पर",
        lastUpdatedText: "अंतिम अपडेट",
        docFooter: {
          prev: "पिछला",
          next: "अगला",
        },
        footer: {},
        editLink: {
          text: "GitHub पर इस पृष्ठ को संपादित करें",
        },
      },
    },
    'it': {
      lang: "it",
      label: "Italiano", // 意大利语
      description: "Strumenti online, strumenti gratuiti, giochi, giochi FC, giochi piccoli, elaborazione immagini, compressione immagini, conversione immagini, taglio immagini, elaborazione PDF, PDF a Word, PDF di fusione, PDF di compressione, elaborazione video, compressione video, conversione video, Base64 di codifica, conversione coordinate, download di tessere di mappa, scrittura online di parole, test iframe, conversione audio WEM in MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "Strumenti online, strumenti gratuiti, giochi, giochi FC, giochi piccoli, elaborazione immagini, compressione immagini, conversione immagini, taglio immagini, elaborazione PDF, PDF a Word, PDF di fusione, PDF di compressione, elaborazione video, compressione video, conversione video, Base64 di codifica, conversione coordinate, download di tessere di mappa, scrittura online di parole, test iframe, conversione audio WEM in MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "Torna in cima",
        sidebarMenuLabel: "Indice",
        darkModeSwitchLabel: "Cambia modalità",
        lightModeSwitchTitle: "Passa alla modalità chiara",
        darkModeSwitchTitle: "Passa alla modalità scura",
        notFound: {
          title: "Pagina non trovata",
          quote: "La pagina non esiste, controlla l'URL.",
          linkLabel: "Torna alla home",
          linkText: "Torna alla home",
        },
        search: {
          options: {
            placeholder: "Cerca nella documentazione",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: "Chiedi all'IA",
                    buttonAriaLabel: "Chiedi all'IA"
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: "Chiedi all'IA",
                      conversationHistoryTitle: 'La mia cronologia conversazioni',
                      newConversationText: 'Inizia nuova conversazione',
                      viewConversationHistoryText: 'Cronologia'
                    },
                    promptForm: {
                      promptPlaceholderText: 'Poni una domanda',
                      promptAnsweringText: 'Sto rispondendo...',
                      promptAskAnotherQuestionText: "Poni un'altra domanda",
                      promptDisclaimerText: "Risposta generata dall'IA, potrebbe contenere errori.",
                      promptLabelText: 'Invio per inviare, Shift+Invio per nuova riga.',
                      promptAriaLabelText: 'Inserimento domanda'
                    },
                    conversationScreen: {
                      preToolCallText: 'Ricerca in corso...',
                      searchingText: 'Ricerca in corso...',
                      toolCallResultText: 'Ricerca completata',
                      conversationDisclaimer: "Risposta generata dall'IA, potrebbe contenere errori. Verificare.",
                      reasoningText: 'Ragionamento in corso...',
                      thinkingText: 'Sto pensando...',
                      relatedSourcesText: 'Fonti correlate',
                      stoppedStreamingText: 'Hai interrotto questa risposta',
                      copyButtonText: 'Copia',
                      copyButtonCopiedText: 'Copiato!',
                      likeButtonTitle: 'Mi piace',
                      dislikeButtonTitle: 'Non mi piace',
                      thanksForFeedbackText: 'Grazie per il tuo feedback!',
                      errorTitleText: 'Errore chat'
                    },
                    newConversationScreen: {
                      titleText: 'Come posso aiutarti oggi?',
                      introductionText: 'Cercherò nella tua documentazione per trovare rapidamente guide di configurazione, dettagli sulle funzionalità e suggerimenti per la risoluzione dei problemi.'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: 'Cerca',
                buttonAriaLabel: 'Cerca'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'Cancella',
                  clearButtonAriaLabel: 'Cancella ricerca',
                  closeButtonText: 'Chiudi',
                  closeButtonAriaLabel: 'Chiudi',
                  placeholderText: "Cerca nella doc o chiedi all'IA",
                  placeholderTextAskAi: "Poni un'altra domanda...",
                  placeholderTextAskAiStreaming: 'Sto rispondendo...',
                  searchInputLabel: 'Cerca',
                  backToKeywordSearchButtonText: 'Torna alla ricerca per parola chiave',
                  backToKeywordSearchButtonAriaLabel: 'Torna alla ricerca per parola chiave',
                  newConversationPlaceholder: 'Poni una domanda',
                  conversationHistoryTitle: 'La mia cronologia conversazioni',
                  startNewConversationText: 'Inizia nuova conversazione',
                  viewConversationHistoryText: 'Cronologia',
                  threadDepthErrorPlaceholder: 'Limite conversazione raggiunto'
                },
                newConversation: {
                  newConversationTitle: 'Come posso aiutarti oggi?',
                  newConversationDescription: 'Cercherò nella tua documentazione per trovare rapidamente guide di configurazione, dettagli sulle funzionalità e suggerimenti per la risoluzione dei problemi.'
                },
                footer: {
                  selectText: 'Seleziona',
                  submitQuestionText: 'Invia domanda',
                  selectKeyAriaLabel: 'Tasto Invio',
                  navigateText: 'Naviga',
                  navigateUpKeyAriaLabel: 'Freccia su',
                  navigateDownKeyAriaLabel: 'Freccia giù',
                  closeText: 'Chiudi',
                  backToSearchText: 'Torna alla ricerca',
                  closeKeyAriaLabel: 'Tasto Esc',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: 'Impossibile recuperare i risultati',
                  helpText: 'Potrebbe essere necessario controllare la connessione di rete.'
                },
                startScreen: {
                  recentSearchesTitle: 'Recenti',
                  noRecentSearchesText: 'Nessuna ricerca recente',
                  saveRecentSearchButtonTitle: 'Salva questa ricerca',
                  removeRecentSearchButtonTitle: 'Rimuovi questa ricerca dalla cronologia',
                  favoriteSearchesTitle: 'Preferiti',
                  removeFavoriteSearchButtonTitle: 'Rimuovi dai preferiti',
                  recentConversationsTitle: 'Conversazioni recenti',
                  removeRecentConversationButtonTitle: 'Rimuovi questa conversazione dalla cronologia'
                },
                noResultsScreen: {
                  noResultsText: 'Nessun risultato rilevante trovato',
                  suggestedQueryText: 'Prova a cercare',
                  reportMissingResultsText: 'Pensi che questa ricerca dovrebbe avere risultati?',
                  reportMissingResultsLinkText: 'Faccelo sapere.'
                },
                resultsScreen: {
                  askAiPlaceholder: "Chiedi all'IA:",
                  noResultsAskAiPlaceholder: 'Non trovato nella doc? Prova Ask AI:'
                },
                askAiScreen: {
                  disclaimerText: "Risposta generata dall'IA, potrebbe contenere errori. Verificare.",
                  relatedSourcesText: 'Fonti correlate',
                  thinkingText: 'Sto pensando...',
                  copyButtonText: 'Copia',
                  copyButtonCopiedText: 'Copiato!',
                  copyButtonTitle: 'Copia',
                  likeButtonTitle: 'Mi piace',
                  dislikeButtonTitle: 'Non mi piace',
                  thanksForFeedbackText: 'Grazie per il tuo feedback!',
                  preToolCallText: 'Ricerca in corso...',
                  duringToolCallText: 'Ricerca in corso...',
                  afterToolCallText: 'Ricerca completata',
                  stoppedStreamingText: 'Hai interrotto questa risposta',
                  errorTitleText: 'Errore chat',
                  threadDepthExceededMessage: 'Questa conversazione è stata chiusa per mantenere la precisione delle risposte.',
                  startNewConversationButtonText: 'Inizia nuova conversazione'
                }
              }
            },
          },
        },
        outlineTitle: "In questa pagina",
        lastUpdatedText: "Ultimo aggiornamento",
        docFooter: {
          prev: "Precedente",
          next: "Successivo",
        },
        footer: {},
        editLink: {
          text: "Modifica questa pagina su GitHub",
        },
      },
    },
    'nl': {
      lang: "nl",
      label: "Nederlands", // 荷兰语
      description: "Online-tools, gratis tools, spellen, spellen FC, kleine spellen, beeldverwerking, beeldcompressie, beeldconversie, beeldknip, PDF-verwerking, PDF naar Word, PDF fusie, PDF compressie, video-verwerking, video-compressie, video-conversie, Base64-codering, coordinatentransformatie, kaarttegeltje-download, online-woordschrijven, iframe-test, WEM-audio-conversie MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "Online-tools, gratis tools, spellen, spellen FC, kleine spellen, beeldverwerking, beeldcompressie, beeldconversie, beeldknip, PDF-verwerking, PDF naar Word, PDF fusie, PDF compressie, video-verwerking, video-compressie, video-conversie, Base64-codering, coordinatentransformatie, kaarttegeltje-download, online-woordschrijven, iframe-test, WEM-audio-conversie MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "Terug naar boven",
        sidebarMenuLabel: "Inhoudsopgave",
        darkModeSwitchLabel: "Modus wisselen",
        lightModeSwitchTitle: "Naar lichte modus wisselen",
        darkModeSwitchTitle: "Naar donkere modus wisselen",
        notFound: {
          title: "Pagina niet gevonden",
          quote: "De pagina bestaat niet, controleer de URL.",
          linkLabel: "Terug naar de startpagina",
          linkText: "Terug naar de startpagina",
        },
        search: {
          options: {
            placeholder: "Documentatie doorzoeken",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: 'AI vragen',
                    buttonAriaLabel: 'AI vragen'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: 'AI vragen',
                      conversationHistoryTitle: 'Mijn gespreksgeschiedenis',
                      newConversationText: 'Nieuw gesprek starten',
                      viewConversationHistoryText: 'Geschiedenis'
                    },
                    promptForm: {
                      promptPlaceholderText: 'Stel een vraag',
                      promptAnsweringText: 'Beantwoorden...',
                      promptAskAnotherQuestionText: 'Nog een vraag stellen',
                      promptDisclaimerText: 'Antwoord gegenereerd door AI, kan fouten bevatten.',
                      promptLabelText: 'Enter om te verzenden, Shift+Enter voor nieuwe regel.',
                      promptAriaLabelText: 'Vraaginvoer'
                    },
                    conversationScreen: {
                      preToolCallText: 'Zoeken...',
                      searchingText: 'Zoeken...',
                      toolCallResultText: 'Zoekopdracht voltooid',
                      conversationDisclaimer: 'Antwoord gegenereerd door AI, kan fouten bevatten. Controleer.',
                      reasoningText: 'Redeneren...',
                      thinkingText: 'Nadenken...',
                      relatedSourcesText: 'Gerelateerde bronnen',
                      stoppedStreamingText: 'U heeft dit antwoord gestopt',
                      copyButtonText: 'Kopiëren',
                      copyButtonCopiedText: 'Gekopieerd!',
                      likeButtonTitle: 'Vind ik leuk',
                      dislikeButtonTitle: 'Vind ik niet leuk',
                      thanksForFeedbackText: 'Bedankt voor uw feedback!',
                      errorTitleText: 'Chatfout'
                    },
                    newConversationScreen: {
                      titleText: 'Hoe kan ik u vandaag helpen?',
                      introductionText: 'Ik doorzoek uw documentatie om snel installatiegidsen, functiedetails en probleemoplossingstips te vinden.'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: 'Zoeken',
                buttonAriaLabel: 'Zoeken'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'Wissen',
                  clearButtonAriaLabel: 'Zoekopdracht wissen',
                  closeButtonText: 'Sluiten',
                  closeButtonAriaLabel: 'Sluiten',
                  placeholderText: 'Documentatie doorzoeken of AI vragen',
                  placeholderTextAskAi: 'Nog een vraag invoeren...',
                  placeholderTextAskAiStreaming: 'Beantwoorden...',
                  searchInputLabel: 'Zoeken',
                  backToKeywordSearchButtonText: 'Terug naar zoeken op trefwoord',
                  backToKeywordSearchButtonAriaLabel: 'Terug naar zoeken op trefwoord',
                  newConversationPlaceholder: 'Stel een vraag',
                  conversationHistoryTitle: 'Mijn gespreksgeschiedenis',
                  startNewConversationText: 'Nieuw gesprek starten',
                  viewConversationHistoryText: 'Geschiedenis',
                  threadDepthErrorPlaceholder: 'Gesprekslimiet bereikt'
                },
                newConversation: {
                  newConversationTitle: 'Hoe kan ik u vandaag helpen?',
                  newConversationDescription: 'Ik doorzoek uw documentatie om snel installatiegidsen, functiedetails en probleemoplossingstips te vinden.'
                },
                footer: {
                  selectText: 'Selecteren',
                  submitQuestionText: 'Vraag indienen',
                  selectKeyAriaLabel: 'Enter-toets',
                  navigateText: 'Navigeren',
                  navigateUpKeyAriaLabel: 'Pijl omhoog',
                  navigateDownKeyAriaLabel: 'Pijl omlaag',
                  closeText: 'Sluiten',
                  backToSearchText: 'Terug naar zoeken',
                  closeKeyAriaLabel: 'Esc-toets',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: 'Kan geen resultaten ophalen',
                  helpText: 'U moet mogelijk uw netwerkverbinding controleren.'
                },
                startScreen: {
                  recentSearchesTitle: 'Recent',
                  noRecentSearchesText: 'Geen recente zoekopdrachten',
                  saveRecentSearchButtonTitle: 'Deze zoekopdracht opslaan',
                  removeRecentSearchButtonTitle: 'Deze zoekopdracht uit de geschiedenis verwijderen',
                  favoriteSearchesTitle: 'Favorieten',
                  removeFavoriteSearchButtonTitle: 'Uit favorieten verwijderen',
                  recentConversationsTitle: 'Recente gesprekken',
                  removeRecentConversationButtonTitle: 'Dit gesprek uit de geschiedenis verwijderen'
                },
                noResultsScreen: {
                  noResultsText: 'Geen relevante resultaten gevonden',
                  suggestedQueryText: 'Probeer te zoeken',
                  reportMissingResultsText: 'Denkt u dat deze zoekopdracht resultaten zou moeten hebben?',
                  reportMissingResultsLinkText: 'Laat het ons weten.'
                },
                resultsScreen: {
                  askAiPlaceholder: 'AI vragen:',
                  noResultsAskAiPlaceholder: 'Niet gevonden in de doc? Probeer Ask AI:'
                },
                askAiScreen: {
                  disclaimerText: 'Antwoord gegenereerd door AI, kan fouten bevatten. Controleer.',
                  relatedSourcesText: 'Gerelateerde bronnen',
                  thinkingText: 'Nadenken...',
                  copyButtonText: 'Kopiëren',
                  copyButtonCopiedText: 'Gekopieerd!',
                  copyButtonTitle: 'Kopiëren',
                  likeButtonTitle: 'Vind ik leuk',
                  dislikeButtonTitle: 'Vind ik niet leuk',
                  thanksForFeedbackText: 'Bedankt voor uw feedback!',
                  preToolCallText: 'Zoeken...',
                  duringToolCallText: 'Zoeken...',
                  afterToolCallText: 'Zoekopdracht voltooid',
                  stoppedStreamingText: 'U heeft dit antwoord gestopt',
                  errorTitleText: 'Chatfout',
                  threadDepthExceededMessage: 'Dit gesprek is gesloten om de nauwkeurigheid van antwoorden te behouden.',
                  startNewConversationButtonText: 'Nieuw gesprek starten'
                }
              }
            },
          },
        },
        outlineTitle: "Op deze pagina",
        lastUpdatedText: "Laatste update",
        docFooter: {
          prev: "Vorige",
          next: "Volgende",
        },
        footer: {},
        editLink: {
          text: "Deze pagina bewerken op GitHub",
        },
      },
    },
    'tr': {
      lang: "tr",
      label: "Türkçe", // 土耳其语
      description: "Çevrimiçi araçlar, ücretsiz araçlar, oyunlar, FC oyunları, küçük oyunlar, görüntü işleme, görüntü sıkıştırma, görüntü dönüştürme, görüntü kırpma, PDF işleme, PDF to Word, PDF birleştirme, PDF sıkıştırma, video işleme, video sıkıştırma, video dönüştürme, Base64 kodlama, koordinat dönüştürme, harita parça indirme, çevrimiçi kelime yazma, iframe testi, WEM audio dönüştürme MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "Çevrimiçi araçlar, ücretsiz araçlar, oyunlar, FC oyunları, küçük oyunlar, görüntü işleme, görüntü sıkıştırma, görüntü dönüştürme, görüntü kırpma, PDF işleme, PDF to Word, PDF birleştirme, PDF sıkıştırma, video işleme, video sıkıştırma, video dönüştürme, Base64 kodlama, koordinat dönüştürme, harita parça indirme, çevrimiçi kelime yazma, iframe testi, WEM audio dönüştürme MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "Başa dön",
        sidebarMenuLabel: "İçindekiler",
        darkModeSwitchLabel: "Modu değiştir",
        lightModeSwitchTitle: "Açık moda geç",
        darkModeSwitchTitle: "Karanlık moda geç",
        notFound: {
          title: "Sayfa bulunamadı",
          quote: "Sayfa mevcut değil, lütfen URL'yi kontrol edin.",
          linkLabel: "Ana sayfaya dön",
          linkText: "Ana sayfaya dön",
        },
        search: {
          options: {
            placeholder: "Belgelerde ara",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: "AI'ya sor",
                    buttonAriaLabel: "AI'ya sor"
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: "AI'ya sor",
                      conversationHistoryTitle: 'Konuşma geçmişim',
                      newConversationText: 'Yeni konuşma başlat',
                      viewConversationHistoryText: 'Geçmiş'
                    },
                    promptForm: {
                      promptPlaceholderText: 'Soru sor',
                      promptAnsweringText: 'Yanıtlanıyor...',
                      promptAskAnotherQuestionText: 'Başka soru sor',
                      promptDisclaimerText: 'Yapay zeka tarafından üretilen yanıt, hata içerebilir.',
                      promptLabelText: 'Göndermek için Enter, yeni satır için Shift+Enter.',
                      promptAriaLabelText: 'Soru girişi'
                    },
                    conversationScreen: {
                      preToolCallText: 'Aranıyor...',
                      searchingText: 'Aranıyor...',
                      toolCallResultText: 'Arama tamamlandı',
                      conversationDisclaimer: 'Yapay zeka tarafından üretilen yanıt, hata içerebilir. Doğrulayın.',
                      reasoningText: 'Düşünülüyor...',
                      thinkingText: 'Düşünülüyor...',
                      relatedSourcesText: 'İlgili kaynaklar',
                      stoppedStreamingText: 'Bu yanıtı durdurdunuz',
                      copyButtonText: 'Kopyala',
                      copyButtonCopiedText: 'Kopyalandı!',
                      likeButtonTitle: 'Beğen',
                      dislikeButtonTitle: 'Beğenme',
                      thanksForFeedbackText: 'Geri bildiriminiz için teşekkürler!',
                      errorTitleText: 'Sohbet hatası'
                    },
                    newConversationScreen: {
                      titleText: 'Bugün size nasıl yardımcı olabilirim?',
                      introductionText: 'Kurulum kılavuzlarını, özellik ayrıntılarını ve sorun giderme ipuçlarını hızla bulmak için belgelerinizi arayacağım.'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: 'Ara',
                buttonAriaLabel: 'Ara'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'Temizle',
                  clearButtonAriaLabel: 'Aramayı temizle',
                  closeButtonText: 'Kapat',
                  closeButtonAriaLabel: 'Kapat',
                  placeholderText: "Belgelerde ara veya AI'ya sor",
                  placeholderTextAskAi: 'Başka soru girin...',
                  placeholderTextAskAiStreaming: 'Yanıtlanıyor...',
                  searchInputLabel: 'Ara',
                  backToKeywordSearchButtonText: 'Anahtar kelime aramasına dön',
                  backToKeywordSearchButtonAriaLabel: 'Anahtar kelime aramasına dön',
                  newConversationPlaceholder: 'Soru sor',
                  conversationHistoryTitle: 'Konuşma geçmişim',
                  startNewConversationText: 'Yeni konuşma başlat',
                  viewConversationHistoryText: 'Geçmiş',
                  threadDepthErrorPlaceholder: 'Konuşma sınırına ulaşıldı'
                },
                newConversation: {
                  newConversationTitle: 'Bugün size nasıl yardımcı olabilirim?',
                  newConversationDescription: 'Kurulum kılavuzlarını, özellik ayrıntılarını ve sorun giderme ipuçlarını hızla bulmak için belgelerinizi arayacağım.'
                },
                footer: {
                  selectText: 'Seç',
                  submitQuestionText: 'Soru gönder',
                  selectKeyAriaLabel: 'Enter tuşu',
                  navigateText: 'Gezin',
                  navigateUpKeyAriaLabel: 'Yukarı ok',
                  navigateDownKeyAriaLabel: 'Aşağı ok',
                  closeText: 'Kapat',
                  backToSearchText: 'Aramaya dön',
                  closeKeyAriaLabel: 'Esc tuşu',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: 'Sonuçlar alınamadı',
                  helpText: 'Ağ bağlantınızı kontrol etmeniz gerekebilir.'
                },
                startScreen: {
                  recentSearchesTitle: 'Son',
                  noRecentSearchesText: 'Son arama yok',
                  saveRecentSearchButtonTitle: 'Bu aramayı kaydet',
                  removeRecentSearchButtonTitle: 'Bu aramayı geçmişten kaldır',
                  favoriteSearchesTitle: 'Favoriler',
                  removeFavoriteSearchButtonTitle: 'Favorilerden kaldır',
                  recentConversationsTitle: 'Son konuşmalar',
                  removeRecentConversationButtonTitle: 'Bu konuşmayı geçmişten kaldır'
                },
                noResultsScreen: {
                  noResultsText: 'İlgili sonuç bulunamadı',
                  suggestedQueryText: 'Aramayı deneyin',
                  reportMissingResultsText: 'Bu sorgunun sonuçları olması gerektiğini düşünüyor musunuz?',
                  reportMissingResultsLinkText: 'Bize bildirin.'
                },
                resultsScreen: {
                  askAiPlaceholder: "AI'ya sor:",
                  noResultsAskAiPlaceholder: "Belgede bulamadınız mı? Ask AI'yı deneyin:"
                },
                askAiScreen: {
                  disclaimerText: 'Yapay zeka tarafından üretilen yanıt, hata içerebilir. Doğrulayın.',
                  relatedSourcesText: 'İlgili kaynaklar',
                  thinkingText: 'Düşünülüyor...',
                  copyButtonText: 'Kopyala',
                  copyButtonCopiedText: 'Kopyalandı!',
                  copyButtonTitle: 'Kopyala',
                  likeButtonTitle: 'Beğen',
                  dislikeButtonTitle: 'Beğenme',
                  thanksForFeedbackText: 'Geri bildiriminiz için teşekkürler!',
                  preToolCallText: 'Aranıyor...',
                  duringToolCallText: 'Aranıyor...',
                  afterToolCallText: 'Arama tamamlandı',
                  stoppedStreamingText: 'Bu yanıtı durdurdunuz',
                  errorTitleText: 'Sohbet hatası',
                  threadDepthExceededMessage: 'Yanıt doğruluğunu korumak için bu konuşma kapatıldı.',
                  startNewConversationButtonText: 'Yeni konuşma başlat'
                }
              }
            },
          },
        },
        outlineTitle: "Bu sayfada",
        lastUpdatedText: "Son güncelleme",
        docFooter: {
          prev: "Önceki",
          next: "Sonraki",
        },
        footer: {},
        editLink: {
          text: "Bu sayfayı GitHub'da düzenle",
        },
      },
    },
    'vi': {
      lang: "vi",
      label: "Tiếng Việt", // 越南语
      description: "Công cụ trực tuyến, công cụ miễn phí, trò chơi, trò chơi FC, trò chơi nhỏ, xử lý ảnh, nén ảnh, chuyển đổi ảnh, cắt ảnh, xử lý PDF, PDF to Word, PDF hợp nhất, PDF nén, xử lý video, nén video, chuyển đổi video, Base64 mã hóa, chuyển đổi tọa độ, tải xuống khối ảnh bản đồ, viết từ trực tuyến, kiểm tra iframe, chuyển đổi âm thanh WEM thành MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "Công cụ trực tuyến, công cụ miễn phí, trò chơi, trò chơi FC, trò chơi nhỏ, xử lý ảnh, nén ảnh, chuyển đổi ảnh, cắt ảnh, xử lý PDF, PDF to Word, PDF hợp nhất, PDF nén, xử lý video, nén video, chuyển đổi video, Base64 mã hóa, chuyển đổi tọa độ, tải xuống khối ảnh bản đồ, viết từ trực tuyến, kiểm tra iframe, chuyển đổi âm thanh WEM thành MP3",
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
                    buttonText: 'Hỏi AI',
                    buttonAriaLabel: 'Hỏi AI'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: 'Hỏi AI',
                      conversationHistoryTitle: 'Lịch sử hội thoại của tôi',
                      newConversationText: 'Bắt đầu hội thoại mới',
                      viewConversationHistoryText: 'Lịch sử hội thoại'
                    },
                    promptForm: {
                      promptPlaceholderText: 'Đặt câu hỏi',
                      promptAnsweringText: 'Đang trả lời...',
                      promptAskAnotherQuestionText: 'Đặt câu hỏi khác',
                      promptDisclaimerText: 'Câu trả lời do AI tạo ra, có thể có lỗi.',
                      promptLabelText: 'Enter để gửi, Shift+Enter để xuống dòng.',
                      promptAriaLabelText: 'Nhập câu hỏi'
                    },
                    conversationScreen: {
                      preToolCallText: 'Đang tìm kiếm...',
                      searchingText: 'Đang tìm kiếm...',
                      toolCallResultText: 'Đã tìm kiếm',
                      conversationDisclaimer: 'Câu trả lời do AI tạo ra, có thể có lỗi. Hãy kiểm tra.',
                      reasoningText: 'Đang suy luận...',
                      thinkingText: 'Đang suy nghĩ...',
                      relatedSourcesText: 'Nguồn liên quan',
                      stoppedStreamingText: 'Bạn đã dừng phản hồi này',
                      copyButtonText: 'Sao chép',
                      copyButtonCopiedText: 'Đã sao chép!',
                      likeButtonTitle: 'Thích',
                      dislikeButtonTitle: 'Không thích',
                      thanksForFeedbackText: 'Cảm ơn phản hồi của bạn!',
                      errorTitleText: 'Lỗi trò chuyện'
                    },
                    newConversationScreen: {
                      titleText: 'Hôm nay tôi có thể giúp gì cho bạn?',
                      introductionText: 'Tôi sẽ tìm kiếm trong tài liệu của bạn để nhanh chóng tìm thấy hướng dẫn cài đặt, chi tiết tính năng và mẹo xử lý sự cố.'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: 'Tìm kiếm',
                buttonAriaLabel: 'Tìm kiếm'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'Xóa',
                  clearButtonAriaLabel: 'Xóa tìm kiếm',
                  closeButtonText: 'Đóng',
                  closeButtonAriaLabel: 'Đóng',
                  placeholderText: 'Tìm kiếm tài liệu hoặc hỏi AI',
                  placeholderTextAskAi: 'Nhập câu hỏi khác...',
                  placeholderTextAskAiStreaming: 'Đang trả lời...',
                  searchInputLabel: 'Tìm kiếm',
                  backToKeywordSearchButtonText: 'Quay lại tìm kiếm từ khóa',
                  backToKeywordSearchButtonAriaLabel: 'Quay lại tìm kiếm từ khóa',
                  newConversationPlaceholder: 'Đặt câu hỏi',
                  conversationHistoryTitle: 'Lịch sử hội thoại của tôi',
                  startNewConversationText: 'Bắt đầu hội thoại mới',
                  viewConversationHistoryText: 'Lịch sử hội thoại',
                  threadDepthErrorPlaceholder: 'Đã đạt giới hạn hội thoại'
                },
                newConversation: {
                  newConversationTitle: 'Hôm nay tôi có thể giúp gì cho bạn?',
                  newConversationDescription: 'Tôi sẽ tìm kiếm trong tài liệu của bạn để nhanh chóng tìm thấy hướng dẫn cài đặt, chi tiết tính năng và mẹo xử lý sự cố.'
                },
                footer: {
                  selectText: 'Chọn',
                  submitQuestionText: 'Gửi câu hỏi',
                  selectKeyAriaLabel: 'Phím Enter',
                  navigateText: 'Điều hướng',
                  navigateUpKeyAriaLabel: 'Mũi tên lên',
                  navigateDownKeyAriaLabel: 'Mũi tên xuống',
                  closeText: 'Đóng',
                  backToSearchText: 'Quay lại tìm kiếm',
                  closeKeyAriaLabel: 'Phím Esc',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: 'Không thể tải kết quả',
                  helpText: 'Bạn có thể cần kiểm tra kết nối mạng.'
                },
                startScreen: {
                  recentSearchesTitle: 'Gần đây',
                  noRecentSearchesText: 'Không có tìm kiếm gần đây',
                  saveRecentSearchButtonTitle: 'Lưu tìm kiếm này',
                  removeRecentSearchButtonTitle: 'Xóa tìm kiếm này khỏi lịch sử',
                  favoriteSearchesTitle: 'Yêu thích',
                  removeFavoriteSearchButtonTitle: 'Xóa khỏi yêu thích',
                  recentConversationsTitle: 'Hội thoại gần đây',
                  removeRecentConversationButtonTitle: 'Xóa hội thoại này khỏi lịch sử'
                },
                noResultsScreen: {
                  noResultsText: 'Không tìm thấy kết quả liên quan',
                  suggestedQueryText: 'Hãy thử tìm kiếm',
                  reportMissingResultsText: 'Bạn nghĩ truy vấn này nên có kết quả?',
                  reportMissingResultsLinkText: 'Hãy cho chúng tôi biết.'
                },
                resultsScreen: {
                  askAiPlaceholder: 'Hỏi AI:',
                  noResultsAskAiPlaceholder: 'Không tìm thấy trong tài liệu? Hãy thử Ask AI:'
                },
                askAiScreen: {
                  disclaimerText: 'Câu trả lời do AI tạo ra, có thể có lỗi. Hãy kiểm tra.',
                  relatedSourcesText: 'Nguồn liên quan',
                  thinkingText: 'Đang suy nghĩ...',
                  copyButtonText: 'Sao chép',
                  copyButtonCopiedText: 'Đã sao chép!',
                  copyButtonTitle: 'Sao chép',
                  likeButtonTitle: 'Thích',
                  dislikeButtonTitle: 'Không thích',
                  thanksForFeedbackText: 'Cảm ơn phản hồi của bạn!',
                  preToolCallText: 'Đang tìm kiếm...',
                  duringToolCallText: 'Đang tìm kiếm...',
                  afterToolCallText: 'Đã tìm kiếm',
                  stoppedStreamingText: 'Bạn đã dừng phản hồi này',
                  errorTitleText: 'Lỗi trò chuyện',
                  threadDepthExceededMessage: 'Cuộc hội thoại này đã bị đóng để duy trì độ chính xác của câu trả lời.',
                  startNewConversationButtonText: 'Bắt đầu hội thoại mới'
                }
              }
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
    },
    'th': {
      lang: "th",
      label: "ภาษาไทย", // 泰语
      description: "เครื่องมือออนไลน์, เครื่องมือฟรี, เกม, เกม FC, เกมเล็ก, การประมวลผลรูปภาพ, การบีบอัดรูปภาพ, การแปลงรูปภาพ, การตัดรูปภาพ, การประมวลผล PDF, PDF เป็น Word, PDF รวม, PDF บีบอัด, การประมวลผลวิดีโอ, การบีบอัดวิดีโอ, การแปลงวิดีโอ, Base64 การเขียนรหัส, การแปลงพิกัด, ดาวน์โหลดกริดแผนที่, เขียนคำออนไลน์, ทดสอบ iframe, แปลงเสียง WEM เป็น MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "เครื่องมือออนไลน์, เครื่องมือฟรี, เกม, เกม FC, เกมเล็ก, การประมวลผลรูปภาพ, การบีบอัดรูปภาพ, การแปลงรูปภาพ, การตัดรูปภาพ, การประมวลผล PDF, PDF เป็น Word, PDF รวม, PDF บีบอัด, การประมวลผลวิดีโอ, การบีบอัดวิดีโอ, การแปลงวิดีโอ, Base64 การเขียนรหัส, การแปลงพิกัด, ดาวน์โหลดกริดแผนที่, เขียนคำออนไลน์, ทดสอบ iframe, แปลงเสียง WEM เป็น MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "กลับสู่ด้านบน",
        sidebarMenuLabel: "สารบัญ",
        darkModeSwitchLabel: "สลับโหมด",
        lightModeSwitchTitle: "เปลี่ยนเป็นโหมดสว่าง",
        darkModeSwitchTitle: "เปลี่ยนเป็นโหมดมืด",
        notFound: {
          title: "ไม่พบหน้า",
          quote: "ไม่พบหน้า กรุณาตรวจสอบ URL",
          linkLabel: "กลับสู่หน้าหลัก",
          linkText: "กลับสู่หน้าหลัก",
        },
        search: {
          options: {
            placeholder: "ค้นหาเอกสาร",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: 'ถาม AI',
                    buttonAriaLabel: 'ถาม AI'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: 'ถาม AI',
                      conversationHistoryTitle: 'ประวัติการสนทนาของฉัน',
                      newConversationText: 'เริ่มการสนทนาใหม่',
                      viewConversationHistoryText: 'ประวัติการสนทนา'
                    },
                    promptForm: {
                      promptPlaceholderText: 'ถามคำถาม',
                      promptAnsweringText: 'กำลังตอบ...',
                      promptAskAnotherQuestionText: 'ถามคำถามอื่น',
                      promptDisclaimerText: 'คำตอบสร้างโดย AI อาจมีข้อผิดพลาด',
                      promptLabelText: 'Enter เพื่อส่ง, Shift+Enter เพื่อขึ้นบรรทัดใหม่',
                      promptAriaLabelText: 'ป้อนคำถาม'
                    },
                    conversationScreen: {
                      preToolCallText: 'กำลังค้นหา...',
                      searchingText: 'กำลังค้นหา...',
                      toolCallResultText: 'ค้นหาแล้ว',
                      conversationDisclaimer: 'คำตอบสร้างโดย AI อาจมีข้อผิดพลาด กรุณาตรวจสอบ',
                      reasoningText: 'กำลังวิเคราะห์...',
                      thinkingText: 'กำลังคิด...',
                      relatedSourcesText: 'แหล่งที่มาที่เกี่ยวข้อง',
                      stoppedStreamingText: 'คุณหยุดการตอบนี้แล้ว',
                      copyButtonText: 'คัดลอก',
                      copyButtonCopiedText: 'คัดลอกแล้ว!',
                      likeButtonTitle: 'ชอบ',
                      dislikeButtonTitle: 'ไม่ชอบ',
                      thanksForFeedbackText: 'ขอบคุณสำหรับความคิดเห็น!',
                      errorTitleText: 'ข้อผิดพลาดในการแชท'
                    },
                    newConversationScreen: {
                      titleText: 'วันนี้ฉันจะช่วยคุณได้อย่างไร?',
                      introductionText: 'ฉันจะค้นหาในเอกสารของคุณเพื่อค้นหาคู่มือการตั้งค่า รายละเอียดฟีเจอร์ และเคล็ดลับการแก้ปัญหาอย่างรวดเร็ว'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: 'ค้นหา',
                buttonAriaLabel: 'ค้นหา'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'ล้าง',
                  clearButtonAriaLabel: 'ล้างการค้นหา',
                  closeButtonText: 'ปิด',
                  closeButtonAriaLabel: 'ปิด',
                  placeholderText: 'ค้นหาเอกสารหรือถาม AI',
                  placeholderTextAskAi: 'ป้อนคำถามอื่น...',
                  placeholderTextAskAiStreaming: 'กำลังตอบ...',
                  searchInputLabel: 'ค้นหา',
                  backToKeywordSearchButtonText: 'กลับไปค้นหาด้วยคีย์เวิร์ด',
                  backToKeywordSearchButtonAriaLabel: 'กลับไปค้นหาด้วยคีย์เวิร์ด',
                  newConversationPlaceholder: 'ถามคำถาม',
                  conversationHistoryTitle: 'ประวัติการสนทนาของฉัน',
                  startNewConversationText: 'เริ่มการสนทนาใหม่',
                  viewConversationHistoryText: 'ประวัติการสนทนา',
                  threadDepthErrorPlaceholder: 'ถึงขีดจำกัดการสนทนา'
                },
                newConversation: {
                  newConversationTitle: 'วันนี้ฉันจะช่วยคุณได้อย่างไร?',
                  newConversationDescription: 'ฉันจะค้นหาในเอกสารของคุณเพื่อค้นหาคู่มือการตั้งค่า รายละเอียดฟีเจอร์ และเคล็ดลับการแก้ปัญหาอย่างรวดเร็ว'
                },
                footer: {
                  selectText: 'เลือก',
                  submitQuestionText: 'ส่งคำถาม',
                  selectKeyAriaLabel: 'ปุ่ม Enter',
                  navigateText: 'นำทาง',
                  navigateUpKeyAriaLabel: 'ลูกศรขึ้น',
                  navigateDownKeyAriaLabel: 'ลูกศรลง',
                  closeText: 'ปิด',
                  backToSearchText: 'กลับไปค้นหา',
                  closeKeyAriaLabel: 'ปุ่ม Esc',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: 'ไม่สามารถดึงผลลัพธ์ได้',
                  helpText: 'คุณอาจต้องตรวจสอบการเชื่อมต่อเครือข่าย'
                },
                startScreen: {
                  recentSearchesTitle: 'ล่าสุด',
                  noRecentSearchesText: 'ไม่มีการค้นหาล่าสุด',
                  saveRecentSearchButtonTitle: 'บันทึกการค้นหานี้',
                  removeRecentSearchButtonTitle: 'ลบการค้นหานี้ออกจากประวัติ',
                  favoriteSearchesTitle: 'รายการโปรด',
                  removeFavoriteSearchButtonTitle: 'ลบออกจากรายการโปรด',
                  recentConversationsTitle: 'การสนทนาล่าสุด',
                  removeRecentConversationButtonTitle: 'ลบการสนทนานี้ออกจากประวัติ'
                },
                noResultsScreen: {
                  noResultsText: 'ไม่พบผลลัพธ์ที่เกี่ยวข้อง',
                  suggestedQueryText: 'ลองค้นหา',
                  reportMissingResultsText: 'คุณคิดว่าการค้นหานี้ควรมีผลลัพธ์?',
                  reportMissingResultsLinkText: 'แจ้งให้เราทราบ'
                },
                resultsScreen: {
                  askAiPlaceholder: 'ถาม AI:',
                  noResultsAskAiPlaceholder: 'ไม่พบในเอกสาร? ลอง Ask AI:'
                },
                askAiScreen: {
                  disclaimerText: 'คำตอบสร้างโดย AI อาจมีข้อผิดพลาด กรุณาตรวจสอบ',
                  relatedSourcesText: 'แหล่งที่มาที่เกี่ยวข้อง',
                  thinkingText: 'กำลังคิด...',
                  copyButtonText: 'คัดลอก',
                  copyButtonCopiedText: 'คัดลอกแล้ว!',
                  copyButtonTitle: 'คัดลอก',
                  likeButtonTitle: 'ชอบ',
                  dislikeButtonTitle: 'ไม่ชอบ',
                  thanksForFeedbackText: 'ขอบคุณสำหรับความคิดเห็น!',
                  preToolCallText: 'กำลังค้นหา...',
                  duringToolCallText: 'กำลังค้นหา...',
                  afterToolCallText: 'ค้นหาแล้ว',
                  stoppedStreamingText: 'คุณหยุดการตอบนี้แล้ว',
                  errorTitleText: 'ข้อผิดพลาดในการแชท',
                  threadDepthExceededMessage: 'การสนทนานี้ถูกปิดเพื่อรักษาความถูกต้องของคำตอบ',
                  startNewConversationButtonText: 'เริ่มการสนทนาใหม่'
                }
              }
            },
          },
        },
        outlineTitle: "ในหน้านี้",
        lastUpdatedText: "อัปเดตล่าสุด",
        docFooter: {
          prev: "ก่อนหน้า",
          next: "ถัดไป",
        },
        footer: {},
        editLink: {
          text: "แก้ไขหน้านี้บน GitHub",
        },
      },
    },
    'id': {
      lang: "id",
      label: "Bahasa Indonesia", // 印度尼西亚语
      description: "Alat online, alat gratis, permainan, permainan FC, permainan kecil, pemrosesan gambar, pemampatan gambar, konversi gambar, potongan gambar, pemrosesan PDF, PDF ke Word, PDF penggabungan, PDF pemampatan, pemrosesan video, pemampatan video, konversi video, Base64 pengkodean, konversi koordinat, pengunduhan ubin peta, menulis kata online, tes iframe, konversi audio WEM ke MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "Alat online, alat gratis, permainan, permainan FC, permainan kecil, pemrosesan gambar, pemampatan gambar, konversi gambar, potongan gambar, pemrosesan PDF, PDF ke Word, PDF penggabungan, PDF pemampatan, pemrosesan video, pemampatan video, konversi video, Base64 pengkodean, konversi koordinat, pengunduhan ubin peta, menulis kata online, tes iframe, konversi audio WEM ke MP3",
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
                    buttonText: 'Tanya AI',
                    buttonAriaLabel: 'Tanya AI'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: 'Tanya AI',
                      conversationHistoryTitle: 'Riwayat percakapan saya',
                      newConversationText: 'Mulai percakapan baru',
                      viewConversationHistoryText: 'Riwayat percakapan'
                    },
                    promptForm: {
                      promptPlaceholderText: 'Ajukan pertanyaan',
                      promptAnsweringText: 'Sedang menjawab...',
                      promptAskAnotherQuestionText: 'Ajukan pertanyaan lain',
                      promptDisclaimerText: 'Jawaban dihasilkan oleh AI, mungkin mengandung kesalahan.',
                      promptLabelText: 'Enter untuk mengirim, Shift+Enter untuk baris baru.',
                      promptAriaLabelText: 'Input pertanyaan'
                    },
                    conversationScreen: {
                      preToolCallText: 'Mencari...',
                      searchingText: 'Mencari...',
                      toolCallResultText: 'Pencarian selesai',
                      conversationDisclaimer: 'Jawaban dihasilkan oleh AI, mungkin mengandung kesalahan. Periksa.',
                      reasoningText: 'Memproses...',
                      thinkingText: 'Berpikir...',
                      relatedSourcesText: 'Sumber terkait',
                      stoppedStreamingText: 'Anda menghentikan respons ini',
                      copyButtonText: 'Salin',
                      copyButtonCopiedText: 'Disalin!',
                      likeButtonTitle: 'Suka',
                      dislikeButtonTitle: 'Tidak suka',
                      thanksForFeedbackText: 'Terima kasih atas masukan Anda!',
                      errorTitleText: 'Kesalahan obrolan'
                    },
                    newConversationScreen: {
                      titleText: 'Bagaimana saya bisa membantu Anda hari ini?',
                      introductionText: 'Saya akan mencari di dokumentasi Anda untuk menemukan panduan penyiapan, detail fitur, dan tips pemecahan masalah dengan cepat.'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: 'Cari',
                buttonAriaLabel: 'Cari'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'Hapus',
                  clearButtonAriaLabel: 'Hapus pencarian',
                  closeButtonText: 'Tutup',
                  closeButtonAriaLabel: 'Tutup',
                  placeholderText: 'Cari dokumentasi atau tanya AI',
                  placeholderTextAskAi: 'Masukkan pertanyaan lain...',
                  placeholderTextAskAiStreaming: 'Sedang menjawab...',
                  searchInputLabel: 'Cari',
                  backToKeywordSearchButtonText: 'Kembali ke pencarian kata kunci',
                  backToKeywordSearchButtonAriaLabel: 'Kembali ke pencarian kata kunci',
                  newConversationPlaceholder: 'Ajukan pertanyaan',
                  conversationHistoryTitle: 'Riwayat percakapan saya',
                  startNewConversationText: 'Mulai percakapan baru',
                  viewConversationHistoryText: 'Riwayat percakapan',
                  threadDepthErrorPlaceholder: 'Batas percakapan tercapai'
                },
                newConversation: {
                  newConversationTitle: 'Bagaimana saya bisa membantu Anda hari ini?',
                  newConversationDescription: 'Saya akan mencari di dokumentasi Anda untuk menemukan panduan penyiapan, detail fitur, dan tips pemecahan masalah dengan cepat.'
                },
                footer: {
                  selectText: 'Pilih',
                  submitQuestionText: 'Kirim pertanyaan',
                  selectKeyAriaLabel: 'Tombol Enter',
                  navigateText: 'Navigasi',
                  navigateUpKeyAriaLabel: 'Panah atas',
                  navigateDownKeyAriaLabel: 'Panah bawah',
                  closeText: 'Tutup',
                  backToSearchText: 'Kembali ke pencarian',
                  closeKeyAriaLabel: 'Tombol Esc',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: 'Tidak dapat mengambil hasil',
                  helpText: 'Anda mungkin perlu memeriksa koneksi jaringan Anda.'
                },
                startScreen: {
                  recentSearchesTitle: 'Terbaru',
                  noRecentSearchesText: 'Tidak ada pencarian terbaru',
                  saveRecentSearchButtonTitle: 'Simpan pencarian ini',
                  removeRecentSearchButtonTitle: 'Hapus pencarian ini dari riwayat',
                  favoriteSearchesTitle: 'Favorit',
                  removeFavoriteSearchButtonTitle: 'Hapus dari favorit',
                  recentConversationsTitle: 'Percakapan terbaru',
                  removeRecentConversationButtonTitle: 'Hapus percakapan ini dari riwayat'
                },
                noResultsScreen: {
                  noResultsText: 'Tidak ditemukan hasil yang relevan',
                  suggestedQueryText: 'Coba cari',
                  reportMissingResultsText: 'Apakah Anda pikir kueri ini seharusnya memiliki hasil?',
                  reportMissingResultsLinkText: 'Beritahu kami.'
                },
                resultsScreen: {
                  askAiPlaceholder: 'Tanya AI:',
                  noResultsAskAiPlaceholder: 'Tidak ditemukan di dokumen? Coba Ask AI:'
                },
                askAiScreen: {
                  disclaimerText: 'Jawaban dihasilkan oleh AI, mungkin mengandung kesalahan. Periksa.',
                  relatedSourcesText: 'Sumber terkait',
                  thinkingText: 'Berpikir...',
                  copyButtonText: 'Salin',
                  copyButtonCopiedText: 'Disalin!',
                  copyButtonTitle: 'Salin',
                  likeButtonTitle: 'Suka',
                  dislikeButtonTitle: 'Tidak suka',
                  thanksForFeedbackText: 'Terima kasih atas masukan Anda!',
                  preToolCallText: 'Mencari...',
                  duringToolCallText: 'Mencari...',
                  afterToolCallText: 'Pencarian selesai',
                  stoppedStreamingText: 'Anda menghentikan respons ini',
                  errorTitleText: 'Kesalahan obrolan',
                  threadDepthExceededMessage: 'Percakapan ini ditutup untuk menjaga akurasi jawaban.',
                  startNewConversationButtonText: 'Mulai percakapan baru'
                }
              }
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
    },
    'pl': {
      lang: "pl",
      label: "Polski", // 波兰语
      description: "Narzędzia online, narzędzia darmowe, gry, gry FC, gry małe, przetwarzanie obrazu, kompresja obrazu, konwersja obrazu, przycinanie obrazu, przetwarzanie PDF, PDF do Word, PDF łączenie, PDF kompresja, przetwarzanie wideo, kompresja wideo, konwersja wideo, Base64 kodowanie, konwersja współrzędnych, pobieranie kafelków mapy, pisanie słów online, test iframe, konwersja audio WEM do MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "Narzędzia online, narzędzia darmowe, gry, gry FC, gry małe, przetwarzanie obrazu, kompresja obrazu, konwersja obrazu, przycinanie obrazu, przetwarzanie PDF, PDF do Word, PDF łączenie, PDF kompresja, przetwarzanie wideo, kompresja wideo, konwersja wideo, Base64 kodowanie, konwersja współrzędnych, pobieranie kafelków mapy, pisanie słów online, test iframe, konwersja audio WEM do MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "Powrót na górę",
        sidebarMenuLabel: "Spis treści",
        darkModeSwitchLabel: "Zmień tryb",
        lightModeSwitchTitle: "Przełącz na tryb jasny",
        darkModeSwitchTitle: "Przełącz na tryb ciemny",
        notFound: {
          title: "Strona nie istnieje",
          quote: "Strona nie istnieje, sprawdź URL.",
          linkLabel: "Wróć do strony głównej",
          linkText: "Wróć do strony głównej",
        },
        search: {
          options: {
            placeholder: "Wyszukaj w dokumentacji",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: 'Zapytaj AI',
                    buttonAriaLabel: 'Zapytaj AI'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: 'Zapytaj AI',
                      conversationHistoryTitle: 'Moja historia rozmów',
                      newConversationText: 'Rozpocznij nową rozmowę',
                      viewConversationHistoryText: 'Historia rozmów'
                    },
                    promptForm: {
                      promptPlaceholderText: 'Zadaj pytanie',
                      promptAnsweringText: 'Odpowiadanie...',
                      promptAskAnotherQuestionText: 'Zadaj kolejne pytanie',
                      promptDisclaimerText: 'Odpowiedź wygenerowana przez AI, może zawierać błędy.',
                      promptLabelText: 'Enter aby wysłać, Shift+Enter aby przejść do nowej linii.',
                      promptAriaLabelText: 'Pole pytania'
                    },
                    conversationScreen: {
                      preToolCallText: 'Wyszukiwanie...',
                      searchingText: 'Wyszukiwanie...',
                      toolCallResultText: 'Wyszukiwanie zakończone',
                      conversationDisclaimer: 'Odpowiedź wygenerowana przez AI, może zawierać błędy. Sprawdź.',
                      reasoningText: 'Przetwarzanie...',
                      thinkingText: 'Myślenie...',
                      relatedSourcesText: 'Powiązane źródła',
                      stoppedStreamingText: 'Zatrzymałeś tę odpowiedź',
                      copyButtonText: 'Kopiuj',
                      copyButtonCopiedText: 'Skopiowano!',
                      likeButtonTitle: 'Lubię to',
                      dislikeButtonTitle: 'Nie lubię',
                      thanksForFeedbackText: 'Dziękujemy za opinię!',
                      errorTitleText: 'Błąd czatu'
                    },
                    newConversationScreen: {
                      titleText: 'Jak mogę Ci dzisiaj pomóc?',
                      introductionText: 'Przeszukam dokumentację, aby szybko znaleźć przewodniki konfiguracji, szczegóły funkcji i wskazówki dotyczące rozwiązywania problemów.'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: 'Szukaj',
                buttonAriaLabel: 'Szukaj'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'Wyczyść',
                  clearButtonAriaLabel: 'Wyczyść wyszukiwanie',
                  closeButtonText: 'Zamknij',
                  closeButtonAriaLabel: 'Zamknij',
                  placeholderText: 'Wyszukaj w dokumentacji lub zapytaj AI',
                  placeholderTextAskAi: 'Wprowadź kolejne pytanie...',
                  placeholderTextAskAiStreaming: 'Odpowiadanie...',
                  searchInputLabel: 'Szukaj',
                  backToKeywordSearchButtonText: 'Wróć do wyszukiwania słów kluczowych',
                  backToKeywordSearchButtonAriaLabel: 'Wróć do wyszukiwania słów kluczowych',
                  newConversationPlaceholder: 'Zadaj pytanie',
                  conversationHistoryTitle: 'Moja historia rozmów',
                  startNewConversationText: 'Rozpocznij nową rozmowę',
                  viewConversationHistoryText: 'Historia rozmów',
                  threadDepthErrorPlaceholder: 'Osiągnięto limit rozmowy'
                },
                newConversation: {
                  newConversationTitle: 'Jak mogę Ci dzisiaj pomóc?',
                  newConversationDescription: 'Przeszukam dokumentację, aby szybko znaleźć przewodniki konfiguracji, szczegóły funkcji i wskazówki dotyczące rozwiązywania problemów.'
                },
                footer: {
                  selectText: 'Wybierz',
                  submitQuestionText: 'Wyślij pytanie',
                  selectKeyAriaLabel: 'Klawisz Enter',
                  navigateText: 'Nawiguj',
                  navigateUpKeyAriaLabel: 'Strzałka w górę',
                  navigateDownKeyAriaLabel: 'Strzałka w dół',
                  closeText: 'Zamknij',
                  backToSearchText: 'Wróć do wyszukiwania',
                  closeKeyAriaLabel: 'Klawisz Esc',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: 'Nie można pobrać wyników',
                  helpText: 'Być może musisz sprawdzić połączenie sieciowe.'
                },
                startScreen: {
                  recentSearchesTitle: 'Ostatnie',
                  noRecentSearchesText: 'Brak ostatnich wyszukiwań',
                  saveRecentSearchButtonTitle: 'Zapisz to wyszukiwanie',
                  removeRecentSearchButtonTitle: 'Usuń to wyszukiwanie z historii',
                  favoriteSearchesTitle: 'Ulubione',
                  removeFavoriteSearchButtonTitle: 'Usuń z ulubionych',
                  recentConversationsTitle: 'Ostatnie rozmowy',
                  removeRecentConversationButtonTitle: 'Usuń tę rozmowę z historii'
                },
                noResultsScreen: {
                  noResultsText: 'Nie znaleziono odpowiednich wyników',
                  suggestedQueryText: 'Spróbuj wyszukać',
                  reportMissingResultsText: 'Czy uważasz, że to zapytanie powinno mieć wyniki?',
                  reportMissingResultsLinkText: 'Daj nam znać.'
                },
                resultsScreen: {
                  askAiPlaceholder: 'Zapytaj AI:',
                  noResultsAskAiPlaceholder: 'Nie znaleziono w dokumentacji? Wypróbuj Ask AI:'
                },
                askAiScreen: {
                  disclaimerText: 'Odpowiedź wygenerowana przez AI, może zawierać błędy. Sprawdź.',
                  relatedSourcesText: 'Powiązane źródła',
                  thinkingText: 'Myślenie...',
                  copyButtonText: 'Kopiuj',
                  copyButtonCopiedText: 'Skopiowano!',
                  copyButtonTitle: 'Kopiuj',
                  likeButtonTitle: 'Lubię to',
                  dislikeButtonTitle: 'Nie lubię',
                  thanksForFeedbackText: 'Dziękujemy za opinię!',
                  preToolCallText: 'Wyszukiwanie...',
                  duringToolCallText: 'Wyszukiwanie...',
                  afterToolCallText: 'Wyszukiwanie zakończone',
                  stoppedStreamingText: 'Zatrzymałeś tę odpowiedź',
                  errorTitleText: 'Błąd czatu',
                  threadDepthExceededMessage: 'Ta rozmowa została zamknięta, aby zachować dokładność odpowiedzi.',
                  startNewConversationButtonText: 'Rozpocznij nową rozmowę'
                }
              }
            },
          },
        },
        outlineTitle: "Na tej stronie",
        lastUpdatedText: "Ostatnia aktualizacja",
        docFooter: {
          prev: "Poprzedni",
          next: "Następny",
        },
        footer: {},
        editLink: {
          text: "Edytuj tę stronę na GitHub",
        },
      },
    },
    'sv': {
      lang: "sv",
      label: "Svenska", // 瑞典语
      description: "Verktyg online, gratis verktyg, spel, spel FC, små spel, bildbehandling, bildkompression, bildkonvertering, bildklipp, PDF-behandling, PDF till Word, PDF sammanföring, PDF kompression, video-behandling, video-kompression, video-konvertering, Base64-kodning, koordinattransformation, karttäcke-hämtning, online-ordskrivning, iframe-test, WEM-audio-konvertering MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "Verktyg online, gratis verktyg, spel, spel FC, små spel, bildbehandling, bildkompression, bildkonvertering, bildklipp, PDF-behandling, PDF till Word, PDF sammanföring, PDF kompression, video-behandling, video-kompression, video-konvertering, Base64-kodning, koordinattransformation, karttäcke-hämtning, online-ordskrivning, iframe-test, WEM-audio-konvertering MP3",
          },
        ],
      ],
      themeConfig: {
        returnToTopLabel: "Tillbaka till toppen",
        sidebarMenuLabel: "Innehållsförteckning",
        darkModeSwitchLabel: "Byt läge",
        lightModeSwitchTitle: "Byt till ljust läge",
        darkModeSwitchTitle: "Byt till mörkt läge",
        notFound: {
          title: "Sidan hittades inte",
          quote: "Sidan finns inte, kontrollera URL:en.",
          linkLabel: "Tillbaka till startsidan",
          linkText: "Tillbaka till startsidan",
        },
        search: {
          options: {
            placeholder: "Sök i dokumentationen",
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: 'Fråga AI',
                    buttonAriaLabel: 'Fråga AI'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: 'Fråga AI',
                      conversationHistoryTitle: 'Min konversationshistorik',
                      newConversationText: 'Starta ny konversation',
                      viewConversationHistoryText: 'Konversationshistorik'
                    },
                    promptForm: {
                      promptPlaceholderText: 'Ställ en fråga',
                      promptAnsweringText: 'Svarar...',
                      promptAskAnotherQuestionText: 'Ställ en annan fråga',
                      promptDisclaimerText: 'Svar genererat av AI, kan innehålla fel.',
                      promptLabelText: 'Enter för att skicka, Shift+Enter för ny rad.',
                      promptAriaLabelText: 'Frågeinmatning'
                    },
                    conversationScreen: {
                      preToolCallText: 'Söker...',
                      searchingText: 'Söker...',
                      toolCallResultText: 'Sökning klar',
                      conversationDisclaimer: 'Svar genererat av AI, kan innehålla fel. Kontrollera.',
                      reasoningText: 'Resonerar...',
                      thinkingText: 'Tänker...',
                      relatedSourcesText: 'Relaterade källor',
                      stoppedStreamingText: 'Du stoppade det här svaret',
                      copyButtonText: 'Kopiera',
                      copyButtonCopiedText: 'Kopierat!',
                      likeButtonTitle: 'Gilla',
                      dislikeButtonTitle: 'Ogilla',
                      thanksForFeedbackText: 'Tack för din feedback!',
                      errorTitleText: 'Chattfel'
                    },
                    newConversationScreen: {
                      titleText: 'Hur kan jag hjälpa dig idag?',
                      introductionText: 'Jag söker i din dokumentation för att snabbt hitta installationsguider, funktionsdetaljer och felsökningstips.'
                    },
                    logo: {
                      poweredByText: ''
                    }
                  }
                }
              }
            },
            translations: {
              button: {
                buttonText: 'Sök',
                buttonAriaLabel: 'Sök'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: 'Rensa',
                  clearButtonAriaLabel: 'Rensa sökning',
                  closeButtonText: 'Stäng',
                  closeButtonAriaLabel: 'Stäng',
                  placeholderText: 'Sök i dokumentationen eller fråga AI',
                  placeholderTextAskAi: 'Ange en annan fråga...',
                  placeholderTextAskAiStreaming: 'Svarar...',
                  searchInputLabel: 'Sök',
                  backToKeywordSearchButtonText: 'Tillbaka till nyckelordssökning',
                  backToKeywordSearchButtonAriaLabel: 'Tillbaka till nyckelordssökning',
                  newConversationPlaceholder: 'Ställ en fråga',
                  conversationHistoryTitle: 'Min konversationshistorik',
                  startNewConversationText: 'Starta ny konversation',
                  viewConversationHistoryText: 'Konversationshistorik',
                  threadDepthErrorPlaceholder: 'Konversationsgränsen nådd'
                },
                newConversation: {
                  newConversationTitle: 'Hur kan jag hjälpa dig idag?',
                  newConversationDescription: 'Jag söker i din dokumentation för att snabbt hitta installationsguider, funktionsdetaljer och felsökningstips.'
                },
                footer: {
                  selectText: 'Välj',
                  submitQuestionText: 'Skicka fråga',
                  selectKeyAriaLabel: 'Enter-tangent',
                  navigateText: 'Navigera',
                  navigateUpKeyAriaLabel: 'Pil upp',
                  navigateDownKeyAriaLabel: 'Pil ned',
                  closeText: 'Stäng',
                  backToSearchText: 'Tillbaka till sökning',
                  closeKeyAriaLabel: 'Esc-tangent',
                  poweredByText: ''
                },
                errorScreen: {
                  titleText: 'Det gick inte att hämta resultat',
                  helpText: 'Du kan behöva kontrollera din nätverksanslutning.'
                },
                startScreen: {
                  recentSearchesTitle: 'Senaste',
                  noRecentSearchesText: 'Inga senaste sökningar',
                  saveRecentSearchButtonTitle: 'Spara den här sökningen',
                  removeRecentSearchButtonTitle: 'Ta bort den här sökningen från historiken',
                  favoriteSearchesTitle: 'Favoriter',
                  removeFavoriteSearchButtonTitle: 'Ta bort från favoriter',
                  recentConversationsTitle: 'Senaste konversationer',
                  removeRecentConversationButtonTitle: 'Ta bort den här konversationen från historiken'
                },
                noResultsScreen: {
                  noResultsText: 'Inga relevanta resultat hittades',
                  suggestedQueryText: 'Försök söka',
                  reportMissingResultsText: 'Tror du att den här frågan borde ha resultat?',
                  reportMissingResultsLinkText: 'Berätta för oss.'
                },
                resultsScreen: {
                  askAiPlaceholder: 'Fråga AI:',
                  noResultsAskAiPlaceholder: 'Hittades inte i dokumentationen? Prova Ask AI:'
                },
                askAiScreen: {
                  disclaimerText: 'Svar genererat av AI, kan innehålla fel. Kontrollera.',
                  relatedSourcesText: 'Relaterade källor',
                  thinkingText: 'Tänker...',
                  copyButtonText: 'Kopiera',
                  copyButtonCopiedText: 'Kopierat!',
                  copyButtonTitle: 'Kopiera',
                  likeButtonTitle: 'Gilla',
                  dislikeButtonTitle: 'Ogilla',
                  thanksForFeedbackText: 'Tack för din feedback!',
                  preToolCallText: 'Söker...',
                  duringToolCallText: 'Söker...',
                  afterToolCallText: 'Sökning klar',
                  stoppedStreamingText: 'Du stoppade det här svaret',
                  errorTitleText: 'Chattfel',
                  threadDepthExceededMessage: 'Den här konversationen stängdes för att bibehålla svarens noggrannhet.',
                  startNewConversationButtonText: 'Starta ny konversation'
                }
              }
            },
          },
        },
        outlineTitle: "På den här sidan",
        lastUpdatedText: "Senast uppdaterad",
        docFooter: {
          prev: "Föregående",
          next: "Nästa",
        },
        footer: {},
        editLink: {
          text: "Redigera den här sidan på GitHub",
        },
      },
    },
  }
})
