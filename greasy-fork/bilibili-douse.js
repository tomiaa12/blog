// ==UserScript==
// @name         bilibili-哔哩哔哩关灯
// @namespace    http://tampermonkey.net/
// @description  bilibili-哔哩哔哩关灯添加到视频右键
// @version      0.4
// @author       tomiaa
// @match        *://www.bilibili.com/video/*

// ==/UserScript==
;(() => {
  console.clear()

  const style = document.createElement("style")
  style.innerHTML = `.video-sections-content-list{
    height: auto !important;
    max-height: 770px !important;
  }`
  document.documentElement.appendChild(style)
  const control = document.querySelector(".bpx-player-control-bottom-right")
  const oDiv = document.createElement("div")
  oDiv.classList.add("bpx-player-ctrl-btn")
  oDiv.classList.add("bpx-player-ctrl-quality")
  oDiv.innerHTML = `
    <div class="bpx-player-ctrl-quality-result">关灯模式</div>
  `
  const toggle = () => {
    const target = document.querySelector(
      "#bilibili-player > .bpx-docker.bpx-docker-major"
    )
    target.classList.toggle("bpx-state-light-off")
  }
  oDiv.addEventListener("click", toggle)
  control.appendChild(oDiv)

  document.addEventListener("mousedown", event => {
    if (event.button !== 2) return

    const oMneu = document.querySelector(".bpx-player-contextmenu")
    setTimeout(() => {
      const li = document.createElement("li")
      li.innerHTML = "关灯模式"
      li.addEventListener("click", toggle)
      oMneu.appendChild(li)
    }, 150)
  })
})()
