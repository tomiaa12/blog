# vue 前端预览 Excel 表格（导入导出）

你可能需要[前端预览 word 文件](./vue预览word文件docx.md)  


## 第一种方法（推荐）

- **实现的功能：纯前端编辑、导入、导出 excel。**

### 依赖包

安装 `npm i luckyexcel` 插件

以及 cdn 依赖文件（下列文件官方目前没有发布 npm 模块，需要用标签引入）
- https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/css/pluginsCss.css
- https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/plugins.css
- https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/css/luckysheet.css
- https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/assets/iconfont/iconfont.css
- https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/js/plugin.js
- https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/luckysheet.umd.js

### template 模板

```html
<!-- 用于渲染表格的容器 -->
<div id="luckysheet"></div>
```

### 加载依赖

```js
import LuckyExcel from 'luckyexcel';

/* 下列代码加载 cdn 文件，你也可以在 public 文件夹在 html 中引入 */
// 封装加载 src 文件方法
function asynLoad(src, isCss = false) {
  return new Promise(res => {
    let el;
    if (isCss) {
      el = document.createElement('link');
      el.rel = 'stylesheet';
      el.href = src;
    } else {
      el = document.createElement('script');
      el.src = src;
    }
    document.documentElement.appendChild(el);
    el.onload = el.onreadystatechange = function() {
      if (
        !this.readyState ||
        this.readyState == 'loaded' ||
        this.readyState == 'complete'
      ) {
        res(true);
      }
      this.onload = this.onreadystatechange = null;
    };
  });
}

/* Vue 中加载 cdn 文件 */
export default{
  created() {
    this.loadPlugins();
  },
  methods: {
    loadPlugins() {
      const baseURL = '//cdn.jsdelivr.net/npm/luckysheet@latest/dist';
      this.loading = true;
      this.tip = '正在加载依赖插件，请耐心等待...';
      Promise.all([
        asynLoad(`${baseURL}/plugins/css/pluginsCss.css`, true),
        asynLoad(`${baseURL}/plugins/plugins.css`, true),
        asynLoad(`${baseURL}/css/luckysheet.css`, true),
        asynLoad(`${baseURL}/assets/iconfont/iconfont.css`, true),
        asynLoad(`${baseURL}/plugins/js/plugin.js`),
        asynLoad(`${baseURL}/luckysheet.umd.js`)
      ])
        .then(() => {
          luckysheet = (window as any).luckysheet;
          this.getOriginFile(); // 获取远端文件
        })
        .catch(res => {
          this.loading = false;
          this.errStatus = 1;
          this.errorTitle = '插件加载失败，请刷新后重试！';
        })
    }
  },
}
```

### 获取远端（本地选择）文件渲染
```js
// 获取远程文件
getOriginFile() {
  this.tip = '正在下载文件...';
  this.loading = true
  axios({
    url: this.fileURL,
    responseType: 'blob'
  }).then(({ data }) => {
    const blob = new Blob([data]);
    const file = new File([blob], this.fileName);
    this.init(file); // 开始渲染
  }).catch(e => {
    this.errorTitle = '文件解析失败，请下载后使用 Excel 打开或点击重试！'
    this.errStatus = 2;
  }).finally(() => {
    this.loading = false;
  })
}

// 渲染方法，接受文件对象，如果是本地文件直接传入文件即可
init(file: File) {
  luckysheet.destroy(); // 先销毁当前容器
  LuckyExcel.transformExcelToLucky(file, exportJson => {
    if (exportJson.sheets === null || !exportJson.sheets.length) {
      this.$message.error('无法读取excel文件的内容，当前不支持xls文件！');
      return;
    }
    luckysheet.create({
      container: 'luckysheet',
      showinfobar: false,
      lang: 'zh',
      data: exportJson.sheets,
      title: exportJson.info.name,
      userInfo: exportJson.info.name.creator
    });
  });
}
```

### 导出 excel

```js
import { exportExcel } from './exportExcel.js';
exportExcel(luckysheet.getAllSheets(), 'fileName');
```

::: details 点击查看 exportExcel.js
```js
const Excel = require('exceljs/dist/es5/exceljs.browser')

import FileSaver from 'file-saver'

export let exportExcel = (luckysheet, value) => {
  // 参数为luckysheet.getluckysheetfile()获取的对象
  // 1.创建工作簿，可以为工作簿添加属性
  const workbook = new Excel.Workbook()
  // 2.创建表格，第二个参数可以配置创建什么样的工作表
  if (Object.prototype.toString.call(luckysheet) === '[object Object]') {
    luckysheet = [luckysheet]
  }
  luckysheet.forEach(function(table) {
    if (table.data.length === 0) return  true
    // ws.getCell('B2').fill = fills.
    const worksheet = workbook.addWorksheet(table.name)
    const merge = (table.config && table.config.merge) || {}
    const borderInfo = (table.config && table.config.borderInfo) || {}
    // 3.设置单元格合并,设置单元格边框,设置单元格样式,设置值
    setStyleAndValue(table.data, worksheet)
    setMerge(merge, worksheet)
    setBorder(borderInfo, worksheet)
    return true
  })

  // return
  // 4.写入 buffer
  const buffer = workbook.xlsx.writeBuffer().then(data => {
    // console.log('data', data)
    const blob = new Blob([data], {
      type: 'application/vnd.ms-excel;charset=utf-8'
    })
    FileSaver.saveAs(blob, `${value}.xlsx`)
  })
  return buffer
}

var setMerge = function(luckyMerge = {}, worksheet) {
  const mergearr = Object.values(luckyMerge)
  mergearr.forEach(function(elem) {
    // elem格式：{r: 0, c: 0, rs: 1, cs: 2}
    // 按开始行，开始列，结束行，结束列合并（相当于 K10:M12）
    worksheet.mergeCells(
      elem.r + 1,
      elem.c + 1,
      elem.r + elem.rs,
      elem.c + elem.cs
    )
  })
}

var setBorder = function(luckyBorderInfo, worksheet) {
  if (!Array.isArray(luckyBorderInfo)) return
  // console.log('luckyBorderInfo', luckyBorderInfo)
  luckyBorderInfo.forEach(function(elem) {
    // 现在只兼容到borderType 为range的情况
    // console.log('ele', elem)
    if (elem.rangeType === 'range') {
      let border = borderConvert(elem.borderType, elem.style, elem.color)
      let rang = elem.range[0]
      // console.log('range', rang)
      let row = rang.row
      let column = rang.column
      for (let i = row[0] + 1; i < row[1] + 2; i++) {
        for (let y = column[0] + 1; y < column[1] + 2; y++) {
          worksheet.getCell(i, y).border = border
        }
      }
    }
    if (elem.rangeType === 'cell') {
      // col_index: 2
      // row_index: 1
      // b: {
      //   color: '#d0d4e3'
      //   style: 1
      // }
      const { col_index, row_index } = elem.value
      const borderData = Object.assign({}, elem.value)
      delete borderData.col_index
      delete borderData.row_index
      let border = addborderToCell(borderData, row_index, col_index)
      // console.log('bordre', border, borderData)
      worksheet.getCell(row_index + 1, col_index + 1).border = border
    }
    // console.log(rang.column_focus + 1, rang.row_focus + 1)
    // worksheet.getCell(rang.row_focus + 1, rang.column_focus + 1).border = border
  })
}
var setStyleAndValue = function(cellArr, worksheet) {
  if (!Array.isArray(cellArr)) return
  cellArr.forEach(function(row, rowid) {
    row.every(function(cell, columnid) {
      if (!cell) return true
      let fill = fillConvert(cell.bg)

      let font = fontConvert(
        cell.ff,
        cell.fc,
        cell.bl,
        cell.it,
        cell.fs,
        cell.cl,
        cell.ul
      )
      let alignment = alignmentConvert(cell.vt, cell.ht, cell.tb, cell.tr)
      let value = ''

      if (cell.f) {
        value = { formula: cell.f, result: cell.v }
      } else if (!cell.v && cell.ct && cell.ct.s) {
        // xls转为xlsx之后，内部存在不同的格式，都会进到富文本里，即值不存在与cell.v，而是存在于cell.ct.s之后
        // value = cell.ct.s[0].v
        cell.ct.s.forEach(arr => {
          value += arr.v
        })
      } else {
        value = cell.v
      }
      //  style 填入到_value中可以实现填充色
      let letter = createCellPos(columnid)
      let target = worksheet.getCell(letter + (rowid + 1))
      // console.log('1233', letter + (rowid + 1))
      for (const key in fill) {
        target.fill = fill
        break
      }
      target.font = font
      target.alignment = alignment
      target.value = value

      return true
    })
  })
}

var fillConvert = function(bg) {
  if (!bg) {
    return {}
  }
  // const bgc = bg.replace('#', '')
  let fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: bg.replace('#', '') }
  }
  return fill
}

var fontConvert = function(
  ff = 0,
  fc = '#000000',
  bl = 0,
  it = 0,
  fs = 10,
  cl = 0,
  ul = 0
) {
  // luckysheet：ff(样式), fc(颜色), bl(粗体), it(斜体), fs(大小), cl(删除线), ul(下划线)
  const luckyToExcel = {
    0: '微软雅黑',
    1: '宋体（Song）',
    2: '黑体（ST Heiti）',
    3: '楷体（ST Kaiti）',
    4: '仿宋（ST FangSong）',
    5: '新宋体（ST Song）',
    6: '华文新魏',
    7: '华文行楷',
    8: '华文隶书',
    9: 'Arial',
    10: 'Times New Roman ',
    11: 'Tahoma ',
    12: 'Verdana',
    num2bl: function(num) {
      return num === 0 ? false : true
    }
  }
  // 出现Bug，导入的时候ff为luckyToExcel的val

  let font = {
    name: typeof ff === 'number' ? luckyToExcel[ff] : ff,
    family: 1,
    size: fs,
    color: { argb: fc.replace('#', '') },
    bold: luckyToExcel.num2bl(bl),
    italic: luckyToExcel.num2bl(it),
    underline: luckyToExcel.num2bl(ul),
    strike: luckyToExcel.num2bl(cl)
  }

  return font
}

var alignmentConvert = function(
  vt = 'default',
  ht = 'default',
  tb = 'default',
  tr = 'default'
) {
  // luckysheet:vt(垂直), ht(水平), tb(换行), tr(旋转)
  const luckyToExcel = {
    vertical: {
      0: 'middle',
      1: 'top',
      2: 'bottom',
      default: 'top'
    },
    horizontal: {
      0: 'center',
      1: 'left',
      2: 'right',
      default: 'left'
    },
    wrapText: {
      0: false,
      1: false,
      2: true,
      default: false
    },
    textRotation: {
      0: 0,
      1: 45,
      2: -45,
      3: 'vertical',
      4: 90,
      5: -90,
      default: 0
    }
  }

  let alignment = {
    vertical: luckyToExcel.vertical[vt],
    horizontal: luckyToExcel.horizontal[ht],
    wrapText: luckyToExcel.wrapText[tb],
    textRotation: luckyToExcel.textRotation[tr]
  }
  return alignment
}

var borderConvert = function(borderType, style = 1, color = '#000') {
  // 对应luckysheet的config中borderinfo的的参数
  if (!borderType) {
    return {}
  }
  const luckyToExcel = {
    type: {
      'border-all': 'all',
      'border-top': 'top',
      'border-right': 'right',
      'border-bottom': 'bottom',
      'border-left': 'left'
    },
    style: {
      0: 'none',
      1: 'thin',
      2: 'hair',
      3: 'dotted',
      4: 'dashDot', // 'Dashed',
      5: 'dashDot',
      6: 'dashDotDot',
      7: 'double',
      8: 'medium',
      9: 'mediumDashed',
      10: 'mediumDashDot',
      11: 'mediumDashDotDot',
      12: 'slantDashDot',
      13: 'thick'
    }
  }
  let template = {
    style: luckyToExcel.style[style],
    color: { argb: color.replace('#', '') }
  }
  let border = {}
  if (luckyToExcel.type[borderType] === 'all') {
    border['top'] = template
    border['right'] = template
    border['bottom'] = template
    border['left'] = template
  } else {
    border[luckyToExcel.type[borderType]] = template
  }
  // console.log('border', border)
  return border
}

function addborderToCell(borders, row_index, col_index) {
  let border = {}
  const luckyExcel = {
    type: {
      l: 'left',
      r: 'right',
      b: 'bottom',
      t: 'top'
    },
    style: {
      0: 'none',
      1: 'thin',
      2: 'hair',
      3: 'dotted',
      4: 'dashDot', // 'Dashed',
      5: 'dashDot',
      6: 'dashDotDot',
      7: 'double',
      8: 'medium',
      9: 'mediumDashed',
      10: 'mediumDashDot',
      11: 'mediumDashDotDot',
      12: 'slantDashDot',
      13: 'thick'
    }
  }
  // console.log('borders', borders)
  for (const bor in borders) {
    // console.log(bor)
    if (borders[bor].color.indexOf('rgb') === -1) {
      border[luckyExcel.type[bor]] = {
        style: luckyExcel.style[borders[bor].style],
        color: { argb: borders[bor].color.replace('#', '') }
      }
    } else {
      border[luckyExcel.type[bor]] = {
        style: luckyExcel.style[borders[bor].style],
        color: { argb: borders[bor].color }
      }
    }
  }

  return border
}

function createCellPos(n) {
  let ordA = 'A'.charCodeAt(0)

  let ordZ = 'Z'.charCodeAt(0)
  let len = ordZ - ordA + 1
  let s = ''
  while (n >= 0) {
    s = String.fromCharCode((n % len) + ordA) + s

    n = Math.floor(n / len) - 1
  }
  return s
}
```
:::



### demo


[gitee仓库地址](https://gitee.com/tomiaa/ExcelPreview)

[新标签打开demo](https://tomiaa.gitee.io/excelpreview/)

<iframe src="https://tomiaa.gitee.io/excelpreview/" ></iframe>

## 第二种方法（简单预览）

* 此方法简单的渲染成表格，需要自己修改样式，需要编辑功能可以去看xlsx的api文档

1、安装插件

```sh
npm i xlsx
```

2、示例

``` vue
<template>
  <div class="home">
    <div v-html="tableau"></div>
  </div>
</template>

<script>
import axios from 'axios'
import XLSX from "xlsx";
export default {
  data(){
    return {
      tableau: null,
    }
  },
  mounted(){
     axios.get('/xlsx',{
       responseType: "arraybuffer", // 设置响应体类型为arraybuffer
     }).then(({data})=> {
       let workbook = XLSX.read(new Uint8Array(data), {type:"array"}); // 解析数据
       var worksheet = workbook.Sheets[workbook.SheetNames[0]]; // workbook.SheetNames 下存的是该文件每个工作表名字,这里取出第一个工作表
       this.tableau = XLSX.utils.sheet_to_html(worksheet); // 渲染
     })
  }
}
</script>

```
