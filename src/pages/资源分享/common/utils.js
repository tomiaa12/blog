/**
 * 资源分享公共工具函数
 */

import { getTotalPages } from './resourceConfig.js'

/**
 * 生成动态路由路径配置
 * 用于 VitePress 的 [page].paths.js
 * 
 * @param {string} resourceType - 资源类型，如 '开源项目收集'
 * @returns {Array} 路径参数数组
 * 
 * @example
 * export default {
 *   paths() {
 *     return generatePaths('开源项目收集')
 *   }
 * }
 */
export function generatePaths(resourceType) {
  const totalPages = getTotalPages(resourceType)
  const paths = []
  
  for (let i = 1; i <= totalPages; i++) {
    paths.push({
      params: {
        page: i.toString()
      }
    })
  }
  
  return paths
}

/**
 * 生成页面元数据（用于 SEO）
 * 
 * @param {string} resourceType - 资源类型
 * @param {number} page - 页码
 * @param {object} config - 资源配置
 * @returns {object} 页面元数据
 */
export function generatePageMeta(resourceType, page, config) {
  const title = `${config?.meta?.title || resourceType} - 第 ${page} 页`
  const description = config?.meta?.description || ''
  
  return {
    title,
    description,
    frontmatter: {
      title,
      description,
      head: [
        ['meta', { name: 'keywords', content: `${resourceType},资源分享,开源项目` }],
        ['meta', { property: 'og:title', content: title }],
        ['meta', { property: 'og:description', content: description }]
      ]
    }
  }
}

/**
 * 生成导航链接
 * 
 * @param {string} resourceType - 资源类型
 * @param {string} basePath - 基础路径，如 '/资源分享/开源项目收集'
 * @returns {Array} 导航链接数组
 */
export function generateNavLinks(resourceType, basePath) {
  const totalPages = getTotalPages(resourceType)
  const links = []
  
  for (let i = 1; i <= totalPages; i++) {
    links.push({
      text: `第 ${i} 页`,
      link: `${basePath}/${i}`
    })
  }
  
  return links
}
