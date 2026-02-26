/* 
  @params {Function} fun 要执行的方法
  @params {Number?} wait 间隔时间
  @params {Boolean?} immediate 立即执行一次
  @return {Function} 防抖函数
      Function.status  true: 开启防抖（default）; false: 关闭防抖
*/
export function debounce(
  this: any,
  fun: (...args: any[]) => void,
  wait = 0,
  immediate = false
) {
  let timer: any, // 定时器
    prevTimestamp: number, // 触发时的时间戳
    ctx: any, // 上下文
    args: any // 参数
  const run = (delay: number) => {
    timer = setTimeout(() => {
      /* 此定时器为一轮循环第一次触发 */
      const now = Date.now()
      const interval = now - prevTimestamp // 上一次触发时的间隔
      // 在当前定时上下文时，prevTimestamp 可能被再次赋值
      if (interval < delay) {
        prevTimestamp = now
        run(wait - interval) // 本应该延迟时长 - 当前过去的时长 = 下一次延迟触发
        return
      }
      fun.apply(ctx, args)
      timer = null
    }, delay)
  }

  if (immediate) fun.apply(this, arguments)

  function temp(this: any) {
    if (!temp.status) return fun.apply(this, arguments)
    prevTimestamp = Date.now()

    if (timer) return // 延迟存在则不触发，只记录当前触发时间戳
    ctx = this
    args = arguments
    run(wait)
  }
  temp.status = true
  return temp
}
