/**
 * ============================================
 * 有道词典爬虫工具
 * ============================================
 * 
 * 功能说明：
 * 从有道词典网站爬取单词的详细信息，包括音标、翻译、例句、短语、同近义词、同根词、词源等
 * 
 * 使用方法：
 * 1. 确保已安装依赖：npm install 或 pnpm install
 * 2. 安装 Playwright 浏览器：npx playwright install chromium
 * 3. 准备输入文件（见下方格式说明）
 * 4. 运行脚本：node 爬虫.js
 * 
 * 输入文件格式：
 * 需要在 save 目录下创建两个 JSON 文件：
 * - save/normalList.json（正常单词列表）
 * - save/unnormalList.json（异常单词列表，优先处理）
 * 
 * 输入文件示例（normalList.json 或 unnormalList.json）：
 * 
 * 最简单的方式（推荐）：只需要 word 字段即可，其他字段会自动初始化
 * [
 *   {
 *     "word": "hello"            // 只需要单词字段（必需）
 *   },
 *   {
 *     "word": "world"
 *   }
 * ]
 * 
 * 完整格式（可选）：如果你想保留其他字段，也可以提供完整结构
 * [
 *   {
 *     "custom": false,           // 是否自定义（可选）
 *     "id": 0,                   // ID（可选）
 *     "word": "hello",           // 单词（必需）
 *     "phonetic0": "",           // 美式音标（可选，爬虫会覆盖）
 *     "phonetic1": "",           // 英式音标（可选，爬虫会覆盖）
 *     "trans": [],               // 翻译列表（可选，爬虫会覆盖）
 *     "sentences": [],           // 例句列表（可选，爬虫会覆盖）
 *     "phrases": [],            // 短语列表（可选，爬虫会覆盖）
 *     "synos": [],              // 同近义词列表（可选，爬虫会覆盖）
 *     "relWords": {             // 同根词（可选，爬虫会覆盖）
 *       "root": "",
 *       "rels": []
 *     },
 *     "etymology": []           // 词源列表（可选，爬虫会覆盖）
 *   }
 * ]
 * 
 * 输出文件格式：
 * 脚本会自动生成以下输出文件：
 * - save/normalList-fetch.json（正常单词爬取结果）
 * - save/unnormalList-fetch.json（异常单词爬取结果）
 * 
 * 输出保证：
 * ✅ 输出时保证所有字段都存在，即使某些字段可能为空（空数组或空字符串）
 * ✅ 字段结构完全一致，便于后续处理
 * 
 * 输出文件示例（normalList-fetch.json 或 unnormalList-fetch.json）：
 * [
 *   {
 *     "custom": false,
 *     "id": 0,
 *     "word": "hello",
 *     "phonetic0": "həˈloʊ",     // 美式音标（已填充）
 *     "phonetic1": "həˈləʊ",     // 英式音标（已填充）
 *     "trans": [                 // 翻译（已填充）
 *       {
 *         "pos": "int.",         // 词性
 *         "cn": "你好；哈喽"      // 中文翻译
 *       },
 *       {
 *         "pos": "n.",
 *         "cn": "问候；打招呼"
 *       }
 *     ],
 *     "sentences": [             // 双语例句（已填充）
 *       {
 *         "c": "Hello, how are you?",           // 英文例句
 *         "cn": "你好，你好吗？"                 // 中文翻译
 *       }
 *     ],
 *     "phrases": [               // 词典短语（已填充）
 *       {
 *         "c": "say hello",      // 短语英文
 *         "cn": "打招呼"         // 短语中文
 *       }
 *     ],
 *     "synos": [                 // 同近义词（已填充）
 *       {
 *         "pos": "int.",         // 词性
 *         "cn": "你好",          // 中文翻译
 *         "ws": ["hi", "hey"]    // 同义词单词列表
 *       }
 *     ],
 *     "relWords": {              // 同根词（已填充）
 *       "root": "hello",         // 词根
 *       "rels": [                // 同根词列表
 *         {
 *           "pos": "n.",         // 词性
 *           "words": [           // 单词列表
 *             {
 *               "c": "hello",    // 英文
 *               "cn": "你好"     // 中文
 *             }
 *           ]
 *         }
 *       ]
 *     },
 *     "etymology": [             // 词源（已填充）
 *       {
 *         "t": "19世纪",         // 时间
 *         "d": "来自古英语..."   // 描述
 *       }
 *     ]
 *   }
 * ]
 * 
 * 注意：如果网页上某些内容不存在（如没有例句、短语等），对应的字段会保持为空数组 [] 或空字符串 ""，
 *       但字段本身一定存在，保证输出格式的一致性。
 * 
 * 注意事项：
 * 1. 脚本支持断点续传：如果输出文件已存在，会从未爬取的单词继续
 * 2. 自动保存：每爬取一个单词后立即保存，避免数据丢失
 * 3. 延迟控制：每个单词爬取间隔 300ms，避免请求过快被封禁
 * 4. 错误处理：单个单词失败不会中断整个流程，会继续处理下一个
 * 5. 处理顺序：先处理 unnormalList.json，再处理 normalList.json
 * 6. 原文件更新：爬取成功后，会从原文件中移除已爬取的单词
 * 
 * ============================================
 */

import fs from 'fs';
import path from 'path';
import {chromium} from 'playwright';
import pLimit from 'p-limit';
import {fileURLToPath} from 'url';
import dayjs from 'dayjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 路径设置
const normalList_FILE = path.join(__dirname, 'save', 'normalList.json');
const unnormalList_FILE = path.join(__dirname, 'save', 'unnormalList.json');

// 控制参数
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MAX_COUNT = 999999999999;


// 爬虫主函数
async function crawlWord(val, page,) {
  let word = val.word
  // 初始化数据结构，确保所有字段都存在（如果输入只有 word 字段，会自动初始化其他字段）
  const data = {
    custom: val.custom ?? false,
    id: val.id ?? 0,
    word: word,
    phonetic0: val.phonetic0 ?? '',
    phonetic1: val.phonetic1 ?? '',
    trans: val.trans ?? [],
    sentences: val.sentences ?? [],
    phrases: val.phrases ?? [],
    synos: val.synos ?? [],
    relWords: val.relWords ?? { root: '', rels: [] },
    etymology: val.etymology ?? [],
    ...val  // 保留其他可能存在的字段
  }
  const url = `https://www.youdao.com/result?word=${encodeURIComponent(word)}&lang=en`;

  console.log(url)

  try {
    await page.goto(url, {waitUntil: 'networkidle', timeout: 15000});

    // const titleEl = await page.locator('.title').first();
    // data.word = await titleEl.evaluate(el => el.firstChild?.nodeValue || '');

    const phones = await page.$$('.per-phone .phonetic');
    if (phones[0]) data.phonetic0 = (await phones[0].textContent())?.trim() || '';
    if (phones[1]) data.phonetic1 = (await phones[1].textContent())?.trim() || '';
    data.phonetic0 = data.phonetic0.replaceAll('/', '').trim()
    data.phonetic1 = data.phonetic1.replaceAll('/', '').trim()

    for (const el of await page.$$('.basic .word-exp')) {
      const pos = await el.$('.pos');
      const tran = await el.$('.trans');
      data.trans.push({
        pos: pos ? (await pos.textContent())?.trim() : '',
        cn: tran ? (await tran.textContent())?.trim() : '',
      });
    }

    if (await page.locator('div:has-text("双语例句")').count() > 0) {
      for (const el of await page.$$('.blng_sents_part .trans-container ul li .col2')) {
        const en = await el.$('.sen-eng');
        const ch = await el.$('.sen-ch');
        data.sentences.push({
          c: en ? (await en.textContent())?.trim() : '',
          cn: ch ? (await ch.textContent())?.trim() : '',
        });
      }
    }

    if (await page.locator('div:has-text("词典短语")').count() > 0) {
      for (const el of await page.$$('.phrs ul li .phrs-content')) {
        const point = await el.$('.point');
        const tran = await el.$('.phr_trans');
        data.phrases.push({
          c: point ? (await point.textContent())?.trim() : '',
          cn: tran ? (await tran.textContent())?.trim() : '',
        });
      }
    }

    try {
      if (await page.locator('div:has-text("同近义词")').count() > 0) {
        await page.getByText('同近义词', {timeout: 2000}).click();
        await page.waitForSelector('.syno', {timeout: 3000});
        for (const el of await page.$$('.syno-item')) {
          const pos = await el.$('.index');
          const tran = await el.$('.synptran');
          const wordEl = await el.$('.clickable');
          let str = wordEl ? (await wordEl.textContent())?.trim() : '';
          data.synos.push({
            pos: pos ? (await pos.textContent())?.trim() : '',
            cn: tran ? (await tran.textContent())?.trim() : '',
            ws: str.split('/').map(s => s.trim()).filter(Boolean),
          });
        }
      }
    } catch {
    }

    try {
      if (await page.locator('div:has-text("同根词")').count() > 0) {
        await page.getByText('同根词', {timeout: 2000}).click();
        await page.waitForSelector('.rel_word', {timeout: 3000});
        const cigen = await page.$('.trans-container > p .point');
        data.relWords.root = cigen ? (await cigen.textContent())?.trim() : '';
        for (const el of await page.$$('.rel_word_item')) {
          let item = {pos: '', words: []};
          const pos = await el.$('.pos');
          item.pos = pos ? (await pos.textContent())?.trim() : '';
          for (const el2 of await el.$$('.rel_content p')) {
            const word = await el2.$('.point');
            let wordStr = word ? (await word.textContent())?.trim() : '';
            let str = el2 ? (await el2.textContent())?.trim() : '';
            str = str.replace(wordStr, '');
            item.words.push({c: wordStr, cn: str});
          }
          data.relWords.rels.push(item);
        }
      }
    } catch {
    }

    try {
      if (await page.locator('div:has-text("词源")').count() > 0) {
        await page.getByText('词源', {timeout: 2000}).click();
        await page.waitForSelector('.etymology', {timeout: 3000});
        for (const el of await page.$$('.trans-cell')) {
          const header = await el.$('.header');
          const zh_result = await el.$('.zh_result');
          data.etymology.push({
            t: header ? (await header.textContent())?.trim() : '',
            d: zh_result ? (await zh_result.textContent())?.trim() : '',
          });
        }
      }
    } catch {
    }
    
    // 确保返回前所有字段都存在，即使某些字段可能为空
    return {
      custom: data.custom ?? false,
      id: data.id ?? 0,
      word: data.word || word,
      phonetic0: data.phonetic0 ?? '',
      phonetic1: data.phonetic1 ?? '',
      trans: Array.isArray(data.trans) ? data.trans : [],
      sentences: Array.isArray(data.sentences) ? data.sentences : [],
      phrases: Array.isArray(data.phrases) ? data.phrases : [],
      synos: Array.isArray(data.synos) ? data.synos : [],
      relWords: data.relWords && typeof data.relWords === 'object' 
        ? { root: data.relWords.root ?? '', rels: Array.isArray(data.relWords.rels) ? data.relWords.rels : [] }
        : { root: '', rels: [] },
      etymology: Array.isArray(data.etymology) ? data.etymology : [],
    };
  } catch (err) {
    console.log(err)
    console.log(`🔁 ${word} 抓取失败...`);
    // 即使失败也返回完整的数据结构，确保所有字段都存在
    return {
      custom: data.custom ?? false,
      id: data.id ?? 0,
      word: data.word || word,
      phonetic0: data.phonetic0 ?? '',
      phonetic1: data.phonetic1 ?? '',
      trans: Array.isArray(data.trans) ? data.trans : [],
      sentences: Array.isArray(data.sentences) ? data.sentences : [],
      phrases: Array.isArray(data.phrases) ? data.phrases : [],
      synos: Array.isArray(data.synos) ? data.synos : [],
      relWords: data.relWords && typeof data.relWords === 'object' 
        ? { root: data.relWords.root ?? '', rels: Array.isArray(data.relWords.rels) ? data.relWords.rels : [] }
        : { root: '', rels: [] },
      etymology: Array.isArray(data.etymology) ? data.etymology : [],
    };
  }
}

(async () => {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage()

  async function start(file) {
    const raw = JSON.parse(fs.readFileSync(file, 'utf-8'));
    let removeList = raw.slice()
    const resultMap = new Map();
    let newFileName = file.replaceAll('.json', '-fetch.json')
    try {
      const newRaw = JSON.parse(fs.readFileSync(newFileName, 'utf-8'));
      console.log('已保存：', newRaw.length);
      newRaw.map(word => {
        resultMap.set(word.word, word);
      })
    } catch (e) {

    }


    for (let i = 0; i < raw.length; i++) {
      let word = raw[i];
      console.log(`爬取：${file}，${word.word}，进度：${i} / ${raw.length}；时间：${dayjs().format('YYYY-MM-DD HH:mm:ss')}`)
      const result = await crawlWord(word, page);
      if (result) {
        resultMap.set(word.word, result);
        fs.writeFileSync(file.replaceAll('.json', '-fetch.json'), JSON.stringify(Array.from(resultMap.values()), null, 2), 'utf-8');
        removeList.shift()
        fs.writeFileSync(file, JSON.stringify(removeList, null, 2), 'utf-8');
      }
      await sleep(300);
    }
  }

  await start(unnormalList_FILE)
  await start(normalList_FILE)

  await browser.close();

  console.log('\n🎉 所有任务完成！');
})();
