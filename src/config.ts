import { defineAdditionalConfig } from "vitepress"

export default defineAdditionalConfig({
  description:
    "在线工具，免费工具，游戏，FC游戏，小游戏，图片处理，图片压缩，图片转换，图片裁剪，PDF处理，PDF转Word，PDF合并，PDF压缩，视频处理，视频压缩，视频转换，Base64编解码，坐标转换，地图瓦片下载，在线默写单词，iframe测试，WEM音频转换MP3",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content:
          "在线工具，免费工具，游戏，FC游戏，小游戏，图片处理，图片压缩，图片转换，图片裁剪，PDF处理，PDF转Word，PDF合并，PDF压缩，视频处理，视频压缩，视频转换，Base64编解码，坐标转换，地图瓦片下载，在线默写单词，iframe测试，WEM音频转换MP3",
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
                buttonText: "询问 AI",
                buttonAriaLabel: "询问 AI",
              },
            },
            panel: {
              translations: {
                header: {
                  title: "询问 AI",
                  conversationHistoryTitle: "我的对话历史",
                  newConversationText: "开始新的对话",
                  viewConversationHistoryText: "对话历史",
                },
                promptForm: {
                  promptPlaceholderText: "提问",
                  promptAnsweringText: "正在回答...",
                  promptAskAnotherQuestionText: "再问一个问题",
                  promptDisclaimerText: "回答由 AI 生成，可能会出错。",
                  promptLabelText: "按回车发送，Shift+回车换行。",
                  promptAriaLabelText: "问题输入",
                },
                conversationScreen: {
                  preToolCallText: "搜索中...",
                  searchingText: "搜索中...",
                  toolCallResultText: "已搜索",
                  conversationDisclaimer:
                    "回答由 AI 生成，可能会出错。请核实。",
                  reasoningText: "推理中...",
                  thinkingText: "思考中...",
                  relatedSourcesText: "相关来源",
                  stoppedStreamingText: "你已停止此回复",
                  copyButtonText: "复制",
                  copyButtonCopiedText: "已复制！",
                  likeButtonTitle: "喜欢",
                  dislikeButtonTitle: "不喜欢",
                  thanksForFeedbackText: "感谢你的反馈！",
                  errorTitleText: "聊天错误",
                },
                newConversationScreen: {
                  titleText: "我今天能帮你什么？",
                  introductionText:
                    "我会搜索你的文档，快速帮你找到设置指南、功能细节和故障排除提示。",
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
            buttonText: "搜索",
            buttonAriaLabel: "搜索",
          },
          modal: {
            searchBox: {
              clearButtonTitle: "清除",
              clearButtonAriaLabel: "清除查询",
              closeButtonText: "关闭",
              closeButtonAriaLabel: "关闭",
              placeholderText: "搜索文档或向 AI 提问",
              placeholderTextAskAi: "再问一个问题...",
              placeholderTextAskAiStreaming: "正在回答...",
              searchInputLabel: "搜索",
              backToKeywordSearchButtonText: "返回关键词搜索",
              backToKeywordSearchButtonAriaLabel: "返回关键词搜索",
              newConversationPlaceholder: "提问",
              conversationHistoryTitle: "我的对话历史",
              startNewConversationText: "开始新的对话",
              viewConversationHistoryText: "对话历史",
              threadDepthErrorPlaceholder: "对话已达上限",
            },
            newConversation: {
              newConversationTitle: "我今天能帮你什么？",
              newConversationDescription:
                "我会搜索你的文档，快速帮你找到设置指南、功能细节和故障排除提示。",
            },
            footer: {
              selectText: "选择",
              submitQuestionText: "提交问题",
              selectKeyAriaLabel: "回车键",
              navigateText: "导航",
              navigateUpKeyAriaLabel: "向上箭头",
              navigateDownKeyAriaLabel: "向下箭头",
              closeText: "关闭",
              backToSearchText: "返回搜索",
              closeKeyAriaLabel: "Esc 键",
              poweredByText: "",
            },
            errorScreen: {
              titleText: "无法获取结果",
              helpText: "你可能需要检查网络连接。",
            },
            startScreen: {
              recentSearchesTitle: "最近",
              noRecentSearchesText: "暂无最近搜索",
              saveRecentSearchButtonTitle: "保存此搜索",
              removeRecentSearchButtonTitle: "从历史记录中移除此搜索",
              favoriteSearchesTitle: "收藏",
              removeFavoriteSearchButtonTitle: "从收藏中移除此搜索",
              recentConversationsTitle: "最近对话",
              removeRecentConversationButtonTitle: "从历史记录中移除此对话",
            },
            noResultsScreen: {
              noResultsText: "未找到相关结果",
              suggestedQueryText: "尝试搜索",
              reportMissingResultsText: "认为此查询应该有结果？",
              reportMissingResultsLinkText: "告诉我们。",
            },
            resultsScreen: {
              askAiPlaceholder: "询问 AI：",
              noResultsAskAiPlaceholder: "文档里没找到？让 Ask AI 帮忙：",
            },
            askAiScreen: {
              disclaimerText: "回答由 AI 生成，可能会出错。请核实。",
              relatedSourcesText: "相关来源",
              thinkingText: "思考中...",
              copyButtonText: "复制",
              copyButtonCopiedText: "已复制！",
              copyButtonTitle: "复制",
              likeButtonTitle: "喜欢",
              dislikeButtonTitle: "不喜欢",
              thanksForFeedbackText: "感谢你的反馈！",
              preToolCallText: "搜索中...",
              duringToolCallText: "搜索中...",
              afterToolCallText: "已搜索",
              stoppedStreamingText: "你已停止此回复",
              errorTitleText: "聊天错误",
              threadDepthExceededMessage: "为保持回答准确，此对话已关闭。",
              startNewConversationButtonText: "开始新的对话",
            },
          },
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
        text: "格式转换",
        items: [
          { text: "音频转换", link: "/web/convert/audio" },
        ]
      },
      {
        text: "游戏",
        items: [
          { text: "FC 童年小霸王", link: "/pages/game" },
          { text: "Java 经典游戏", link: "/pages/javaGames" },
          // { text: "GTA VC 侠盗飞车 罪恶都市", link: "https://gtavc.kuangyx.cn" },
        ],
      },
      {
        text: "工具",
        items: [
          { text: "在线默写单词", link: "/docs/在线应用/工具/在线默写单词" },
          { text: "鸡乐盒", link: "/docs/在线应用/小游戏/鸡乐盒" },
          { text: "坐标转换", link: "/docs/在线应用/工具/坐标转换" },
          { text: "Base64 编解码", link: "/docs/在线应用/工具/Base64编解码" },
          // { text: "steam 喜加一", link: "/docs/在线应用/工具/steam喜加一" },
          // { text: "IP 归属地", link: "/docs/在线应用/工具/IP归属地" },
          {
            text: "百度地图瓦片下载",
            link: "/docs/在线应用/工具/百度地图瓦片下载",
          },
          {
            text: "在线 iframe 测试",
            link: "/docs/在线应用/工具/在线iframe测试",
          },
        ],
      },
      ...getNav(),
    ],
    sidebar: {
      ...getSidebar(),
    }
  },
})

function getNav() {
  return [
    {
      text: "笔记",
      items: [
        { text: "导航", link: "/pages/navigation" },
        { text: "软件", link: "/pages/software" },
        
        // { text: "GPT", link: "/pages/chatGPT" },
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
          text: "推荐文章",
          items: [
            { text: "资源收集", link: "/docs/资源收集/介绍" },
            {
              text: "JS 库",
              link: "/docs/文章/JS Lib/百度地图，高德地图，腾讯地图，天地图等坐标互转",
            },
            { text: "Vue3 业务组件", link: "/docs/文章/vue3-组件/快速上手" },
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
            {
              text: "Openlayers",
              link: "/docs/框架/openlayers-示例/地图控件/导航控件",
            },
            { text: "Cesium", link: "/docs/进阶/Cesium/基础配置" },
            { text: "Flutter", link: "/docs/进阶/Flutter/01-Flutter" },
            {
              text: "TypeScript",
              link: "/docs/进阶/TypeScript/安装配置",
            },
            {
              text: "Three.js",
              link: "/docs/进阶/Three.js/01渲染一个场景和物体",
            },
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
      ],
    },
  ]
}

function getSidebar() {
  return {
    "/docs/资源收集/": [
      { text: "介绍", link: "/docs/资源收集/介绍" },

      {
        text: "前端资源收集",
        collapsed: true,
        items: [
          { text: "UI库", link: "/docs/资源收集/前端资源收集/UI库" },
          {
            text: "后台管理模板",
            link: "/docs/资源收集/前端资源收集/后台管理模板",
          },
          { text: "富文本", link: "/docs/资源收集/前端资源收集/富文本" },
          {
            text: "Markdown",
            link: "/docs/资源收集/前端资源收集/Markdown",
          },
          {
            text: "文件上传",
            link: "/docs/资源收集/前端资源收集/文件上传",
          },
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
          {
            text: "在线默写单词",
            link: "/docs/在线应用/工具/在线默写单词",
          },
          { text: "鸡乐盒", link: "/docs/在线应用/小游戏/鸡乐盒" },
          { text: "坐标转换", link: "/docs/在线应用/工具/坐标转换" },
          {
            text: "Base64 编解码",
            link: "/docs/在线应用/工具/Base64编解码",
          },
          // { text: "steam 喜加一", link: "/docs/在线应用/工具/steam喜加一" },
          // { text: "IP 归属地", link: "/docs/在线应用/工具/IP归属地" },
          {
            text: "百度地图瓦片下载",
            link: "/docs/在线应用/工具/百度地图瓦片下载",
          },
          {
            text: "在线 iframe 测试",
            link: "/docs/在线应用/工具/在线iframe测试",
          },
        ],
      },
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
          {
            text: "canvas 涂鸦画板",
            link: "/docs/文章/JS Lib/canvas 涂鸦画板",
          },
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
          { text: "快速上手", link: "/docs/文章/vue3-组件/快速上手" },
          { text: "深色模式", link: "/docs/文章/vue3-组件/深色模式" },
          { text: "城市选择", link: "/docs/文章/vue3-组件/城市选择" },
          { text: "日期选择", link: "/docs/文章/vue3-组件/日期选择" },
          { text: "时间选择", link: "/docs/文章/vue3-组件/时间选择" },
          { text: "趋势标记", link: "/docs/文章/vue3-组件/趋势标记" },
          { text: "进度条", link: "/docs/文章/vue3-组件/进度条" },
          { text: "通知菜单", link: "/docs/文章/vue3-组件/通知菜单" },
          { text: "表格分页", link: "/docs/文章/vue3-组件/表格分页" },
          { text: "表单", link: "/docs/文章/vue3-组件/表单" },
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
          {
            text: "AutoLisp 介绍",
            link: "/docs/文章/AutoLisp/AutoLisp介绍",
          },
          {
            text: "简单命令编写",
            link: "/docs/文章/AutoLisp/简单命令编写",
          },
          {
            text: "多边形简易用法",
            link: "/docs/文章/AutoLisp/多边形简易用法",
          },
          { text: "同心圆绘制", link: "/docs/文章/AutoLisp/同心圆绘制" },
          {
            text: "梯形折线绘制",
            link: "/docs/文章/AutoLisp/梯形折线绘制",
          },
          { text: "偏移复制", link: "/docs/文章/AutoLisp/偏移复制" },
          { text: "图元名组码", link: "/docs/文章/AutoLisp/图元名组码" },
          {
            text: "圆形转多边形",
            link: "/docs/文章/AutoLisp/圆形转多边形",
          },
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
          {
            text: "两点创建同心圆",
            link: "/docs/文章/AutoLisp/两点创建同心圆",
          },
          {
            text: "选取相同图层",
            link: "/docs/文章/AutoLisp/选取相同图层",
          },
          {
            text: "输入边数绘制多边形",
            link: "/docs/文章/AutoLisp/输入边数绘制多边形",
          },
          { text: "端点调整", link: "/docs/文章/AutoLisp/端点调整" },
          { text: "动态五边形", link: "/docs/文章/AutoLisp/动态五边形" },
          { text: "插入时间", link: "/docs/文章/AutoLisp/插入时间" },
          { text: "绘制网格", link: "/docs/文章/AutoLisp/绘制网格" },
          {
            text: "SSget 过滤技巧",
            link: "/docs/文章/AutoLisp/SSget过滤技巧",
          },
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
        ],
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
              {
                text: "常量与变量",
                link: "/docs/服务端/C语言/数据类型/常量与变量",
              },
              { text: "整型", link: "/docs/服务端/C语言/数据类型/整型" },
              {
                text: "字符型",
                link: "/docs/服务端/C语言/数据类型/字符型",
              },
              {
                text: "浮点型",
                link: "/docs/服务端/C语言/数据类型/浮点型",
              },
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
              {
                text: "语句",
                link: "/docs/服务端/C语言/运算符与表达式/语句",
              },
            ],
          },
          {
            text: "数组",
            collapsed: true,
            items: [
              {
                text: "数组定义",
                link: "/docs/服务端/C语言/数组/数组定义",
              },
              {
                text: "字符型数组",
                link: "/docs/服务端/C语言/数组/字符型数组",
              },
            ],
          },
          { text: "函数", link: "/docs/服务端/C语言/函数" },
          {
            text: "指针",
            collapsed: true,
            items: [
              {
                text: "指针定义",
                link: "/docs/服务端/C语言/指针/指针定义",
              },
              {
                text: "指针和数组",
                link: "/docs/服务端/C语言/指针/指针和数组",
              },
              {
                text: "指针运算",
                link: "/docs/服务端/C语言/指针/指针运算",
              },
              {
                text: "多级指针",
                link: "/docs/服务端/C语言/指针/多级指针",
              },
              {
                text: "指针和字符串",
                link: "/docs/服务端/C语言/指针/指针和字符串",
              },
              {
                text: "指针和函数",
                link: "/docs/服务端/C语言/指针/指针和函数",
              },
            ],
          },
          {
            text: "内存",
            collapsed: true,
            items: [
              {
                text: "内存管理",
                link: "/docs/服务端/C语言/内存/内存管理",
              },
              {
                text: "内存操作",
                link: "/docs/服务端/C语言/内存/内存操作",
              },
            ],
          },
          {
            text: "复合类型",
            collapsed: true,
            items: [
              {
                text: "结构体",
                link: "/docs/服务端/C语言/复合类型/结构体",
              },
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
          {
            text: "部署 nodejs 项目",
            link: "/docs/服务端/部署/部署nodejs项目",
          },
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
          {
            text: "Node.js 控制台动态进度条（带转圈动画）",
            link: "/docs/服务端/Node.js/Node.js 控制台动态进度条（带转圈动画）",
          },
          {
            text: "获取302接口cookie",
            link: "/docs/服务端/Node.js/Node.js爬虫获取302接口cookie",
          },
          { text: "模块引入", link: "/docs/服务端/Node.js/模块引入" },
          { text: "dos 指令", link: "/docs/服务端/Node.js/dos指令" },
          { text: "Buffer 缓冲区", link: "/docs/服务端/Node.js/Buffer" },
          { text: "FS 文件系统", link: "/docs/服务端/Node.js/FS" },
          { text: "url 地址", link: "/docs/服务端/Node.js/url" },
          { text: "http 服务器", link: "/docs/服务端/Node.js/http" },
          { text: "events 事件", link: "/docs/服务端/Node.js/events" },
          { text: "npm", link: "/docs/服务端/Node.js/npm" },
          {
            text: "node运行npm脚本",
            link: "/docs/服务端/Node.js/node运行npm脚本",
          },
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
          {
            text: "不规则图形绘制",
            link: "/docs/框架/pixi.js/不规则图形绘制",
          },
          { text: "图像运动", link: "/docs/框架/pixi.js/图像运动" },
          { text: "交互动画", link: "/docs/框架/pixi.js/交互动画" },
          { text: "资源管理", link: "/docs/框架/pixi.js/资源管理" },
          { text: "文字与遮罩", link: "/docs/框架/pixi.js/文字与遮罩" },
          { text: "滤镜特效", link: "/docs/框架/pixi.js/滤镜特效" },
          {
            text: "谷歌恐龙小游戏",
            link: "/docs/框架/pixi.js/谷歌恐龙小游戏",
          },
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
        text: "openlayers-示例",
        collapsed: true,
        items: [
          {
            text: "导航控件",
            link: "/docs/框架/openlayers-示例/地图控件/导航控件",
          },
          {
            text: "鼠标位置",
            link: "/docs/框架/openlayers-示例/地图控件/鼠标位置",
          },
          {
            text: "比例尺",
            link: "/docs/框架/openlayers-示例/地图控件/比例尺",
          },
          {
            text: "缩略图",
            link: "/docs/框架/openlayers-示例/地图控件/缩略图",
          },
          {
            text: "图层切换",
            link: "/docs/框架/openlayers-示例/地图控件/图层切换",
          },
          {
            text: "地图联动",
            link: "/docs/框架/openlayers-示例/地图控件/地图联动",
          },
          {
            text: "加载百度地图",
            link: "/docs/框架/openlayers-示例/地图控件/加载百度地图",
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
          {
            text: "Flutter 快速上手",
            link: "/docs/进阶/Flutter/01-Flutter",
          },
          {
            text: "Flutter 数据类型",
            link: "/docs/进阶/Flutter/02.数据类型",
          },
          { text: "Flutter 方法", link: "/docs/进阶/Flutter/03.方法" },
          { text: "Flutter 泛型", link: "/docs/进阶/Flutter/04.泛型" },
          {
            text: "Flutter HTTP 请求接口",
            link: "/docs/进阶/Flutter/05.http",
          },
          {
            text: "Flutter 本地存储",
            link: "/docs/进阶/Flutter/06.本地存储",
          },
          {
            text: "Flutter Widgets",
            link: "/docs/进阶/Flutter/07.widgets",
          },
          {
            text: "StatelessWidget & StatefulWidget",
            link: "/docs/进阶/Flutter/08.StatelessWidget&StatefulWidget",
          },
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
          {
            text: "gsap 处理动画",
            link: "/docs/进阶/Three.js/07gsap处理动画",
          },
          {
            text: "画布自适应宽度",
            link: "/docs/进阶/Three.js/08画布自适应宽度",
          },
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
        items: [
          { text: "git版本管理工具", link: "/docs/进阶/git版本管理工具" },
        ],
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
          {
            text: "名词单数变复数规则",
            link: "/docs/English/名词单数变复数规则",
          },
          {
            text: "不可数名词与量词",
            link: "/docs/English/不可数名词与量词",
          },
          { text: "名词的作用", link: "/docs/English/名词的作用" },
          { text: "名词所有格", link: "/docs/English/名词所有格" },
          { text: "人称代词", link: "/docs/English/人称代词" },
          { text: "物主代词", link: "/docs/English/物主代词" },
          { text: "指示代词", link: "/docs/English/指示代词" },
          {
            text: "形容词定义和语法",
            link: "/docs/English/形容词定义和语法",
          },
          {
            text: "形容词的比较级和最高级规则",
            link: "/docs/English/形容词的比较级和最高级规则",
          },
          {
            text: "形容词的比较级和最高级用法",
            link: "/docs/English/形容词的比较级和最高级用法",
          },
          { text: "谓语动词", link: "/docs/English/谓语动词" },
          {
            text: "实义动词格式变化",
            link: "/docs/English/实义动词格式变化",
          },
          { text: "系动词", link: "/docs/English/系动词" },
          { text: "助动词", link: "/docs/English/助动词" },
          { text: "情态动词", link: "/docs/English/情态动词" },
          { text: "冠词", link: "/docs/English/冠词" },
          { text: "一般现在时", link: "/docs/English/一般现在时" },
          {
            text: "主系表疑问句和否定句",
            link: "/docs/English/主系表疑问句和否定句",
          },
          { text: "主谓宾构成方式", link: "/docs/English/主谓宾构成方式" },
          {
            text: "主谓宾疑问句否定句",
            link: "/docs/English/主谓宾疑问句否定句",
          },
          { text: "16种时态", link: "/docs/English/16种时态" },

          { text: "序数词与基数词", link: "/docs/English/序数词与基数词" },

          { text: "否定句", link: "/docs/English/否定句" },
          { text: "肯定句转疑问句", link: "/docs/English/肯定句转疑问句" },
          { text: "特殊疑问句", link: "/docs/English/特殊疑问句" },
          { text: "介词", link: "/docs/English/介词" },
          { text: "从句", link: "/docs/English/从句" },
          { text: "非谓语", link: "/docs/English/非谓语" },
        ],
      },
    ],
  }
}
