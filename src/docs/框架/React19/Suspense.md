# react Suspense
## 基本用法
```jsx
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>加载中...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}

export default MyComponent;
```

## 多个组件
```jsx
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>加载中...</div>}>
        <OtherComponent />
        <AnotherComponent />
      </Suspense>
    </div>
  );
}

export default MyComponent;
```

