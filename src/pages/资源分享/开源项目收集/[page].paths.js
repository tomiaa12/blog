import { generatePaths } from '../common/utils.js'

export default {
  paths() {
    // 生成所有页面的路径参数
    // 这会为每个页面生成静态 HTML，有利于 SEO
    return generatePaths('开源项目收集')
  },
}
