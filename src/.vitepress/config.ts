import { defineConfig, type DefaultTheme } from "vitepress"
import { resolve } from "path"

import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

import vueJsx from "@vitejs/plugin-vue-jsx"
import svgLoader from "vite-svg-loader"

export default defineConfig({
  title: "KYX Box",
  lastUpdated: true,
  outDir: "../kuangyx",
  srcExclude: ["**/vscodeExtension/**"],
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
    search: {
      provider: "algolia",
      options: {
        appId: "1AS9BEA8JY",
        apiKey: "6564a713013f5f79664a8be62e7f3235",
        indexName: "kuangyx",
        askAi: {
          assistantId: "34RtOk3KOUKu",
        },
        panel: {
          side: 'left',
          width: '380px',
          expandedWidth: '580px',
          suggestedQuestions: true,
        }
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
      { text: "资源收集", link: "/docs/资源收集/介绍" },
      {
        text: "文章",
        items: [
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
          { text: "计算机相关", link: "/docs/文章/计算机相关/ASCII码表" },
          {
            text: "系统软件相关",
            link: "/docs/文章/系统软件相关/vscode更新功能会被禁用",
          },
          { text: "CAD Auto Lisp", link: "/docs/文章/AutoLisp/AutoLisp介绍" },
        ],
      },
      {
        text: "前端",
        items: [
          { text: "JavaScript", link: "/docs/JavaScript/基本概念/变量" },
          { text: "ES6", link: "/docs/ES6/变量声明与解构" },
          { text: "JQuery", link: "/docs/库/JQuery/jQuery初识" },
          {
            text: "框架",
            items: [
              { text: "Vue", link: "/docs/框架/Vue3/创建响应式数据" },
              { text: "Nuxt.js", link: "/docs/框架/nuxt.js/安装" },
              { text: "React", link: "/docs/框架/React19/起步" },
              { text: "Pixi.js", link: "/docs/框架/pixi.js/基本图形绘制" },
              { text: "Openlayers", link: "/docs/框架/openlayers/功能介绍" },
            ],
          },
          {
            text: "进阶",
            items: [
              { text: "Cesium", link: "/docs/进阶/Cesium/基础配置" },
              { text: "Flutter", link: "/docs/进阶/Flutter/01-Flutter" },
              {
                text: "TypeScript",
                link: "/docs/进阶/TypeScript/安装配置",
              },
              {
                text: "Canvas",
                link: "/docs/进阶/Canvas/canvas入门",
              },
              {
                text: "Three.js",
                link: "/docs/进阶/Three.js/01渲染一个场景和物体",
              },
              {
                text: "Git管理工具",
                link: "/docs/进阶/git版本管理工具",
              },
            ],
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
          { text: "express", link: "/docs/服务端/express" },
          { text: "MySql", link: "/docs/服务端/MySql" },
        ],
      },
      {
        text: "其他",
        items: [
          { text: "面试", link: "/docs/关于/面试" },
          { text: "我的云盘", link: "/docs/关于/我的云盘" },
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
              text: "Vuecli默认网页标题",
              link: "/docs/文章/前端/vuecli设置默认document.title",
            },
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
        {
          text: "touch",
          collapsed: true,
          items: [
            { text: "原生touch", link: "/docs/JavaScript/原生touch" },
            { text: "touch.js", link: "/docs/库/百度touch.js" }
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
                { text: "内存操作", link: "/docs/服务端/C语言/复合类型/内存操作" },
              ],
            },
          ],
        },
        {
          text: "部署",
          collapsed: true,
          items: [
            { text: "docker", link: "/docs/服务端/部署/docker" },
            { text: "VMware安装Linux", link: "/docs/服务端/部署/VMware安装Linux" },
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
          text: "框架",
          collapsed: true,
          items: [{ text: "express", link: "/docs/服务端/express" }],
        },
        {
          text: "打包工具",
          collapsed: true,
          items: [{ text: "webpack", link: "/docs/服务端/webpack" }],
        },
        {
          text: "数据库",
          collapsed: true,
          items: [{ text: "MySql", link: "/docs/服务端/MySql" }],
        },
      ],

      "/docs/库/": [
        {
          text: "JQuery",
          collapsed: true,
          items: [
            { text: "JQuery 初识", link: "/docs/库/JQuery/jQuery初识" },
            { text: "选择器", link: "/docs/库/JQuery/选择器" },
            { text: "DOM 操作", link: "/docs/库/JQuery/DOM操作" },
            { text: "BOM 操作", link: "/docs/库/JQuery/BOM操作" },
            { text: "事件", link: "/docs/库/JQuery/事件" },
            { text: "动画", link: "/docs/库/JQuery/动画" },
            { text: "ajax", link: "/docs/库/JQuery/ajax" },
            { text: "cookie", link: "/docs/库/JQuery/cookie" },
            { text: "编写 jq 插件", link: "/docs/库/JQuery/插件" },
            { text: "Zepto", link: "/docs/库/JQuery/Zepto" },
          ],
        },
        {
          text: "数据请求",
          collapsed: true,
          items: [{ text: "axios", link: "/docs/库/axios" }],
        },
      ]
      ,

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
          text: "Vue2",
          collapsed: true,
          items: [
            { text: "指令", link: "/docs/框架/Vue2/指令" },
            { text: "生命周期", link: "/docs/框架/Vue2/生命周期" },
            { text: "事件", link: "/docs/框架/Vue2/事件" },
            { text: "动画过渡", link: "/docs/框架/Vue2/动画过渡" },
            { text: "组件通讯", link: "/docs/框架/Vue2/组件通讯" },
            { text: "router", link: "/docs/框架/Vue2/router" },
            { text: "Vuex", link: "/docs/框架/Vue2/Vuex" },
            { text: "跨域代理", link: "/docs/框架/Vue2/跨域代理" },
          ],
        },
        {
          text: "Vue3",
          collapsed: true,
          items: [
            {
              text: "创建响应式数据",
              link: "/docs/框架/Vue3/创建响应式数据",
            },
            { text: "组合式API", link: "/docs/框架/Vue3/组合式API" },
            {
              text: "computed与watch",
              link: "/docs/框架/Vue3/computed与watch",
            },
            { text: "生命周期", link: "/docs/框架/Vue3/生命周期" },
            { text: "祖孙传值", link: "/docs/框架/Vue3/祖孙传值" },
            {
              text: "ref获取DOM元素",
              link: "/docs/框架/Vue3/ref获取DOM元素",
            },
            {
              text: "响应式属性标记",
              link: "/docs/框架/Vue3/响应式属性标记",
            },
            { text: "style特性", link: "/docs/框架/Vue3/style特性" },
            { text: "新组件", link: "/docs/框架/Vue3/新组件" },
            { text: "TS类型标注", link: "/docs/框架/Vue3/TS类型标注" },
          ],
        },
        {
          text: "nuxt.js",
          collapsed: true,
          items: [
            { text: "安装", link: "/docs/框架/nuxt.js/安装" },
            { text: "路由", link: "/docs/框架/nuxt.js/路由" },
            {
              text: "layout通用布局",
              link: "/docs/框架/nuxt.js/layout通用布局",
            },
            {
              text: "components组件",
              link: "/docs/框架/nuxt.js/components组件",
            },
            {
              text: "全局引入element-plus",
              link: "/docs/框架/nuxt.js/全局引入element-plus",
            },
            {
              text: "nuxt3代理服务器",
              link: "/docs/框架/nuxt.js/nuxt3代理服务器",
            },
          ],
        },
        {
          text: "React19",
          collapsed: true,
          items: [
            { text: "起步", link: "/docs/框架/React19/起步" },
            { text: "useState", link: "/docs/框架/React19/useState" },
            { text: "useEffect", link: "/docs/框架/React19/useEffect" },
          ],
        },
        {
          text: "React",
          collapsed: true,
          items: [
            { text: "组件", link: "/docs/框架/React/组件" },
            { text: "事件", link: "/docs/框架/React/事件" },
            { text: "生命周期", link: "/docs/框架/React/生命周期" },
            { text: "路由", link: "/docs/框架/React/路由" },
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
        {
          text: "小程序",
          collapsed: true,
          items: [{ text: "微信小程序入门", link: "/docs/进阶/微信小程序" }],
        },
      ]
      ,

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
        externalLinkIcon: true,
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
      },
    },
    'en': {
      lang: "en",
      label: "English", // 英语
      description: "Online tools, free tools, games, FC games, small games, image processing, image compression, image conversion, image cropping, PDF processing, PDF to Word, PDF merge, PDF compression, video processing, video compression, video conversion, Base64 encoding, coordinate conversion, map tile download, online word writing, iframe test, WEM audio conversion MP3",
      head: [
        [
          "meta",
          {
            name: "keywords",
            content: "Online tools, free tools, games, FC games, small games, image processing, image compression, image conversion, image cropping, PDF processing, PDF to Word, PDF merge, PDF compression, video processing, video compression, video conversion, Base64 encoding, coordinate conversion, map tile download, online word writing, iframe test, WEM audio conversion MP3",
          },
        ],
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
            content: "Ferramentas online, ferramentas gratuitas, jogos, jogos FC, jogos pequenos, processamento de imagens, compressão de imágenes, conversión de imágenes, recorte de imágenes, procesamiento de PDF, PDF para Word, PDF de fusión, PDF de compresión, procesamiento de video, compresión de video, conversión de video, Base64 de codificación, conversión de coordenadas, descarga de mosaicos de mapa, escritura en línea de palabras, prueba de iframe, conversión de audio WEM para MP3",
          },
        ],
      ]
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
      ]
    },
    'ar': {
      lang: "ar",
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
    },
  }
})
