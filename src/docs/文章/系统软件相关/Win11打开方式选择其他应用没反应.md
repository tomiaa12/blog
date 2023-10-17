# Win11 打开方式选择其他应用没反应

1. 复制以下内容

```sh
Windows Registry Editor Version 5.00
[HKEY_CLASSES_ROOT\Unknown\shell\OpenWithSetDefaultOn]
"MultiSelectModel"="Single"
"ProgrammaticAccessOnly"=""
[HKEY_CLASSES_ROOT\Unknown\shell\OpenWithSetDefaultOn\command]
@=hex(2):25,00,53,00,79,00,73,00,74,00,65,00,6d,00,52,00,6f,00,6f,00,74,00,25,\
00,5c,00,73,00,79,00,73,00,74,00,65,00,6d,00,33,00,32,00,5c,00,4f,00,70,00,\
65,00,6e,00,57,00,69,00,74,00,68,00,2e,00,65,00,78,00,65,00,20,00,2d,00,6f,\
00,76,00,65,00,72,00,72,00,69,00,64,00,65,00,20,00,22,00,25,00,31,00,22,00,\
00,00
"DelegateExecute"="{e44e9428-bdbc-4987-a099-40dc8fd255e7}"
```

2. 新建一个 txt 文本粘贴
3. 按键盘上的`Ctrl + Shift + S`另存为，另存为时文件名改成`.reg`结尾格式，保存类型为所以文件，编码为`ANSI`格式。
4. 双击打开 reg 格式文件即可
