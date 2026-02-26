#!/bin/bash

# 创建 icon.png 的辅助脚本

echo "🎮 小霸王插件 - 图标创建工具"
echo ""

ICON_PATH="resources/icon.png"
SOURCE_ICON="../WordDictPractice/resources/icon.png"

# 检查是否已存在
if [ -f "$ICON_PATH" ]; then
    echo "✅ icon.png 已存在"
    ls -lh "$ICON_PATH"
    exit 0
fi

echo "方法 1: 从 WordDictPractice 复制（临时占位符）"
echo "----------------------------------------"
if [ -f "$SOURCE_ICON" ]; then
    echo "发现源文件，是否复制？(y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        cp "$SOURCE_ICON" "$ICON_PATH"
        echo "✅ 已复制临时图标"
        echo "⚠️  请稍后替换为游戏主题的图标"
        exit 0
    fi
fi

echo ""
echo "方法 2: 使用 ImageMagick 转换 SVG"
echo "----------------------------------------"
if command -v convert &> /dev/null; then
    echo "发现 ImageMagick，是否转换 icon.svg？(y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        convert -background none -resize 128x128 resources/icon.svg "$ICON_PATH"
        echo "✅ 已生成 icon.png"
        exit 0
    fi
else
    echo "未安装 ImageMagick"
    echo "安装: brew install imagemagick (macOS)"
fi

echo ""
echo "方法 3: 使用 Inkscape 转换 SVG"
echo "----------------------------------------"
if command -v inkscape &> /dev/null; then
    echo "发现 Inkscape，是否转换 icon.svg？(y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        inkscape resources/icon.svg --export-type=png --export-filename="$ICON_PATH" -w 128 -h 128
        echo "✅ 已生成 icon.png"
        exit 0
    fi
else
    echo "未安装 Inkscape"
    echo "安装: brew install inkscape (macOS)"
fi

echo ""
echo "方法 4: 在线转换"
echo "----------------------------------------"
echo "1. 访问: https://www.aconvert.com/cn/image/svg-to-png/"
echo "2. 上传 resources/icon.svg"
echo "3. 设置尺寸为 128x128"
echo "4. 下载并保存为 resources/icon.png"
echo ""
echo "或访问: https://cloudconvert.com/svg-to-png"

echo ""
echo "❌ 未创建 icon.png"
echo "请使用上述方法之一手动创建"

