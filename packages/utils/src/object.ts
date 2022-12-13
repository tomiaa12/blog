/* 对象相关方法 */

/**
 * 检查多个对象是否相等
 * 输入: objsIsEqual({ foo: 'bar' }, { foo: 'bar' }); // true
 * 输入: objsIsEqual({ foo: 'bar' }, { bar: 'foo' }); // false
 */
export const objsIsEqual = (...objects: any[]): boolean =>
  objects.every(obj => JSON.stringify(obj) === JSON.stringify(objects[0]))

/**
 * 根据字符串路径获取对象的值
 * 输入: getValue('a.b', { a: { b: 'Hello World' } })
 * 输出: 'Hello World'
 */
export const getValue = (path: string, obj: any): any =>
  path.split(".").reduce((acc: any, c) => acc && acc[c], obj)

/**
 * 根据字符串路径设置对象的值
 * 输入: setValue('a.b', 'Hello World' , { a: { b: '' } })
 * 输出: { a: { b: 'Hello World' } }
 */
export const setValue = (path: string, value: any, target: any): any => {
  const arr = path.split("."),
    origin = target

  for (let i = 0; i < arr.length; i++) {
    if (arr.length - 1 === i) {
      target[arr[i]] = value
      return origin
    }
    target = target[arr[i]]
    if (!target) return false
  }
}

/**
 * 去除对象特定的键
 * 输入: omitObjByKeys({ a: '1', b: '2', c: '3' }, ['a', 'b'])
 * 输出: { c: '3' }
 */
export const omitObjByKeys = (
  obj: any,
  keys: string[]
): { [prop: string]: any } =>
  Object.keys(obj)
    .filter(k => !keys.includes(k))
    .reduce((res, k: any) => Object.assign(res, { [k]: obj[k] }), {})

/**
 * 获取对象特定的键
 * 输入: pickObjByKeys({ a: '1', b: '2', c: '3' }, ['a', 'b'])
 * 输出: { a: '1', b: '2' }
 */
export const pickObjByKeys = (
  obj: any,
  keys: string[]
): { [prop: string]: any } =>
  Object.keys(obj)
    .filter(k => keys.includes(k))
    .reduce((res, k) => Object.assign(res, { [k]: obj[k] }), {})

/**
 * 删除对象中为 null 和 undefined 的键值
 * 输入: removeNullUndefinedByObj({ foo:null,bar:undefined,fuzz:42 })
 * 输出: { fuzz: 42 }
 */
export const removeNullUndefinedByObj = (obj: any) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null))
