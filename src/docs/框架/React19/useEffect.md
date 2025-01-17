# useEffect | React Hooks

- `useEffect`是一个副作用钩子，用于在函数组件中执行副作用操作
- 副作用操作包括异步请求、DOM 操作、订阅等
- `useEffect`接收两个参数：一个是回调函数，一个是依赖项数组
- 依赖项数组用于控制副作用操作的触发时机
- 如果依赖项数组为空，则只在组件挂载和卸载时触发
- 如果依赖项数组不为空，则在依赖项发生变化时触发

```js
useEffect(() => {
  // 这里的代码会在每次渲染后运行
});

useEffect(() => {
  // 这里的代码只会在组件挂载（首次出现）时运行
}, []);

useEffect(() => {
  // 这里的代码不但会在组件挂载时运行，而且当 a 或 b 的值自上次渲染后发生变化后也会运行
}, [a, b]);
```

## 基本用法

```jsx
import React, { useEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `你点击了${count}次`;
  }, [count]);

  return (
    <div>
      <p>你点击了{count}次</p>
      <button onClick={() => setCount(count + 1)}>点击</button>
    </div>
  );
}

export default App;
```

## 异步请求

```jsx
import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('https://api.github.com/users/tomiaa12')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      <img src={data.avatar_url} alt="avatar" />
      <p>{data.login}</p>
    </div>
  );
}

export default App;
```

## 清除副作用

第一个参数，返回一个函数时会在组件销毁时调用

```jsx
import React, { useEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count => count + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    function handleScroll(e) {
      console.log(window.scrollX, window.scrollY);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <p>{count}</p>
    </div>
  );
}


export default App;
``