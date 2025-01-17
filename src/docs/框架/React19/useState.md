# useState | React

## 多次 set 调用的问题

```js
import { useState } from "react"

export default function MyApp() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1) // 相当于 0 + 1
    setCount(count + 1) // 相当于 0 + 1
  }

  return <button onClick={handleClick}>点了 {count} 次</button>
}
```

- 解决方案

```js
import { useState } from "react"

export default function MyApp() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count => count + 1)
    setCount(count => count + 1)
  }

  return <button onClick={handleClick}>点了 {count} 次</button>
}
```

## 随时间变化的 state

```js
import { useState } from "react"

export default function Counter() {
  const [number, setNumber] = useState(0)

  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber(number + 5)
          alert(number) // 0
        }}
      >
        +5
      </button>
    </>
  )
}
```

- 延迟后查看

```js
<button
  onClick={() => {
    setNumber(number + 5)
    setTimeout(() => {
      alert(number) // 还是 0
    }, 3000)
  }}
>
  +5
</button>
```

## 延迟更新

```js
import { useState } from "react"

export default function MyApp() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setTimeout(() => {
      setCount(count + 1)
      setCount(count + 1)
    }, 1000)
  }

  return <button onClick={handleClick}>点了 {count} 次</button>
}
```

## 更新对象

```js
import { useState } from "react"

export default function MyApp() {
  const [state, setState] = useState({ count: 0, name: "Alice" })

  function handleClick() {
    setState({ ...state, count: state.count + 1 })
  }

  return <button onClick={handleClick}>点了 {state.count} 次</button>
}
```

## 更新函数

```js
import { useState } from "react"

export default function MyApp() {
  const [state, setState] = useState({ count: 0, name: "Alice" })

  function handleClick() {
    setState(prevState => ({ ...prevState, count: prevState.count + 1 }))
  }

  return <button onClick={handleClick}>点了 {state.count} 次</button>
}
```

## 总结

- 设置`state`不会更改现有渲染中的变量，但会请求一次新的渲染。
- `React`会在事件处理函数执行完成之后处理`state`更新。这被称为批处理。
- 要在一个事件中多次更新某些`state`，你可以使用`setNumber(n => n + 1)`更新函数。
