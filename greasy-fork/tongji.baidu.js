// ==UserScript==
// @name         百度网站统计 url 转中文 decode
// @description  url列表转decode编码
// @version      0.2
// @author       tomiaa
// @match        *://*tongji.baidu.com/*
// @namespace    http://tampermonkey.net/


// ==/UserScript==
(function(){
  const decode = () => {
    const fn = list => {
      list.forEach(item => {
        item.title = item.innerHTML = decodeURI(item.innerHTML)
      })
    }
    let list = document.querySelectorAll('a.ellipsis')
    fn(list);
    list = document.querySelectorAll('.access_page a')
    fn(list);
  }
  window.onload = decode;
  setTimeout(decode,2000)
  setTimeout(decode,4000)
  setTimeout(decode,6000)
})()