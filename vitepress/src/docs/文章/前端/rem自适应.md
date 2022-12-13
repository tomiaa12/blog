# JavaScript rem.js（rem 自适应屏幕大小）

- 使用方法：设计稿得到尺寸除以 100 就是 rem 值

```js
;(function(){
  var html = document.documentElement, // 储存 html
​  // 横屏还是竖屏
​  resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize',
  dW = 750; // 设计稿宽
  function remCalc(){
​    var clientW = html.clientWidth; // 视口宽
​    if(!clientW) return;
​    if(clientW > dW){
​      // 如果视口宽大于 dW 设计稿宽 就等于 100px 字体
​      html.style.width = dW + 'px';
​      html.style.fontSize = '100px';
​      html.style.margin = '0 auto';
​    }else{
​      // 否则，当前视口 / 设计稿宽 * 100 字体大小
​      html.style.fontSize = clientW / dW * 100 + 'px';
​    }
  }
  if(!html.addEventListener) return;// 是否支持 addEventListener 方法
  // 绑定视口变化事件
  window.addEventListener(resizeEvent,remCalc,false);
  // DOMContentLoaded ---> 类似 window.onload ,但是只需要加载完成页面文档后就可以调用
  document.addEventListener('DOMContentLoaded',remCalc,false);
})()
```