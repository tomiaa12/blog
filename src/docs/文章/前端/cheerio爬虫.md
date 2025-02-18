# cheerio 爬虫示例

## cheerio.load

load 加载 html 字符串

```js
const { data: html } = await axios({
  method: "get",
  maxBodyLength: Infinity,
  url: pageURL,
  headers: {
    host: "acggw.me",
  },
})
const $ = cheerio.load(html)
```

## 获取 html 内特定标签内容

```js
const results = []
$(".list-content").each(async (_, element) => {
  const el = $(element)

  const data = {
    href: "",
    dimensions: "",
  }

  const a = el.find("h2 a")
  data.href = a.attr("href")
  data.title = a.html().trim()

  data.dimensions = el.find(".list-footer a").html()

  if (data.href && !crawledLinks.has(data.href)) {
    // 记录已爬取的链接
    results.push(data)
    crawledLinks.add(data.href)
  }
})
```

## 案例

```js
import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

// 配置
const baseURL = "https://www.xxxx.com/page/"; // 分页 URL 模板
const outputFile = path.resolve(process.cwd(), "paged_data.json"); // 数据存储文件
const progressFile = path.resolve(process.cwd(), "progress.json"); // 进度存储文件
const maxPages = 300; // 最大页数限制（根据需求调整）

// 加载已保存的数据
const loadData = (filePath, defaultValue = []) => {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return defaultValue;
};

// 保存数据到文件
const saveData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

const sleep = (timer = 100) =>
  new Promise((res) => {
    setTimeout(() => {
      res(1000);
    }, timer);
  });

// 抓取单页内容
const crawlPage = async (pageNumber, crawledLinks) => {
  const pageURL = `${baseURL}${pageNumber}`;
  console.log(`正在获取: ${pageURL}`);

  try {
    const { data: html } = await axios({
      method: "get",
      maxBodyLength: Infinity,
      url: pageURL,
      headers: {
        host: "xxx.com",
      },
    });
    const $ = cheerio.load(html);

    const results = [];
    $(".list-content").each(async (_, element) => {
      const el = $(element);

      const data = {
        href: "",
        dimensions: "",
      };

      const a = el.find("h2 a");
      data.href = a.attr("href");
      data.title = a.html().trim();

      data.dimensions = el.find(".list-footer a").html();

      if (data.href && !crawledLinks.has(data.href)) {
        // 记录已爬取的链接
        results.push(data);
        crawledLinks.add(data.href);
      }
    });

    try {
      for (let data of results) {
        // await sleep();
        console.log("开始获取" + data.title);
        const { data: html } = await axios.request({
          method: "get",
          url: data.href,
          headers: {
            host: "xxx.com",
          },
        });
        const $ = cheerio.load(html);

        data.content = $(".panel-body").html().trim();

        data.tags = [];
        $(".post-tags a").each((_, el) => {
          data.tags.push($(el).text().trim());
        });

        $('[href*="屏幕截图.jpg"]').remove();
      }
    } catch (e) {
      console.log("err");
    }

    return results;
  } catch (error) {
    console.error(`错误链接 ${pageURL}:` /* error.message */);
    return [];
  }
};

// 主程序
const startCrawling = async () => {
  // 加载爬取进度和已爬取数据
  const crawledData = loadData(outputFile);
  const crawledLinks = new Set(crawledData.map(({ href }) => href));
  const progress = loadData(progressFile, { currentPage: 1 });

  let { currentPage } = progress;

  for (; currentPage <= maxPages; currentPage++) {
    // 抓取当前页内容
    const pageResults = await crawlPage(currentPage, crawledLinks);

    // 如果当前页无有效数据，提前停止爬取
    if (pageResults.length === 0) {
      console.log(`没有找到数据 ==> 第 ${currentPage} 页`);
      break;
    }

    // 保存新数据
    crawledData.push(...pageResults);
    saveData(outputFile, crawledData);

    // 更新进度并保存
    saveData(progressFile, { currentPage: currentPage + 1 });

    console.log(`第 ${currentPage} 页已保存:`, pageResults.length, "项");
  }

  console.log("爬取结束");
};

// 启动爬虫
startCrawling();
```
