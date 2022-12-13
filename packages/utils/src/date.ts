/* 时间相关方法 */

/**
 * 计算两个日期之间的相差天数
 * 输入: diffDays(new Date('2014-12-19'), new Date('2020-01-01'));
 * 输出: 1839
 */
export const diffDays = (date: any, otherDate: any): number =>
  Math.ceil(
    Math.abs(new Date(date).valueOf() - new Date(otherDate).valueOf()) /
      (1000 * 60 * 60 * 24)
  )

/**
 * 计算两个日期之间的相差月数
 * 输入: monthDiff(new Date('2020-01-01'), new Date('2021-01-01'));
 * 输出: 12
 */
export const monthDiff = (startDate: any, endDate: any): number =>
  Math.max(
    0,
    (new Date(endDate).getFullYear() - new Date(startDate).getFullYear()) * 12 -
      new Date(startDate).getMonth() +
      new Date(endDate).getMonth()
  )

/**
 * 将日期转换为 YYYY-MM-DD 格式
 * 输入: formatYmd(new Date())
 * 输出: 2020-05-06
 */
export const formatYmd = (date: any): string =>
  new Date(date).toISOString().slice(0, 10)

/**
 * 将秒转换为 hh:mm:ss 格式
 * 输入: formatSeconds(200) 单位为秒
 * 输出: 00:03:20
 */
export const formatSeconds = (s: number): string =>
  new Date(s * 1000).toISOString().substring(11, 19)

/**
 * 从日期中提取年、月、日、时、分、秒和毫秒
 * 输出: [year, month, day, hour, minute, second, millisecond]
 */
export const extract = (date: any): string[] =>
  new Date(date)
    .toISOString()
    .split(/[^0-9]/)
    .slice(0, -1)

/**
 * 获取日期的当前季度
 * 输出: 当前季度
 */
export const getQuarter = (d = Date.now()): number =>
  Math.ceil((new Date(d).getMonth() + 1) / 3)

/**
 * 获取某月的最后一天
 * 输入: '2022-10'
 * 输出: 2022 10 月最后一天的时间对象
 */
export const getLastDate = (d = Date.now()): Date =>
  new Date(new Date(d).getFullYear(), new Date(d).getMonth() + 1, 0)
