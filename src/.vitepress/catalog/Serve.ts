export const Server = [
  {
    text: "Java",
    collapsed: true,
    items: [
      { text: "初识", link: "/docs/服务端/Java/01-初识" },
      { text: "Scanner输入", link: "/docs/服务端/Java/02-Scanner输入" },
      { text: "运算符", link: "/docs/服务端/Java/03-运算符" },
    ],
  },
  {
    text: "C 语言",
    collapsed: true,
    items: [
      { text: "概述", link: "/docs/进阶/C语言/概述" },
      {
        text: "CPU内部结构与寄存器",
        link: "/docs/进阶/C语言/CPU内部结构与寄存器",
      },
      {
        text: "数据类型",
        collapsed: true,
        items: [
          { text: "常量与变量", link: "/docs/进阶/C语言/数据类型/常量与变量" },
          { text: "整型", link: "/docs/进阶/C语言/数据类型/整型" },
          { text: "字符型", link: "/docs/进阶/C语言/数据类型/字符型" },
          { text: "浮点型", link: "/docs/进阶/C语言/数据类型/浮点型" },
          {
            text: "输入输出函数",
            link: "/docs/进阶/C语言/数据类型/输入输出函数",
          },
        ],
      },
      {
        text: "运算符与表达式",
        collapsed: true,
        items: [
          {
            text: "算术运算符",
            link: "/docs/进阶/C语言/运算符与表达式/算术运算符",
          },
          { text: "语句", link: "/docs/进阶/C语言/运算符与表达式/语句" },
        ],
      },
      {
        text: "数组",
        collapsed: true,
        items: [
          { text: "数组定义", link: "/docs/进阶/C语言/数组/数组定义" },
          { text: "字符型数组", link: "/docs/进阶/C语言/数组/字符型数组" },
        ],
      },
      { text: "函数", link: "/docs/进阶/C语言/函数" },
      {
        text: "指针",
        collapsed: true,
        items: [
          { text: "指针定义", link: "/docs/进阶/C语言/指针/指针定义" },
          { text: "指针和数组", link: "/docs/进阶/C语言/指针/指针和数组" },
          { text: "指针运算", link: "/docs/进阶/C语言/指针/指针运算" },
          { text: "多级指针", link: "/docs/进阶/C语言/指针/多级指针" },
          { text: "指针和字符串", link: "/docs/进阶/C语言/指针/指针和字符串" },
          { text: "指针和函数", link: "/docs/进阶/C语言/指针/指针和函数" },
        ],
      },
      {
        text: "内存",
        collapsed: true,
        items: [
          { text: "内存管理", link: "/docs/进阶/C语言/内存/内存管理" },
          { text: "内存操作", link: "/docs/进阶/C语言/内存/内存操作" },
        ],
      },
      {
        text: "复合类型",
        collapsed: true,
        items: [
          { text: "结构体", link: "/docs/进阶/C语言/复合类型/结构体" },
          { text: "内存操作", link: "/docs/进阶/C语言/复合类型/内存操作" },
        ],
      },
    ],
  },
  {
    text: "部署",
    collapsed: true,
    items: [
      { text: "docker", link: "/docs/服务端/部署/docker" },
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
]
