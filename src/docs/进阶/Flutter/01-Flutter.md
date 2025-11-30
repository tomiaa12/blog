# Flutter 快速上手

## 样式
### 文本居中

```dart
body: Center(
  child: const Text(
    'Hello, World!',
    style: TextStyle(
      fontSize: 20,
      fontWeight: FontWeight.bold,
      color: Colors.amberAccent,
    ),
    textAlign: TextAlign.center,
  ),
),
```

### 背景颜色

```dart
body: Container(
  width: 200,
  height: 200,
  decoration: const BoxDecoration(color: Colors.red),
)
```

### 居中

```dart
body: Center()
```

### 宽高设置

```dart
body: Container(
  width: 200,
  height: 200,
)

<!-- or -->

body: SizedBox(
  width: 200,
  height: 200,
  <!-- 没有 decoration，不能设置背景色 -->
)
```

### 圆角 阴影

```dart
decoration: const BoxDecoration(
  color: Colors.red,
  borderRadius: BorderRadius.all(Radius.circular(10)),
  boxShadow: [BoxShadow(
    color: Color.from(alpha: 0.5, red: 0, green: 0, blue: 0),
      blurRadius: 10,
      offset: Offset(0, 10),
    ),
  ],
)

// 或者

body: ClipRRect( // 对子元素进行裁剪，使其变成圆角
  borderRadius: BorderRadius.circular(20),
  child: Container(
    width: 200,
    height: 200,
  )
)
```


## 布局

### 更新状态

```dart{2,4-8,19}
class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(child: Text(_counter.toString())),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
```


### 添加删除 widget

Flutter 中，widget 是一个不可变对象，一旦创建，就不能修改。如果需要更新 widget，只能通过重新创建新的 widget 实现。

```dart
class _MyHomePageState extends State<MyHomePage> {
  bool _toogle = true;
  Text get _dyWidget =>
      _toogle ? Text('Hello, World!') : Text('Hello, Flutter!');

  void _updateWidget() {
    setState(() {
      _toogle = !_toogle;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: _dyWidget),
      floatingActionButton: FloatingActionButton(
        onPressed: _updateWidget,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
```


### 自定义 widget

```dart
class MyWidget extends StatelessWidget {
  const MyWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      height: 200,
      decoration: const BoxDecoration(color: Colors.red),
      child: Center(child: Text('MyWidget 自定义的 widget')),
    );
  }
}

// 使用
// body: Center(child: MyWidget()),
```

### 滚动列表

```dart
body: ListView(
  children: [
    Text('Item 1'),
    Text('Item 2'),
    Text('Item 3'),
    Text('Item 3'),
    Text('Item 3'),
    Text('Item 3'),
    Text('Item 3'),
    Text('Item 7'),
    Text('Item 7'),
    Text('Item 7'),
    Text('Item 7'),
    Text('Item 7'),
    Text('Item 3', style: TextStyle(fontSize: 180, color: Colors.red)),
  ],
)
```

## 事件

### 点击事件

- ElevatedButton 按钮

```dart
body: ElevatedButton(
  onPressed: () {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(title: Text('Hello, World!')),
    );
  },
  child: Text('Show Dialog'),
)
```

- GestureDetector 手势识别器

```dart
body: GestureDetector(
  onTap: () {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(title: Text('Hello, World!')),
    );
  },
  onLongPress: () {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(title: Text('Long Press!')),
    );
  },
)

// 事件列表
// this.onTapDown,
// this.onTapUp,
// this.onTap,
// this.onTapMove,
// this.onTapCancel,
// this.onSecondaryTap,
// this.onSecondaryTapDown,
// this.onSecondaryTapUp,
// this.onSecondaryTapCancel,
// this.onTertiaryTapDown,
// this.onTertiaryTapUp,
// this.onTertiaryTapCancel,
// this.onDoubleTapDown,
// this.onDoubleTap,
// this.onDoubleTapCancel,
// this.onLongPressDown,
// this.onLongPressCancel,
// this.onLongPress,
// this.onLongPressStart,
// this.onLongPressMoveUpdate,
// this.onLongPressUp,
// this.onLongPressEnd,
// this.onSecondaryLongPressDown,
// this.onSecondaryLongPressCancel,
// this.onSecondaryLongPress,
// this.onSecondaryLongPressStart,
// this.onSecondaryLongPressMoveUpdate,
// this.onSecondaryLongPressUp,
// this.onSecondaryLongPressEnd,
// this.onTertiaryLongPressDown,
// this.onTertiaryLongPressCancel,
// this.onTertiaryLongPress,
// this.onTertiaryLongPressStart,
// this.onTertiaryLongPressMoveUpdate,
// this.onTertiaryLongPressUp,
// this.onTertiaryLongPressEnd,
// this.onVerticalDragDown,
// this.onVerticalDragStart,
// this.onVerticalDragUpdate,
// this.onVerticalDragEnd,
// this.onVerticalDragCancel,
// this.onHorizontalDragDown,
// this.onHorizontalDragStart,
// this.onHorizontalDragUpdate,
// this.onHorizontalDragEnd,
// this.onHorizontalDragCancel,
// this.onForcePressStart,
// this.onForcePressPeak,
// this.onForcePressUpdate,
// this.onForcePressEnd,
// this.onPanDown,
// this.onPanStart,
// this.onPanUpdate,
// this.onPanEnd,
// this.onPanCancel,
// this.onScaleStart,
// this.onScaleUpdate,
// this.onScaleEnd,
```




























