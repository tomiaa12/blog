# SSget 过滤技巧

## 文本

```lisp
(setq ss(ssget '((1 . "_#_")))) ;只选取含数字的文本
(setq ss(ssget '((1 . "#"))));只选取数字
(setq ss(ssget '((1 . "_[0-9]_"))));只选取含数字的文本
(setq ss(ssget '((0 . "TEXT") (1 . "~_[~`--9]_"))));只选取数字文本
(setq ss(ssget '((0 . "TEXT")(1 . "~_#_"))));只选择不是数字的文字
(setq ss(ssget '((0 . "TEXT")(-4 . "<NOT")(1 . "_[0-9]_")(-4 . "NOT>"))));只选择不是数字的文字
(setq ss(ssget '((0 . "TEXT") (1 . "~_[~02468]"))));只选取偶数
(setq ss(ssget '((1 . "_[a-A-z-Z]*"))));只选取字母
(setq ss(ssget '((0 . "*TEXT") (1 . "_:_"))));提取带英文:的字符
(setq ss(ssget '((0 . "_TEXT") (1 . "_：_"))));提取带中文：的字符
(setq ss(ssget '((1 . "图_"))));首字为图的文本(图层，图元号)
(setq ss(ssget '((1 . "*图"))));尾字为图的文本(层图，元号图)
(setq ss(ssget '((1 . "*图,图*"))));首尾字为图的文本(图层，元号图)
(setq ss(ssget '((0 . "text")(1 . "#,1#,2#,3#,4#,50"))));选取 1—50 的数字文本
(setq ss(ssget '((0 . "*text")(1 . "_(_,_)_,_（_,**）**"))));选取含括号的文本
```

## 对象

```lisp
(setq ss (ssget ":S" '((0 . "LINE"))));只选取一次直线（省约回车）
(setq ss (ssget "X" '((0 . "LINE"))));自动选取直线，包含冻结的直线
(setq ss (ssget "A" '((0 . "LINE"))));自动选取直线，不包含冻结的直线
(setq ss (ssget ":E:S" '((0 . "line"))));选取拾取框内的直线,选取不到就结束
(setq ss (ssget ":E" '((0 . "LINE"))));选取拾取框内的直线,选取不到就不结束，直到按右键
(setq ss (ssget ":N" '((0 . "LINE"))));只有通过窗口、窗交点拾取
(setq ss (ssget ":D" '((0 . "LINE"))));会累加选取的直线,同一条直线，选取两次个数就会乘以 2，3 次则 3.....
(setq ss (ssget ":L" '((0 . "LINE"))));提示有几个在锁定图上,选取没有的锁定的直线
(setq ss (ssget "P" '((0 . "LINE"))));上次的选择集
(setq ss (ssget '((0 . "line")(8 . "~0"))));选取 0 层以外的线
(setq ss (ssget '((0 . "line")(8 . "~_[a-A-z-Z]_"))));选取图层名不含字母以外的线

(setq ss(ssget '((0 . "DIMENSION")(40 . 0.0) (-4 . "<=") (42 . 0.5))));只选择线性、对齐标注尺寸小于或等于 0.5 的尺寸
(setq ss(ssget "X" '((0 . "DIMENSION") (1 . "_[~<>]_"))));选择包括非自动标注的所有

(ssget '((-4 . "/=") (62 . 3)));选取非绿色

(setq ss (ssget '((0 . "~insert")))) ;选取不含块的对象

(setq ss (ssget (list '(0 . "CIRCLE")(cons 40 RR))));按半径的大小选取圆
(setq ss (ssget '((0."CIRCLE") (-3 ("APPNAME")))));选取带扩展数据的实体(圆)
```

## 矩形内文字

```lisp
;得到矩形 p1 p2 点框内的文字,包含在框内的被选取 相交的不选取,屏幕外的选取不到,WP 点集
(setq ss(ssget "w" pt1 pt3 '((0 . "\*text"))))

;得到矩形 p1 p2 点框内的文字,包含在框内的及和框相交的被选取,屏幕外的选取不到,CP 点集
(setq ss(ssget "c" pt1 pt3 '((0 . "\*text"))))
```

## 线相交的线删除

（屏幕外的选取不到郁闷所以要用 zoom "ob"）

```lisp
(defun c:XX( / pt ptl ss)
(setq ptl nil)
(while (setq pt (getpoint))
(setq ptl (cons pt ptl))
)
(setq ss (ssget "f" ptl '((0 . "line"))))
(xx-E SS)
)
```

## 选取图层表

("CENTER" "DIM" "COOL" "CORE" -------N 个图层)内的线

```lisp
(setq la '("CENTER" "DIM" "COOL" "CORE")
ss (ssget (list '(0 . "LINE") (cons 8 (apply 'strcat (mapcar '(lambda (x) (strcat x ",")) la)))))
)
```

## 选取经过某点的实体

```lisp
(setq pt (getpoint))
(setq ss (ssget "C" pt pt))
```

## 选取不含数字的文本

```lisp
(setq ss (ssget '
  ((-4 . "<AND")
  (0 . "_TEXT")
  (-4 . "<NOT")
  (1 . "_[0-9]\*")
  (-4 . "NOT>")
  (-4 . "AND>")
)))
```

## 只选取不含字母的文本

```lisp
(setq ss (ssget '
((-4 . "<AND")
(0 . "_TEXT")
(-4 . "<NOT")
(1 . "_[a-A-z-Z]\*")
(-4 . "NOT>")
(-4 . "AND>")
)
)
)
```

## "图层 1" "图层 2""图层 n 中的文本,图层 1 为层名

```lisp
(SETQ SS (ssget "x"
(list
'(0 . "TEXT")
(cons 8 "图层[1-n]")
)
)
)
```

## 选取 0 层以外的线

```lisp
(setq ss
(ssget '
((-4 . "<AND")
(0 . "line")
(-4 . "<NOT")
(8 . "0")
(-4 . "NOT>")
(-4 . "AND>")
)
)
)
```

## 按颜色号选取对象

```lisp
(setq col (KX-Int 7 "" "颜色号" col 1))
(setq SS (ssget
(list
'(-4 . "<OR")
(cons 62 COL)
'(-4 . "OR>")
)
)
)
```

## 选取含 KX 的文本

```lisp
(setq XT (strcat "_" "KX" "_"));KX 为文字内容
(ssget (list
'(0 . "text")
(cons 1 XT)
)
)
```

## 判断选取某个区域有没有直线

```lisp
(setq SS (ssget "c"
(polar '(0 0) (_ 0.25 pi) 0.5);坐标点
(polar '(0 0) (_ 1.25 pi) 0.5);坐标点
'((0 . "LINE"))
)
)
```

## 选取颜色不是随层的圆、直线

```lisp
(setq SS (ssget "X"
'((0 . "CIRCLE,LINE")
(-4 . "/=")(62 . 256);-4 62"面不可以加 AND OR
)
)
)
```

## 选取颜色 1 和 2 的对象（OR)的用法

```lisp
(setq ss (ssget '((-4 . "<or")
(62 . 2)
(62 . 1)
(-4 . "or>")
)
)
)
```

## 选取半径大于 20 小于 100 的圆

```lisp
(setq ss (ssget '
((-4 . "<and")
(0 . "circle")
(-4 . ">")(40 . 20);大于 20
(-4 . "<")(40 . 100);小于 100
(-4 . "and>")
)
)
)
```

## 只选取"文字（包括多行文字）、尺寸、带属性的块

```lisp
(setq ss (SSGET '
((-4 . "&lt;OR")
(0 . "_TEXT,DIMENSION")
(-4 . "&lt;AND")
(0 . "INSERT")
(66 . 1)
(-4 . "AND&gt;")
(-4 . "OR&gt;")
)
)
)
```

## 屏幕外的窗口模式选取

```lisp
(setq rec_p1 '(0 0)) ;窗口左下角点
(setq rec_p2 '(1000 1000)) ;窗口右上角点
(setq filter_list
(list
'(0 . "insert")
'(-4 . "<and")
'(-4 . ">,>,_") (cons 10 rec_p1)
'(-4 . "<,<,\*") (cons 10 rec_p2)
'(-4 . "and>")
)
)
(ssget "x" filter_list)
```

## 一次产生 n 个不同选取集

```lisp
(if (setq ss (ssget)) (setq ss1 (ssget "\_p" '((0 . "\*TEXT")))));从选择集中分解出文字
```

## 空回车得出不同结果的选取集

```lisp
(if (setq ss (ssget))
(setq ss (ssget "\_p" flt))
(setq ss (ssget "\_x" flt))
)
```

## 坐标范围选择

类似(ssget "c" p1 p2 filter),但本函数在屏幕外的也可选择
测试 `(tt (getpoint) (getpoint) '((0 . "insert")))`

```lisp

(defun tt (p1 p2 filter / minX minY maxX maxY)
(setq minX (min (car p1) (car p2))
minY (min (cadr p1) (cadr p2))
maxX (max (car p1) (car p2))
maxY (max (cadr p1) (cadr p2))
)
(if filter
(ssget "x"
(append (list '(-4 . "<and")
'(-4 . ">=,>=,_")
(list 10 minX minY 0)
'(-4 . "<=,<=,_")
(list 10 maxX maxY 0)
)
(append filter '((-4 . "and>")))
)
)
(ssget "X"
(list '(-4 . "<and")
'(-4 . ">=,>=,_")
(list 10 minX minY 0)
'(-4 . "<=,<=,_")
(list 10 maxX maxY 0)
'(-4 . "and>")
)
)
)
)
```
