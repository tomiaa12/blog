import { src, dest, watch } from "gulp"
import gulpSass from "gulp-sass"
import scss from "sass"
const sass = gulpSass(scss)

const build = cb => {
  src("./src/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("./lib"))
  cb && cb()
  console.log("Sass 文件编译触发")
}
export default () => {
  build()
  watch("./src/**/*.scss", build)
}
