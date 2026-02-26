/* 
  @params {Function} fun 要执行的方法
  @params {Number?} wait 间隔时间
  @params {Boolean?} immediate 立即执行一次
  @return {Function} 节流函数
      Function.status  true: 开启节流（default）; false: 关闭节流
*/
export function throttle(
  fun: (...args: any[]) => void,
  wait = 0,
  immediate = false
) {
  let prev = Date.now() // 记录上一次执行时间
  if (immediate) temp() // 立即执行
  function temp(this: any) {
    const now = Date.now() // 当前执行时间
    let result
    if (now - prev >= wait || immediate || !temp.status) {
      // 超过间隔时间 || 第一次立即执行 || 取消节流
      result = fun.apply(this, arguments) // 处理 this 指向问题，及传入参数、event 事件对象，函数返回值
      prev = now
      if (immediate) immediate = false // 立即执行后设为 false
    }
    return result // 函数返回值
  }
  temp.status = true
  return temp
}
