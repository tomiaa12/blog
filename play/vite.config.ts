import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import DefineOptions from "unplugin-vue-define-options/vite"
import vueJsx from "@vitejs/plugin-vue-jsx"

// import { compression } from "vite-plugin-compression2"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    DefineOptions(),
    vueJsx(),
    // gzip 压缩
    // compression(),
  ],
  server: {
    host: "0.0.0.0",
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: id => {
          // 分包
          if (id.includes("node_modules")) return "module"
        },
      },
    },
  },
})
