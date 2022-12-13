// bem 规范
// block 代码块, element 元素, modifier 装饰, state 状态。
// b: k-button
// e: k-button__element
// m: k-button__element--disabled
// s: is-disabled  is-checked

// 使用
// :class=[bem.b('button')]

// k-button-box__element--disabled
const _bem = (
  prefixName: string,
  blockSuffix = "",
  element = "",
  modifier = ""
) => {
  if (blockSuffix) prefixName += `-${blockSuffix}`
  if (element) prefixName += `__${element}`
  if (modifier) prefixName += `--${modifier}`
  return prefixName
}

// BEM
const createBEM = (prefixName: string) => {
  const b = (blockSuffix = "") => _bem(prefixName, blockSuffix)
  const e = (element = "") => (element ? _bem(prefixName, "", element) : "")
  const m = (modifier = "") =>
    modifier ? _bem(prefixName, "", "", modifier) : ""

  const be = (blockSuffix = "", element = "") =>
    blockSuffix && element ? _bem(prefixName, blockSuffix, element) : ""
  const bm = (blockSuffix = "", modifier = "") =>
    blockSuffix && modifier ? _bem(prefixName, blockSuffix, "", modifier) : ""
  const em = (element = "", modifier = "") =>
    element && modifier ? _bem(prefixName, "", element, modifier) : ""
  const bem = (blockSuffix = "", element = "", modifier = "") =>
    blockSuffix && element && modifier
      ? _bem(prefixName, blockSuffix, element, modifier)
      : ""

  const is = (name: string, state: string | boolean) =>
    state ? `is-${name}` : ""
  return {
    b,
    e,
    m,
    be,
    bm,
    em,
    bem,
    is,
  }
}

// 前缀
export const createNamespacs = (name: string) => {
  const prefixName = `k-${name}` // 前缀
  return createBEM(prefixName)
}

/* 
const bem = createNamespacs("button")
console.log(bem.b("icon")) // k-button-icon
console.log(bem.e("element")) // k-button__element
console.log(bem.m("disabled")) // k-button--disabled
console.log(bem.be("icon", "element")) // k-button-icon__element
console.log(bem.bm("icon", "disabled")) // k-button-icon--disabled
console.log(bem.em("element", "disabled")) // k-button__element--disabled
console.log(bem.bem("icon", "element", "disabled")) 
// k-button-icon__element--disabled
console.log(bem.is("check", true))  // is--check
*/
