/**
 * 资源分享公共配置
 * 每个资源类型只需要在这里配置数据源、列头、操作列等
 */

export const resourceConfigs = {
  // 开源项目收集
  '开源项目收集': {
    // 每页显示条数
    pageSize: 5,
    
    // 数据源：所有数据的数组（会自动按 pageSize 分页）
    dataSource: [
      {
        id: 1,
        name: 'Vue.js',
        description: '渐进式 JavaScript 框架',
        stars: '207k',
        url: 'https://github.com/vuejs/vue',
        category: '前端框架',
        tags: ['JavaScript', 'Framework']
      },
      {
        id: 2,
        name: 'React',
        description: '用于构建用户界面的 JavaScript 库',
        stars: '223k',
        url: 'https://github.com/facebook/react',
        category: '前端框架',
        tags: ['JavaScript', 'Library']
      },
      {
        id: 3,
        name: 'Angular',
        description: 'Web 应用开发平台',
        stars: '95k',
        url: 'https://github.com/angular/angular',
        category: '前端框架',
        tags: ['TypeScript', 'Framework']
      },
      {
        id: 4,
        name: 'Svelte',
        description: '全新的构建用户界面的方法',
        stars: '78k',
        url: 'https://github.com/sveltejs/svelte',
        category: '前端框架',
        tags: ['JavaScript', 'Compiler']
      },
      {
        id: 5,
        name: 'Next.js',
        description: 'React 框架用于生产',
        stars: '124k',
        url: 'https://github.com/vercel/next.js',
        category: '前端框架',
        tags: ['React', 'SSR']
      },
      {
        id: 6,
        name: 'Nuxt.js',
        description: 'Vue.js 框架',
        stars: '53k',
        url: 'https://github.com/nuxt/nuxt',
        category: '前端框架',
        tags: ['Vue', 'SSR']
      },
      {
        id: 7,
        name: 'Vite',
        description: '下一代前端工具',
        stars: '67k',
        url: 'https://github.com/vitejs/vite',
        category: '构建工具',
        tags: ['Build Tool', 'Fast']
      },
      {
        id: 8,
        name: 'Webpack',
        description: '模块打包工具',
        stars: '64k',
        url: 'https://github.com/webpack/webpack',
        category: '构建工具',
        tags: ['Build Tool', 'Bundler']
      },
      {
        id: 9,
        name: 'TypeScript',
        description: 'JavaScript 的超集',
        stars: '100k',
        url: 'https://github.com/microsoft/TypeScript',
        category: '编程语言',
        tags: ['Language', 'Types']
      },
      {
        id: 10,
        name: 'Tailwind CSS',
        description: '实用优先的 CSS 框架',
        stars: '81k',
        url: 'https://github.com/tailwindlabs/tailwindcss',
        category: 'CSS 框架',
        tags: ['CSS', 'Utility-First']
      },
      {
        id: 11,
        name: 'Electron',
        description: '使用 Web 技术构建桌面应用',
        stars: '113k',
        url: 'https://github.com/electron/electron',
        category: '桌面应用',
        tags: ['Desktop', 'Cross-Platform']
      },
      {
        id: 12,
        name: 'Deno',
        description: '现代的 JavaScript 和 TypeScript 运行时',
        stars: '94k',
        url: 'https://github.com/denoland/deno',
        category: '运行时',
        tags: ['Runtime', 'TypeScript']
      },
      {
        id: 13,
        name: 'Node.js',
        description: 'JavaScript 运行时环境',
        stars: '106k',
        url: 'https://github.com/nodejs/node',
        category: '运行时',
        tags: ['Runtime', 'JavaScript']
      },
      {
        id: 14,
        name: 'Express',
        description: 'Node.js Web 应用框架',
        stars: '65k',
        url: 'https://github.com/expressjs/express',
        category: '后端框架',
        tags: ['Node.js', 'Framework']
      },
      {
        id: 15,
        name: 'NestJS',
        description: '用于构建高效、可靠和可扩展的服务器端应用程序的框架',
        stars: '67k',
        url: 'https://github.com/nestjs/nest',
        category: '后端框架',
        tags: ['Node.js', 'TypeScript']
      }
    ],
    
    // 表格列头配置
    columns: [
      {
        prop: 'name',
        label: '项目名称',
        width: 180,
        fixed: 'left'
      },
      {
        prop: 'description',
        label: '描述',
        minWidth: 250
      },
      {
        prop: 'category',
        label: '分类',
        width: 120
      },
      {
        prop: 'stars',
        label: 'Stars',
        width: 100,
        align: 'center'
      },
      {
        prop: 'tags',
        label: '标签',
        width: 200,
        // 自定义渲染函数（可选）
        render: (row) => row.tags?.join(', ') || '-'
      }
    ],
    
    // 操作列配置
    actions: {
      label: '操作',
      width: 150,
      fixed: 'right',
      buttons: [
        {
          text: '访问',
          type: 'primary',
          link: true,
          handler: (row) => {
            window.open(row.url, '_blank')
          }
        },
        {
          text: '详情',
          type: 'info',
          link: true,
          handler: (row) => {
            console.log('查看详情:', row)
            // 可以跳转到详情页或打开弹窗
          }
        }
      ]
    },
    
    // 页面标题和描述（用于 SEO）
    meta: {
      title: '开源项目收集',
      description: '精选优质开源项目，包含前端框架、构建工具、后端框架等'
    }
  },
  
  // 可以继续添加其他资源类型
  // '在线工具收集': { ... },
  // '设计资源收集': { ... },
}

/**
 * 获取指定资源类型的总页数
 */
export function getTotalPages(resourceType) {
  const config = resourceConfigs[resourceType]
  if (!config) return 0
  
  // 如果有 dataSource，根据 pageSize 计算总页数
  if (config.dataSource && Array.isArray(config.dataSource)) {
    const pageSize = config.pageSize || 10
    return Math.ceil(config.dataSource.length / pageSize)
  }
  
  // 兼容旧的 data 格式
  if (config.data) {
    return Object.keys(config.data).length
  }
  
  return 0
}

/**
 * 获取指定资源类型的指定页数据
 */
export function getPageData(resourceType, page) {
  const config = resourceConfigs[resourceType]
  if (!config) return []
  
  // 如果有 dataSource，自动分页
  if (config.dataSource && Array.isArray(config.dataSource)) {
    const pageSize = config.pageSize || 10
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    return config.dataSource.slice(startIndex, endIndex)
  }
  
  // 兼容旧的 data 格式
  if (config.data) {
    return config.data[page] || []
  }
  
  return []
}

/**
 * 获取指定资源类型的配置
 */
export function getResourceConfig(resourceType) {
  return resourceConfigs[resourceType] || null
}
