import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = resolveFromArgs(2, path.resolve(__dirname, '../src/public/dicts'));
const outputFile = resolveFromArgs(3, path.resolve(inputDir, 'merged-unique-words.json'));

function resolveFromArgs(index, fallback) {
  const userValue = process.argv[index];
  return userValue ? path.resolve(process.cwd(), userValue) : fallback;
}

function normaliseWord(rawWord) {
  return typeof rawWord === 'string' ? rawWord.trim() : '';
}

function scoreEntry(entry) {
  if (!entry || typeof entry !== 'object') return 0;
  const uniqueKeys = Object.keys(entry).filter((key) => key !== 'word');
  return uniqueKeys.length;
}

async function readJsonFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    if (!content.trim()) return null;
    return JSON.parse(content);
  } catch (error) {
    console.warn(`[跳过] 解析文件失败: ${filePath}`);
    console.warn(error instanceof Error ? error.message : error);
    return null;
  }
}

function collectEntries(data, store) {
  if (data == null) return;

  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    const word = normaliseWord(String(data));
    if (word) {
      store(word, { word });
    }
    return;
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      collectEntries(item, store);
    }
    return;
  }

  if (typeof data === 'object') {
    if (Object.prototype.hasOwnProperty.call(data, 'word')) {
      const word = normaliseWord(data.word);
      if (word) {
        const entry = { ...data, word };
        store(word, entry);
      }
      return;
    }

    for (const value of Object.values(data)) {
      collectEntries(value, store);
    }
  }
}

async function main() {
  console.time('总耗时');
  const files = await fs.readdir(inputDir);
  const jsonFiles = files.filter((filename) => filename.toLowerCase().endsWith('.json'));

  if (!jsonFiles.length) {
    console.warn('未在指定目录中找到任何 JSON 文件。');
    return;
  }

  const wordMap = new Map();

  const updateStore = (word, entry) => {
    const existing = wordMap.get(word);
    if (!existing) {
      wordMap.set(word, entry);
      return;
    }

    if (scoreEntry(entry) > scoreEntry(existing)) {
      wordMap.set(word, entry);
    }
  };

  for (const filename of jsonFiles) {
    const filePath = path.join(inputDir, filename);
    console.log(`处理: ${filename}`);
    const jsonContent = await readJsonFile(filePath);
    if (jsonContent !== null) {
      collectEntries(jsonContent, updateStore);
    }
  }

  const merged = Array.from(wordMap.values()).sort((a, b) => a.word.localeCompare(b.word, 'en'));
  await fs.writeFile(outputFile, JSON.stringify(merged, null, 2), 'utf8');

  console.log(`输出文件: ${outputFile}`);
  console.log(`唯一单词数量: ${merged.length}`);
  console.timeEnd('总耗时');
}

main().catch((error) => {
  console.error('执行失败:');
  console.error(error);
  process.exit(1);
});

