// ==UserScript==
// @name         超星 mooc禁止自动暂停、自动下一集、自动两倍速、自动播放 mooc1.chaoxing.com
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  此脚本仅适用于 mooc1.chaoxing.com 这个网址
// @author       tomiaa
// @match        *://mooc1.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        none

// ==/UserScript==

(function () {
  // top.video = null;
  function init() {
    if (window !== top) return;
    const videos = {}
    const fn = () => {
      // debugger
      Array.from(top?.frames?.[0]?.document?.getElementsByTagName('iframe'))?.forEach((frame,index)=> {
        const video = frame.contentWindow.document.getElementById('video_html5_api')
        if(video) videos[index] = {video,isEnd: false}
        console.log(videos);
      })
      window.a =videos
      if (!Object.keys(videos).length) {
        setTimeout(fn, 2000)
        return;
      }
      const deep = () => {
        let flag = true;
        for(let k in videos){
          let video = videos[k].video
          if(videos[k].isEnd) {
            continue;
          }else{
            flag = false;
          }
          video.volume = 0
          video.autoplay = true
          video.defaultPlaybackRate = 2
          video.playbackRate = 2
          
          video.onpause = () => !video.ended && setTimeout(() => video.play() , 4);
          // video.onwaiting=()=>{
          //   console.log('onwaiting');
          //   top?.frames?.[0]?.frames?.[0]?.document.querySelector('.vjs-play-control').click();
          // }
          video.onended = () => {
            console.log('ended');
            videos[k].isEnd = true;
            video.onwaiting = null;
            video.onpause = null
            setTimeout(deep, 2000)
          }
          setInterval(() => {
            if(!video.paused) video.play();
          },4000)
          video.play();
        }
        if(flag){
          document.getElementsByClassName('orientationright ')?.[0]?.click?.()
          // location.reload()
          setTimeout(fn,4000)
        }
      }
      deep();
    }
    fn()
  }
  window.onload = init;

})()
