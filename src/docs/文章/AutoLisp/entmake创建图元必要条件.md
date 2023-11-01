# CAD AutoLisp entmake 创建图元必要条件

entmake 创建图元较 command 速度快，且不受捕捉等 CAD 环境因素影响，因此优先选用 entmake。
entmake 创建图元必要条件，即创建图元的最少组码项，再少就无法正确创建图元，实际使用中需要颜色、图层等组码项自己添加。

## 直线

```lisp
(entmake (list '(0 . "LINE") (cons 10 pt1) (cons 11 pt2)))
```

## 两顶点多段线（多顶点类似）

```lisp
(entmake (list '(0 . "LWPOLYLINE") '(100 . "AcDbEntity") '(100 . "AcDbPolyline") (cons 90 2) (cons 10 pt1) (cons 10 pt2)))
```

## 点表生成多段线
```lisp
(entmake 
  (append (list '(0 . "LWPOLYLINE") '(100 . "AcDbEntity") '(100 . "AcDbPolyline") (cons 90 (length lst)))
  (mapcar '(lambda (pt)(cons 10 pt)) lst ))
)
```

## 圆
```lisp
(entmake (list '(0 . "CIRCLE") (cons 10 pt) (cons 40 r)))
```

## 圆弧
```lisp
  (entmake (list '(0 . "ARC") (cons 10 pt) (cons 40 r) (cons 50 ang1) (cons 51 ang2)))
```

## 单行文本
```lisp
  (entmake (list '(0 . "TEXT") (cons 1 str) (cons 10 pt) (cons 40 5)))
```

## 多行文本
```lisp
(entmake (list '(0 . "MTEXT") '(100 . "AcDbEntity") '(100 . "AcDbMText") '(7 . "Standard") (cons 1 str) (cons 10 pt)))
```

## 半径标注
```lisp
(entmake (list '(0 . "DIMENSION") '(100 . "AcDbEntity") '(100 . "AcDbDimension")(cons 10 pt) '(70 . 36) '(100 . "AcDbRadialDimension")        (cons 15 pt1) ) )
```

## 直径标注
```lisp
(entmake (list '(0 . "DIMENSION") '(100 . "AcDbEntity") '(100 . "AcDbDimension") (cons 10 pt1) (cons 11 pt2) '(70 . 163) '
 (100 . "AcDbDiametricDimension") (cons 15 pt3))
)
```

## 水平标注
```lisp
(entmake (list '(0 . "DIMENSION") '(100 . "AcDbEntity") '(100 . "AcDbDimension") (cons 10 pt) '(70 . 32) '(1 . "") '(100 . "AcDbAlignedDimension")
   (cons 13 pt1) (cons 14 pt2) '(100 . "AcDbRotatedDimension")
    )
)
```

##  垂直标注
```lisp
(entmake (list '(0 . "DIMENSION") '(100 . "AcDbEntity") '(100 . "AcDbDimension") (cons 10 pt) '(70 . 32) '(1 . "") '(100 . "AcDbAlignedDimension")
 (cons 13 pt1) (cons 14 pt2) '(50 . 1.5708) '(100 . "AcDbRotatedDimension")
 )
)
```

## 倾斜标注   
```lisp
(entmake (list '(0 . "DIMENSION") '(100 . "AcDbEntity") '(100 . "AcDbDimension") (cons 10 pt1) '(70 . 33) '(1 . "") '(100 . "AcDbAlignedDimension")
 (cons 13 pt2) (cons 14 pt3)
 )
)
```

##  entmake 生成普通块
```lisp
(defun emkblk (ss pt name / i)
  (entmake (list '(0 . "block") (cons 2 name) '(70 . 0) (cons 10 pt)))
  (repeat (setq i (sslength ss))    (entmake (cdr (entget (ssname ss (setq i (1- i))))))  )
  (entmake '((0 . "ENDBLK")))
  (command "\_.erase" ss "")
  (entmake (list '(0 . "INSERT") (cons 2 name) (cons 10 pt)))
)
```

## entmake 插入普通块
```lisp
  (entmake (list '(0 . "INSERT") (cons 2 name) (cons 10 pt)))
```

## entmake 生成无名块
```lisp
(defun emkunameblk (ss pt / i name)
  (entmake (list '(0 . "block") '(2 . "\*U") '(70 . 1) (cons 10 pt)))
  (repeat (setq i (sslength ss))    (entmake (cdr (entget (ssname ss (setq i (1- i))))))  )
  (setq name (entmake '((0 . "ENDBLK"))))
  (command "\_.erase" ss "")
  (entmake (list '(0 . "INSERT") (cons 2 name) (cons 10 pt)))
  name
)
```

## 将选择集做成属性块(选择集中单行文本作为属性)
```lisp
(defun emkattblk (ss pt name / ent i)
  (entmake (list '(0 . "block") (cons 2 name) '(70 . 2) (cons 10 pt)))
  (repeat (setq i (sslength ss))
    (setq ent (entget (ssname ss (setq i (1- i)))))
    (if (= (cdr (assoc 0 ent)) "TEXT")
      (entmake (list '(0 . "ATTDEF") (assoc 10 ent) (assoc 40 ent) (assoc 1 ent) (cons 3 (cdr (assoc 1 ent))) 
      (cons 2 (cdr (assoc 1 ent))) '(70 . 0)))
      (entmake (cdr ent))
    )
  )
  (entmake '((0 . "ENDBLK")))
)
```

## 生成图层
```lisp
(entmake (list '(0 . "LAYER") '(100 . "AcDbSymbolTableRecord") '(100 . "AcDbLayerTableRecord") '(70 . 0) '(6 . "Continuous")
 (cons 2 name)
 )
)
```

## 创建新线型
```lisp
 (entmake (list '(0 . "LTYPE") '(100 . "AcDbSymbolTableRecord") '(100 . "AcDbLinetypeTableRecord") (cons 2 "BERDIG 5-545") '  (3 . "Border \_**\_   \_\_**   \_**\_   \_\_**   \_\_\_\_") '(70 . 0) '(73 . 2) '(40 . 15.0) '(49 . 10.0) '(74 . 0) '
   (49 . -5.0) '(74 . 0)    )  )
```

## 引线
```lisp
(entmake (list '(0 . "LEADER") '(100 . "AcDbEntity") '(100 . "AcDbLeader")  (cons 10 pt) (cons 10 pt1)
 (cons 10 pt2)
 )
)
```

## 构造线
```lisp
(entmake (list '(0 . "XLINE") '(100 . "AcDbEntity") '(100 . "AcDbXline") (cons 10 pt) (cons 11 pt1)))
```

## 椭圆
```lisp
(entmake '((0 . "ELLIPSE") (100 . "AcDbEntity")(100 . "AcDbEllipse")(10 3969.6 4289.14 0.0)(11 -1828.47 0.0 0.0)
   (40 . 0.416093)
   (42 . 6.28319)
  )
)
```

## 点
```lisp
(entmake (list '(0 . "POINT") (cons 10 pt)))
```

## entmake 文字样式
```lisp
(entmake (list '(0 . "STYLE") '(100 . "AcDbSymbolTableRecord") '(100 . "AcDbTextStyleTableRecord") (cons 2 name) '(70 . 0)
  (cons 40 h) (cons 41 w) '(3 . "romans.shx") '(4 . "Hztxts.shx")
  )
)
```

## 建立第一级标注样式（来源于论坛）
```lisp
  (entmake (list '(0 . "DIMSTYLE") 
   '(100 . "AcDbSymbolTableRecord") 
   '(100 . "AcDbDimStyleTableRecord") 
   '(70 . 0) 
   (cons 340 (tblobjname "style" "Standard")) ; 文字样式名
   (cons 2 "普通螺纹")   ; 标注样式名
   '(3 . "M<>")        ; 标注前缀
   '(40 . 0.0)        ; 标注特征比例，缩放到布局
   '(41 . 2.5)        ; 箭头尺寸
   '(42 . 1.5)        ; 起点偏移量
   '(43 . 5.5)        ; 基线间距
   '(44 . 1.5)        ; 超出尺寸线
   '(47 . 0.000)        ; 上偏差
   '(48 . 0.000)        ; 下偏差
   '(71 . 0)        ; 公差无
   '(77 . 1)        ; 文字在尺寸线上方
   '(74 . 1)        ;
   '(140 . 3.0)        ; 文字高度
   '(141 . -2.5)        ; 圆心标记
   '(144 . 1.0)        ; 测量比例单位
   '(146 . 0.7)        ; 公差高度比例
   '(147 . 1.0)        ; 文字从尺寸线偏移
   '(172 . 2)        ; 尺寸界线间连线
   '(176 . 256)        ; 随层
   '(177 . 256)        ; 随层
   '(178 . 256)        ; 随层
   '(271 . 3)        ; 尺寸标注精度
   '(272 . 3)        ; 公差标注精度
   '(275 . 0)        ; 角度标注制式，十进制。
   '(288 . 1)        ; 手动放置尺寸
   )
)
```

## 点表生成样条曲线（感谢院长提供）
```lisp
(entmake (append
  (list '(0 . "SPLINE") '(100 . "AcDbEntity") '(100 . "AcDbSpline") '(71 . 3))
  (mapcar '(lambda (pt) (cons 11 pt))  ptlst)
 )
)
```
对于 mtext，控制文字的对齐格式可以使用以下组码：

`(71 . 1)` 左对齐-上对齐    这个是默认的对齐方式

`(71 . 4)` 左对齐-中央对齐

`(71 . 7)` 左对齐-下对齐

`(71 . 2)` 居中对齐-上对齐

`(71 . 5)` 居中对齐-中央对齐

`(71 . 8)` 居中对齐-下对齐

`(71 . 3)` 右对齐-上对齐

`(71 . 6)` 右对齐-中央对齐

`(71 . 9)` 右对齐-下对齐


## 替换文字编辑器
如果使用替换文字编辑器，则通过输入格式代码应用格式。 可为文字加下划线、删除线和创建堆叠文字。 用户可以修改颜色、字体和文字高度， 还可以修改文字字符间距或增加字符本身宽度。 要应用格式，请使用下表中列出的格式代码：

段落格式代码

| 格式代码     | 作用                                                               | 输入...                   |
| ------------ | ------------------------------------------------------------------ | ------------------------- |
| \0...\o      | 打开和关闭 下划线                                                  | Autodesk \OAutoCAD\o      |
| \L...\l      | 打开和关闭 下划线                                                  | Autodesk \LAutoCAD\l      |
| \~           | 插入不间断 空格                                                    | Autodesk AutoCAD\~LT      |
| \\           | 插入反斜杠                                                         | Autodesk \\AutoCAD        |
| \{...\}      | 插入左大括号和右大括号                                             | Autodesk \{AutoCAD\}      |
| \Cvalue;     | 修改为 指定的颜色                                                  | Autodesk \C2;AutoCAD      |
| \ File name; | 修改为 指定的字体文件                                              | Autodesk \Ftimes; AutoCAD |
| \Hvalue;     | 修改为 以图形单位表示的 指定文字高度                               | Autodesk \H2;AutoCAD      |
| \Hvaluex;    | 将文字高度修改为 当前样式文字高度的 数倍                           | Autodesk \H3x;AutoCAD     |
| \S...^...;   | 堆叠 \、# 或 ^ 符号后的文字                                        | 1.000\S+0.010^-0.000;     |
| \Tvalue;     | 调整字符间距，从 .75 到 4 倍                                       | \T2;Autodesk              |
| \Qangle;     | 修改倾斜角度                                                       | \Q20;Autodesk             |
| \Wvalue;     | 修改宽度比例生成宽字                                               | \W2;Autodesk              |
| \A           | 设置对齐方式值，有效值为：0、1、2 （底端对正、居中对正、顶端对正） | \A1;1\S1/2                |
| \P           | 结束段落                                                           | Autodesk\PAutoCAD         |

大括号最多可以嵌套八层。
也可以使用控制代码添加特殊的字符，例如公差和标注符号。 请参见  MTEXT。
样例：在替换文字编辑器中设置文字格式
本例说明了下图中的文字是如何创建的。

通过输入控制代码或 Unicode 字符串可以输入以下特殊字符或符号。 或在在位文字编辑器中，在展开的工具栏上单击“符号”。
注意 不支持在垂直文字中使用符号。

| Unicode  | 字符串和控制代码 | |
| -------- | ---------------- | ------------ |
| 控制代码 | Unicode 字符串   | 结果         |
| %%d      | \U+00B0          | 度符号 (°)   |
| %%p      | \U+00B1          | 公差符号 (±) |
| %%c      | \U+2205          | 直径符号 (∅) |

要插入以下文字符号，请在展开的“文字格式”工具栏上单击“符号”，或输入适当的 Unicode 字符串：

文字符号和 Unicode 字符串
| 名称| Unicode 字符串|
| -- | --|
| 几乎相等 | \U+2248|
| 角度 | \U+2220|
| 边界线 | \U+E100|
| 中心线 | \U+2104|
| 增量 | \U+0394|
| 电相位 | \U+0278|
| 流线 | \U+E101|
| 标识 | \U+2261|
| 初始长度 | \U+E200|
| 界碑线 | \U+E102|
| 不相等 | \U+2260|
| 欧姆 | \U+2126|
| 欧米加 | \U+03A9|
| 地界线 | \U+214A|
| 下标 2 | \U+2082|
| 平方 | \U+00B2|
| 立方 | \U+00B3|

以上文字符号适用于下列 TrueType (TTF) 字体和 SHX 字体：

Simplex RomanS Isocp Isocp2 Isocp3 Isoct Isoct2 Isoct3 Isocpeur（仅 TTF 字体） Isocpeur italic（仅 TTF 字体） Isocteur（仅 TTF 字体）
Isocteur italic（仅 TTF 字体）
```
