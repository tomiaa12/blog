/* 数组相关方法 */

/**
 * 无限层级数组转一维数组
 * 输入：flattenDeep([{ name: 'a', children: [{name: 'b'}] },{ name: 'c', }])
 * 输出: [{ name: 'a',}, {name: 'b'}, { name: 'c', }]
 */
export const flattenDeep = (arr: any, children = "children"): any[] => {
  arr = JSON.parse(JSON.stringify(arr))
  const temp: any[] = []
  function deep(arr: any[]) {
    arr.forEach(item => {
      item = JSON.parse(JSON.stringify(item))
      const child = item[children]
      if (child) {
        delete item[children]
        deep(child)
      }
      temp.push(item)
    })
  }
  deep(arr)
  return temp
}

/**
 * 将数组对象转为单个对象
 * 输入: arrObjToObject(
    [
      { id: '1', name: 'Alpha',},
      { id: '2', name: 'Bravo',},
    ],
    'id'
  );
 * 输出: {
    '1': { id: '1', name: 'Alpha', },
    '2': { id: '2', name: 'Bravo', },
  }
 */
export const arrObjToObject = <
  T extends Record<string, any>,
  K extends keyof T
>(
  arr: T[],
  key: K
): Record<string, T> => arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {})

/**
 * 字符串数组转数字数组
 * 输入: ['2', '3', '4']
 * 输出: [2, 3, 4]
 */
export const arrStrToNumbers = (arr: string[]): number[] => arr.map(Number)

/**
 * 计算数组对象的属性次数
 * 输入: countByArrObj(
    [
      { branch: 'audi', model: 'q8'},
      { branch: 'audi', model: 'rs7' },
      { branch: 'ford', model: 'mustang'},
      { branch: 'ford', model: 'explorer' },
      { branch: 'bmw', model: 'x7' },
    ],
    'branch'
  );
 * 输出: { 'audi': 2, 'ford': 2, 'bmw': 1 }
 */
export const countByArrObj = <
  T extends Record<string, string>,
  K extends keyof T
>(
  arr: T[],
  prop: K
): Record<string, number> =>
  arr.reduce(
    (prev, curr) => ((prev[curr[prop]] = ++prev[curr[prop]] || 1), prev),
    {} as Record<string, number>
  )

/**
 * 计算数组中某个值的出现次数
 * 输入: countSingleByArr(['a', 'b', 'a', 'c', 'a', 'b'], 'a')
 * 输出: 3
 */
export const countSingleByArr = <T>(arr: T[], val: T): number =>
  arr.filter(item => item === val).length

/**
 * 计算数组中某个值的出现次数
 * 输入: ['a', 'b', 'a', 'c', 'a', 'b']
 * 输出: { 'a': 3, 'b': 2, 'c': 1 }
 */
export const countSingleElementByArr = <T extends string | number>(
  arr: T[]
): Record<T, number> =>
  arr.reduce(
    (prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev),
    {} as Record<T, number>
  )

/**
 * 给定一个范围生成一个数字数组
 * 输入: range(5, 10);
 * 输出: [5, 6, 7, 8, 9, 10]
 */
export const createArrNumTheRange = (min: number, max: number): number[] =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i)

/**
 * 展平数组
 * 输入: ['cat', ['lion', 'tiger']]
 * 输出: ['cat', 'lion', 'tiger']
 */
export const flatArray = (arr: any[]): any[] =>
  arr.reduce(
    (a, b) => (Array.isArray(b) ? [...a, ...flatArray(b)] : [...a, b]),
    []
  )

/**
 * 按键对对象数组进行分组
 * groupArrOfObjectKey(
    [
      { branch: 'audi', model: 'q8', year: '2019' },
      { branch: 'audi', model: 'rs7', year: '2020' },
      { branch: 'ford', model: 'mustang', year: '2019' },
      { branch: 'ford', model: 'explorer', year: '2020' },
      { branch: 'bmw', model: 'x7', year: '2020' },
    ],
    'branch'
  );
 * 输出: {
    audi: [
      { branch: 'audi', model: 'q8', year: '2019' },
      { branch: 'audi', model: 'rs7', year: '2020' }
    ],
    bmw: [
      { branch: 'bmw', model: 'x7', year: '2020' }
    ],
    ford: [
      { branch: 'ford', model: 'mustang', year: '2019' },
      { branch: 'ford', model: 'explorer', year: '2020' }
    ],
  }
 */
export const groupArrOfObjectKey = <
  T extends Record<string, any>,
  K extends keyof T
>(
  arr: T[],
  key: K
): Record<string, T[]> =>
  arr.reduce(
    (acc, item) => ((acc[item[key]] = [...(acc[item[key]] || []), item]), acc),
    {} as Record<string, T[]>
  )

/**
 * 随机排列数组
 * 输入: shuffleAnArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
 * 输出: [9, 1, 10, 6, 8, 5, 2, 3, 7, 4]
 */
export const shuffleAnArray = <T>(arr: T[]): T[] =>
  arr
    .map(a => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value)

/**
 * 对象数组中提取键值
 * 输入: pluck(
    [
      { name: 'John', age: 20 },
      { name: 'Smith', age: 25 },
      { name: 'Peter', age: 30 },
    ],
    'name'
  )
  输出: ['John', 'Smith', 'Peter']
 */
export const pluckArrObjByKey = (objs: any[], property: string): any[] =>
  objs.map(obj => obj[property])
