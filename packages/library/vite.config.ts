import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path"

// 生成打包后的 ts 类型文件
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [
    dts({
      entryRoot: "src", // 入口，不配置会生成嵌套根目录的文件
      outputDir: "es", // 输出
      insertTypesEntry: true,
    }),
    vue(),
  ],
  resolve: {
    alias: {
      // 别名
      "@": path.resolve(__dirname, "src"),
    },
  },
  // 打包为库
  build: {
    lib: {
      entry: "src/index",
      name: "index",
    },
    target: "modules",
    outDir: "es",
    rollupOptions: {
      input: ["src/index"],
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        "axios",
        "@tomiaa/theme-chalk",
        "@tomiaa/utils",
        "pixi-live2d-display",
        "pixi.js",
      ],
      output: [
        {
          format: "es", // es6 模块
          dir: "es", // 输出文件夹
          entryFileNames: "[name].js", // 文件名
          preserveModules: true, // 保留模块的文件结构
          preserveModulesRoot: "src", // 模块的入口
          exports: "named",
        },
        {
          format: "cjs", // cjs 模块
          dir: "lib", // 输出文件夹
          entryFileNames: "[name].js", // 文件名
          preserveModules: true, // 保留模块的文件结构
          preserveModulesRoot: "src", // 模块的入口
          exports: "named",
        },
      ],
    },
  },
})
