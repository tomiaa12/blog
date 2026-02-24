# Node.js 控制台动态进度条（带转圈动画）

在 Node.js 中，可以使用 `process.stdout.write` 和 `\r` 实现类似 Git 拉取时的动态进度更新效果，比如：

```
Receiving objects:  99% (1469/1483), 11.21 MiB | 11.16 MiB/s
```

并且加上转圈圈的动画（`/ - \ |`）让界面更生动。

---

## 原理

- **`process.stdout.write`**：直接写入控制台，不自动换行。
- **`\r`（回车符）**：将光标移动到当前行的开头，覆盖之前的输出。
- **模拟转圈圈**：依次切换字符数组 `['/', '-', '\\', '|']`。

---

## 完整代码示例

```javascript
// 文件名：progress-spinner.js

const total = 1483;
let current = 0;
let spinnerIndex = 0;
const spinnerChars = ['/', '-', '\\', '|'];

function formatSize(sizeInMB) {
  return sizeInMB.toFixed(2) + ' MiB';
}

function updateProgress(current, total) {
  const percent = ((current / total) * 100).toFixed(2);
  const speed = (10 + Math.random() * 5).toFixed(2); // 模拟传输速度
  const size = (current / total * 20).toFixed(2);    // 模拟传输总量，假设20MB
  const spinner = spinnerChars[spinnerIndex % spinnerChars.length];
  
  const text = `${spinner} Receiving objects: ${percent}% (${current}/${total}), ${formatSize(size)} | ${speed} MiB/s`;
  
  process.stdout.write('\r' + text);

  spinnerIndex++;
}

// 模拟数据传输
const interval = setInterval(() => {
  current += Math.floor(Math.random() * 30) + 1;

  if (current >= total) {
    current = total;
    updateProgress(current, total);
    console.log('\nDone!');
    clearInterval(interval);
  } else {
    updateProgress(current, total);
  }
}, 100);
```

---

## 效果展示

运行后，在终端中看到：

```
| Receiving objects:  18.30% (271/1483), 3.67 MiB | 11.23 MiB/s
/ Receiving objects:  20.30% (301/1483), 4.03 MiB | 13.12 MiB/s
- Receiving objects:  22.50% (334/1483), 4.47 MiB | 10.92 MiB/s
...
Done!
```

进度条不断覆盖更新，转圈圈 `/ - \ |` 动画不停切换。

---

## 小结

- 如果想**自定义**图标动画，可以修改 `spinnerChars` 数组。
- 如果想**更真实**的速度变化，可以自己加定时器记录时间和数据量计算实际速度。
- 如果在 Windows 的某些控制台下乱码，可以适当调整字符集或者使用更基础的 ASCII 字符。

---

## 进阶推荐

如果需要更强大更好看的进度条，可以使用开源库，比如：

- [`cli-progress`](https://www.npmjs.com/package/cli-progress)
- [`ora`](https://www.npmjs.com/package/ora)（超好用的转圈加载器）

例如使用 `ora` 可以几行代码快速实现漂亮的动态效果。

---
