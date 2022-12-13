// ==UserScript==
// @name         op.gg纯净版,查看英雄数据
// @namespace    http://tampermonkey.net/
// @description  op.gg去除垃圾广告,opgg
// @version      0.2
// @author       tomiaa
// @match      *://www.op.gg/
// @match      *://www.op.gg/champion/statistics
// @match      *://www.op.gg/champion/*/statistics/*
// ==/UserScript==
;(() => {
  const $ = id => document.querySelector(id);
  console.clear();
  // window.addEventListener('load',() => {
  //   console.clear();
  //   setTimeout(() => {
  //     console.clear();
  //   },2000)
  // })
  const config = {
    'https://www.op.gg/': { // 首页
      remove: [
        '.life-owner', // 搜索底下广告
        '.image-banner', // 顶部banner
        '.alert', // 提示
        '.l-footer',  // 底部
        '.community-best',    // 热门文章
        '.vm-footer',   // 底部弹出
        '#beacon-container', // 右下角聊天

      ],
      css: `
      .image-banner,
      .alert,
      .l-footer,
      .life-owner{
        display: block !important;
        opacity: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      `
    },
    'https://www.op.gg/champion/statistics':{ // 英雄列表
      remove: [
        '.alert', // 提示
        '.life-owner',  // 广告
        '.l-footer', // 底部
        '.vm-footer',   // 底部弹出
        '#beacon-container', // 右下角聊天
        '.vm-skin',     // 左右两侧
        '.vm-skin-left', // 左右 两侧
        '.image-banner',  // 顶部
      ],
      css: `
      .alert,
      .l-footer,
      .life-owner{
        display: block !important;
        opacity: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      `,
    },
    'https://www.op.gg/champion/*/statistics/*': { // 英雄数据
      remove: [
        '.life-owner',  //广告
        '.l-footer',  // 底部
        '.alert',   // 提示
        '#beacon-container', // 右下角聊天
        '.vm-footer',   // 底部弹出
        '.vm-skin',     // 左右两侧
        '.vm-skin-left', // 左右 两侧
        '.image-banner',  // 顶部
      ],
      css: `
      .alert,
      .l-footer,
      .vm-footer,
      .life-owner{
        display: block !important;
        opacity: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      `
    }
  }


  class BaiduClear {

    constructor(config){
      this.config = config;
      this.domain = '';
      this.query = null;
      this.init();
    }

    init(){
      const currentHref = location.href.split('?');
      this.domain = currentHref[0];
      this.query = currentHref[1];
      if(/\/\w+\/statistics\/\w+/.test(this.domain)){
        this.domain = 'https://www.op.gg/champion/*/statistics/*';
      }
      console.log(this.config?.[this.domain]);
      this.removeToHidden(this.config?.[this.domain]?.remove);
      this.addCss(this.config?.[this.domain]?.css);
      this.remove(this.config?.[this.domain]?.remove);
      this.config?.[this.domain]?.fn?.();
    }

    remove(arr = []){
      arr.map(item => $(item)).forEach(item => {
        item?.remove();
      })
    }

    removeToHidden(arr = []){
      if(!arr.length) return;
      this.addCss(arr.join(',') + `{    
        display: none !important;
        opacity: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }`)
    }

    addCss(css = ''){
      if(!css) return;
      let  style = document.createElement('style')
      style.innerHTML = css;
      document.documentElement.appendChild(style);
    }

  }
  new BaiduClear(config);
})();